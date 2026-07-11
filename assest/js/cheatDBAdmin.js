function countUp(el, target, opts = {}) {
    const dur = opts.duration || 1200;
    const suffix = opts.suffix || '';
    const prefix = opts.prefix || '';
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const toastEl = document.getElementById('liveToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
  function showToast(msg) {
    document.getElementById('toastBody').textContent = msg;
    toast.show();
  }
  document.getElementById('bellBtn').addEventListener('click', () => {
    showToast('🔔 No new notifications');
  });

  const salesData = {
    week: { amt: 15443, trend: '▲ 10.4%', up: true, bars: [52,68,38,82,100,58,71], vals: ['8.1k','10.6k','5.9k','12.8k','15.4k','9.0k','11.1k'] },
    lastweek: { amt: 13980, trend: '▼ 4.2%', up: false, bars: [60,45,72,50,66,88,40], vals: ['9.4k','7.0k','11.2k','7.8k','10.3k','13.7k','6.2k'] }
  };

  function renderSales(data, animate) {
    countUp(document.getElementById('salesAmt'), data.amt, { prefix: '$', duration: animate ? 1200 : 600 });
    const trendEl = document.getElementById('salesTrend');
    trendEl.textContent = data.trend;
    trendEl.className = 'badge ' + (data.up ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger');
    document.querySelectorAll('#chartRow .chart-bar').forEach((bar, i) => {
      const h = data.bars[i];
      setTimeout(() => { bar.style.height = h + '%'; }, animate ? i * 70 : 0);
      bar.querySelector('.val').textContent = '$' + data.vals[i];
      bar.classList.toggle('peak', h === Math.max(...data.bars));
    });
  }

  document.querySelectorAll('#salesTabs [data-sales]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#salesTabs .nav-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSales(salesData[btn.dataset.sales], false);
    });
  });

  /* ======================================================================
     MONTHLY REVENUE CHART (View Monthly Revenue)
     Same idea as the Store Sales Trend chart below: data lives in one
     array, JavaScript builds every bar + label from it.
     ====================================================================== */
  const revenueData = [
    { month: 'មករា',    amt: 9800  },
    { month: 'កុម្ភៈ',  amt: 10450 },
    { month: 'មីនា',    amt: 11200 },
    { month: 'មេសា',    amt: 10100 },
    { month: 'ឧសភា',    amt: 12600 },
    { month: 'មិថុនា',  amt: 13400 },
    { month: 'កក្កដា',  amt: 14320 },
    { month: 'សីហា',    amt: 13950 },
    { month: 'កញ្ញា',   amt: 15100 },
    { month: 'តុលា',    amt: 16200 },
    { month: 'វិច្ឆិកា', amt: 17840 },
    { month: 'ធ្នូ',     amt: 19630 }
  ];

  function renderMonthlyRevenue() {
    const chartEl = document.getElementById('monthlyChart');
    const labelsEl = document.getElementById('monthlyLabels');
    chartEl.innerHTML = '';
    labelsEl.innerHTML = '';

    const maxAmt = Math.max(...revenueData.map(m => m.amt));
    const total = revenueData.reduce((sum, m) => sum + m.amt, 0);
    const best = revenueData.reduce((a, b) => (b.amt > a.amt ? b : a));
    const avg = Math.round(total / revenueData.length);
    const target = 200000; // annual target
    const targetPct = Math.min(Math.round((total / target) * 100), 100);

    revenueData.forEach((m, i) => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar' + (m.amt === maxAmt ? ' peak' : '');
      bar.innerHTML = `<span class="val">$${(m.amt / 1000).toFixed(1)}k</span>`;
      chartEl.appendChild(bar);
      setTimeout(() => { bar.style.height = (m.amt / maxAmt) * 100 + '%'; }, i * 45);

      const label = document.createElement('div');
      label.className = 'flex-fill km';
      label.style.fontSize = '.68rem';
      label.textContent = m.month;
      labelsEl.appendChild(label);
    });

    countUp(document.getElementById('revenueAmt'), total, { prefix: '$', duration: 1300 });
    countUp(document.getElementById('revenueBest'), best.amt, { prefix: '$', duration: 900 });
    countUp(document.getElementById('revenueAvg'), avg, { prefix: '$', duration: 900 });
    countUp(document.getElementById('revenueTarget'), targetPct, { suffix: '%', duration: 900 });
  }

  const trendData = {
    sales: [
      { year: '2017', online: 70, instore: 55, wholesale: 48 },
      { year: '2018', online: 30, instore: 45, wholesale: 52 },
      { year: '2019', online: 33, instore: 95, wholesale: 64 },
      { year: '2020', online: 28, instore: 55, wholesale: 62 }
    ],
    visits: [
      { year: '2017', online: 45, instore: 60, wholesale: 38 },
      { year: '2018', online: 52, instore: 40, wholesale: 58 },
      { year: '2019', online: 60, instore: 72, wholesale: 50 },
      { year: '2020', online: 48, instore: 66, wholesale: 70 }
    ]
  };

  function renderTrendChart(dataset) {
    const chartEl = document.getElementById('bigChart');
    const yearsEl = document.getElementById('yearLabels');
    chartEl.innerHTML = '';
    yearsEl.innerHTML = '';
    dataset.forEach(yearData => {
      const group = document.createElement('div');
      group.className = 'flex-fill d-flex align-items-end gap-1 h-100';
      group.innerHTML = `
        <div class="trend-bar b1" data-h="${yearData.online}"></div>
        <div class="trend-bar b2" data-h="${yearData.instore}"></div>
        <div class="trend-bar b3" data-h="${yearData.wholesale}"></div>
      `;
      chartEl.appendChild(group);
      const label = document.createElement('div');
      label.className = 'flex-fill';
      label.textContent = yearData.year;
      yearsEl.appendChild(label);
    });
    chartEl.querySelectorAll('.trend-bar').forEach((bar, i) => {
      setTimeout(() => { bar.style.height = bar.dataset.h + '%'; }, i * 60);
    });
  }

  document.querySelectorAll('#trendTabs [data-trend]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#trendTabs .nav-link').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTrendChart(trendData[btn.dataset.trend]);
    });
  });

  const khmerDigits = ['០','១','២','៣','៤','៥','៦','៧','៨','៩'];
  const toKhmer = n => String(n).split('').map(d => khmerDigits[d]).join('');

  function updateTaskProgress() {
    const items = document.querySelectorAll('[data-task]');
    const total = items.length;
    const done = document.querySelectorAll('[data-task].done').length;
    const pct = Math.round((done / total) * 100);
    document.getElementById('taskProgress').style.width = pct + '%';
    document.getElementById('taskPct').textContent = pct + '%';
    document.getElementById('taskBig').textContent = `${done} of ${total} tasks completed`;
    document.getElementById('taskSm').textContent = `ការងារបានបញ្ចប់ ${toKhmer(done)} ក្នុងចំណោម ${toKhmer(total)}`;
  }

  document.querySelectorAll('[data-task]').forEach(item => {
    const checkbox = item.querySelector('input[type="checkbox"]');
    const tag = item.querySelector('.task-tag');
    item.addEventListener('click', (e) => {
      if (e.target === checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change'));
    });
    checkbox.addEventListener('change', () => {
      const isDone = checkbox.checked;
      item.classList.toggle('done', isDone);
      if (isDone) {
        item.dataset.prevTag = item.dataset.tag || 'low';
        tag.className = 'badge bg-success-subtle text-success rounded-pill task-tag';
        tag.textContent = 'Done';
        showToast('✓ Marked as complete');
      } else {
        const prev = item.dataset.prevTag || 'low';
        const map = {
          high: ['bg-danger-subtle text-danger', 'High'],
          med: ['bg-warning-subtle text-warning', 'Medium'],
          low: ['bg-primary-subtle text-primary', 'Low']
        };
        tag.className = 'badge rounded-pill task-tag ' + map[prev][0];
        tag.textContent = map[prev][1];
        showToast('↺ Marked as pending');
      }
      updateTaskProgress();
    });
  });

  window.addEventListener('load', () => {
    renderSales(salesData.week, true);
    renderTrendChart(trendData.sales);
    renderMonthlyRevenue();
    updateTaskProgress();
    countUp(document.getElementById('statVisits'), 6480, { duration: 1000 });
    countUp(document.getElementById('statPayments'), 5320, { duration: 1100 });
    countUp(document.getElementById('statConversion'), 50, { suffix: '%', duration: 900 });
  });