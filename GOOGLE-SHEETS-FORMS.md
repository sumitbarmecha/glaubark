# Glaubark website forms → Google Sheets

One Google spreadsheet stores both site forms:

| Form       | Where it lives on the site                      | Spreadsheet tab |
| ---------- | ----------------------------------------------- | --------------- |
| Contact us | `contact.html`                                  | **Contact**     |
| Newsletter | Footer on every page, plus the newsletter block | **Newsletter**  |

The site posts JSON to a Google Apps Script web app. The script appends a row. No server or database is required.

---

## 1. Create the spreadsheet

1. Open [Google Sheets](https://sheets.google.com) and create a blank spreadsheet.
2. Name it something like **Glaubark website forms**.
3. Rename the first tab to `Contact`.
4. Add a second tab named `Newsletter` (**Insert → Sheet**, then rename).
5. In **Contact**, row 1:

   `Timestamp` | `Full name` | `Email` | `I am a` | `Subject` | `Message` | `Page`

6. In **Newsletter**, row 1:

   `Timestamp` | `Email` | `Page` | `Source`

Tab names must match exactly: `Contact` and `Newsletter`.  
If the headers are missing, the script will write them the first time a form is submitted.

---

## 2. Paste the Apps Script

1. In the spreadsheet: **Extensions → Apps Script**.
2. Delete any placeholder code in `Code.gs`.
3. Paste the full script from `apps-script/Code.gs` in this repo (also copied below).
4. Click **Save** (disk icon). Name the project **Glaubark forms**.

### `Code.gs`

```javascript
/**
 * Glaubark Solutions — website forms → Google Sheet
 *
 * Bind this script to the spreadsheet that has tabs "Contact" and "Newsletter".
 */

var CONTACT_SHEET = "Contact";
var NEWSLETTER_SHEET = "Newsletter";

var CONTACT_HEADERS = [
  "Timestamp",
  "Full name",
  "Email",
  "I am a",
  "Subject",
  "Message",
  "Page",
];

var NEWSLETTER_HEADERS = ["Timestamp", "Email", "Page", "Source"];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (body.formType === "newsletter") {
      appendNewsletter_(ss, body);
    } else if (body.formType === "contact") {
      appendContact_(ss, body);
    } else {
      return json_({ ok: false, error: "Unknown form type" });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput("Glaubark form endpoint is live.");
}

function appendContact_(ss, body) {
  var sheet = getOrCreateSheet_(ss, CONTACT_SHEET, CONTACT_HEADERS);
  sheet.appendRow([
    body.timestamp || new Date().toISOString(),
    body.fullName || "",
    body.email || "",
    body.contactType || "",
    body.subject || "",
    body.message || "",
    body.page || "",
  ]);
}

function appendNewsletter_(ss, body) {
  var sheet = getOrCreateSheet_(ss, NEWSLETTER_SHEET, NEWSLETTER_HEADERS);
  var email = String(body.email || "")
    .trim()
    .toLowerCase();
  var last = sheet.getLastRow();

  if (email && last >= 2) {
    var existing = sheet.getRange(2, 2, last - 1, 1).getValues();
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i][0]).trim().toLowerCase() === email) {
        sheet
          .getRange(i + 2, 1)
          .setValue(body.timestamp || new Date().toISOString());
        sheet.getRange(i + 2, 3).setValue(body.page || "");
        sheet.getRange(i + 2, 4).setValue(body.source || "");
        return;
      }
    }
  }

  sheet.appendRow([
    body.timestamp || new Date().toISOString(),
    body.email || "",
    body.page || "",
    body.source || "",
  ]);
}

function getOrCreateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
```

---

## 3. Deploy as a web app

1. In Apps Script: **Deploy → New deployment**.
2. Click the gear next to **Select type** → **Web app**.
3. Fill in:
   - **Description:** `Glaubark site forms`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. Click **Deploy**.
5. Sign in and click **Allow** when Google asks for spreadsheet permission.
6. Copy the **Web app URL**. It looks like:

   `https://script.google.com/macros/s/AKfycb.../exec`

If you later edit `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → New version → Deploy**. A new URL is not always created; using “New version” on the same deployment keeps the same URL.

---

## 4. Connect the website

Open `js/forms.js` and paste the Web app URL:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";
```

Leave it as `''` only while you are still testing locally without Sheets. An empty URL runs **demo mode** (success message, nothing saved).

The site already sends:

**Contact** (`formType: "contact"`)

- timestamp, fullName, email, contactType, subject, message, page

**Newsletter** (`formType: "newsletter"`)

- timestamp, email, page, source (`newsletter-form` or `footer-newsletter-form`)

The same newsletter handler runs on every page that includes the footer.

---

## 5. Test

1. Open `contact.html`, send a test message. Check the **Contact** tab.
2. Submit an email in the footer newsletter. Check the **Newsletter** tab.
3. Submit the same newsletter email again — the script updates that row instead of duplicating it.

---

## Troubleshooting

| What you see                        | What to check                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| Demo success message, empty sheet   | `SCRIPT_URL` in `js/forms.js` is still empty                                       |
| “Could not reach the form endpoint” | URL is wrong, or the deployment is not “Anyone”                                    |
| CORS / blocked request              | Keep posting as `text/plain` (already set). Do not change it to `application/json` |
| Script runs but no row              | Tab names must be `Contact` / `Newsletter`. Redeploy after code changes            |
| Permission error on first submit    | Open the Web app URL in a browser once, approve access, then retry the form        |

---

## Privacy note

The spreadsheet is only as private as the Google account that owns it. Restrict sharing on the Sheet itself. The Web app URL should stay in `js/forms.js` (the site needs it); it can receive submissions but should not be able to read the sheet back in the browser.
