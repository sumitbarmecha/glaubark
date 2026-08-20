/**
 * Site-wide interactions: header scroll, mobile drawer, footer accordion.
 */
(function () {
  function injectLayout() {
    const headerSlot = document.getElementById('site-header-slot');
    const footerSlot = document.getElementById('site-footer-slot');

    if (headerSlot && window.GlaubarkComponents) {
      headerSlot.outerHTML = window.GlaubarkComponents.headerHTML;
    }

    const newsletterSlot = document.getElementById('site-newsletter-slot');
    if (newsletterSlot && window.GlaubarkComponents?.newsletterHTML) {
      newsletterSlot.outerHTML = window.GlaubarkComponents.newsletterHTML;
    }

    if (footerSlot && window.GlaubarkComponents) {
      footerSlot.outerHTML = window.GlaubarkComponents.footerHTML;
    }
  }

  function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const scrollThreshold = 60;

    function updateHeader() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function initMobileDrawer() {
    const btn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('mobile-menu-close');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-overlay');

    if (!btn || !drawer || !overlay) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      overlay.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    btn.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // Mobile About sub-menu toggle
    drawer.querySelectorAll('.mobile-nav-dropdown-toggle').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        const panel = toggle.nextElementSibling;
        const icon = toggle.querySelector('.mobile-nav-dropdown-icon');
        const expanded = toggle.getAttribute('aria-expanded') === 'true';

        toggle.setAttribute('aria-expanded', String(!expanded));
        panel?.classList.toggle('hidden');
        icon?.classList.toggle('rotate-180');
      });
    });
  }

  function initFooterAccordion() {
    const items = document.querySelectorAll('[data-footer-accordion]');
    const useGSAP = typeof gsap !== 'undefined';

    items.forEach((item) => {
      const toggle = item.querySelector('.footer-accordion-toggle');
      const content = item.querySelector('.footer-accordion-content');
      const icon = item.querySelector('.footer-accordion-icon');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        // Only accordion behavior below md breakpoint
        if (window.innerWidth >= 768) return;

        const isOpen = item.classList.contains('is-open');

        items.forEach((other) => {
          if (other === item) return;
          other.classList.remove('is-open');
          other.querySelector('.footer-accordion-toggle')?.setAttribute('aria-expanded', 'false');
          if (useGSAP) {
            const otherContent = other.querySelector('.footer-accordion-content');
            const otherIcon = other.querySelector('.footer-accordion-icon');
            if (otherContent) gsap.to(otherContent, { height: 0, duration: 0.45, ease: 'power3.inOut' });
            if (otherIcon) gsap.to(otherIcon, { rotate: 0, duration: 0.4, ease: 'power3.out' });
          }
        });

        if (!isOpen) {
          item.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
          if (useGSAP && content) {
            gsap.to(content, { height: 'auto', duration: 0.5, ease: 'power3.inOut' });
            if (icon) gsap.to(icon, { rotate: 180, duration: 0.5, ease: 'back.out(2)' });
          }
        } else {
          item.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          if (useGSAP && content) {
            gsap.to(content, { height: 0, duration: 0.45, ease: 'power3.inOut' });
            if (icon) gsap.to(icon, { rotate: 0, duration: 0.4, ease: 'power3.out' });
          }
        }
      });
    });
  }

  /** Single-open accordion toggle for any [data-services-accordion] group, site-wide
      (used by the homepage services list and the About page's differentiators list). */
  function initAccordionToggle() {
    const items = document.querySelectorAll('[data-services-accordion]');
    if (!items.length) return;

    items.forEach((item) => {
      const toggle = item.querySelector('.services-accordion-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');

        items.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.services-accordion-toggle')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /** Count-up animation for any [data-count] element, site-wide (not just the homepage). */
  function initStatCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isDecimal = el.dataset.decimal === 'true';
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const value = target * eased;

        if (isDecimal) {
          el.textContent = prefix + value.toFixed(1) + suffix;
        } else if (target >= 1000) {
          el.textContent = prefix + Math.floor(value).toLocaleString() + suffix;
        } else {
          el.textContent = prefix + Math.floor(value) + suffix;
        }

        if (progress < 1) requestAnimationFrame(tick);
        else {
          if (isDecimal) el.textContent = prefix + target + suffix;
          else el.textContent = prefix + (target >= 1000 ? target.toLocaleString() : target) + suffix;
        }
      }

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
  }

  function initCarousel() {
    const el = document.querySelector('.carousel-swiper');
    if (!el || typeof Swiper === 'undefined') return;

    new Swiper('.carousel-swiper', {
      slidesPerView: 1.12,
      spaceBetween: 16,
      loop: true,
      loopAdditionalSlides: 8,
      speed: 700,
      grabCursor: true,
      watchOverflow: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        640: { slidesPerView: 1.35, spaceBetween: 18 },
        768: { slidesPerView: 2.1, spaceBetween: 20 },
        1024: { slidesPerView: 2.6, spaceBetween: 24 },
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectLayout();
    initHeaderScroll();
    initMobileDrawer();
    initFooterAccordion();
    initCarousel();
    initAccordionToggle();
    initStatCounters();

    if (window.GlaubarkForms) {
      window.GlaubarkForms.initNewsletter();
    }

    if (window.GlaubarkHome) {
      window.GlaubarkHome.init();
    }

    if (window.GlaubarkAnimations) {
      window.GlaubarkAnimations.init();
    }
  });
})();
