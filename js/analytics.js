./**
 * Glaubark GA4 — one file for every public page.
 *
 * 1. Create a GA4 property (see GA4.md)
 * 2. Paste the Measurement ID below (G-XXXXXXXX)
 * 3. In GA4 Admin, mark generate_lead as a conversion
 *
 * Tracks:
 *   page_view          — automatic on load
 *   cta_click          — Contact / Get in touch / mailto / LinkedIn / tagged CTAs
 *   generate_lead      — successful contact or newsletter submit
 */
(function () {
  const MEASUREMENT_ID = 'G-HQNR5VKTM7';

  function isConfigured() {
    return /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) && MEASUREMENT_ID !== 'G-XXXXXXXXXX';
  }

  function pageName() {
    const path = (location.pathname || '').replace(/\\/g, '/');
    const file = path.split('/').pop() || 'index.html';
    if (!file || file === 'html') return 'home';
    return file.replace(/\.html$/i, '') || 'home';
  }

  const queue = [];

  function send(name, params) {
    const payload = Object.assign(
      {
        page_name: pageName(),
        page_path: location.pathname || '/',
      },
      params || {}
    );

    if (typeof window.gtag === 'function' && isConfigured()) {
      window.gtag('event', name, payload);
      return;
    }

    queue.push({ name: name, params: payload });
  }

  function flush() {
    if (typeof window.gtag !== 'function') return;
    while (queue.length) {
      const item = queue.shift();
      window.gtag('event', item.name, item.params);
    }
  }

  function loadGtag() {
    if (!isConfigured()) {
      console.info('[Glaubark analytics] Paste your GA4 Measurement ID in js/analytics.js');
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true,
      page_title: document.title,
      page_location: location.href,
      page_path: location.pathname || '/',
    });

    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    s.onload = flush;
    document.head.appendChild(s);
  }

  function textOf(el) {
    return (el.getAttribute('aria-label') || el.textContent || '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 80);
  }

  function placementOf(el) {
    if (el.closest('#site-header, .site-header, #mobile-drawer')) return 'header';
    if (el.closest('.site-footer, footer')) return 'footer';
    if (el.closest('#contact-form, [data-newsletter-form]')) return 'form';
    return 'page';
  }

  function isCta(el) {
    if (!el || el.closest('[data-ga-ignore]')) return false;
    if (el.hasAttribute('data-ga-cta')) return true;
    if (el.matches('a.c-btn, a.h2-cta-dark, a.h2-btn-primary, a.h2-btn-outline, a.post-sidebar-cta-btn, a.svc-outcome-link')) {
      return true;
    }
    const href = (el.getAttribute('href') || '').trim();
    if (/contact\.html/i.test(href)) return true;
    if (/^mailto:/i.test(href)) return true;
    if (/linkedin\.com/i.test(href)) return true;
    return false;
  }

  function bindCtas() {
    document.addEventListener(
      'click',
      function (e) {
        const el = e.target.closest('a, button');
        if (!el || !isCta(el)) return;
        if (el.matches('[type="submit"], [data-contact-submit], [data-newsletter-submit]')) return;

        const href = el.getAttribute('href') || '';
        send('cta_click', {
          cta_name: el.getAttribute('data-ga-cta') || textOf(el) || 'cta',
          cta_text: textOf(el),
          cta_placement: placementOf(el),
          link_url: href ? new URL(href, location.href).href : '',
          outbound: /^(https?:|mailto:)/i.test(href) && !href.includes(location.host) ? 'true' : 'false',
        });
      },
      true
    );
  }

  function formSuccess(detail) {
    const formType = (detail && detail.formType) || 'unknown';
    send('generate_lead', {
      lead_source: formType === 'newsletter' ? 'newsletter' : 'contact_form',
      form_id: (detail && detail.formId) || formType,
      form_name: formType,
      contact_type: (detail && detail.contactType) || undefined,
    });
    send('form_submit', {
      form_id: (detail && detail.formId) || formType,
      form_name: formType,
    });
  }

  loadGtag();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindCtas);
  } else {
    bindCtas();
  }

  window.GlaubarkAnalytics = {
    measurementId: MEASUREMENT_ID,
    event: send,
    formSuccess: formSuccess,
    pageName: pageName,
  };
})();
