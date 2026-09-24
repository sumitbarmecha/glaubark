# GA4 setup — Glaubark website

This static site uses **Google Analytics 4** (gtag), not Google Tag Manager. One script (`js/analytics.js`) runs on every public page.

## What you get

| Event | When it fires | Use it for |
|---|---|---|
| `page_view` | Every page load | Traffic by page (Home, About, Services, Contact…) |
| `cta_click` | Contact / Get in touch / mailto / LinkedIn / tagged buttons | Which CTAs people actually press |
| `generate_lead` | Contact or newsletter **succeeds** (not invalid submits) | Primary conversion |
| `form_submit` | Same successful submits, with `form_name` | Contact vs newsletter split |

`cta_click` parameters: `cta_name`, `cta_text`, `cta_placement` (`header` / `footer` / `page` / `form`), `link_url`, `page_name`.

`generate_lead` parameters: `lead_source` (`contact_form` / `newsletter`), `form_id`, `contact_type` (farmer, buyer, etc. when sent).

Forms use `preventDefault`, so GA4’s built-in “form submissions” enhanced-measurement toggle **will not** see them. The events above are sent from `js/forms.js` after a successful Apps Script response.

## 1. Create the GA4 property

1. Open [Google Analytics](https://analytics.google.com/).
2. Admin → **Create property** → Google Analytics 4.
3. Property name: `Glaubark website`. Time zone: India. Currency: INR.
4. Add a **Web** data stream with the live site URL (for example `https://glaubark.com`).
5. Copy the **Measurement ID** (`G-` followed by letters/numbers).

## 2. Paste the ID into the site

Open `js/analytics.js` and replace:

```
const MEASUREMENT_ID = 'G-XXXXXXXXXX';
```

with your ID. Until that is a real `G-` value, the script does not load Google’s tag.

Redeploy / refresh the site.

## 3. Turn on the right reports in GA4

Admin → Data streams → your web stream → **Enhanced measurement**: keep **page views**, **scrolls**, and **outbound clicks** on. You can leave “form interactions” on, but trust `generate_lead` for this site.

Admin → Events:

- Mark **`generate_lead`** as a **conversion**.
- Optionally mark **`cta_click`** as a conversion if you want button-level conversion counts (noisier than form success).

Admin → Custom definitions (optional, for cleaner reports):

- Event-scoped: `page_name`, `cta_placement`, `lead_source`, `contact_type`.

## 4. Check it is working

1. Open the live site with `?` still optional.
2. In GA4: **Admin → DebugView**, or Reports → Realtime.
3. Load Home, open Contact, click a CTA, submit the contact form (or newsletter).
4. You should see `page_view`, `cta_click`, then `generate_lead` / `form_submit`.

Chrome: [Google Analytics Debugger](https://chromewebstore.google.com/detail/google-analytics-debugger) extension helps.

## 5. What not to do

- Do not add a second gtag snippet or a GTM container on top of this unless you migrate fully to GTM.
- Do not fire `generate_lead` on button click — only on successful submit (already implemented).
- Do not send names, emails, or message text to GA4 (we do not).

## Privacy

The Privacy Policy cookies section notes Analytics. Google’s tag is loaded from `googletagmanager.com` / `google-analytics.com`. IP anonymization is on in `js/analytics.js`.
