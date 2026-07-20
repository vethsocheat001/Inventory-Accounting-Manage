/* ==========================================================
   productManagement.js — Product list, categories, suppliers.
   In-memory demo data, same interaction pattern as
   employeeManagement.js.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg){
    if(!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

let categories = [
  'ភេសជ្ជៈ',
  'អាហារសម្រន់',
  'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ',
  'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន'
];

let suppliers = [
  'ក្រុមហ៊ុនចែកចាយ ABC',
  'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន',
  'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ'
];

let products = [
  { id: 1,  name: 'កូកា-កូឡា 330ml',      category: 'ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.75, active: true },
  { id: 2,  name: 'Fan Ta 330ml', category: 'ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.75, active: true },
  { id: 3,  name: 'ទឹកសុទ្ធ 500ml',       category: 'ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 0.40, active: true },
  { id: 4,  name: 'ទឹកក្រូច',            category: 'ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.20, active: true },
  { id: 5,  name: 'ទឹកផ្លែប៉ោម',         category: 'ភេសជ្ជៈ', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.30, active: true },

  { id: 6,  name: 'មីកញ្ចប់',            category: 'អាហារសម្រន់', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.55, active: true },
  { id: 7,  name: 'នំប៉័ង',              category: 'អាហារសម្រន់', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 0.80, active: true },
  { id: 8,  name: 'នំប៊ីស្គីត',           category: 'អាហារសម្រន់', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 1.20, active: true },
  { id: 9,  name: 'ដំឡូងបំពង',           category: 'អាហារសម្រន់', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 1.50, active: false },
  { id: 10, name: 'សណ្តែកដីលីង',         category: 'អាហារសម្រន់', supplier: 'ក្រុមហ៊ុនចែកចាយ ABC', price: 1.00, active: true },

  { id: 11, name: 'អង្ករ 25kg',          category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 20.00, active: true },
  { id: 12, name: 'ប្រេងឆា 1L',          category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 2.80, active: true },
  { id: 13, name: 'ទឹកត្រី',             category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.60, active: true },
  { id: 14, name: 'ទឹកស៊ីអ៊ីវ',          category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.50, active: false },
  { id: 15, name: 'ស្ករស 1kg',           category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.40, active: true },

  { id: 16, name: 'អំបិល 1kg',           category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 0.60, active: true },
  { id: 17, name: 'សាប៊ូបោកខោអាវ',      category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 4.50, active: true },
  { id: 18, name: 'សាប៊ូលាងចាន',         category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 2.30, active: true },
  { id: 19, name: 'ក្រដាសអនាម័យ',        category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.80, active: true },
  { id: 20, name: 'ថង់សំរាម',            category: 'សម្ភារៈប្រើប្រាស់ក្នុងផ្ទះ', supplier: 'ក្រុមហ៊ុនផ្គត់ផ្គង់ មេគង្គ', price: 1.20, active: false },

  { id: 21, name: 'សាប៊ូដុសខ្លួន',        category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.50, active: true },
  { id: 22, name: 'សាប៊ូកក់សក់',         category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 3.50, active: true },
  { id: 23, name: 'ថ្នាំដុសធ្មេញ',        category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 2.20, active: true },
  { id: 24, name: 'ច្រាសដុសធ្មេញ',        category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.00, active: true },
  { id: 25, name: 'ឡេការពារកម្ដៅថ្ងៃ',    category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 5.50, active: false },
  { id: 26, name: 'ឡេលាបខ្លួន',          category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 4.80, active: true },
  { id: 27, name: 'កន្សែងសើម',           category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 1.70, active: true },
  { id: 28, name: 'ទឹកអប់',              category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 8.50, active: true },
  { id: 29, name: 'សាប៊ូលាងដៃ',          category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 2.10, active: false },
  { id: 30, name: 'ទឹកខ្ពុរមាត់',         category: 'ផលិតផលថែរក្សាផ្ទាល់ខ្លួន', supplier: 'ក្រុមហ៊ុនពាណិជ្ជកម្ម ហ្គោលដិន', price: 3.20, active: true }
];
  let nextId = products.length + 1;

  const tbody = document.getElementById('productTableBody');
  const searchInput = document.getElementById('productSearch');
  const categorySelect = document.getElementById('productCategory');
  const supplierSelect = document.getElementById('productSupplier');
  const categoryList = document.getElementById('categoryList');
  const supplierList = document.getElementById('supplierList');

  function fillSelect(select, items){
    select.innerHTML = items.map(i => `<option value="${i}">${i}</option>`).join('');
  }

  function renderCategoryList(){
    categoryList.innerHTML = categories.map((c, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center px-0">
        <span class="small">${c}</span>
        <button class="btn btn-sm btn-light border rounded-3 text-danger" data-remove-category="${i}"><i class="bi bi-trash"></i></button>
      </li>`).join('');
  }

  function renderSupplierList(){
    supplierList.innerHTML = suppliers.map((s, i) => `
      <li class="list-group-item d-flex justify-content-between align-items-center px-0">
        <span class="small">${s}</span>
        <button class="btn btn-sm btn-light border rounded-3 text-danger" data-remove-supplier="${i}"><i class="bi bi-trash"></i></button>
      </li>`).join('');
  }

  function refreshLookups(){
    fillSelect(categorySelect, categories);
    fillSelect(supplierSelect, suppliers);
    renderCategoryList();
    renderSupplierList();
  }

  function renderKpis(){
    document.getElementById('kpiTotal').textContent = products.length;
    document.getElementById('kpiActive').textContent = products.filter(p => p.active).length;
    document.getElementById('kpiInactive').textContent = products.filter(p => !p.active).length;
    document.getElementById('kpiCategories').textContent = new Set(products.map(p => p.category)).size;
  }

  function renderTable(){
    const query = (searchInput.value || '').trim().toLowerCase();
    const rows = products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.supplier.toLowerCase().includes(query)
    );

    tbody.innerHTML = '';
    if(rows.length === 0){
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-secondary py-4">No products found</td></tr>`;
      return;
    }

    rows.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="fw-semibold small">${p.name}</td>
        <td><span class="badge rounded-pill bg-secondary-subtle text-secondary">${p.category}</span></td>
        <td class="small text-secondary">${p.supplier}</td>
        <td class="small">$${p.price.toFixed(2)}</td>
        <td>
          <span class="badge rounded-pill ${p.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
            ${p.active ? 'Selling' : 'Stopped'}
          </span>
        </td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm btn-light border rounded-3" data-action="edit" data-id="${p.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="toggle" data-id="${p.id}" title="${p.active ? 'Stop selling' : 'Resume selling'}">
              <i class="bi ${p.active ? 'bi-toggle-on text-success' : 'bi-toggle-off text-secondary'}"></i>
            </button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="delete" data-id="${p.id}" title="Delete"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAll(){
    renderKpis();
    renderTable();
  }

  searchInput.addEventListener('input', renderTable);

  /* ---------------- Add / Edit product modal ---------------- */
  const productModalEl = document.getElementById('productModal');
  const productModal = new bootstrap.Modal(productModalEl);
  const productForm = document.getElementById('productForm');
  const productModalTitle = document.getElementById('productModalTitle');

  document.getElementById('addProductBtn').addEventListener('click', () => {
    productModalTitle.textContent = 'Add Product';
    productForm.reset();
    document.getElementById('productId').value = '';
    document.getElementById('productActive').checked = true;
    refreshLookups();
  });

  document.getElementById('saveProductBtn').addEventListener('click', () => {
    if(!productForm.reportValidity()) return;

    const id = document.getElementById('productId').value;
    const name = document.getElementById('productName').value.trim();
    const category = categorySelect.value;
    const supplier = supplierSelect.value;
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const active = document.getElementById('productActive').checked;

    if(id){
      const p = products.find(x => x.id === Number(id));
      if(p){ Object.assign(p, { name, category, supplier, price, active }); }
      notify('Product updated');
    } else {
      products.push({ id: nextId++, name, category, supplier, price, active });
      notify('Product added');
    }

    productModal.hide();
    renderAll();
  });

  /* ---------------- Row actions ---------------- */
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if(!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    const p = products.find(x => x.id === id);
    if(!p) return;

    if(action === 'edit'){
      refreshLookups();
      productModalTitle.textContent = 'Edit Product';
      document.getElementById('productId').value = p.id;
      document.getElementById('productName').value = p.name;
      categorySelect.value = p.category;
      supplierSelect.value = p.supplier;
      document.getElementById('productPrice').value = p.price;
      document.getElementById('productActive').checked = p.active;
      productModal.show();

    } else if(action === 'toggle'){
      p.active = !p.active;
      notify(p.active ? `${p.name} is selling again` : `${p.name} stopped`);
      renderAll();

    } else if(action === 'delete'){
      if(confirm(`Delete ${p.name}? This cannot be undone.`)){
        products = products.filter(x => x.id !== id);
        notify(`${p.name} deleted`);
        renderAll();
      }
    }
  });

  /* ---------------- Categories ---------------- */
  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    const input = document.getElementById('newCategoryInput');
    const val = input.value.trim();
    if(!val) return;
    if(!categories.includes(val)) categories.push(val);
    input.value = '';
    refreshLookups();
    notify('Category added');
  });

  categoryList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-remove-category]');
    if(!btn) return;
    categories.splice(Number(btn.dataset.removeCategory), 1);
    refreshLookups();
    notify('Category removed');
  });

  /* ---------------- Suppliers ---------------- */
  document.getElementById('addSupplierBtn').addEventListener('click', () => {
    const input = document.getElementById('newSupplierInput');
    const val = input.value.trim();
    if(!val) return;
    if(!suppliers.includes(val)) suppliers.push(val);
    input.value = '';
    refreshLookups();
    notify('Supplier added');
  });

  supplierList.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-remove-supplier]');
    if(!btn) return;
    suppliers.splice(Number(btn.dataset.removeSupplier), 1);
    refreshLookups();
    notify('Supplier removed');
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('You have 3 new notifications'));
  }

  refreshLookups();
  renderAll();
});
