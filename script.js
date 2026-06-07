/* ====================================================
   JavaScript — Dave Tupas Premium Portfolio
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initNavScroll();
  initTimelineTabs();
  initScrollspy();
  initIntersectionObserver();
  initLightbox();
  
  // Premium Interactive Enhancements
  initAmbientCanvas();
  initCustomCursor();
  initThemeToggle();
  initScrollProgress();
  initStatsCounter();

  // 3D Interactive Features
  init3DTiltCards();

  // 3D Coverflow Carousel
  initCoverflowCarousels();

  // Video Playback Controls
  initVideoPlaybackControls();

  // Scroll to Top
  initScrollTopBtn();

  // Viewer Tracker Notification
  initViewerTracker();
});

/* --- Mobile Navigation Hamburger Menu --- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-link');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Navbar Scroll State: frosted glass + direction-aware collapse --- */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  const update = () => {
    const currentY = window.scrollY;
    const scrollingDown = currentY > lastScrollY;

    // Always apply frosted bg once past 20px
    if (currentY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
      nav.classList.remove('collapsed'); // at very top: always expand
    }

    // Collapse when scrolling DOWN (and not at very top)
    if (currentY > 80) {
      if (scrollingDown) {
        nav.classList.add('collapsed');
      } else {
        nav.classList.remove('collapsed');
      }
    }

    lastScrollY = currentY <= 0 ? 0 : currentY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // Run on load
}

/* --- Tab Switcher for Academic Journey --- */
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.ytab');
  const panels = document.querySelectorAll('.year-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const year = tab.dataset.y;
      
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById('yp' + year);
      if (targetPanel) {
        targetPanel.classList.add('active');
        // Restart intersection observer for items inside the newly visible tab
        const reveals = targetPanel.querySelectorAll('.reveal');
        reveals.forEach((el, i) => {
          el.style.transitionDelay = (i % 4) * 0.08 + 's';
          el.classList.add('visible');
        });
      }
    });
  });
}

/* --- Scrollspy: Track Active Menu Links --- */
function initScrollspy() {
  const sections = ['services', 'about-me', 'hobbies', 'journey', 'contact'];
  const navLinks = document.querySelectorAll('.nav-link');
  
  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section is in middle viewport
    threshold: 0
  });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });
}

/* --- Intersection Observer Scroll Reveal --- */
function initIntersectionObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.08
  });

  document.querySelectorAll('.reveal').forEach((el, i) => {
    // Add staggered delay to rows/grids
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    observer.observe(el);
  });
}

/* --- Premium Lightbox Modal Viewer --- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox || !lightboxImg || !lightboxCaption) return;

  let galleryImages = [];
  let currentIndex = 0;

  // Find all project images inside journey cards
  const projectCards = document.querySelectorAll('.proj-card');
  
  projectCards.forEach(card => {
    const imgWrapper = card.querySelector('.proj-img-wrapper');
    if (!imgWrapper) return;

    imgWrapper.addEventListener('click', (e) => {
      // If the card is in a coverflow carousel and is NOT active, let it bubble to focus the card
      if (card.closest('.coverflow-track') && !card.classList.contains('coverflow-active')) {
        return;
      }

      // If it's a link card, we can still do data-href for external links
      const href = card.dataset.href;
      if (href) {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, '_blank', 'noopener,noreferrer');
        return;
      }

      // Check if it's an iframe card or image card
      const isIframe = card.hasAttribute('data-iframe');
      const clickedImg = card.querySelector('img.proj-img');
      if (!isIframe && !clickedImg) return;

      e.preventDefault();
      e.stopPropagation();

      // Collect images: prefer .year-panel, fall back to .subj-projects
      const scope = card.closest('.year-panel') || card.closest('.subj-projects') || document;
      const activeCards = scope.querySelectorAll('.proj-card');
      galleryImages = [];

      activeCards.forEach((c) => {
        const img = c.querySelector('img.proj-img');
        const iframeUrl = c.dataset.iframe;
        const title = c.querySelector('.proj-title');
        
        if (iframeUrl || img) {
          let type = 'img';
          if (iframeUrl) {
            type = iframeUrl.endsWith('.mp4') ? 'video' : (iframeUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'img' : 'iframe');
          }
          galleryImages.push({
            type: type,
            src: iframeUrl ? iframeUrl : img.src,
            title: title ? title.textContent : ''
          });
          if (c === card) {
            currentIndex = galleryImages.length - 1;
          }
        }
      });

      openLightbox();
    });
  });

  // Helper: pause all videos on the page (both inline and lightbox)
  function pauseAllVideos() {
    document.querySelectorAll('video').forEach(v => {
      v.pause();
    });
  }

  function openLightbox() {
    pauseAllVideos(); // Stop any playing inline videos
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    pauseAllVideos(); // Stop any lightbox video
    // Remove lightbox video element
    const lbWrapper = document.getElementById('lightboxIframeWrapper');
    const existingVid = lbWrapper ? lbWrapper.querySelector('video.lightbox-video') : null;
    if (existingVid) existingVid.remove();
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    if (galleryImages.length === 0) return;
    const current = galleryImages[currentIndex];
    
    const lightboxIframe = document.getElementById('lightboxIframe');
    
    const lightboxIframeWrapper = document.getElementById('lightboxIframeWrapper');
    const iphoneNotch = document.getElementById('iphoneNotch');
    
    if (current.type === 'iframe') {
      lightboxImg.style.display = 'none';
      lightboxImg.src = '';
      // Remove any existing video
      const existingVid = lightboxIframeWrapper.querySelector('video.lightbox-video');
      if (existingVid) existingVid.remove();
      lightboxIframeWrapper.style.display = 'block';
      lightboxIframe.style.display = 'block';
      lightboxIframe.src = current.src;
      
      // Only apply iPhone styling to Tlexplorer mobile preview
      if (current.src && current.src.includes('tlexplorer')) {
        lightboxIframeWrapper.classList.add('iphone-mockup');
        iphoneNotch.style.display = 'block';
      } else {
        lightboxIframeWrapper.classList.remove('iphone-mockup');
        iphoneNotch.style.display = 'none';
      }
    } else if (current.type === 'video') {
      lightboxImg.style.display = 'none';
      lightboxImg.src = '';
      lightboxIframe.style.display = 'none';
      lightboxIframe.src = '';
      lightboxIframeWrapper.classList.remove('iphone-mockup');
      iphoneNotch.style.display = 'none';
      // Remove any existing video
      const existingVid = lightboxIframeWrapper.querySelector('video.lightbox-video');
      if (existingVid) existingVid.remove();
      // Create video element
      const vid = document.createElement('video');
      vid.src = current.src;
      vid.controls = true;
      vid.autoplay = true;
      vid.className = 'lightbox-video';
      vid.style.cssText = 'width:100%;height:100%;border-radius:12px;background:#000;';
      lightboxIframeWrapper.style.display = 'block';
      lightboxIframeWrapper.appendChild(vid);
    } else {
      lightboxIframeWrapper.style.display = 'none';
      lightboxIframe.src = '';
      // Remove any existing video
      const existingVid = lightboxIframeWrapper.querySelector('video.lightbox-video');
      if (existingVid) existingVid.remove();
      lightboxImg.style.display = 'block';
      lightboxImg.src = current.src;
    }
    
    lightboxCaption.textContent = current.title;

    // Show/hide navigation arrows based on total items
    if (galleryImages.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    } else {
      prevBtn.style.display = 'flex';
      nextBtn.style.display = 'flex';
    }
  }

  // Auto-pause other inline card videos when one starts playing
  document.addEventListener('play', function(e) {
    if (e.target.tagName === 'VIDEO') {
      document.querySelectorAll('video').forEach(v => {
        if (v !== e.target) v.pause();
      });
    }
  }, true);

  function showNext() {
    if (galleryImages.length === 0) return;
    pauseAllVideos();
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxContent();
  }

  function showPrev() {
    if (galleryImages.length === 0) return;
    pauseAllVideos();
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
  }

  // Event Listeners
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', showPrev);
  nextBtn.addEventListener('click', showNext);
  
  // Close when clicking backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ====================================================
   PREMIUM PORTFOLIO ENHANCEMENTS LOGIC
   ==================================================== */

/* --- Interactive Ambient Canvas (Floating Nodes) --- */
function initAmbientCanvas() {
  const canvas = document.getElementById('ambient-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  const particles = [];
  const maxParticles = Math.min(50, Math.floor((width * height) / 25000));
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.5 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
      
      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          this.x += (dx / dist) * force * 1.8;
          this.y += (dy / dist) * force * 1.8;
        }
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--cyan').trim();
      ctx.globalAlpha = 0.22;
      ctx.fill();
    }
  }
  
  const mouse = { x: null, y: null };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    const cyanColor = getComputedStyle(document.body).getPropertyValue('--cyan').trim();
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.update();
      p.draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = cyanColor;
          ctx.globalAlpha = (110 - dist) / 110 * 0.08;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* --- Smooth Custom Cursor with Magnetic Lag --- */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  if (!cursor || !cursorDot) return;
  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  let isOverIframe = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    
    if (!isOverIframe) {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    }
  });
  
  // Smooth outer ring using Linear Interpolation (lerp)
  function tick() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    
    cursor.style.left = ringX + 'px';
    cursor.style.top = ringY + 'px';
    
    requestAnimationFrame(tick);
  }
  tick();
  
  // Hover states
  const hoverTargets = document.querySelectorAll('a, button, .proj-card, .service-card, .hobby-card, .subj-card, .ytab, .source-chip, .contact-link');
  hoverTargets.forEach(target => {
    target.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
      cursorDot.classList.add('cursor-hover');
    });
    target.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
      cursorDot.classList.remove('cursor-hover');
    });
  });
  
  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorDot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (!isOverIframe) {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    }
  });
  
  // Hide cursor over iframes to prevent it getting stuck
  const iframeWrappers = document.querySelectorAll('iframe, .iframe-wrapper');
  iframeWrappers.forEach(el => {
    el.addEventListener('mouseenter', () => {
      isOverIframe = true;
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });
    el.addEventListener('mouseleave', () => {
      isOverIframe = false;
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  });
}

/* --- Cyber Theme Toggler (Cyan Cyber vs. Amber Grid) --- */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  
  const currentTheme = localStorage.getItem('theme') || 'cyan';
  if (currentTheme === 'amber') {
    document.body.classList.add('theme-amber');
  }
  
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-amber');
    const isAmber = document.body.classList.contains('theme-amber');
    localStorage.setItem('theme', isAmber ? 'amber' : 'cyan');
  });
}

/* --- Header Scroll Progress Indicator --- */
function initScrollProgress() {
  const progress = document.getElementById('scrollProgress');
  if (!progress) return;
  
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progress.style.width = scrolled + '%';
  });
}

/* --- Stats counter count-up animation --- */
function initStatsCounter() {
  const numbers = document.querySelectorAll('.stat-number');
  if (numbers.length === 0) return;
  
  const countUp = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500; // ms
    const startTime = performance.now();
    
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out cubic formula
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      
      el.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };
    
    requestAnimationFrame(update);
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        countUp(el);
        observer.unobserve(el); // Animate once only
      }
    });
  }, {
    threshold: 0.5
  });
  
  numbers.forEach(num => observer.observe(num));
}

/* ====================================================
   CENTER-SNAP CAROUSEL
   ==================================================== */

function initCoverflowCarousels() {
  const projectsContainer = document.querySelector('#journey .subj-projects');
  if (!projectsContainer) return;

  // Store the master list of all project cards (original DOM order)
  const allCards = Array.from(projectsContainer.querySelectorAll('.proj-card'));

  let currentLayout = 'carousel';
  let currentFilter = 'all';

  /* ---- Helpers ---- */

  // Reset all inline carousel styles on a card
  function resetCard(card) {
    card.style.transform    = '';
    card.style.opacity      = '';
    card.style.zIndex       = '';
    card.style.visibility   = '';
    card.style.pointerEvents = '';
    card.style.filter       = '';
    card.style.position     = '';
    card.style.left         = '';
    card.style.width        = '';
    card.style.margin       = '';
    card.style.display      = '';
    card.classList.remove('coverflow-active');
  }

  // Remove the carousel DOM (track, controls, title) and return cards to container
  function teardownCarousel() {
    const track       = projectsContainer.querySelector('.coverflow-track');
    const controls    = projectsContainer.querySelector('.carousel-controls');
    const activeTitle = projectsContainer.querySelector('.carousel-active-title');

    if (track) {
      // Move cards back to container before removing track
      Array.from(track.querySelectorAll('.proj-card')).forEach(card => {
        resetCard(card);
        projectsContainer.appendChild(card);
      });
      track.remove();
    }
    if (controls)    controls.remove();
    if (activeTitle) activeTitle.remove();
  }

  // Show/hide cards in grid or list view based on current filter
  function applyFilterToFlatCards() {
    Array.from(projectsContainer.querySelectorAll('.proj-card')).forEach(card => {
      const match = currentFilter === 'all' || card.dataset.category === currentFilter;
      card.style.display = match ? '' : 'none';
    });
  }

  // Get filtered cards (in original order) ready for carousel rebuild
  function getFilteredCards() {
    return allCards.filter(card =>
      currentFilter === 'all' || card.dataset.category === currentFilter
    );
  }

  // Rebuild carousel with only filtered cards
  function rebuildCarousel() {
    teardownCarousel();
    // Put only matching cards back in container, hide the rest
    allCards.forEach(card => {
      resetCard(card);
      const match = currentFilter === 'all' || card.dataset.category === currentFilter;
      if (match) {
        projectsContainer.appendChild(card);
      }
      // Non-matching cards are simply not in the DOM during carousel mode
    });
    buildCarousel(projectsContainer);
  }

  /* ---- Initial build: default to carousel view ---- */
  projectsContainer.classList.add('view-carousel');
  currentLayout = 'carousel';
  buildCarousel(projectsContainer);

  /* ---- Layout Toggle ---- */
  const layoutBtns = document.querySelectorAll('.layout-btn');
  layoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newLayout = btn.dataset.layout;
      if (newLayout === currentLayout) return;

      layoutBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectsContainer.classList.remove('view-carousel', 'view-grid', 'view-list');
      projectsContainer.classList.add('view-' + newLayout);
      currentLayout = newLayout;

      if (newLayout === 'carousel') {
        // Rebuild carousel (with current filter)
        rebuildCarousel();
      } else {
        // Destroy carousel and expose flat cards
        teardownCarousel();
        // Ensure all cards are in container (non-matching ones from carousel mode may be absent)
        allCards.forEach(card => {
          resetCard(card);
          projectsContainer.appendChild(card);
        });
        applyFilterToFlatCards();
      }
    });
  });

  /* ---- Filter Buttons ---- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;

      if (currentLayout === 'carousel') {
        // Rebuild carousel with filtered set
        rebuildCarousel();
      } else {
        // Just show/hide cards in place
        applyFilterToFlatCards();
      }
    });
  });

  // Re-init carousels when a year tab is clicked (panels show/hide)
  document.querySelectorAll('.ytab').forEach(tab => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        const year = tab.dataset.y;
        const panel = document.getElementById('yp' + year);
        if (!panel) return;
        panel.querySelectorAll('.subj-projects').forEach(c => {
          if (!c.querySelector('.coverflow-track')) buildCarousel(c);
        });
      }, 60);
    });
  });
}

function buildCarousel(container) {
  const cards = Array.from(container.querySelectorAll('.proj-card'));
  if (cards.length === 0) return;

  // ---- Wrap cards in a coverflow track ----
  const track = document.createElement('div');
  track.className = 'coverflow-track';
  cards.forEach(card => track.appendChild(card));
  container.appendChild(track);

  // ---- Dynamic Title Display ----
  const activeTitleWrap = document.createElement('div');
  activeTitleWrap.className = 'carousel-active-title';
  container.appendChild(activeTitleWrap);

  // ---- Controls Wrapper ----
  const controlsWrap = document.createElement('div');
  controlsWrap.className = 'carousel-controls';

  // ---- Prev / Next Buttons ----
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous project');
  prevBtn.innerHTML = '&#8592;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-btn-next';
  nextBtn.setAttribute('aria-label', 'Next project');
  nextBtn.innerHTML = '&#8594;';

  // ---- Dot Indicators ----
  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';
  const dots = cards.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => {
      activeIndex = i;
      updateCoverflow();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  controlsWrap.appendChild(prevBtn);
  controlsWrap.appendChild(dotsWrap);
  controlsWrap.appendChild(nextBtn);
  container.appendChild(controlsWrap);

  let activeIndex = 0;

  // ---- 3D positioning logic ----
  function updateCoverflow() {
    const isMobile = window.innerWidth <= 640;
    
    // Flat Overlap parameters to match reference
    const peek = isMobile ? 50 : 160; 
    const scaleDrop = 0.15; 
    
    // Update active title text
    const activeCard = cards[activeIndex];
    const projTitle = activeCard.querySelector('.proj-title') ? activeCard.querySelector('.proj-title').textContent : `Item ${activeIndex + 1}`;
    const projDesc = activeCard.querySelector('.proj-desc') ? activeCard.querySelector('.proj-desc').textContent : ``;
    activeTitleWrap.innerHTML = `<h4>${projTitle}</h4><p>${projDesc}</p>`;
    
    cards.forEach((card, i) => {
      if (i === activeIndex) {
        card.style.transform = 'translate3d(0, 0, 0) scale(1)';
        card.style.opacity = '1';
        card.style.zIndex = '20';
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
        card.style.filter = 'brightness(1)';
        card.classList.add('coverflow-active');
      } else if (i < activeIndex) {
        const dist = activeIndex - i;
        const xOffset = isMobile ? - (dist * 40 + 60) : - (dist * peek + 180);
        const scale = 1 - (dist * scaleDrop);
        card.style.transform = `translate3d(${xOffset}px, 0, 0) scale(${scale})`;
        card.style.opacity = dist > 2 ? '0' : '1';
        card.style.zIndex = (10 - dist).toString();
        card.style.visibility = dist > 2 ? 'hidden' : 'visible';
        card.style.pointerEvents = dist > 2 ? 'none' : 'auto';
        card.style.filter = `brightness(${1 - dist * 0.2})`;
        card.classList.remove('coverflow-active');
      } else {
        const dist = i - activeIndex;
        const xOffset = isMobile ? (dist * 40 + 60) : (dist * peek + 180);
        const scale = 1 - (dist * scaleDrop);
        card.style.transform = `translate3d(${xOffset}px, 0, 0) scale(${scale})`;
        card.style.opacity = dist > 2 ? '0' : '1';
        card.style.zIndex = (10 - dist).toString();
        card.style.visibility = dist > 2 ? 'hidden' : 'visible';
        card.style.pointerEvents = dist > 2 ? 'none' : 'auto';
        card.style.filter = `brightness(${1 - dist * 0.2})`;
        card.classList.remove('coverflow-active');
      }
    });

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });

    // Update buttons
    prevBtn.disabled = activeIndex === 0;
    prevBtn.style.opacity = activeIndex === 0 ? '0.3' : '1';
    nextBtn.disabled = activeIndex === cards.length - 1;
    nextBtn.style.opacity = activeIndex === cards.length - 1 ? '0.3' : '1';
  }

  // Click on card to center it if not in focus
  cards.forEach((card, i) => {
    card.addEventListener('click', (e) => {
      if (i !== activeIndex) {
        e.preventDefault();
        e.stopPropagation();
        activeIndex = i;
        updateCoverflow();
      }
    });
  });

  // ---- Arrow navigation ----
  prevBtn.addEventListener('click', () => {
    if (activeIndex > 0) {
      activeIndex--;
      updateCoverflow();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (activeIndex < cards.length - 1) {
      activeIndex++;
      updateCoverflow();
    }
  });

  // ---- Drag / Swipe support ----
  let startX = 0;
  let isDragging = false;
  const threshold = 45; // swipe minimum distance in px

  function handleStart(clientX) {
    startX = clientX;
    isDragging = true;
    
    // Add temporary window listeners to track mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
  }

  function handleMouseMove(e) {
    handleMove(e.clientX);
  }

  function handleMove(clientX) {
    if (!isDragging) return;
    const diff = clientX - startX;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeIndex > 0) {
        activeIndex--;
        updateCoverflow();
        handleEnd();
      } else if (diff < 0 && activeIndex < cards.length - 1) {
        activeIndex++;
        updateCoverflow();
        handleEnd();
      }
    }
  }

  function handleEnd() {
    isDragging = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleEnd);
  }

  // Bind mouse drag initialization on track
  track.addEventListener('mousedown', (e) => {
    // Only drag with primary mouse button click
    if (e.button === 0) {
      handleStart(e.clientX);
    }
  });

  // Prevent default browser drag-ghosting on images/links
  track.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // Bind touch events directly to track (always active)
  track.addEventListener('touchstart', (e) => handleStart(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchmove', (e) => handleMove(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', handleEnd);

  // Initial layout
  updateCoverflow();

  // Handle window resize
  window.addEventListener('resize', updateCoverflow);
}

/* --- 3D Perspective Tilt on Cards (CSS-based, desktop only) --- */
function init3DTiltCards() {
  // Only run on pointer-fine (mouse) devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = document.querySelectorAll(
    '.service-card, .hobby-card, .proj-card, .subj-card, .contact-link'
  );

  const MAX_TILT = 12; // degrees

  cards.forEach(card => {
    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';
    card.style.transition = 'transform 0.12s ease-out, box-shadow 0.12s ease-out';

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const relY = (e.clientY - rect.top)  / rect.height - 0.5;

      const rotX = -relY * MAX_TILT;
      const rotY =  relX * MAX_TILT;

      const cyan = getComputedStyle(document.body).getPropertyValue('--cyan').trim();

      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03, 1.03, 1.03)`;
      card.style.boxShadow =
        `0 15px 40px rgba(0,0,0,0.35), 0 0 20px ${cyan}22`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
      card.style.boxShadow = '';
    });
  });
}

/* --- Global Video Controls (Spacebar Pause/Play) --- */
function initVideoPlaybackControls() {
  document.addEventListener('keydown', (e) => {
    // Intercept Spacebar
    if (e.code === 'Space' || e.key === ' ') {
      // Allow spacebar in form fields
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      const activeCard = document.querySelector('.proj-card.coverflow-active');
      let targetVideo = null;

      // Prioritize the active carousel card's video if available
      if (activeCard) {
        targetVideo = activeCard.querySelector('video');
      }
      
      // Otherwise fallback to the first video
      if (!targetVideo) {
        targetVideo = document.querySelector('video');
      }

      if (targetVideo) {
        e.preventDefault(); // Prevent scrolling down
        if (targetVideo.paused) {
          targetVideo.play();
        } else {
          targetVideo.pause();
        }
      }
    }
  });
}

/* --- Scroll to Top Button --- */
function initScrollTopBtn() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  // Add hover target for custom cursor
  scrollTopBtn.addEventListener('mouseenter', () => {
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    if (cursor) cursor.classList.add('cursor-hover');
    if (cursorDot) cursorDot.classList.add('cursor-hover');
  });
  scrollTopBtn.addEventListener('mouseleave', () => {
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');
    if (cursor) cursor.classList.remove('cursor-hover');
    if (cursorDot) cursorDot.classList.remove('cursor-hover');
  });

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ====================================================
   VIEWER TRACKER (EMAILS OWNER ON VISIT)
   ==================================================== */
function initViewerTracker() {
  // Only run on the live GitHub Pages site to prevent spamming yourself locally
  if (window.location.hostname !== 'deyb123.github.io') {
    console.log('Viewer tracker skipped (not on live site).');
    return;
  }

  // Check if we've already tracked this browser to prevent spam
  if (localStorage.getItem('portfolio_tracker_sent')) {
    return;
  }

  // Fetch visitor location data from a free IP Geolocation API
  fetch('https://get.geojs.io/v1/ip/geo.json')
    .then(response => response.json())
    .then(data => {
      const emailContent = {
        name: "Viewer Tracker Bot",
        _subject: "New Visitor on Your Portfolio!",
        message: `A new user just viewed your portfolio website!`,
        visitor_ip: data.ip || 'Unknown',
        location: `${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country || 'Unknown'}`,
        organization_isp: data.organization_name || data.organization || 'Unknown',
        browser: navigator.userAgent
      };

      // Send the email via FormSubmit AJAX
      return fetch("https://formsubmit.co/ajax/tupas.dave@dnsc.edu.ph", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailContent)
      });
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Mark as tracked so we don't spam on refresh
        localStorage.setItem('portfolio_tracker_sent', 'true');
        console.log('Viewer tracked successfully.');
      }
    })
    .catch(error => {
      console.error('Error tracking viewer:', error);
    });
}
