/**
 * Contact page — form submission stub for Google Sheets via Apps Script.
 *
 * SETUP (one-time):
 * 1. Create a Google Sheet with tabs "Contact" and "Newsletter".
 * 2. Contact columns (row 1): timestamp | fullName | email | subject | message
 * 3. Newsletter columns (row 1): timestamp | email
 * 4. Extensions → Apps Script → paste the script below → Deploy → New deployment
 *    → type "Web app" → Execute as "Me" → Who has access "Anyone".
 * 5. Copy the deployment URL into js/forms.js → config.scriptUrl
 *
 * --- Google Apps Script (Code.gs) ---
 *
 * const CONTACT_SHEET = 'Contact';
 * const NEWSLETTER_SHEET = 'Newsletter';
 *
 * function doPost(e) {
 *   try {
 *     const body = JSON.parse(e.postData.contents);
 *     const ss = SpreadsheetApp.getActiveSpreadsheet();
 *
 *     if (body.formType === 'newsletter') {
 *       ss.getSheetByName(NEWSLETTER_SHEET).appendRow([
 *         body.timestamp || new Date().toISOString(),
 *         body.email || '',
 *       ]);
 *     } else {
 *       ss.getSheetByName(CONTACT_SHEET).appendRow([
 *         body.timestamp || new Date().toISOString(),
 *         body.fullName || '',
 *         body.email || '',
 *         body.subject || '',
 *         body.message || '',
 *       ]);
 *     }
 *
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ ok: true }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   } catch (err) {
 *     return ContentService
 *       .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
 *       .setMimeType(ContentService.MimeType.JSON);
 *   }
 * }
 *
 * function doGet() {
 *   return ContentService.createTextOutput('Glaubark form endpoint');
 * }
 */
(function () {
  function initContactForm() {
    const forms = window.GlaubarkForms;
    if (!forms) return;

    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-form-status');
    const submitBtn = form?.querySelector('[data-contact-submit]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      forms.hideStatus(status);

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
      };

      forms.setSubmitting(submitBtn, true);

      try {
        const result = await forms.postToSheet(payload);
        if (result.ok) {
          form.reset();
          forms.showStatus(
            status,
            forms.config.demoMode
              ? 'Message saved (demo mode). Connect Google Sheets to store submissions.'
              : 'Thank you — your message has been sent.',
            'success'
          );
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      } catch (err) {
        forms.showStatus(status, err.message || 'Something went wrong. Please try again.', 'error');
      } finally {
        forms.setSubmitting(submitBtn, false);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page !== 'contact') return;
    initContactForm();
  });
})();
