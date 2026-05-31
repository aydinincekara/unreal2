// UnrealAkademi — Sertifika sayfası mantığı
// Progress'i okur, %100 ise form açar, PDF üretir.

const TOTAL_SECTIONS = 27;
const STORAGE_KEY = 'unrealakademi_progress';

function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    return [];
  }
}

function countCompleted() {
  const completed = getProgress();
  // Sadece s1..s27 say
  const valid = completed.filter(id => /^s([1-9]|1[0-9]|2[0-7])$/.test(id));
  return valid.length;
}

function formatDate(d) {
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran',
                  'Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function generateId(name) {
  // Basit ama deterministik bir ID üret (isim + tarih hash benzeri)
  const seed = (name || 'user') + '-' + new Date().toISOString().split('T')[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = ((h << 5) - h) + seed.charCodeAt(i);
    h = h & h;
  }
  const code = Math.abs(h).toString(36).toUpperCase().padStart(6, '0').slice(0, 6);
  return `UA-${new Date().getFullYear()}-${code}`;
}

function showStatus(done) {
  const status = document.getElementById('cert-status');
  const form = document.getElementById('cert-form');
  const preview = document.getElementById('cert-preview-wrap');

  if (done >= TOTAL_SECTIONS) {
    status.innerHTML = `
      <div class="cert-status-icon cert-status-ok"><i class="ti ti-circle-check"></i></div>
      <div class="cert-status-text">
        <strong>Tebrikler!</strong> 27/27 bölümü tamamladın. Sertifikanı üretmeye hazırsın.
      </div>
    `;
    status.classList.add('cert-status-success');
    form.hidden = false;
  } else {
    const remaining = TOTAL_SECTIONS - done;
    const percent = Math.round((done / TOTAL_SECTIONS) * 100);
    status.innerHTML = `
      <div class="cert-status-icon cert-status-pending"><i class="ti ti-progress"></i></div>
      <div class="cert-status-text">
        <strong>İlerlemen: ${done}/${TOTAL_SECTIONS} bölüm (%${percent})</strong>
        <p style="margin:6px 0 0;font-size:13px;color:var(--text-tertiary);">
          Sertifikan için ${remaining} bölüm daha tamamlamalısın. Her bölümün sonundaki
          "Bu Bölümü Tamamladım" butonuna basmayı unutma.
        </p>
        <div class="cert-status-bar" style="margin-top:12px;">
          <div class="cert-status-bar-fill" style="width:${percent}%"></div>
        </div>
      </div>
    `;
    status.classList.add('cert-status-pending');
    form.hidden = true;
    preview.hidden = true;
  }
}

function fillPreview(name, title) {
  const today = new Date();
  document.getElementById('cert-name-display').textContent = (name || '').trim() || '—';
  document.getElementById('cert-date-display').textContent = formatDate(today);
  document.getElementById('cert-id-display').textContent = generateId(name);

  // Title varsa name altına satır olarak yaz
  const nameEl = document.getElementById('cert-name-display');
  // Önce eski subtitle'ı temizle
  const oldSub = nameEl.parentNode.querySelector('.cert-name-title');
  if (oldSub) oldSub.remove();
  if (title && title.trim()) {
    const sub = document.createElement('div');
    sub.className = 'cert-name-title';
    sub.textContent = title.trim();
    nameEl.parentNode.insertBefore(sub, nameEl.nextSibling);
  }
}

async function generatePdf() {
  const preview = document.getElementById('cert-preview');
  const paper = preview.querySelector('.cert-paper');
  if (!paper || typeof html2canvas === 'undefined') {
    alert('PDF kütüphanesi yüklenemedi. Sayfayı yenile ve tekrar dene.');
    return;
  }

  try {
    const canvas = await html2canvas(paper, {
      scale: 2,
      backgroundColor: '#0a0a18',
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = pdf.internal.pageSize.getWidth();
    const h = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
    const name = document.getElementById('cert-name').value.trim().replace(/[^a-z0-9]/gi, '_') || 'sertifika';
    pdf.save(`UnrealAkademi_${name}.pdf`);
  } catch (e) {
    console.error(e);
    alert('PDF oluşturulurken hata oluştu. Yazdır seçeneğini deneyebilirsin.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const done = countCompleted();
  showStatus(done);

  const generate = document.getElementById('cert-generate');
  const nameInput = document.getElementById('cert-name');
  const titleInput = document.getElementById('cert-title');
  const previewWrap = document.getElementById('cert-preview-wrap');
  const download = document.getElementById('cert-download');
  const printBtn = document.getElementById('cert-print');
  const edit = document.getElementById('cert-edit');

  if (generate) {
    generate.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.focus();
        alert('Adını girmelisin.');
        return;
      }
      fillPreview(name, titleInput.value);
      previewWrap.hidden = false;
      previewWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if (download) {
    download.addEventListener('click', generatePdf);
  }

  if (printBtn) {
    printBtn.addEventListener('click', () => window.print());
  }

  if (edit) {
    edit.addEventListener('click', () => {
      previewWrap.hidden = true;
      nameInput.focus();
      nameInput.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
