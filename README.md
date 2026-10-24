# CMD Notes — Setup Guide (v2)

## 1. Google Sheet Format

Each sheet tab must have the following column headers in **Row 1**:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| cmds | category | tag | purpose | example | id | favorite | created_at | updated_at |

### Column Descriptions

- **cmds:** The command or syntax.
- **category:** The main category or group (e.g., Windows, Cisco, Network).
- **tag:** A specific topic or subcategory. Multiple tags should be separated by commas, such as `Files & Folders, Network`.
- **purpose:** A description of what the command does.
- **example:** An example showing how to use the command.
- **id, favorite, created_at, updated_at:** These fields are automatically managed by the application. If the columns are missing, the app will create them automatically.

**Important Notes:**
- Any duplicate `updated_at` column (such as Column J) will be ignored. You can safely delete it if unnecessary.
- If the column headers and data are misaligned, the application will prevent write operations and display a warning to protect your data.

## 2. How to Update the Application

Follow these steps to update your CMD Notes application.

### Step 1: Update Google Apps Script

1. Open your Google Apps Script project.
2. Open the `Code.gs` file.
3. Replace the entire existing code with the latest version.
4. Click **Save**.

### Step 2: Deploy the Updated Script

1. Navigate to **Deploy → Manage deployments**.
2. Click the **Edit (✏️)** icon.
3. Under Version, select **New version**.
4. Click **Deploy**.

Verify the deployment settings:

- **Execute as:** Me
- **Who has access:** Anyone

### Step 3: Update GitHub Files

Open your GitHub repository and upload or replace the following files:

- `index.html`
- `sw.js`
- `GUIDE.md`

Commit the changes to your repository.

### Step 4: Refresh the Website

Open your CMD Notes website and refresh the page.

For mobile users, close the application completely and reopen it to load the latest version.

## 3. Organizing Commands

CMD Notes provides several features to organize and manage commands efficiently.

### Category and Tag Filters

- Use the **Category** and **Tag** chips at the top to filter commands.
- Click a category badge or hashtag on any command card to apply the corresponding filter automatically.

### Grouping Options

Use the **Group** dropdown to organize commands by:

- **Tag:** Group commands based on their tags.
- **Category:** Group commands by their main categories.
- **Section:** Group commands according to their Google Sheet tabs.
- **No grouping:** Display all commands without grouping.

Click any group header to expand or collapse its contents.

### Sorting Options

Use the **Sort** dropdown to arrange commands by:

- Sheet order
- Alphabetical order (A–Z)
- Newest first
- Recently updated
- Favourites first

### Favourite Commands

- Click the **⭐ Star** icon on any command to mark it as a favourite.
- Access saved commands through the **Favourites** section in the sidebar or mobile filter chips.

## 4. Progressive Web App (PWA)

CMD Notes supports PWA installation, allowing you to use the website like a regular application.

### Windows / Desktop

1. Open CMD Notes in Google Chrome or Microsoft Edge.
2. Click the **Install** icon in the browser address bar, or use the application's **Install** button.
3. Confirm the installation.

### Android

1. Open CMD Notes in Chrome.
2. Tap the **Install App** option when available.
3. Follow the installation instructions.
4. Once installed, long-press the app icon to access supported shortcuts.

### iPhone / iPad

1. Open CMD Notes in Safari.
2. Tap the **Share** button.
3. Select **Add to Home Screen**.
4. Confirm to add the application.

## 5. Troubleshooting: Missing Tags or Sheet Sections

If new tags or Google Sheet tabs such as **Windows, Linux, or Cisco** are not appearing in the application, your Google Apps Script deployment may be outdated.

### How to Identify an Outdated Deployment

You may notice either of these issues:

- A yellow warning banner appears at the top of the application stating **"Code.gs is outdated."**
- Opening the deployed Apps Script `/exec` URL in your browser does not return `"v":3` in its response.

### How to Fix It

1. Open your Google Apps Script project.
2. Replace the entire `Code.gs` content with the latest version.
3. Save the project.
4. Navigate to **Deploy → Manage deployments**.
5. Click **Edit (✏️)**.
6. Select **New version**.
7. Click **Deploy**.
8. Refresh the CMD Notes application.

### Automatic Section Detection

Every visible tab in your Google Spreadsheet automatically becomes a separate **Section** in CMD Notes.

For example:

| Google Sheet Tab | CMD Notes Section |
|---|---|
| Windows | Windows |
| Linux | Linux |
| Cisco | Cisco |
| Networking | Networking |

**Note:** Tabs whose names begin with an underscore (`_`) are excluded from automatic section detection.

---

## 6. Final Setup Checklist

Before using CMD Notes, verify the following:

- [ ] Google Sheet headers are correctly configured.
- [ ] The latest `Code.gs` is saved.
- [ ] Google Apps Script is deployed using a new version.
- [ ] Deployment permissions are correctly configured.
- [ ] Updated `index.html`, `sw.js`, and `GUIDE.md` files are committed to GitHub.
- [ ] The website loads the latest version.
- [ ] Categories, tags, and sections are displayed correctly.
- [ ] Command filtering, grouping, and sorting work properly.
- [ ] Favourite commands can be saved and accessed.
- [ ] The PWA can be installed on supported devices.

**CMD Notes v2 — A Smart Command Library for Windows, Linux, Cisco, and Networking.**
