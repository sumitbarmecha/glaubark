/**
 * Glaubark Solutions — website forms → Google Sheet
 *
 * Bind this script to the spreadsheet that has tabs "Contact" and "Newsletter".
 * Full setup: GOOGLE-SHEETS-FORMS.md
 */

var CONTACT_SHEET = 'Contact';
var NEWSLETTER_SHEET = 'Newsletter';

var CONTACT_HEADERS = [
  'Timestamp',
  'Full name',
  'Email',
  'I am a',
  'Subject',
  'Message',
  'Page',
];

var NEWSLETTER_HEADERS = [
  'Timestamp',
  'Email',
  'Page',
  'Source',
];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    if (body.formType === 'newsletter') {
      appendNewsletter_(ss, body);
    } else if (body.formType === 'contact') {
      appendContact_(ss, body);
    } else {
      return json_({ ok: false, error: 'Unknown form type' });
    }

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return ContentService.createTextOutput('Glaubark form endpoint is live.');
}

function appendContact_(ss, body) {
  var sheet = getOrCreateSheet_(ss, CONTACT_SHEET, CONTACT_HEADERS);
  sheet.appendRow([
    body.timestamp || new Date().toISOString(),
    body.fullName || '',
    body.email || '',
    body.contactType || '',
    body.subject || '',
    body.message || '',
    body.page || '',
  ]);
}

function appendNewsletter_(ss, body) {
  var sheet = getOrCreateSheet_(ss, NEWSLETTER_SHEET, NEWSLETTER_HEADERS);
  var email = String(body.email || '').trim().toLowerCase();
  var last = sheet.getLastRow();

  if (email && last >= 2) {
    var existing = sheet.getRange(2, 2, last - 1, 1).getValues();
    for (var i = 0; i < existing.length; i++) {
      if (String(existing[i][0]).trim().toLowerCase() === email) {
        sheet.getRange(i + 2, 1).setValue(body.timestamp || new Date().toISOString());
        sheet.getRange(i + 2, 3).setValue(body.page || '');
        sheet.getRange(i + 2, 4).setValue(body.source || '');
        return;
      }
    }
  }

  sheet.appendRow([
    body.timestamp || new Date().toISOString(),
    body.email || '',
    body.page || '',
    body.source || '',
  ]);
}

function getOrCreateSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
