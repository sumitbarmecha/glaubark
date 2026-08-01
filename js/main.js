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

    items.forEach((item) => {
      const toggle = item.querySelector('.footer-accordion-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        // Only accordion behavior below md breakpoint
        if (window.innerWidth >= 768) return;

        const isOpen = item.classList.contains('is-open');

        items.forEach((other) => {
          other.classList.remove('is-open');
          other.querySelector('.footer-accordion-toggle')?.setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initCarousel() {
    const el = document.querySelector('.carousel-swiper');
    if (!el || typeof Swiper === 'undefined') return;

    new Swiper('.carousel-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 16,
      loop: true,
      loopAdditionalSlides: 3,
      speed: 700,
      grabCursor: true,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      breakpoints: {
        0: { spaceBetween: 12 },
        768: { spaceBetween: 16 },
        1024: { spaceBetween: 20 },
      },
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    injectLayout();
    initHeaderScroll();
    initMobileDrawer();
    initFooterAccordion();
    initCarousel();

    if (window.GlaubarkHome) {
      window.GlaubarkHome.init();
    }
  });
})();
