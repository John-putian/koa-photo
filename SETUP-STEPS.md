# Setup, step by step

Do this on a computer. Set aside about 30 minutes. You need a Google account and a GitHub account (free).

First, download these four files from our chat into one folder on your computer:

- `index.html`
- `koa-logo.jpg`
- `parish-logo.jpg`
- `example.jpg`

And keep `Code.gs` open in another tab — you will copy from it, but it does not go in that folder.

---

## Part A — The Google Sheet and the script

**A1.** Go to sheets.google.com and click **Blank spreadsheet**.

**A2.** Rename it. Click "Untitled spreadsheet" at the top left and type **KOA Profiling**.

**A3.** In the menu, click **Extensions → Apps Script**. A new tab opens with a code editor showing `function myFunction() { }`.

**A4.** Select all of that sample code and delete it. The editor should be empty.

**A5.** Open `Code.gs`, select everything, copy it, and paste it into the empty editor.

**A6.** Click the save icon (or Ctrl+S / Cmd+S). The tab title changes from "Untitled project" — give it a name if it asks, anything is fine.

---

## Part B — Publish the script so the page can reach it

**B1.** In Apps Script, click the blue **Deploy** button, top right, then **New deployment**.

**B2.** Next to "Select type" click the gear icon, then choose **Web app**.

**B3.** Fill the form:
- Description: `KOA profiling`
- Execute as: **Me**
- Who has access: **Anyone**

That last one has to be "Anyone", not "Anyone with a Google account". Members are not signing in, the page is posting for them.

**B4.** Click **Deploy**. Google now asks for permission.

**B5.** Click **Authorize access**, pick your Google account. You will see a red-ish warning that the app is not verified. That is expected — it is your own script. Click **Advanced**, then **Go to (your project name) (unsafe)**, then **Allow**.

**B6.** You now get a **Web app URL** ending in `/exec`. Copy it. Keep it somewhere for a minute.

If you lose it later: Deploy → Manage deployments → the URL is there.

---

## Part C — Fill in the two blanks

**C1.** Open `index.html` in a plain text editor. Notepad on Windows, TextEdit on Mac (Format → Make Plain Text first), or VS Code. Not Word.

**C2.** Near the top find this line:

```js
const ENDPOINT  = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

Replace the text between the quotes with the `/exec` URL you copied. Keep the quotes and the semicolon.

**C3.** A few lines down find:

```js
const DPO_CONTACT= "PUT A REAL EMAIL OR MOBILE NUMBER HERE";
```

Put a real email or mobile number between the quotes. This is shown to every member as the way to ask questions or withdraw consent.

**C4.** While you are there, check `ORG`, `RETENTION`, and `WHO_SEES` say what your group actually does. Change the wording if not.

**C5.** Save the file. Keep the name `index.html` exactly.

---

## Part D — Put it online

**D1.** Go to github.com and sign in, or click **Sign up** and make a free account.

**D2.** Click the **+** at the top right, then **New repository**.

**D3.** Repository name: `koa-photo`. Leave it **Public** — GitHub Pages needs public on a free account. Do not tick "Add a README". Click **Create repository**.

**D4.** On the next screen click **uploading an existing file** (it is a link in the middle of the page).

**D5.** Drag in all four files: `index.html`, `koa-logo.jpg`, `parish-logo.jpg`, `example.jpg`. Not `Code.gs`.

**D6.** Scroll down, click **Commit changes**.

**D7.** Click the **Settings** tab at the top of the repository, then **Pages** in the left sidebar.

**D8.** Under "Build and deployment", set Source to **Deploy from a branch**, branch to **main**, folder to **/ (root)**, and click **Save**.

**D9.** Wait one to three minutes, then reload that Settings → Pages screen. A green box appears with your link, like `https://yourname.github.io/koa-photo/`. That is the link you give to members.

---

## Part E — Test it

Use a fake name for the first run so you can delete it afterwards without worry.

**E1.** Open the link on your computer. Allow the camera when the browser asks. Check the crest, title, and example picture look right.

**E2.** Click **Open the camera**, then **Take the shot**. Watch for: the background turning white, the picture snapping into position by itself, and the alignment panel turning green.

**E3.** Drag the picture off to one side. The panel should turn amber and tell you what is wrong. Click **Auto-frame** to fix it.

**E4.** Fill the form with a fake name, a birthdate that makes the person over 18, tick the required consent box, and leave the optional publicity box unticked. Click send.

**E5.** You should see "Sent" and a **Save my picture** button. Click it and check the downloaded file is a clean 600×600 square.

**E6.** Open your Google Sheet. There should be one row: timestamp, a face thumbnail, your fake details, consent columns, an Approved checkbox, a photo link and a file ID.

**E7.** Open Google Drive. There should be a folder **2x2 Photos** with a file named after the fake last name.

**E8.** Right-click that file → Share. It should say restricted, not "anyone with the link". If it says anyone with the link, stop and tell me.

**E9.** Go back to the page and try a birthdate that makes the person 15. The guardian block should appear and refuse to send until name, relationship, and the tick are filled.

**E10.** Reload the Google Sheet tab. A **KOA** menu appears next to Help. Click **KOA → Make print sheet**. It will ask for permission the first time. It should produce a Google Doc with your test picture at 2×2 inches.

**E11.** Open the link on a phone, ideally one iPhone and one Android, and do one full run on each.

**E12.** Delete your test rows from the Sheet and the test files from Drive.

---

## If something goes wrong

| What you see | What it means |
|---|---|
| "This form has no destination yet" | `ENDPOINT` was not saved, or the wrong file was uploaded to GitHub |
| "Could not send" but the row appears in the Sheet anyway | The CORS problem I warned about. Tell me and I will switch it to a different posting method |
| "Could not send: Failed to fetch" and no row | Wrong `/exec` URL, or "Who has access" is not set to Anyone |
| Camera never opens | You are opening the file on your computer instead of the https link, or you blocked the camera. Check the padlock icon in the address bar |
| Background stays as-is, amber warning | The model could not load. Check the connection and reload. Everything else still works |
| 404 on the GitHub link | Pages is still building, or `index.html` is in a subfolder rather than the root |
| Sheet has columns but no thumbnails | Normal for rows added before this version. Delete row 1 and submit again to rebuild |

When you report a problem, tell me the exact message, whether the row reached the Sheet, and which browser and phone. That is usually enough for me to find it.
