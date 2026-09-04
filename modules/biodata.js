// ==========================================
// MODUL BIODATA GURU & KARYAWAN SDIT AL-KAUTSAR
// ==========================================

let biodataTableEngine = null;
let biodataRawData = [];

// Fungsi Utama Inisialisasi Modul Biodata
async function initBiodataModule() {
  const mainContent = document.getElementById("mainContent");
  const pageTitle = document.getElementById("pageTitle");

  if (pageTitle) pageTitle.textContent = "Daftar Guru & Karyawan";

  // Render Layout Utama Modul
  mainContent.innerHTML = `
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <button class="btn btn-primary font-weight-bold" onclick="openModalAddBiodata()">
            <i class="fas fa-user-plus mr-1"></i> Tambah Guru / Karyawan
          </button>
        </div>
        <div class="btn-group">
          <button class="btn btn-outline-success btn-sm" onclick="exportBiodataData('csv')">
            <i class="fas fa-file-csv mr-1"></i> Ekspor CSV
          </button>
          <button class="btn btn-outline-success btn-sm" onclick="exportBiodataData('excel')">
            <i class="fas fa-file-excel mr-1"></i> Ekspor Excel
          </button>
          <button class="btn btn-outline-danger btn-sm" onclick="exportBiodataData('pdf')">
            <i class="fas fa-file-pdf mr-1"></i> Ekspor PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Container Tabel Engine -->
    <div id="biodataTableContainer"></div>

    <!-- Modal Form Tambah / Edit Biodata -->
    <div class="modal fade" id="biodataModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="biodataModalTitle">Tambah Data Guru / Karyawan</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="biodataForm">
            <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
              <input type="hidden" id="bioRowIndex" value="">
              
              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="bioNama">Nama Lengkap <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="bioNama" required>
                </div>
                <div class="col-md-6 form-group">
                  <label for="bioNipNiy">NIP / NIY</label>
                  <input type="text" class="form-control" id="bioNipNiy">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="bioNuptk">NUPTK</label>
                  <input type="text" class="form-control" id="bioNuptk">
                </div>
                <div class="col-md-6 form-group">
                  <label for="bioNik">NIK</label>
                  <input type="text" class="form-control" id="bioNik">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="bioJabatanUtama">Jabatan Utama <span class="text-danger">*</span></label>
                  <input type="text" class="form-control" id="bioJabatanUtama" placeholder="Contoh: Guru Kelas 1 An-Najm 1" required>
                </div>
                <div class="col-md-6 form-group">
                  <label for="bioTugasTambahan">Tugas Tambahan</label>
                  <input type="text" class="form-control" id="bioTugasTambahan" placeholder="Contoh: Waka Kurikulum / Humas">
                </div>
              </div>

              <div class="row">
                <div class="col-md-4 form-group">
                  <label for="bioStatusKepegawaian">Status Kepegawaian</label>
                  <select class="form-control" id="bioStatusKepegawaian">
                    <option value="">-- Pilih Status --</option>
                    <option value="PTY">PTY</option>
                    <option value="PTTY">PTTY</option>
                    <option value="Kontrak Yayasan">Kontrak Yayasan</option>
                    <option value="Honor">Honor</option>
                  </select>
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioMataPelajaran">Mata Pelajaran</label>
                  <input type="text" class="form-control" id="bioMataPelajaran" placeholder="Contoh: PAI, B.INDO, MTK">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioSertifikasi">Sertifikasi</label>
                  <select class="form-control" id="bioSertifikasi">
                    <option value="Tidak">Tidak</option>
                    <option value="Iya">Iya</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4 form-group">
                  <label for="bioTempatLahir">Tempat Lahir</label>
                  <input type="text" class="form-control" id="bioTempatLahir">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioTanggalLahir">Tanggal Lahir</label>
                  <input type="date" class="form-control" id="bioTanggalLahir">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioJenisKelamin">Jenis Kelamin</label>
                  <select class="form-control" id="bioJenisKelamin">
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4 form-group">
                  <label for="bioAgama">Agama</label>
                  <input type="text" class="form-control" id="bioAgama" value="Islam">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioNoHp">No. HP / Whatsapp</label>
                  <input type="text" class="form-control" id="bioNoHp">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioEmail">Email</label>
                  <input type="email" class="form-control" id="bioEmail">
                </div>
              </div>

              <div class="form-group">
                <label for="bioAlamatDomisili">Alamat Domisili</label>
                <textarea class="form-control" id="bioAlamatDomisili" rows="2"></textarea>
              </div>

              <div class="row">
                <div class="col-md-4 form-group">
                  <label for="bioPendidikanTerakhir">Pendidikan Terakhir</label>
                  <input type="text" class="form-control" id="bioPendidikanTerakhir" placeholder="S1 / SMA / D3">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioJurusan">Jurusan</label>
                  <input type="text" class="form-control" id="bioJurusan">
                </div>
                <div class="col-md-4 form-group">
                  <label for="bioKampus">Kampus / Universitas</label>
                  <input type="text" class="form-control" id="bioKampus">
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 form-group">
                  <label for="bioMottoHidup">Motto Hidup</label>
                  <input type="text" class="form-control" id="bioMottoHidup">
                </div>
                <div class="col-md-3 form-group">
                  <label for="bioFoto">Link Foto Drive</label>
                  <input type="text" class="form-control" id="bioFoto" placeholder="https://drive.google.com/...">
                </div>
                <div class="col-md-3 form-group">
                  <label for="bioBpi">BPI</label>
                  <select class="form-control" id="bioBpi">
                    <option value="Iya">Iya</option>
                    <option value="Tidak">Tidak</option>
                  </select>
                </div>
              </div>

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSaveBiodata">Simpan Data</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Hubungkan Event Listener Form
  document.getElementById("biodataForm").addEventListener("submit", handleSaveBiodata);

  // Inisialisasi DataTableEngine untuk Biodata Guru
  biodataTableEngine = new DataTableEngine({
    containerId: "biodataTableContainer",
    columns: [
      { title: "Nama Lengkap", field: "nama" },
      { title: "NIP/NIY", field: "nipNiy" },
      { title: "NUPTK", field: "nuptk" },
      { title: "NIK", field: "nik" },
      { title: "Jabatan Utama", field: "jabatanUtama" },
      { title: "Tugas Tambahan", field: "tugasTambahan" },
      { title: "Status Kepegawaian", field: "statusKepegawaian" },
      { title: "Mata Pelajaran", field: "mataPelajaran" },
      { title: "Sertifikasi", field: "sertifikasi" },
      { title: "Tempat Lahir", field: "tempatLahir" },
      { title: "Tanggal Lahir", field: "tanggalLahir" },
      { title: "Jenis Kelamin", field: "jenisKelamin" },
      { title: "Agama", field: "agama" },
      { title: "Alamat Domisili", field: "alamatDomisili" },
      { title: "No HP", field: "noHp" },
      { title: "Email", field: "email" },
      { title: "Pendidikan", field: "pendidikanTerakhir" },
      { title: "Jurusan", field: "jurusan" },
      { title: "Kampus", field: "kampus" },
      { title: "Motto Hidup", field: "mottoHidup" },
      { 
        title: "Foto", 
        field: "foto",
        filterable: false,
        render: (val) => val ? `<a href="${val}" target="_blank" class="badge badge-info"><i class="fas fa-image mr-1"></i>Lihat Foto</a>` : '-'
      },
      { title: "BPI", field: "bpi" },
      {
        title: "Aksi",
        field: "rowIndex",
        filterable: false,
        render: (val, row) => `
          <button class="btn btn-xs btn-warning font-weight-bold mr-1" onclick="openModalEditBiodata(${row.rowIndex})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-xs btn-danger font-weight-bold" onclick="confirmDeleteBiodata(${row.rowIndex}, '${row.nama}')">
            <i class="fas fa-trash"></i> Hapus
          </button>
        `
      }
    ],
    data: []
  });

  // Load Data dari API
  await loadBiodataData();
}

// Load Data Biodata dari Apps Script
async function loadBiodataData() {
  try {
    const response = await fetch(`${API_URL}?action=getBiodataData`);
    const result = await response.json();

    if (result.status === "sukses") {
      biodataRawData = result.data || [];
      biodataTableEngine.setData(biodataRawData);
    } else {
      alert("Gagal memuat data: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Load Biodata Data:", err);
    alert("Terjadi kesalahan koneksi saat mengambil data!");
  }
}

// Buka Modal Tambah Biodata
function openModalAddBiodata() {
  document.getElementById("biodataModalTitle").textContent = "Tambah Data Guru / Karyawan";
  document.getElementById("bioRowIndex").value = "";
  document.getElementById("bioNama").value = "";
  document.getElementById("bioNipNiy").value = "";
  document.getElementById("bioNuptk").value = "";
  document.getElementById("bioNik").value = "";
  document.getElementById("bioJabatanUtama").value = "";
  document.getElementById("bioTugasTambahan").value = "";
  document.getElementById("bioStatusKepegawaian").value = "";
  document.getElementById("bioMataPelajaran").value = "";
  document.getElementById("bioSertifikasi").value = "Tidak";
  document.getElementById("bioTempatLahir").value = "";
  document.getElementById("bioTanggalLahir").value = "";
  document.getElementById("bioJenisKelamin").value = "Perempuan";
  document.getElementById("bioAgama").value = "Islam";
  document.getElementById("bioAlamatDomisili").value = "";
  document.getElementById("bioNoHp").value = "";
  document.getElementById("bioEmail").value = "";
  document.getElementById("bioPendidikanTerakhir").value = "";
  document.getElementById("bioJurusan").value = "";
  document.getElementById("bioKampus").value = "";
  document.getElementById("bioMottoHidup").value = "";
  document.getElementById("bioFoto").value = "";
  document.getElementById("bioBpi").value = "Iya";

  $("#biodataModal").modal("show");
}

// Buka Modal Edit Biodata
function openModalEditBiodata(rowIndex) {
  const item = biodataRawData.find(b => b.rowIndex === rowIndex);
  if (!item) {
    alert("Data tidak ditemukan!");
    return;
  }

  document.getElementById("biodataModalTitle").textContent = "Edit Data Guru / Karyawan";
  document.getElementById("bioRowIndex").value = item.rowIndex;
  document.getElementById("bioNama").value = item.nama;
  document.getElementById("bioNipNiy").value = item.nipNiy;
  document.getElementById("bioNuptk").value = item.nuptk;
  document.getElementById("bioNik").value = item.nik;
  document.getElementById("bioJabatanUtama").value = item.jabatanUtama;
  document.getElementById("bioTugasTambahan").value = item.tugasTambahan;
  document.getElementById("bioStatusKepegawaian").value = item.statusKepegawaian;
  document.getElementById("bioMataPelajaran").value = item.mataPelajaran;
  document.getElementById("bioSertifikasi").value = item.sertifikasi || "Tidak";
  document.getElementById("bioTempatLahir").value = item.tempatLahir;
  document.getElementById("bioTanggalLahir").value = item.tanggalLahir;
  document.getElementById("bioJenisKelamin").value = item.jenisKelamin || "Perempuan";
  document.getElementById("bioAgama").value = item.agama || "Islam";
  document.getElementById("bioAlamatDomisili").value = item.alamatDomisili;
  document.getElementById("bioNoHp").value = item.noHp;
  document.getElementById("bioEmail").value = item.email;
  document.getElementById("bioPendidikanTerakhir").value = item.pendidikanTerakhir;
  document.getElementById("bioJurusan").value = item.jurusan;
  document.getElementById("bioKampus").value = item.kampus;
  document.getElementById("bioMottoHidup").value = item.mottoHidup;
  document.getElementById("bioFoto").value = item.foto;
  document.getElementById("bioBpi").value = item.bpi || "Iya";

  $("#biodataModal").modal("show");
}

// Handle Simpan Biodata
async function handleSaveBiodata(e) {
  e.preventDefault();
  
  const btnSave = document.getElementById("btnSaveBiodata");
  btnSave.disabled = true;
  btnSave.textContent = "Menyimpan...";

  const rowIndex = document.getElementById("bioRowIndex").value;
  const isEdit = rowIndex !== "";

  const payload = {
    action: isEdit ? "updateBiodata" : "addBiodata",
    rowIndex: rowIndex,
    nama: document.getElementById("bioNama").value.trim(),
    nipNiy: document.getElementById("bioNipNiy").value.trim(),
    nuptk: document.getElementById("bioNuptk").value.trim(),
    nik: document.getElementById("bioNik").value.trim(),
    jabatanUtama: document.getElementById("bioJabatanUtama").value.trim(),
    tugasTambahan: document.getElementById("bioTugasTambahan").value.trim(),
    statusKepegawaian: document.getElementById("bioStatusKepegawaian").value.trim(),
    mataPelajaran: document.getElementById("bioMataPelajaran").value.trim(),
    sertifikasi: document.getElementById("bioSertifikasi").value.trim(),
    tempatLahir: document.getElementById("bioTempatLahir").value.trim(),
    tanggalLahir: document.getElementById("bioTanggalLahir").value.trim(),
    jenisKelamin: document.getElementById("bioJenisKelamin").value.trim(),
    agama: document.getElementById("bioAgama").value.trim(),
    alamatDomisili: document.getElementById("bioAlamatDomisili").value.trim(),
    noHp: document.getElementById("bioNoHp").value.trim(),
    email: document.getElementById("bioEmail").value.trim(),
    pendidikanTerakhir: document.getElementById("bioPendidikanTerakhir").value.trim(),
    jurusan: document.getElementById("bioJurusan").value.trim(),
    kampus: document.getElementById("bioKampus").value.trim(),
    mottoHidup: document.getElementById("bioMottoHidup").value.trim(),
    foto: document.getElementById("bioFoto").value.trim(),
    bpi: document.getElementById("bioBpi").value.trim()
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "sukses") {
      $("#biodataModal").modal("hide");
      alert(result.pesan);
      await loadBiodataData();
    } else {
      alert("Gagal menyimpan: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Save Biodata:", err);
    alert("Terjadi kesalahan koneksi saat menyimpan data!");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Simpan Data";
  }
}

// Konfirmasi Hapus Biodata
async function confirmDeleteBiodata(rowIndex, nama) {
  if (!confirm(`Apakah Anda yakin ingin menghapus data "${nama}"?`)) return;

  try {
    const payload = {
      action: "deleteBiodata",
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
      await loadBiodataData();
    } else {
      alert("Gagal menghapus: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Delete Biodata:", err);
    alert("Terjadi kesalahan koneksi saat menghapus data!");
  }
}

// Ekspor Data Biodata
function exportBiodataData(format) {
  if (!biodataRawData || biodataRawData.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  if (format === 'csv' || format === 'excel') {
    let csvContent = "data:text/csv;charset=utf-8,No,Nama Lengkap,NIP/NIY,NUPTK,NIK,Jabatan Utama,Tugas Tambahan,Status Kepegawaian,Mata Pelajaran,Sertifikasi,Tempat Lahir,Tanggal Lahir,Jenis Kelamin,Agama,Alamat Domisili,No HP,Email,Pendidikan Terakhir,Jurusan,Kampus,Motto Hidup,Foto,BPI\n";
    
    biodataRawData.forEach((row, idx) => {
      csvContent += `"${idx + 1}","${row.nama}","${row.nipNiy}","${row.nuptk}","${row.nik}","${row.jabatanUtama}","${row.tugasTambahan}","${row.statusKepegawaian}","${row.mataPelajaran}","${row.sertifikasi}","${row.tempatLahir}","${row.tanggalLahir}","${row.jenisKelamin}","${row.agama}","${row.alamatDomisili}","${row.noHp}","${row.email}","${row.pendidikanTerakhir}","${row.jurusan}","${row.kampus}","${row.mottoHidup}","${row.foto}","${row.bpi}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Daftar_Guru_Karyawan_SDIT_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === 'pdf') {
    window.print();
  }
}
