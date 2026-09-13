/**
 * Glaubark intro: 1.5s logo sequence, then a soft iris exit.
 * Fires `glaubark:ready` when the overlay is gone so the hero can start.
 */
(function () {
  const HOLD_MS = 1500;
  const EXIT_MS = 1100;

  const root = document.documentElement;
  const loader = document.getElementById('site-loader');

  function signalReady() {
    if (window.__glaubarkReady) return;
    window.__glaubarkReady = true;
    window.dispatchEvent(new CustomEvent('glaubark:ready'));
  }

  function removeLoader(el) {
    if (el && el.parentNode) el.remove();
  }

  if (!loader) {
    root.classList.remove('is-loading');
    signalReady();
    return;
  }

  if (root.classList.contains('loader-skip')) {
    removeLoader(loader);
    root.classList.remove('is-loading');
    signalReady();
    return;
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hold = reduced ? 200 : HOLD_MS;
  const exit = reduced ? 220 : EXIT_MS;

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function dismiss() {
    try {
      sessionStorage.setItem('glaubark-loader-seen', '1');
    } catch (e) {
      /* private mode */
    }

    root.classList.remove('is-loading');
    loader.classList.add('is-leaving');
    loader.setAttribute('aria-hidden', 'true');

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      removeLoader(loader);
      signalReady();
    };

    loader.addEventListener('transitionend', (event) => {
      if (event.target === loader) finish();
    });
    setTimeout(finish, exit);
  }

  wait(hold).then(dismiss);
})();
