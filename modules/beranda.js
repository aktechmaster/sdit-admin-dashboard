/**
 * Modul Beranda - Dashboard SDIT Al-Kautsar
 * Menangani kalkulasi & tampilan rata-rata persentase indikator
 */

// Helper untuk membersihkan & merubah nilai persentase (string/angka) menjadi Float
function parsePercentageValue(val) {
  if (val === null || val === undefined || val === '') return 0;
  
  if (typeof val === 'number') {
    // Jika nilai desimal (misal 0.9087 -> 90.87)
    return val <= 1 ? val * 100 : val;
  }
  
  if (typeof val === 'string') {
    // Membersihkan simbol %, spasi, dan mengubah koma menjadi titik
    let cleanStr = val.replace('%', '').replace(',', '.').trim();
    let num = parseFloat(cleanStr);
    if (isNaN(num)) return 0;
    return num <= 1 && cleanStr.includes('.') && !val.includes('%') ? num * 100 : num;
  }
  
  return 0;
}

// Helper menghitung rata-rata dari array angka
function calculateAverage(arr) {
  if (!arr || arr.length === 0) return 0;
  const validValues = arr.map(v => parsePercentageValue(v)).filter(v => !isNaN(v) && v > 0);
  if (validValues.length === 0) return 0;
  
  const sum = validValues.reduce((acc, curr) => acc + curr, 0);
  return (sum / validValues.length).toFixed(2);
}

// Fungsi utama memuat seluruh indikator persentase Beranda
async function loadDashboardStats() {
  const targetSheets = [
    { sheet: 'Jurnal Harian', elementId: 'statJurnalHarian', colIndex: 3 }, // Sesuaikan indeks kolom persentase
    { sheet: 'Jurnal fix', elementId: 'statJurnalFix', colIndex: 3 },
    { sheet: 'Jurnal', elementId: 'statJurnal', colIndex: 3 },
    { sheet: 'Jurnal fix T2Q', elementId: 'statJurnalFixT2q', colIndex: 3 },
    { sheet: 'Rekap Kelas', elementId: 'statRekapKelas', colIndex: 4 }, // Kolom RATA-RATA KEHADIRAN KELAS
    { sheet: 'Absensi', elementId: 'statAbsensi', colIndex: 3 },
    { sheet: 'Jurnal T2Q', elementId: 'statJurnalT2q', colIndex: 3 }
  ];

  for (const item of targetSheets) {
    try {
      // Tampilkan indikator loading sederhana
      $(`#${item.elementId}`).html('<i class="fas fa-spinner fa-spin fa-xs"></i>');

      // Ambil data dari GAS via fetch
      const response = await fetch(`${API_URL}?action=read&sheet=${encodeURIComponent(item.sheet)}`);
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        // Ambil nilai dari kolom persentase per baris
        const percentageList = result.data.map(row => {
          const keys = Object.keys(row);
          // Ambil berdasarkan indeks kolom atau nama properti
          return row[keys[item.colIndex]] || Object.values(row)[item.colIndex];
        });

        const avg = calculateAverage(percentageList);
        $(`#${item.elementId}`).text(`${avg}%`);
      } else {
        $(`#${item.elementId}`).text('0%');
      }
    } catch (error) {
      console.error(`Gagal memuat statistik ${item.sheet}:`, error);
      $(`#${item.elementId}`).text('Err');
    }
  }
}
