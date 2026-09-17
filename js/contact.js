/**
 * Contact page form — uses the shared Google Sheets helper in js/forms.js.
 * Setup: GOOGLE-SHEETS-FORMS.md
 */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'contact') return;
    if (window.GlaubarkForms) window.GlaubarkForms.initContact();
  });
})();
