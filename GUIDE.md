# CMD Notes — Setup Guide (Hinglish)

Website (laptop) + app (phone, PWA). Data Google Sheet me, live sync.

## Files
```
cmdnotes/                     ← GitHub Pages par upload
├── index.html                ← poora app
├── manifest.json
├── sw.js
├── offline.html
└── icons/ (icon-192.png, icon-512.png, maskable-512.png, apple-touch-icon.png, icon.svg)

apps-script/Code.gs           ← Google Apps Script me paste (GitHub par NAHI)
```

## Step 1 — Google Sheet check
- Har tab (Windows, Linux, CCNA_CCNP, Others, Troubleshooting) ki **row 1** me header: `cmds | category | purpose | example`
- Naye tabs app se bhi ban sakte hain ("New section").

## Step 2 — Apps Script (backend)
1. Apni Google Sheet kholo → **Extensions → Apps Script**.
2. Purana code hata ke `apps-script/Code.gs` ka poora code paste → **Save**.
3. **Deploy → New deployment → ⚙️ → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - **Deploy** → permission maange to: Authorize → Advanced → *Go to project (unsafe)* → Allow.
4. **/exec** wala Web app URL copy karo.
5. Test: wo URL browser me kholo → `{"ok":true,"app":"CMD Notes","tabs":[...]}` dikhna chahiye.

Code me kuch badlo to: Deploy → Manage deployments → ✏️ → **Version: New version** → Deploy (URL wahi rehta hai).

## Step 3 — GitHub Pages (website)
1. github.com → **New repository** `cmd-notes` (Public).
2. **uploading an existing file** → `index.html, manifest.json, sw.js, offline.html` aur `icons` folder drag karo → Commit.
3. **Settings → Pages** → Branch `main`, `/ (root)` → Save.
4. 1–2 min baad: `https://USERNAME.github.io/cmd-notes/`

## Step 4 — Use
1. Link kholo → pehli baar `/exec` URL paste → Save & open.
   (Skip karna ho: `index.html` me `var GAS_URL = "";` ke andar URL paste karo.)
2. Laptop: Chrome/Edge address bar ka install icon ya green **Install App**.
3. Android: green **Install App** → Install. Icon long-press → Add / CCNA / Linux / Windows / Troubleshooting.
4. iPhone: Safari → Install App → Share → Add to Home Screen.

## Shortcuts (keyboard)
`/` search · `n` new command · `Esc` close · command ya example par click = copy

## Password lock (recommended)
Link jiske paas hai wo edit kar sakta hai. Rokna ho to `Code.gs` me `var EDIT_KEY = "";` me password daalo, New version deploy karo. Tab app read-only rahega jab tak "Unlock editing" se password na daalo.

## Update
Files badlo → `sw.js` me `VERSION` badhao → GitHub par dobara upload.

## Problem?
- "Failed to fetch": Access = Anyone? New version deploy kiya? URL `/exec` hai?
- Server URL badalna: `.../index.html?setup=1`
- Tab nahi dikh raha: tab naam `_` se shuru na ho, aur hidden na ho.
