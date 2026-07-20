const settingsNavItem = document.getElementById('settingsNavItem');
      const settingsToggle = document.getElementById('settingsToggle');
      const drawerLinks = document.querySelectorAll('.drawer-link');
      const panels = document.querySelectorAll('.panel');
      const pageTitle = document.getElementById('pageTitle');
      const pageSub = document.getElementById('pageSub');
 
      const panelMeta = {
        profile: { title: 'ព័ត៌មានអាជីវកម្ម', sub: 'គ្រប់គ្រងព័ត៌មានលម្អិតអំពីអាជីវកម្មរបស់អ្នក' },
        password: { title: 'ប្តូរពាក្យសម្ងាត់', sub: 'ធ្វើបច្ចុប្បន្នភាពពាក្យសម្ងាត់ចូលប្រព័ន្ធរបស់អ្នក' },
        backup: { title: 'បម្រុងទុកទិន្នន័យ', sub: 'បង្កើត និងគ្រប់គ្រងព័ត៌មានបម្រុងទុករបស់ប្រព័ន្ធ' },
        system: { title: 'ការកំណត់ប្រព័ន្ធ', sub: 'កំណត់ព័ត៌មានប្រព័ន្ធទូទៅ' },
      };
 
      // Start open since "System Settings" is the active sub-item on load
      if (settingsNavItem) settingsNavItem.classList.add('open');
 
      // Toggle the drawer open/closed when clicking "Settings"
      if (settingsToggle) {
        settingsToggle.addEventListener('click', (e) => {
          e.preventDefault(); // don't navigate away, just toggle the drawer
          settingsNavItem.classList.toggle('open');
        });
      }
 
      // ===== Backup panel interactions =====
      const backupStatusPill = document.getElementById('backupStatusPill');
      const createBackupBtn = document.getElementById('createBackupBtn');
      const restoreBackupBtn = document.getElementById('restoreBackupBtn');
      const restoreFileInput = document.getElementById('restoreFileInput');
      const backupHistoryList = document.getElementById('backupHistoryList');
      const autoBackupSwitch = document.getElementById('autoBackupSwitch');
 
      function khmerNow() {
        const khDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
        const toKh = n => String(n).split('').map(d => khDigits[d] ?? d).join('');
        const months = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'];
        const now = new Date();
        let h = now.getHours();
        const suffix = h < 12 ? 'ព្រឹក' : 'ល្ងាច';
        h = h % 12 || 12;
        const m = String(now.getMinutes()).padStart(2, '0');
        return `${toKh(now.getDate())} ${months[now.getMonth()]} ${toKh(now.getFullYear())}, ${toKh(h)}:${toKh(m)} ${suffix}`;
      }
 
      function addHistoryEntry(label, dotClass) {
        const li = document.createElement('li');
        li.className = 'backup-history-item';
        li.innerHTML = `
        <span class="dot ${dotClass}"></span>
        <span class="km hist-label">${label}</span>
        <span class="hist-sep">—</span>
        <span class="km hist-date">${khmerNow()}</span>
      `;
        backupHistoryList.prepend(li);
      }
 
      if (createBackupBtn) {
        createBackupBtn.addEventListener('click', () => {
          createBackupBtn.disabled = true;
          createBackupBtn.querySelector('span').textContent = 'កំពុងបម្រុងទុក...';
          backupStatusPill.textContent = 'កំពុងដំណើរការ';
          backupStatusPill.classList.add('running');
 
          setTimeout(() => {
            createBackupBtn.disabled = false;
            createBackupBtn.querySelector('span').textContent = 'បម្រុងទុកឥឡូវនេះ';
            backupStatusPill.textContent = 'បានចាប់';
            backupStatusPill.classList.remove('running');
            addHistoryEntry('បម្រុងទុកបានជោគជ័យ', 'dot-green');
          }, 1400);
        });
      }
 
      if (restoreBackupBtn && restoreFileInput) {
        restoreBackupBtn.addEventListener('click', () => restoreFileInput.click());
        restoreFileInput.addEventListener('change', () => {
          if (restoreFileInput.files.length) {
            addHistoryEntry(`ស្តារពីឯកសារ៖ ${restoreFileInput.files[0].name}`, 'dot-amber');
          }
        });
      }
 
      if (autoBackupSwitch) {
        autoBackupSwitch.addEventListener('change', () => {
          addHistoryEntry(
            autoBackupSwitch.checked ? 'បានបើកការបម្រុងទុកស្វ័យប្រវត្តិ' : 'បានបិទការបម្រុងទុកស្វ័យប្រវត្តិ',
            'dot-amber'
          );
        });
      }
 
      // Switch panels when a drawer sub-item is clicked
      drawerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // don't collapse the drawer on sub-click
          const key = link.dataset.panel;
 
          drawerLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
 
          panels.forEach(p => p.classList.remove('active'));
          const target = document.getElementById('panel-' + key);
          if (target) target.classList.add('active');
 
          if (pageTitle) pageTitle.textContent = panelMeta[key].title;
          if (pageSub) pageSub.textContent = panelMeta[key].sub;
        });
      });