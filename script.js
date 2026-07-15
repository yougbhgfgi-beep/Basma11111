// === FIREBASE (dynamic import — won't kill the rest of the app if CDN fails) ===
let fbAvailable = false;
let fb = null;

(async function initFirebase() {
  try {
    const [{ initializeApp }, { getFirestore, collection, addDoc, getDocs, query, orderBy, limit }] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js")
    ]);

    const firebaseConfig = {
      apiKey: "AIzaSyD-iyTRgapV0BSPnq89n7Tp6e0VJDIaBgo",
      authDomain: "shrydj-1c7ce.firebaseapp.com",
      projectId: "shrydj-1c7ce",
      storageBucket: "shrydj-1c7ce.firebasestorage.app",
      messagingSenderId: "1069074155143",
      appId: "1:1069074155143:web:d5ca3cfee283326f1d1a22",
      measurementId: "G-H5R2NQ1ZKQ"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    fbAvailable = true;

    window.__fb = {
      async saveReviewFB(name, msg) {
        try {
          await addDoc(collection(db, "reviews"), { name, msg, date: Date.now() });
          return true;
        } catch (e) {
          console.warn("Firebase save failed:", e);
          return false;
        }
      },
      async loadReviewsFB() {
        try {
          const q = query(collection(db, "reviews"), orderBy("date", "desc"), limit(20));
          const snap = await getDocs(q);
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (e) {
          console.warn("Firebase load failed:", e);
          return null;
        }
      }
    };
    fb = window.__fb;
  } catch (e) {
    console.warn("Firebase not available (CDN may be down):", e);
  }
})();

// === REVIEWS ===
let adminMode = false;

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
  });
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

// === HEADER SCROLL EFFECT ===
const header = document.getElementById('header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  header.classList.toggle('scrolled', scrollY > 50);
  lastScroll = scrollY;
});

// === ACTIVE NAV LINK ===
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// === STATS COUNTER ===
function animateCounters() {
  const stats = document.querySelectorAll('.stat__num');
  stats.forEach(stat => {
    const target = parseFloat(stat.dataset.count);
    const duration = 2000;
    const startTime = performance.now();
    const isFloat = target % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      stat.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

// === LOAD GALLERIES ===
function createGalleryItem(url, alt, watermarkText) {
  const item = document.createElement('div');
  item.className = 'gallery__item';

  const img = document.createElement('img');
  img.src = url;
  img.alt = alt;
  img.loading = 'lazy';

  const stamp = document.createElement('div');
  stamp.className = 'gallery__watermark-stamp';
  stamp.textContent = 'بصمة ديزاين';

  const overlay = document.createElement('div');
  overlay.className = 'gallery__watermark';
  const span = document.createElement('span');
  span.textContent = watermarkText || '💜 بصمة ديزاين';
  overlay.appendChild(span);

  item.appendChild(img);
  item.appendChild(stamp);
  item.appendChild(overlay);

  item.addEventListener('click', (e) => {
    e.preventDefault();
    openLightbox(url, watermarkText);
  });

  img.onerror = () => { item.style.display = 'none'; };

  return item;
}

function loadGalleries() {
  const credImages = Array.from({ length: 11 }, (_, i) => `assets/cred_${i + 1}.jpeg`);
  const credGallery = document.getElementById('credibilityGallery');
  if (credGallery) {
    credImages.forEach(src => credGallery.appendChild(createGalleryItem(src, 'ثقة العملاء', '🤝 ثقة عملاء')));
  }

  const joyImages = Array.from({ length: 18 }, (_, i) => `assets/joy_${i + 1}.jpeg`);
  const joyGallery = document.getElementById('joyGallery');
  if (joyGallery) {
    joyImages.forEach(src => joyGallery.appendChild(createGalleryItem(src, 'فرحة العملاء', '😊 فرحة عملاء')));
  }

  const certImages = Array.from({ length: 2 }, (_, i) => `assets/cert_${i + 1}.jpeg`);
  const certGallery = document.getElementById('certificatesGallery');
  if (certGallery) {
    certImages.forEach(src => certGallery.appendChild(createGalleryItem(src, 'شهادة', '📜 شهادة')));
  }
}

// === SCROLL ANIMATION (Fade In) ===
function handleScrollAnimation() {
  const elements = document.querySelectorAll('.service-card, .portfolio__item, .campaign__banner, .tiktok-promo__inner, .contact__grid, .credibility__card, .review-card, .certificates__content');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-up', 'visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  elements.forEach(el => {
    el.classList.add('fade-up');
    observer.observe(el);
  });

  if (!window._countersTriggered) {
    const statsSection = document.querySelector('.hero__stats');
    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            window._countersTriggered = true;
            statsObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      statsObserver.observe(statsSection);
    }
  }
}

// === COUNTDOWN TIMER ===
function startCountdown() {
  const storageKey = 'basma_countdown_end';
  let endDate = localStorage.getItem(storageKey);

  if (endDate && new Date(parseInt(endDate)) > new Date()) {
    endDate = new Date(parseInt(endDate));
  } else {
    endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 0);
    localStorage.setItem(storageKey, endDate.getTime().toString());
  }

  function update() {
    const now = new Date();
    const diff = endDate - now;
    if (diff <= 0) return;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    const d = document.getElementById('days');
    const h = document.getElementById('hours');
    const m = document.getElementById('minutes');
    const s = document.getElementById('seconds');
    if (d) d.textContent = String(days).padStart(2, '0');
    if (h) h.textContent = String(hours).padStart(2, '0');
    if (m) m.textContent = String(minutes).padStart(2, '0');
    if (s) s.textContent = String(seconds).padStart(2, '0');
  }
  update();
  setInterval(update, 1000);
}

// === CONTACT FORM / REVIEWS ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const nameInput = document.getElementById('reviewerName');
  const msgInput = document.getElementById('reviewerMsg');

  const seedReviews = [
    { name: 'نورهان', msg: 'أجمل هدية حصلت عليها في حياتي، الموقع كان رهيب جداً ومفاجأة حبيبي كانت لا تُنسى', date: -3 },
    { name: 'أحمد', msg: 'شغل متقن جداً وتفاصيل دقيقة، توصيل في نفس اليوم. أنصح الكل يتعامل مع بصمة ديزاين', date: -2 },
    { name: 'يوسف', msg: 'صراحة ما توقعت النتيجة تكون كذا جميلة، موقع قصة حب خطف قلب حبيبتي. شكراً لكم', date: -1 }
  ];

  async function loadReviews() {
    const container = document.getElementById('reviewsDynamic');
    if (!container) return;

    let reviews = null;
    const currentFb = window.__fb;
    if (currentFb) reviews = await currentFb.loadReviewsFB();
    if (!reviews) {
      reviews = JSON.parse(localStorage.getItem('basma_reviews') || '[]');
    }

    if (!reviews.length) {
      reviews = seedReviews;
    }

    const hidden = JSON.parse(localStorage.getItem('basma_hidden') || '[]');
    const visible = reviews.filter(r => !hidden.includes(r.id || r.date?.toString()));

    const isAdmin = document.body.classList.contains('admin-mode');

    container.innerHTML = visible.map((r, i) => {
      const id = r.id || r.date?.toString() || i.toString();
      return `
      <div class="review-card review-card--user">
        ${isAdmin ? `<button class="review-del" data-id="${id}" data-msg="${escapeHTML(r.msg)}" data-name="${escapeHTML(r.name)}" title="حذف">✕</button>` : ''}
        <div class="review-card__stars">★★★★★</div>
        <p>"${escapeHTML(r.msg)}"</p>
        <span class="review-card__name">— ${escapeHTML(r.name)}</span>
      </div>
    `}).join('');

    // Delete handlers
    if (isAdmin) {
      container.querySelectorAll('.review-del').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          const hidden = JSON.parse(localStorage.getItem('basma_hidden') || '[]');
          hidden.push(id);
          localStorage.setItem('basma_hidden', JSON.stringify(hidden));
          btn.closest('.review-card').remove();
        });
      });
    }
  }

  // Blocked words
  const blockedWords = [
    'كس', 'كسم', 'شرموط', 'شرموطة', 'خول', 'خولة', 'قحبة', 'قحب',
    'منيوك', 'منيوكة', 'عرص', 'مخنث', 'لوطي', 'سحق', 'سحاق',
    'نيالك', 'نيها', 'متناك', 'أحا', 'احا', 'ايه', 'fuck', 'fuckyou',
    'bitch', 'whore', 'slut', 'cunt', 'dick', 'shit', 'asshole',
    'motherfucker', 'ابن', 'المتناكة', 'المنيوك', 'الشرموط',
    'العرص', 'الخول'
  ];

  function hasBlockedWords(text) {
    const t = text.replace(/\s/g, '').toLowerCase();
    return blockedWords.some(w => {
      const cleanW = w.replace(/\s/g, '').toLowerCase();
      return t.includes(cleanW) || text.toLowerCase().includes(w.toLowerCase());
    });
  }

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const msg = msgInput.value.trim();
    if (!name || !msg) return;

    if (hasBlockedWords(name) || hasBlockedWords(msg)) {
      const btn = contactForm.querySelector('button[type="submit"]');
      const orig = btn.textContent;
      btn.textContent = '⛔ ممنوع! لا للشتائم';
      btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
      }, 2000);
      return;
    }

    const currentFb = window.__fb;
    if (currentFb) {
      await currentFb.saveReviewFB(name, msg);
    } else {
      const saved = JSON.parse(localStorage.getItem('basma_reviews') || '[]');
      saved.unshift({ id: 'r_' + Date.now(), name, msg, date: Date.now() });
      localStorage.setItem('basma_reviews', JSON.stringify(saved.slice(0, 20)));
    }

    await loadReviews();
    contactForm.reset();

    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = '✅ تم الإرسال!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 2000);
  });

  loadReviews();

  // Secret admin: 8 clicks on logo
  let clickCount = 0;
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      clickCount++;
      e.preventDefault();
      if (clickCount >= 8) {
        clickCount = 0;
        adminMode = !adminMode;
        document.body.classList.toggle('admin-mode', adminMode);
        const msg = adminMode ? '🔐 وضع المشرف نشط — اضغط ✕ لحذف أي رأي' : '🔒 وضع المشرف معطل';
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#7c3aed;color:#fff;padding:12px 24px;border-radius:12px;z-index:9999;font-size:0.9rem;box-shadow:0 8px 32px rgba(0,0,0,0.5);transition:opacity 0.3s;';
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2500);
        if (adminMode) loadReviews();
      }
    });
  }
}

// === LIGHTBOX ===
let lightboxEl = null;
function openLightbox(imgUrl, watermarkText) {
  if (!lightboxEl) {
    lightboxEl = document.createElement('div');
    lightboxEl.id = 'lightbox';
    lightboxEl.innerHTML = `
      <div class="lightbox__overlay"></div>
      <div class="lightbox__content">
        <button class="lightbox__close">&times;</button>
        <div class="lightbox__image-wrap">
          <img class="lightbox__img" src="" alt="" />
          <div class="lightbox__watermark">${watermarkText || '💜 بصمة ديزاين'}</div>
          <div class="lightbox__stamp">بصمة ديزاين</div>
        </div>
      </div>`;
    document.body.appendChild(lightboxEl);
    lightboxEl.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);
    lightboxEl.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }
  lightboxEl.querySelector('.lightbox__img').src = imgUrl;
  lightboxEl.querySelector('.lightbox__watermark').textContent = watermarkText || '💜 بصمة ديزاين';
  lightboxEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (lightboxEl) {
    lightboxEl.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// === PARTICLES ===
function initParticles() {
  const container = document.getElementById('particlesContainer');
  if (!container) return;
  const icons = ['fa-heart', 'fa-star', 'fa-heart'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('i');
    p.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} particle`;
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDelay = Math.random() * 12 + 's';
    p.style.fontSize = (Math.random() * 1 + 0.6) + 'rem';
    p.style.animationDuration = (Math.random() * 6 + 8) + 's';
    container.appendChild(p);
  }
}

// === MUSIC PLAYER ===
let bgMusic = null;
let musicToggle = null;

function initMusic() {
  musicToggle = document.getElementById('musicToggle');
  if (!musicToggle) return;

  if (!window.__bgMusic) {
    window.__bgMusic = new Audio('/audio.mp3');
    window.__bgMusic.loop = true;
    window.__bgMusic.volume = 0.3;
  }
  bgMusic = window.__bgMusic;

  const savedTime = sessionStorage.getItem('bd_music_time');
  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

  const updateUI = () => {
    if (!bgMusic.paused) {
      musicToggle.classList.add('playing');
      musicToggle.innerHTML = '<i class="music-toggle__icon">⏸️</i>';
    } else {
      musicToggle.classList.remove('playing');
      musicToggle.innerHTML = '<i class="music-toggle__icon">🎵</i>';
    }
  };

  setInterval(() => {
    if (bgMusic && !bgMusic.paused) {
      sessionStorage.setItem('bd_music_time', bgMusic.currentTime);
    }
  }, 1000);

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        sessionStorage.setItem('bd_music_playing', 'true');
        updateUI();
      }).catch(() => {});
    } else {
      bgMusic.pause();
      sessionStorage.setItem('bd_music_playing', 'false');
      updateUI();
    }
  });
}

// === INTRO OVERLAY ===
// (handled by inline script in index.html to avoid Firebase dependency)

// === PAGE TRANSITION FOR EXTERNAL LINKS ===
function initPageTransitions() {
  const transition = document.getElementById('pageTransition');
  if (!transition) return;
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.includes('github.io')) {
        transition.classList.add('active');
        setTimeout(() => transition.classList.remove('active'), 500);
      }
    });
  });
}

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
  initParticles();
  initMusic();
  initPageTransitions();
  loadGalleries();
  startCountdown();
  handleScrollAnimation();

  setTimeout(() => {
    const overlay = document.getElementById('introOverlay');
    if (!overlay || overlay.classList.contains('hidden')) {
      const mt = document.getElementById('musicToggle');
      if (mt) mt.style.display = 'flex';
    }
  }, 500);

  const statsSection = document.querySelector('.hero__stats');
  if (statsSection && statsSection.getBoundingClientRect().top < window.innerHeight) {
    animateCounters();
    window._countersTriggered = true;
  }
});