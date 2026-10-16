// ════════════════════════════════════════════════════════════════════════════
// CMD Notes — Apps Script backend (Google Sheet = database)
// Sheet columns (row 1 header):  cmds | category | purpose | example
// Every tab (Windows, Linux, CCNA_CCNP, Others, Troubleshooting, …) is read automatically.
//
// DEPLOY:  Deploy → New deployment → type "Web app"
//          Execute as: Me   ·   Who has access: Anyone
//          After ANY code change:  Deploy → Manage deployments → ✏️ → Version: New version → Deploy
// ════════════════════════════════════════════════════════════════════════════

var SHEET_ID = "1ekY7Oxnt4i1Y-gRgvx09ytQ6y1JCXxOkaDK2UBG_V-w";

// Optional edit password. "" = anyone who has the app link can add/edit/delete.
// Set e.g. "mySecret123" to make the app read-only until the password is entered.
var EDIT_KEY = "";

var APP_NAME = "CMD Notes";
var FIELDS   = ["cmd", "category", "purpose", "example"];
var ALIASES  = {
  cmd:      ["cmds", "cmd", "command", "commands"],
  category: ["category", "cat"],
  purpose:  ["purpose", "description", "use", "usage"],
  example:  ["example", "examples", "sample"]
};
var MAX_LEN = 4000;

// ── Entry points ────────────────────────────────────────────────────────────
function doGet(e) {
  // Health check: open the /exec URL in a browser — you should see {"ok":true,...}
  try {
    return json_({ ok: true, app: APP_NAME, tabs: tabs_(open_()).map(function (s) { return s.getName(); }) });
  } catch (err) {
    return json_({ ok: false, error: msg_(err) });
  }
}

function doPost(e) {
  var res;
  try {
    var req = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    res = route_(req);
  } catch (err) {
    res = { ok: false, error: msg_(err) };
  }
  return json_(res);
}

function route_(req) {
  switch (req.action) {
    case "list":     return list_();
    case "checkKey": return { ok: !EDIT_KEY || String(req.key || "") === EDIT_KEY };
    case "add":      return locked_(req, add_);
    case "update":   return locked_(req, update_);
    case "delete":   return locked_(req, delete_);
    case "addTab":   return locked_(req, addTab_);
    default: throw new Error("Unknown action: " + req.action);
  }
}

// ── Reading ─────────────────────────────────────────────────────────────────
function list_() {
  var ss = open_(), items = [], tabs = [];
  tabs_(ss).forEach(function (sheet) {
    var data = read_(sheet), n = 0;
    data.rows.forEach(function (r) {
      r.tab = sheet.getName();
      items.push(r);
      n++;
    });
    tabs.push({ name: sheet.getName(), count: n });
  });
  return { ok: true, app: APP_NAME, locked: !!EDIT_KEY, sheetUrl: ss.getUrl(), tabs: tabs, items: items, ts: Date.now() };
}

// ── Writing ─────────────────────────────────────────────────────────────────
function add_(req) {
  var sheet = sheet_(req.tab);
  var d = clean_(req);
  var map = columns_(sheet);
  var row;
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 4).setValues([["cmds", "category", "purpose", "example"]]);
    sheet.setFrozenRows(1);
    map = columns_(sheet);
  }
  row = sheet.getLastRow() + 1;
  write_(sheet, map, row, d);
  return { ok: true, row: row };
}

function update_(req) {
  var sheet = sheet_(req.tab);
  var d = clean_(req);
  var map = columns_(sheet);
  var row = locate_(sheet, map, Number(req.row) || 0, req.orig || {});
  if (!row) throw new Error("Ye entry sheet me badal chuki hai ya hat gayi — Refresh karo.");
  write_(sheet, map, row, d);
  return { ok: true, row: row };
}

function delete_(req) {
  var sheet = sheet_(req.tab);
  var map = columns_(sheet);
  var row = locate_(sheet, map, Number(req.row) || 0, req.orig || {});
  if (!row) throw new Error("Ye entry pehle hi hat chuki hai — Refresh karo.");
  sheet.deleteRow(row);
  return { ok: true };
}

function addTab_(req) {
  var name = String(req.name || "").trim();
  if (!name || name.length > 60 || /[\[\]\*\?:\/\\]/.test(name)) throw new Error("Tab ka naam galat hai (max 60 chars, [ ] * ? : / \\ allowed nahi).");
  var ss = open_();
  if (ss.getSheetByName(name)) throw new Error("Is naam ka tab pehle se hai.");
  var sh = ss.insertSheet(name);
  sh.getRange(1, 1, 1, 4).setValues([["cmds", "category", "purpose", "example"]]).setFontWeight("bold");
  sh.setFrozenRows(1);
  return { ok: true };
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function locked_(req, fn) {
  if (EDIT_KEY && String(req.key || "") !== EDIT_KEY) throw new Error("EDIT_KEY_REQUIRED");
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { return fn(req); } finally { lock.releaseLock(); }
}

function open_() { return SpreadsheetApp.openById(SHEET_ID); }

function tabs_(ss) {
  return ss.getSheets().filter(function (s) {
    return !s.isSheetHidden() && s.getName().charAt(0) !== "_";
  });
}

function sheet_(name) {
  var s = open_().getSheetByName(String(name || ""));
  if (!s) throw new Error("Tab nahi mila: " + name);
  return s;
}

function norm_(s) { return String(s || "").trim().toLowerCase(); }

// Find which column holds which field (by header text). Falls back to A,B,C,D.
function columns_(sheet) {
  var map = { cmd: 0, category: 1, purpose: 2, example: 3, start: 0 };
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() === 0) { map.start = 1; return map; }
  var head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(norm_);
  var found = {};
  FIELDS.forEach(function (f) {
    for (var i = 0; i < head.length; i++) {
      if (ALIASES[f].indexOf(head[i]) >= 0) { found[f] = i; break; }
    }
  });
  if (found.cmd === undefined) { map.start = 0; return map; }   // no recognised header: treat all rows as data
  FIELDS.forEach(function (f) { map[f] = (found[f] === undefined) ? -1 : found[f]; });
  map.start = 1;
  return map;
}

function read_(sheet) {
  var map = columns_(sheet), rows = [];
  if (sheet.getLastRow() === 0) return { map: map, rows: rows };
  var values = sheet.getDataRange().getDisplayValues();
  for (var i = map.start; i < values.length; i++) {
    var item = { row: i + 1 }, any = false;
    FIELDS.forEach(function (f) {
      var v = map[f] >= 0 ? String(values[i][map[f]] || "") : "";
      item[f] = v;
      if (v.trim() !== "") any = true;
    });
    if (any) rows.push(item);
  }
  return { map: map, rows: rows };
}

function clean_(req) {
  var out = {};
  FIELDS.forEach(function (f) {
    var v = String(req[f] == null ? "" : req[f]).replace(/\s+$/, "").replace(/^(\s*\n)+/, "");
    if (f === "cmd" || f === "category") v = v.replace(/^\s+/, "");   // no leading spaces on command / category
    if (v.length > MAX_LEN) throw new Error("'" + f + "' bahut lamba hai (max " + MAX_LEN + " characters).");
    out[f] = v;
  });
  if (!out.cmd.trim()) throw new Error("Command (cmds) khaali nahi ho sakta.");
  return out;
}

// Write as plain text so values like "=cmd", "+x", "1/2" are never turned into formulas/dates.
function write_(sheet, map, row, d) {
  FIELDS.forEach(function (f) {
    if (map[f] < 0) return;
    sheet.getRange(row, map[f] + 1).setNumberFormat("@").setValue(d[f]);
  });
}

// Find the row for an entry. Uses the row number hint if it still matches, otherwise searches.
function locate_(sheet, map, hint, orig) {
  if (sheet.getLastRow() === 0) return 0;
  var values = sheet.getDataRange().getDisplayValues();
  function same(i) {
    for (var k = 0; k < FIELDS.length; k++) {
      var f = FIELDS[k];
      var cell = map[f] >= 0 ? String(values[i][map[f]] || "") : "";
      if (cell !== String(orig[f] || "")) return false;
    }
    return true;
  }
  if (hint && hint - 1 >= map.start && hint - 1 < values.length && same(hint - 1)) return hint;
  for (var i = map.start; i < values.length; i++) if (same(i)) return i + 1;
  return 0;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function msg_(err) { return String((err && err.message) || err); }
