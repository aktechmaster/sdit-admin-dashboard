/**
 * Modul Rekap Absensi Guru - SDIT Al-Kautsar
 * Menampilkan rincian absensi guru (Izin, Sakit, Alpa) dengan Freeze Header & Highlight Absen
 */

async function initAbsensiModule() {
  $('#pageTitle').text('Rincian Rekap Absensi Guru');

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

    <div class="card card-outline card-danger">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-user-check mr-2"></i>Data Rekap Absensi Guru</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" onclick="initAbsensiModule()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div id="tableSpinner" class="text-center my-4 p-3">
          <i class="fas fa-spinner fa-spin fa-2x text-danger"></i>
          <p class="mt-2 text-muted">Memuat data Rekap Absensi...</p>
        </div>
        
        <!-- Wadah Tabel dengan Freeze Header -->
        <div class="table-responsive table-freeze-container">
          <table id="tableAbsensi" class="table table-bordered table-striped table-hover mb-0" style="width:100%">
            <thead class="thead-light">
              <tr>
                <th style="width: 50px" class="text-center">No</th>
                <th>Nama Lengkap</th>
                <th class="text-center">Jumlah Absen</th>
                <th class="text-center">Today</th>
                <th class="text-center">Izin</th>
                <th class="text-center">Sakit</th>
                <th class="text-center">Tanpa Keterangan</th>
              </tr>
            </thead>
            <tbody id="tbodyAbsensi">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  try {
    const url = `${API_URL}?action=read&sheet=${encodeURIComponent('Absensi')}`;
    const response = await fetch(url);
    const result = await response.json();

    $('#tableSpinner').addClass('d-none');

    if (result.status === 'success' && Array.isArray(result.data)) {
      renderTableAbsensi(result.data);
    } else {
      $('#tbodyAbsensi').html(`<tr><td colspan="7" class="text-center text-muted p-3">Gagal memuat data atau sheet kosong.</td></tr>`);
    }
  } catch (error) {
    console.error('Error Absensi:', error);
    $('#tableSpinner').addClass('d-none');
    $('#tbodyAbsensi').html(`<tr><td colspan="7" class="text-center text-danger p-3">Terjadi kesalahan saat terhubung ke server.</td></tr>`);
  }
}

function renderTableAbsensi(rawData) {
  if (rawData.length <= 1) {
    $('#tbodyAbsensi').html(`<tr><td colspan="7" class="text-center text-muted p-3">Tidak ada data ditemukan.</td></tr>`);
    return;
  }

  let rowsHtml = '';
  let noUrut = 1;

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 2) continue;

    const no = row[0] || noUrut;
    const nama = String(row[1] || '').trim();
    const jumlahAbsen = parseInt(row[2]) || 0;
    const today = row[3] !== undefined ? row[3] : '0';
    const izin = row[4] !== undefined ? row[4] : '0';
    const sakit = row[5] !== undefined ? row[5] : '0';
    const alpa = row[6] !== undefined ? row[6] : '0';

    if (!nama || nama.toLowerCase().includes('total') || nama.toLowerCase().includes('rerata')) {
      continue;
    }

    // Highlighting Jumlah Absen jika > 0
    const badgeAbsen = jumlahAbsen > 0 
      ? `<span class="badge badge-danger px-3 py-1 font-weight-bold">${jumlahAbsen}</span>`
      : `<span class="badge badge-light text-muted px-2 py-1">0</span>`;

    rowsHtml += `
      <tr>
        <td class="text-center">${no}</td>
        <td class="font-weight-bold">${nama}</td>
        <td class="text-center">${badgeAbsen}</td>
        <td class="text-center">${today}</td>
        <td class="text-center">${izin}</td>
        <td class="text-center">${sakit}</td>
        <td class="text-center">${alpa}</td>
      </tr>
    `;
    noUrut++;
  }

  $('#tbodyAbsensi').html(rowsHtml);

  if ($.fn.DataTable) {
    if ($.fn.DataTable.isDataTable('#tableAbsensi')) {
      $('#tableAbsensi').DataTable().destroy();
    }
    $('#tableAbsensi').DataTable({
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
