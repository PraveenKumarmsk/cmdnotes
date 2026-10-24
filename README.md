# 💻 CMD Notes v2

### Smart Command Library | Windows • Linux • Cisco • Networking

CMD Notes is a modern, mobile-friendly command management application powered by **Google Sheets, Google Apps Script, HTML, CSS, and JavaScript**.

Store, organize, search, and manage technical commands in one place. Designed for IT professionals, network engineers, CCNA learners, system administrators, and technology enthusiasts.

## ✨ Features

- 🔍 **Smart Search** — Quickly find commands by name, category, tag, or purpose.
- 📂 **Category Management** — Organize commands into Windows, Linux, Cisco, Networking, and other categories.
- 🏷️ **Multiple Tags** — Assign multiple tags to individual commands.
- ⭐ **Favourites** — Save frequently used commands for quick access.
- 📊 **Advanced Grouping** — Group commands by category, tag, or section.
- ↕️ **Flexible Sorting** — Sort alphabetically, by date, favourites, or original sheet order.
- ☁️ **Google Sheets Integration** — Use Google Sheets as your command database.
- ✏️ **Command Management** — Add and update commands through the application.
- 📱 **Responsive Design** — Optimized for desktop, tablet, and mobile devices.
- 🚀 **PWA Support** — Install CMD Notes as an application on supported devices.
- 🔐 **Data Protection** — Built-in validation helps prevent writes when sheet headers are misaligned.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Responsive UI and styling |
| JavaScript | Frontend functionality |
| Google Sheets | Command database |
| Google Apps Script | Backend API |
| Service Worker | PWA functionality |
| GitHub Pages | Website hosting |

## 📁 Project Structure

```text
CMD-Notes/
│
├── icons/
├── Code.gs
├── GUIDE.md
├── README.md
├── index.html
├── manifest.json
├── offline.html
└── sw.js
```

## 📊 Google Sheets Database Setup

Create a Google Spreadsheet with the following headers in **Row 1** of each command sheet.

| Column | Header |
|---|---|
| A | cmds |
| B | category |
| C | tag |
| D | purpose |
| E | example |
| F | id |
| G | favorite |
| H | created_at |
| I | updated_at |

### Important Notes

- `category` represents the main command group.
- `tag` supports multiple comma-separated values.
- `id`, `favorite`, `created_at`, and `updated_at` are automatically managed by the application.
- Missing system columns are automatically created.
- Duplicate `updated_at` columns are ignored.
- Misaligned headers trigger a safety warning and prevent write operations.
- Every visible Google Sheet tab becomes a separate application section.
- Tabs beginning with `_` are excluded.

## ⚙️ Installation & Setup

### Step 1 — Configure Google Sheets

1. Create a new Google Spreadsheet.
2. Add the required column headers.
3. Create separate tabs for different command sections, such as Windows, Linux, Cisco, and Networking.

### Step 2 — Configure Google Apps Script

1. Open your Google Spreadsheet.
2. Navigate to **Extensions → Apps Script**.
3. Open `Code.gs`.
4. Paste the latest backend code.
5. Save your changes.

### Step 3 — Deploy the Backend

1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Configure the deployment:

   - **Execute as:** Me
   - **Who has access:** Anyone

4. Click **Deploy**.
5. Copy the generated Web App URL.

**Security note:** An Apps Script deployment accessible to anyone is a public endpoint. Ensure the backend validates authorization for every operation that modifies data. Do not rely on a hidden admin button or frontend-only password for security.

### Step 4 — Configure the Frontend

Open `index.html` and configure the application to use your deployed Apps Script Web App URL, following the configuration used in your project.

### Step 5 — Publish on GitHub Pages

1. Create a GitHub repository.
2. Upload the project files.
3. Navigate to **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder.
6. Save the settings.

Your website will be available at a URL similar to:

`https://yourusername.github.io/CMD-Notes/`

## 🔄 Updating CMD Notes

When releasing a new version:

1. Replace the existing Apps Script code in `Code.gs`.
2. Save the project.
3. Navigate to **Deploy → Manage deployments**.
4. Select **Edit → New version → Deploy**.
5. Update `index.html`, `sw.js`, and `GUIDE.md` in GitHub.
6. Commit the changes.
7. Refresh the application.

If the installed PWA continues displaying an older version, close and reopen it. The service worker may need to activate before the update appears.

## 🗂️ Command Organization

### Categories

Organize commands into major groups such as:

- Windows CMD
- PowerShell
- Linux
- Cisco IOS
- Networking
- Troubleshooting

### Tags

Use comma-separated tags to classify commands.

Example:

`Files & Folders, Network, Troubleshooting`

### Grouping

Available grouping options:

- Tag
- Category
- Section
- No grouping

### Sorting

Available sorting options:

- Sheet order
- A–Z
- Newest
- Recently updated
- Favourites first

## 📱 PWA Installation

**Desktop:** Open the website in Chrome or Edge and select the browser's installation option or the in-app Install button.

**Android:** Open the website in Chrome and select Install App or Add to Home Screen.

**iOS:** Open the website in Safari, tap Share, and select Add to Home Screen.

## 🧩 Troubleshooting

### Categories or Tags Not Appearing?

Your Apps Script deployment may be outdated.

**Solution:**

1. Update `Code.gs`.
2. Save your changes.
3. Deploy a new version.
4. Refresh the application.

If the deployed `/exec` endpoint does not return `"v":3`, verify that the latest backend version has been deployed.

### Unable to Add or Update Commands?

Check that:

- Google Sheet headers match the required structure.
- The Apps Script deployment is current.
- The frontend is configured with the correct Web App URL.
- Backend authorization and deployment permissions are correctly configured.

## 🎯 Project Purpose

CMD Notes was developed to make technical command learning, documentation, and management simpler.

Instead of maintaining commands across multiple notebooks, text files, and websites, users can organize their knowledge in a centralized, searchable command library.

**Learn. Save. Organize. Execute.**

---

## 📄 License

Copyright © 2026 Praveen Kumar. All Rights Reserved.

This project is proprietary. Unauthorized copying, modification, distribution, or commercial use of the source code is prohibited without prior written permission from the copyright owner.

For more information, see the [LICENSE](LICENSE) file.

---

**CMD Notes v2 — Your Commands. Your Knowledge. One Dashboard.**
