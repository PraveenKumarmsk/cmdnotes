# cmdnotes
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
