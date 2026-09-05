/**
 * Modul Jurnal Harian - SDIT Al-Kautsar
 * Menampilkan rincian capaian jurnal harian per guru dengan Freeze Header
 */

async function initJurnalHarianModule() {
  // Update Judul Halaman sesuai ID di dashboard.html
  $('#pageTitle').text('Rincian Jurnal Umum & T2Q Harian');

  const contentArea = $('#mainContent');
  
  // Render Struktur Card, Style Sticky Header, & Tabel
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
        <h3 class="card-title"><i class="fas fa-calendar-day mr-2"></i>Data Jurnal Harian Guru</h3>
        <div class="card-tools">
          <button type="button" class="btn btn-tool" onclick="initJurnalHarianModule()">
            <i class="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <div id="tableSpinner" class="text-center my-4 p-3">
          <i class="fas fa-spinner fa-spin fa-2x text-info"></i>
          <p class="mt-2 text-muted">Memuat data Jurnal Harian...</p>
        </div>
        
        <!-- Pembungkus Tabel dengan Fitur Freeze Header -->
        <div class="table-responsive table-freeze-container">
          <table id="tableJurnalHarian" class="table table-bordered table-striped table-hover mb-0" style="width:100%">
            <thead class="thead-light">
              <tr>
                <th style="width: 50px" class="text-center">No</th>
                <th>Nama Lengkap</th>
                <th class="text-center">Yang Harus Diisi</th>
                <th class="text-center">Realisasi</th>
                <th class="text-center">Selisih</th>
              </tr>
            </thead>
            <tbody id="tbodyJurnalHarian">
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `);

  try {
    const url = `${API_URL}?action=read&sheet=${encodeURIComponent('Jurnal Harian')}`;
    const response = await fetch(url);
    const result = await response.json();

    $('#tableSpinner').addClass('d-none');

    if (result.status === 'success' && Array.isArray(result.data)) {
      renderTableJurnalHarian(result.data);
    } else {
      $('#tbodyJurnalHarian').html(`<tr><td colspan="5" class="text-center text-muted p-3">Gagal memuat data atau sheet kosong.</td></tr>`);
    }
  } catch (error) {
    console.error('Error Jurnal Harian:', error);
    $('#tableSpinner').addClass('d-none');
    $('#tbodyJurnalHarian').html(`<tr><td colspan="5" class="text-center text-danger p-3">Terjadi kesalahan saat terhubung ke server.</td></tr>`);
  }
}

function renderTableJurnalHarian(rawData) {
  if (rawData.length <= 1) {
    $('#tbodyJurnalHarian').html(`<tr><td colspan="5" class="text-center text-muted p-3">Tidak ada data ditemukan.</td></tr>`);
    return;
  }

  let rowsHtml = '';

  for (let i = 1; i < rawData.length; i++) {
    const row = rawData[i];
    if (!row || row.length < 2) continue;

    const no = row[0] || i;
    const nama = row[1] || '';
    const harusDiisi = row[2] !== undefined ? row[2] : '0';
    const realisasi = row[3] !== undefined ? row[3] : '0';
    const selisih = String(row[4] || '').trim();

    if (nama.toLowerCase().includes('total') || nama.toLowerCase().includes('rerata')) {
      continue;
    }

    let badgeSelisih = '';
    const selisihUpper = selisih.toUpperCase();

    if (selisihUpper === 'PAS' || selisih === '0') {
      badgeSelisih = `<span class="badge badge-success px-3 py-1"><i class="fas fa-check-circle mr-1"></i>PAS</span>`;
    } else if (selisih !== '') {
      badgeSelisih = `<span class="badge badge-danger px-3 py-1">${selisih}</span>`;
    } else {
      badgeSelisih = `<span class="badge badge-secondary px-3 py-1">-</span>`;
    }

    rowsHtml += `
      <tr>
        <td class="text-center">${no}</td>
        <td class="font-weight-bold">${nama}</td>
        <td class="text-center">${harusDiisi}</td>
        <td class="text-center">${realisasi}</td>
        <td class="text-center">${badgeSelisih}</td>
      </tr>
    `;
  }

  $('#tbodyJurnalHarian').html(rowsHtml);

  if ($.fn.DataTable) {
    if ($.fn.DataTable.isDataTable('#tableJurnalHarian')) {
      $('#tableJurnalHarian').DataTable().destroy();
    }
    $('#tableJurnalHarian').DataTable({
      responsive: true,
      paging: false,       // Dimatikan agar scroll internal aktif sepenuhnya
      info: false,         // Menghilangkan ringkasan info halaman bawah
      searching: true,     // Pencarian tetap aktif
      language: {
        search: "Cari Guru:"
      }
    });
  }
}
