document.addEventListener('DOMContentLoaded', () => {
  /* ========================================
     0. Preloader & Page Transitions
  ======================================== */
  
  // Page transitions on internal link clicks
  const transition = document.getElementById('pageTransition');
  if (transition) {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('javascript') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
        link.addEventListener('click', e => {
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          transition.classList.add('active');
          setTimeout(() => { window.location.href = href; }, 400);
        });
      }
    });
  }

  /* ========================================
     1. Toast Notification System
  ======================================== */
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  window.showToast = (message, type = 'info', duration = 4000) => {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  /* ========================================
     2. Mobile Menu Toggle
  ======================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('show')) {
        icon.classList.replace('fa-bars', 'fa-times');
      } else {
        icon.classList.replace('fa-times', 'fa-bars');
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('header') && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
      }
    });
  }

  /* ========================================
     3. Active Nav Link
  ======================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul li a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  /* ========================================
     4. Admin Star Password Gate
  ======================================== */
  window.adminStarClick = () => {
    const pass = prompt('⭐ أدخل كلمة السر:');
    if (pass === '11543211') {
      window.location.href = 'admin.html';
    }
  };

  /* ========================================
     5. Language Translation
  ======================================== */
  window.translatePage = (lang) => {
    if (lang === 'ar') {
      const frame = document.querySelector('.goog-te-banner-frame');
      if (frame) frame.remove();
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      location.reload();
      return;
    }
    document.cookie = `googtrans=/ar/${lang}; path=/;`;
    document.cookie = `googtrans=/ar/${lang}; path=/; domain=${location.hostname};`;
    location.reload();
  };

  /* ========================================
     6. Credibility Page: Hidden Sections
  ======================================== */
  const mainView = document.getElementById('main-view');
  const detailSections = document.querySelectorAll('.detail-section');
  const backBtns = document.querySelectorAll('.back-btn');

  document.querySelectorAll('.gallery-item[data-target]').forEach(item => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.getAttribute('data-target'));
      if (target && mainView) {
        mainView.style.display = 'none';
        target.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      detailSections.forEach(s => s.style.display = 'none');
      if (mainView) mainView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* ========================================
     7. Lightbox
  ======================================== */
  const thumbnails = document.querySelectorAll('.thumbnail-img');
  if (thumbnails.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <div style="position:relative; max-width:90%; max-height:90vh; display:flex; justify-content:center; align-items:center;">
        <img class="lightbox-content" src="">
        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-30deg); font-size:3.5rem; font-weight:bold; color:rgba(255,255,255,0.4); text-shadow:2px 2px 5px rgba(0,0,0,0.8); pointer-events:none; user-select:none; white-space:nowrap;">بصمة ديزاين</div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    thumbnails.forEach(img => {
      const wrapper = document.createElement('div');
      wrapper.className = 'watermark-wrapper';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      wrapper.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    };
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ========================================
     8. Custom Cursor
  ======================================== */
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.5)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');

    document.querySelectorAll('a, button, .gallery-item, .btn, .mockup-frame').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.cssText += 'background:rgba(212,175,55,0.4); border:1px solid transparent; width:60px; height:60px; mix-blend-mode:screen; filter:blur(4px);';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = 'transparent';
        cursor.style.border = '2px solid var(--accent-gold)';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.mixBlendMode = 'difference';
        cursor.style.filter = 'none';
      });
    });
  }

  /* ========================================
     9. Floating Particles
  ======================================== */
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    const icons = ['fa-heart', 'fa-star', 'fa-sparkles', 'fa-leaf'];
    for (let i = 0; i < 15; i++) {
      const p = document.createElement('i');
      p.className = `fas ${icons[Math.floor(Math.random() * icons.length)]} particle`;
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDelay = Math.random() * 10 + 's';
      p.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
      particlesContainer.appendChild(p);
    }
  }

  /* ========================================
     10. Scroll Reveal
  ======================================== */
  const initReveal = () => {
    const elements = document.querySelectorAll('.reveal, .gallery-item, .feature-card, .demo-visual');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          entry.target.style.transform = 'translateY(0) scale(1)';
          entry.target.style.opacity = '1';
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px) scale(0.95)';
      el.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      observer.observe(el);
    });

    document.addEventListener('scroll', () => {
      const bubbles = document.querySelector('.bg-bubbles');
      if (bubbles) {
        bubbles.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    });
  };
  initReveal();

  /* ========================================
     11. Music Player
  ======================================== */
  let bgMusic = new Audio('bg-music.mp4');
  bgMusic.loop = true;
  bgMusic.volume = 0.3;

  const musicToggle = document.getElementById('musicToggle');
  if (musicToggle) musicToggle.style.display = 'flex';

  const savedTime = sessionStorage.getItem('music_time');
  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

  const updateMusicUI = () => {
    if (!musicToggle) return;
    if (!bgMusic.paused) {
      musicToggle.classList.add('playing');
      musicToggle.querySelector('i').className = 'fas fa-pause';
    } else {
      musicToggle.classList.remove('playing');
      musicToggle.querySelector('i').className = 'fas fa-music';
    }
  };

  // Periodic save & UI sync
  setInterval(() => {
    if (!bgMusic.paused) {
      sessionStorage.setItem('music_time', bgMusic.currentTime);
    }
    updateMusicUI();
  }, 1000);

  // Music toggle click handler
  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          sessionStorage.setItem('music_playing', 'true');
          updateMusicUI();
        }).catch(() => {});
      } else {
        bgMusic.pause();
        sessionStorage.setItem('music_playing', 'false');
        updateMusicUI();
      }
    });
  }

  // Intro Overlay & Music Logic
  const introOverlay = document.getElementById('intro-overlay');
  const enterBtn = document.getElementById('enter-btn');
  
  if (introOverlay && enterBtn) {
    document.body.style.overflow = 'hidden';

    enterBtn.addEventListener('click', () => {
      introOverlay.classList.add('hidden');
      document.body.style.overflow = '';
      
      bgMusic.play().then(() => {
        sessionStorage.setItem('music_playing', 'true');
        updateMusicUI();
      }).catch(() => {});
    });
  } else {
    const playMusic = () => {
      bgMusic.play().then(() => {
        sessionStorage.setItem('music_playing', 'true');
        updateMusicUI();
      }).catch(() => {});
      document.removeEventListener('click', playMusic);
    };
    document.addEventListener('click', playMusic, { once: true });
  }

  // Resume listener (reusable)
  const attachResumeListener = () => {
    const resume = () => {
      bgMusic.play().then(() => {
        sessionStorage.setItem('music_playing', 'true');
        updateMusicUI();
      }).catch(() => {});
      ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
        document.removeEventListener(evt, resume);
      });
    };
    ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
      document.addEventListener(evt, resume, { once: true });
    });
  };

  // Handle demo link music pause + re-attach resume
  document.querySelectorAll('.mockup-btn').forEach(link => {
    link.addEventListener('click', (e) => {
      bgMusic.pause();
      sessionStorage.setItem('music_time', bgMusic.currentTime);
      sessionStorage.setItem('music_playing', 'true');
      updateMusicUI();
      // Delay to avoid the same click re-triggering play
      setTimeout(attachResumeListener, 100);
    });
  });

  /* ========================================
     12. Firebase Integration
  ======================================== */
  const checkFirebase = setInterval(() => {
    if (window.fsUtils) {
      clearInterval(checkFirebase);
      if (document.getElementById('review-form') && document.getElementById('comments-display')) {
        initComments();
      }
      runAnalytics();
      checkAdminSession();
      initDynamicContent();
    }
  }, 500);

  function initDynamicContent() {
    const { doc, onSnapshot, collection } = window.fsUtils;
    const db = window.firebaseDB;

    onSnapshot(doc(db, 'settings', 'music'), snap => {
      if (snap.exists() && snap.data().url) {
        const url = snap.data().url;
        if (bgMusic.src !== url && url.startsWith('http')) {
          bgMusic.src = url;
        }
      }
    });

    const loadPageData = (section) => {
      onSnapshot(doc(db, 'sections', section), snap => {
        if (!snap.exists()) return;
        const data = snap.data();
        if (section === 'about') {
          const phoneEl = document.querySelector('.phone-number');
          if (phoneEl && data.phone) phoneEl.innerText = data.phone;
        } else if (section === 'conclusion') {
          const mainEl = document.querySelector('.conclusion-text');
          if (mainEl && data.main) mainEl.innerText = data.main;
          const finalEl = document.querySelector('.final-text');
          if (finalEl && data.final) finalEl.innerText = data.final;
        }
      });
    };

    loadPageData('about');
    loadPageData('conclusion');

    const sectionMap = [
      { section: 'credibility', containerId: 'credibility-grid' },
      { section: 'joy', containerId: 'joy-grid' },
      { section: 'certificates', containerId: 'certificates-grid' }
    ];

    sectionMap.forEach(({ section, containerId }) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      const fallbackId = containerId.replace('-grid', '-fallback');
      const fallback = document.getElementById(fallbackId);
      onSnapshot(collection(db, `section_images_${section}`), snap => {
        container.innerHTML = '';
        if (snap.size > 0) {
          if (fallback) fallback.style.display = 'none';
          snap.forEach(pDoc => {
            const data = pDoc.data();
            const item = document.createElement('div');
            item.className = 'gallery-item reveal active';
            item.style.cursor = 'default';
            item.innerHTML = `<img src="${data.url}" class="thumbnail-img" style="width:100%;height:100%;object-fit:cover;">`;
            container.appendChild(item);
          });
        } else {
          if (fallback) fallback.style.display = 'grid';
        }
      });
    });
  }

  /* ========================================
     13. Comments System
  ======================================== */
  function initComments() {
    const { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } = window.fsUtils;
    const db = window.firebaseDB;
    const commentsCol = collection(db, 'comments');
    const q = query(commentsCol, orderBy('timestamp', 'asc'));
    const commentsDisplay = document.getElementById('comments-display');

    onSnapshot(q, snapshot => {
      commentsDisplay.innerHTML = '';
      if (snapshot.empty) {
        commentsDisplay.innerHTML = '<div class="comment-card glass-panel" style="text-align:center;padding:3rem;"><i class="fas fa-comment-dots" style="font-size:2rem;color:var(--accent-gold);margin-bottom:1rem;display:block;"></i>لا توجد تعليقات بعد.. كن أول من يترك بصمته هنا!</div>';
        return;
      }
      const badWords = ['كس', 'كسم', 'شرموط', 'خول', 'قحبة', 'عاهرة', 'منيوك', 'نييك', 'زب', 'طيز', 'متناك', 'ابن_كلب', 'ابن_وسخة', 'احا', 'احيه'];
      const filterText = t => { badWords.forEach(w => { t = t.replace(new RegExp(w.replace(/_/g, '\\s*'), 'gi'), '***'); }); return t; };

      snapshot.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('ar-EG') : 'الآن';
        const stars = data.stars || 5;
        const starsHtml = '<span class="star-filled">★</span>'.repeat(stars) + '<span class="star-empty">☆</span>'.repeat(5 - stars);
        const replyHtml = data.admin_reply ? `
          <div class="admin-reply-card">
            <span class="admin-tag">رد بصمة ديزاين</span>
            <p class="comment-text">${filterText(data.admin_reply)}</p>
          </div>
        ` : '';

        const card = document.createElement('div');
        card.className = 'comment-card glass-panel';
        card.innerHTML = `
          <div class="comment-header">
            <div class="comment-avatar"><i class="fas fa-user-circle"></i></div>
            <div class="comment-info">
              <span class="comment-author">${filterText(data.name)}</span>
              <div class="comment-stars">${starsHtml}</div>
            </div>
            <span class="comment-date">${date}</span>
          </div>
          <p class="comment-text">${filterText(data.comment)}</p>
          ${replyHtml}
        `;
        commentsDisplay.appendChild(card);
      });
    });

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reviewer-name').value.trim();
        const commentRaw = document.getElementById('reviewer-comment').value.trim();
        if (!name) { showToast('يرجى كتابة اسمك أولاً! ✍️', 'error'); return; }
        if (!commentRaw) { showToast('اكتب لنا تعليقك! 💬', 'error'); return; }
        const stars = parseInt(document.querySelector('input[name="stars"]:checked')?.value || 5);
        const filtered = text => {
          const badWords = ['كس', 'كسم', 'شرموط', 'خول', 'قحبة', 'عاهرة', 'منيوك', 'نييك', 'زب', 'طيز', 'متناك', 'ابن_كلب', 'ابن_وسخة', 'احا', 'احيه'];
          let t = text;
          badWords.forEach(w => { t = t.replace(new RegExp(w.replace(/_/g, '\\s*'), 'gi'), '***'); });
          return t;
        };
        try {
          await addDoc(commentsCol, { name: filtered(name), comment: filtered(commentRaw), stars, timestamp: serverTimestamp() });
          reviewForm.reset();
          showToast('شكراً لك! تم إرسال تعليقك بنجاح ❤️', 'success');
          setTimeout(() => {
            commentsDisplay.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        } catch (error) {
          showToast('حدث خطأ في الإرسال، حاول مرة أخرى', 'error');
        }
      });
    }
  }

  /* ========================================
     14. Analytics
  ======================================== */
  function runAnalytics() {
    const { doc, getDoc, setDoc, updateDoc, increment } = window.fsUtils;
    const db = window.firebaseDB;
    const statsRef = doc(db, 'site_stats', 'total_visits');
    getDoc(statsRef).then(snap => {
      if (!snap.exists()) setDoc(statsRef, { count: 1 });
      else updateDoc(statsRef, { count: increment(1) });
    }).catch(() => {});
  }

  /* ========================================
     15. Admin Session / Live Edit
  ======================================== */
  function checkAdminSession() {
    // Admin live-edit feature disabled to prevent showing the gear button
    return;
  }

  function enableLiveEditing() {
    const tags = ['p', 'h1', 'h2', 'span', 'li'];
    tags.forEach(tag => {
      document.querySelectorAll(tag).forEach((el, i) => {
        if (el.classList.contains('no-edit')) return;
        el.contentEditable = 'true';
        const id = el.id || `${tag}-${i}`;
        el.addEventListener('blur', () => saveContent(id, el.innerText));
      });
    });
  }

  async function saveContent(key, value) {
    const { doc, setDoc } = window.fsUtils;
    const db = window.firebaseDB;
    try {
      await setDoc(doc(db, 'site_content', key), { content: value });
      showToast('تم الحفظ! ✅', 'success');
    } catch {
      showToast('خطأ في الحفظ', 'error');
    }
  }
});
