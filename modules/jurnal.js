/**
 * Modul Jurnal Tahunan - SDIT Al-Kautsar
 * Menampilkan rincian capaian SMT 1, SMT 2, & Rata-rata Tahunan per guru dengan Freeze Header & Dynamic Color
 */

async function initJurnalModule() {
  $('#pageTitle').text('Rincian Jurnal Umum Tahunan');

  const contentArea = $('#mainContent');
  
  contentArea.html(`
    <style>
      .table-freeze-container {
        max-height: 68vh;
        overflow-y: auto;
        position: relative;
      }
      .table-freeze-container thead th {
        position: sticky;
        top: 0;
        background-color: #e9ecef !important;
        z-index: 10;
        box-shadow: inset 0 -2px 0 #dee2e6;
      }
    </style>

    <div class="card card-outline card-warning">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-book mr-2"></i>Data Jurnal Umum Tahunan Guru</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" onclick="initJurnalModule()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div id="tableSpinner" class="text-center my-4 p-3">
          <i class="fas fa-spinner fa-spin fa-2x text-warning"></i>
          <p class="mt-2 text-muted">Memuat data Jurnal Tahunan...</p>
        </div>
        
        <!-- Wadah Tabel dengan Freeze Header -->
        <div class="table-responsive table-freeze-container">
          <table id="tableJurnal" class="table table-bordered table-striped table-hover mb-0" style="width:100%">
            <thead class="thead-light">
              <tr>
                <th style="width: 50px" class="text-center">No</th>
                <th>Nama Lengkap</th>
                <th class="text-center">SMT 1</th>
                <th class="text-center">SMT 2</th>
                <th class="text-center">Rata-Rata Tahunan</th>
              </tr>
            </thead>
            <tbody id="tbodyJurnal">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  try {
    const url = `${API_URL}?action=read&sheet=${encodeURIComponent('Jurnal')}`;
    const response = await fetch(url);
    const result = await response.json();

    $('#tableSpinner').addClass('d-none');

    if (result.status === 'success' && Array.isArray(result.data)) {
      renderTableJurnal(result.data);
    } else {
      $('#tbodyJurnal').html(`<tr><td colspan="5" class="text-center text-muted p-3">Gagal memuat data atau sheet kosong.</td></tr>`);
    }
  } catch (error) {
    console.error('Error Jurnal Tahunan:', error);
    $('#tableSpinner').addClass('d-none');
    $('#tbodyJurnal').html(`<tr><td colspan="5" class="text-center text-danger p-3">Terjadi kesalahan saat terhubung ke server.</td></tr>`);
  }
}

function renderTableJurnal(rawData) {
  if (rawData.length <= 2) {
    $('#tbodyJurnal').html(`<tr><td colspan="5" class="text-center text-muted p-3">Tidak ada data ditemukan.</td></tr>`);
    return;
  }

  // Deteksi Indeks Kolom Otomatis dari Baris Header
  let idxNama = 1;
  let idxSmt1 = -1;
  let idxSmt2 = -1;
  let idxRataRata = -1;

  for (let r = 0; r < Math.min(2, rawData.length); r++) {
    const headerRow = rawData[r];
    if (!headerRow) continue;
    headerRow.forEach((colName, cIdx) => {
      const str = String(colName || '').trim().toUpperCase();
      if (str === 'NAMA' || str === 'NAMA LENGKAP') idxNama = cIdx;
      if (str.includes('SMT 1') || str.includes('SEMESTER 1')) idxSmt1 = cIdx;
      if (str.includes('SMT 2') || str.includes('SEMESTER 2')) idxSmt2 = cIdx;
      if (str.includes('RATA-RATA') || str.includes('RATA RATA') || str.includes('RERATA')) idxRataRata = cIdx;
    });
  }

  // Fallback Indeks jika header tidak terdeteksi teksnya
  if (idxSmt1 === -1) idxSmt1 = 38;      // Kolom AM
  if (idxSmt2 === -1) idxSmt2 = 39;      // Kolom AN
  if (idxRataRata === -1) idxRataRata = 40; // Kolom AO

  let rowsHtml = '';
  let noUrut = 1;

  // Data baris dimulai dari indeks ke-2 (baris ke-3 di Spreadsheet)
  for (let i = 2; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 2) continue;

    const no = row[0] || noUrut;
    const nama = String(row[idxNama] || '').trim();
    const smt1 = row[idxSmt1];
    const smt2 = row[idxSmt2];
    const rataRata = row[idxRataRata];

    if (!nama || nama.toLowerCase().includes('total') || nama.toLowerCase().includes('rerata')) {
      continue;
    }

    const badgeSmt1 = generatePercentBadgeJurnal(smt1);
    const badgeSmt2 = generatePercentBadgeJurnal(smt2);
    const badgeRataRata = generatePercentBadgeJurnal(rataRata);

    rowsHtml += `
      <tr>
        <td class="text-center">${no}</td>
        <td class="font-weight-bold">${nama}</td>
        <td class="text-center">${badgeSmt1}</td>
        <td class="text-center">${badgeSmt2}</td>
        <td class="text-center">${badgeRataRata}</td>
      </tr>
    `;
    noUrut++;
  }

  $('#tbodyJurnal').html(rowsHtml);

  if ($.fn.DataTable) {
    if ($.fn.DataTable.isDataTable('#tableJurnal')) {
      $('#tableJurnal').DataTable().destroy();
    }
    $('#tableJurnal').DataTable({
      responsive: true,
      paging: false,
      info: false,
      searching: true,
      language: {
        search: "Cari Guru:"
      }
    });
  }
}

/**
 * Fungsi Format Persentase & Gradasi Warna HSL (Merah -> Kuning -> Hijau)
 */
function generatePercentBadgeJurnal(persenVal) {
  if (persenVal === undefined || persenVal === null || persenVal === '') {
    return `<span class="badge badge-light text-muted px-2 py-1">-</span>`;
  }

  let percentNum = 0;

  if (typeof persenVal === 'number') {
    percentNum = persenVal <= 1 && persenVal > 0 ? persenVal * 100 : persenVal;
  } else {
    let cleanStr = String(persenVal).replace('%', '').replace(',', '.').trim();
    percentNum = parseFloat(cleanStr);
    if (isNaN(percentNum)) {
      return `<span class="badge badge-light text-muted px-2 py-1">-</span>`;
    }
    if (percentNum <= 1 && percentNum > 0 && !String(persenVal).includes('%')) {
      percentNum = percentNum * 100;
    }
  }

  let clampedNum = Math.min(Math.max(percentNum, 0), 100);
  const hue = Math.round(clampedNum * 1.2);

  const bgColor = `hsl(${hue}, 85%, 88%)`;
  const textColor = `hsl(${hue}, 100%, 20%)`;
  const borderColor = `hsl(${hue}, 65%, 45%)`;

  return `<span class="badge px-3 py-1 font-weight-bold" style="background-color: ${bgColor} !important; color: ${textColor} !important; border: 1px solid ${borderColor} !important; font-size: 0.88rem;">${percentNum.toFixed(2)}%</span>`;
}
