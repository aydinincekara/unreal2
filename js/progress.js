/* ========================================================
   UnrealAkademi — Progress Tracking
   localStorage ile bölüm tamamlama takibi
   ======================================================== */

const PROGRESS_KEY = 'unrealakademi_progress';
const TOTAL_SECTIONS = 28; // s0 → s27

const Progress = {
  /**
   * Tamamlanan bölümlerin ID listesini döner
   * @returns {string[]} ['s0', 's1', ...]
   */
  getCompleted() {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Bir bölüm tamamlandı mı?
   */
  isCompleted(sectionId) {
    return this.getCompleted().includes(sectionId);
  },

  /**
   * Bir bölümü tamamlandı olarak işaretle
   */
  markCompleted(sectionId) {
    const list = this.getCompleted();
    if (!list.includes(sectionId)) {
      list.push(sectionId);
      this._save(list);
    }
    this.updateUI();
  },

  /**
   * Tamamlanma işaretini kaldır
   */
  unmarkCompleted(sectionId) {
    const list = this.getCompleted().filter(id => id !== sectionId);
    this._save(list);
    this.updateUI();
  },

  /**
   * Toggle: tamamlandıysa kaldır, kaldırılmışsa işaretle
   */
  toggle(sectionId) {
    if (this.isCompleted(sectionId)) {
      this.unmarkCompleted(sectionId);
      return false;
    } else {
      this.markCompleted(sectionId);
      return true;
    }
  },

  /**
   * Tüm ilerlemeyi sıfırla
   */
  reset() {
    if (confirm('Tüm ilerlemen silinecek. Emin misin?')) {
      localStorage.removeItem(PROGRESS_KEY);
      this.updateUI();
    }
  },

  /**
   * İç: kaydet
   */
  _save(list) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('localStorage kayıt başarısız:', e);
    }
  },

  /**
   * Yüzde hesapla
   */
  getPercent() {
    return Math.round((this.getCompleted().length / TOTAL_SECTIONS) * 100);
  },

  /**
   * UI'yı güncelle (progress bar, nav işaretleri, buton durumu)
   */
  updateUI() {
    const completed = this.getCompleted();
    const percent = this.getPercent();

    // Progress bar
    const fill = document.getElementById('progress-fill');
    const value = document.getElementById('progress-value');
    if (fill) fill.style.width = percent + '%';
    if (value) value.textContent = `${completed.length}/${TOTAL_SECTIONS}`;

    // Nav işaretleri
    document.querySelectorAll('.nav-link').forEach(link => {
      const id = link.dataset.section;
      if (id && completed.includes(id)) {
        link.classList.add('completed');
      } else {
        link.classList.remove('completed');
      }
    });

    // Complete butonu (bulunduğun sayfada)
    const btn = document.querySelector('.btn-complete');
    if (btn) {
      const id = btn.dataset.section;
      if (id && completed.includes(id)) {
        btn.classList.add('done');
        btn.innerHTML = '<i class="ti ti-check"></i> Bu Bölümü Tamamladın';
      } else {
        btn.classList.remove('done');
        btn.innerHTML = '<i class="ti ti-flag-check"></i> Bu Bölümü Tamamladım';
      }
    }
  }
};

// Global erişim için
window.Progress = Progress;

// Sayfa yüklendiğinde UI'yı güncelle
document.addEventListener('DOMContentLoaded', () => {
  Progress.updateUI();
});
