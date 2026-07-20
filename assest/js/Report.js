 const REPORTS = {
      sales: {
        title: "របាយការណ៍ការលក់",
        sub: "SALES REPORT",
        icon: "bi-graph-up-arrow",
        color: "var(--sales), #5B8DEF",
        stats: [
          { icon: "bi-file-earmark-text-fill", color: "var(--sales)", value: "30", km: "ចំនួនវិក្កយបត្រ", en: "Total Invoice" },
          { icon: "bi-box-seam-fill", color: "var(--inventory)", value: "85", km: "ផលិតផលបានលក់", en: "Products Sold" },
          { icon: "bi-cash-coin", color: "var(--profit)", value: "$4,580", km: "ចំណូលសរុប", en: "Total Revenue" },
        ],
        headers: ["លេខវិក្កយបត្រ", "អតិថិជន", "ថ្ងៃលក់", "ចំនួន", "សរុប", "ស្ថានភាព"],
        rows: [
          ["INV-1001", "សុខា", "14-07-2026", "3", "$86.00", "បានទូទាត់"],
          ["INV-1002", "អតិថិជនចរណ៍", "14-07-2026", "1", "$12.00", "បានទូទាត់"],
          ["INV-1003", "ដារា", "13-07-2026", "2", "$100.00", "មិនទាន់ទូទាត់"],
          ["INV-1004", "សុភា", "12-07-2026", "5", "$212.00", "បានទូទាត់"],
          ["INV-1005", "អតិថិជនចរណ៍", "11-07-2026", "2", "$45.00", "បានទូទាត់"],
        ],
      },
      inventory: {
        title: "របាយការណ៍ស្តុក",
        sub: "INVENTORY REPORT",
        icon: "bi-box-seam-fill",
        color: "var(--inventory), #3FCB94",
        stats: [
          { icon: "bi-boxes", color: "var(--inventory)", value: "312", km: "ចំនួនផលិតផលសរុប", en: "Total Products" },
          { icon: "bi-exclamation-triangle-fill", color: "var(--expense)", value: "14", km: "ជិតអស់ស្តុក", en: "Low Stock" },
          { icon: "bi-x-circle-fill", color: "var(--ink-500)", value: "3", km: "អស់ស្តុក", en: "Out of Stock" },
        ],
        headers: ["លេខកូដ", "ឈ្មោះផលិតផល", "ប្រភេទ", "បរិមាណ", "ស្ថានភាព"],
        rows: [
          ["P-0021", "ស្ករ ១គ.ក", "គ្រឿងទេស", "6", "ជិតអស់"],
          ["P-0045", "ប្រេងឆា ១លីត្រ", "គ្រឿងទេស", "42", "គ្រប់គ្រាន់"],
          ["P-0102", "ទឹកកញ្ចប់ 500ml", "ភេសជ្ជៈ", "0", "អស់ស្តុក"],
          ["P-0118", "នំបុ័ង", "ម្ហូបញ៉ាំ", "58", "គ្រប់គ្រាន់"],
        ],
      },
      purchase: {
        title: "របាយការណ៍ការទិញ",
        sub: "PURCHASE REPORT",
        icon: "bi-truck",
        color: "var(--purchase), #FFAE58",
        stats: [
          { icon: "bi-receipt", color: "var(--purchase)", value: "18", km: "ការបញ្ជាទិញ", en: "Purchase Orders" },
          { icon: "bi-people-fill", color: "var(--sales)", value: "6", km: "អ្នកផ្គត់ផ្គង់", en: "Suppliers" },
          { icon: "bi-cash-stack", color: "var(--expense)", value: "$3,120", km: "ចំណាយសរុប", en: "Total Spent" },
        ],
        headers: ["លេខបញ្ជាទិញ", "អ្នកផ្គត់ផ្គង់", "ថ្ងៃទិញ", "ចំនួន", "សរុប", "ស្ថានភាព"],
        rows: [
          ["PO-501", "ក្រុមហ៊ុន ម៉េងលី", "10-07-2026", "120", "$960.00", "បានទូទាត់"],
          ["PO-502", "សហករណ៍ស្រូវមាស", "08-07-2026", "60", "$540.00", "មិនទាន់ទូទាត់"],
          ["PO-503", "អ្នកផ្គត់ផ្គង់ភេសជ្ជៈ", "05-07-2026", "200", "$1,620.00", "បានទូទាត់"],
        ],
      },
      expense: {
        title: "របាយការណ៍ចំណាយ",
        sub: "EXPENSE REPORT",
        icon: "bi-receipt-cutoff",
        color: "var(--expense), #FF7A7E",
        stats: [
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "27", km: "ចំនួនចំណាយ", en: "Total Entries" },
          { icon: "bi-house-door-fill", color: "var(--purchase)", value: "5", km: "ប្រភេទចំណាយ", en: "Categories" },
          { icon: "bi-cash", color: "var(--expense)", value: "$1,940", km: "ចំណាយសរុប", en: "Total Expense" },
        ],
        headers: ["កាលបរិច្ឆេទ", "ប្រភេទ", "ការពិពណ៌នា", "ចំនួនទឹកប្រាក់"],
        rows: [
          ["14-07-2026", "ភ្លើង/ទឹក", "វិក្កយបត្រខែកក្កដា", "$85.00"],
          ["12-07-2026", "ជួល", "ជួលហាងខែកក្កដា", "$450.00"],
          ["10-07-2026", "ដឹកជញ្ជូន", "ថ្លៃដឹកទំនិញ", "$60.00"],
          ["07-07-2026", "ប្រាក់ខែ", "ប្រាក់ខែបុគ្គលិក", "$1,200.00"],
        ],
      },
      profit: {
        title: "របាយការណ៍ប្រាក់ចំណេញ",
        sub: "PROFIT REPORT",
        icon: "bi-trophy-fill",
        color: "var(--profit), #E8BB4E",
        stats: [
          { icon: "bi-graph-up-arrow", color: "var(--sales)", value: "$4,580", km: "ចំណូលសរុប", en: "Total Revenue" },
          { icon: "bi-receipt-cutoff", color: "var(--expense)", value: "$1,940", km: "ចំណាយសរុប", en: "Total Expense" },
          { icon: "bi-piggy-bank-fill", color: "var(--profit)", value: "$2,640", km: "ប្រាក់ចំណេញសុទ្ធ", en: "Net Profit" },
        ],
        headers: ["ខែ", "ចំណូល", "ចំណាយ", "ប្រាក់ចំណេញ"],
        rows: [
          ["កក្កដា 2026", "$4,580.00", "$1,940.00", "$2,640.00"],
          ["មិថុនា 2026", "$3,920.00", "$1,610.00", "$2,310.00"],
          ["ឧសភា 2026", "$4,105.00", "$1,780.00", "$2,325.00"],
        ],
      },
    };
 
    const modalEl = document.getElementById('reportModal');
    const bsModal = new bootstrap.Modal(modalEl);
    const exportModalEl = document.getElementById('exportModal');
    const bsExportModal = new bootstrap.Modal(exportModalEl);
 
    let currentReportKey = 'sales';
    // Tracks whether the export modal was opened FROM the print flow,
    // so we only reopen the report modal in that specific case —
    // not every time the export modal happens to close.
    let returningFromExport = false;
 
    function statusPillHtml(val) {
      if (val === "បានទូទាត់") return `<span class="status-pill paid"><i class="bi bi-check-circle-fill"></i> បានទូទាត់</span>`;
      if (val === "មិនទាន់ទូទាត់") return `<span class="status-pill unpaid"><i class="bi bi-x-circle-fill"></i> មិនទាន់ទូទាត់</span>`;
      if (val === "ជិតអស់") return `<span class="status-pill unpaid"><i class="bi bi-exclamation-triangle-fill"></i> ជិតអស់</span>`;
      if (val === "អស់ស្តុក") return `<span class="status-pill unpaid"><i class="bi bi-x-circle-fill"></i> អស់ស្តុក</span>`;
      if (val === "គ្រប់គ្រាន់") return `<span class="status-pill paid"><i class="bi bi-check-circle-fill"></i> គ្រប់គ្រាន់</span>`;
      return val;
    }
 
    const STATUS_VALUES = ["បានទូទាត់", "មិនទាន់ទូទាត់", "ជិតអស់", "អស់ស្តុក", "គ្រប់គ្រាន់"];
 
    // Builds the always-in-DOM printable version of a report (independent of modal visibility)
    function renderPrintArea(key) {
      const data = REPORTS[key];
      const from = document.getElementById('fromDate').value || '—';
      const to = document.getElementById('toDate').value || '—';
 
      const statsHtml = data.stats.map(s => `
      <td style="padding:10px 16px; border:1px solid #E7E9F0; text-align:center;">
        <div style="font-size:19px; font-weight:800;">${s.value}</div>
        <div style="font-size:11.5px; color:#555;">${s.km}</div>
      </td>`).join('');
 
      const rowsHtml = data.rows.map(r => `
      <tr>${r.map((c) => `<td style="padding:8px 12px; border:1px solid #E7E9F0; font-size:12.5px;">${c}</td>`).join('')}</tr>`).join('');
 
      document.getElementById('printArea').innerHTML = `
      <div style="font-family:'Noto Sans Khmer',sans-serif; color:#131A2C; padding:24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #131A2C; padding-bottom:12px; margin-bottom:16px;">
          <div>
            <div style="font-size:18px; font-weight:800;">${data.title} <span style="font-size:12px; font-weight:600; color:#666;">(${data.sub})</span></div>
            <div style="font-size:12px; color:#666; margin-top:4px;">រយៈពេល៖ ${from} — ${to}</div>
          </div>
          <div style="font-size:12px; color:#666; text-align:right;">
            <div style="font-weight:700; color:#131A2C;">វិបុលភាព</div>
            <div>បង្កើតនៅ ${new Date().toLocaleDateString('en-GB')}</div>
          </div>
        </div>
        <table style="border-collapse:collapse; width:100%; margin-bottom:18px;"><tr>${statsHtml}</tr></table>
        <table style="border-collapse:collapse; width:100%;">
          <thead><tr>${data.headers.map(h => `<th style="padding:8px 12px; border:1px solid #E7E9F0; background:#F3F5FA; font-size:11.5px; text-align:left;">${h}</th>`).join('')}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>`;
    }
 
    function showToast(msg) {
      const t = document.getElementById('toastLite');
      document.getElementById('toastMsg').textContent = msg;
      t.classList.add('show');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(() => t.classList.remove('show'), 2600);
    }
 
    function openReport(key) {
      const data = REPORTS[key];
      if (!data) return;
      currentReportKey = key;
 
      document.getElementById('modalHeader').style.background = `linear-gradient(120deg, ${data.color})`;
      document.getElementById('modalIcon').className = 'bi ' + data.icon;
      document.getElementById('modalTitle').innerHTML = `${data.title} <span style="opacity:.75; font-weight:600; font-size:12.5px; letter-spacing:.04em;">(${data.sub})</span>`;
 
      const statRow = document.getElementById('statRow');
      statRow.innerHTML = data.stats.map(s => `
      <div class="col-sm-4">
        <div class="stat-card">
          <div class="stat-ic" style="background:${s.color}22; color:${s.color}"><i class="bi ${s.icon}"></i></div>
          <div class="stat-value num">${s.value}</div>
          <div class="stat-label-km">${s.km}</div>
          <div class="stat-label-en">${s.en}</div>
        </div>
      </div>
    `).join('');
 
      document.getElementById('detailHead').innerHTML = data.headers.map(h => `<th>${h}</th>`).join('');
      document.getElementById('detailBody').innerHTML = data.rows.map(r => {
        const cells = r.map((c, i) => {
          const isStatus = (i === r.length - 1) && STATUS_VALUES.includes(c);
          return `<td class="${/^\$|^\d+$/.test(c) ? 'num' : ''}">${isStatus ? statusPillHtml(c) : c}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
 
      renderPrintArea(key);
      bsModal.show();
    }
 
    document.querySelectorAll('[data-report]').forEach(el => {
      el.addEventListener('click', () => openReport(el.getAttribute('data-report')));
    });
 
    // Keep the print area in sync if the date filters change
    document.getElementById('fromDate').addEventListener('change', () => renderPrintArea(currentReportKey));
    document.getElementById('toDate').addEventListener('change', () => renderPrintArea(currentReportKey));
 
    // ---- Print button -> open export options modal ----
    document.getElementById('printTriggerBtn').addEventListener('click', () => {
      renderPrintArea(currentReportKey);
      returningFromExport = true;
      modalEl.addEventListener('hidden.bs.modal', function onHidden() {
        modalEl.removeEventListener('hidden.bs.modal', onHidden);
        bsExportModal.show();
      });
      bsModal.hide();
    });
 
    // Only reopen the report modal when the export modal was reached
    // through the print flow above — closing it any other way (X button,
    // "បិទ" button, Escape, backdrop click, or after a successful export)
    // just closes it, instead of looping back into the report modal.
    exportModalEl.addEventListener('hidden.bs.modal', () => {
      if (returningFromExport) {
        returningFromExport = false;
        bsModal.show();
      }
    });
 
    // ---- Export option handlers ----
    document.getElementById('btnPreview').addEventListener('click', () => {
      window.print();
    });
 
    document.getElementById('btnPrintNow').addEventListener('click', () => {
      window.print();
    });
 
    document.getElementById('btnExportPdf').addEventListener('click', () => {
      try {
        const data = REPORTS[currentReportKey];
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        doc.setFontSize(14);
        doc.text(`${data.title} (${data.sub})`, 40, 40);
        doc.setFontSize(10);
        const from = document.getElementById('fromDate').value || '-';
        const to = document.getElementById('toDate').value || '-';
        doc.text(`Period: ${from} - ${to}`, 40, 58);
        doc.autoTable({
          startY: 72,
          head: [data.headers],
          body: data.rows,
          styles: { fontSize: 9 },
          headStyles: { fillColor: [47, 111, 237] },
        });
        doc.save(`${currentReportKey}-report.pdf`);
        showToast('បាននាំចេញជា PDF ជោគជ័យ');
      } catch (e) {
        showToast('មិនអាចនាំចេញ PDF បានទេ');
      }
    });
 
    document.getElementById('btnExportExcel').addEventListener('click', () => {
      try {
        const data = REPORTS[currentReportKey];
        const sheetData = [data.headers, ...data.rows];
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, data.sub.slice(0, 28));
        XLSX.writeFile(wb, `${currentReportKey}-report.xlsx`);
        showToast('បាននាំចេញជា Excel ជោគជ័យ');
      } catch (e) {
        showToast('មិនអាចនាំចេញ Excel បានទេ');
      }
    });
 
    document.getElementById('btnSendEmail').addEventListener('click', () => {
      const data = REPORTS[currentReportKey];
      const from = document.getElementById('fromDate').value || '-';
      const to = document.getElementById('toDate').value || '-';
      const subject = encodeURIComponent(`${data.title} (${data.sub}) - ${from} to ${to}`);
      const bodyLines = data.stats.map(s => `${s.km} (${s.en}): ${s.value}`).join('%0D%0A');
      const body = `សូមមើលរបាយការណ៍ភ្ជាប់ខាងក្រោម៖%0D%0A%0D%0A${bodyLines}`;
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      showToast('កំពុងបើកកម្មវិធីអ៊ីមែល');
    });