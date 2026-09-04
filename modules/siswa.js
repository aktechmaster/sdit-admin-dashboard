// ==========================================
// MODUL MASTER DATA SISWA SDIT AL-KAUTSAR
// ==========================================

let siswaRawData = [];
let kelasDropdownList = [];

// Inisialisasi Utama Modul Siswa
async function initSiswaModule() {
  const mainContent = document.getElementById("mainContent");
  const pageTitle = document.getElementById("pageTitle");

  if (pageTitle) pageTitle.textContent = "Master Data Siswa";

  mainContent.innerHTML = `
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h5 class="m-0 font-weight-bold">Daftar Seluruh Siswa</h5>
        <button class="btn btn-primary font-weight-bold" onclick="openModalAddSiswa()">
          <i class="fas fa-plus mr-1"></i> Tambah Siswa
        </button>
      </div>
    </div>
    
    <div class="card card-outline card-primary">
      <div class="card-body table-responsive p-0">
        <table class="table table-hover text-nowrap" id="tableSiswa">
          <thead class="bg-light">
            <tr>
              <th style="width: 60px;">No</th>
              <th>NISN</th>
              <th>Nama Siswa</th>
              <th>Kelas</th>
              <th>L/P</th>
              <th style="width: 150px;" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tbodySiswa">
            <tr><td colspan="6" class="text-center py-4">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Siswa -->
    <div class="modal fade" id="siswaModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="siswaModalTitle">Tambah Data Siswa</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="siswaForm">
            <div class="modal-body">
              <input type="hidden" id="siswaRowIndex" value="">
              
              <div class="form-group">
                <label for="inputNISN">NISN</label>
                <input type="text" class="form-control" id="inputNISN" placeholder="Contoh: 0012345678">
              </div>

              <div class="form-group">
                <label for="inputNamaSiswa">Nama Siswa <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="inputNamaSiswa" placeholder="Nama lengkap siswa" required>
              </div>

              <div class="form-group">
                <label for="selectKelasSiswa">Kelas</label>
                <select class="form-control" id="selectKelasSiswa">
                  <option value="">-- Pilih Kelas --</option>
                </select>
              </div>

              <div class="form-group">
                <label for="selectJKSiswa">Jenis Kelamin</label>
                <select class="form-control" id="selectJKSiswa">
                  <option value="L">Laki-Laki (L)</option>
                  <option value="P">Perempuan (P)</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSaveSiswa">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById("siswaForm").addEventListener("submit", handleSaveSiswa);

  await loadKelasForSiswaDropdown();
  await loadSiswaData();
}

// Load List Kelas dari backend Master untuk dropdown kelas
async function loadKelasForSiswaDropdown() {
  try {
    const response = await fetch(`${API_URL}?action=getKelasData`);
    const result = await response.json();
    if (result.status === "sukses" && result.data) {
      const select = document.getElementById("selectKelasSiswa");
      let options = '<option value="">-- Pilih Kelas --</option>';
      result.data.forEach(k => {
        options += `<option value="${k.kelas}">${k.kelas}</option>`;
      });
      select.innerHTML = options;
    }
  } catch (err) {
    console.error("Gagal memuat list kelas:", err);
  }
}

// Load Data Siswa
async function loadSiswaData() {
  const tbody = document.getElementById("tbodySiswa");
  tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Memuat data...</td></tr>';

  try {
    const response = await fetch(`${API_URL}?action=getSiswaData`);
    const result = await response.json();

    if (result.status === "sukses") {
      siswaRawData = result.data || [];
      renderTableSiswa(siswaRawData);
    } else {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Gagal memuat data: ${result.pesan}</td></tr>`;
    }
  } catch (err) {
    console.error("Error Load Siswa Data:", err);
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">Terjadi kesalahan koneksi!</td></tr>';
  }
}

// Render Tabel Siswa
function renderTableSiswa(data) {
  const tbody = document.getElementById("tbodySiswa");
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4">Belum ada data siswa.</td></tr>';
    return;
  }

  let html = "";
  data.forEach((row, idx) => {
    html += `
      <tr>
        <td>${idx + 1}</td>
        <td>${row.nisn || '-'}</td>
        <td class="font-weight-bold">${row.nama || '-'}</td>
        <td>${row.kelas || '-'}</td>
        <td>${row.jk || '-'}</td>
        <td class="text-center">
          <button class="btn btn-xs btn-warning font-weight-bold mr-1" onclick="openModalEditSiswa(${row.rowIndex})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-xs btn-danger font-weight-bold" onclick="confirmDeleteSiswa(${row.rowIndex}, '${row.nama}')">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function openModalAddSiswa() {
  document.getElementById("siswaModalTitle").textContent = "Tambah Data Siswa";
  document.getElementById("siswaRowIndex").value = "";
  document.getElementById("inputNISN").value = "";
  document.getElementById("inputNamaSiswa").value = "";
  document.getElementById("selectKelasSiswa").value = "";
  document.getElementById("selectJKSiswa").value = "L";
  $("#siswaModal").modal("show");
}

function openModalEditSiswa(rowIndex) {
  const item = siswaRawData.find(s => s.rowIndex === rowIndex);
  if (!item) return;

  document.getElementById("siswaModalTitle").textContent = "Edit Data Siswa";
  document.getElementById("siswaRowIndex").value = item.rowIndex;
  document.getElementById("inputNISN").value = item.nisn || "";
  document.getElementById("inputNamaSiswa").value = item.nama || "";
  document.getElementById("selectKelasSiswa").value = item.kelas || "";
  document.getElementById("selectJKSiswa").value = item.jk || "L";
  $("#siswaModal").modal("show");
}

async function handleSaveSiswa(e) {
  e.preventDefault();
  const btnSave = document.getElementById("btnSaveSiswa");
  btnSave.disabled = true;
  btnSave.textContent = "Menyimpan...";

  const rowIndex = document.getElementById("siswaRowIndex").value;
  const isEdit = rowIndex !== "";

  const payload = {
    action: isEdit ? "updateSiswa" : "addSiswa",
    rowIndex: rowIndex,
    nisn: document.getElementById("inputNISN").value.trim(),
    nama: document.getElementById("inputNamaSiswa").value.trim(),
    kelas: document.getElementById("selectKelasSiswa").value.trim(),
    jk: document.getElementById("selectJKSiswa").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "sukses") {
      $("#siswaModal").modal("hide");
      alert(result.pesan);
      await loadSiswaData();
    } else {
      alert("Gagal menyimpan: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Save Siswa:", err);
    alert("Terjadi kesalahan koneksi saat menyimpan!");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Simpan";
  }
}

async function confirmDeleteSiswa(rowIndex, namaSiswa) {
  if (!confirm(`Apakah Anda yakin ingin menghapus siswa "${namaSiswa}"?`)) return;

  try {
    const payload = {
      action: "deleteSiswa",
      rowIndex: rowIndex
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "sukses") {
      alert(result.pesan);
      await loadSiswaData();
    } else {
      alert("Gagal menghapus: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Delete Siswa:", err);
    alert("Terjadi kesalahan koneksi saat menghapus!");
  }
}
