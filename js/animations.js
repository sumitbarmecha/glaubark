/**
 * Lightweight animation layer: Lenis smooth-scroll, magnetic buttons,
 * 3D tilt on hover, the hero load-in timeline, and a simple background
 * parallax on the "What We Do" banner.
 *
 * Deliberately does NOT include scroll-triggered reveal animations (fade/
 * slide/mask-in-on-scroll, pinned sections, scrub timelines) or a custom
 * cursor — content is visible immediately and interactions are limited to
 * subtle, mouse/hover-driven touches. Everything here is skipped on touch
 * devices and when prefers-reduced-motion is set.
 */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function initLenis() {
    if (typeof Lenis === 'undefined' || prefersReducedMotion) return null;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
    }
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    window.__glaubarkLenis = lenis;
    return lenis;
  }

  function initMagnetic() {
    if (!hasFinePointer || prefersReducedMotion) return;

    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magneticStrength) || 0.35;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * strength);
        yTo((e.clientY - rect.top - rect.height / 2) * strength);
      });
      el.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /** Poor-man's SplitText: wraps words, groups them into line spans for mask reveals. */
  function splitTextLines(el) {
    if (!el || el.dataset.splitDone) return;

    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="split-word" style="display:inline-block;">${w}</span>`).join(' ');

    const wordEls = Array.from(el.querySelectorAll('.split-word'));
    const lines = [];
    let currentTop = null;
    let currentLine = [];

    wordEls.forEach((w) => {
      const top = w.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) < 2) {
        currentLine.push(w);
        currentTop = top;
      } else {
        lines.push(currentLine);
        currentLine = [w];
        currentTop = top;
      }
    });
    if (currentLine.length) lines.push(currentLine);

    el.innerHTML = '';
    lines.forEach((lineWords) => {
      const lineOuter = document.createElement('span');
      lineOuter.className = 'split-line';
      const lineInner = document.createElement('span');
      lineInner.className = 'split-line-inner';
      lineWords.forEach((w, i) => {
        w.removeAttribute('style');
        lineInner.appendChild(w);
        if (i < lineWords.length - 1) lineInner.appendChild(document.createTextNode(' '));
      });
      lineOuter.appendChild(lineInner);
      el.appendChild(lineOuter);
    });

    el.dataset.splitDone = 'true';
  }

  function prepareSplitHeadings() {
    // Only the hero headline gets the line-split load-in treatment; other
    // headings render as plain static text.
    document.querySelectorAll('.hero-headline').forEach(splitTextLines);
  }

  function initHeroTimeline() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const bgImg = hero.querySelector('.hero-bg-img');
    const headline = hero.querySelector('.hero-headline');
    const tagline = hero.querySelector('.hero-tagline');
    const statCards = hero.querySelectorAll('.hero-stats > div');
    const lines = headline ? headline.querySelectorAll('.split-line-inner') : [];

    if (prefersReducedMotion) {
      gsap.set([tagline, statCards], { opacity: 1, y: 0 });
      gsap.set(lines, { yPercent: 0 });
      return;
    }

    gsap.set(lines, { yPercent: 110 });
    gsap.set(tagline, { opacity: 0, y: 16 });
    gsap.set(statCards, { opacity: 0, y: 40 });

    gsap
      .timeline({ defaults: { ease: 'power4.out' }, delay: 0.2 })
      .fromTo(bgImg, { scale: 1.15 }, { scale: 1, duration: 2.2, ease: 'power2.out' }, 0)
      .to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.15)
      .to(tagline, { opacity: 1, y: 0, duration: 0.8 }, 0.55)
      .to(statCards, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.6);
  }

  /** Gentle idle float on the carousel slides — a continuous ambient touch, not scroll-linked. */
  function initCarouselExtras() {
    const wrap = document.querySelector('.carousel-reveal');
    if (!wrap || prefersReducedMotion) return;

    const slides = gsap.utils.toArray('.carousel-slide');
    slides.forEach((slide, i) => {
      gsap.to(slide, {
        y: i % 2 === 0 ? -8 : 8,
        duration: 2.6 + (i % 3) * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.12,
      });
    });
  }

  /** Simple, classic background parallax — the bg image drifts slower than the scroll, no pinning. */
  function initWhatWeDoParallax() {
    if (typeof ScrollTrigger === 'undefined') return;
    const section = document.querySelector('[data-parallax-banner]');
    if (!section || prefersReducedMotion) return;

    const bg = section.querySelector('.what-we-do-bg');
    if (!bg) return;

    gsap.to(bg, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  /** Layers onto the existing click handler in home.js: overshoot icon rotation + hover spotlight. */
  function initServicesAccordionEnhance() {
    const items = document.querySelectorAll('[data-services-accordion]');
    if (!items.length) return;

    items.forEach((item) => {
      const toggle = item.querySelector('.services-accordion-toggle');
      const icon = item.querySelector('.services-accordion-icon');
      if (!toggle || !icon) return;

      toggle.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        gsap.to(icon, { rotate: isOpen ? 90 : 0, duration: 0.55, ease: 'back.out(2.2)' });

        items.forEach((other) => {
          if (other !== item) {
            const otherIcon = other.querySelector('.services-accordion-icon');
            if (otherIcon) gsap.to(otherIcon, { rotate: 0, duration: 0.4, ease: 'power3.out' });
          }
        });
      });
    });

    if (!hasFinePointer) return;

    const container = document.querySelector('.services-accordion');
    const highlight = document.querySelector('.services-accordion-highlight');
    if (!container || !highlight) return;

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => {
        const cRect = container.getBoundingClientRect();
        const iRect = item.getBoundingClientRect();
        gsap.to(highlight, {
          top: iRect.top - cRect.top,
          height: iRect.height,
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      });
    });

    container.addEventListener('mouseleave', () => {
      gsap.to(highlight, { opacity: 0, duration: 0.3 });
    });
  }

  function initTiltElements() {
    if (!hasFinePointer || prefersReducedMotion) return;

    document.querySelectorAll('[data-tilt]').forEach((el) => {
      const max = parseFloat(el.dataset.tiltMax) || 8;
      const rotX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3' });
      const rotY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3' });

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        rotY(px * max);
        rotX(-py * max);
      });
      el.addEventListener('mouseleave', () => {
        rotX(0);
        rotY(0);
      });
    });
  }

  window.GlaubarkAnimations = {
    init() {
      if (typeof gsap === 'undefined') return;

      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }

      initLenis();
      initMagnetic();
      initCarouselExtras();
      initWhatWeDoParallax();
      initServicesAccordionEnhance();
      initTiltElements();

      const runTextEffects = () => {
        prepareSplitHeadings();
        initHeroTimeline();
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      };

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(runTextEffects);
      } else {
        runTextEffects();
      }
    },
  };
})();
