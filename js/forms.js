/**
 * Shared form handlers — contact + newsletter (Google Sheets stub).
 * See contact.js header comment for Apps Script setup.
 */
(function () {
  const config = {
    scriptUrl: '',
    demoMode: true,
  };

  function showStatus(el, message, type) {
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden', 'is-success', 'is-error');
    el.classList.add(type === 'error' ? 'is-error' : 'is-success');
  }

  function hideStatus(el) {
    if (!el) return;
    el.classList.add('hidden');
    el.classList.remove('is-success', 'is-error');
  }

  function setSubmitting(btn, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.classList.toggle('is-loading', loading);
  }

  async function postToSheet(payload) {
    if (!config.scriptUrl) {
      if (config.demoMode) {
        await new Promise((r) => setTimeout(r, 700));
        console.info('[Glaubark forms] Demo mode — payload:', payload);
        return { ok: true };
      }
      throw new Error('Form endpoint is not configured yet.');
    }

    const res = await fetch(config.scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Network error');
    return res.json();
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const status = document.getElementById('newsletter-form-status');
    const submitBtn = form?.querySelector('[data-newsletter-submit]');
    if (!form || form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideStatus(status);

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const payload = {
        formType: 'newsletter',
        timestamp: new Date().toISOString(),
        email: String(data.get('email') || '').trim(),
      };

      setSubmitting(submitBtn, true);

      try {
        const result = await postToSheet(payload);
        if (result.ok) {
          form.reset();
          showStatus(
            status,
            config.demoMode
              ? 'Subscribed (demo mode). Connect Google Sheets to store emails.'
              : "You're on the list. Thank you!",
            'success'
          );
        } else {
          throw new Error(result.error || 'Subscription failed');
        }
      } catch (err) {
        showStatus(status, err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        setSubmitting(submitBtn, false);
      }
    });
  }

  window.GlaubarkForms = {
    config,
    postToSheet,
    showStatus,
    hideStatus,
    setSubmitting,
    initNewsletter,
  };
})();
