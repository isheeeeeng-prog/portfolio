/* ============================================================
   TRISHA RHAEND C. RAMOS — PORTFOLIO
   ============================================================ */

/* ── 1. NAVBAR ── */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a[data-section]');
const sections = document.querySelectorAll('main section[id]');

function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 90) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── 2. HAMBURGER ── */
const navToggle    = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');

function closeNav() {
  navLinksList.classList.remove('open');
  navToggle.classList.remove('menu-open');
  navbar.classList.remove('menu-open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  const bars = navToggle.querySelectorAll('.hamburger-bar');
  bars[0].style.transform = bars[2].style.transform = '';
  bars[1].style.opacity = '';
  bars.forEach(b => b.style.background = '');
}

function openNav() {
  navLinksList.classList.add('open');
  navToggle.classList.add('menu-open');
  navbar.classList.add('menu-open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  const bars = navToggle.querySelectorAll('.hamburger-bar');
  bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
  bars[1].style.opacity   = '0';
  bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  bars.forEach(b => b.style.background = '#2a1f40');
}

navToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinksList.classList.contains('open') ? closeNav() : openNav();
});

navLinksList.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

document.addEventListener('click', (e) => {
  if (navLinksList.classList.contains('open') &&
      !navLinksList.contains(e.target) &&
      !navToggle.contains(e.target)) {
    closeNav();
  }
});

/* ── 3. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
});

/* ── 4. SCROLL-REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.section-title, .section-eyebrow, .about-fact, ' +
  '.edu-item, .skill-row, .work-entry, ' +
  '.project-entry, .achieve-item, ' +
  '.contact-row, .ojt-block, .resume-text, .resume-frame, ' +
  '.reveal, .reveal-left'
).forEach((el, i) => {
  if (!el.classList.contains('reveal-left')) el.classList.add('reveal');
  const group = el.closest('.about-facts, .edu-timeline, .skills-list, .work-entries, .projects-list, .achieve-grid, .contact-list');
  if (group) {
    const idx = [...group.querySelectorAll(':scope > *')].indexOf(el);
    if (idx !== -1) el.style.transitionDelay = `${idx * 60}ms`;
  }
  revealObserver.observe(el);
});

/* ── 5. HERO ENTRANCE ── */
window.addEventListener('load', () => {
  document.querySelectorAll('.hero-greeting, .hero-name, .hero-title, .hero-subtitle, .hero-buttons').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.7s ease ${i * 110}ms, transform 0.7s ease ${i * 110}ms`;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 80 + i * 110);
  });
  const heroImg = document.querySelector('.hero-image');
  if (heroImg) {
    heroImg.style.opacity = '0';
    heroImg.style.transition = 'opacity 1.2s ease 0.2s';
    setTimeout(() => { heroImg.style.opacity = '1'; }, 100);
  }
});

/* ── 6. PROJECT highlight ── */
document.querySelectorAll('.project-entry').forEach(entry => {
  entry.addEventListener('mousemove', e => {
    const rect = entry.getBoundingClientRect();
    const pct = ((e.clientY - rect.top) / rect.height) * 100;
    entry.style.background = `linear-gradient(to bottom, transparent ${pct - 20}%, rgba(201,168,76,0.03) ${pct}%, transparent ${pct + 20}%)`;
  });
  entry.addEventListener('mouseleave', () => { entry.style.background = ''; });
});

/* ── 7. BACK TO TOP ── */
const backToTopLink = document.querySelector('#footer a[href="#hero"]');
if (backToTopLink) {
  window.addEventListener('scroll', () => {
    backToTopLink.style.opacity = window.scrollY > 400 ? '1' : '0.4';
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════
   8. LIGHTBOX
   ══════════════════════════════════════════════════════════ */

/* Build lightbox DOM */
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
lightbox.setAttribute('role', 'dialog');
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Image viewer');
lightbox.innerHTML = `
  <div id="lb-backdrop"></div>
  <button id="lb-close" aria-label="Close">&times;</button>
  <button id="lb-prev" aria-label="Previous">&#8592;</button>
  <button id="lb-next" aria-label="Next">&#8594;</button>
  <div id="lb-content">
    <img id="lb-img" src="" alt="" />
    <p id="lb-caption"></p>
  </div>
`;
document.body.appendChild(lightbox);

/* Inject lightbox CSS */
const lbStyle = document.createElement('style');
lbStyle.textContent = `
  #lightbox {
    display: none;
    position: fixed;
    inset: 0;
    z-index: 10000;
    align-items: center;
    justify-content: center;
  }
  #lightbox.open { display: flex; }

  #lb-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(8, 4, 18, 0.95);
    backdrop-filter: blur(8px);
    cursor: zoom-out;
  }

  #lb-content {
    position: relative;
    z-index: 1;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    animation: lbFadeIn 0.25s ease;
  }

  @keyframes lbFadeIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }

  #lb-img {
    max-width: 90vw;
    max-height: 80vh;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.8);
    display: block;
  }

  #lb-caption {
    font-family: 'Outfit', sans-serif;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    color: rgba(176, 160, 212, 0.8);
    text-align: center;
    max-width: 560px;
    line-height: 1.6;
  }

  #lb-close {
    position: fixed;
    top: 24px; right: 32px;
    z-index: 2;
    background: none;
    border: 1px solid rgba(201,168,76,0.3);
    color: rgba(201,168,76,0.8);
    font-size: 1.6rem;
    line-height: 1;
    width: 44px; height: 44px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
  }
  #lb-close:hover { background: rgba(201,168,76,0.1); color: #e8cc7a; border-color: rgba(201,168,76,0.7); }

  #lb-prev, #lb-next {
    position: fixed;
    top: 50%; transform: translateY(-50%);
    z-index: 2;
    background: none;
    border: 1px solid rgba(201,168,76,0.25);
    color: rgba(201,168,76,0.7);
    font-size: 1.3rem;
    width: 48px; height: 48px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
  }
  #lb-prev { left: 24px; }
  #lb-next { right: 24px; }
  #lb-prev:hover, #lb-next:hover { background: rgba(201,168,76,0.1); color: #e8cc7a; border-color: rgba(201,168,76,0.6); }
  #lb-prev.hidden, #lb-next.hidden { opacity: 0; pointer-events: none; }

  /* Clickable image cursor */
  [data-lightbox] { cursor: zoom-in; }
`;
document.head.appendChild(lbStyle);

/* Collect all lightbox-able images */
const lbImages = [];

function registerImage(imgEl, caption) {
  const src = imgEl.src || imgEl.dataset.src;
  if (!src) return;
  const idx = lbImages.length;
  lbImages.push({ src, caption: caption || imgEl.alt || '' });
  imgEl.dataset.lightbox = idx;

  // Make parent clickable
  const wrapper = imgEl.closest('figure, .project-image-thumb, .achieve-item, .ojt-image-wrap, .resume-frame, .about-photo-strip figure') || imgEl.parentElement;
  wrapper.style.cursor = 'zoom-in';
  wrapper.addEventListener('click', () => openLightbox(idx));
}

/* Register images after DOM is ready */
window.addEventListener('load', () => {
  // About photos
  document.querySelectorAll('.about-photo-strip figure img').forEach(img => {
    registerImage(img, img.alt);
  });

  // OJT certificate
  const ojtImg = document.querySelector('.ojt-image-wrap img');
  if (ojtImg) {
    const idx = lbImages.length;
    lbImages.push({ src: ojtImg.src, caption: 'Certificate of Completion — OJT, Davao del Norte State College' });
    const ojtBlock = document.querySelector('.ojt-block');
    if (ojtBlock) ojtBlock.addEventListener('click', () => openLightbox(idx));
  }

  // Project thumbnails
  document.querySelectorAll('.project-image-thumb img').forEach(img => {
    registerImage(img, img.alt);
  });

  // Achievement images
  document.querySelectorAll('.achieve-item img').forEach(img => {
    const captionEl = img.closest('.achieve-item')?.querySelector('.achieve-item-caption strong');
    registerImage(img, captionEl ? captionEl.textContent : img.alt);
  });

  // Seminar image
  const seminarImg = document.querySelector('.seminar-img');
  if (seminarImg) registerImage(seminarImg, '36th Civil Registration Month 2026 — DNSC');

  // Resume
  const resumeImg = document.querySelector('.resume-frame img');
  if (resumeImg) {
    const idx = lbImages.length;
    lbImages.push({ src: resumeImg.src, caption: 'Curriculum Vitae — Trisha Rhaend C. Ramos' });
    const resumeInner = document.querySelector('.resume-frame-inner');
    if (resumeInner) resumeInner.addEventListener('click', () => openLightbox(idx));
  }
});

/* Lightbox state */
let currentIdx = 0;

function openLightbox(idx) {
  currentIdx = idx;
  const { src, caption } = lbImages[idx];
  const lbImg = document.getElementById('lb-img');
  lbImg.style.opacity = '0';
  lbImg.src = src;
  lbImg.alt = caption;
  lbImg.onload = () => { lbImg.style.transition = 'opacity 0.2s'; lbImg.style.opacity = '1'; };
  document.getElementById('lb-caption').textContent = caption;
  document.getElementById('lb-prev').classList.toggle('hidden', idx === 0);
  document.getElementById('lb-next').classList.toggle('hidden', idx === lbImages.length - 1);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function navigate(dir) {
  const next = currentIdx + dir;
  if (next >= 0 && next < lbImages.length) openLightbox(next);
}

document.getElementById('lb-close').addEventListener('click', closeLightbox);
document.getElementById('lb-backdrop').addEventListener('click', closeLightbox);
document.getElementById('lb-prev').addEventListener('click', () => navigate(-1));
document.getElementById('lb-next').addEventListener('click', () => navigate(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});


/* ── 9. CURSOR GLOW ── */
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
  }, { passive: true });
} else if (cursorGlow) {
  cursorGlow.style.display = 'none';
}

/* ── 10. HERO IMAGE PARALLAX ── */
const heroImg = document.querySelector('.hero-image-frame');
if (heroImg && window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 10;
    const y = (e.clientY / window.innerHeight - 0.5) * 6;
    heroImg.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}
let touchStartX = 0;
let touchStartY = 0;

lightbox.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

lightbox.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  const dy = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    navigate(dx < 0 ? 1 : -1);
  } else if (dy > 80 && Math.abs(dx) < 40) {
    closeLightbox();
  }
}, { passive: true });
