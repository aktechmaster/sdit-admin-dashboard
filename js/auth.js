// ==========================================
// LOGIKA OTENTIKASI DASHBOARD SDIT AL-KAUTSAR
// ==========================================

// Fungsi untuk menangani proses login
async function loginUser(username, password) {
  try {
    const payload = {
      action: "login",
      username: username,
      password: password
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "sukses") {
      // Simpan data sesi pengguna ke localStorage
      localStorage.setItem(APP_CONFIG.sessionKey, JSON.stringify(result.user));
      return { sukses: true, pesan: result.pesan, user: result.user };
    } else {
      return { sukses: false, pesan: result.pesan || "Username atau password salah!" };
    }
  } catch (error) {
    console.error("Error Login:", error);
    return { sukses: false, pesan: "Gagal terhubung ke server. Periksa koneksi internet Anda." };
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
