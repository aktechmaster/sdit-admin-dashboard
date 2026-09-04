// ==========================================
// MODUL KELAS & WALI KELAS SDIT AL-KAUTSAR
// ==========================================

let kelasRawData = [];
let guruDropdownList = [];

// Inisialisasi Utama Modul Kelas
async function initKelasModule() {
  const mainContent = document.getElementById("mainContent");
  const pageTitle = document.getElementById("pageTitle");

  if (pageTitle) pageTitle.textContent = "Kelas & Wali Kelas";

  mainContent.innerHTML = `
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h5 class="m-0 font-weight-bold">Daftar Kelas & Walas</h5>
        <button class="btn btn-primary font-weight-bold" onclick="openModalAddKelas()">
          <i class="fas fa-plus mr-1"></i> Tambah Kelas
        </button>
      </div>
    </div>
    
    <div class="card card-outline card-primary">
      <div class="card-body table-responsive p-0">
        <table class="table table-hover text-nowrap" id="tableKelas">
          <thead class="bg-light">
            <tr>
              <th style="width: 60px;">No</th>
              <th>Nama Kelas</th>
              <th>Wali Kelas (Walas)</th>
              <th>Wakil Wali Kelas (Wawalas)</th>
              <th style="width: 150px;" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tbodyKelas">
            <tr><td colspan="5" class="text-center py-4">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Kelas -->
    <div class="modal fade" id="kelasModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="kelasModalTitle">Tambah Data Kelas</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="kelasForm">
            <div class="modal-body">
              <input type="hidden" id="kelasRowIndex" value="">
              
              <div class="form-group">
                <label for="inputKelas">Nama Kelas <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="inputKelas" placeholder="Contoh: 1 An-Najm 1" required>
              </div>

              <!-- Dropdown Walas -->
              <div class="form-group">
                <label for="selectWalas">Wali Kelas (Walas)</label>
                <select class="form-control select-guru" id="selectWalas">
                  <option value="">-- Pilih Wali Kelas --</option>
                </select>
              </div>

              <!-- Dropdown Wawalas -->
              <div class="form-group">
                <label for="selectWawalas">Wakil Wali Kelas (Wawalas)</label>
                <select class="form-control select-guru" id="selectWawalas">
                  <option value="">-- Pilih Wakil Wali Kelas (Boleh Kosong) --</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSaveKelas">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Event listener form submit
  document.getElementById("kelasForm").addEventListener("submit", handleSaveKelas);

  // Ambil opsi data guru dan load tabel kelas
  await loadGuruOptions();
  await loadKelasData();
}

// 1. Ambil list Nama Guru dari tab "Biodata" untuk isi dropdown
async function loadGuruOptions() {
  try {
    const response = await fetch(`${API_URL}?action=getBiodataData`);
    const result = await response.json();
    if (result.status === "sukses" && result.data) {
      guruDropdownList = result.data.map(g => g.nama).filter(Boolean);
      populateGuruDropdowns();
    }
  } catch (err) {
    console.error("Gagal memuat list guru:", err);
  }
}

// Isi dropdown select-guru
function populateGuruDropdowns() {
  let optionsHtml = '<option value="">-- Pilih Guru --</option>';
  guruDropdownList.forEach(nama => {
    optionsHtml += `<option value="${nama}">${nama}</option>`;
  });
  document.querySelectorAll(".select-guru").forEach(select => {
    select.innerHTML = optionsHtml;
  });
}

// 2. Load Data Kelas dari backend GAS
async function loadKelasData() {
  const tbody = document.getElementById("tbodyKelas");
  tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Memuat data...</td></tr>';

  try {
    const response = await fetch(`${API_URL}?action=getKelasData`);
    const result = await response.json();

    if (result.status === "sukses") {
      kelasRawData = result.data || [];
      renderTableKelas(kelasRawData);
    } else {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger py-4">Gagal memuat data: ${result.pesan}</td></tr>`;
    }
  } catch (err) {
    console.error("Error Load Kelas Data:", err);
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger py-4">Terjadi kesalahan koneksi!</td></tr>';
  }
}

// Render isi tabel
function renderTableKelas(data) {
  const tbody = document.getElementById("tbodyKelas");
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Belum ada data kelas.</td></tr>';
    return;
  }

  let html = "";
  data.forEach((row, idx) => {
    html += `
      <tr>
        <td>${idx + 1}</td>
        <td class="font-weight-bold">${row.kelas || '-'}</td>
        <td>${row.walas || '-'}</td>
        <td>${row.wawalas || '-'}</td>
        <td class="text-center">
          <button class="btn btn-xs btn-warning font-weight-bold mr-1" onclick="openModalEditKelas(${row.rowIndex})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-xs btn-danger font-weight-bold" onclick="confirmDeleteKelas(${row.rowIndex}, '${row.kelas}')">
            <i class="fas fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

// Buka Modal Tambah
function openModalAddKelas() {
  document.getElementById("kelasModalTitle").textContent = "Tambah Data Kelas";
  document.getElementById("kelasRowIndex").value = "";
  document.getElementById("inputKelas").value = "";
  document.getElementById("selectWalas").value = "";
  document.getElementById("selectWawalas").value = "";
  $("#kelasModal").modal("show");
}

// Buka Modal Edit
function openModalEditKelas(rowIndex) {
  const item = kelasRawData.find(k => k.rowIndex === rowIndex);
  if (!item) return;

  document.getElementById("kelasModalTitle").textContent = "Edit Data Kelas";
  document.getElementById("kelasRowIndex").value = item.rowIndex;
  document.getElementById("inputKelas").value = item.kelas || "";
  document.getElementById("selectWalas").value = item.walas || "";
  document.getElementById("selectWawalas").value = item.wawalas || "";
  $("#kelasModal").modal("show");
}

// Simpan Data Kelas (Tambah/Edit)
async function handleSaveKelas(e) {
  e.preventDefault();
  const btnSave = document.getElementById("btnSaveKelas");
  btnSave.disabled = true;
  btnSave.textContent = "Menyimpan...";

  const rowIndex = document.getElementById("kelasRowIndex").value;
  const isEdit = rowIndex !== "";

  const payload = {
    action: isEdit ? "updateKelas" : "addKelas",
    rowIndex: rowIndex,
    kelas: document.getElementById("inputKelas").value.trim(),
    walas: document.getElementById("selectWalas").value.trim(),
    wawalas: document.getElementById("selectWawalas").value.trim()
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "sukses") {
      $("#kelasModal").modal("hide");
      alert(result.pesan);
      await loadKelasData();
    } else {
      alert("Gagal menyimpan: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Save Kelas:", err);
    alert("Terjadi kesalahan koneksi saat menyimpan!");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Simpan";
  }
}

// Konfirmasi Hapus Kelas
async function confirmDeleteKelas(rowIndex, namaKelas) {
  if (!confirm(`Apakah Anda yakin ingin menghapus kelas "${namaKelas}"?`)) return;

  try {
    const payload = {
      action: "deleteKelas",
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
      await loadKelasData();
    } else {
      alert("Gagal menghapus: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Delete Kelas:", err);
    alert("Terjadi kesalahan koneksi saat menghapus!");
  }
}
