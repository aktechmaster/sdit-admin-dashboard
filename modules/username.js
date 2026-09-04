// ==========================================
// MODUL MANAJEMEN USERNAME SDIT AL-KAUTSAR
// ==========================================

let usernameTableEngine = null;
let usernameRawData = [];

// Fungsi Utama Inisialisasi Modul Username
async function initUsernameModule() {
  const mainContent = document.getElementById("mainContent");
  const pageTitle = document.getElementById("pageTitle");

  if (pageTitle) pageTitle.textContent = "Manajemen Username";

  // Render Layout Utama Modul
  mainContent.innerHTML = `
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <button class="btn btn-primary font-weight-bold" onclick="openModalAddUser()">
            <i class="fas fa-user-plus mr-1"></i> Tambah User Baru
          </button>
        </div>
        <div class="btn-group">
          <button class="btn btn-outline-success btn-sm" onclick="exportUsernameData('csv')">
            <i class="fas fa-file-csv mr-1"></i> Ekspor CSV
          </button>
          <button class="btn btn-outline-success btn-sm" onclick="exportUsernameData('excel')">
            <i class="fas fa-file-excel mr-1"></i> Ekspor Excel
          </button>
          <button class="btn btn-outline-danger btn-sm" onclick="exportUsernameData('pdf')">
            <i class="fas fa-file-pdf mr-1"></i> Ekspor PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Container Tabel Engine -->
    <div id="usernameTableContainer"></div>

    <!-- Modal Tambah / Edit User -->
    <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="userModalTitle">Tambah User Baru</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="userForm">
            <div class="modal-body">
              <input type="hidden" id="modalRowIndex" value="">
              
              <div class="form-group">
                <label for="modalNama">Nama Lengkap <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="modalNama" required>
              </div>

              <div class="form-group">
                <label for="modalUsername">Username <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="modalUsername" required autocomplete="off">
              </div>

              <div class="form-group">
                <label for="modalPassword">Password <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="modalPassword" required autocomplete="off">
              </div>

              <div class="form-group">
                <label for="modalJabatan">Jabatan <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="modalJabatan" placeholder="Contoh: Guru / Walas" required>
              </div>

              <div class="form-group">
                <label for="modalNipy">NIPY</label>
                <input type="text" class="form-control" id="modalNipy" placeholder="Opsional">
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSaveUser">Simpan Data</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Hubungkan Event Listener Form Modal
  document.getElementById("userForm").addEventListener("submit", handleSaveUser);

  // Inisialisasi DataTableEngine
  usernameTableEngine = new DataTableEngine({
    containerId: "usernameTableContainer",
    columns: [
      { title: "Nama Lengkap", field: "nama" },
      { title: "Username", field: "username" },
      { title: "Password", field: "password" },
      { title: "Jabatan", field: "jabatan" },
      { title: "NIPY", field: "nipy" },
      {
        title: "Aksi",
        field: "rowIndex",
        filterable: false,
        render: (val, row) => `
          <button class="btn btn-xs btn-warning font-weight-bold mr-1" onclick="openModalEditUser(${row.rowIndex})">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="btn btn-xs btn-danger font-weight-bold" onclick="confirmDeleteUser(${row.rowIndex}, '${row.nama}')">
            <i class="fas fa-trash"></i> Hapus
          </button>
        `
      }
    ],
    data: []
  });

  // Load Data dari API
  await loadUsernameData();
}

// Load Data Username dari Apps Script
async function loadUsernameData() {
  try {
    const response = await fetch(`${API_URL}?action=getUsernameData`);
    const result = await response.json();

    if (result.status === "sukses") {
      usernameRawData = result.data || [];
      usernameTableEngine.setData(usernameRawData);
    } else {
      alert("Gagal memuat data: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Load Username Data:", err);
    alert("Terjadi kesalahan koneksi saat mengambil data!");
  }
}

// Buka Modal Tambah User
function openModalAddUser() {
  document.getElementById("userModalTitle").textContent = "Tambah User Baru";
  document.getElementById("modalRowIndex").value = "";
  document.getElementById("modalNama").value = "";
  document.getElementById("modalUsername").value = "";
  document.getElementById("modalPassword").value = "";
  document.getElementById("modalJabatan").value = "";
  document.getElementById("modalNipy").value = "";

  $("#userModal").modal("show");
}

// Buka Modal Edit User
function openModalEditUser(rowIndex) {
  const user = usernameRawData.find(item => item.rowIndex === rowIndex);
  if (!user) {
    alert("Data user tidak ditemukan!");
    return;
  }

  document.getElementById("userModalTitle").textContent = "Edit Data User";
  document.getElementById("modalRowIndex").value = user.rowIndex;
  document.getElementById("modalNama").value = user.nama;
  document.getElementById("modalUsername").value = user.username;
  document.getElementById("modalPassword").value = user.password;
  document.getElementById("modalJabatan").value = user.jabatan;
  document.getElementById("modalNipy").value = user.nipy;

  $("#userModal").modal("show");
}

// Handle Simpan User (Tambah / Edit)
async function handleSaveUser(e) {
  e.preventDefault();
  
  const btnSave = document.getElementById("btnSaveUser");
  btnSave.disabled = true;
  btnSave.textContent = "Menyimpan...";

  const rowIndex = document.getElementById("modalRowIndex").value;
  const isEdit = rowIndex !== "";

  const payload = {
    action: isEdit ? "updateUsername" : "addUsername",
    rowIndex: rowIndex,
    nama: document.getElementById("modalNama").value.trim(),
    username: document.getElementById("modalUsername").value.trim(),
    password: document.getElementById("modalPassword").value.trim(),
    jabatan: document.getElementById("modalJabatan").value.trim(),
    nipy: document.getElementById("modalNipy").value.trim()
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "sukses") {
      $("#userModal").modal("hide");
      alert(result.pesan);
      await loadUsernameData();
    } else {
      alert("Gagal menyimpan: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Save User:", err);
    alert("Terjadi kesalahan koneksi saat menyimpan data!");
  } finally {
    btnSave.disabled = false;
    btnSave.textContent = "Simpan Data";
  }
}

// Konfirmasi Hapus User
async function confirmDeleteUser(rowIndex, nama) {
  if (!confirm(`Apakah Anda yakin ingin menghapus user "${nama}"?`)) return;

  try {
    const payload = {
      action: "deleteUsername",
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
      await loadUsernameData();
    } else {
      alert("Gagal menghapus: " + result.pesan);
    }
  } catch (err) {
    console.error("Error Delete User:", err);
    alert("Terjadi kesalahan koneksi saat menghapus data!");
  }
}

// Ekspor Data ke CSV/Excel/PDF
function exportUsernameData(format) {
  if (!usernameRawData || usernameRawData.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  if (format === 'csv' || format === 'excel') {
    let csvContent = "data:text/csv;charset=utf-8,No,Nama Lengkap,Username,Password,Jabatan,NIPY\n";
    usernameRawData.forEach((row, idx) => {
      csvContent += `"${idx + 1}","${row.nama}","${row.username}","${row.password}","${row.jabatan}","${row.nipy}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Data_Username_SDIT_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === 'pdf') {
    window.print();
  }
}
