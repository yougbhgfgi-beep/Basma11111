document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');

  if(menuToggle) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('show');
      // Change icon
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('show')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }

  // Set active link based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav ul li a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if(linkPath === currentPath) {
      link.classList.add('active');
    }
  });

  // Credibility Page: Hidden Sections Logic
  const galleryItems = document.querySelectorAll('.gallery-item[data-target]');
  const detailSections = document.querySelectorAll('.detail-section');
  const mainView = document.getElementById('main-view');
  const backBtns = document.querySelectorAll('.back-btn');

  if (galleryItems.length > 0 && mainView) {
    // Show detail section on gallery item click
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          mainView.style.display = 'none';
          targetSection.style.display = 'block';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // Hide detail section and show main view on back button click
    backBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        detailSections.forEach(section => {
          section.style.display = 'none';
        });
        mainView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Handle Demo Link music stop
    const demoLink = document.querySelector('.mockup-link');
    if (demoLink) {
      demoLink.addEventListener('click', () => {
        bgMusic.pause();
        // We keep 'music_playing' as true so it resumes when they come back
        sessionStorage.setItem('music_time', bgMusic.currentTime);
      });
    }
  }

  // Lightbox functionality for thumbnails
  const thumbnails = document.querySelectorAll('.thumbnail-img');
  
  if (thumbnails.length > 0) {
    // Create the lightbox container dynamically with a watermark overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
      <span class="lightbox-close">&times;</span>
      <div class="lightbox-img-container" style="position: relative; max-width: 90%; max-height: 90vh; display: flex; justify-content: center; align-items: center;">
        <img class="lightbox-content" src="" style="max-height: 90vh; max-width: 100%; border-radius: 12px; border: 2px solid var(--accent-gold); box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <div class="watermark-overlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 3.5rem; font-weight: bold; color: rgba(255,255,255,0.4); text-shadow: 2px 2px 5px rgba(0,0,0,0.8); pointer-events: none; user-select: none; white-space: nowrap;">بصمة ديزاين</div>
      </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    thumbnails.forEach(img => {
      // Wrap the image to safely apply CSS watermark
      const wrapper = document.createElement('div');
      wrapper.className = 'watermark-wrapper';
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);

      // Add click event to the wrapper instead of the image directly
      wrapper.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightbox.style.display = 'flex';
      });
    });

    // Close on X click
    closeBtn.addEventListener('click', () => {
      lightbox.style.display = 'none';
      lightboxImg.src = '';
    });

    // Close on clicking outside the image container
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
      }
    });
  }

  // --- UI EFFECTS: Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.7)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    
    const hoverables = document.querySelectorAll('a, button, .gallery-item, .btn');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.background = 'rgba(212, 175, 55, 0.2)';
        cursor.style.width = '40px';
        cursor.style.height = '40px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.background = 'transparent';
        cursor.style.width = '20px';
        cursor.style.height = '20px';
      });
    });
  }

  // --- UI EFFECTS: Floating Particles ---
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    const icons = ['fa-heart', 'fa-star', 'fa-sparkles', 'fa-leaf'];
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('i');
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      particle.className = `fas ${randomIcon} particle`;
      particle.style.left = Math.random() * 100 + 'vw';
      particle.style.animationDelay = Math.random() * 10 + 's';
      particle.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
      particlesContainer.appendChild(particle);
    }
  }

  // --- UI EFFECTS: Scroll Reveal ---
  const initReveal = () => {
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.1 });
      revealElements.forEach(el => observer.observe(el));
    }
  };
  initReveal();

  // --- FIREBASE: Comment System & CMS ---
  const reviewForm = document.getElementById('review-form');
  const commentsDisplay = document.getElementById('comments-display');

  // Profanity Filter
  const badWords = ['شتم1', 'شتم2', 'قبيح', 'كلمة_سيئة', 'badword1', 'badword2', 'idiot', 'stupid'];
  const filterText = (text) => {
    let filtered = text;
    badWords.forEach(word => {
      const reg = new RegExp(word, 'gi');
      filtered = filtered.replace(reg, '***');
    });
    return filtered;
  };

  // Music Player State — hidden, auto-play, loops
  let bgMusic = new Audio('bg-music.mp4');
  bgMusic.loop = true;
  bgMusic.volume = 0.3;

  // Sync music time across pages
  const savedTime = sessionStorage.getItem('music_time');
  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

  // Periodic save of music time
  setInterval(() => {
    if (!bgMusic.paused) {
      sessionStorage.setItem('music_time', bgMusic.currentTime);
    }
  }, 1000);

  // Resume music if it was playing before navigation
  const isMusicEnabled = sessionStorage.getItem('music_playing') === 'true';
  
  // Browsers require a user interaction on EVERY new page load to play audio.
  // We attach listeners to the whole document to catch the first interaction.
  const handleFirstInteraction = (e) => {
    // If it's the demo link, we handle that separately
    if (e.target.closest('.mockup-link')) return;
    
    bgMusic.play().then(() => {
      sessionStorage.setItem('music_playing', 'true');
    }).catch(() => {});
    
    // Remote listeners once played
    ['click', 'touchstart', 'scroll', 'keydown', 'mousemove', 'wheel', 'mousedown'].forEach(evt => {
      document.removeEventListener(evt, handleFirstInteraction);
    });
  };

  if (isMusicEnabled) {
    ['click', 'touchstart', 'scroll', 'keydown', 'mousemove', 'wheel', 'mousedown'].forEach(evt => {
      document.addEventListener(evt, handleFirstInteraction, { once: true });
    });
  } else {
    // If never started, wait for first click specifically
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
  }

  const checkFirebaseReady = setInterval(() => {
    if (window.fsUtils) {
      clearInterval(checkFirebaseReady);
      if (reviewForm && commentsDisplay) initComments();
      runAnalytics();
      checkAdminSession();
      initDynamicContent();
    }
  }, 500);

  function initDynamicContent() {
    const { doc, onSnapshot, collection } = window.fsUtils;
    const db = window.firebaseDB;

    // Dynamic Music from Admin (overrides local file)
    onSnapshot(doc(db, 'settings', 'music'), (snap) => {
      if (snap.exists() && snap.data().url) {
        const newUrl = snap.data().url;
        if (bgMusic.src !== newUrl && newUrl.startsWith('http')) {
          bgMusic.src = newUrl;
        }
      }
    });

    // 2. Load Section Data (About, Conclusion)
    const loadPageData = (section) => {
      onSnapshot(doc(db, 'sections', section), (snap) => {
        if (!snap.exists()) return;
        const data = snap.data();
        if (section === 'about') {
          // Update About features
          const phoneEl = document.querySelector('.phone-number');
          if (phoneEl && data.phone) phoneEl.innerText = data.phone;
          // Update hours/duration if IDs exist or via text search
          // (Assuming we might want to add IDs to these elements later)
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

    // 3. Load Section Images
    const loadSectionImages = (section, containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      onSnapshot(collection(db, `section_images_${section}`), (snap) => {
        container.innerHTML = '';
        snap.forEach(pDoc => {
          const data = pDoc.data();
          const item = document.createElement('div');
          item.className = 'gallery-item reveal active';
          item.innerHTML = `
            <img src="${data.url}" class="thumbnail-img" style="width:100%; height:100%; object-fit:cover;">
          `;
          container.appendChild(item);
        });
      });
    };

    loadSectionImages('credibility', 'credibility-grid');
    loadSectionImages('joy', 'joy-grid');
    loadSectionImages('certificates', 'certificates-grid');
  }

  function initComments() {
    const { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } = window.fsUtils;
    const db = window.firebaseDB;
    const commentsCol = collection(db, 'comments');

    const q = query(commentsCol, orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
      commentsDisplay.innerHTML = '';
      if (snapshot.empty) {
        commentsDisplay.innerHTML = '<div class="comment-card glass-panel" style="text-align:center; padding: 3rem;"><i class="fas fa-comment-dots" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 1rem; display: block;"></i>لا توجد تعليقات بعد.. كن أول من يترك بصمته هنا!</div>';
        return;
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('ar-EG') : 'الآن';
        const starCount = data.stars || 5;
        const starsHtml = '<span class="star-filled">★</span>'.repeat(starCount) + '<span class="star-empty">☆</span>'.repeat(5 - starCount);
        const card = document.createElement('div');
        card.className = 'comment-card glass-panel';
        
        let adminReplyHtml = '';
        if (data.admin_reply) {
          adminReplyHtml = `
            <div class="admin-reply-card">
              <span class="admin-tag">رد بصمة ديزاين</span>
              <p class="comment-text" style="font-size: 0.95rem;">${data.admin_reply}</p>
            </div>
          `;
        }

        card.innerHTML = `
          <div class="comment-header">
            <div class="comment-avatar"><i class="fas fa-user-circle"></i></div>
            <div class="comment-info">
              <span class="comment-author">${data.name}</span>
              <div class="comment-stars">${starsHtml}</div>
            </div>
            <span class="comment-date">${date}</span>
          </div>
          <p class="comment-text">${data.comment}</p>
          ${adminReplyHtml}
        `;
        commentsDisplay.appendChild(card);
      });
    });

    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('reviewer-name').value.trim();
      const commentRaw = document.getElementById('reviewer-comment').value.trim();
      if (!name) { alert('يرجى كتابة اسمك أولاً! ✍️'); return; }
      if (!commentRaw) { alert('اكتب لنا تعليقك! 💬'); return; }
      const stars = parseInt(document.querySelector('input[name="stars"]:checked')?.value || 5);
      const comment = filterText(commentRaw);
      try {
        await addDoc(commentsCol, { name: filterText(name), comment, stars, timestamp: serverTimestamp() });
        reviewForm.reset();
        alert('شكراً لك! تم إرسال تعليقك بنجاح ❤️');
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    });
  }

  function runAnalytics() {
    const { doc, getDoc, setDoc, updateDoc, increment } = window.fsUtils;
    const db = window.firebaseDB;
    const statsRef = doc(db, 'site_stats', 'total_visits');
    getDoc(statsRef).then(snap => {
      if (!snap.exists()) setDoc(statsRef, { count: 1 });
      else updateDoc(statsRef, { count: increment(1) });
    });
  }

  function checkAdminSession() {
    if (localStorage.getItem('admin_logged_in') === 'true') {
      const editBtn = document.createElement('div');
      editBtn.className = 'admin-gear';
      editBtn.style.bottom = '30px';
      editBtn.style.right = '30px';
      editBtn.style.zIndex = '9999';
      editBtn.innerHTML = '<i class="fas fa-edit"></i>';
      editBtn.title = "تفعيل وضع التعديل";
      document.body.appendChild(editBtn);

      editBtn.addEventListener('click', () => {
        const isActive = document.body.classList.toggle('admin-edit-mode');
        if (isActive) {
          enableLiveEditing();
          editBtn.style.color = 'var(--accent-gold)';
          alert("وضع التعديل مفعل: اضغط على أي نص لتعديله.");
        } else {
          location.reload(); // Hard reset to disable
        }
      });
    }
  }

  function enableLiveEditing() {
    const editableTags = ['p', 'h1', 'h2', 'span', 'li'];
    editableTags.forEach(tag => {
      document.querySelectorAll(tag).forEach((el, index) => {
        if (!el.classList.contains('no-edit')) {
          el.contentEditable = 'true';
          const uniqueId = el.id || `${tag}-${index}`;
          el.addEventListener('blur', () => {
            saveContent(uniqueId, el.innerText);
          });
        }
      });
    });
  }

  async function saveContent(key, value) {
    const { doc, setDoc } = window.fsUtils;
    const db = window.firebaseDB;
    await setDoc(doc(db, 'site_content', key), { content: value });
  }
});
