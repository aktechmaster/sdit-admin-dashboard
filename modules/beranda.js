/**
 * Modul Beranda - Dashboard SDIT Al-Kautsar
 * Perhitungan Rata-Rata Persentase Dinamis
 */

// Utility membersihkan & mengubah teks persentase menjadi angka
function parsePercentage(val) {
  if (val === null || val === undefined || val === '') return null;
  let str = String(val).replace('%', '').replace(',', '.').trim();
  let num = parseFloat(str);
  if (isNaN(num)) return null;
  if (num <= 1 && num > 0 && str.includes('.')) {
    num = num * 100;
  }
  return num;
}

// Menghitung rata-rata nilai kolom secara dinamis
function calculateColumnAverage(rawData, colIndex, startRowIndex) {
  if (!rawData || rawData.length <= startRowIndex) return "0%";

  let sum = 0;
  let count = 0;

  for (let i = startRowIndex; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length <= colIndex) continue;

    const firstColVal = String(row[0] || '').toLowerCase();
    const secondColVal = String(row[1] || '').toLowerCase();

    // Hentikan iterasi saat menyentuh baris Total / Rerata di paling bawah
    if (firstColVal.includes('total') || firstColVal.includes('rerata') || 
        secondColVal.includes('total') || secondColVal.includes('rerata')) {
      break;
    }

    const valStr = row[colIndex];
    const num = parsePercentage(valStr);

    if (num !== null && !isNaN(num)) {
      sum += num;
      count++;
    }
  }

  if (count === 0) return "0%";
  return (sum / count).toFixed(2) + "%";
}

// Menghitung persentase kehadiran guru hari ini dari sheet Absensi
function calculateAbsensiToday(rawData) {
  if (!rawData || rawData.length <= 1) return "0%";

  let totalGuru = 0;
  let tidakHadirToday = 0;

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 4) continue;

    const namaGuru = String(row[1] || '').trim(); // Kolom B (Nama Lengkap)
    const todayVal = String(row[3] || '').trim(); // Kolom D (Today)

    if (namaGuru !== '' && !namaGuru.toLowerCase().includes('total') && !namaGuru.toLowerCase().includes('rerata')) {
      totalGuru++;
      const absentNum = parseInt(todayVal) || 0;
      if (absentNum > 0) {
        tidakHadirToday++;
      }
    }
  }

  if (totalGuru === 0) return "0%";
  const hadirCount = totalGuru - tidakHadirToday;
  const percentage = (hadirCount / totalGuru) * 100;
  return percentage.toFixed(2) + "%";
}

// Fungsi utama memuat seluruh indikator persentase
async function loadDashboardStats() {
  const config = [
    { sheet: 'Jurnal Harian', elementId: 'statJurnalHarian', col: 3, startRow: 1, type: 'avg' }, // Kolom D
    { sheet: 'Jurnal fix', elementId: 'statJurnalFix', col: 4, startRow: 1, type: 'avg' },     // Kolom E
    { sheet: 'Jurnal', elementId: 'statJurnal', col: 40, startRow: 2, type: 'avg' },           // Kolom AO
    { sheet: 'Jurnal fix T2Q', elementId: 'statJurnalFixT2q', col: 4, startRow: 1, type: 'avg' }, // Kolom E
    { sheet: 'Rekap Kelas', elementId: 'statRekapKelas', col: 4, startRow: 1, type: 'avg' },     // Kolom E
    { sheet: 'Absensi', elementId: 'statAbsensi', type: 'absensi' },                           // Logika Absensi Today
    { sheet: 'Jurnal T2Q', elementId: 'statJurnalT2q', col: 40, startRow: 2, type: 'avg' }       // Kolom AO
  ];

  for (const item of config) {
    try {
      $(`#${item.elementId}`).html('<i class="fas fa-spinner fa-spin fa-xs"></i>');

      const url = `${API_URL}?action=read&sheet=${encodeURIComponent(item.sheet)}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.status === 'success' && Array.isArray(result.data)) {
        let resultText = "0%";
        if (item.type === 'avg') {
          resultText = calculateColumnAverage(result.data, item.col, item.startRow);
        } else if (item.type === 'absensi') {
          resultText = calculateAbsensiToday(result.data);
        }
        $(`#${item.elementId}`).text(resultText);
      } else {
        $(`#${item.elementId}`).text('0%');
      }
    } catch (err) {
      console.error(`Gagal memuat statistik ${item.sheet}:`, err);
      $(`#${item.elementId}`).text('0%');
    }
  }
}
