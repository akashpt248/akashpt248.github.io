(() => {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Footer year                                                        */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------ */
  /* Nav: scrolled state + build progress line                          */
  /* ------------------------------------------------------------------ */
  const nav = document.getElementById('nav');
  const buildFill = document.getElementById('buildFill');

  function onScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-scrolled', scrollY > 24);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;
    buildFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------ */
  /* Mobile nav                                                          */
  /* ------------------------------------------------------------------ */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------ */
  /* Reveal-on-scroll (IntersectionObserver)                            */
  /* ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ------------------------------------------------------------------ */
  /* Project slider — buttons + drag/swipe                              */
  /* ------------------------------------------------------------------ */
  const slider = document.getElementById('projectSlider');
  const track = document.getElementById('projectTrack');
  const cards = track ? Array.from(track.children) : [];
  const prevBtn = document.getElementById('prevProject');
  const nextBtn = document.getElementById('nextProject');
  const currentLabel = document.getElementById('slideCurrent');
  const totalLabel = document.getElementById('slideTotal');

  let currentIndex = 0;
  let cardWidth = 0;
  let gap = 0;

  function pad(n) {
    return String(n + 1).padStart(2, '0');
  }

  function measure() {
    if (!cards.length) return;
    const style = window.getComputedStyle(track);
    gap = parseFloat(style.columnGap || style.gap || '0');
    cardWidth = cards[0].getBoundingClientRect().width + gap;
  }

  function updateSlider(animate = true) {
    if (!cards.length) return;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    currentLabel.textContent = pad(currentIndex);
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === cards.length - 1;
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(cards.length - 1, index));
    updateSlider(true);
  }

  if (track && cards.length) {
    totalLabel.textContent = pad(cards.length - 1);
    measure();
    updateSlider(false);

    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    window.addEventListener('resize', () => {
      measure();
      updateSlider(false);
    });

    /* Drag / swipe support */
    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let dragDelta = 0;

    function pointerDown(x) {
      isDragging = true;
      startX = x;
      dragDelta = 0;
      startTranslate = -currentIndex * cardWidth;
      slider.classList.add('is-dragging');
      track.style.transition = 'none';
    }
    function pointerMove(x) {
      if (!isDragging) return;
      dragDelta = x - startX;
      track.style.transform = `translateX(${startTranslate + dragDelta}px)`;
    }
    function pointerUp() {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove('is-dragging');
      const threshold = cardWidth * 0.18;
      if (dragDelta < -threshold) {
        goTo(currentIndex + 1);
      } else if (dragDelta > threshold) {
        goTo(currentIndex - 1);
      } else {
        updateSlider(true);
      }
    }

    slider.addEventListener('mousedown', (e) => pointerDown(e.clientX));
    window.addEventListener('mousemove', (e) => pointerMove(e.clientX));
    window.addEventListener('mouseup', pointerUp);

    slider.addEventListener(
      'touchstart',
      (e) => pointerDown(e.touches[0].clientX),
      { passive: true }
    );
    slider.addEventListener(
      'touchmove',
      (e) => pointerMove(e.touches[0].clientX),
      { passive: true }
    );
    slider.addEventListener('touchend', pointerUp);

    /* Keyboard support when slider is focused */
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') goTo(currentIndex + 1);
      if (e.key === 'ArrowLeft') goTo(currentIndex - 1);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Contact form — frontend-only validation                            */
  /* ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  if (form) {
    const successMsg = document.getElementById('formSuccess');

    const fields = {
      name: { input: document.getElementById('cf-name'), validate: (v) => v.trim().length > 1 },
      email: {
        input: document.getElementById('cf-email'),
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      },
      message: { input: document.getElementById('cf-message'), validate: (v) => v.trim().length > 9 },
    };

    function setFieldState(key, isValid) {
      const field = fields[key].input.closest('.form-field');
      field.classList.toggle('has-error', !isValid);
    }

    Object.keys(fields).forEach((key) => {
      fields[key].input.addEventListener('blur', () => {
        setFieldState(key, fields[key].validate(fields[key].input.value));
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;

      Object.keys(fields).forEach((key) => {
        const valid = fields[key].validate(fields[key].input.value);
        setFieldState(key, valid);
        if (!valid) allValid = false;
      });

      if (allValid) {
        successMsg.classList.add('is-visible');
        form.reset();
        Object.keys(fields).forEach((key) => setFieldState(key, true));
      } else {
        successMsg.classList.remove('is-visible');
        const firstInvalid = Object.keys(fields).find(
          (key) => !fields[key].validate(fields[key].input.value)
        );
        if (firstInvalid) fields[firstInvalid].input.focus();
      }
    });
  }
})();
