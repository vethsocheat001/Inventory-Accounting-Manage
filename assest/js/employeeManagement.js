
document.addEventListener('DOMContentLoaded', () => {

  const toastEl = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg) {
    if (!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  const roleColors = {
    Admin: 'bg-danger-subtle text-danger',
    Manager: 'bg-warning-subtle text-warning',
    Cashier: 'bg-success-subtle text-success',
    'Stock Clerk': 'bg-secondary-subtle text-secondary'
  };

  let staff = [
    // {
    //   id: 1,
    //   name: 'Veth Socheat',
    //   phone: '012 345 678',
    //   role: 'Manager',
    //   active: true,
    //   image: 'https://www.recordnet.com/story/lifestyle/2021/03/22/photographs-vs-pictures-whatever-you-call-it-photograph-still-photograph/4729332001/'
    // },
    { id: 1, name: 'Veth Socheat',        phone: '012 345 678', role: 'Manager',     active: true , image: '/assest/image/DSC_1535 copy.jpg' },
    { id: 2, name: 'Rim Phearoun', phone: '096 555 210', role: 'Cashier', active: true , image: '/assest/image/phearoun_image.jpg'},
    { id: 3, name: 'Vet Chansarak', phone: '077 888 001', role: 'Admin', active: true , image: '/assest/image/DSC_1541 copy.jpg' },
    { id: 4, name: 'Lyheng Symeny', phone: '070 222 456', role: 'Stock Clerk', active: false , image: '/assest/image/meng_image.jpg'},
    { id: 5, name: 'Sok Pisey', phone: '012 909 333', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXKt6OpGc7iHjVJSEUr9pV7EyG821ENIwipSvKStOVTQ&s=10'},
    { id: 6, name: 'Sok Dara', phone: '016 700 990', role: 'Manager', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP66xZe_6NzZqJBWm79x8S2MHyt4QklAK-9-jQ-IRAFw&s=10'},
    { id: 7, name: 'Sopheak', phone: '010 90 88 57', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxEug8Ah6v72E2hoe23E2t5awqBYfr80J9f3La5y0QSg&s=10'},
    { id: 8, name: 'Heng Sylong', phone: '096 97 777 254', role: 'Stock Clerk', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5gR8rxs27HynIOIU9zUAwqEZdJ8ktrvK22xDCiUj59Q&s=10'},
    { id: 9, name: 'Mar Kara', phone: '019 903 7653', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNYGSGXdKsitrPTKO01bs5O4HF5-gE0nIJmXlpj2wvdQ&s=10'},
    { id: 10, name: 'Ket Nita', phone: '096 788 761', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqvkVePxJYjtmCw7U3PJJ2s-9QFCa2GZgyREqd1vqsTQ&s=10'},
    { id: 11, name: 'An Kaknika', phone: '097 897 123', role: 'Stock Clerk', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIkWkutiMeF0Kn6EiEZH8ia6YGtmOLJ4CPBp7E0jYSfg&s=10'},
    { id: 12, name: 'Keo Mongkol', phone: '098 7621 973', role: 'Cashier', active: true , image: 'https://www.film.ru/sites/default/files/people/3691694-1223605.jpg'},
    { id: 13, name: 'La Salite', phone: '018 8234 030', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWkDYE0rFwfLrIL6tf3eqAsBDFtBRBMTWZvbj6AhLYxQ&s=10'},
    { id: 14, name: 'Sok Pulok', phone: '010 3333 982', role: 'Stock Clerk', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjtfj-F7qJuBJ1vLEd5uGozcYtivP1Y0UNSnJeHXo2gw&s=10'},
    { id: 15, name: 'Ma Tis', phone: '096 722 223', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOgqBjcyS4qayRqGrmtnfuJYyUS2edZw7u5LDiJwdeQQ&s=10'},
    { id: 16, name: 'Veng Chandara', phone: '018 8983 772', role: 'Cashier', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlJBG4_NlYDT2Qr8aNxDE4VkKIqc0y-JRcwP48OOVGqA&s=10'},
    { id: 17, name: 'Hoeu Kimhor', phone: '017 9632 843', role: 'Stock Clerk', active: true , image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOR7eJMzFIlughDjnortGFHJo1OwBBqwZSUMnDT1YI4w&s=10'}
  ];
  let nextId = staff.length + 1;

  const tbody = document.getElementById('staffTableBody');
  const searchInput = document.getElementById('staffSearch');

  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  function renderKpis() {
    const total = staff.length;
    const active = staff.filter(s => s.active).length;
    const inactive = total - active;
    const admins = staff.filter(s => s.role === 'Admin' || s.role === 'Manager').length;
    document.getElementById('kpiTotal').textContent = total;
    document.getElementById('kpiActive').textContent = active;
    document.getElementById('kpiInactive').textContent = inactive;
    document.getElementById('kpiAdmins').textContent = admins;
  }

  function renderTable() {
    const query = (searchInput.value || '').trim().toLowerCase();
    const rows = staff.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query) ||
      s.role.toLowerCase().includes(query) ||
      s.image.toLowerCase().includes(query)
    );

    tbody.innerHTML = '';
    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">No staff found</td></tr>`;
      return;
    }

    rows.forEach(s => {
         console.log("Staff Data:", s);
    console.log("Profile Image:", s.image);
      const tr = document.createElement('tr');
      const roleClass = roleColors[s.role] || 'bg-secondary-subtle text-secondary';
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-2">
            <div class="avatar-circle d-flex align-items-center justify-content-center">
  ${s.image
          ? `<img src="${s.image}" 
          class="rounded-circle w-100 h-100"
          style="object-fit:cover;">`
          : initials(s.name)
        }
</div>
<div class="fw-semibold small">${s.name}</div>
          </div>
        </td>
        <td><span class="badge rounded-pill ${roleClass}">${s.role}</span></td>
        <td class="small text-secondary">${s.phone}</td>
        <td>
          <span class="badge rounded-pill ${s.active ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">
            ${s.active ? 'Active' : 'Disabled'}
          </span>
        </td>
        <td class="text-end">
          <div class="d-flex justify-content-end gap-1">
            <button class="btn btn-sm btn-light border rounded-3" data-action="edit" data-id="${s.id}" title="Edit"><i class="bi bi-pencil-square"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="reset" data-id="${s.id}" title="Reset Password"><i class="bi bi-key-fill"></i></button>
            <button class="btn btn-sm btn-light border rounded-3" data-action="toggle" data-id="${s.id}" title="${s.active ? 'Disable' : 'Enable'}">
              <i class="bi ${s.active ? 'bi-toggle-on text-success' : 'bi-toggle-off text-secondary'}"></i>
            </button>
            <button class="btn btn-sm btn-light border rounded-3 text-danger" data-action="delete" data-id="${s.id}" title="Delete"><i class="bi bi-trash-fill"></i></button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAll() {
    renderKpis();
    renderTable();
  }

  searchInput.addEventListener('input', renderTable);

  /* ---------------- Add / Edit modal ---------------- */
  const staffModalEl = document.getElementById('staffModal');
  const staffModal = new bootstrap.Modal(staffModalEl);
  const staffForm = document.getElementById('staffForm');
  const staffModalTitle = document.getElementById('staffModalTitle');
  const addStaffBtn = document.getElementById('addStaffBtn');

  addStaffBtn.addEventListener('click', () => {
    staffModalTitle.textContent = 'Add Staff';
    staffForm.reset();
    document.getElementById('staffId').value = '';
    document.getElementById('staffActive').checked = true;
  });

  document.getElementById('saveStaffBtn').addEventListener('click', () => {
    if (!staffForm.reportValidity()) return;

    const id = document.getElementById('staffId').value;
    const name = document.getElementById('staffName').value.trim();
    const phone = document.getElementById('staffPhone').value.trim();
    const role = document.getElementById('staffRole').value;
    const active = document.getElementById('staffActive').checked;

    if (id) {
      const s = staff.find(x => x.id === Number(id));
      if (s) { Object.assign(s, { name, phone, role, active }); }
      notify('Staff updated');
    } else {
      staff.push({ id: nextId++, name, phone, role, active });
      notify('Staff added');
    }

    staffModal.hide();
    renderAll();
  });

  /* ---------------- Row actions ---------------- */
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const action = btn.dataset.action;
    const s = staff.find(x => x.id === id);
    if (!s) return;

    if (action === 'edit') {
      staffModalTitle.textContent = 'Edit Staff';
      document.getElementById('staffId').value = s.id;
      document.getElementById('staffName').value = s.name;
      document.getElementById('staffPhone').value = s.phone;
      document.getElementById('staffRole').value = s.role;
      document.getElementById('staffActive').checked = s.active;
      staffModal.show();

    } else if (action === 'toggle') {
      s.active = !s.active;
      notify(s.active ? `${s.name} enabled` : `${s.name} disabled`);
      renderAll();

    } else if (action === 'reset') {
      if (confirm(`Reset password for ${s.name}?`)) {
        notify(`Password reset for ${s.name}`);
      }

    } else if (action === 'delete') {
      if (confirm(`Delete ${s.name}? This cannot be undone.`)) {
        staff = staff.filter(x => x.id !== id);
        notify(`${s.name} deleted`);
        renderAll();
      }
    }
  });

  /* ---------------- Bell ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if (bellBtn) {
    bellBtn.addEventListener('click', () => notify('You have 3 new notifications'));
  }

  renderAll();
});
