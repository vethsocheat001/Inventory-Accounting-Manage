/* cheatDBStaff.js — populates all dynamic Dashboard data:
   - Today's Sales chart bars (from data-h / data-v attributes)
   - Sales total + This week / Last week toggle
   - Mini stats: Visits / Payments / Conversion
   - Assigned Tasks progress bar
   - Store Sales Trend big chart
*/
document.addEventListener("DOMContentLoaded", function () {

  /* ---------- 1) TODAY'S SALES CHART (chartRow) ---------- */
  var chartRow = document.getElementById("chartRow");
  var bars = chartRow ? chartRow.querySelectorAll(".chart-bar") : [];

  // Read each bar's data-h (height %) / data-v (label) straight from the HTML
  var weekValues = [];
  bars.forEach(function (bar) {
    var h = parseFloat(bar.getAttribute("data-h")) || 0;
    var v = bar.getAttribute("data-v") || "";
    bar.style.height = h + "%";
    var val = bar.querySelector(".val");
    if (val) val.textContent = v;
    weekValues.push(parseFloat(v)); // e.g. "8.1k" -> 8.1
  });

  // Last week = same shape, scaled down ~10.4% (matches the ▲10.4% badge already in the HTML)
  var lastWeekValues = weekValues.map(function (v) { return +(v / 1.104).toFixed(1); });
  var lastWeekMax = Math.max.apply(null, lastWeekValues) || 1;

  function renderWeek(values, isLastWeek) {
    var max = isLastWeek ? lastWeekMax : 100; // "This week" already has data-h as %, base on that
    bars.forEach(function (bar, i) {
      if (isLastWeek) {
        var pct = (values[i] / lastWeekMax) * 100;
        bar.style.height = pct + "%";
      } else {
        bar.style.height = (parseFloat(bar.getAttribute("data-h")) || 0) + "%";
      }
      var val = bar.querySelector(".val");
      if (val) val.textContent = values[i] + "k";
    });
  }

  function totalOf(values) {
    return values.reduce(function (a, b) { return a + b; }, 0);
  }

  var salesAmt = document.getElementById("salesAmt");
  var salesTrend = document.getElementById("salesTrend");

  function showWeek(kind) {
    var values = kind === "lastweek" ? lastWeekValues : weekValues;
    renderWeek(values, kind === "lastweek");
    if (salesAmt) salesAmt.textContent = "$" + (totalOf(values) * 1000).toLocaleString();
    if (salesTrend) salesTrend.textContent = kind === "lastweek" ? "▼ 5.2%" : "▲ 10.4%";
  }
  showWeek("week");

  document.querySelectorAll("#salesTabs [data-sales]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("#salesTabs .nav-link").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      showWeek(btn.getAttribute("data-sales"));
    });
  });

  /* ---------- 2) MINI STATS: Visits / Payments / Conversion ---------- */
  var statVisits = document.getElementById("statVisits");
  var statPayments = document.getElementById("statPayments");
  var statConversion = document.getElementById("statConversion");

  // Derived from the same week totals, so it stays consistent with the chart above
  var visits = Math.round(totalOf(weekValues) * 12);   // e.g. 72.9k sales -> ~875 visits
  var payments = 37;                                     // matches "37 invoices" KPI card
  var conversion = Math.round((payments / visits) * 1000) / 10;

  function countUp(el, target, suffix) {
    if (!el) return;
    var start = 0;
    var step = Math.max(1, Math.round(target / 30));
    var timer = setInterval(function () {
      start += step;
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = start + (suffix || "");
    }, 20);
  }
  countUp(statVisits, visits, "");
  countUp(statPayments, payments, "");
  countUp(statConversion, conversion, "%");

  /* ---------- 3) ASSIGNED TASKS PROGRESS BAR ---------- */
  var taskList = document.getElementById("taskList");
  var taskProgress = document.getElementById("taskProgress");
  var taskPct = document.getElementById("taskPct");
  var taskBig = document.getElementById("taskBig");

  if (taskList) {
    var items = taskList.querySelectorAll(".task-item");
    var done = taskList.querySelectorAll(".task-item.done").length;
    var total = items.length;
    var pct = total ? Math.round((done / total) * 100) : 0;

    if (taskProgress) setTimeout(function () { taskProgress.style.width = pct + "%"; }, 100);
    if (taskPct) taskPct.textContent = pct + "%";
    if (taskBig) taskBig.textContent = done + " of " + total + " tasks completed";

    // Let checking/unchecking a task update the bar live
    items.forEach(function (item) {
      var checkbox = item.querySelector('input[type="checkbox"]');
      if (!checkbox) return;
      checkbox.addEventListener("change", function () {
        item.classList.toggle("done", checkbox.checked);
        var newDone = taskList.querySelectorAll(".task-item.done").length;
        var newPct = total ? Math.round((newDone / total) * 100) : 0;
        if (taskProgress) taskProgress.style.width = newPct + "%";
        if (taskPct) taskPct.textContent = newPct + "%";
        if (taskBig) taskBig.textContent = newDone + " of " + total + " tasks completed";
      });
    });
  }

  /* ---------- 4) STORE SALES TREND (bigChart / yearLabels) ---------- */
  var bigChart = document.getElementById("bigChart");
  var yearLabels = document.getElementById("yearLabels");

  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  // Fixed sample dataset for 2020, split Online / In-store / Wholesale (matches the legend already in the HTML)
  var trend = {
    sales: [
      [20,45,10],[25,50,12],[18,60,15],[30,55,20],[28,65,18],[35,70,22],
      [40,80,25],[38,75,24],[32,68,20],[36,72,22],[42,85,28],[50,95,30]
    ],
    visits: [
      [80,120,30],[90,130,32],[85,150,35],[100,140,40],[95,160,38],[110,175,45],
      [120,190,48],[115,180,46],[105,165,42],[112,172,44],[125,195,50],[140,210,55]
    ]
  };

  function renderTrend(kind) {
    var data = trend[kind] || trend.sales;
    var max = Math.max.apply(null, data.map(function (m) { return m[0] + m[1] + m[2]; }));
    bigChart.innerHTML = "";
    data.forEach(function (m) {
      var col = document.createElement("div");
      col.className = "d-flex flex-column-reverse flex-fill";
      col.style.height = "100%";
      col.style.gap = "2px";

      var segments = [
        { v: m[0], color: "#e1ddff" }, // Online
        { v: m[1], color: "#6d4de0" }, // In-store (violet)
        { v: m[2], color: "#c9c2ff" }  // Wholesale
      ];
      segments.forEach(function (seg) {
        var bar = document.createElement("div");
        bar.style.background = seg.color;
        bar.style.width = "100%";
        bar.style.height = (seg.v / max) * 100 + "%";
        bar.style.borderRadius = "3px";
        col.appendChild(bar);
      });
      bigChart.appendChild(col);
    });

    yearLabels.innerHTML = "";
    months.forEach(function (m) {
      var lbl = document.createElement("div");
      lbl.className = "flex-fill";
      lbl.textContent = m;
      yearLabels.appendChild(lbl);
    });
  }

  if (bigChart && yearLabels) {
    renderTrend("sales");
    document.querySelectorAll("#trendTabs [data-trend]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.querySelectorAll("#trendTabs .nav-link").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        renderTrend(btn.getAttribute("data-trend"));
      });
    });
  }

});