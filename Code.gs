/**
 * KOA Profiling Picture — Google Sheet backend.
 *
 * Setup: Extensions > Apps Script inside your Google Sheet, paste this in,
 * then Deploy > New deployment > Web app
 *   Execute as:  Me
 *   Who has access:  Anyone
 * Copy the /exec URL into ENDPOINT in index.html.
 *
 * Pictures are stored PRIVATELY in your Drive. Nobody can open them without
 * being signed in to an account you have shared the folder with.
 */

var SHEET_NAME  = 'Submissions';
var FOLDER_NAME = '2x2 Photos';
var THUMB_PX    = 104;    // row height for the preview column

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // two members submitting at the same second must not land on the same row
    lock.waitLock(30000);

    var data = JSON.parse(e.postData.contents);
    var fields = data.fields || {};
    var folder = getFolder_();

    var blob = Utilities.newBlob(
      Utilities.base64Decode(String(data.photo).split(',')[1]),
      'image/jpeg',
      uniqueName_(folder, data.filename || (Date.now() + '.jpg'))
    );
    var file = folder.createFile(blob);
    // no setSharing call: the file stays private to this Drive account

    var sheet = getSheet_();
    var labels = Object.keys(fields);

    if (sheet.getLastRow() === 0) {
      var header = ['Submitted', 'Preview'].concat(labels).concat(['Approved', 'Photo', 'File ID']);
      sheet.appendRow(header);
      sheet.getRange(1, 1, 1, header.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(2, THUMB_PX + 8);
    }

    var head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var row = head.map(function (col) {
      if (col === 'Submitted') return new Date();
      if (col === 'Photo')     return file.getUrl();
      if (col === 'File ID')   return file.getId();
      if (col === 'Preview' || col === 'Approved') return '';
      return fields[col] !== undefined ? fields[col] : '';
    });
    sheet.appendRow(row);

    var r = sheet.getLastRow();
    var approvedCol = head.indexOf('Approved') + 1;
    if (approvedCol) sheet.getRange(r, approvedCol).insertCheckboxes();

    // drop the thumbnail into the Preview column so officers can scan faces
    var previewCol = head.indexOf('Preview') + 1;
    if (previewCol && data.thumb) {
      try {
        var thumb = Utilities.newBlob(
          Utilities.base64Decode(String(data.thumb).split(',')[1]), 'image/jpeg', 'thumb.jpg');
        sheet.setRowHeight(r, THUMB_PX + 8);
        sheet.insertImage(thumb, previewCol, r, 4, 4);
      } catch (ignore) {}
    }

    SpreadsheetApp.flush();
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return json_({ ok: true, message: 'Endpoint is live. Post submissions here.' });
}

/**
 * Builds a printable Google Doc: every picture at exactly 2x2 inches,
 * three to a row, last name underneath. Ticked rows only, or all rows
 * if nothing is ticked yet.
 */
function makePrintSheet() {
  var sheet = getSheet_();
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) throw new Error('No submissions yet.');

  var head = values[0];
  var idCol   = head.indexOf('File ID');
  var okCol   = head.indexOf('Approved');
  var nameCol = head.indexOf('Last name');
  if (idCol < 0) throw new Error('No "File ID" column. Delete row 1 and let the next submission rebuild it.');

  var rows = values.slice(1).filter(function (r) { return r[idCol]; });
  var ticked = rows.filter(function (r) { return okCol >= 0 && r[okCol] === true; });
  var use = ticked.length ? ticked : rows;

  var doc = DocumentApp.create('KOA Profiling Pictures — ' +
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
  var body = doc.getBody();
  body.setMarginTop(36).setMarginBottom(36).setMarginLeft(36).setMarginRight(36);

  var title = body.appendParagraph('KOA Profiling Pictures');
  title.setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(use.length + ' picture' + (use.length === 1 ? '' : 's') +
    (ticked.length ? ' (approved only)' : ' (all submissions, none ticked yet)'))
    .setForegroundColor('#5c6780');

  var PER_ROW = 3, cells = [];
  for (var i = 0; i < use.length; i += PER_ROW) {
    cells.push(use.slice(i, i + PER_ROW).map(function () { return ''; }));
  }
  if (!cells.length) throw new Error('Nothing to print.');

  var table = body.appendTable(cells);
  table.setBorderWidth(0);

  var n = 0;
  for (var r = 0; r < table.getNumRows(); r++) {
    var tr = table.getRow(r);
    for (var c = 0; c < tr.getNumCells(); c++) {
      var rec = use[n++];
      var cell = tr.getCell(c);
      cell.setPaddingTop(6).setPaddingBottom(6).setPaddingLeft(6).setPaddingRight(6);
      var p = cell.getChild(0).asParagraph();
      p.setText('');
      try {
        var img = p.appendInlineImage(DriveApp.getFileById(rec[idCol]).getBlob());
        img.setWidth(144).setHeight(144);       // 144 pt = exactly 2 inches
      } catch (e) {
        p.setText('[missing file]');
      }
      var cap = cell.appendParagraph(nameCol >= 0 ? String(rec[nameCol]) : '');
      cap.setFontSize(9).setForegroundColor('#5c6780');
    }
  }

  doc.saveAndClose();
  var url = doc.getUrl();
  try {
    SpreadsheetApp.getUi().alert('Print sheet ready', url, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (noUi) {}
  return url;
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('KOA')
    .addItem('Make print sheet', 'makePrintSheet')
    .addToUi();
}

/** SENILLO.jpg, then SENILLO-2.jpg for anyone with the same last name */
function uniqueName_(folder, name) {
  var dot = name.lastIndexOf('.');
  var stem = dot > 0 ? name.substring(0, dot) : name;
  var ext = dot > 0 ? name.substring(dot) : '';
  var candidate = stem + ext, n = 1;
  while (folder.getFilesByName(candidate).hasNext()) {
    n++;
    candidate = stem + '-' + n + ext;
  }
  return candidate;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function getFolder_() {
  var found = DriveApp.getFoldersByName(FOLDER_NAME);
  return found.hasNext() ? found.next() : DriveApp.createFolder(FOLDER_NAME);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
