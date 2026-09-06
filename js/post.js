/**
 * Blog article pages: reading progress, table-of-contents wiring,
 * scrollspy, and the back-to-top button.
 *
 * The table of contents in the markup ships with placeholder `href="#"`
 * links. Rather than hand-maintaining anchors in every article, headings
 * are slugged at runtime and the existing links are pointed at them in
 * document order.
 */
(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function scrollToTarget(el) {
    const header = document.getElementById('site-header');
    const offset = (header ? header.offsetHeight : 70) + 16;

    if (window.__glaubarkLenis) {
      window.__glaubarkLenis.scrollTo(el, { offset: -offset });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  function initProgressBar() {
    const bar = document.querySelector('.post-progress-bar');
    const article = document.querySelector('.post-body');
    if (!bar || !article) return;

    let ticking = false;

    function update() {
      ticking = false;
      const rect = article.getBoundingClientRect();
      const start = rect.top + window.scrollY;
      // Progress completes when the end of the article reaches the
      // bottom of the viewport, not when it scrolls fully past.
      const distance = Math.max(article.offsetHeight - window.innerHeight, 1);
      const scrolled = window.scrollY - start;
      const pct = Math.min(Math.max(scrolled / distance, 0), 1);
      bar.style.width = (pct * 100).toFixed(2) + '%';
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function slugify(text, fallbackIndex) {
    const slug = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60);
    return slug || 'section-' + fallbackIndex;
  }

  /** Give every article h2 a stable id and return them in document order. */
  function tagHeadings() {
    const headings = Array.from(document.querySelectorAll('.post-body h2'));
    const seen = new Set();

    headings.forEach((h, i) => {
      if (h.id) {
        seen.add(h.id);
        return;
      }
      let id = slugify(h.textContent || '', i + 1);
      let n = 2;
      while (seen.has(id)) id = slugify(h.textContent || '', i + 1) + '-' + n++;
      seen.add(id);
      h.id = id;
    });

    return headings;
  }

  function initToc(headings) {
    const links = Array.from(document.querySelectorAll('.post-toc-link'));
    if (!links.length || !headings.length) return;

    // Pair each TOC entry with the heading at the same position. TOC labels
    // are abbreviated versions of the headings, so order is the only
    // reliable correspondence.
    const pairs = [];
    links.forEach((link, i) => {
      const heading = headings[i];
      if (!heading) {
        link.closest('li')?.remove();
        return;
      }
      link.setAttribute('href', '#' + heading.id);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToTarget(heading);
      });
      pairs.push({ link, heading });
    });

    if (!pairs.length) return;

    // Scrollspy: highlight the last heading scrolled past.
    let ticking = false;

    function update() {
      ticking = false;
      const line = window.scrollY + (window.innerHeight * 0.28);
      let active = null;

      pairs.forEach((pair) => {
        const top = pair.heading.getBoundingClientRect().top + window.scrollY;
        if (top <= line) active = pair;
      });

      pairs.forEach((pair) => {
        pair.link.classList.toggle('is-active', pair === active);
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener(
      'scroll',
      () => {
        btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
      },
      { passive: true }
    );

    btn.addEventListener('click', () => {
      if (window.__glaubarkLenis) {
        window.__glaubarkLenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.post-body')) return;
    initProgressBar();
    initToc(tagHeadings());
    initBackToTop();
  });
})();
