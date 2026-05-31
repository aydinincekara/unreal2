// UnrealAkademi — Site içi arama motoru
// Basit ama hızlı: tüm sayfaların başlık + özetlerini in-memory tutar, AND eşleşmesi yapar.

const SEARCH_INDEX = [
  // BAŞLANGIÇ
  { id:'s1', num:'01', cat:'Başlangıç', title:'Kurulum', href:'01-kurulum.html', icon:'ti-download',
    keywords:'kurulum install epic games launcher indirme yükleme proje açma başlangıç ilk adım' },
  { id:'s2', num:'02', cat:'Başlangıç', title:'Arayüz', href:'02-arayuz.html', icon:'ti-layout-dashboard',
    keywords:'arayüz editor viewport content browser details outliner panel anatomi interface ui' },
  { id:'s3', num:'03', cat:'Başlangıç', title:'GameMode', href:'03-gamemode.html', icon:'ti-device-gamepad-2',
    keywords:'gamemode game mode player controller pawn character oyun modu temel sınıflar' },

  // BLUEPRINT
  { id:'s4', num:'04', cat:'Blueprint', title:'Blueprint Sistemi', href:'04-blueprint-temelleri.html', icon:'ti-circuit-changeover',
    keywords:'blueprint bp node pin event function graph görsel programlama visual scripting temel' },
  { id:'s5', num:'05', cat:'Blueprint', title:'Actor & Event', href:'05-actor-event-function.html', icon:'ti-circle-plus',
    keywords:'actor aktör event function fonksiyon beginplay tick olay tetikleyici' },
  { id:'s6', num:'06', cat:'Blueprint', title:'Variable Türleri', href:'06-variable-turleri.html', icon:'ti-variable',
    keywords:'variable değişken int float bool string vector struct array map dizi enum tür' },

  // OYUN MEKANİĞİ
  { id:'s7', num:'07', cat:'Oyun Mekaniği', title:'Input & Hareket', href:'07-input-hareket.html', icon:'ti-keyboard',
    keywords:'input enhanced input mapping context action giriş hareket movement wasd hız fare klavye' },
  { id:'s8', num:'08', cat:'Oyun Mekaniği', title:'Ses & VFX', href:'08-ses-vfx.html', icon:'ti-volume',
    keywords:'ses sound cue niagara vfx visual effects partikül efekt müzik audio ambient' },
  { id:'s9', num:'09', cat:'Oyun Mekaniği', title:'HUD & Arayüz', href:'09-hud-arayuz.html', icon:'ti-window',
    keywords:'hud umg widget blueprint arayüz ui menu buton text bind sağlık can' },

  // İÇERİK
  { id:'s10', num:'10', cat:'İçerik & Görsel', title:'Materyal', href:'10-materyal.html', icon:'ti-palette',
    keywords:'materyal material pbr base color roughness metallic normal map emissive texture sample instance shader' },
  { id:'s11', num:'11', cat:'İçerik & Görsel', title:'İçerik Yükleme', href:'11-icerik-yukleme.html', icon:'ti-upload',
    keywords:'asset import yükleme fbx obj png quixel bridge marketplace megascans klasör düzen prefix' },
  { id:'s12', num:'12', cat:'İçerik & Görsel', title:'Animasyon', href:'12-animasyon.html', icon:'ti-walk',
    keywords:'animasyon animation skeleton skeletal mesh blueprint abp state machine blend space montage root motion' },

  // UE5 MODLARI
  { id:'s13', num:'13', cat:'UE5 Modları', title:'Modeling Mode', href:'13-modeling-mode.html', icon:'ti-3d-cube-sphere',
    keywords:'modeling mod 3d modelleme primitive polymodel boolean vertex edge face extrude bevel' },
  { id:'s14', num:'14', cat:'UE5 Modları', title:'Animation Mode', href:'14-animation-mode.html', icon:'ti-clapperboard-play',
    keywords:'animation mode sequencer control rig keyframe cine camera bake sinematik cinematic' },
  { id:'s15', num:'15', cat:'UE5 Modları', title:'Brush Mode', href:'15-brush-mode.html', icon:'ti-brush',
    keywords:'brush bsp additive subtractive prototip mimari hızlı tasarım blockout' },
  { id:'s16', num:'16', cat:'UE5 Modları', title:'Fracture Mode', href:'16-fracture-mode.html', icon:'ti-shatter',
    keywords:'fracture chaos destruction voronoi kırma parça parçalama yıkım kırılma' },
  { id:'s17', num:'17', cat:'UE5 Modları', title:'Mesh Paint Mode', href:'17-mesh-paint-mode.html', icon:'ti-paint',
    keywords:'mesh paint vertex color texture paint rgba katman layer boyama' },
  { id:'s18', num:'18', cat:'UE5 Modları', title:'Landscape Mode', href:'18-landscape-mode.html', icon:'ti-mountain',
    keywords:'landscape arazi sculpt smooth erosion layer blend heightmap manzara terrain' },
  { id:'s19', num:'19', cat:'UE5 Modları', title:'Foliage Mode', href:'19-foliage-mode.html', icon:'ti-plant-2',
    keywords:'foliage bitki ağaç çim instanced static mesh ism density scale grass system' },
  { id:'s20', num:'20', cat:'UE5 Modları', title:'Selection Mode', href:'20-selection-mode.html', icon:'ti-pointer',
    keywords:'selection seçim outliner folder klasör select matching layer toplu batch' },

  // UE5 İLERİ
  { id:'s21', num:'21', cat:'UE5 İleri', title:'Lumen & Nanite', href:'21-lumen-nanite.html', icon:'ti-bolt',
    keywords:'lumen nanite global illumination gi reflection yansıma virtualized geometry ray tracing render aydınlatma' },
  { id:'s22', num:'22', cat:'UE5 İleri', title:'Enhanced Input', href:'22-enhanced-input.html', icon:'ti-keyboard',
    keywords:'enhanced input modifier trigger mapping context priority chord hold tap negate swizzle player mappable' },
  { id:'s23', num:'23', cat:'UE5 İleri', title:'Save & Menü', href:'23-save-menu.html', icon:'ti-device-floppy',
    keywords:'save game asset kayıt yükleme menü pause main menu level loading open level game instance' },
  { id:'s24', num:'24', cat:'UE5 İleri', title:'Yayınlama', href:'24-yayinlama.html', icon:'ti-package-export',
    keywords:'package yayınlama build configuration shipping exe ikon splash itch.io steam dağıtım' },

  // İLERİ PROGRAMLAMA
  { id:'s25', num:'25', cat:'İleri Programlama', title:'Blueprint İleri', href:'25-blueprint-ileri.html', icon:'ti-circuit-changeover',
    keywords:'blueprint ileri interface event dispatcher inheritance soft reference behavior tree component pattern mimari' },
  { id:'s26', num:'26', cat:'İleri Programlama', title:'C++ Giriş', href:'26-cpp-giris.html', icon:'ti-code',
    keywords:'c++ cpp visual studio uclass ufunction uproperty makro algoritma syntax kod programlama header implementation' },
  { id:'s27', num:'27', cat:'İleri Programlama', title:'Yol Haritası', href:'27-yol-haritasi.html', icon:'ti-map-2',
    keywords:'yol haritası roadmap kariyer portfolyo game jam itch steam kaynaklar topluluk öğrenme rota' },

  // EK SAYFALAR
  { id:'x-sozluk', cat:'Ek Kaynak', title:'Sözlük', href:'sozluk.html', icon:'ti-book-2',
    keywords:'sözlük glossary terim türkçe ingilizce karşılık tanım kavram açıklama' },
  { id:'x-cheatsheet', cat:'Ek Kaynak', title:'Cheat Sheet', href:'cheatsheet.html', icon:'ti-list-details',
    keywords:'cheat sheet hızlı başvuru kısayol shortcut prefix pbr değerler node makro konsol komut' },
  { id:'x-sss', cat:'Ek Kaynak', title:'SSS', href:'sss.html', icon:'ti-help-circle',
    keywords:'sss faq sık sorulan sorular yardım destek başlangıç pc kariyer' },
  { id:'x-sertifika', cat:'Ek Kaynak', title:'Sertifika', href:'sertifika.html', icon:'ti-certificate',
    keywords:'sertifika certificate pdf tamamlama başarı diploma' },
  { id:'kaynaklar', cat:'Ek Kaynak', title:'Kaynaklar', href:'kaynaklar.html', icon:'ti-books',
    keywords:'kaynaklar resources link youtube discord topluluk tutorial' },
  { id:'iletisim', cat:'Ek Kaynak', title:'İletişim', href:'iletisim.html', icon:'ti-mail',
    keywords:'iletişim contact mail sosyal medya geri bildirim' },
  { id:'hakkinda', cat:'Ek Kaynak', title:'Hakkında', href:'hakkinda.html', icon:'ti-info-circle',
    keywords:'hakkında about misyon vizyon lisans ekip proje' },
];

// Türkçe karakter normalize
function normalize(s) {
  return (s||'').toString().toLowerCase()
    .replace(/ı/g,'i').replace(/İ/g,'i')
    .replace(/ö/g,'o').replace(/ü/g,'u')
    .replace(/ş/g,'s').replace(/ç/g,'c').replace(/ğ/g,'g');
}

function search(query) {
  const q = normalize(query).trim();
  if (q.length < 2) return [];

  // Boşlukla ayır, her parça eşleşmeli (AND)
  const terms = q.split(/\s+/).filter(t => t.length > 0);

  const results = [];
  for (const item of SEARCH_INDEX) {
    const haystack = normalize(
      `${item.title} ${item.num||''} ${item.cat} ${item.keywords}`
    );

    let score = 0;
    let allMatch = true;

    for (const term of terms) {
      if (!haystack.includes(term)) {
        allMatch = false;
        break;
      }
      // Başlıkta eşleşme daha değerli
      const titleHit = normalize(item.title).includes(term);
      const catHit = normalize(item.cat).includes(term);
      score += titleHit ? 10 : (catHit ? 5 : 1);
    }

    if (allMatch) {
      results.push({ ...item, score });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

function highlight(text, terms) {
  if (!text) return '';
  let html = text;
  for (const t of terms) {
    if (t.length < 2) continue;
    const safe = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    html = html.replace(new RegExp(`(${safe})`, 'gi'), '<mark>$1</mark>');
  }
  return html;
}

function renderResults(results, query) {
  const container = document.getElementById('search-results');
  if (!container) return;

  if (!query || query.length < 2) {
    container.innerHTML = `
      <div class="search-empty">
        <i class="ti ti-search-off"></i>
        <p>Yukarıdaki kutuya bir kelime yazarak arama yap.</p>
      </div>`;
    return;
  }

  if (results.length === 0) {
    container.innerHTML = `
      <div class="search-empty">
        <i class="ti ti-mood-empty"></i>
        <p>"<strong>${query}</strong>" için sonuç bulunamadı.</p>
        <p class="search-empty-tip">Farklı bir kelime dene, veya bölüm numarası yaz (örn. "12").</p>
      </div>`;
    return;
  }

  const terms = normalize(query).split(/\s+/);
  const html = results.map(r => {
    const titleH = highlight(r.title, terms);
    const numBadge = r.num ? `<span class="search-result-num">${r.num}</span>` : '';
    return `
      <a href="${r.href}" class="search-result">
        <div class="search-result-icon"><i class="ti ${r.icon}"></i></div>
        <div class="search-result-body">
          <div class="search-result-meta">
            ${numBadge}
            <span class="search-result-cat">${r.cat}</span>
          </div>
          <div class="search-result-title">${titleH}</div>
        </div>
        <div class="search-result-arrow"><i class="ti ti-arrow-right"></i></div>
      </a>
    `;
  }).join('');

  container.innerHTML = `
    <div class="search-results-count">${results.length} sonuç bulundu</div>
    ${html}
  `;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('site-search-input');
  const clear = document.getElementById('search-box-clear');
  if (!input) return;

  let timer = null;
  const onChange = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      const q = input.value;
      clear.hidden = !q;
      const r = search(q);
      renderResults(r, q);
    }, 80);
  };

  input.addEventListener('input', onChange);
  if (clear) {
    clear.addEventListener('click', () => {
      input.value = '';
      clear.hidden = true;
      renderResults([], '');
      input.focus();
    });
  }

  // URL'de ?q=... varsa otomatik ara
  const params = new URLSearchParams(window.location.search);
  const q0 = params.get('q');
  if (q0) {
    input.value = q0;
    onChange();
  }
});
