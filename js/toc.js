// ═══════════════════════════════════════════════════════════
// toc.js — Bölüm içi içindekiler tablosu + Back to top
// ═══════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─── BACK TO TOP ─────────────────────────────────────────
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    function onScroll() {
      if (window.scrollY > 400) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── TOC OLUŞTURMA ───────────────────────────────────────
  // Sadece ders sayfalarında çalışır (topic-title varsa)
  const topics = document.querySelectorAll('.topic-header');
  if (topics.length < 2) return;

  // ID'leri otomatik üret
  topics.forEach((topic, i) => {
    const num = topic.querySelector('.topic-number');
    const titleEl = topic.querySelector('.topic-title');
    if (!num || !titleEl) return;
    const numText = num.textContent.trim().replace('.', '-');
    const id = 't-' + numText;
    topic.id = id;
  });

  // TOC widget oluştur
  const toc = document.createElement('aside');
  toc.className = 'toc-widget';
  toc.setAttribute('aria-label', 'İçindekiler');
  let html = '<div class="toc-widget-title"><i class="ti ti-list"></i> Bu sayfada</div><ul class="toc-widget-list">';
  topics.forEach(topic => {
    const num = topic.querySelector('.topic-number');
    const titleEl = topic.querySelector('.topic-title');
    if (!num || !titleEl) return;
    html += '<li><a href="#' + topic.id + '" data-target="' + topic.id + '">'
         + num.textContent.trim() + ' ' + titleEl.textContent.trim()
         + '</a></li>';
  });
  html += '</ul>';
  toc.innerHTML = html;
  document.body.appendChild(toc);

  // Aktif TOC öğesi takibi
  const tocLinks = toc.querySelectorAll('a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tocLinks.forEach(l => {
          l.classList.toggle('active', l.dataset.target === id);
        });
      }
    });
  }, { rootMargin: '-100px 0px -60% 0px' });

  topics.forEach(t => observer.observe(t));

  // Smooth scroll
  tocLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById(this.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', '#' + this.dataset.target);
      }
    });
  });
})();
