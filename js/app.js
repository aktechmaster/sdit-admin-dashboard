// ==========================================
// UTAMA / ROUTER APLIKASI (js/app.js)
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. Cek Status Login saat halaman selesai dimuat
  if (typeof checkAuthStatus === "function") {
    checkAuthStatus();
  }

  // 2. Navigasi Sidebar - Menu Guru & Karyawan
  const navGuruKaryawan = document.getElementById("navGuruKaryawan");
  if (navGuruKaryawan) {
    navGuruKaryawan.addEventListener("click", function (e) {
      e.preventDefault();
      
      // Update status active pada menu sidebar
      document.querySelectorAll(".sidebar .nav-link").forEach(el => el.classList.remove("active"));
      this.classList.add("active");

      // Panggil Modul Biodata Guru & Karyawan
      if (typeof initBiodataModule === "function") {
        initBiodataModule();
      }
    });
  }

  // 3. Navigasi Sidebar - Menu Kelola User / Username
  const navUserManagement = document.getElementById("navUserManagement");
  if (navUserManagement) {
    navUserManagement.addEventListener("click", function (e) {
      e.preventDefault();
      
      document.querySelectorAll(".sidebar .nav-link").forEach(el => el.classList.remove("active"));
      this.classList.add("active");

      // Panggil Modul Kelola User
      if (typeof initUserModule === "function") {
        initUserModule();
      }
    });
  }
});
