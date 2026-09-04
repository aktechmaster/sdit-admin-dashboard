// ==========================================
// MODUL MASTER DATA SISWA SDIT AL-KAUTSAR
// ==========================================

let siswaRawData = [];

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
              <th style="width: 50px;">No</th>
              <th>Nama Siswa</th>
              <th>Kelas / NIPD</th>
              <th>L/P</th>
              <th>NISN</th>
              <th>NIK</th>
              <th>Tempat, Tgl Lahir</th>
              <th>Agama</th>
              <th style="width: 140px;" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tbodySiswa">
            <tr><td colspan="9" class="text-center py-4">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Lengkap Siswa (Modal Large) -->
    <div class="modal fade" id="siswaModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="siswaModalTitle">Form Data Siswa</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="siswaForm">
            <div class="modal-body">
              <input type="hidden" id="siswaRowIndex" value="">
              
              <div class="row">
                <!-- Kolom Kiri -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="inputID">ID / No</label>
                    <input type="text" class="form-control" id="inputID" placeholder="Otomatis / Isi manual">
                  </div>
                  <div class="form-group">
                    <label for="inputNamaSiswa">Nama Lengkap <span class="text-danger">*</span></label>
                    <input type="text" class="form-control" id="inputNamaSiswa" required placeholder="Nama lengkap siswa">
                  </div>
                  <div class="form-group">
                    <label for="inputNIPD">Kelas / NIPD</label>
                    <input type="text" class="form-control" id="inputNIPD" placeholder="Contoh: 1 An-Najm 1">
                  </div>
                  <div class="form-group">
                    <label for="selectJKSiswa">Jenis Kelamin</label>
                    <select class="form-control" id="selectJKSiswa">
                      <option value="L">Laki-Laki (L)</option>
                      <option value="P">Perempuan (P)</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="inputNISN">NISN</label>
                    <input type="text" class="form-control" id="inputNISN" placeholder="Nomor NISN">
                  </div>
                  <div class="form-group">
                    <label for="inputNIK">NIK</label>
                    <input type="text" class="form-control" id="inputNIK" placeholder="Nomor Induk Kependudukan">
                  </div>
                  <div class="form-group">
                    <label for="selectAgama">Agama</label>
                    <select class="form-control" id="selectAgama">
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                      <option value="Khonghucu">Khonghucu</option>
                    </select>
                  </div>
                </div>

                <!-- Kolom Kanan -->
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="inputTempatLahir">Tempat Lahir</label>
                    <input type="text" class="form-control" id="inputTempatLahir" placeholder="Kota / Kabupaten">
                  </div>
                  <div class="form-group">
                    <label for="inputTanggalLahir">Tanggal Lahir</label>
                    <input type="date" class="form-control" id="inputTanggalLahir">
                  </div>
                  <div class="form-group">
                    <label for="inputAlamat">Alamat</label>
                    <input type="text" class="form-control" id="inputAlamat" placeholder="Jalan / Perumahan">
                  </div>
                  <div class="row">
                    <div class="col-6 form-group">
                      <label for="inputRT">RT</label>
                      <input type="text" class="form-control" id="inputRT" placeholder="001">
                    </div>
                    <div class="col-6 form-group">
                      <label for="inputRW">RW</label>
                      <input type="text" class="form-control" id="inputRW" placeholder="001">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="inputDusun">Dusun</label>
                    <input type="text" class="form-control" id="inputDusun">
                  </div>
                  <div class="form-group">
                    <label for="inputKelurahan">Kelurahan</label>
                    <input type="text" class="form-control" id="inputKelurahan">
                  </div>
                  <div class="form-group">
                    <label for="inputKecamatan">Kecamatan</label>
                    <input type="text" class="form-control" id="inputKecamatan">
                  </div>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSaveSiswa">Simpan Data Siswa</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.getElementById("siswaForm").addEventListener("submit", handleSaveSiswa);
  await loadSiswaData();
}

// Load Data Siswa dari Backend GAS
async function loadSiswaData() {
  const tbody = document.getElementById("tbodySiswa");
  tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4">Memuat data siswa...</td></tr>';

  try {
    const response = await fetch(`${API_URL}?action=getSiswaData`);
    const result = await response.json();

    if (result.status === "sukses") {
      siswaRawData = result.data || [];
      renderTableSiswa(siswaRawData);
    } else {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center text-danger py-4">Gagal memuat: ${result.pesan}</td></tr>`;
    }
  } catch (err) {
    console.error("Error Load Siswa:", err);
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger py-4">Terjadi kesalahan koneksi!</td></tr>';
  }
}

// Render Tabel
function renderTableSiswa(data) {
  const tbody = document.getElementById("tbodySiswa");
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center py-4">Belum ada data siswa.</td></tr>';
    return;
  }

  let html = "";
  data.forEach((row, idx) => {
    const ttl = (row.tempatLahir !== '-' || row.tanggalLahir !== '-') 
      ? `${row.tempatLahir}, ${row.tanggalLahir}` 
      : '-';

    html += `
      <tr>
        <td>${idx + 1}</td>
        <td class="font-weight-bold">${row.nama}</td>
        <td>${row.nipd}</td>
        <td>${row.jk}</td>
        <td>${row.nisn}</td>
        <td>${row.nik}</td>
        <td>${ttl}</td>
        <td>${row.agama}</td>
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

// Open Modal Add
function openModalAddSiswa() {
  document.getElementById("siswaModalTitle").textContent = "Tambah Data Siswa";
  document.getElementById("siswaRowIndex").value = "";
  
  document.getElementById("inputID").value = "";
  document.getElementById("inputNamaSiswa").value = "";
  document.getElementById("inputNIPD").value = "";
  document.getElementById("selectJKSiswa").value = "L";
  document.getElementById("inputNISN").value = "";
  document.getElementById("inputTempatLahir").value = "";
  document.getElementById("inputTanggalLahir").value = "";
  document.getElementById("inputNIK").value = "";
  document.getElementById("selectAgama").value = "Islam";
  document.getElementById("inputAlamat").value = "";
  document.getElementById("inputRT").value = "";
  document.getElementById("inputRW").value = "";
  document.getElementById("inputDusun").value = "";
  document.getElementById("inputKelurahan").value = "";
  document.getElementById("inputKecamatan").value = "";

  $("#siswaModal").modal("show");
}

// Open Modal Edit
function openModalEditSiswa(rowIndex) {
  const item = siswaRawData.find(s => s.rowIndex === rowIndex);
  if (!item) return;

  document.getElementById("siswaModalTitle").textContent = "Edit Data Siswa";
  document.getElementById("siswaRowIndex").value = item.rowIndex;

  document.getElementById("inputID").value = item.id !== '-' ? item.id : '';
  document.getElementById("inputNamaSiswa").value = item.nama !== '-' ? item.nama : '';
  document.getElementById("inputNIPD").value = item.nipd !== '-' ? item.nipd : '';
  document.getElementById("selectJKSiswa").value = item.jk === 'P' ? 'P' : 'L';
  document.getElementById("inputNISN").value = item.nisn !== '-' ? item.nisn : '';
  document.getElementById("inputTempatLahir").value = item.tempatLahir !== '-' ? item.tempatLahir : '';
  document.getElementById("inputTanggalLahir").value = item.tanggalLahir !== '-' ? item.tanggalLahir : '';
  document.getElementById("inputNIK").value = item.nik !== '-' ? item.nik : '';
  document.getElementById("selectAgama").value = item.agama !== '-' ? item.agama : 'Islam';
  document.getElementById("inputAlamat").value = item.alamat !== '-' ? item.alamat : '';
  document.getElementById("inputRT").value = item.rt !== '-' ? item.rt : '';
  document.getElementById("inputRW").value = item.rw !== '-' ? item.rw : '';
  document.getElementById("inputDusun").value = item.dusun !== '-' ? item.dusun : '';
  document.getElementById("inputKelurahan").value = item.kelurahan !== '-' ? item.kelurahan : '';
  document.getElementById("inputKecamatan").value = item.kecamatan !== '-' ? item.kecamatan : '';

  $("#siswaModal").modal("show");
}

// Simpan Data
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
    id: document.getElementById("inputID").value.trim(),
    nama: document.getElementById("inputNamaSiswa").value.trim(),
    nipd: document.getElementById("inputNIPD").value.trim(),
    jk: document.getElementById("selectJKSiswa").value,
    nisn: document.getElementById("inputNISN").value.trim(),
    tempatLahir: document.getElementById("inputTempatLahir").value.trim(),
    tanggalLahir: document.getElementById("inputTanggalLahir").value,
    nik: document.getElementById("inputNIK").value.trim(),
    agama: document.getElementById("selectAgama").value,
    alamat: document.getElementById("inputAlamat").value.trim(),
    rt: document.getElementById("inputRT").value.trim(),
    rw: document.getElementById("inputRW").value.trim(),
    dusun: document.getElementById("inputDusun").value.trim(),
    kelurahan: document.getElementById("inputKelurahan").value.trim(),
    kecamatan: document.getElementById("inputKecamatan").value.trim()
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
    btnSave.textContent = "Simpan Data Siswa";
  }
}

// Hapus Data
async function confirmDeleteSiswa(rowIndex, namaSiswa) {
  if (!confirm(`Apakah Anda yakin ingin menghapus data siswa "${namaSiswa}"?`)) return;

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
