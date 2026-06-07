/* ====================================================
   JavaScript — Dave Tupas Premium Portfolio
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
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
});

/* --- Mobile Navigation Hamburger Menu --- */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const links = document.querySelectorAll('.nav-links a');

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
  const navLinks = document.querySelectorAll('.nav-links a');
  
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
          galleryImages.push({
            type: iframeUrl ? 'iframe' : 'img',
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

  function openLightbox() {
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
  }

  function closeLightbox() {
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
      lightboxIframeWrapper.style.display = 'block';
      lightboxIframe.src = current.src;
      
      // Only apply iPhone styling to Tlexplorer mobile preview
      if (current.src && current.src.includes('tlexplorer')) {
        lightboxIframeWrapper.classList.add('iphone-mockup');
        iphoneNotch.style.display = 'block';
      } else {
        lightboxIframeWrapper.classList.remove('iphone-mockup');
        iphoneNotch.style.display = 'none';
      }
    } else {
      lightboxIframeWrapper.style.display = 'none';
      lightboxIframe.src = '';
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

  function showNext() {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxContent();
  }

  function showPrev() {
    if (galleryImages.length === 0) return;
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
  const containers = document.querySelectorAll('.subj-projects');

  containers.forEach(container => {
    buildCarousel(container);
  });

  // Re-init carousels when a year tab is clicked (panels show/hide)
  document.querySelectorAll('.ytab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Small delay to let the panel become visible
      setTimeout(() => {
        const year = tab.dataset.y;
        const panel = document.getElementById('yp' + year);
        if (!panel) return;
        // Only build if not already initialized
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

  // ---- Prev / Next Buttons ----
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-btn carousel-btn-prev';
  prevBtn.setAttribute('aria-label', 'Previous project');
  prevBtn.innerHTML = '&#8249;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-btn carousel-btn-next';
  nextBtn.setAttribute('aria-label', 'Next project');
  nextBtn.innerHTML = '&#8250;';

  container.appendChild(prevBtn);
  container.appendChild(nextBtn);

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
  container.appendChild(dotsWrap);

  // ---- Dynamic Title Display ----
  const activeTitleWrap = document.createElement('div');
  activeTitleWrap.className = 'carousel-active-title';
  container.appendChild(activeTitleWrap);

  let activeIndex = 0;

  // ---- 3D positioning logic ----
  function updateCoverflow() {
    const isMobile = window.innerWidth <= 640;
    
    // Dramatic Coverflow parameters to match reference
    const spacing = isMobile ? 45 : 80;
    const baseOffset = isMobile ? 80 : 150;
    const zSpacing = isMobile ? 120 : 200;
    const maxRotation = isMobile ? 55 : 65;
    
    // Update active title text
    const activeCard = cards[activeIndex];
    const projTitle = activeCard.querySelector('.proj-title') ? activeCard.querySelector('.proj-title').textContent : `Item ${activeIndex + 1}`;
    activeTitleWrap.innerHTML = `<h4>${projTitle}</h4>`;
    
    cards.forEach((card, i) => {
      if (i === activeIndex) {
        card.style.transform = 'translate3d(0, 0, 0) rotateY(0deg)';
        card.style.opacity = '1';
        card.style.zIndex = '20';
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
        card.classList.add('coverflow-active');
      } else if (i < activeIndex) {
        const dist = activeIndex - i;
        const xOffset = - (dist * spacing + baseOffset);
        const zOffset = - dist * zSpacing;
        card.style.transform = `translate3d(${xOffset}px, 0, ${zOffset}px) rotateY(${maxRotation}deg)`;
        card.style.opacity = dist > 3 ? '0' : (dist === 1 ? '0.75' : '0.35');
        card.style.zIndex = (10 - dist).toString();
        card.style.visibility = dist > 3 ? 'hidden' : 'visible';
        card.style.pointerEvents = dist > 3 ? 'none' : 'auto';
        card.classList.remove('coverflow-active');
      } else {
        const dist = i - activeIndex;
        const xOffset = dist * spacing + baseOffset;
        const zOffset = - dist * zSpacing;
        card.style.transform = `translate3d(${xOffset}px, 0, ${zOffset}px) rotateY(${-maxRotation}deg)`;
        card.style.opacity = dist > 3 ? '0' : (dist === 1 ? '0.75' : '0.35');
        card.style.zIndex = (10 - dist).toString();
        card.style.visibility = dist > 3 ? 'hidden' : 'visible';
        card.style.pointerEvents = dist > 3 ? 'none' : 'auto';
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
