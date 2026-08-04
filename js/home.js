/**
 * Home page interactions: back-to-top, testimonial Swiper.
 * (Stat counters and the accordion toggle now live in js/main.js since
 * they're reused site-wide, e.g. the About page's differentiators list.)
 */
(function () {
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
      if (window.__glaubarkLenis) {
        window.__glaubarkLenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  function initTestimonialSwiper() {
    const el = document.querySelector('.testimonial-swiper');
    if (!el || typeof Swiper === 'undefined') return;

    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      autoplay: {
        delay: 4200,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
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
          autoplay: false,
          loop: false,
        },
      },
    });
  }

  window.GlaubarkHome = {
    init() {
      initBackToTop();
      initTestimonialSwiper();
    },
  };
})();
