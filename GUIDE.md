# CMD Notes — Setup Guide (v2)

## Sheet ka format (har tab me, row 1)
| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| cmds | category | tag | purpose | example | id | favorite | created_at | updated_at |

- **category** = bada group (jaise Windows, Cisco, Network).
- **tag** = chhota topic. Ek se zyada ho to comma se alag: `Files & Folders, Network`.
- **id, favorite, created_at, updated_at** — app khud bharta hai. Naye columns na ho to khud add ho jaate hain.
- Extra duplicate `updated_at` (column J) ignore hota hai; chaho to delete kar do.
- Header aur data misaligned ho to app safety ke liye write rok deta hai aur warning dikhata hai.

## Update steps
1. Apps Script me `Code.gs` ka poora code naye se replace → Save.
2. **Deploy → Manage deployments → ✏️ → Version: New version → Deploy** (Execute as: Me, Access: Anyone).
3. GitHub repo me naya `index.html`, `sw.js`, `GUIDE.md` upload (commit) karo.
4. Site refresh karo (phone par ek baar band karke dobara kholo).

## Organise kaise kare
- Upar **Category** aur **Tag** chips se filter. Card par badge/#tag click karo to wahi filter lagta hai.
- **Group** dropdown: Tag / Category / Section / No grouping. Group header click = collapse.
- **Sort**: Sheet order, A–Z, Newest, Recently updated, Favourites first.
- ⭐ se favourite; sidebar/phone chips me **Favourites** section.

## PWA
Chrome/Edge me address-bar install icon ya in-app **Install** button; Android me long-press shortcuts. iPhone: Safari → Share → Add to Home Screen.

## Agar tag ya naye tabs (Windows, Linux, Cisco) nahi dikhte
App ke upar peela warning "Code.gs purana hai" aaye, ya `…/exec` URL browser me kholne par `"v":3` na dikhe, to deployment purana hai:
1. Apps Script me poora naya `Code.gs` paste → Save.
2. Deploy → Manage deployments → ✏️ → Version: **New version** → Deploy.
3. App refresh. Sheet ke har visible tab (jiska naam `_` se shuru na ho) ka alag Section ban jaata hai.

## 🔐 PIN login + fingerprint (optional)
**Users sheet se control hota hai** — app me koi user bana nahi sakte, sirf sheet me.
1. Apps Script editor me function `setupUsers` select karo → ▶ Run (pehli baar permission do). Sheet me `_Users` tab ban jaata hai: `user | pin | role | active`, aur ek row `admin / 1234 / admin`.
2. `_Users` me **admin ka PIN turant badlo** aur apne users add karo (ek row = ek user). PIN column "Plain text" hai, isliye `0456` jaisa PIN theek rehta hai.
   - `role`: `admin` (sab kuch + naya section) · `editor` (add/edit/delete) · `viewer` (sirf padhna). Khali = editor.
   - `active`: khali/yes = chalu, `no` = user band.
3. Code.gs paste → Deploy → **New version** → Deploy. App ab login maangega.
4. Login band karna ho: `_Users` tab delete kar do (ya saari user rows hata do).

Kaise kaam karta hai:
- Login ke baad device 30 din yaad rakhta hai. Har baar app kholne par (aur background se wapas aane par, Auto-lock setting ke hisaab se) PIN ya fingerprint maangta hai.
- Pehli login ke baad "Fingerprint unlock?" poochta hai. Baad me ⋮ → Security me on/off. Fingerprint HTTPS par hi chalta hai (GitHub Pages theek hai).
- 5 galat PIN par user 10 minute ke liye block. Sheet me role/active badalte hi turant lagu ho jaata hai.
- Har user ⋮ → Security se apna PIN (4–8 digit) khud badal sakta hai.
- Fingerprint sirf is device ka lock hai; asli suraksha server ka token hai. PIN sheet me plain text me hai, isliye sheet ko private rakho (sirf apne ko share).
