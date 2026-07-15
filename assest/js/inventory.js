// ---- Minimal JS: live search + category/status filter ----
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const rows = Array.from(document.querySelectorAll('#productTable tbody tr'));
  const visibleCount = document.getElementById('visibleCount');
 
  function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    const cat = categoryFilter.value;
    const status = statusFilter.value;
    let shown = 0;
 
    rows.forEach(row => {
      const matchesTerm = row.dataset.name.toLowerCase().includes(term);
      const matchesCat = !cat || row.dataset.category === cat;
      const matchesStatus = !status || row.dataset.status === status;
      const visible = matchesTerm && matchesCat && matchesStatus;
      row.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
 
    visibleCount.textContent = shown;
  }
 
  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
 
  // ---- Minimal JS: show a toast after "saving" a new product ----
  document.getElementById('saveProductBtn').addEventListener('click', function () {
    const modalEl = document.getElementById('addProductModal');
    bootstrap.Modal.getInstance(modalEl).hide();
    const toast = new bootstrap.Toast(document.getElementById('saveToast'));
    toast.show();
  });
 
  // ---- Minimal JS: Stock In / Stock Out / Stock Adjustment confirm buttons ----
  document.querySelectorAll('.qa-save-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const modalEl = this.closest('.modal');
      bootstrap.Modal.getInstance(modalEl).hide();
      const toast = new bootstrap.Toast(document.getElementById('saveToast'));
      toast.show();
    });
  });