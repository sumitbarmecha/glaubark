/**
 * Services page — section animations and interactions.
 */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Section 1: Hero ── */

  function initServicesHeroEntrance() {
    const hero = document.querySelector('.services-hero');
    if (!hero || typeof gsap === 'undefined') return;

    const label = hero.querySelector('[data-services-animate="label"]');
    const titleMain = hero.querySelector('[data-services-animate="title-main"]');
    const titleAccent = hero.querySelector('[data-services-animate="title-accent"]');
    const desc = hero.querySelector('[data-services-animate="desc"]');
    const tags = hero.querySelectorAll('[data-service-tag]');
    const rings = hero.querySelectorAll('.services-hero-ring');

    if (prefersReducedMotion) {
      gsap.set([label, titleMain, titleAccent, desc, tags], { opacity: 1, y: 0 });
      gsap.set(rings, { opacity: 0.35 });
      return;
    }

    gsap.set([label, titleMain, titleAccent, desc], { opacity: 0, y: 28 });
    gsap.set(tags, { opacity: 0, y: 16, scale: 0.96 });
    gsap.set(rings, { opacity: 0, scale: 0.92 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(rings, { opacity: 0.32, scale: 1, duration: 1.4, stagger: 0.08 }, 0)
      .to(label, { opacity: 1, y: 0, duration: 0.65 }, 0.15)
      .to(titleMain, { opacity: 1, y: 0, duration: 0.75 }, 0.3)
      .to(titleAccent, { opacity: 1, y: 0, duration: 0.75 }, 0.42)
      .to(desc, { opacity: 1, y: 0, duration: 0.7 }, 0.58)
      .to(tags, { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07 }, 0.72);
  }

  function initServicesHeroRings() {
    if (prefersReducedMotion || typeof gsap === 'undefined') return;
    document.querySelectorAll('.services-hero-ring').forEach((ring, i) => {
      gsap.to(ring, {
        rotation: i % 2 === 0 ? 8 : -6,
        duration: 14 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(ring, {
        x: i % 2 === 0 ? 12 : -10,
        y: i % 2 === 0 ? -8 : 10,
        duration: 10 + i * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });
  }

  function initServiceTags() {
    const tags = document.querySelectorAll('[data-service-tag]');
    if (!tags.length) return;

    tags.forEach((tag) => {
      tag.addEventListener('click', () => {
        tags.forEach((t) => t.classList.remove('is-active'));
        tag.classList.add('is-active');
      });

      if (!hasFinePointer || prefersReducedMotion || typeof gsap === 'undefined') return;

      const xTo = gsap.quickTo(tag, 'x', { duration: 0.35, ease: 'power3' });
      const yTo = gsap.quickTo(tag, 'y', { duration: 0.35, ease: 'power3' });

      tag.addEventListener('mousemove', (e) => {
        const rect = tag.getBoundingClientRect();
        xTo((e.clientX - rect.left - rect.width / 2) * 0.18);
        yTo((e.clientY - rect.top - rect.height / 2) * 0.22);
      });
      tag.addEventListener('mouseleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ── Section 2: The Solution ── */

  /**
   * Benefit explorer — left panel updates when a right-hand row is
   * hovered (desktop) or tapped (any device).
   */
  function initBenefitExplorer() {
    const items = document.querySelectorAll('.svc-benefit-item');
    if (!items.length) return;

    const panelIcon  = document.querySelector('[data-panel-icon]');
    const panelIndex = document.querySelector('[data-panel-index]');
    const panelTitle = document.querySelector('[data-panel-title]');
    const panelBody  = document.querySelector('[data-panel-body]');
    const panelBar   = document.querySelector('[data-panel-bar]');

    const BENEFITS = Array.from(items).map((el) => ({
      icon: el.dataset.icon || '',
      name: el.querySelector('.svc-benefit-name')?.textContent || '',
      body: el.dataset.body || '',
      index: el.querySelector('.svc-benefit-num')?.textContent || '',
    }));

    let activeIndex = 0;
    let isAnimating = false;

    function setPanel(idx, animate = true) {
      if (idx === activeIndex && animate) return;
      activeIndex = idx;

      const b = BENEFITS[idx];
      const pct = ((idx + 1) / BENEFITS.length) * 100;

      if (!animate || prefersReducedMotion || typeof gsap === 'undefined') {
        if (panelIcon)  panelIcon.innerHTML  = b.icon;
        if (panelIndex) panelIndex.textContent = `${b.index} / 0${BENEFITS.length}`;
        if (panelTitle) panelTitle.textContent = b.name;
        if (panelBody)  panelBody.innerHTML   = b.body;
        if (panelBar)   panelBar.style.width  = `${pct}%`;
        return;
      }

      if (isAnimating) return;
      isAnimating = true;

      const fadeOuts = [panelIndex, panelTitle, panelBody].filter(Boolean);

      gsap.to(fadeOuts, {
        opacity: 0,
        y: -10,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          if (panelIcon)  panelIcon.innerHTML  = b.icon;
          if (panelIndex) panelIndex.textContent = `${b.index} / 0${BENEFITS.length}`;
          if (panelTitle) panelTitle.textContent = b.name;
          if (panelBody)  panelBody.innerHTML   = b.body;
          if (panelBar)   panelBar.style.width  = `${pct}%`;

          gsap.fromTo(
            fadeOuts,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.38,
              ease: 'power3.out',
              onComplete: () => { isAnimating = false; },
            }
          );
        },
      });

      // Icon cross-fade
      if (panelIcon && typeof gsap !== 'undefined') {
        gsap.fromTo(panelIcon, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' });
      }
    }

    // Wire each item
    items.forEach((item, i) => {
      function activate() {
        items.forEach((el) => el.classList.remove('is-active'));
        item.classList.add('is-active');
        setPanel(i);
      }

      item.addEventListener('click', activate);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });

      if (hasFinePointer) {
        item.addEventListener('mouseenter', activate);
      }
    });

    // Bootstrap with first item
    setPanel(0, false);
  }

  /** Scroll-triggered reveal for [data-svc-reveal] blocks */
  function initScrollReveals() {
    const els = document.querySelectorAll('[data-svc-reveal]');
    if (!els.length) return;

    if (prefersReducedMotion) {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      els.forEach((el) => el.classList.add('is-revealed'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
    );

    els.forEach((el) => io.observe(el));
  }

  /** Staggered GSAP entrance for the explorer on scroll */
  function initExplorerEntrance() {
    const explorer = document.querySelector('.svc-explorer');
    if (!explorer || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (prefersReducedMotion) return;

    const panel = explorer.querySelector('.svc-explorer-panel');
    const items = explorer.querySelectorAll('.svc-benefit-item');

    gsap.from(panel, {
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: explorer, start: 'top 72%', once: true },
    });

    gsap.from(items, {
      opacity: 0,
      x: 28,
      duration: 0.55,
      stagger: 0.07,
      ease: 'power3.out',
      scrollTrigger: { trigger: explorer, start: 'top 72%', once: true },
    });
  }

  /* ── Section 3: Process timeline accordion ── */

  function initProcessAccordion() {
    const steps = document.querySelectorAll('[data-step-item]');
    const timelineFill = document.querySelector('[data-timeline-fill]');
    if (!steps.length) return;

    const useGsap = typeof gsap !== 'undefined' && !prefersReducedMotion;

    function getOpenFraction() {
      const openCount = [...steps].filter((s) => s.classList.contains('is-open')).length;
      return openCount / steps.length;
    }

    function updateTimeline() {
      const frac = getOpenFraction();
      if (!timelineFill) return;
      if (useGsap) {
        gsap.to(timelineFill, { scaleY: frac, duration: 0.55, ease: 'power3.out' });
      } else {
        timelineFill.style.transform = `scaleY(${frac})`;
      }
    }

    function openStep(step) {
      const body = step.querySelector('[data-step-body]');
      const tags = step.querySelectorAll('[data-step-tags] .svc-step-tag');
      const toggle = step.querySelector('[data-step-toggle]');
      if (!body) return;

      step.classList.add('is-open');
      toggle?.setAttribute('aria-expanded', 'true');

      if (useGsap) {
        gsap.set(body, { overflow: 'hidden' });
        gsap.to(body, {
          height: 'auto',
          duration: 0.55,
          ease: 'power3.out',
          onComplete: () => gsap.set(body, { overflow: 'visible' }),
        });
        gsap.fromTo(
          tags,
          { opacity: 0, y: 8, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.4)', delay: 0.2 }
        );
      } else {
        // CSS fallback — measure natural height
        body.style.height = 'auto';
        const h = body.offsetHeight;
        body.style.height = '0px';
        body.offsetHeight; // force reflow
        body.style.transition = 'height 0.45s ease';
        body.style.height = h + 'px';
        body.addEventListener('transitionend', () => { body.style.height = 'auto'; }, { once: true });
      }
    }

    function closeStep(step) {
      const body = step.querySelector('[data-step-body]');
      const toggle = step.querySelector('[data-step-toggle]');
      if (!body) return;

      step.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');

      if (useGsap) {
        gsap.set(body, { overflow: 'hidden' });
        gsap.to(body, { height: 0, duration: 0.42, ease: 'power3.in' });
      } else {
        const h = body.offsetHeight;
        body.style.height = h + 'px';
        body.offsetHeight;
        body.style.transition = 'height 0.42s ease';
        body.style.height = '0px';
      }
    }

    steps.forEach((step) => {
      const toggle = step.querySelector('[data-step-toggle]');
      if (!toggle) return;

      function handleToggle() {
        const isNowOpen = step.classList.contains('is-open');
        if (isNowOpen) {
          closeStep(step);
        } else {
          openStep(step);
        }
        updateTimeline();
      }

      toggle.addEventListener('click', handleToggle);
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle(); }
      });
    });

    // Bootstrap — first step already open via HTML class; set its body to auto-height
    const firstStep = steps[0];
    if (firstStep) {
      const body = firstStep.querySelector('[data-step-body]');
      if (body) body.style.height = 'auto';
    }
    updateTimeline();
  }

  function initProcessStepEntrance() {
    const steps = document.querySelectorAll('[data-step-item]');
    if (!steps.length || prefersReducedMotion || typeof gsap === 'undefined') return;

    if (typeof IntersectionObserver === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(
              entry.target,
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }
            );
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    steps.forEach((s) => {
      gsap.set(s, { opacity: 0, x: -20 });
      io.observe(s);
    });
  }

  /* ── Section 4: Stacked card cycle ── */

  function initCycleStack() {
    const cards = document.querySelectorAll('[data-cycle-card]');
    const counterNum = document.querySelector('[data-cycle-num]');
    if (!cards.length) return;

    // Use IntersectionObserver: fire when card top edge enters viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target;
          const idx = parseInt(card.dataset.cycleCard, 10) - 1;

          if (entry.isIntersecting) {
            // This card is now the "active" (topmost visible) card
            cards.forEach((c, i) => {
              c.classList.remove('is-active');
              if (i < idx) {
                c.classList.add('is-past');
              } else {
                c.classList.remove('is-past');
              }
            });
            card.classList.add('is-active');
            card.classList.remove('is-past');

            if (counterNum) {
              counterNum.textContent = String(idx + 1).padStart(2, '0');
            }
          }
        });
      },
      { threshold: 0.15, rootMargin: '-60px 0px 0px 0px' }
    );

    cards.forEach((card) => io.observe(card));

    // Mark first card active on load
    if (cards[0]) {
      cards[0].classList.add('is-active');
    }
  }

  /* ── Section 5: Farming Interventions ── */

  function initFarmingCard() {
    const card = document.querySelector('[data-farming-card]');
    if (!card || !hasFinePointer || prefersReducedMotion) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--glow-x', '-100%');
      card.style.setProperty('--glow-y', '-100%');
    });

    // Stagger practice items on scroll
    if (typeof gsap === 'undefined' || typeof IntersectionObserver === 'undefined') return;
    const items = card.querySelectorAll('[data-farming-item]');
    gsap.set(items, { opacity: 0, y: 18, scale: 0.96 });

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          gsap.to(items, {
            opacity: 1, y: 0, scale: 1,
            duration: 0.5, stagger: 0.06, ease: 'power3.out',
          });
          io.unobserve(card);
        }
      },
      { threshold: 0.15 }
    );
    io.observe(card);
  }

  /* ── Section 6: Stakeholder tabs ── */

  function initStakeholderTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    const panels = document.querySelectorAll('[data-panel]');
    const indicator = document.querySelector('.svc-tab-indicator');
    if (!tabs.length || !panels.length) return;

    const useGsap = typeof gsap !== 'undefined' && !prefersReducedMotion;

    function positionIndicator(tab) {
      if (!indicator) return;
      const tabRect = tab.getBoundingClientRect();
      const barRect = tab.parentElement.getBoundingClientRect();
      const offsetX = tabRect.left - barRect.left;

      if (useGsap) {
        gsap.to(indicator, {
          x: offsetX,
          width: tabRect.width,
          duration: 0.4,
          ease: 'power3.out',
        });
      } else {
        indicator.style.transform = `translateX(${offsetX}px)`;
        indicator.style.width = `${tabRect.width}px`;
      }
    }

    function switchPanel(key, explicitTab) {
      const currentPanel = document.querySelector('[data-panel].is-active');
      const nextPanel = document.querySelector(`[data-panel="${key}"]`);
      if (!nextPanel || currentPanel === nextPanel) return;

      // Use the explicit tab if provided, else find it by key (e.g. from select)
      const activeTab = explicitTab || document.querySelector(`[data-tab="${key}"]`);
      tabs.forEach((t) => {
        const isActive = t === activeTab;
        t.classList.toggle('is-active', isActive);
        t.setAttribute('aria-selected', String(isActive));
      });
      if (activeTab) positionIndicator(activeTab);

      if (!useGsap) {
        currentPanel?.classList.remove('is-active');
        nextPanel.classList.add('is-active');
        return;
      }

      const outCards = currentPanel?.querySelectorAll('.svc-bcard');
      const doSwitch = () => {
        currentPanel?.classList.remove('is-active');
        nextPanel.classList.add('is-active');
        const inCards = nextPanel.querySelectorAll('.svc-bcard');
        gsap.fromTo(
          inCards,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.38, stagger: 0.055, ease: 'power3.out' }
        );
      };

      if (outCards?.length) {
        gsap.to(outCards, {
          opacity: 0, y: -10, scale: 0.97,
          duration: 0.22, stagger: 0.03, ease: 'power2.in',
          onComplete: doSwitch,
        });
      } else {
        doSwitch();
      }
    }

    const mobileSelect = document.querySelector('[data-tabs-select]');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        switchPanel(tab.dataset.tab, tab);
        // Keep native select in sync with pill tabs
        if (mobileSelect) mobileSelect.value = tab.dataset.tab;
      });
    });

    // Wire up native mobile select
    if (mobileSelect) {
      mobileSelect.addEventListener('change', () => {
        switchPanel(mobileSelect.value, null);
      });
    }

    // Set initial indicator position after layout
    requestAnimationFrame(() => {
      const activeTab = document.querySelector('[data-tab].is-active');
      if (activeTab) positionIndicator(activeTab);
    });
  }

  /* ============================================================
     Section 7: Technology marquee (CSS-driven, JS for pause only)
     ============================================================ */
  function initTechMarquee() {
    // Pause on keyboard focus for accessibility
    document.querySelectorAll('.svc-marquee-wrap').forEach((wrap) => {
      wrap.addEventListener('focusin', () => {
        wrap.querySelectorAll('.svc-marquee-track').forEach((t) => {
          t.style.animationPlayState = 'paused';
        });
      });
      wrap.addEventListener('focusout', () => {
        wrap.querySelectorAll('.svc-marquee-track').forEach((t) => {
          t.style.animationPlayState = '';
        });
      });
    });
  }

  /* ============================================================
     Section 9: Expanding impact panels
     ============================================================ */
  function initImpactPanels() {
    const container = document.querySelector('[data-impact-panels]');
    if (!container) return;

    const panels = Array.from(container.querySelectorAll('[data-impact-panel]'));
    if (!panels.length) return;

    function activate(panel) {
      panels.forEach((p) => p.classList.remove('is-expanded'));
      panel.classList.add('is-expanded');
    }

    // Ensure first panel is active on load
    activate(panels[0]);

    panels.forEach((panel) => {
      panel.addEventListener('mouseenter', () => activate(panel));
      panel.addEventListener('click', () => activate(panel));

      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(panel);
        }
        // Arrow keys to navigate between panels
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const next = panels[panels.indexOf(panel) + 1];
          if (next) { activate(next); next.focus(); }
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = panels[panels.indexOf(panel) - 1];
          if (prev) { activate(prev); prev.focus(); }
        }
      });
    });

    // When mouse leaves the whole container, revert to first panel
    container.addEventListener('mouseleave', () => activate(panels[0]));

    // Scroll reveal for the header
    if (typeof IntersectionObserver !== 'undefined') {
      const header = document.querySelector('.svc-impact [data-svc-reveal]');
      if (header) {
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              header.style.opacity = '1';
              header.style.transform = 'translateY(0)';
              io.disconnect();
            }
          },
          { threshold: 0.2 }
        );
        header.style.opacity = '0';
        header.style.transform = 'translateY(24px)';
        header.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        io.observe(header);
      }
    }
  }

  function init() {
    if (document.body.dataset.page !== 'services') return;

    initServicesHeroEntrance();
    initServicesHeroRings();
    initServiceTags();
    initBenefitExplorer();
    initScrollReveals();
    initProcessAccordion();
    initCycleStack();
    initFarmingCard();
    initStakeholderTabs();
    initTechMarquee();
    initImpactPanels();

    // GSAP-dependent stuff after fonts ready
    if (typeof gsap !== 'undefined') {
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
      }
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          initExplorerEntrance();
          initProcessStepEntrance();
        });
      } else {
        initExplorerEntrance();
        initProcessStepEntrance();
      }
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
