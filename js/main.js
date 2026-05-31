/* ========================================================
   UnrealAkademi — Main
   Genel sayfa yönetimi, sidebar, tema, font, offline
   ======================================================== */

const App = {
  init() {
    this.setupSidebar();
    this.setupCompleteButton();
    this.highlightCurrentPage();
    this.applyStoredPreferences();
    this.injectToolbar();
    this.registerServiceWorker();
  },

  /* ---------------- SIDEBAR ---------------- */
  setupSidebar() {
    const toggle = document.querySelector('.mobile-toggle');
    const sidebar = document.getElementById('sidebar');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        document.body.classList.toggle('sidebar-open');
      });

      sidebar.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
            document.body.classList.remove('sidebar-open');
          }
        });
      });

      document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') &&
            !sidebar.contains(e.target) &&
            !toggle.contains(e.target)) {
          sidebar.classList.remove('open');
          document.body.classList.remove('sidebar-open');
        }
      });
    }
  },

  /* ---------------- COMPLETE BUTTON ---------------- */
  setupCompleteButton() {
    const btn = document.querySelector('.btn-complete');
    if (!btn) return;
    const sectionId = btn.dataset.section;
    if (!sectionId) return;
    btn.addEventListener('click', () => {
      Progress.toggle(sectionId);
    });
  },

  /* ---------------- HIGHLIGHT CURRENT PAGE ---------------- */
  highlightCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const linkFile = href.split('/').pop().replace('.html', '');
        if (linkFile === filename || (filename === '' && href.includes('index'))) {
          link.classList.add('active');
        }
      }
    });
  },

  /* ---------------- PREFERENCES (Tema + Font) ---------------- */
  applyStoredPreferences() {
    // Tema
    const savedTheme = localStorage.getItem('ua_theme');
    if (savedTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (savedTheme === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      // İlk ziyaret — sistem tercihini takip et
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      if (prefersLight) {
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }

    // Font ölçeği
    const savedFont = localStorage.getItem('ua_font_scale') || 'md';
    document.body.setAttribute('data-font-scale', savedFont);

    // İlk yüklemede theme-color senkronize et
    this.updateMetaThemeColor();
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('ua_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('ua_theme', 'light');
    }
    this.updateThemeIcon();
    this.updateMetaThemeColor();
  },

  updateMetaThemeColor() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', isLight ? '#f6f7fb' : '#7c5cff');
  },

  updateThemeIcon() {
    const btn = document.getElementById('ua-theme-btn');
    if (!btn) return;
    const icon = btn.querySelector('i');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    icon.className = isLight ? 'ti ti-moon' : 'ti ti-sun';
    btn.querySelector('.ua-tool-tip').textContent = isLight ? 'Karanlık tema' : 'Aydınlık tema';
  },

  changeFontScale(direction) {
    const scales = ['sm', 'md', 'lg', 'xl'];
    const current = document.body.getAttribute('data-font-scale') || 'md';
    let idx = scales.indexOf(current);
    if (direction === 'up' && idx < scales.length - 1) idx++;
    if (direction === 'down' && idx > 0) idx--;
    const next = scales[idx];
    document.body.setAttribute('data-font-scale', next);
    localStorage.setItem('ua_font_scale', next);
    this.updateFontIndicator();
  },

  updateFontIndicator() {
    const ind = document.getElementById('ua-font-indicator');
    if (!ind) return;
    const current = document.body.getAttribute('data-font-scale') || 'md';
    const map = { sm: 'A−', md: 'A', lg: 'A+', xl: 'A++' };
    ind.textContent = map[current];
  },

  /* ---------------- FLOATING TOOLBAR ---------------- */
  injectToolbar() {
    if (document.querySelector('.ua-toolbar')) return;

    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const fontMap = { sm: 'A−', md: 'A', lg: 'A+', xl: 'A++' };
    const currentFont = document.body.getAttribute('data-font-scale') || 'md';

    const toolbar = document.createElement('div');
    toolbar.className = 'ua-toolbar collapsed';
    toolbar.innerHTML = `
      <button class="ua-tool-btn" id="ua-font-up" type="button" aria-label="Yazıyı büyüt">
        <i class="ti ti-text-increase"></i>
        <span class="ua-tool-tip">Yazıyı büyüt</span>
      </button>
      <button class="ua-tool-btn" id="ua-font-down" type="button" aria-label="Yazıyı küçült">
        <i class="ti ti-text-decrease"></i>
        <span class="ua-tool-tip">Yazıyı küçült</span>
      </button>
      <button class="ua-tool-btn" id="ua-font-indicator-btn" type="button" aria-label="Yazı boyutu" style="font-weight: 700; font-size: 13px;">
        <span id="ua-font-indicator">${fontMap[currentFont]}</span>
        <span class="ua-tool-tip">Yazı boyutu</span>
      </button>
      <button class="ua-tool-btn" id="ua-theme-btn" type="button" aria-label="Tema değiştir">
        <i class="ti ti-${isLight ? 'moon' : 'sun'}"></i>
        <span class="ua-tool-tip">${isLight ? 'Karanlık tema' : 'Aydınlık tema'}</span>
      </button>
      <button class="ua-tool-btn ua-tool-main" id="ua-tool-main" type="button" aria-label="Araçlar">
        <i class="ti ti-settings"></i>
        <span class="ua-tool-tip">Araçlar</span>
      </button>
    `;
    document.body.appendChild(toolbar);

    // Olaylar
    document.getElementById('ua-tool-main').addEventListener('click', () => {
      toolbar.classList.toggle('collapsed');
    });
    document.getElementById('ua-theme-btn').addEventListener('click', () => this.toggleTheme());
    document.getElementById('ua-font-up').addEventListener('click', () => this.changeFontScale('up'));
    document.getElementById('ua-font-down').addEventListener('click', () => this.changeFontScale('down'));
    document.getElementById('ua-font-indicator-btn').addEventListener('click', () => {
      // Reset
      document.body.setAttribute('data-font-scale', 'md');
      localStorage.setItem('ua_font_scale', 'md');
      this.updateFontIndicator();
    });

    // Dışına tıklayınca kapan
    document.addEventListener('click', (e) => {
      if (!toolbar.contains(e.target) && !toolbar.classList.contains('collapsed')) {
        toolbar.classList.add('collapsed');
      }
    });
  },

  /* ---------------- SERVICE WORKER ---------------- */
  registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    // Sadece HTTPS veya localhost
    const protocol = window.location.protocol;
    if (protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') return;

    // Site root'unu pathname'den türet — sayfa pages/ altında olsa bile sw.js root'tadır
    const path = window.location.pathname;
    const inPagesDir = path.includes('/pages/');
    let basePath;
    if (inPagesDir) {
      basePath = path.substring(0, path.indexOf('/pages/') + 1);
    } else {
      // index.html veya root
      basePath = path.substring(0, path.lastIndexOf('/') + 1);
    }
    const swUrl = basePath + 'sw.js';

    window.addEventListener('load', () => {
      navigator.serviceWorker.register(swUrl, { scope: basePath }).catch(() => {
        // Sessizce başarısız — file://, CORS veya sunucu izin vermemiş olabilir
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
