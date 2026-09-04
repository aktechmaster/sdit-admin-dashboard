// ==========================================
// UNIVERSAL TABLE HANDLER ENGINE SDIT AL-KAUTSAR
// ==========================================

class DataTableEngine {
  constructor(options) {
    this.containerId = options.containerId; // ID elemen HTML penampung tabel
    this.columns = options.columns;         // Array definisi kolom: [{ title: 'Nama', field: 'nama', filterable: true }]
    this.originalData = options.data || []; // Data mentah asli
    this.filteredData = [...this.originalData];
    
    this.rowsPerPageOptions = [10, 20, 30, 100];
    this.rowsPerPage = options.defaultRowsPerPage || 10;
    this.currentPage = 1;
    this.columnFilters = {};
    this.globalSearchQuery = "";

    this.render();
  }

  // Setel data baru (misal setelah fetch API/CRUD)
  setData(newData) {
    this.originalData = newData || [];
    this.applyFilters();
  }

  // Terapkan semua pencarian dan filter kolom
  applyFilters() {
    this.filteredData = this.originalData.filter(row => {
      // 1. Filter Global
      if (this.globalSearchQuery) {
        const matchGlobal = Object.values(row).some(val =>
          String(val).toLowerCase().includes(this.globalSearchQuery)
        );
        if (!matchGlobal) return false;
      }

      // 2. Filter Per Kolom
      for (let field in this.columnFilters) {
        const filterVal = this.columnFilters[field];
        if (filterVal) {
          const cellVal = String(row[field] || "").toLowerCase();
          if (!cellVal.includes(filterVal)) return false;
        }
      }

      return true;
    });

    this.currentPage = 1; // Kembali ke halaman 1 setiap kali filter berubah
    this.renderBodyAndPagination();
  }

  // Render Struktur Utama Tabel
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    let html = `
      <div class="card card-outline card-primary shadow-sm mb-4">
        <div class="card-body p-3">
          
          <!-- Control Bar Atas (Pencarian & Reset) -->
          <div class="row mb-3 align-items-center">
            <div class="col-md-4 mb-2 mb-md-0">
              <div class="input-group input-group-sm">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fas fa-search"></i></span>
                </div>
                <input type="text" id="${this.containerId}_globalSearch" class="form-control" placeholder="Cari di semua kolom...">
              </div>
            </div>
            <div class="col-md-8 text-md-right">
              <button id="${this.containerId}_btnReset" class="btn btn-sm btn-outline-secondary">
                <i class="fas fa-undo mr-1"></i> Reset Filter
              </button>
            </div>
          </div>

          <!-- Pembungkus Tabel dengan Scroll Horizontal & Sticky Header -->
          <div class="table-responsive-custom">
            <table class="table table-bordered table-striped table-hover table-sm table-freeze-header m-0">
              <thead>
                <!-- Baris Judul Kolom -->
                <tr>
                  <th style="width: 50px;" class="text-center">No</th>
                  ${this.columns.map(col => `<th>${col.title}</th>`).join('')}
                </tr>
                <!-- Baris Filter per Kolom -->
                <tr class="filter-row">
                  <th class="text-center">#</th>
                  ${this.columns.map(col => `
                    <th>
                      ${col.filterable !== false ? `
                        <input type="text" 
                               class="form-control column-filter" 
                               data-field="${col.field}" 
                               placeholder="Filter...">
                      ` : ''}
                    </th>
                  `).join('')}
                </tr>
              </thead>
              <tbody id="${this.containerId}_tbody">
                <!-- Data akan di-render dinamis -->
              </tbody>
            </table>
          </div>

          <!-- Control Bar Bawah (Paginasi & Informasi Total) -->
          <div class="table-pagination-wrapper">
            <div class="d-flex align-items-center">
              <span class="mr-2 text-sm text-muted">Tampilkan:</span>
              <select id="${this.containerId}_rowsPerPage" class="custom-select custom-select-sm" style="width: auto;">
                ${this.rowsPerPageOptions.map(opt => `
                  <option value="${opt}" ${opt === this.rowsPerPage ? 'selected' : ''}>${opt}</option>
                `).join('')}
              </select>
              <span class="ml-2 text-sm text-muted">baris</span>
            </div>

            <div class="table-pagination-info" id="${this.containerId}_info">
              Menampilkan 0-0 dari 0 data
            </div>

            <nav>
              <ul class="pagination pagination-sm m-0" id="${this.containerId}_pagination">
                <!-- Tombol Halaman di-render dinamis -->
              </ul>
            </nav>
          </div>

        </div>
      </div>
    `;

    container.innerHTML = html;
    this.bindEvents();
    this.renderBodyAndPagination();
  }

  // Hubungkan event listener input dan tombol
  bindEvents() {
    const globalSearchInput = document.getElementById(`${this.containerId}_globalSearch`);
    const btnReset = document.getElementById(`${this.containerId}_btnReset`);
    const rowsPerPageSelect = document.getElementById(`${this.containerId}_rowsPerPage`);
    const container = document.getElementById(this.containerId);

    // Event Global Search
    globalSearchInput.addEventListener('input', (e) => {
      this.globalSearchQuery = e.target.value.toLowerCase().trim();
      this.applyFilters();
    });

    // Event Filter per Kolom
    const columnInputs = container.querySelectorAll('.column-filter');
    columnInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const field = e.target.getAttribute('data-field');
        this.columnFilters[field] = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    });

    // Event Reset Filter
    btnReset.addEventListener('click', () => {
      this.globalSearchQuery = "";
      this.columnFilters = {};
      globalSearchInput.value = "";
      columnInputs.forEach(input => input.value = "");
      this.applyFilters();
    });

    // Event Ganti Jumlah Baris Per Halaman
    rowsPerPageSelect.addEventListener('change', (e) => {
      this.rowsPerPage = parseInt(e.target.value, 10);
      this.currentPage = 1;
      this.renderBodyAndPagination();
    });
  }

  // Render Baris Data dan Tombol Paginasi
  renderBodyAndPagination() {
    const tbody = document.getElementById(`${this.containerId}_tbody`);
    const info = document.getElementById(`${this.containerId}_info`);
    const pagination = document.getElementById(`${this.containerId}_pagination`);

    const totalRecords = this.filteredData.length;
    
    if (totalRecords === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="${this.columns.length + 1}" class="text-center text-muted py-4">
            Tidak ada data yang ditemukan
          </td>
        </tr>
      `;
      info.textContent = "Menampilkan 0-0 dari 0 data";
      pagination.innerHTML = "";
      return;
    }

    const totalPages = Math.ceil(totalRecords / this.rowsPerPage);
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = Math.min(startIndex + this.rowsPerPage, totalRecords);
    const pageData = this.filteredData.slice(startIndex, endIndex);

    // Render Data Baris
    let tbodyHtml = "";
    pageData.forEach((row, idx) => {
      const rowNum = startIndex + idx + 1;
      tbodyHtml += `
        <tr>
          <td class="text-center font-weight-bold">${rowNum}</td>
          ${this.columns.map(col => {
            let cellContent = row[col.field] !== undefined && row[col.field] !== null ? row[col.field] : '';
            if (col.render) {
              cellContent = col.render(cellContent, row);
            }
            return `<td>${cellContent}</td>`;
          }).join('')}
        </tr>
      `;
    });
    tbody.innerHTML = tbodyHtml;

    // Render Informasi Teks
    info.textContent = `Menampilkan ${startIndex + 1}-${endIndex} dari ${totalRecords} data`;

    // Render Tombol Paginasi
    let pagHtml = "";
    
    // Tombol Prev
    pagHtml += `
      <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage - 1}">Sebelumnya</a>
      </li>
    `;

    // Tombol Angka Halaman
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= this.currentPage - 1 && p <= this.currentPage + 1)) {
        pagHtml += `
          <li class="page-item ${p === this.currentPage ? 'active' : ''}">
            <a class="page-link" href="#" data-page="${p}">${p}</a>
          </li>
        `;
      } else if (p === this.currentPage - 2 || p === this.currentPage + 2) {
        pagHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
      }
    }

    // Tombol Next
    pagHtml += `
      <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" data-page="${this.currentPage + 1}">Selanjutnya</a>
      </li>
    `;

    pagination.innerHTML = pagHtml;

    // Event Listener Klik Paginasi
    const pagLinks = pagination.querySelectorAll('.page-link');
    pagLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = parseInt(e.target.getAttribute('data-page'), 10);
        if (targetPage && targetPage !== this.currentPage && targetPage >= 1 && targetPage <= totalPages) {
          this.currentPage = targetPage;
          this.renderBodyAndPagination();
        }
      });
    });
  }
}
