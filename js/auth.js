// ==========================================
// LOGIKA OTENTIKASI DASHBOARD SDIT AL-KAUTSAR
// ==========================================

// Fungsi untuk menangani proses login secara statis
async function loginUser(username, password) {
  // Kredensial lokal
  const VALID_USERNAME = "sditalkautsar";
  const VALID_PASSWORD = "69881812";

  // Simulasi jeda singkat agar animasi loading tombol tetap berjalan seamless
  await new Promise(resolve => setTimeout(resolve, 400));

  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    const userData = {
      username: username,
      nama: "Admin SDIT Al-Kautsar",
      role: "Admin"
    };

    // Simpan data sesi pengguna ke localStorage menggunakan key dari APP_CONFIG
    localStorage.setItem(APP_CONFIG.sessionKey, JSON.stringify(userData));
    return { sukses: true, pesan: "Login berhasil!", user: userData };
  } else {
    return { sukses: false, pesan: "Username atau password salah!" };
  }
}

// Fungsi untuk mendapatkan data pengguna yang sedang login
function getCurrentUser() {
  const sessionData = localStorage.getItem(APP_CONFIG.sessionKey);
  if (!sessionData) return null;
  try {
    return JSON.parse(sessionData);
  } catch (e) {
    return null;
  }
}

// Fungsi untuk memeriksa status login di halaman terlindungi (misal: dashboard.html)
function checkAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "index.html";
  }
}

// Fungsi untuk memblokir akses ke halaman login jika sudah login
function checkAlreadyLoggedIn() {
  const user = getCurrentUser();
  if (user) {
    window.location.href = "dashboard.html";
  }
}

// Fungsi untuk logout
function logoutUser() {
  localStorage.removeItem(APP_CONFIG.sessionKey);
  window.location.href = "index.html";
}
