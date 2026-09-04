// ==========================================
// MODUL MASTER DATA SISWA (21 KOLOM LENGKAP SPREADSHEET)
// ==========================================

let siswaRawData = [];
let filteredSiswaData = [];
let currentPage = 1;
let pageSize = 20;

// Inisialisasi Utama
async function initSiswaModule() {
  const mainContent = document.getElementById("mainContent");
  const pageTitle = document.getElementById("pageTitle");

  if (pageTitle) pageTitle.textContent = "Master Data Siswa";

  mainContent.innerHTML = `
    <!-- Top Action Bar -->
    <div class="row mb-3 align-items-center">
      <div class="col-md-6 mb-2 mb-md-0">
        <h5 class="m-0 font-weight-bold">Daftar Seluruh Siswa</h5>
      </div>
      <div class="col-md-6 text-md-right">
        <div class="btn-group mr-1">
          <button class="btn btn-success font-weight-bold" onclick="exportSiswaExcel()">
            <i class="fas fa-file-excel mr-1"></i> Ekspor Excel
          </button>
          <button class="btn btn-outline-success font-weight-bold" onclick="triggerImportSiswaExcel()">
            <i class="fas fa-file-upload mr-1"></i> Impor Excel
          </button>
          <input type="file" id="siswaExcelFileInput" accept=".xlsx, .xls" style="display:none;" onchange="handleImportSiswaExcel(event)">
        </div>
        <button class="btn btn-primary font-weight-bold" onclick="openModalAddSiswa()">
          <i class="fas fa-plus mr-1"></i> Tambah Siswa
        </button>
      </div>
    </div>

    <!-- Filter & Table Card -->
    <div class="card card-outline card-primary">
      <div class="card-header bg-white py-3">
        <div class="row align-items-center">
          <!-- Limit Tampilan -->
          <div class="col-md-4 d-flex align-items-center mb-2 mb-md-0">
            <span class="mr-2 text-muted">Tampilkan</span>
            <select class="form-control form-control-sm w-auto mr-2" id="pageSizeSelect" onchange="changePageSize(this.value)">
              <option value="20" selected>20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="all">Semua</option>
            </select>
            <span class="text-muted">data</span>
          </div>

          <!-- Pencarian -->
          <div class="col-md-8">
            <input type="text" class="form-control form-control-sm" id="searchSiswaInput" placeholder="Cari Nama Siswa, NISN, NIK, Kelas, Orang Tua..." oninput="handleSearchSiswa()">
          </div>
        </div>
      </div>

      <!-- Table Container dengan Freeze Header -->
      <div class="card-body table-responsive-custom p-0">
        <table class="table table-hover table-freeze-header text-nowrap" id="tableSiswa">
          <thead class="bg-light">
            <tr>
              <th style="width: 40px;">No</th>
              <th>Nama Siswa</th>
              <th>NIPD (Kelas)</th>
              <th>L/P</th>
              <th>NISN</th>
              <th>Tempat Lahir</th>
              <th>Tgl Lahir</th>
              <th>NIK</th>
              <th>Agama</th>
              <th>Alamat</th>
              <th>RT</th>
              <th>RW</th>
              <th>Dusun</th>
              <th>Kelurahan</th>
              <th>Kecamatan</th>
              <!-- Kolom Tambahan Orang Tua (P - U) -->
              <th>Nama Ayah</th>
              <th>Pekerjaan Ayah</th>
              <th>Nama Ibu</th>
              <th>Pekerjaan Ibu</th>
              <th>Nomor WA Ayah</th>
              <th>Nomor WA Ibu</th>
              <th style="width: 100px;" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tbodySiswa">
            <tr><td colspan="22" class="text-center py-4">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="card-footer bg-white d-flex flex-column flex-md-row justify-content-between align-items-center py-2">
        <div class="text-muted small mb-2 mb-md-0" id="paginationInfo">
          Menampilkan 0 data
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-sm m-0" id="paginationControls"></ul>
        </nav>
      </div>
    </div>

    <!-- Modal Form Lengkap Siswa -->
    <div class="modal fade" id="siswaModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-xl modal-dialog-centered" role="document">
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
                <!-- Kolom 1: Identitas Siswa -->
                <div class="col-md-4">
                  <h6 class="font-weight-bold text-primary mb-3"><i class="fas fa-user mr-1"></i> Data Identitas</h6>
                  <div class="form-group">
                    <label for="inputID">ID / No</label>
                    <input type="text" class="form-control" id="inputID" placeholder="Otomatis / Manual">
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
                    <label for="inputNIK">NIK Siswa</label>
                    <input type="text" class="form-control" id="inputNIK" placeholder="Nomor NIK Siswa">
                  </div>
                  <div class="form-group">
                    <label for="selectAgama">Agama</label>
                    <select class="form-control" id="selectAgama">
                      <option value="Islam">Islam</option>
                      <option value="Kristen">Kristen</option>
                      <option value="Katolik">Katolik</option>
                      <option value="Hindu">Hindu</option>
                      <option value="Buddha">Buddha</option>
                    </select>
                  </div>
                </div>

                <!-- Kolom 2: Alamat Siswa -->
                <div class="col-md-4">
                  <h6 class="font-weight-bold text-primary mb-3"><i class="fas fa-map-marker-alt mr-1"></i> Tempat & Alamat</h6>
                  <div class="form-group">
                    <label for="inputTempatLahir">Tempat Lahir</label>
                    <input type="text" class="form-control" id="inputTempatLahir">
                  </div>
                  <div class="form-group">
                    <label for="inputTanggalLahir">Tanggal Lahir</label>
                    <input type="date" class="form-control" id="inputTanggalLahir">
                  </div>
                  <div class="form-group">
                    <label for="inputAlamat">Alamat Jalan</label>
                    <input type="text" class="form-control" id="inputAlamat">
                  </div>
                  <div class="row">
                    <div class="col-6 form-group">
                      <label for="inputRT">RT</label>
                      <input type="text" class="form-control" id="inputRT">
                    </div>
                    <div class="col-6 form-group">
                      <label for="inputRW">RW</label>
                      <input type="text" class="form-control" id="inputRW">
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

                <!-- Kolom 3: Data Orang Tua (Kolom P - U) -->
                <div class="col-md-4">
                  <h6 class="font-weight-bold text-primary mb-3"><i class="fas fa-users mr-1"></i> Data Orang Tua</h6>
                  <div class="form-group">
                    <label for="inputNamaAyah">Nama Ayah</label>
                    <input type="text" class="form-control" id="inputNamaAyah" placeholder="Nama Ayah Kandung">
                  </div>
                  <div class="form-group">
                    <label for="inputPekerjaanAyah">Pekerjaan Ayah</label>
                    <input type="text" class="form-control" id="inputPekerjaanAyah" placeholder="Pekerjaan Ayah">
                  </div>
                  <div class="form-group">
                    <label for="inputWaAyah">Nomor WA Ayah</label>
                    <input type="text" class="form-control" id="inputWaAyah" placeholder="Contoh: 081234567890">
                  </div>
                  <hr>
                  <div class="form-group">
                    <label for="inputNamaIbu">Nama Ibu</label>
                    <input type="text" class="form-control" id="inputNamaIbu" placeholder="Nama Ibu Kandung">
                  </div>
                  <div class="form-group">
                    <label for="inputPekerjaanIbu">Pekerjaan Ibu</label>
                    <input type="text" class="form-control" id="inputPekerjaanIbu" placeholder="Pekerjaan Ibu">
                  </div>
                  <div class="form-group">
                    <label for="inputWaIbu">Nomor WA Ibu</label>
                    <input type="text" class="form-control" id="inputWaIbu" placeholder="Contoh: 081234567890">
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

// Load Data
async function loadSiswaData() {
  const tbody = document.getElementById("tbodySiswa");
  tbody.innerHTML = '<tr><td colspan="22" class="text-center py-4">Memuat data siswa...</td></tr>';

  try {
    const response = await fetch(`${API_URL}?action=getSiswaData`);
    const result = await response.json();

    if (result.status === "sukses") {
      siswaRawData = result.data || [];
      filteredSiswaData = [...siswaRawData];
      currentPage = 1;
      renderTableWithPagination();
    } else {
      tbody.innerHTML = `<tr><td colspan="22" class="text-center text-danger py-4">Gagal memuat: ${result.pesan}</td></tr>`;
    }
  } catch (err) {
    console.error("Error Load Siswa:", err);
    tbody.innerHTML = '<tr><td colspan="22" class="text-center text-danger py-4">Terjadi kesalahan koneksi!</td></tr>';
  }
}

// Search Handler
function handleSearchSiswa() {
  const query = document.getElementById("searchSiswaInput").value.toLowerCase().trim();

  if (!query) {
    filteredSiswaData = [...siswaRawData];
  } else {
    filteredSiswaData = siswaRawData.filter(item => {
      const nama = String(item.nama || "").toLowerCase();
      const nipd = String(item.nipd || "").toLowerCase();
      const nisn = String(item.nisn || "").toLowerCase();
      const nik = String(item.nik || "").toLowerCase();
      const alamat = String(item.alamat || "").toLowerCase();
      const kelurahan = String(item.kelurahan || "").toLowerCase();
      const kecamatan = String(item.kecamatan || "").toLowerCase();
      const namaAyah = String(item.namaAyah || "").toLowerCase();
      const namaIbu = String(item.namaIbu || "").toLowerCase();

      return nama.includes(query) ||
             nipd.includes(query) ||
             nisn.includes(query) ||
             nik.includes(query) ||
             alamat.includes(query) ||
             kelurahan.includes(query) ||
             kecamatan.includes(query) ||
             namaAyah.includes(query) ||
             namaIbu.includes(query);
    });
  }

  currentPage = 1;
  renderTableWithPagination();
}

// Change Page Size Limit
function changePageSize(val) {
  pageSize = val === "all" ? filteredSiswaData.length : parseInt(val);
  currentPage = 1;
  renderTableWithPagination();
}

// Render Table
function renderTableWithPagination() {
  const tbody = document.getElementById("tbodySiswa");
  const totalItems = filteredSiswaData.length;

  if (totalItems === 0) {
    tbody.innerHTML = '<tr><td colspan="22" class="text-center py-4">Data tidak ditemukan.</td></tr>';
    document.getElementById("paginationInfo").textContent = "Menampilkan 0 data";
    document.getElementById("paginationControls").innerHTML = "";
    return;
  }

  const effPageSize = pageSize === "all" ? totalItems : pageSize;
  const totalPages = Math.ceil(totalItems / effPageSize);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * effPageSize;
  const endIndex = Math.min(startIndex + effPageSize, totalItems);
  const pageData = filteredSiswaData.slice(startIndex, endIndex);

  // Render Rows (21 Kolom Data + 1 Aksi)
  let html = "";
  pageData.forEach((row, idx) => {
    html += `
      <tr>
        <td>${startIndex + idx + 1}</td>
        <td class="font-weight-bold">${row.nama || '-'}</td>
        <td>${row.nipd || '-'}</td>
        <td>${row.jk || '-'}</td>
        <td>${row.nisn || '-'}</td>
        <td>${row.tempatLahir || '-'}</td>
        <td>${row.tanggalLahir || '-'}</td>
        <td>${row.nik || '-'}</td>
        <td>${row.agama || '-'}</td>
        <td>${row.alamat || '-'}</td>
        <td>${row.rt || '-'}</td>
        <td>${row.rw || '-'}</td>
        <td>${row.dusun || '-'}</td>
        <td>${row.kelurahan || '-'}</td>
        <td>${row.kecamatan || '-'}</td>
        <!-- Data Orang Tua P - U -->
        <td>${row.namaAyah || '-'}</td>
        <td>${row.pekerjaanAyah || '-'}</td>
        <td>${row.namaIbu || '-'}</td>
        <td>${row.pekerjaanIbu || '-'}</td>
        <td>${row.waAyah || '-'}</td>
        <td>${row.waIbu || '-'}</td>
        <td class="text-center">
          <button class="btn btn-xs btn-warning font-weight-bold mr-1" onclick="openModalEditSiswa(${row.rowIndex})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-xs btn-danger font-weight-bold" onclick="confirmDeleteSiswa(${row.rowIndex}, '${row.nama}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;

  document.getElementById("paginationInfo").textContent = `Menampilkan ${startIndex + 1} - ${endIndex} dari ${totalItems} data`;
  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  const controls = document.getElementById("paginationControls");
  if (totalPages <= 1) {
    controls.innerHTML = "";
    return;
  }

  let html = `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${currentPage - 1}); return false;">Sebelumnya</a>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
      html += `
        <li class="page-item ${currentPage === i ? 'active' : ''}">
          <a class="page-link" href="#" onclick="goToPage(${i}); return false;">${i}</a>
        </li>
      `;
    } else if (i === currentPage - 3 || i === currentPage + 3) {
      html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
  }

  html += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="goToPage(${currentPage + 1}); return false;">Selanjutnya</a>
    </li>
  `;

  controls.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderTableWithPagination();
}

// ==========================================
// EKSPOR & IMPOR EXCEL SISWA (21 KOLOM)
// ==========================================

function exportSiswaExcel() {
  if (!siswaRawData || siswaRawData.length === 0) {
    alert("Tidak ada data siswa untuk diekspor!");
    return;
  }

  const exportData = siswaRawData.map((s, idx) => ({
    "No": idx + 1,
    "ID": s.id || "",
    "Nama Siswa": s.nama || "",
    "NIPD (Kelas)": s.nipd || "",
    "L/P": s.jk || "",
    "NISN": s.nisn || "",
    "Tempat Lahir": s.tempatLahir || "",
    "Tanggal Lahir": s.tanggalLahir || "",
    "NIK": s.nik || "",
    "Agama": s.agama || "",
    "Alamat": s.alamat || "",
    "RT": s.rt || "",
    "RW": s.rw || "",
    "Dusun": s.dusun || "",
    "Kelurahan": s.kelurahan || "",
    "Kecamatan": s.kecamatan || "",
    "Nama Ayah": s.namaAyah || "",
    "Pekerjaan Ayah": s.pekerjaanAyah || "",
    "Nama Ibu": s.namaIbu || "",
    "Pekerjaan Ibu": s.pekerjaanIbu || "",
    "Nomor WA Ayah": s.waAyah || "",
    "Nomor WA Ibu": s.waIbu || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Siswa");
  XLSX.writeFile(workbook, `Master_Data_Siswa_SDIT_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function triggerImportSiswaExcel() {
  document.getElementById("siswaExcelFileInput").click();
}

async function handleImportSiswaExcel(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!jsonData || jsonData.length === 0) {
        alert("File Excel kosong atau format tidak sesuai!");
        return;
      }

      // Pemetaan kolom Excel ke objek siswa lengkap
      const siswaList = jsonData.map(row => ({
        id: String(row["ID"] || row["id"] || row["No"] || "").trim(),
        nama: String(row["Nama Siswa"] || row["Nama"] || row["nama"] || "").trim(),
        nipd: String(row["NIPD (Kelas)"] || row["NIPD"] || row["Kelas"] || row["nipd"] || "").trim(),
        jk: String(row["L/P"] || row["JK"] || row["Jenis Kelamin"] || row["jk"] || "L").trim(),
        nisn: String(row["NISN"] || row["nisn"] || "").trim(),
        tempatLahir: String(row["Tempat Lahir"] || row["tempatLahir"] || "").trim(),
        tanggalLahir: String(row["Tanggal Lahir"] || row["Tgl Lahir"] || row["tanggalLahir"] || "").trim(),
        nik: String(row["NIK"] || row["nik"] || "").trim(),
        agama: String(row["Agama"] || row["agama"] || "Islam").trim(),
        alamat: String(row["Alamat"] || row["alamat"] || "").trim(),
        rt: String(row["RT"] || row["rt"] || "").trim(),
        rw: String(row["RW"] || row["rw"] || "").trim(),
        dusun: String(row["Dusun"] || row["dusun"] || "").trim(),
        kelurahan: String(row["Kelurahan"] || row["kelurahan"] || "").trim(),
        kecamatan: String(row["Kecamatan"] || row["kecamatan"] || "").trim(),
        namaAyah: String(row["Nama Ayah"] || row["namaAyah"] || "").trim(),
        pekerjaanAyah: String(row["Pekerjaan Ayah"] || row["pekerjaanAyah"] || "").trim(),
        namaIbu: String(row["Nama Ibu"] || row["namaIbu"] || "").trim(),
        pekerjaanIbu: String(row["Pekerjaan Ibu"] || row["pekerjaanIbu"] || "").trim(),
        waAyah: String(row["Nomor WA Ayah"] || row["No WA Ayah"] || row["waAyah"] || "").trim(),
        waIbu: String(row["Nomor WA Ibu"] || row["No WA Ibu"] || row["waIbu"] || "").trim()
      })).filter(s => s.nama !== "");

      if (siswaList.length === 0) {
        alert("Tidak ada data siswa valid yang ditemukan di file Excel!");
        return;
      }

      if (!confirm(`Ditemukan ${siswaList.length} data siswa valid. Lanjutkan proses impor?`)) {
        return;
      }

      const payload = {
        action: "bulkAddSiswa",
        siswaList: siswaList
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.status === "sukses") {
        alert(result.pesan || "Berhasil mengimpor data siswa!");
        await loadSiswaData();
      } else {
        alert("Gagal mengimpor: " + result.pesan);
      }
    } catch (err) {
      console.error("Error Import Excel Siswa:", err);
      alert("Terjadi kesalahan saat memproses file Excel!");
    } finally {
      event.target.value = "";
    }
  };

  reader.readAsArrayBuffer(file);
}

// Modal Handlers
function openModalAddSiswa() {
  document.getElementById("siswaModalTitle").textContent = "Tambah Data Siswa";
  document.getElementById("siswaRowIndex").value = "";
  document.getElementById("siswaForm").reset();
  $("#siswaModal").modal("show");
}

function openModalEditSiswa(rowIndex) {
  const item = siswaRawData.find(s => s.rowIndex === rowIndex);
  if (!item) return;

  document.getElementById("siswaModalTitle").textContent = "Edit Data Siswa";
  document.getElementById("siswaRowIndex").value = item.rowIndex;
  document.getElementById("inputID").value = item.id && item.id !== '-' ? item.id : '';
  document.getElementById("inputNamaSiswa").value = item.nama && item.nama !== '-' ? item.nama : '';
  document.getElementById("inputNIPD").value = item.nipd && item.nipd !== '-' ? item.nipd : '';
  document.getElementById("selectJKSiswa").value = item.jk === 'P' ? 'P' : 'L';
  document.getElementById("inputNISN").value = item.nisn && item.nisn !== '-' ? item.nisn : '';
  document.getElementById("inputTempatLahir").value = item.tempatLahir && item.tempatLahir !== '-' ? item.tempatLahir : '';
  document.getElementById("inputTanggalLahir").value = item.tanggalLahir && item.tanggalLahir !== '-' ? item.tanggalLahir : '';
  document.getElementById("inputNIK").value = item.nik && item.nik !== '-' ? item.nik : '';
  document.getElementById("selectAgama").value = item.agama && item.agama !== '-' ? item.agama : 'Islam';
  document.getElementById("inputAlamat").value = item.alamat && item.alamat !== '-' ? item.alamat : '';
  document.getElementById("inputRT").value = item.rt && item.rt !== '-' ? item.rt : '';
  document.getElementById("inputRW").value = item.rw && item.rw !== '-' ? item.rw : '';
  document.getElementById("inputDusun").value = item.dusun && item.dusun !== '-' ? item.dusun : '';
  document.getElementById("inputKelurahan").value = item.kelurahan && item.kelurahan !== '-' ? item.kelurahan : '';
  document.getElementById("inputKecamatan").value = item.kecamatan && item.kecamatan !== '-' ? item.kecamatan : '';
  // Populate Data Orang Tua (P - U)
  document.getElementById("inputNamaAyah").value = item.namaAyah && item.namaAyah !== '-' ? item.namaAyah : '';
  document.getElementById("inputPekerjaanAyah").value = item.pekerjaanAyah && item.pekerjaanAyah !== '-' ? item.pekerjaanAyah : '';
  document.getElementById("inputNamaIbu").value = item.namaIbu && item.namaIbu !== '-' ? item.namaIbu : '';
  document.getElementById("inputPekerjaanIbu").value = item.pekerjaanIbu && item.pekerjaanIbu !== '-' ? item.pekerjaanIbu : '';
  document.getElementById("inputWaAyah").value = item.waAyah && item.waAyah !== '-' ? item.waAyah : '';
  document.getElementById("inputWaIbu").value = item.waIbu && item.waIbu !== '-' ? item.waIbu : '';

  $("#siswaModal").modal("show");
}

// Save Handler
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
    kecamatan: document.getElementById("inputKecamatan").value.trim(),
    // Payload Data Orang Tua (P - U)
    namaAyah: document.getElementById("inputNamaAyah").value.trim(),
    pekerjaanAyah: document.getElementById("inputPekerjaanAyah").value.trim(),
    namaIbu: document.getElementById("inputNamaIbu").value.trim(),
    pekerjaanIbu: document.getElementById("inputPekerjaanIbu").value.trim(),
    waAyah: document.getElementById("inputWaAyah").value.trim(),
    waIbu: document.getElementById("inputWaIbu").value.trim()
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
    alert("Terjadi kesalahan koneksi!");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Simpan Data Siswa";
  }
}

// Delete Handler
async function confirmDeleteSiswa(rowIndex, namaSiswa) {
  if (!confirm(`Apakah Anda yakin ingin menghapus data siswa "${namaSiswa}"?`)) return;

  try {
    const payload = { action: "deleteSiswa", rowIndex: rowIndex };
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
    alert("Terjadi kesalahan koneksi!");
  }
}
