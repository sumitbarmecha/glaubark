/**
 * Glaubark forms — contact + newsletter → Google Apps Script → one spreadsheet.
 *
 * 1. Follow GOOGLE-SHEETS-FORMS.md
 * 2. Paste the Web app URL below
 * 3. Redeploy the site
 */
(function () {
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxZ91Wj-BW3rpwYpHXgaLOc7CviaxtGyYjTtLq5UTTDTyv8GQNNh7YNg0mvlH41BscBQQ/exec';

  const config = {
    get scriptUrl() {
      return SCRIPT_URL;
    },
    get demoMode() {
      return !SCRIPT_URL;
    },
  };

  function showToast(message, type) {
    var el = document.getElementById('form-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'form-toast';
      el.className = 'form-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = '<span class="form-toast-icon" aria-hidden="true"></span><p class="form-toast-msg"></p>';
      document.body.appendChild(el);
    }

    el.classList.remove('is-success', 'is-error', 'is-visible');
    el.classList.add(type === 'error' ? 'is-error' : 'is-success');
    var msg = el.querySelector('.form-toast-msg');
    if (msg) msg.textContent = message;

    requestAnimationFrame(function () {
      el.classList.add('is-visible');
    });

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      el.classList.remove('is-visible');
    }, 4500);
  }

  function setSubmitting(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle('is-loading', loading);
    btn.setAttribute('aria-busy', loading ? 'true' : 'false');
  }

  async function postToSheet(payload) {
    if (!SCRIPT_URL) {
      await new Promise((r) => setTimeout(r, 500));
      console.warn('[Glaubark forms] SCRIPT_URL is empty — demo only. See GOOGLE-SHEETS-FORMS.md');
      console.info('[Glaubark forms] payload:', payload);
      return { ok: true, demo: true };
    }

    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Could not reach the form endpoint.');

    let data;
    try {
      data = await res.json();
    } catch (err) {
      throw new Error('Unexpected response from the form endpoint.');
    }

    if (!data || data.ok !== true) {
      throw new Error((data && data.error) || 'Submission failed.');
    }

    return data;
  }

  function bindNewsletterForm(form) {
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    const submitBtn = form.querySelector('[data-newsletter-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const payload = {
        formType: 'newsletter',
        timestamp: new Date().toISOString(),
        email: String(data.get('email') || '').trim(),
        page: window.location.pathname || '',
        source: form.id || 'newsletter',
      };

      setSubmitting(submitBtn, true);

      try {
        const result = await postToSheet(payload);
        form.reset();
        showToast(
          result.demo
            ? 'Subscribed (demo). Add the Apps Script URL in js/forms.js to save emails.'
            : "You're on the list. Thank you!",
          'success'
        );
      } catch (err) {
        showToast(err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        setSubmitting(submitBtn, false);
      }
    });
  }

  function bindContactForm(form) {
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    const submitBtn = form.querySelector('[data-contact-submit]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const payload = {
        formType: 'contact',
        timestamp: new Date().toISOString(),
        fullName: String(data.get('fullName') || '').trim(),
        email: String(data.get('email') || '').trim(),
        contactType: String(data.get('contactType') || '').trim(),
        subject: String(data.get('subject') || '').trim(),
        message: String(data.get('message') || '').trim(),
        page: window.location.pathname || '',
      };

      setSubmitting(submitBtn, true);

      try {
        const result = await postToSheet(payload);
        form.reset();
        showToast(
          result.demo
            ? 'Message saved (demo). Add the Apps Script URL in js/forms.js to store it.'
            : 'Thank you — your message has been sent.',
          'success'
        );
      } catch (err) {
        showToast(err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        setSubmitting(submitBtn, false);
      }
    });
  }

  function initNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach(bindNewsletterForm);
  }

  function initContact() {
    const form = document.getElementById('contact-form');
    if (form) bindContactForm(form);
  }

  window.GlaubarkForms = {
    config,
    postToSheet,
    showToast,
    setSubmitting,
    initNewsletter,
    initContact,
  };
})();
