


document.querySelectorAll('.sidebar .nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    // ដក Active ពីគ្រប់លីង និងផ្ទាំងចាស់
    document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    
    // បន្ថែម Active លើលីងដែលបានចុច
    this.classList.add('active');
    
    // បង្ហាញផ្ទាំងមាតិកាថ្មី
    const targetTab = this.getAttribute('data-tab');
    const activeContent = document.getElementById(`tab-${targetTab}`);
    if (activeContent) {
      activeContent.classList.add('active');
    }
    
    // ប្តូរចំណងជើង Topbar តាមទំព័រ
    const pageTitle = document.getElementById('pageTitle');
    if(pageTitle) {
      pageTitle.innerText = this.textContent.trim();
    }
  });
});


// កន្ត្រកទំនិញបច្ចុប្បន្ន (Cart State)
let cart = [];

// ១. អនុគមន៍ចុចបន្ថែមផលិតផលចូលកន្ត្រក
function addToCart(id, name, price) {
  const existingItem = cart.find(item => item.id === id);
  
  if (existingItem) {
    existingItem.quantity += 1; // បើមានហើយ បន្ថែមចំនួន ១ ថែមទៀត
  } else {
    cart.push({ id, name, price, quantity: 1 }); // បើអត់ទាន់មាន ថែមមុខទំនិញថ្មី
  }
  
  renderCart();
}

// ២. អនុគមន៍បង្ហាញ និងគណនាទិន្នន័យក្នុងកន្ត្រក
function renderCart() {
  const wrapper = document.getElementById('cart-items-wrapper');
  const emptyMsg = document.getElementById('cart-empty-msg');
  
  if (cart.length === 0) {
    wrapper.innerHTML = `<p class="text-muted small text-center my-3" id="cart-empty-msg">មិនទាន់មានទំនិញ</p>`;
    document.getElementById('summary-subtotal').textContent = "$0.00";
    document.getElementById('summary-total').textContent = "$0.00";
    return;
  }

  let subtotal = 0;
  
  wrapper.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    return `
      <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light-subtle style-desc font-khmer" style="font-size: 0.85rem;">
        <div>
          <div class="fw-bold text-dark">${item.name}</div>
          <small class="text-muted">${item.quantity} x $${item.price.toFixed(2)}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="fw-bold text-dark">$${itemTotal.toFixed(2)}</span>
          <button class="btn btn-sm btn-light py-0 px-1 border-0 text-danger" onclick="removeFromCart(${item.id})"><i class="fa-solid fa-circle-minus"></i></button>
        </div>
      </div>
    `;
  }).join('');

  // បច្ចុប្បន្នភាពតម្លៃសរុប
  document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summary-total').textContent = `$${subtotal.toFixed(2)}`;
}

// ៣. អនុគមន៍ដកមុខទំនិញចេញពីកន្ត្រកម្តងមួយៗ
function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  renderCart();
}

// ៤. អនុគមន៍សម្អាតកន្ត្រកចោលទាំងអស់
function clearCart() {
  cart = [];
  renderCart();
}

// ៥. អនុគមន៍ចុច Checkout -> បើក Modal QR Code ឲ្យអតិថិជនស្កេនទូទាត់សិន
function handleCheckout() {
  if (cart.length === 0) {
    showPosToast("កន្ត្រកទទេ! សូមជ្រើសរើសទំនិញសិន");
    return;
  }

  const totalPrice = document.getElementById('summary-total').textContent;
  openQrPaymentModal(totalPrice);
}

// ៥.១ បើក Modal QR Code (ប្រើ QR ABA KHQR ពិតប្រាកដរបស់ហាង) ព្រមទាំងបង្ហាញចំនួនទឹកប្រាក់ត្រូវទូទាត់
function openQrPaymentModal(totalPrice) {
  const modal = document.getElementById('qrPaymentModal');
  const totalEl = document.getElementById('qrPaymentTotal');
  if (!modal || !totalEl) return;

  totalEl.textContent = totalPrice;
  modal.classList.add('open');
}

function closeQrPaymentModal() {
  const modal = document.getElementById('qrPaymentModal');
  if (modal) modal.classList.remove('open');
}

// ៥.២ ចុច "បានទទួលការទូទាត់" -> បញ្ចប់ការលក់ពិតប្រាកដ (កត់ត្រា invoice + សម្អាតកន្ត្រក)
function confirmQrPayment() {
  if (cart.length === 0) {
    closeQrPaymentModal();
    return;
  }

  // ប្រមូលព័ត៌មានការទូទាត់
  const customerSelect = document.getElementById('pay-customer');
  const customerName = customerSelect.options[customerSelect.selectedIndex].text;
  const paymentSelect = document.getElementById('pay-method-select');
  const paymentMethod = paymentSelect ? paymentSelect.value : '';
  const totalPrice = document.getElementById('summary-total').textContent;

  // បង្កើតបញ្ជីឈ្មោះមុខទំនិញសរុប (ឧ. អង្ករ ៥គីឡូ x2)
  const itemsSummary = cart.map(i => `${i.name} (x${i.quantity})`).join(', ');

  // បង្កើតពេលវេលាបច្ចុប្បន្ន (ម៉ោង:នាទី)
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // ទិន្នន័យវិក្កយបត្រថ្មី
  const newInvoice = {
    item_name: itemsSummary,
    customer: customerName === "ភ្ញៀវទូទៅ" ? "ភ្ញៀវទូទៅ" : customerName,
    payment_method: paymentMethod,
    total_price: totalPrice,
    time: timeStr
  };

  // សន្មតថា currentSales គឺជា Array របាយការណ៍របស់អ្នក (នៅក្នុង Tab Report)
  if (typeof currentSales !== 'undefined') {
    currentSales.unshift(newInvoice); // បញ្ចូលទៅលើគេបង្អស់
    if (typeof renderReportTable === 'function') {
      renderReportTable(currentSales); // ហៅតារាងរបាយការណ៍ឱ្យ Refresh បង្ហាញទិន្នន័យថ្មី
    }
  }

  closeQrPaymentModal();
  clearCart(); // សម្អាតកន្ត្រកទទេវិញ
  showPosToast("លក់ដោយជោគជ័យ! 🎉", 2500);
}

// customers
  let customers = [
    { id: 1, name: "រឹម​ ភារុន", phone: "096 555 123", email: "roun@mail.com", address: "ភ្នំពេញ", hasDebt: true },
    { id: 2, name: "វ៉េត សុជាតិ", phone: "012 888 999", email: "cheak@mail.com", address: "សៀមរាប", hasDebt: false },
    { id: 3, name: "ចាន់​ សារ៉ាក់", phone: "088 777 666", email: "rak@mail.com", address: "បាត់ដំបង", hasDebt: false },
    { id: 3, name: "លីហេង ស៊ីម៉េង", phone: "088 777 666", email: "meng@mail.com", address: "បាត់ដំបង", hasDebt: false }
  ];

  // ចាក់បញ្ចូលឈ្មោះអតិថិជនពិតប្រាកដទៅក្នុងបញ្ជីជ្រើសរើសអតិថិជននៅផ្ទាំងគិតលុយ
  function populatePosCustomerSelect() {
    const select = document.getElementById('pay-customer');
    if (!select) return;
    customers.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = c.name;
      select.appendChild(opt);
    });
  }
  populatePosCustomerSelect();
  function renderCustomers(data = customers) {
    const grid = document.getElementById('custGrid');
    if(data.length === 0) {
      grid.innerHTML = `<div class="col-12 text-center text-muted py-5 font-khmer italic fs-7">មិនមានទិន្នន័យអតិថិជនឡើយ។</div>`;
      return;
    }

    grid.innerHTML = data.map(c => `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100 border border-1 border-light-subtle rounded-3 shadow-sm hover-shadow transition bg-white p-3">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="d-flex align-items-center gap-2">
              <div class="avatar bg-opacity-10 bg-success text-success rounded-circle d-flex align-items-center justify-content-center fw-bold" style="width:36px; height:36px; background-color: #e8f5e9;">
                ${c.name.charAt(0)}
              </div>
              <div>
                <h6 class="mb-0 fw-bold text-dark font-khmer">${c.name}</h6>
                <small class="text-muted" style="font-size: 11px;">ID: #CUST-${c.id}</small>
              </div>
            </div>
            ${c.hasDebt ? '<span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill font-khmer" style="font-size:10px; padding: 4px 8px;">មានបំណុល</span>' : '<span class="badge bg-light text-muted border rounded-pill font-khmer" style="font-size:10px; padding: 4px 8px;">ធម្មតា</span>'}
          </div>
          
          <div class="customer-info my-2 py-2 border-top border-bottom border-light-subtle" style="font-size: 0.85rem;">
            <div class="text-secondary mb-1"><i class="fa-solid fa-phone me-1 text-muted w-20"></i> ${c.phone || '---'}</div>
            <div class="text-secondary mb-1"><i class="fa-solid fa-envelope me-1 text-muted w-20"></i> ${c.email || '---'}</div>
            <div class="text-secondary"><i class="fa-solid fa-location-dot me-1 text-muted w-20"></i> ${c.address || '---'}</div>
          </div>

          <div class="d-flex justify-content-end gap-1 mt-2">
            <button class="btn btn-light btn-sm text-primary border-0 rounded-2" onclick="editCust(${c.id})" data-bs-toggle="modal" data-bs-target="#custModal" title="កែប្រែ">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn btn-light btn-sm text-danger border-0 rounded-2" onclick="deleteCust(${c.id})" title="លុប">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function openCustModal() {
    document.getElementById('custModalTitle').textContent = "បន្ថែមអតិថិជនថ្មី";
    document.getElementById('custId').value = "";
    document.getElementById('custName').value = "";
    document.getElementById('custPhone').value = "";
    document.getElementById('custEmail').value = "";
    document.getElementById('custAddress').value = "";
    document.getElementById('custDebt').checked = false;
  }
function saveCust() {
  const id = document.getElementById('custId').value;
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const hasDebt = document.getElementById('custDebt').checked;

  if (!name) {
    alert("សូមបំពេញឈ្មោះអតិថិជន!");
    return;
  }

  if (id) {
    // ករណីកែប្រែទិន្នន័យ (Edit)
    const index = customers.findIndex(c => c.id == id);
    if (index !== -1) {
      customers[index] = { id: Number(id), name, phone, email, address, hasDebt };
    }
  } else {
    // ករណីបន្ថែមថ្មី (Add)
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customers.push({ id: newId, name, phone, email, address, hasDebt });
  }

  // ១. បច្ចុប្បន្នភាពកាតនៅលើអេក្រង់
  renderCustomers(); 

  // ២. វិធីបិទ Modal បែបកាត់ផ្តាច់ $100\%$ (ដោះស្រាយបញ្ហាគាំង)
  const modalEl = document.getElementById('custModal');
  
  // រកប៊ូតុង X ឬប៊ូតុងបិទ នៅក្នុង Modal រួចបញ្ជាឱ្យវាចុច (Click) ដោយស្វ័យប្រវត្តិ
  const closeBtn = modalEl.querySelector('.btn-close') || modalEl.querySelector('[data-bs-dismiss="modal"]');
  if (closeBtn) {
    closeBtn.click();
  } else {
    // បើស្វែងរកប៊ូតុងមិនឃើញ គឺប្រើវិធីលាក់កំបាំងតាម CSS
    modalEl.classList.remove('show');
    modalEl.style.display = 'none';
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}
  // ៥. អនុគមន៍រុញទិន្នន័យចាស់ចូលក្នុងប្រអប់ដើម្បីកែប្រែ
  function editCust(id) {
    const c = customers.find(cust => cust.id === id);
    if (!c) return;

    document.getElementById('custModalTitle').textContent = "កែប្រែព័ត៌មានអតិថិជន";
    document.getElementById('custId').value = c.id;
    document.getElementById('custName').value = c.name;
    document.getElementById('custPhone').value = c.phone;
    document.getElementById('custEmail').value = c.email;
    document.getElementById('custAddress').value = c.address;
    document.getElementById('custDebt').checked = c.hasDebt;
  }

  // ៦. អនុគមន៍លុបអតិថិជន
  function deleteCust(id) {
    if (confirm("តើអ្នកពិតជាចង់លុបអតិថិជននេះមែនទេ?")) {
      customers = customers.filter(c => c.id !== id);
      renderCustomers();
    }
  }

  // ៧. អនុគមន៍ស្វែងរកអតិថិជន
  function searchCustomers() {
    const val = document.getElementById('custSearch').value.toLowerCase();
    const filtered = customers.filter(c => 
      c.name.toLowerCase().includes(val) || 
      c.phone.includes(val)
    );
    renderCustomers(filtered);
  }

  // ដំណើរការដំបូងបង្អស់
  renderCustomers();



    
        const currentSales = [
        { item_name: "កាហ្វេទឹកដោះគោទឹកកក", customer: "រឹម​ ភារុន", payment_method: "ABA", total_price: "$2.50", time: "08:30 AM" },
        { item_name: "តែបៃតងក្រូចឆ្មា", customer: "វ៉៉េង សុជាតិ", payment_method: "សាច់ប្រាក់", total_price: "$1.75", time: "09:15 AM" },
        { item_name: "នំខេកសូកូឡា", customer: "វ់េត ចាន់សារ៉ាក់", payment_method: "ABA", total_price: "$4.00", time: "10:00 AM" },
        { item_name: "ទឹកក្រូចដប", customer: "លី ហេងស៊ីម៉េង", payment_method: "វីង", total_price: "$3.50", time: "11:20 AM" },
        { item_name: "នំខេកសូកូឡា", customer: "ឃួន​ សុភាក់", payment_method: "ABA", total_price: "$8.50", time: "12:20 AM" },
        { item_name: "ទឹកក្រូចដប", customer: "វង់ វិទូ", payment_method: "AC", total_price: "$50", time: "1:20 AM" },
        { item_name: "កាហ្វេទឹកដោះគោទឹកកក", customer: "សយ សុខណា", payment_method: "សាច់ប្រាក់", total_price: "$70", time: "10:20 AM" },
        { item_name: "ពោត ", customer: "វេង វណ្ណនា", payment_method: "ABA", total_price: "$10.50", time: "4:20 AM" },
        { item_name: "ទឹកប្រេងឆា", customer: "សុខ ជា", payment_method: "AC", total_price: "$13.50", time: "1:20 AM" }
        ];

        function renderReportTable(sales = []) {
        const tbody = document.getElementById('reports-sales-tbody');
        document.getElementById('report-today-sales').textContent = sales.length;

        if (sales.length === 0) {
            tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5 text-muted fs-7 italic font-khmer">
                មិនទាន់មានការលក់នៅឡើយទេ
                </td>
            </tr>
            `;
            return;
        }

        tbody.innerHTML = sales.map((item, index) => `
            <tr class="font-khmer">
            <td class="text-center text-muted">${index + 1}</td>
            <td class="fw-bold text-dark">${item.item_name}</td>
            <td class="text-secondary">${item.customer || 'ពោត'}</td>
            <td>
                <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-2.5 py-1" style="font-size: 11px;">
                ${item.payment_method}
                </span>
            </td>
            <td class="fw-bold text-dark">${item.total_price}</td>
            <td class="text-muted fs-7">${item.time}</td>
            </tr>
        `).join('');
        }

        renderReportTable(currentSales);
      const tabTitles = {
        Dashboard: 'Dashboard',
        pos:       'លក់ទំនិញ',
        products:  'ផលិតផល',
        inventory: 'ស្ថានភាពស្តុក',
        customers: 'អតិថិជន',
        reports:   'របាយការណ៍',
        communication: 'ទំនាក់ទំនង',
        attendance: 'វត្តមាន',
        history:   'ប្រវត្តិលក់',
        account:   'គណនីខ្ញុំ'
      };

      document.querySelectorAll('.nav-link[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const tabName = link.dataset.tab;

          // toggle active sidebar link
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          // toggle visible content section
          document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
          const target = document.getElementById('tab-' + tabName);
          if (target) target.classList.add('active');

          // update the page title in the topbar
          const pageTitle = document.getElementById('pageTitle');
          if (pageTitle) pageTitle.textContent = tabTitles[tabName] || '';
        });
      });

// POS: search + category filter
    
      const filterCat = document.getElementById('filterCat');
      const searchBox = document.getElementById('searchBox');
      const productCards = document.querySelectorAll('#productGrid .product-card');

      function applyPosFilter() {
      const selectedCat = filterCat.value;
      const keyword = searchBox.value.trim().toLowerCase();

      productCards.forEach(card => {
        const matchesCategory = selectedCat === 'all' || card.dataset.category === selectedCat;
        const nameEl = card.querySelector('.card-body h5');                        // ← បន្ថែម
        const productName = nameEl ? nameEl.textContent.trim().toLowerCase() : ''; // ← បន្ថែម
        const matchesSearch = productName.includes(keyword);                       // ← ប្តូរ
        card.classList.toggle('d-none', !(matchesCategory && matchesSearch));
      });
    }

      filterCat.addEventListener('change', applyPosFilter);
      searchBox.addEventListener('input', applyPosFilter);

      // POS: ចុចលើកាតផលិតផល -> បន្ថែមទៅកន្ត្រក ហើយលោតទៅផ្ទាំងកន្ត្រកសម្រាប់គិតលុយ
      productCards.forEach((card, index) => {
        // ផ្តល់ id ថេរតាមកាត ដើម្បីឲ្យ addToCart ដឹងថាជាមុខទំនិញតែមួយ
        if (!card.dataset.pid) {
          card.dataset.pid = 'pos-' + index;
        }

        card.addEventListener('click', () => {
          const nameEl = card.querySelector('.card-body h5');
          const priceEl = card.querySelector('.card-body p');
          const stockEl = card.querySelectorAll('.card-body p')[1];

          if (!nameEl || !priceEl) return;

          const name = nameEl.textContent.trim();

          // ទាញយកតម្លៃជាលេខ ទោះបីទម្រង់សរសេរខុសគ្នា (ឧ. "$1.50", "0.30$")
          const priceMatch = priceEl.textContent.replace(/[^0-9.]/g, '');
          const price = parseFloat(priceMatch) || 0;

          // បើអស់ស្តុក កុំបន្ថែមទៅកន្ត្រក
          if (stockEl) {
            const stockMatch = stockEl.textContent.replace(/[^0-9]/g, '');
            const stock = parseInt(stockMatch, 10);
            if (!isNaN(stock) && stock <= 0) {
              showPosToast(`${name} អស់ស្តុក!`);
              return;
            }
          }

          addToCart(card.dataset.pid, name, price);
          showPosToast(`បានបន្ថែម "${name}" ចូលកន្ត្រក`);

          // លោត(scroll)ទៅផ្ទាំងកន្ត្រកសម្រាប់ធ្វើការគិតលុយ
          const cartPanel = document.getElementById('cartPanel');
          if (cartPanel) {
            cartPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            cartPanel.classList.add('cart-highlight');
            setTimeout(() => cartPanel.classList.remove('cart-highlight'), 600);
          }
        });
      });

      function showPosToast(message, duration = 1500) {
        const toastEl = document.getElementById('posToast');
        if (!toastEl) return;
        toastEl.textContent = message;
        toastEl.classList.add('show');
        clearTimeout(showPosToast._t);
        showPosToast._t = setTimeout(() => toastEl.classList.remove('show'), duration);
      }
    

      
   // PRODUCTS: table, search, tabs, add/edit/delete 

      // ---------- Sample data (replace with API data in a real app) ----------
      let products = [
        { id: 1, name: "អង្គរ ៥គីឡូ",       category: "គ្រឿងទេស",   price: 6.50, stock: 11 },
        { id: 2, name: "ប្រេងសា ១លីត្រ",     category: "គ្រឿងទេស",   price: 3.20, stock: 12 },
        { id: 3, name: "គ្រាកគូឡ្យា កំប៉ុង",  category: "ភេសជ្ជៈ", price: 0.75, stock: 55 },
        { id: 4, name: "សាប៊ូកក់សក់",       category: "សម្ភារៈ",     price: 1.00, stock: 8  },
        { id: 5, name: "ទឹកសុទ្ធ ៦00ml",     category: "ភេសជ្ជៈ", price: 0.30, stock: 77 },
        { id: 6, name: "Coca-cola",               category: "ភេសជ្ជៈ", price: 2.50, stock: 49 },
        { id: 7, name: "fanta",              category: "ភេសជ្ជៈ", price: 2.30, stock: 48 },
        { id: 1, name: "កូកាកូឡា (Coca-Cola)", category: "ភេសជ្ជៈ", price: 0.60, stock: 120 },
        { id: 2, name: "PION", category: "ភេសជ្ជៈ", price: 0.70, stock: 85 },
        { id: 3, name: "កាហ្វេដប", category: "ភេសជ្ជៈ", price: 1.20, stock: 4 }, // ស្តុកទាប
        { id: 4, name: "ទឹកក្រូចដប", category: "ភេសជ្ជៈ", price: 2.50, stock: 50 },
        { id: 5, name: "ទឹកស៊ីអ៊ីវ", category: "គ្រឿងទេស", price: 1.50, stock: 100 },
        // --- ភេសជ្ជៈថែមថ្មីទាំង ១០ មុខ ---
        { id: 5, name: "តែបៃតង អូអ៊ិឈិ (Oishi)", category: "ភេសជ្ជៈ", price: 0.75, stock: 90 },
        { id: 6, name: "ពៅកម្លាំង វើក (WURKZ)", category: "ភេសជ្ជៈ", price: 0.65, stock: 150 },
        { id: 7, name: "ទឹកបរិសុទ្ធ វីតាល់ (Vital) ៥០០ml", category: "ភេសជ្ជៈ", price: 0.25, stock: 250 },
        { id: 8, name: "ការ៉ាបាវ (Carabao)", category: "ភេសជ្ជៈ", price: 0.70, stock: 5 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 9, name: "ស្តីងក្រហម (Sting)", category: "ភេសជ្ជៈ", price: 0.70, stock: 110 },
        { id: 10, name: "ទឹកដោះគោជូរ ឌីឡាក់ (Delight)", category: "ភេសជ្ជៈ", price: 0.50, stock: 65 },
        { id: 11, name: "តែក្រូចឆ្មា ហ្វ្រូស (Iced Tea)", category: "ភេសជ្ជៈ", price: 0.80, stock: 3 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 12, name: "ទឹកផ្លែឈើ ជូស៊ី (Juice)", category: "ភេសជ្ជៈ", price: 1.00, stock: 45 },
        { id: 13, name: "ប៉ិបស៊ី (Pepsi)", category: "ភេសជ្ជៈ", price: 0.60, stock: 135 },
        { id: 14, name: "ទឹកដោះគោ កំប៉ុង BEAR BRAND", category: "ភេសជ្ជៈ", price: 0.85, stock: 70 },

        // --- គ្រឿងទេសផ្សេងៗ ---
        { id: 15, name: "ទឹកស៊ីអ៊ីវ", category: "គ្រឿងទេស", price: 1.50, stock: 100 },
        { id: 15, name: "ទឹកស៊ីអ៊ីវ ម៉ាកស៊ុបភើគីតឆេន", category: "គ្រឿងទេស", price: 1.50, stock: 100 },
        { id: 16, name: "អំបិលអុីយ៉ូដ ១កញ្ចប់", category: "គ្រឿងទេស", price: 0.25, stock: 300 },
        { id: 17, name: "ទឹកត្រី ផ្ការំដួល", category: "គ្រឿងទេស", price: 1.80, stock: 80 },
        { id: 18, name: "ប៊ីចេង រូបភ្នំ (៥០០ក្រាម)", category: "គ្រឿងទេស", price: 1.25, stock: 6 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 19, name: "ស្ករសធម្មជាតិ (១គីឡូ)", category: "គ្រឿងទេស", price: 1.10, stock: 95 },
        { id: 20, name: "ម្សៅស៊ុបខ្នរ (Knorr) ប្រអប់ធំ", category: "គ្រឿងទេស", price: 2.30, stock: 40 },
        { id: 21, name: "ប្រេងខ្យង ម៉ាកក្បាលតោ", category: "គ្រឿងទេស", price: 2.10, stock: 75 },
        { id: 22, name: "ម្រេចកំពតម៉ត់ (កំប៉ុងតូច)", category: "គ្រឿងទេស", price: 3.50, stock: 2 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 23, name: "ទឹកប៉េងប៉ោះ ម៉ាករ៉ូសា (Roza)", category: "គ្រឿងទេស", price: 1.40, stock: 55 },
        { id: 24, name: "ទឹកម្ទេសហិរ ម៉ាកឆេហ្វ (Chef)", category: "គ្រឿងទេស", price: 1.35, stock: 60 },
        { id: 25, name: "ម្សៅការី (កញ្ចប់តូច)", category: "គ្រឿងទេស", price: 0.40, stock: 120 },
        // ================= សម្ភារៈ (ថែមថ្មី ១០ មុខ) =================
        { id: 26, name: "សាប៊ូដុសខ្លួន Lux (ដុំ)", category: "សម្ភារៈ", price: 0.85, stock: 90 },
        { id: 27, name: "សាប៊ូកក់សក់ Sunsilk (ដបមធ្យម)", category: "សម្ភារៈ", price: 2.75, stock: 45 },
        { id: 28, name: "ថ្នាំដុសធ្មេញ Colgate ប្រអប់ធំ", category: "សម្ភារៈ", price: 1.90, stock: 60 },
        { id: 29, name: "ច្រាសដុសធ្មេញ (កញ្ចប់ ១ថែម១)", category: "សម្ភារៈ", price: 1.20, stock: 8 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 30, name: "សាប៊ូលាងចាន សាន់ឡាយ (Sunlight)", category: "សម្ភារៈ", price: 1.10, stock: 110 },
        { id: 31, name: "ម្សៅសាប៊ូបោកខោអាវ វីហ្សូ (Viso) ៥០០ក្រាម", category: "សម្ភារៈ", price: 1.40, stock: 75 },
        { id: 32, name: "ក្រដាសអនាម័យ (ប៉េក ១០ដុំ)", category: "សម្ភារៈ", price: 2.20, stock: 35 },
        { id: 33, name: "ថង់យួរផ្លាស្ទិក (១គីឡូ)", category: "សម្ភារៈ", price: 1.50, stock: 4 }, // ស្តុកទាប (លោតផ្លាក 'ស្តុកទាប')
        { id: 34, name: "ទឹកជូតការ៉ូ ម៉ាកក្លីន (Clean)", category: "សម្ភារៈ", price: 2.60, stock: 50 },
        { id: 35, name: "អេប៉ុងលាងចាន (កញ្ចប់ ៥បន្ទះ)", category: "សម្ភារៈ", price: 0.60, stock: 140 }
];

      
      let nextId = products.length + 1;

      const LOW_STOCK_THRESHOLD = 5;

      let state = {
        category: 'all',
        search: '',
        editingId: null,
        deletingId: null
      };

      const tbody = document.getElementById('productsTbody');
      const searchInput = document.getElementById('searchInput');
      const categoryTabs = document.getElementById('categoryTabs');

      function render() {
        let list = products.filter(p => {
          const matchesCat = state.category === 'all' || p.category === state.category;
          const matchesSearch = p.name.toLowerCase().includes(state.search.toLowerCase());
          return matchesCat && matchesSearch;
        });

        tbody.innerHTML = '';

        if (list.length === 0) {
          tbody.innerHTML = `<tr class="empty-row"><td colspan="8">មិនមានផលិតផលត្រូវនឹងលក្ខខណ្ឌនេះទេ</td></tr>`;
          return;
        }

        list.forEach((p, idx) => {
          const isLow = p.stock <= LOW_STOCK_THRESHOLD;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><div class="prod-thumb"><i class="fa-regular fa-image"></i></div></td>
            <td>${idx + 1}</td>
            <td class="prod-name">${escapeHtml(p.name)}</td>
            <td>${escapeHtml(p.category)}</td>
            <td>$${p.price.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td><span class="badge-stock ${isLow ? 'badge-low' : ''}">${isLow ? 'ស្តុកទាប' : 'គ្រប់គ្រាន់'}</span></td>
            <td>
              <div class="row-actions">
                <button class="icon-btn icon-add" title="បន្ថែមស្តុក" data-action="addstock" data-id="${p.id}"><i class="fa-solid fa-plus"></i></button>
                <button class="icon-btn icon-edit" title="កែប្រែ" data-action="edit" data-id="${p.id}"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn icon-del" title="លុប" data-action="delete" data-id="${p.id}"><i class="fa-solid fa-trash"></i></button>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      }

      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      // category tabs
      categoryTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.category = btn.dataset.cat;
        render();
      });

      // search
      searchInput.addEventListener('input', (e) => {
        state.search = e.target.value;
        render();
      });

      // add / edit modal
      const productModal = document.getElementById('productModal');
      const productModalTitle = document.getElementById('productModalTitle');
      const fName = document.getElementById('fName');
      const fCategory = document.getElementById('fCategory');
      const fPrice = document.getElementById('fPrice');
      const fStock = document.getElementById('fStock');

      document.getElementById('openAddBtn').addEventListener('click', () => openProductModal(null));
      document.getElementById('cancelProductBtn').addEventListener('click', () => closeProductModal());

      function openProductModal(id) {
        state.editingId = id;
        if (id) {
          const p = products.find(p => p.id === id);
          productModalTitle.textContent = 'កែប្រែផលិតផល';
          fName.value = p.name;
          fCategory.value = p.category;
          fPrice.value = p.price;
          fStock.value = p.stock;
        } else {
          productModalTitle.textContent = 'បន្ថែមផលិតផល';
          fName.value = '';
          fCategory.value = 'គ្រឿងទេស';
          fPrice.value = '';
          fStock.value = '';
        }
        productModal.classList.add('open');
      }

      function closeProductModal() {
        productModal.classList.remove('open');
        state.editingId = null;
      }

      // QR payment modal buttons
      const qrCancelBtn = document.getElementById('cancelQrPaymentBtn');
      const qrConfirmBtn = document.getElementById('confirmQrPaymentBtn');
      if (qrCancelBtn) qrCancelBtn.addEventListener('click', () => closeQrPaymentModal());
      if (qrConfirmBtn) qrConfirmBtn.addEventListener('click', () => confirmQrPayment());

      document.getElementById('saveProductBtn').addEventListener('click', () => {
        const name = fName.value.trim();
        const category = fCategory.value;
        const price = parseFloat(fPrice.value) || 0;
        const stock = parseInt(fStock.value) || 0;

        if (!name) {
          fName.focus();
          return;
        }

        if (state.editingId) {
          const p = products.find(p => p.id === state.editingId);
          p.name = name; p.category = category; p.price = price; p.stock = stock;
        } else {
          products.push({ id: nextId++, name, category, price, stock });
        }

        closeProductModal();
        render();
      });

      // delete modal
      const deleteModal = document.getElementById('deleteModal');
      const deleteProductName = document.getElementById('deleteProductName');

      document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        deleteModal.classList.remove('open');
        state.deletingId = null;
      });

      document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        products = products.filter(p => p.id !== state.deletingId);
        deleteModal.classList.remove('open');
        state.deletingId = null;
        render();
      });

      // row action delegation
      tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === 'edit') {
          openProductModal(id);
        } else if (action === 'delete') {
          const p = products.find(p => p.id === id);
          state.deletingId = id;
          deleteProductName.textContent = p ? p.name : '';
          deleteModal.classList.add('open');
        } else if (action === 'addstock') {
          const p = products.find(p => p.id === id);
          const qty = prompt('បញ្ចូលចំនួនស្តុកបន្ថែមសម្រាប់ "' + p.name + '"', '1');
          if (qty !== null) {
            const n = parseInt(qty);
            if (!isNaN(n) && n > 0) {
              p.stock += n;
              render();
            }
          }
        }
      });

      render();


      
  //INVENTORY: stock table + stock movement history 
  
      // ---------- Sample stock movement history (replace with API data in a real app) ----------
      let stockHistory = [
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "គ្រាកគូឡ្យា កំប៉ុង", type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "សាប៊ូកក់សក់",     type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 1, time: "09/07/2026 00:26" },
        { product: "fanta",            type: "out", qty: 2, time: "30/06/2026 14:38" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "សាប៊ូកក់សក់",     type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "koka",              type: "out", qty: 1, time: "30/06/2026 14:38" },
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 2, time: "30/06/2026 14:00" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 3, time: "30/06/2026 14:00" },
        { product: "គ្រាកគូឡ្យា កំប៉ុង", type: "out", qty: 3, time: "30/06/2026 14:00" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 7, time: "30/06/2026 14:00" },
        { product: "ទឹកសុទ្ធ ៦00ml",   type: "out", qty: 4, time: "30/06/2026 14:00" },
        { product: "អង្គរ ៥គីឡូ",     type: "out", qty: 9, time: "30/06/2026 14:00" },
        { product: "ប្រេងសា ១លីត្រ",   type: "out", qty: 1, time: "30/06/2026 14:00" },
        { product: "គ្រាកគូឡ្យា កំប៉ុង", type: "out", qty: 1, time: "30/06/2026 14:00" },
        { product: "សាប៊ូកក់សក់",     type: "out", qty: 4, time: "30/06/2026 14:00" },
      ];
 
      const inventorySearchInput = document.getElementById('inventorySearchInput');
      const inventoryTbody = document.getElementById('inventoryTbody');
      const stockHistoryTbody = document.getElementById('stockHistoryTbody');
 
      function renderInventory() {
        const keyword = (inventorySearchInput ? inventorySearchInput.value : '').trim().toLowerCase();
        const list = products.filter(p => p.name.toLowerCase().includes(keyword));
 
        inventoryTbody.innerHTML = '';
 
        if (list.length === 0) {
          inventoryTbody.innerHTML = `<tr class="empty-row"><td colspan="5">មិនមានផលិតផលត្រូវនឹងលក្ខខណ្ឌនេះទេ</td></tr>`;
        } else {
          list.forEach(p => {
            const isLow = p.stock <= LOW_STOCK_THRESHOLD;
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td class="prod-name">${escapeHtml(p.name)}</td>
              <td>${escapeHtml(p.category)}</td>
              <td>$${p.price.toFixed(2)}</td>
              <td>${p.stock}</td>
              <td><span class="badge-stock ${isLow ? 'badge-low' : ''}">${isLow ? 'ស្តុកទាប' : 'គ្រប់គ្រាន់'}</span></td>
            `;
            inventoryTbody.appendChild(tr);
          });
        }
 
        renderStockHistory();
      }
 
      function renderStockHistory() {
        stockHistoryTbody.innerHTML = '';
 
        if (stockHistory.length === 0) {
          stockHistoryTbody.innerHTML = `<tr class="empty-row"><td colspan="4">មិនទាន់មានប្រវត្តិផ្លាស់ប្តូរស្តុកទេ</td></tr>`;
          return;
        }
 
        stockHistory.forEach(h => {
          const tr = document.createElement('tr');
          const typeLabel = h.type === 'out' ? 'ចេញ' : 'ចូល';
          const typeClass = h.type === 'out' ? 'move-out' : 'move-in';
          tr.innerHTML = `
            <td class="prod-name">${escapeHtml(h.product)}</td>
            <td class="${typeClass}">${typeLabel}</td>
            <td>${h.qty}</td>
            <td>${escapeHtml(h.time)}</td>
          `;
          stockHistoryTbody.appendChild(tr);
        });
      }
 
      if (inventorySearchInput) {
        inventorySearchInput.addEventListener('input', renderInventory);
      }
 
      renderInventory();
   
  // ១. អនុគមន៍រក្សាទុកការកែប្រែប្រវត្តិរូប (Profile)
  function updateProfile() {
    const nameVal = document.getElementById('edit-acc-name').value.trim();
    const emailVal = document.getElementById('edit-acc-email').value.trim();

    if (!nameVal || !emailVal) {
      alert("សូមបំពេញឈ្មោះ និងអ៊ីមែលឱ្យបានត្រឹមត្រូវ!");
      return;
    }

    // ធ្វើបច្ចុប្បន្នភាពអក្សរនៅលើកាតខាងឆ្វេងភ្លាមៗ (Real-time)
    document.getElementById('acc-info-name').textContent = nameVal;
    document.getElementById('acc-info-email').textContent = emailVal;

    alert("រក្សាទុកព័ត៌មានផ្ទាល់ខ្លួនជោគជ័យ!");
  }

  // ២. អនុគមន៍រក្សាទុកការប្តូរពាក្យសម្ងាត់
  function changePassword() {
    const current = document.getElementById('pass-current').value;
    const newPass = document.getElementById('pass-new').value;
    const confirmPass = document.getElementById('pass-confirm').value;

    if (!current || !newPass || !confirmPass) {
      alert("សូមបំពេញប្រអប់ពាក្យសម្ងាត់ឱ្យបានគ្រប់គ្រាន់!");
      return;
    }

    if (newPass !== confirmPass) {
      alert("ពាក្យសម្ងាត់ថ្មី និងការបញ្ជាក់ពាក្យសម្ងាត់មិនត្រូវគ្នានោះទេ!");
      return;
    }

    alert("ផ្លាស់ប្តូរពាក្យសម្ងាត់ជោគជ័យ!");
    
    // សម្អាតប្រអប់ក្រោយពេលប្តូររួច
    document.getElementById('pass-current').value = "";
    document.getElementById('pass-new').value = "";
    document.getElementById('pass-confirm').value = "";
  }

  // ៣. អនុគមន៍សម្រាប់ ចុចមើល/លាក់ ពាក្យសម្ងាត់ (Eye Icon)
  function togglePass(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
      input.type = "password";
      icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
  }

// Mobile sidebar toggle (kept local to staff.html, no other files touched) -->
  
      (function () {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar || !toggleBtn || !backdrop) return;

        function openSidebar() {
          sidebar.classList.add('sidebar-open');
          backdrop.classList.add('show');
        }
        function closeSidebar() {
          sidebar.classList.remove('sidebar-open');
          backdrop.classList.remove('show');
        }

        toggleBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        backdrop.addEventListener('click', closeSidebar);

        // Close the mobile drawer automatically after picking a menu item
        sidebar.querySelectorAll('.nav-link[data-tab]').forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth < 992) closeSidebar();
          });
        });

        // If the window is resized back up to desktop width, make sure the drawer state resets
        window.addEventListener('resize', () => {
          if (window.innerWidth >= 992) closeSidebar();
        });
      })();


  document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = "../../../index.html";
});


  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(STAFF_STORAGE_PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn('localStorage read failed for', key, e);
      return fallback;
    }
  }

  function saveToStorage(key, value) {
    try {
      localStorage.setItem(STAFF_STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage save failed for', key, e);
    }
  }

  let commHistory = loadFromStorage('commHistory', []);

  const commTypeLabels = {
    message: 'សារទូទៅ',
    support: 'សំណើគាំទ្រ',
    issue:   'រាយការណ៍បញ្ហា'
  };
  const commTypeBadgeClass = {
    message: 'bg-primary-subtle text-primary',
    support: 'bg-warning-subtle text-warning-emphasis',
    issue:   'bg-danger-subtle text-danger'
  };

  const announcements = [
    {
      title: 'កាលវិភាគចែកវេនប្រចាំខែក្រោយ',
      body: 'សូមបុគ្គលិកទាំងអស់ពិនិត្យកាលវិភាគវេនប្រចាំខែក្រោយ ដែលនឹងបិទផ្សាយនៅចុងសប្តាហ៍នេះ។',
      date: '20-Jul-2026'
    },
    {
      title: 'ការធ្វើបច្ចុប្បន្នភាពប្រព័ន្ធលក់ទំនិញ',
      body: 'ប្រព័ន្ធលក់ទំនិញ (POS) ត្រូវបានធ្វើបច្ចុប្បន្នភាព បន្ថែមមុខងារទូទាត់តាម QR Code។ សូមធ្វើតេស្តប្រើប្រាស់ ហើយរាយការណ៍បញ្ហាមកអ្នកគ្រប់គ្រងបើមាន។',
      date: '16-Jul-2026'
    },
    {
      title: 'ការប្រកួតប្រជែងលក់ប្រចាំខែ',
      body: 'បុគ្គលិកលក់បានច្រើនបំផុតប្រចាំខែនេះ នឹងទទួលបានប្រាក់រង្វាន់! សូមខិតខំបន្ថែម។',
      date: '10-Jul-2026'
    }
  ];

  function renderCommHistory() {
    const list = document.getElementById('commHistoryList');
    if (!list) return;

    if (commHistory.length === 0) {
      list.innerHTML = `<p class="text-muted small text-center py-3">មិនទាន់មានសារត្រូវបានផ្ញើទេ</p>`;
      return;
    }

    list.innerHTML = commHistory.map(item => `
      <div class="border-bottom border-light-subtle py-2">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <span class="badge ${commTypeBadgeClass[item.type]} px-2 py-1" style="font-size:10px;">${item.typeLabel}</span>
          <span class="text-muted" style="font-size:11px;">${item.time}</span>
        </div>
        <div class="text-dark" style="font-size:.85rem;">${item.content}</div>
      </div>
    `).join('');
  }

  function renderAnnouncements() {
    const list = document.getElementById('announcementList');
    if (!list) return;

    list.innerHTML = announcements.map(a => `
      <div class="border-bottom border-light-subtle py-2 mb-1">
        <div class="d-flex justify-content-between align-items-start">
          <div class="fw-bold text-dark" style="font-size:.9rem;">${a.title}</div>
          <span class="text-muted flex-shrink-0 ms-2" style="font-size:11px;">${a.date}</span>
        </div>
        <div class="text-secondary mt-1" style="font-size:.83rem;">${a.body}</div>
      </div>
    `).join('');
  }

  function sendCommMessage() {
    const typeSelect = document.getElementById('comm-type');
    const contentBox = document.getElementById('comm-content');
    const content = contentBox.value.trim();

    if (!content) {
      showPosToast('សូមបញ្ចូលខ្លឹមសារជាមុនសិន');
      return;
    }

    const type = typeSelect.value;
    const now = new Date();

    commHistory.unshift({
      type,
      typeLabel: commTypeLabels[type],
      content,
      time: now.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    });

    contentBox.value = '';
    saveToStorage('commHistory', commHistory);
    renderCommHistory();
    showPosToast('បានផ្ញើសារទៅអ្នកគ្រប់គ្រងដោយជោគជ័យ! 📨');
  }

// ========================= 11. Attendance =========================
  let attendanceState = loadFromStorage('attendanceState', { checkedIn: false, checkInTime: null });

  let attendanceHistory = loadFromStorage('attendanceHistory', [
    { date: '19-Jul-2026', in: '08:02', out: '17:05', hours: '9ម៉ោង 03នាទី' },
    { date: '18-Jul-2026', in: '07:58', out: '17:00', hours: '9ម៉ោង 02នាទី' },
    { date: '17-Jul-2026', in: '08:10', out: '16:55', hours: '8ម៉ោង 45នាទី' }
  ]);

  let leaveRequests = loadFromStorage('leaveRequests', []);

  const workSchedule = [
    { day: 'ច័ន្ទ',     in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'អង្គារ',    in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'ពុធ',       in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'ព្រហស្បតិ៍', in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'សុក្រ',     in: '08:00', out: '17:00', status: 'ធម្មតា' },
    { day: 'សៅរ៍',      in: '08:00', out: '12:00', status: 'ព្រឹកតែម្តង' },
    { day: 'អាទិត្យ',   in: '-', out: '-', status: 'ថ្ងៃឈប់សម្រាក' }
  ];

  function renderWorkSchedule() {
    const tbody = document.getElementById('workScheduleTbody');
    if (!tbody) return;
    tbody.innerHTML = workSchedule.map(s => `
      <tr>
        <td class="fw-semibold text-dark">${s.day}</td>
        <td>${s.in}</td>
        <td>${s.out}</td>
        <td>${s.status}</td>
      </tr>
    `).join('');
  }

  function renderAttendanceHistory() {
    const tbody = document.getElementById('attendanceHistoryTbody');
    if (!tbody) return;

    if (attendanceHistory.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-3">មិនទាន់មានប្រវត្តិវត្តមានទេ</td></tr>`;
      return;
    }

    tbody.innerHTML = attendanceHistory.map(r => `
      <tr>
        <td>${r.date}</td>
        <td>${r.in}</td>
        <td>${r.out}</td>
        <td>${r.hours}</td>
      </tr>
    `).join('');
  }

  function renderLeaveRequests() {
    const list = document.getElementById('leaveRequestList');
    if (!list) return;

    if (leaveRequests.length === 0) {
      list.innerHTML = `<p class="text-muted small text-center py-2">មិនទាន់មានសំណើសុំច្បាប់ទេ</p>`;
      return;
    }

    list.innerHTML = leaveRequests.map(r => `
      <div class="border-bottom border-light-subtle py-2">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <span class="fw-semibold text-dark" style="font-size:.85rem;">${r.start} → ${r.end}</span>
          <span class="badge bg-warning-subtle text-warning-emphasis px-2 py-1" style="font-size:10px;">${r.status}</span>
        </div>
        <div class="text-secondary" style="font-size:.8rem;">${r.reason}</div>
      </div>
    `).join('');
  }

  function updateAttendanceUI() {
    const label = document.getElementById('att-status-label');
    const btn = document.getElementById('attCheckBtn');
    if (!label || !btn) return;

    if (attendanceState.checkedIn) {
      label.textContent = `កំពុងធ្វើការ (ចូលម៉ោង ${attendanceState.checkInTime})`;
      btn.innerHTML = `<i class="fa-solid fa-right-from-bracket me-1"></i>ចេញពីការងារ (Check Out)`;
      btn.classList.remove('btn-moss');
      btn.classList.add('btn-danger');
    } else {
      label.textContent = 'មិនទាន់ចូលធ្វើការ';
      btn.innerHTML = `<i class="fa-solid fa-right-to-bracket me-1"></i>ចូលធ្វើការ (Check In)`;
      btn.classList.remove('btn-danger');
      btn.classList.add('btn-moss');
    }
  }

  function toggleAttendance() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    if (!attendanceState.checkedIn) {
      attendanceState.checkedIn = true;
      attendanceState.checkInTime = timeStr;
      saveToStorage('attendanceState', attendanceState);
      updateAttendanceUI();
      showPosToast('បានចូលធ្វើការ! មានថ្ងៃធ្វើការល្អ 👋');
    } else {
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      attendanceHistory.unshift({
        date: dateStr,
        in: attendanceState.checkInTime,
        out: timeStr,
        hours: '—'
      });
      attendanceState.checkedIn = false;
      attendanceState.checkInTime = null;
      saveToStorage('attendanceState', attendanceState);
      saveToStorage('attendanceHistory', attendanceHistory);
      updateAttendanceUI();
      renderAttendanceHistory();
      showPosToast('បានចេញពីការងារ! អរគុណសម្រាប់ថ្ងៃនេះ 🙏');
    }
  }

  function submitLeaveRequest() {
    const startInput = document.getElementById('leave-start');
    const endInput = document.getElementById('leave-end');
    const reasonInput = document.getElementById('leave-reason');

    const start = startInput.value;
    const end = endInput.value;
    const reason = reasonInput.value.trim();

    if (!start || !end || !reason) {
      showPosToast('សូមបំពេញកាលបរិច្ឆេទ និងមូលហេតុឲ្យគ្រប់');
      return;
    }

    leaveRequests.unshift({ start, end, reason, status: 'កំពុងរង់ចាំអនុម័ត' });
    saveToStorage('leaveRequests', leaveRequests);

    startInput.value = '';
    endInput.value = '';
    reasonInput.value = '';

    renderLeaveRequests();
    showPosToast('បានដាក់សំណើសុំច្បាប់រួចរាល់! 📋');
  }

  // Initialize Communication & Attendance panels
  renderCommHistory();
  renderAnnouncements();
  renderWorkSchedule();
  renderAttendanceHistory();
  renderLeaveRequests();
  updateAttendanceUI();

  const attCurrentDateEl = document.getElementById('att-current-date');
  if (attCurrentDateEl) {
    attCurrentDateEl.textContent = new Date().toLocaleDateString('en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }


// Mobile sidebar toggle (kept local to staff.html, no other files touched) -->
  
      (function () {
        const sidebar = document.querySelector('.sidebar');
        const toggleBtn = document.getElementById('sidebarToggleBtn');
        const closeBtn = document.getElementById('sidebarCloseBtn');
        const backdrop = document.getElementById('sidebarBackdrop');
        if (!sidebar || !toggleBtn || !backdrop) return;

        function openSidebar() {
          sidebar.classList.add('sidebar-open');
          backdrop.classList.add('show');
        }
        function closeSidebar() {
          sidebar.classList.remove('sidebar-open');
          backdrop.classList.remove('show');
        }

        toggleBtn.addEventListener('click', openSidebar);
        if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
        backdrop.addEventListener('click', closeSidebar);

        // Close the mobile drawer automatically after picking a menu item
        sidebar.querySelectorAll('.nav-link[data-tab]').forEach(link => {
          link.addEventListener('click', () => {
            if (window.innerWidth < 992) closeSidebar();
          });
        });

        // If the window is resized back up to desktop width, make sure the drawer state resets
        window.addEventListener('resize', () => {
          if (window.innerWidth >= 992) closeSidebar();
        });
      })();
   
   