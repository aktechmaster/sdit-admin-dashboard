// ==========================================
// MODUL MASTER DATA SISWA (15 KOLOM LENGKAP SPREADSHEET)
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
        <button class="btn btn-outline-success font-weight-bold mr-1" onclick="exportSiswaToCSV()">
          <i class="fas fa-file-excel mr-1"></i> Ekspor CSV
        </button>
        <button class="btn btn-outline-info font-weight-bold mr-1" onclick="openModalImportSiswa()">
          <i class="fas fa-file-import mr-1"></i> Impor CSV
        </button>
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
            <input type="text" class="form-control form-control-sm" id="searchSiswaInput" placeholder="Cari Nama, NISN, NIK, Kelas, Alamat, Kelurahan..." onkeyup="handleSearchSiswa()">
          </div>
        </div>
      </div>

      <!-- Table Container dengan Horizontal Scroll -->
      <div class="card-body table-responsive p-0">
        <table class="table table-hover text-nowrap" id="tableSiswa">
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
              <th style="width: 100px;" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tbodySiswa">
            <tr><td colspan="16" class="text-center py-4">Memuat data...</td></tr>
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
                    <input type="text" class="form-control" id="inputTempatLahir">
                  </div>
                  <div class="form-group">
                    <label for="inputTanggalLahir">Tanggal Lahir</label>
                    <input type="date" class="form-control" id="inputTanggalLahir">
                  </div>
                  <div class="form-group">
                    <label for="inputAlamat">Alamat</label>
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

    <!-- Modal Impor CSV -->
    <div class="modal fade" id="importModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title"><i class="fas fa-file-import mr-2"></i>Impor Data Siswa (CSV)</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p class="small text-muted mb-2">
              Pilih file CSV dengan urutan kolom: <br>
              <code>ID, Nama, NIPD, JK, NISN, Tempat Lahir, Tanggal Lahir, NIK, Agama, Alamat, RT, RW, Dusun, Kelurahan, Kecamatan</code>
            </p>
            <div class="form-group">
              <label for="csvFileInput">File CSV</label>
              <input type="file" class="form-control-file" id="csvFileInput" accept=".csv">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
            <button type="button" class="btn btn-info" id="btnProcessImport" onclick="processCSVImport()">Proses Impor</button>
          </div>
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
  tbody.innerHTML = '<tr><td colspan="16" class="text-center py-4">Memuat data siswa...</td></tr>';

  try {
    const response = await fetch(`${API_URL}?action=getSiswaData`);
    const result = await response.json();

    if (result.status === "sukses") {
      siswaRawData = result.data || [];
      filteredSiswaData = [...siswaRawData];
      currentPage = 1;
      renderTableWithPagination();
    } else {
      tbody.innerHTML = `<tr><td colspan="16" class="text-center text-danger py-4">Gagal memuat: ${result.pesan}</td></tr>`;
    }
  } catch (err) {
    console.error("Error Load Siswa:", err);
    tbody.innerHTML = '<tr><td colspan="16" class="text-center text-danger py-4">Terjadi kesalahan koneksi!</td></tr>';
  }
}

// Search Handler
function handleSearchSiswa() {
  const query = document.getElementById("searchSiswaInput").value.toLowerCase().trim();
  filteredSiswaData = siswaRawData.filter(item => {
    return (
      (item.nama && item.nama.toLowerCase().includes(query)) ||
      (item.nipd && item.nipd.toLowerCase().includes(query)) ||
      (item.nisn && item.nisn.toLowerCase().includes(query)) ||
      (item.nik && item.nik.toLowerCase().includes(query)) ||
      (item.alamat && item.alamat.toLowerCase().includes(query)) ||
      (item.kelurahan && item.kelurahan.toLowerCase().includes(query)) ||
      (item.kecamatan && item.kecamatan.toLowerCase().includes(query))
    );
  });
  currentPage = 1;
  renderTableWithPagination();
}

// Change Page Size Limit
function changePageSize(val) {
  pageSize = val === "all" ? filteredSiswaData.length : parseInt(val);
  currentPage = 1;
  renderTableWithPagination();
}

// Render Table + Pagination Logic
function renderTableWithPagination() {
  const tbody = document.getElementById("tbodySiswa");
  const totalItems = filteredSiswaData.length;

  if (totalItems === 0) {
    tbody.innerHTML = '<tr><td colspan="16" class="text-center py-4">Data tidak ditemukan.</td></tr>';
    document.getElementById("paginationInfo").textContent = "Menampilkan 0 data";
    document.getElementById("paginationControls").innerHTML = "";
    return;
  }

  // Calculate Slicing
  const effPageSize = pageSize === "all" ? totalItems : pageSize;
  const totalPages = Math.ceil(totalItems / effPageSize);
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * effPageSize;
  const endIndex = Math.min(startIndex + effPageSize, totalItems);
  const pageData = filteredSiswaData.slice(startIndex, endIndex);

  // Render Table Rows (15 Kolom + Aksi)
  let html = "";
  pageData.forEach((row, idx) => {
    html += `
      <tr>
        <td>${startIndex + idx + 1}</td>
        <td class="font-weight-bold">${row.nama}</td>
        <td>${row.nipd}</td>
        <td>${row.jk}</td>
        <td>${row.nisn}</td>
        <td>${row.tempatLahir}</td>
        <td>${row.tanggalLahir}</td>
        <td>${row.nik}</td>
        <td>${row.agama}</td>
        <td>${row.alamat}</td>
        <td>${row.rt}</td>
        <td>${row.rw}</td>
        <td>${row.dusun}</td>
        <td>${row.kelurahan}</td>
        <td>${row.kecamatan}</td>
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

  // Render Info Text
  document.getElementById("paginationInfo").textContent = `Menampilkan ${startIndex + 1} - ${endIndex} dari ${totalItems} data`;

  // Render Pagination Buttons
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

// FITUR EKSPOR DATA KE CSV
function exportSiswaToCSV() {
  if (!siswaRawData || siswaRawData.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  let csvContent = "\uFEFF"; // BOM untuk UTF-8
  csvContent += "ID,Nama,NIPD (Kelas),JK,NISN,Tempat Lahir,Tanggal Lahir,NIK,Agama,Alamat,RT,RW,Dusun,Kelurahan,Kecamatan\n";

  siswaRawData.forEach(s => {
    const row = [
      `"${s.id}"`, `"${s.nama}"`, `"${s.nipd}"`, `"${s.jk}"`, `"${s.nisn}"`,
      `"${s.tempatLahir}"`, `"${s.tanggalLahir}"`, `"${s.nik}"`, `"${s.agama}"`,
      `"${s.alamat}"`, `"${s.rt}"`, `"${s.rw}"`, `"${s.dusun}"`, `"${s.kelurahan}"`, `"${s.kecamatan}"`
    ];
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `Master_Data_Siswa_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// FITUR IMPOR DATA DARI CSV
function openModalImportSiswa() {
  document.getElementById("csvFileInput").value = "";
  $("#importModal").modal("show");
}

function processCSVImport() {
  const fileInput = document.getElementById("csvFileInput");
  if (!fileInput.files.length) {
    alert("Pilih file CSV terlebih dahulu!");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function(e) {
    const text = e.target.result;
    const lines = text.split("\n");
    const siswaList = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^"|"$/g, '').trim());

      if (cols.length >= 2 && cols[1] !== "") {
        siswaList.push({
          id: cols[0] || "",
          nama: cols[1] || "",
          nipd: cols[2] || "",
          jk: cols[3] || "L",
          nisn: cols[4] || "",
          tempatLahir: cols[5] || "",
          tanggalLahir: cols[6] || "",
          nik: cols[7] || "",
          agama: cols[8] || "Islam",
          alamat: cols[9] || "",
          rt: cols[10] || "",
          rw: cols[11] || "",
          dusun: cols[12] || "",
          kelurahan: cols[13] || "",
          kecamatan: cols[14] || ""
        });
      }
    }

    if (siswaList.length === 0) {
      alert("Tidak ada data valid yang ditemukan di dalam CSV!");
      return;
    }

    const btn = document.getElementById("btnProcessImport");
    btn.disabled = true;
    btn.textContent = "Mengimpor...";

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "bulkAddSiswa", siswaList: siswaList })
      });
      const result = await response.json();

      if (result.status === "sukses") {
        $("#importModal").modal("hide");
        alert(result.pesan);
        await loadSiswaData();
      } else {
        alert("Gagal mengimpor: " + result.pesan);
      }
    } catch (err) {
      console.error("Error Import:", err);
      alert("Terjadi kesalahan koneksi saat mengimpor!");
    } finally {
      btn.disabled = false;
      btn.textContent = "Proses Impor";
    }
  };

  reader.readAsText(file);
}

// Modal Form Operations
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
