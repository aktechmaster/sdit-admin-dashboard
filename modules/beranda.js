/**
 * Modul Beranda - Dashboard SDIT Al-Kautsar
 * Menangani kalkulasi & tampilan rata-rata persentase indikator
 */

function parsePercentageValue(val) {
  if (val === null || val === undefined || val === '') return 0;
  
  if (typeof val === 'number') {
    return val <= 1 ? val * 100 : val;
  }
  
  if (typeof val === 'string') {
    let cleanStr = val.replace('%', '').replace(',', '.').trim();
    let num = parseFloat(cleanStr);
    if (isNaN(num)) return 0;
    return num <= 1 && cleanStr.includes('.') && !val.includes('%') ? num * 100 : num;
  }
  
  return 0;
}

function calculateAverage(arr) {
  if (!arr || arr.length === 0) return 0;
  const validValues = arr.map(v => parsePercentageValue(v)).filter(v => !isNaN(v) && v > 0);
  if (validValues.length === 0) return 0;
  
  const sum = validValues.reduce((acc, curr) => acc + curr, 0);
  return (sum / validValues.length).toFixed(2);
}

async function loadDashboardStats() {
  // Konfigurasi target sheet dan kata kunci header persentase
  const targetSheets = [
    { sheet: 'Jurnal Harian', elementId: 'statJurnalHarian', keyword: 'PERSENTASE' },
    { sheet: 'Jurnal fix', elementId: 'statJurnalFix', keyword: 'PERSENTASE' },
    { sheet: 'Jurnal', elementId: 'statJurnal', keyword: 'PERSENTASE' },
    { sheet: 'Jurnal fix T2Q', elementId: 'statJurnalFixT2q', keyword: 'PERSENTASE' },
    { sheet: 'Rekap Kelas', elementId: 'statRekapKelas', keyword: 'RATA-RATA' },
    { sheet: 'Absensi', elementId: 'statAbsensi', keyword: 'PERSENTASE' },
    { sheet: 'Jurnal T2Q', elementId: 'statJurnalT2q', keyword: 'PERSENTASE' }
  ];

  for (const item of targetSheets) {
    try {
      $(`#${item.elementId}`).html('<i class="fas fa-spinner fa-spin fa-xs"></i>');

      const url = `${API_URL}?action=read&sheet=${encodeURIComponent(item.sheet)}`;
      const response = await fetch(url);
      const result = await response.json();

      console.log(`[DEBUG Beranda] Response ${item.sheet}:`, result);

      if (result.status === 'success' && Array.isArray(result.data) && result.data.length > 0) {
        // Cari nama kolom/key yang mengandung kata kunci (misal "RATA-RATA" atau "PERSENTASE")
        const sampleRow = result.data[0];
        const keys = Object.keys(sampleRow);
        const targetKey = keys.find(k => k.toUpperCase().includes(item.keyword)) || keys[keys.length - 1];

        const percentageList = result.data.map(row => row[targetKey]);
        const avg = calculateAverage(percentageList);

        $(`#${item.elementId}`).text(`${avg}%`);
      } else {
        $(`#${item.elementId}`).text('0%');
      }
    } catch (error) {
      console.error(`[ERROR Beranda] Gagal memuat ${item.sheet}:`, error);
      $(`#${item.elementId}`).text('0%');
    }
  }
}
