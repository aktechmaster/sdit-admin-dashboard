/**
 * Modul Jurnal Bulanan - SDIT Al-Kautsar
 * Menampilkan rincian capaian jurnal umum bulanan per guru dengan Freeze Header & Dynamic Color Scale
 */

async function initJurnalFixModule() {
  $('#pageTitle').text('Rincian Jurnal Umum Bulanan');

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

    <div class="card card-outline card-success">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-calendar-alt mr-2"></i>Data Jurnal Umum Bulanan Guru</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" onclick="initJurnalFixModule()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div id="tableSpinner" class="text-center my-4 p-3">
          <i class="fas fa-spinner fa-spin fa-2x text-success"></i>
          <p class="mt-2 text-muted">Memuat data Jurnal Bulanan...</p>
        </div>
        
        <div class="table-responsive table-freeze-container">
          <table id="tableJurnalFix" class="table table-bordered table-striped table-hover mb-0" style="width:100%">
            <thead class="thead-light">
              <tr>
                <th style="width: 50px" class="text-center">No</th>
                <th>Nama Lengkap</th>
                <th class="text-center">Jumlah Per Bulan</th>
                <th class="text-center">Jumlah Diisi</th>
                <th class="text-center">Persentase</th>
              </tr>
            </thead>
            <tbody id="tbodyJurnalFix">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  try {
    const url = `${API_URL}?action=read&sheet=${encodeURIComponent('Jurnal fix')}`;
    const response = await fetch(url);
    const result = await response.json();

    $('#tableSpinner').addClass('d-none');

    if (result.status === 'success' && Array.isArray(result.data)) {
      renderTableJurnalFix(result.data);
    } else {
      $('#tbodyJurnalFix').html(`<tr><td colspan="5" class="text-center text-muted p-3">Gagal memuat data atau sheet kosong.</td></tr>`);
    }
  } catch (error) {
    console.error('Error Jurnal Fix:', error);
    $('#tableSpinner').addClass('d-none');
    $('#tbodyJurnalFix').html(`<tr><td colspan="5" class="text-center text-danger p-3">Terjadi kesalahan saat terhubung ke server.</td></tr>`);
  }
}

function renderTableJurnalFix(rawData) {
  if (rawData.length <= 1) {
    $('#tbodyJurnalFix').html(`<tr><td colspan="5" class="text-center text-muted p-3">Tidak ada data ditemukan.</td></tr>`);
    return;
  }

  let rowsHtml = '';

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 2) continue;

    const no = row[0] || i;
    const nama = String(row[1] || '').trim();
    const jumlahPerbulan = row[2] !== undefined ? row[2] : '0';
    const jumlahDiisi = row[3] !== undefined ? row[3] : '0';
    let persenVal = row[4] !== undefined ? row[4] : '0';

    if (!nama || nama.toLowerCase().includes('total') || nama.toLowerCase().includes('rerata') || nama.toLowerCase().includes('september')) {
      continue;
    }

    // Generate badge persentase dengan gradasi warna otomatis
    const badgePersen = generatePercentBadge(persenVal);

    rowsHtml += `
      <tr>
        <td class="text-center">${no}</td>
        <td class="font-weight-bold">${nama}</td>
        <td class="text-center">${jumlahPerbulan}</td>
        <td class="text-center">${jumlahDiisi}</td>
        <td class="text-center">${badgePersen}</td>
      </tr>
    `;
  }

  $('#tbodyJurnalFix').html(rowsHtml);

  if ($.fn.DataTable) {
    if ($.fn.DataTable.isDataTable('#tableJurnalFix')) {
      $('#tableJurnalFix').DataTable().destroy();
    }
    $('#tableJurnalFix').DataTable({
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
 * Fungsi Pembantu: Menghitung & Mengembalikan Badge Gradasi Warna (Merah -> Kuning -> Hijau)
 */
function generatePercentBadge(persenVal) {
  let percentNum = 0;

  if (typeof persenVal === 'number') {
    percentNum = persenVal <= 1 && persenVal > 0 ? persenVal * 100 : persenVal;
  } else if (persenVal) {
    let cleanStr = String(persenVal).replace('%', '').replace(',', '.').trim();
    percentNum = parseFloat(cleanStr) || 0;
    if (percentNum <= 1 && percentNum > 0 && !String(persenVal).includes('%')) {
      percentNum = percentNum * 100;
    }
  }

  // Kunci batas rentang nilai antara 0% sampai 100%
  let clampedNum = Math.min(Math.max(percentNum, 0), 100);

  // Kalkulasi Sudut Warna HSL (0 = Merah, 60 = Kuning, 120 = Hijau)
  const hue = Math.round(clampedNum * 1.2);

  // Kombinasi warna latar pastel dan teks yang kontras
  const bgColor = `hsl(${hue}, 85%, 88%)`;
  const textColor = `hsl(${hue}, 100%, 20%)`;
  const borderColor = `hsl(${hue}, 65%, 45%)`;

  return `<span class="badge px-3 py-1 font-weight-bold" style="background-color: ${bgColor}; color: ${textColor}; border: 1px solid ${borderColor}; font-size: 0.88rem;">${percentNum.toFixed(2)}%</span>`;
}
