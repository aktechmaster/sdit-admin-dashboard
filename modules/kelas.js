// Modul Manajemen Kelas & Wali Kelas
let dataGuruCache = [];

function initKelasModule() {
  $('#pageTitle').text('Manajemen Kelas & Wali Kelas');

  // HTML Struktur Utama
  const html = `
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between align-items-center">
        <h5 class="m-0 font-weight-bold">Daftar Kelas & Walas</h5>
        <button class="btn btn-primary btn-sm" id="btnTambahKelas">
          <i class="fas fa-plus mr-1"></i> Tambah Kelas
        </button>
      </div>
    </div>
    
    <div class="card card-outline card-primary">
      <div class="card-body table-responsive p-0">
        <table class="table table-hover text-nowrap" id="tableKelas">
          <thead class="bg-light">
            <tr>
              <th style="width: 60px;">No</th>
              <th>Nama Kelas</th>
              <th>Wali Kelas (Walas)</th>
              <th>Wakil Wali Kelas (Wawalas)</th>
              <th style="width: 120px;" class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody id="tbodyKelas">
            <tr><td colspan="5" class="text-center py-4">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Kelas -->
    <div class="modal fade" id="kelasModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title" id="kelasModalTitle">Tambah Data Kelas</h5>
            <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <form id="kelasForm">
            <div class="modal-body">
              <input type="hidden" id="kelasRowIndex" value="">
              
              <div class="form-group">
                <label for="inputKelas">Nama Kelas <span class="text-danger">*</span></label>
                <input type="text" class="form-control" id="inputKelas" placeholder="Contoh: 1 An-Najm 1" required>
              </div>

              <!-- Dropdown Walas -->
              <div class="form-group">
                <label for="selectWalas">Wali Kelas (Walas)</label>
                <select class="form-control select-guru" id="selectWalas">
                  <option value="">-- Pilih Wali Kelas --</option>
                </select>
              </div>

              <!-- Dropdown Wawalas -->
              <div class="form-group">
                <label for="selectWawalas">Wakil Wali Kelas (Wawalas)</label>
                <select class="form-control select-guru" id="selectWawalas">
                  <option value="">-- Pilih Wakil Wali Kelas (Boleh Kosong) --</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary" id="btnSaveKelas">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  $('#mainContent').html(html);

  // Ambil data Guru untuk Dropdown, lalu Muat Tabel Kelas
  loadGuruDropdownAndTable();

  // Event Listener Tombol Tambah
  $('#btnTambahKelas').on('click', function () {
    $('#kelasModalTitle').text('Tambah Data Kelas');
    $('#kelasForm')[0].reset();
    $('#kelasRowIndex').val('');
    $('#kelasModal').modal('show');
  });

  // Event Listener Form Submit (Tambah/Edit)
  $('#kelasForm').on('submit', function (e) {
    e.preventDefault();
    saveDataKelas();
  });
}

// 1. Fungsi Ambil Data Guru dari tab "Biodata" untuk isi Dropdown
function loadGuruDropdownAndTable() {
  // Ambil Biodata dulu
  fetchAPI('read', { sheetName: 'Biodata' }, function (response) {
    if (response && response.status === 'success') {
      // Ambil kolom "Nama Lengkap" dari Biodata (asumsi indeks kolom ke-1/Nama)
      dataGuruCache = response.data.map(row => row['Nama Lengkap'] || row[1]).filter(Boolean);
      populateGuruDropdowns();
    }
    // Setelah dropdown siap, ambil data tabel Kelas
    loadTableKelas();
  });
}

// 2. Render pilihan nama Guru ke elemen <select>
function populateGuruDropdowns() {
  let options = '<option value="">-- Pilih Guru --</option>';
  dataGuruCache.forEach(nama => {
    options += `<option value="${nama}">${nama}</option>`;
  });
  $('.select-guru').html(options);
}

// 3. Ambil data dari tab "Daftar Kelas & Walas"
function loadTableKelas() {
  fetchAPI('read', { sheetName: 'Daftar Kelas & Walas' }, function (response) {
    if (response && response.status === 'success') {
      renderTableKelas(response.data);
    } else {
      $('#tbodyKelas').html('<tr><td colspan="5" class="text-center text-danger">Gagal memuat data kelas.</td></tr>');
    }
  });
}

// 4. Render baris tabel
function renderTableKelas(data) {
  if (data.length === 0) {
    $('#tbodyKelas').html('<tr><td colspan="5" class="text-center">Belum ada data kelas.</td></tr>');
    return;
  }

  let rows = '';
  data.forEach((row, index) => {
    const no = row['No'] || (index + 1);
    const kelas = row['Kelas'] || row[1] || '';
    const walas = row['Walas'] || row[2] || '-';
    const wawalas = row['Wawalas'] || row[3] || '-';

    rows += `
      <tr>
        <td>${no}</td>
        <td class="font-weight-bold">${kelas}</td>
        <td>${walas}</td>
        <td>${wawalas}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-info btn-edit-kelas" data-index="${index}" data-row='${JSON.stringify(row)}'>
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger btn-delete-kelas" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });

  $('#tbodyKelas').html(rows);

  // Event Edit
  $('.btn-edit-kelas').on('click', function () {
    const rowData = $(this).data('row');
    const index = $(this).data('index');

    $('#kelasModalTitle').text('Edit Data Kelas');
    $('#kelasRowIndex').val(index);
    $('#inputKelas').val(rowData['Kelas'] || rowData[1]);
    $('#selectWalas').val(rowData['Walas'] || rowData[2]);
    $('#selectWawalas').val(rowData['Wawalas'] || rowData[3]);

    $('#kelasModal').modal('show');
  });

  // Event Hapus
  $('.btn-delete-kelas').on('click', function () {
    const index = $(this).data('index');
    if (confirm('Yakin ingin menghapus data kelas ini?')) {
      deleteDataKelas(index);
    }
  });
}

// 5. Simpan Data (Tambah/Edit)
function saveDataKelas() {
  const rowIndex = $('#kelasRowIndex').val();
  const payload = {
    sheetName: 'Daftar Kelas & Walas',
    data: {
      'Kelas': $('#inputKelas').val(),
      'Walas': $('#selectWalas').val(),
      'Wawalas': $('#selectWawalas').val()
    }
  };

  const action = rowIndex === '' ? 'create' : 'update';
  if (action === 'update') payload.rowIndex = parseInt(rowIndex);

  $('#btnSaveKelas').prop('disabled', true).text('Menyimpan...');

  fetchAPI(action, payload, function (res) {
    $('#btnSaveKelas').prop('disabled', false).text('Simpan');
    if (res && res.status === 'success') {
      $('#kelasModal').modal('hide');
      loadTableKelas();
    } else {
      alert('Gagal menyimpan data: ' + (res.message || 'Terjadi kesalahan'));
    }
  });
}

// 6. Hapus Data
function deleteDataKelas(rowIndex) {
  fetchAPI('delete', { sheetName: 'Daftar Kelas & Walas', rowIndex: rowIndex }, function (res) {
    if (res && res.status === 'success') {
      loadTableKelas();
    } else {
      alert('Gagal menghapus data.');
    }
  });
}
