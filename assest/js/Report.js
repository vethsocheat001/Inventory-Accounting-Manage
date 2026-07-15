// Populate modal with the clicked report's name
document.addEventListener('click', function (e) {
  const trigger = e.target.closest('[data-bs-target="#reportModal"]');
  if (trigger) {
    document.getElementById('reportModalName').textContent = trigger.getAttribute('data-report') || '—';
  }
});

// Fake download feedback
document.querySelectorAll('.download-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const name = this.getAttribute('data-name') || 'report file';
    const toastEl = document.getElementById('downloadToast');
    document.getElementById('toastBody').textContent = 'កំពុងទាញយក / Downloading: ' + name;
    new bootstrap.Toast(toastEl, { delay: 2200 }).show();
  });
});

// Simple client-side search over table rows
const searchBox = document.getElementById('searchBox');
const rows = Array.from(document.querySelectorAll('#reportTable tbody tr'));
const noResults = document.getElementById('noResults');

searchBox.addEventListener('input', function () {
  const q = this.value.trim().toLowerCase();
  let visibleCount = 0;
  rows.forEach(row => {
    const match = row.textContent.toLowerCase().includes(q);
    row.classList.toggle('d-none', !match);
    if (match) visibleCount++;
  });
  noResults.classList.toggle('d-none', visibleCount !== 0);
});

// Clicking a card also scrolls to & highlights matching table row (nice-to-have)
document.querySelectorAll('.report-card').forEach(card => {
  card.addEventListener('click', function (e) {
    if (e.target.closest('.btn-view')) return; // let modal trigger handle it
  });
});