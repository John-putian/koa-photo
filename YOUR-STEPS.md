# Your setup — John-putian / koa-photo

Your live link will be:

**https://john-putian.github.io/koa-photo/**

Apps Script owner: junjunputian@gmail.com

---

## What changed in this version

The background remover and face detector no longer download from the internet. They are now files inside your own site, in the `vendor` folder. That is the likely reason the white background was not working. It also means the page keeps working on parish wifi that blocks outside downloads.

The folder is bigger because of it — about 24 MB. GitHub Pages handles that fine.

---

## Part A — Upload to GitHub

Your repository already exists and Pages is already switched on, so this is the only part left on the GitHub side.

**A1.** Go to https://github.com/John-putian/koa-photo

**A2.** If any files are already there from before, delete them first so nothing old is left behind. Click each file, then the three-dot menu at the top right of the file view, then **Delete file**, then **Commit changes**.

**A3.** Click **Add file** → **Upload files**.

**A4.** Open the `site` folder from the zip. Select **everything inside it** — `index.html`, the three `.jpg` files, and the `vendor` folder — and drag them into the browser.

Drag the contents, not the `site` folder itself. Dragging the folder is what caused the 404 last time.

**A5.** Wait for the upload bar to finish. There are about 20 files and it takes a minute.

**A6.** Scroll down, type `Add KOA photo site` as the message, click **Commit changes**.

**A7.** Check the Code tab now shows `index.html` at the top level, with `vendor` as a folder beside it.

**A8.** Wait two minutes, then open https://john-putian.github.io/koa-photo/

---

## Part B — Connect it to your Sheet

The page still needs somewhere to send the pictures.

**B1.** Follow Part A and Part B of `SETUP-STEPS.md` to create the Sheet, paste `Code.gs`, and deploy it as a web app. Copy the `/exec` URL.

**B2.** On GitHub, open `index.html`, click the pencil icon to edit.

**B3.** Near the top, find:

```js
const ENDPOINT  = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```

Paste your `/exec` URL between the quotes.

**B4.** A few lines down, replace `PUT A REAL EMAIL OR MOBILE NUMBER HERE` with a real email or mobile number.

**B5.** Click **Commit changes**. Wait a minute and reload your link.

Editing on GitHub like this avoids Notepad entirely, so there is no chance of a hidden `.txt` on the filename.

---

## Part C — Test

Open https://john-putian.github.io/koa-photo/ on your phone.

1. The crest, title, and example picture appear.
2. Open the camera, take a shot. **The background should turn white.** This is the part that was broken.
3. The picture snaps into position and the alignment panel turns green.
4. Fill the form with a fake name, tick consent, send.
5. Check the row and thumbnail appear in your Google Sheet, and the picture is in Drive.

If the background still does not turn white, press F12, open the Console tab, reload, take a shot, and send me a screenshot of any red lines. With the models now local, the usual causes are gone, so whatever remains will be visible there.

---

## Note on the other zip

`koa-verification-system.zip` is a different, much larger project — Firebase logins, QR verification, an admin panel, OCR. I ran its tests here and they pass, but its own status file says the backend was never authorised and it stores demo records in memory only. It is not connected to this simple site. Keep it if you want that system later, but do not mix the two folders.
