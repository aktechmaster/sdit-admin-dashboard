/**
 * Modul Rekap Kelas - SDIT Al-Kautsar
 * Menampilkan rincian rekap kehadiran per kelas dengan Freeze Header & Dynamic Color
 */

async function initRekapKelasModule() {
  $('#pageTitle').text('Rincian Rekap Kehadiran Kelas');

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

    <div class="card card-outline card-primary">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-clipboard-list mr-2"></i>Data Rekap Kehadiran Kelas</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" onclick="initRekapKelasModule()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div id="tableSpinner" class="text-center my-4 p-3">
          <i class="fas fa-spinner fa-spin fa-2x text-primary"></i>
          <p class="mt-2 text-muted">Memuat data Rekap Kehadiran Kelas...</p>
        </div>
        
        <!-- Wadah Tabel dengan Freeze Header -->
        <div class="table-responsive table-freeze-container">
          <table id="tableRekapKelas" class="table table-bordered table-striped table-hover mb-0" style="width:100%">
            <thead class="thead-light">
              <tr>
                <th style="width: 50px" class="text-center">No</th>
                <th>Kelas</th>
                <th class="text-center">Jumlah Isi</th>
                <th class="text-center">Total Pertemuan</th>
                <th class="text-center">Rata-Rata Kehadiran</th>
              </tr>
            </thead>
            <tbody id="tbodyRekapKelas">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  try {
    const url = `${API_URL}?action=read&sheet=${encodeURIComponent('Rekap Kelas')}`;
    const response = await fetch(url);
    const result = await response.json();

    $('#tableSpinner').addClass('d-none');

    if (result.status === 'success' && Array.isArray(result.data)) {
      renderTableRekapKelas(result.data);
    } else {
      $('#tbodyRekapKelas').html(`<tr><td colspan="5" class="text-center text-muted p-3">Gagal memuat data atau sheet kosong.</td></tr>`);
    }
  } catch (error) {
    console.error('Error Rekap Kelas:', error);
    $('#tableSpinner').addClass('d-none');
    $('#tbodyRekapKelas').html(`<tr><td colspan="5" class="text-center text-danger p-3">Terjadi kesalahan saat terhubung ke server.</td></tr>`);
  }
}

function renderTableRekapKelas(rawData) {
  if (rawData.length <= 1) {
    $('#tbodyRekapKelas').html(`<tr><td colspan="5" class="text-center text-muted p-3">Tidak ada data ditemukan.</td></tr>`);
    return;
  }

  let rowsHtml = '';
  let noUrut = 1;

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 2) continue;

    const no = row[0] || noUrut;
    const kelas = String(row[1] || '').trim();
    const jumlahIsi = row[2] !== undefined ? row[2] : '0';
    const totalPertemuan = row[3] !== undefined ? row[3] : '0';
    let rataKehadiran = row[4];

    // Abaikan jika baris nama kelas kosong atau baris total di bagian bawah
    if (!kelas || kelas.toLowerCase().includes('total') || kelas.toLowerCase().includes('rerata')) {
      continue;
    }

    const badgeKehadiran = generatePercentBadgeRekap(rataKehadiran);

    rowsHtml += `
      <tr>
        <td class="text-center">${no}</td>
        <td class="font-weight-bold">${kelas}</td>
        <td class="text-center">${jumlahIsi}</td>
        <td class="text-center">${totalPertemuan}</td>
        <td class="text-center">${badgeKehadiran}</td>
      </tr>
    `;
    noUrut++;
  }

  $('#tbodyRekapKelas').html(rowsHtml);

  if ($.fn.DataTable) {
    if ($.fn.DataTable.isDataTable('#tableRekapKelas')) {
      $('#tableRekapKelas').DataTable().destroy();
    }
    $('#tableRekapKelas').DataTable({
      responsive: true,
      paging: false,
      info: false,
      searching: true,
      language: {
        search: "Cari Kelas:"
      }
    });
  }
}

/**
 * Format Persentase & Gradasi Warna HSL (Merah -> Kuning -> Hijau)
 */
function generatePercentBadgeRekap(persenVal) {
  if (persenVal === undefined || persenVal === null || String(persenVal).trim() === '') {
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
