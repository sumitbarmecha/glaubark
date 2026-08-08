/**
 * Home page interactions: back-to-top, testimonial Swiper, "In Action"
 * hover-to-expand video gallery.
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

  /**
   * "In Action" gallery: first panel is expanded and playing by default.
   * Hovering (or tapping/focusing, for touch and keyboard users) another
   * panel expands it and starts its video; the rest collapse back to their
   * still poster image. Leaving the whole gallery returns to the first panel.
   */
  function initVideoGallery() {
    const gallery = document.querySelector('[data-video-gallery]');
    if (!gallery) return;

    const items = Array.from(gallery.querySelectorAll('[data-video-item]'));
    if (!items.length) return;

    function setActive(target) {
      items.forEach((item) => {
        const isTarget = item === target;
        const video = item.querySelector('video');

        item.classList.toggle('is-active', isTarget);

        if (!video) return;

        if (isTarget) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      });
    }

    items.forEach((item) => {
      item.addEventListener('mouseenter', () => setActive(item));
      item.addEventListener('focus', () => setActive(item));
      item.addEventListener('click', () => setActive(item));
    });

    gallery.addEventListener('mouseleave', () => setActive(items[0]));

    // Kick off the first (default-active) video once it's ready to play.
    const firstVideo = items[0].querySelector('video');
    if (firstVideo) {
      firstVideo.addEventListener('loadeddata', () => firstVideo.play().catch(() => {}), { once: true });
      firstVideo.play().catch(() => {});
    }
  }

  window.GlaubarkHome = {
    init() {
      initBackToTop();
      initTestimonialSwiper();
      initVideoGallery();
    },
  };
})();
