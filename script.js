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
  const containsBadWords = (text) => {
    if (!text) return false;
    const lowerText = String(text).toLowerCase();
    return badWords.some(word => lowerText.includes(word.toLowerCase()));
  };

  // Music Player State — hidden, auto-play, loops
  let bgMusic = new Audio('bg-music.mp4');
  bgMusic.loop = true;
  bgMusic.volume = 0.4;
  bgMusic.preload = 'auto';

  // Sync music time across pages
  const savedTime = sessionStorage.getItem('music_time');
  if (savedTime) bgMusic.currentTime = parseFloat(savedTime);

  // Periodic save of music time and state
  setInterval(() => {
    if (!bgMusic.paused) {
      sessionStorage.setItem('music_time', bgMusic.currentTime);
      sessionStorage.setItem('music_playing', 'true');
    } else {
      sessionStorage.setItem('music_playing', 'false');
    }
    updateMusicToggleIcon();
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
      updateMusicToggleIcon();
    }).catch(() => {});
    
    // Remote listeners once played
    ['click', 'touchstart', 'scroll', 'keydown', 'mousemove', 'wheel', 'mousedown'].forEach(evt => {
      document.removeEventListener(evt, handleFirstInteraction);
    });
  };

  // Always listen for the first interaction to bridge the browser's autoplay block
  ['click', 'touchstart', 'scroll', 'keydown', 'mousemove', 'wheel', 'mousedown'].forEach(evt => {
    document.addEventListener(evt, handleFirstInteraction, { once: true });
  });

  // Create Global Music Toggle
  const musicToggle = document.createElement('div');
  musicToggle.className = 'music-toggle';
  musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
  musicToggle.title = "تشغيل/إيقاف الموسيقى";
  document.body.appendChild(musicToggle);

  musicToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play();
      sessionStorage.setItem('music_playing', 'true');
    } else {
      bgMusic.pause();
      sessionStorage.setItem('music_playing', 'false');
    }
    updateMusicToggleIcon();
  });

  function updateMusicToggleIcon() {
    const icon = musicToggle.querySelector('i');
    if (!icon) return;
    if (bgMusic.paused) {
      icon.className = 'fas fa-volume-mute';
      musicToggle.style.opacity = '0.5';
    } else {
      icon.className = 'fas fa-volume-up';
      musicToggle.style.opacity = '1';
    }
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

    // 3. Load Section Images with Local Fallback
    const loadSectionImages = (section, containerId) => {
      const container = document.getElementById(containerId);
      if (!container) return;
      const isAdmin = localStorage.getItem('adminAuth') === '11543211';

      const renderImages = (images) => {
        container.innerHTML = '';
        images.forEach(data => {
          const item = document.createElement('div');
          
          if (section === 'certificates') {
            item.className = 'cert-img-full reveal active';
            item.innerHTML = `
              <img src="${data.url}" class="thumbnail-img" style="width:100%; height:auto; object-fit:contain; border-radius:12px; margin-bottom:1.5rem;">
              <div class="thumbnail-watermark">بصمة</div>
              ${isAdmin ? `<button class="admin-inline-delete" data-id="${data.id}" title="حذف هذه الشهادة"><i class="fas fa-trash-alt"></i></button>` : ''}
            `;
          } else {
            item.className = 'gallery-item reveal active';
            item.innerHTML = `
              <img src="${data.url}" class="thumbnail-img" style="width:100%; height:100%; object-fit:cover;">
              <div class="thumbnail-watermark">بصمة</div>
              <div class="gallery-caption">${data.caption || 'بصمة ديزاين'}</div>
              ${isAdmin ? `<button class="admin-inline-delete" data-id="${data.id}" title="حذف هذه الصورة"><i class="fas fa-trash-alt"></i></button>` : ''}
            `;
            
            item.addEventListener('click', (e) => {
               if (e.target.closest('.admin-inline-delete')) return;
               const lightbox = document.querySelector('.lightbox-modal');
               if (lightbox) {
                 const lightboxImg = lightbox.querySelector('.lightbox-content');
                 if (lightboxImg) {
                   lightboxImg.src = data.url;
                   lightbox.style.display = 'flex';
                 }
               }
            });
          }
          container.appendChild(item);
        });

        if (isAdmin) {
          container.querySelectorAll('.admin-inline-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
              e.stopPropagation();
              if (confirm('هل أنت متأكد من حذف هذه الصورة؟ 🗑️')) {
                try {
                  const { doc, deleteDoc } = window.fsUtils;
                  await deleteDoc(doc(window.firebaseDB, `section_images_${section}`, btn.dataset.id));
                } catch (err) { console.error(err); }
              }
            });
          });
        }
      };

      onSnapshot(collection(window.firebaseDB, `section_images_${section}`), (snap) => {
        if (!snap.empty) {
          const fbImages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          renderImages(fbImages);
        } else {
          const localImgs = document.querySelectorAll('.gallery-thumbnails img');
          if (localImgs.length === 0) {
            container.innerHTML = `<p style="text-align:center; padding: 2rem; color: var(--text-secondary); width: 100%;">لم يتم رفع صور في هذا القسم بعد.</p>`;
          }
        }
      });
    };

    loadSectionImages('credibility', 'credibility-grid');
    loadSectionImages('joy', 'joy-grid');
    loadSectionImages('certificates', 'certificates-grid');
  }

  // --- IMMEDIATE OFFLINE FALLBACK LOGIC ---
  // Run this entirely outside of Firebase initialization.
  // It guarantees that if Firebase fails to load, the images still appear instantly.
  const executeLocalFallbacks = () => {
    ['credibility', 'joy', 'certificates'].forEach(section => {
      const container = document.getElementById(`${section}-grid`);
      if (container) {
        const localImgs = document.querySelectorAll('.gallery-thumbnails img');
        if (localImgs.length > 0) {
          container.innerHTML = '';
          Array.from(localImgs).forEach(img => {
             const data = { url: img.getAttribute('src'), caption: img.alt || 'بصمة ديزاين' };
             const item = document.createElement('div');
             
             if (section === 'certificates') {
               item.className = 'cert-img-full reveal active';
               item.innerHTML = `
                 <img src="${data.url}" class="thumbnail-img" style="width:100%; height:auto; object-fit:contain; border-radius:12px; margin-bottom:1.5rem;">
                 <div class="thumbnail-watermark">بصمة</div>
               `;
             } else {
               item.className = 'gallery-item reveal active';
               item.innerHTML = `
                 <img src="${data.url}" class="thumbnail-img" style="width:100%; height:100%; object-fit:cover;">
                 <div class="thumbnail-watermark">بصمة</div>
                 <div class="gallery-caption">${data.caption}</div>
               `;
               
               item.addEventListener('click', () => {
                  const lightbox = document.querySelector('.lightbox-modal');
                  if (lightbox) {
                    const lightboxImg = lightbox.querySelector('.lightbox-content');
                    if (lightboxImg) {
                      lightboxImg.src = data.url;
                      lightbox.style.display = 'flex';
                    }
                  }
               });
             }
             container.appendChild(item);
          });
        }
      }
    });
  };
  executeLocalFallbacks();

  // --- DYNAMIC CONTENT FROM ADMIN FIREBASE ---
  function initSectionData() {
    if (!window.fsUtils || !window.firebaseDB) {
      setTimeout(initSectionData, 500);
      return;
    }
    const { doc, onSnapshot } = window.fsUtils;
    const db = window.firebaseDB;

    // About Section
    if (document.getElementById('display-phone')) {
      onSnapshot(doc(db, 'sections', 'about'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.phone) document.getElementById('display-phone').innerText = data.phone;
          if (data.hours) document.getElementById('display-hours').innerHTML = `من <strong>${data.hours.split(' حتى ')[0] || data.hours}</strong><br>إلى <strong>${data.hours.split(' حتى ')[1] || ''}</strong>`;
          if (data.duration) document.getElementById('display-duration').innerHTML = `مدة تجهيز المشروع<br><strong>${data.duration}</strong>`;
          if (data.deposit) document.getElementById('display-deposit').innerHTML = data.deposit;
        }
      });
    }

    // Conclusion Section
    if (document.getElementById('display-conclusion-main')) {
      onSnapshot(doc(db, 'sections', 'conclusion'), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.main) document.getElementById('display-conclusion-main').innerText = data.main;
          if (data.final) document.getElementById('display-conclusion-final').innerText = data.final;
        }
      });
    }
  }
  initSectionData();

  function initComments() {
    const { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } = window.fsUtils;
    const db = window.firebaseDB;
    const commentsCol = collection(db, 'comments');

    // Use a simple collection listener for maximum reliability
    onSnapshot(commentsCol, (snapshot) => {
      if (!commentsDisplay) return;
      commentsDisplay.innerHTML = '';
      
      if (snapshot.empty) {
        commentsDisplay.innerHTML = '<div class="comment-card glass-panel" style="text-align:center; padding: 3rem;"><i class="fas fa-comment-dots" style="font-size: 2rem; color: var(--accent-gold); margin-bottom: 1rem; display: block;"></i>لا توجد تعليقات بعد.. كن أول من يترك بصمته هنا!</div>';
        return;
      }

      // Sort locally to ensure comments without timestamps (latency compensation) still show up
      const sortedDocs = snapshot.docs.sort((a, b) => {
        const timeA = a.data().timestamp?.seconds || Date.now();
        const timeB = b.data().timestamp?.seconds || Date.now();
        return timeB - timeA;
      });

      sortedDocs.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString('ar-EG') : 'الآن';
        const starCount = parseInt(data.stars || 5);
        const starsHtml = '<span class="star-filled">★</span>'.repeat(Math.max(0, Math.min(5, starCount))) + '<span class="star-empty">☆</span>'.repeat(Math.max(0, 5 - starCount));
        
        const card = document.createElement('div');
        card.className = 'comment-card glass-panel reveal active';
        
        let adminReplyHtml = '';
        if (data.admin_reply) {
          adminReplyHtml = `
            <div class="admin-reply-card" style="margin-top: 1rem; background: rgba(212, 175, 55, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--accent-gold);">
              <span class="admin-tag" style="color: var(--accent-gold); font-weight: bold; font-size: 0.85rem; display: block; margin-bottom: 5px;">رد بصمة ديزاين <i class="fas fa-check-circle"></i></span>
              <p class="comment-text" style="font-size: 0.95rem; margin: 0;">${data.admin_reply}</p>
            </div>
          `;
        }

        card.innerHTML = `
          <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.2rem;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div class="comment-avatar" style="width: 45px; height: 45px; background: rgba(212, 175, 55, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(212, 175, 55, 0.3);">
                <i class="fas fa-user-circle" style="font-size: 1.8rem; color: var(--accent-gold);"></i>
              </div>
              <div class="comment-info" style="text-align: right;">
                <span class="comment-author" style="display: block; font-weight: 700; color: var(--accent-gold); font-size: 1.1rem;">${data.name || 'مجهول'}</span>
                <div class="comment-stars" style="color: #FFD700; font-size: 0.9rem;">${starsHtml}</div>
              </div>
            </div>
            <span class="comment-date" style="font-size: 0.85rem; color: rgba(230, 200, 206, 0.5);">${date}</span>
          </div>
          <p class="comment-text" style="line-height: 1.6; color: var(--text-primary); margin-bottom: 0.5rem;">${data.comment || ''}</p>
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
      
      if (containsBadWords(name) || containsBadWords(commentRaw)) {
        alert('عفواً، لا يمكن إرسال التعليق لاحتوائه على رسالة غير لائقة. 🚫');
        return;
      }

      const stars = parseInt(document.querySelector('input[name="stars"]:checked')?.value || 5);
      try {
        await addDoc(commentsCol, { name: name, comment: commentRaw, stars, timestamp: serverTimestamp() });
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

  // --- SUPPORT WIDGET (Global - Restricted to Conclusion Page) ---
  if (window.location.pathname.includes('conclusion.html')) {
    const supportToggle = document.createElement('div');
    supportToggle.className = 'support-toggle';
    supportToggle.innerHTML = '<i class="fas fa-headset"></i>';
    supportToggle.title = "الدعم الفني / تواصل مع الإدارة";
    document.body.appendChild(supportToggle);

    const supportModal = document.createElement('div');
    supportModal.className = 'support-modal glass-panel';
    supportModal.style.display = 'none';
    supportModal.innerHTML = `
      <h3 style="color: var(--accent-gold); margin-bottom: 20px; font-family: 'Playfair Display', serif;"><i class="fas fa-envelope-open-text"></i> تواصل مع الإدارة</h3>
      <input type="text" id="support-name" placeholder="الاسم الكريم..." style="width: 100%; margin-bottom: 10px; padding: 12px; border-radius: 8px; border: 1px solid var(--accent-gold); background: rgba(0,0,0,0.5); color: #fff; font-family: inherit;">
      <textarea id="support-msg" rows="4" placeholder="اكتب شكواك أو رسالتك... سنستلمها فوراً في غرفة الإدارة." style="width: 100%; margin-bottom: 15px; padding: 12px; border-radius: 8px; border: 1px solid var(--accent-gold); background: rgba(0,0,0,0.5); color: #fff; font-family: inherit;"></textarea>
      <div style="display: flex; gap: 10px;">
        <button id="support-send" class="btn premium-btn" style="flex: 1;"><i class="fas fa-paper-plane"></i> إرسال للدعم</button>
        <button id="support-close" class="btn" style="background: rgba(255, 75, 75, 0.2); border: 1px solid var(--love-red);"><i class="fas fa-times"></i> إغلاق</button>
      </div>
    `;
    document.body.appendChild(supportModal);

    supportToggle.addEventListener('click', () => {
      supportModal.style.display = supportModal.style.display === 'none' ? 'block' : 'none';
    });
    
    supportModal.querySelector('#support-close').addEventListener('click', () => {
      supportModal.style.display = 'none';
    });

    supportModal.querySelector('#support-send').addEventListener('click', async () => {
      const name = document.getElementById('support-name').value.trim();
      const msg = document.getElementById('support-msg').value.trim();
      if (!name || !msg) { alert('يرجى كتابة الاسم والرسالة أولاً! ✍️'); return; }
      
      if (typeof containsBadWords === 'function' && (containsBadWords(name) || containsBadWords(msg))) {
        alert('عفواً، لا يمكن إرسال الرسالة لاحتوائها على كلمات غير لائقة. 🚫');
        return;
      }

      if (window.fsUtils) {
        const { collection, addDoc, serverTimestamp } = window.fsUtils;
        try {
          await addDoc(collection(window.firebaseDB, 'support_messages'), {
            name, message: msg, timestamp: serverTimestamp()
          });
          alert('تم رفع رسالتك للإدارة بنجاح! سيتم فحصها في غرفة المدير قريباً. 🛡️');
          supportModal.style.display = 'none';
          document.getElementById('support-name').value = '';
          document.getElementById('support-msg').value = '';
        } catch (e) {
          console.error(e);
          alert('حدث خطأ أثناء الإرسال. تأكد من اتصالك بالإنترنت.');
        }
      } else {
         alert('جاري الاتصال بالخوادم... يرجى المحاولة بعد ثوانٍ قليلة.');
      }
    });
  }

});
