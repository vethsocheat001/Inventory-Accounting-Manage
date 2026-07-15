// ---- Mobile sidebar toggle ----
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() { sidebar.classList.add('open'); sidebarOverlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeSidebar() { sidebar.classList.remove('open'); sidebarOverlay.classList.remove('show'); document.body.style.overflow = ''; }

sidebarToggle?.addEventListener('click', openSidebar);
sidebarClose?.addEventListener('click', closeSidebar);
sidebarOverlay?.addEventListener('click', closeSidebar);
document.querySelectorAll('.sidebar .nav-link').forEach(link => link.addEventListener('click', closeSidebar));
window.addEventListener('resize', () => { if (window.innerWidth > 991) closeSidebar(); });

const navItems = document.querySelectorAll('.settings-nav-item');
const panels = document.querySelectorAll('.settings-panel');
navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(item.dataset.target).classList.add('active');
  });
});

function showToast(message) {
  const toast = document.getElementById('appToast');
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

document.getElementById('profileForm').addEventListener('submit', e => { e.preventDefault(); showToast('បានធ្វើបច្ចុប្បន្នភាពព័ត៌មានអាជីវកម្ម'); });

document.querySelectorAll('.pwd-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.previousElementSibling;
    const icon = btn.querySelector('i');
    if (input.type === 'password') { input.type = 'text'; icon.classList.replace('fa-eye', 'fa-eye-slash'); }
    else { input.type = 'password'; icon.classList.replace('fa-eye-slash', 'fa-eye'); }
  });
});

const newPwd = document.getElementById('newPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');
newPwd.addEventListener('input', () => {
  const val = newPwd.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  const levels = [
    { width: '0%', color: '#eceef8', label: 'ប្រើអក្សរយ៉ាងតិច 8 តួ រួមមានលេខ និងសញ្ញា' },
    { width: '25%', color: '#e6555c', label: 'ពាក្យសម្ងាត់ខ្សោយ' },
    { width: '50%', color: '#e2a13a', label: 'ពាក្យសម្ងាត់មធ្យម' },
    { width: '75%', color: '#4f8dfb', label: 'ពាក្យសម្ងាត់ល្អ' },
    { width: '100%', color: '#1fa971', label: 'ពាក្យសម្ងាត់ខ្លាំង' },
  ];
  const lvl = levels[val.length === 0 ? 0 : score];
  strengthFill.style.width = lvl.width; strengthFill.style.background = lvl.color; strengthLabel.textContent = lvl.label;
});

const confirmPwd = document.getElementById('confirmPassword');
const matchMsg = document.getElementById('matchMsg');
function checkMatch() {
  if (!confirmPwd.value) { matchMsg.textContent = ''; return; }
  if (confirmPwd.value === newPwd.value) { matchMsg.textContent = '✓ ពាក្យសម្ងាត់ត្រូវគ្នា'; matchMsg.style.color = '#1fa971'; }
  else { matchMsg.textContent = '✕ ពាក្យសម្ងាត់មិនត្រូវគ្នា'; matchMsg.style.color = '#e6555c'; }
}
confirmPwd.addEventListener('input', checkMatch);
newPwd.addEventListener('input', checkMatch);

document.getElementById('passwordForm').addEventListener('submit', e => {
  e.preventDefault();
  if (newPwd.value && newPwd.value !== confirmPwd.value) { showToast('ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ'); return; }
  showToast('បានធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ដោយជោគជ័យ');
  e.target.reset(); strengthFill.style.width = '0%';
  strengthLabel.textContent = 'ប្រើអក្សរយ៉ាងតិច 8 តួ រួមមានលេខ និងសញ្ញា';
  matchMsg.textContent = '';
});

document.getElementById('backupBtn').addEventListener('click', () => {
  const btn = document.getElementById('backupBtn');
  const original = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> កំពុងបម្រុងទុក...';
  setTimeout(() => { btn.disabled = false; btn.innerHTML = original; showToast('បម្រុងទុកបានជោគជ័យ'); }, 1600);
});

document.getElementById('saveSystemBtn').addEventListener('click', () => showToast('បានរក្សាទុកការកំណត់ប្រព័ន្ធ'));