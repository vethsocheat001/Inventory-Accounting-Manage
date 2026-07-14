/* ==========================================================
   cheatDBAdmin.js — Dashboard interactivity
   Builds the animated bar charts, wires up the sales /
   trend tabs, and keeps the task-progress card in sync.
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const toastEl  = document.getElementById('liveToast');
  const toastBody = document.getElementById('toastBody');
  const toast = toastEl ? new bootstrap.Toast(toastEl, { delay: 1800 }) : null;
  function notify(msg){
    if(!toast) return;
    toastBody.textContent = msg;
    toast.show();
  }

  function animateNumber(el, target, { prefix = '', suffix = '', duration = 700, decimals = 0 } = {}){
    const start = 0;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = start + (target - start) * eased;
      el.textContent = prefix + val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- TODAY'S SALES ---------------- */
  const salesData = {
    week:     { amt: 15420, trend: '▲ 10.4%', up: true, visits: 1284, payments: 372, conversion: 29 },
    lastweek: { amt: 13980, trend: '▼ 4.8%',  up: false, visits: 1102, payments: 318, conversion: 26 }
  };

  const salesAmt = document.getElementById('salesAmt');
  const salesTrend = document.getElementById('salesTrend');
  const statVisits = document.getElementById('statVisits');
  const statPayments = document.getElementById('statPayments');
  const statConversion = document.getElementById('statConversion');

  function renderSales(key){
    const d = salesData[key];
    animateNumber(salesAmt, d.amt, { prefix: '$' });
    salesTrend.textContent = d.trend;
    salesTrend.className = 'badge ' + (d.up ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger') + ' ' ;
    salesTrend.id = 'salesTrend';
    animateNumber(statVisits, d.visits);
    animateNumber(statPayments, d.payments);
    animateNumber(statConversion, d.conversion, { suffix: '%' });
  }

  document.querySelectorAll('#salesTabs [data-sales]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#salesTabs .nav-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSales(btn.dataset.sales);
    });
  });

  /* weekly chart bars — animate from 0 up to their data-h value */
  document.querySelectorAll('#chartRow .chart-bar').forEach(bar => {
    const h = bar.dataset.h;
    const v = bar.dataset.v;
    bar.querySelector('.val').textContent = v;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.height = h + '%'; }));
  });

  renderSales('week');

  /* ---------------- ASSIGNED TASKS ---------------- */
  const taskList = document.getElementById('taskList');
  const taskItems = () => Array.from(taskList.querySelectorAll('.task-item'));

  function updateTaskProgress(){
    const items = taskItems();
    const done = items.filter(i => i.classList.contains('done')).length;
    const total = items.length;
    const pct = Math.round((done / total) * 100);

    document.getElementById('taskBig').textContent = `${done} of ${total} tasks completed`;
    document.getElementById('taskPct').textContent = `${pct}%`;
    document.getElementById('taskProgress').style.width = pct + '%';

    const khmerDigits = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
    const toKhmer = n => String(n).split('').map(d => khmerDigits[d] ?? d).join('');
    document.getElementById('taskSm').textContent =
      `ការងារបានបញ្ចប់ ${toKhmer(done)} ក្នុងចំណោម ${toKhmer(total)}`;
  }

  taskItems().forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const tag = item.querySelector('.task-tag');
    checkbox.addEventListener('change', () => {
      if(checkbox.checked){
        item.classList.add('done');
        if(tag){ tag.textContent = 'Done'; tag.className = 'badge bg-success-subtle text-success rounded-pill task-tag'; }
        notify('Task marked as done');
      } else {
        item.classList.remove('done');
        if(tag){
          const level = item.dataset.tag;
          if(level === 'high'){ tag.textContent = 'High'; tag.className = 'badge bg-danger-subtle text-danger rounded-pill task-tag'; }
          else if(level === 'med'){ tag.textContent = 'Medium'; tag.className = 'badge bg-warning-subtle text-warning rounded-pill task-tag'; }
          else { tag.textContent = 'Pending'; tag.className = 'badge bg-secondary-subtle text-secondary rounded-pill task-tag'; }
        }
        notify('Task reopened');
      }
      updateTaskProgress();
    });
  });

  updateTaskProgress();

  /* ---------------- MONTHLY REVENUE CHART ---------------- */
  const revenueData = [
    { m: 'Jan', v: 9800 },  { m: 'Feb', v: 10650 }, { m: 'Mar', v: 11200 },
    { m: 'Apr', v: 9400 },  { m: 'May', v: 12100 }, { m: 'Jun', v: 13050 },
    { m: 'Jul', v: 14320 }, { m: 'Aug', v: 0 },     { m: 'Sep', v: 0 },
    { m: 'Oct', v: 0 },     { m: 'Nov', v: 0 },     { m: 'Dec', v: 0 }
  ];
  const ANNUAL_TARGET = 150000;

  const monthlyChart = document.getElementById('monthlyChart');
  const monthlyLabels = document.getElementById('monthlyLabels');
  const maxRevenue = Math.max(...revenueData.map(d => d.v));
  const bestMonth = revenueData.reduce((a, b) => (b.v > a.v ? b : a), revenueData[0]);
  const ytdTotal = revenueData.reduce((sum, d) => sum + d.v, 0);
  const monthsWithData = revenueData.filter(d => d.v > 0).length;

  revenueData.forEach(d => {
    const bar = document.createElement('div');
    bar.className = 'month-bar' + (d.m === bestMonth.m && d.v > 0 ? ' best' : '');
    bar.title = `${d.m}: $${d.v.toLocaleString()}`;
    monthlyChart.appendChild(bar);
    const h = maxRevenue ? Math.max(4, (d.v / maxRevenue) * 100) : 4;
    requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.height = h + '%'; }));

    const label = document.createElement('div');
    label.className = 'flex-fill';
    label.textContent = d.m;
    monthlyLabels.appendChild(label);
  });

  animateNumber(document.getElementById('revenueAmt'), ytdTotal, { prefix: '$' });
  document.getElementById('revenueBest').textContent = `$${bestMonth.v.toLocaleString()}`;
  document.getElementById('revenueAvg').textContent =
    `$${Math.round(ytdTotal / (monthsWithData || 1)).toLocaleString()}`;
  document.getElementById('revenueTarget').textContent =
    `${Math.min(100, Math.round((ytdTotal / ANNUAL_TARGET) * 100))}%`;

  /* ---------------- STORE SALES TREND (stacked, sales vs visits) ---------------- */
  const trendData = {
    sales: [
      { m: 'Jan', online: 32, instore: 48, wholesale: 20 },
      { m: 'Feb', online: 30, instore: 50, wholesale: 22 },
      { m: 'Mar', online: 35, instore: 46, wholesale: 24 },
      { m: 'Apr', online: 28, instore: 44, wholesale: 18 },
      { m: 'May', online: 38, instore: 52, wholesale: 26 },
      { m: 'Jun', online: 42, instore: 58, wholesale: 28 },
      { m: 'Jul', online: 48, instore: 64, wholesale: 30 },
      { m: 'Aug', online: 40, instore: 55, wholesale: 25 },
      { m: 'Sep', online: 36, instore: 50, wholesale: 22 },
      { m: 'Oct', online: 44, instore: 60, wholesale: 27 },
      { m: 'Nov', online: 50, instore: 68, wholesale: 32 },
      { m: 'Dec', online: 58, instore: 74, wholesale: 36 }
    ],
    visits: [
      { m: 'Jan', online: 60, instore: 30, wholesale: 8 },
      { m: 'Feb', online: 58, instore: 32, wholesale: 9 },
      { m: 'Mar', online: 64, instore: 34, wholesale: 10 },
      { m: 'Apr', online: 55, instore: 28, wholesale: 8 },
      { m: 'May', online: 70, instore: 36, wholesale: 11 },
      { m: 'Jun', online: 75, instore: 40, wholesale: 12 },
      { m: 'Jul', online: 82, instore: 44, wholesale: 14 },
      { m: 'Aug', online: 72, instore: 38, wholesale: 12 },
      { m: 'Sep', online: 66, instore: 34, wholesale: 10 },
      { m: 'Oct', online: 78, instore: 42, wholesale: 13 },
      { m: 'Nov', online: 88, instore: 48, wholesale: 15 },
      { m: 'Dec', online: 95, instore: 52, wholesale: 18 }
    ]
  };

  const bigChart = document.getElementById('bigChart');
  const yearLabels = document.getElementById('yearLabels');

  function renderTrend(key){
    bigChart.innerHTML = '';
    yearLabels.innerHTML = '';
    const rows = trendData[key];
    const maxTotal = Math.max(...rows.map(r => r.online + r.instore + r.wholesale));

    rows.forEach(r => {
      const col = document.createElement('div');
      col.className = 'trend-col';

      const online = document.createElement('div');
      online.className = 'trend-seg online';
      const instore = document.createElement('div');
      instore.className = 'trend-seg instore';
      const wholesale = document.createElement('div');
      wholesale.className = 'trend-seg wholesale';

      col.appendChild(online);
      col.appendChild(instore);
      col.appendChild(wholesale);
      bigChart.appendChild(col);

      requestAnimationFrame(() => requestAnimationFrame(() => {
        online.style.height = (r.online / maxTotal) * 100 + '%';
        instore.style.height = (r.instore / maxTotal) * 100 + '%';
        wholesale.style.height = (r.wholesale / maxTotal) * 100 + '%';
      }));

      const label = document.createElement('div');
      label.className = 'flex-fill';
      label.textContent = r.m;
      yearLabels.appendChild(label);
    });
  }

  document.querySelectorAll('#trendTabs [data-trend]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#trendTabs .nav-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrend(btn.dataset.trend);
    });
  });

  renderTrend('sales');

  /* ---------------- BELL ---------------- */
  const bellBtn = document.getElementById('bellBtn');
  if(bellBtn){
    bellBtn.addEventListener('click', () => notify('You have 3 new notifications'));
  }
});
