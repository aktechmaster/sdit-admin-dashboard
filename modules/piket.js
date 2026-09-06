/**
 * Modul Rekap Tugas Piket Guru - SDIT Al-Kautsar
 * Menampilkan rincian tugas piket dan piket digantikan per guru dengan Freeze Header
 */

async function initPiketModule() {
  $('#pageTitle').text('Rincian Rekap Piket Guru');

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

    <div class="card card-outline card-info">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-user-clock mr-2"></i>Data Rekap Piket Guru</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" onclick="initPiketModule()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div id="tableSpinner" class="text-center my-4 p-3">
          <i class="fas fa-spinner fa-spin fa-2x text-info"></i>
          <p class="mt-2 text-muted">Memuat data Rekap Piket...</p>
        </div>
        
        <!-- Wadah Tabel dengan Freeze Header -->
        <div class="table-responsive table-freeze-container">
          <table id="tablePiket" class="table table-bordered table-striped table-hover mb-0" style="width:100%">
            <thead class="thead-light">
              <tr>
                <th style="width: 50px" class="text-center">No</th>
                <th>Nama Lengkap</th>
                <th class="text-center">Piket</th>
                <th class="text-center">Digantikan</th>
              </tr>
            </thead>
            <tbody id="tbodyPiket">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  try {
    const url = `${API_URL}?action=read&sheet=${encodeURIComponent('Piket')}`;
    const response = await fetch(url);
    const result = await response.json();

    $('#tableSpinner').addClass('d-none');

    if (result.status === 'success' && Array.isArray(result.data)) {
      renderTablePiket(result.data);
    } else {
      $('#tbodyPiket').html(`<tr><td colspan="4" class="text-center text-muted p-3">Gagal memuat data atau sheet kosong.</td></tr>`);
    }
  } catch (error) {
    console.error('Error Piket:', error);
    $('#tableSpinner').addClass('d-none');
    $('#tbodyPiket').html(`<tr><td colspan="4" class="text-center text-danger p-3">Terjadi kesalahan saat terhubung ke server.</td></tr>`);
  }
}

function renderTablePiket(rawData) {
  if (rawData.length <= 1) {
    $('#tbodyPiket').html(`<tr><td colspan="4" class="text-center text-muted p-3">Tidak ada data ditemukan.</td></tr>`);
    return;
  }

  let rowsHtml = '';
  let noUrut = 1;

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 2) continue;

    const no = row[0] || noUrut;
    const nama = String(row[1] || '').trim();
    const piket = parseInt(row[2]) || 0;
    const digantikan = parseInt(row[3]) || 0;

    if (!nama || nama.toLowerCase().includes('total') || nama.toLowerCase().includes('rerata')) {
      continue;
    }

    const badgePiket = piket > 0 
      ? `<span class="badge badge-info px-3 py-1 font-weight-bold">${piket}</span>`
      : `<span class="badge badge-light text-muted px-2 py-1">0</span>`;

    const badgeDigantikan = digantikan > 0 
      ? `<span class="badge badge-warning px-3 py-1 font-weight-bold">${digantikan}</span>`
      : `<span class="badge badge-light text-muted px-2 py-1">0</span>`;

    rowsHtml += `
      <tr>
        <td class="text-center">${no}</td>
        <td class="font-weight-bold">${nama}</td>
        <td class="text-center">${badgePiket}</td>
        <td class="text-center">${badgeDigantikan}</td>
      </tr>
    `;
    noUrut++;
  }

  $('#tbodyPiket').html(rowsHtml);

  if ($.fn.DataTable) {
    if ($.fn.DataTable.isDataTable('#tablePiket')) {
      $('#tablePiket').DataTable().destroy();
    }
    $('#tablePiket').DataTable({
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
