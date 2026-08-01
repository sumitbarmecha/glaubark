/**
 * Home page interactions: scroll reveals, accordion, counters, parallax, back-to-top.
 */
(function () {
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .how-steps, .stat-card, .img-reveal-wrap');
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach((el) => observer.observe(el));
  }

  function initServicesAccordion() {
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

  function initStatCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const isDecimal = el.dataset.decimal === 'true';
      const duration = 1800;
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

  function initBannerParallax() {
    const banner = document.querySelector('[data-parallax-banner]');
    if (!banner) return;

    const bg = banner.querySelector('.what-we-do-bg');
    if (!bg) return;

    let ticking = false;

    function update() {
      const rect = banner.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      if (visible) {
        const offset = (rect.top / window.innerHeight) * 40;
        bg.style.transform = `scale(1.08) translateY(${offset * 0.3}px)`;
      }
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 600) {
          btn.classList.add('is-visible');
        } else {
          btn.classList.remove('is-visible');
        }
      },
      { passive: true }
    );

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initTestimonialSwiper() {
    const el = document.querySelector('.testimonial-swiper');
    if (!el || typeof Swiper === 'undefined') return;

    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      pagination: {
        el: '.testimonial-pagination',
        clickable: true,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 28,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 32,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40,
          allowTouchMove: false,
        },
      },
    });
  }

  window.GlaubarkHome = {
    init() {
      initScrollReveal();
      initServicesAccordion();
      initStatCounters();
      initBannerParallax();
      initBackToTop();
      initTestimonialSwiper();
    },
  };
})();
