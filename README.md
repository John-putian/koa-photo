# KOA Profiling Picture

Knights of the Altar Server, San Miguel Parish Panacan.

A one-page site where a member takes their 2×2 picture with the camera. The person is cut out and placed on a white background, the lighting is cleaned up, the result is cropped to a true 2×2 inch square (600×600 px, 300 dpi), and it is filed in Google Drive under their last name with their details in a Google Sheet. Everything runs in the member's browser, so it works on GitHub Pages with no server.

A member can take the picture live with the camera or upload an existing file. Either way the page checks that the head is lined up before it will send.

## 1. Set up the Sheet

1. Create a new Google Sheet.
2. **Extensions → Apps Script**, delete what's there, paste in `Code.gs`, save.
3. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorise it when asked (click past the "unverified app" warning — it's your own script).
5. Copy the deployment URL. It ends in `/exec`.

## 2. Point the page at it

Open `index.html` and edit the block near the top:

```js
const ENDPOINT  = "https://script.google.com/macros/s/..../exec";
const BG_COLOUR = "#ffffff";   // try "#cfe3f5" for blue or "#e8c9c9" for red backdrops
```

The form collects last name, full name, date of birth, and whether the person is an aspirant. To change that, edit `FIELDS`. Each entry looks like:

```js
{ name: "studentNo", label: "Student number", type: "text", required: true,
  placeholder: "2024-00123", help: "Example: 2024-00123", upper: true }
```

- `label` becomes the Sheet column heading, so keep labels unique.
- `type` can be `text`, `email`, `tel`, `date`, `textarea`, or `select`.
- `select` also needs `options: ["A", "B"]`.
- `help` prints a grey example line under the box — that's how the full name format is explained.
- `upper` forces the typing to uppercase.
- `min` and `max` limit dates; `max: "today"` blocks future birthdates.

If you change `FIELDS` after collecting data, delete row 1 of the Sheet so the next submission rebuilds the header.

## Photo file names

Each photo is saved under the person's last name, like `BARING.jpg`, matching your example. `PHOTO_NAME_FIELD` at the top of `index.html` decides which field is used. If two people share a last name, the second becomes `BARING-2.jpg` rather than overwriting the first, and the Sheet row links to the exact file either way.

## 3. Publish on GitHub Pages

1. New repository → upload `index.html`, `example.jpg`, `koa-logo.jpg`, and `parish-logo.jpg` to the root.
2. **Settings → Pages → Source: Deploy from a branch → main / (root)**.
3. Open `https://yourname.github.io/yourrepo/` after a minute.

`Code.gs` stays in Apps Script, not the repo.

`example.jpg` is the sample photo shown at the top of the page. Replace it with any square image to change the example — same filename, and the page hides that block automatically if the file is missing. `koa-logo.jpg` is the crest in the masthead and `parish-logo.jpg` is the seal at the foot of the page.

## Taking the picture

After a picture comes in, the page auto-frames it: it zooms and shifts the crop so the head is the right size and the eyes sit at the right height. Members can still drag and zoom, and **Auto-frame** puts it back.

**Open the camera** starts the camera inside the square frame, with the head guides on top, so people line themselves up before shooting. **3s timer** gives a countdown so nobody has to jab the button while posing. **Flip** switches between the front and back camera — the back one is sharper if someone else is holding the phone. **Cancel** closes it without changing anything.

The front camera preview is mirrored so it feels like a mirror, but the saved photo is not, so uniforms and name tags read correctly.

Browsers only allow camera access over HTTPS. GitHub Pages is HTTPS, so it works once published. Opening `index.html` straight off the disk will not work at all, since the camera is the only way in — test on the published link.

## The alignment check

After a picture is taken or uploaded, MediaPipe Face Detection finds the face and the page checks the crop:

- eyes sitting between 29% and 47% down the square
- head centred left to right
- head filling a sensible share of the frame, so nobody is too near or too far
- head level, not tilted more than 8 degrees
- whole head inside the square, and only one person in it

The panel updates live while the picture is dragged or zoomed, so people can correct it themselves. If problems remain, the send button stops once and explains; pressing it a second time submits anyway, so nobody gets locked out by a wrong reading. If the detector cannot load, the check is skipped rather than blocking.

## Consent and the Data Privacy Act

The consent block follows NPC Circular 2023-04 (Guidelines on Consent) under RA 10173. It is built as a **layered notice**: a short summary at the point of consent, with the full notice one tap away.

Before you publish, fill these in at the top of `index.html`:

```js
const ORG         = "Knights of the Altar Server, San Miguel Parish Panacan";
const DPO_NAME    = "the Parish Data Protection Officer";
const DPO_CONTACT = "PUT A REAL EMAIL OR MOBILE NUMBER HERE";   // <- must be changed
const RETENTION   = "for as long as you are an active member, and one year after you leave";
const WHO_SEES    = "the KOA officers and the parish office";
const CONSENT_VERSION = "2026-09-07";
```

`DPO_CONTACT` is a placeholder on purpose. Consent is not valid if a member has no real way to ask questions or withdraw.

What the notice covers, because the circular asks for each of these: who is collecting, what is collected, why, how it is handled, who can see it, how long it is kept, the member's rights, how to withdraw, and the rule for minors.

Other points the circular requires that are already built in:

- **No pre-ticked boxes.** Both tick boxes start empty.
- **Granular consent.** Using pictures in announcements and posts is a separate, optional tick. It is not bundled with the required one, and leaving it unticked still lets a member submit.
- **Evidence of consent.** The Sheet records the answer, the notice version, and the time it was given.
- **Date of birth is sensitive personal information** under the DPA, which the summary says plainly.
- **Withdrawal.** The notice says it is free, needs no reason, and does not make earlier processing unlawful.

If the date of birth shows the member is under 18, a block appears asking for the parent or guardian's name, their relationship, and their agreement. Nothing sends without all three.

Two things this cannot do for you: the group still needs a designated Data Protection Officer, and the notice should be offered in Bisaya if that is what members actually read. I am not a lawyer, so have your parish DPO read the notice before you publish it.

## Reviewing and printing

The Sheet gets a **Preview** column with a thumbnail of each face, so officers can scan the list instead of opening links, plus **Approved** checkboxes and a **File ID** column.

Reload the Sheet after saving `Code.gs` and a **KOA** menu appears. **KOA → Make print sheet** builds a Google Doc with every picture at exactly 2×2 inches, three to a row, last name underneath. It uses the ticked rows, or everything if nothing is ticked yet.

Thumbnails are floating images anchored to their row, so they do not follow the row if you sort the sheet. Sort before reviewing, not after.

## Devices

Tested shapes rather than devices: one column throughout, 44 px minimum tap targets, buttons that stack on narrow screens, a square frame that shrinks in landscape, safe-area padding for notched phones, and a fallback for browsers without `aspect-ratio`. It needs a browser from roughly 2020 onward — any current Chrome, Safari, Edge, Firefox, or Samsung Internet on phone, tablet, laptop, or desktop.

The page also warns before closing if a picture was taken but not sent.

## How the photo processing works

**Background.** Google's MediaPipe Selfie Segmentation model loads from a CDN (about 2 MB, cached after the first visit) and runs on the visitor's device. The person's outline is feathered slightly before compositing, which hides most stair-stepping. Nothing is uploaded during this step.

**Clean up.** A canvas pass that measures the person's pixels only, then applies: white balance from the highlights, a 1%/99% levels stretch, a mild S-curve with a small shadow lift, a 7% saturation lift, and an unsharp mask. Values live at the top of the `enhance()` function if you want it stronger or gentler.

Both are toggles on the page, on by default, so anyone can switch them off if a result looks wrong.

The first visit downloads roughly 5 MB of models, which the page warns about. After that they are cached.

After sending, the member gets a **Save my picture** button so they keep their own copy of the 2×2.

## Limits worth knowing

- Cut-outs get messy with flyaway hair, hats, busy backgrounds, or clothing close in colour to the wall behind. Ask people to stand against a plain wall and it works far better. For official passport submissions, check the result before relying on it.
- "Clean up" is exposure and sharpness correction, not AI face restoration. It will not rescue a blurry or very dark phone photo — it only makes a decent photo look better.
- If the CDN is blocked or offline, the page keeps the original background, disables that toggle, and explains why. Cropping and submitting still work.
- Pictures land in a Drive folder called **2x2 Photos** and stay **private** to your Drive account. The Sheet links open for you and for anyone you share that folder with, and for nobody else. Do not switch the folder to "anyone with the link" — these are photos and birthdates of members, many of them minors.
