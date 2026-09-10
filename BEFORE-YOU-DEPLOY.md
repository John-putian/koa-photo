# Before you deploy

Nothing here is code you need to write. It is the list of things I could not do for you, and the things I could not test from where I am.

## Must do — the page will not work without these

- [ ] **Set `ENDPOINT`** in `index.html` to your Apps Script `/exec` URL. Until then, submitting says "this form has no destination yet."
- [ ] **Set `DPO_CONTACT`** in `index.html` to a real email or mobile number. It currently reads `PUT A REAL EMAIL OR MOBILE NUMBER HERE`, which is shown to every member.
- [ ] **Name your Data Protection Officer.** The consent notice promises someone to contact. The group needs to actually designate that person.
- [ ] **Have the parish DPO or a lawyer read the notice.** I followed NPC Circular 2023-04 as closely as I could, but I am not a lawyer and this involves photos and birthdates of minors.

## Should do

- [ ] Check `ORG`, `RETENTION`, and `WHO_SEES` say what your group actually does.
- [ ] Decide whether the notice needs a Bisaya version. The circular asks for a language the audience actually reads.
- [ ] Decide who has access to the Drive folder and the Sheet, and share it with those accounts only.

## Test plan — do this on the published link, not on your computer

The camera needs https, so all of this has to be done on the real GitHub Pages URL.

1. **One full run on an Android phone.** Open camera, take a shot, check the background turns white, submit, confirm the row and the thumbnail appear in the Sheet, and that the picture is in Drive under the last name.
2. **One full run on an iPhone.** Safari is the most likely place for the camera or the models to behave differently.
3. **One run on a laptop**, using upload instead of the camera.
4. **A minor.** Put a birthdate under 18 and check the guardian block appears and blocks submission until filled.
5. **Two phones submitting at the same time.** Confirm two clean rows with the right thumbnails on each.
6. **A deliberately bad picture** — off-centre, too far away. Confirm the alignment panel complains and that pressing send twice still lets it through.
7. **Open the picture link from the Sheet while signed out.** It should refuse. If it opens, sharing is wrong somewhere.

## Where I expect trouble, in order

1. **The Apps Script response.** The page posts as `text/plain` to avoid a preflight and then reads the JSON reply. This normally works, but some browsers are fussy about the redirect Apps Script uses. If submissions fail with a network or CORS error while the row still lands in the Sheet, tell me and I will switch it to a hidden-iframe post.
2. **iOS and the background remover.** MediaPipe's WASM build occasionally struggles on older iPhones. The page already falls back to keeping the original background, so it degrades rather than breaks — but check what an actual member's phone does.
3. **The alignment thresholds.** Eye height, head size, and tilt limits are my best reading of ID standards, not tuned on your members. Run ten people through and tell me if it is too strict.
4. **First load on mobile data.** Roughly 5 MB of models. Fine on parish wifi, slow on a weak connection.
5. **Thumbnails and sorting.** They are floating images anchored to a row, so sorting the sheet leaves them behind. Sort before you review.

## Not built, if you want them later

- Officer view to mark rejected pictures and ask a member to retake.
- Automatic ID layout with name and position, rather than the plain print grid.
- A resend link so a member can replace their own picture without an officer.
