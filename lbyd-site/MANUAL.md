# Interactive Client Acquisition

XPLR's Interactive Client Acquisition system: the customer-facing assessment site and, on the same site at `/admin`, the coach's private leads portal. Read this cold and you can deploy it, edit it, or set it up for a new coach.

## What it is

A phone-first web page that walks a person through a coach's assessment, captures their name and WhatsApp before showing results, then shows them their pattern, their scores, three actions to do tomorrow, an optional video and PDF, and the coach's offers. Every completed assessment is saved to the site's own Netlify Blobs store (built into Netlify, nothing to set up) and shows up in the admin portal at `/admin`.

One deployment = one coach. Each coach gets their own Netlify site, their own `config.js`, their own leads store and their own admin PIN.

The first coach is Live Before You Die (Brett Bailey) with two assessments: Are You Winning Everywhere? (the 5-Minute Founder Scorecard, default) and Heart Over Head.

## How a person experiences it

1. Intro screen (black, logo, title, "Start").
2. One question per screen. A branch question (for example "are you in a relationship?") decides which later questions show. Scenario questions tag a pattern. Scale questions score a dimension. A grid question scores several dimensions on one screen. Progress bar, back button, auto-advance on tap. Progress saves in the browser, so they can leave and come back.
3. Lead capture. Sits after the last question, before the results, whatever the length of the assessment. Name and WhatsApp required, email, Instagram and annual revenue optional. Their answers are sent to the database here.
4. Results. Pattern hero, video (if a link is set), three actions, score bars, PDF download (if set), care note, offers, copy and retake, and a link to the coach's other assessment.

If the database save fails (bad connection, site not configured yet) the person still gets their results. The page keeps the submission and retries it when the results screen loads.

## Files

```
ica-engine/
  public/index.html            the engine. Rendering, scoring, capture, results. Do not put coach content here.
  public/config.js             everything about the coach: brand, gate, offers, assessments. Edit this.
  public/assets/logo.webp      the coach's logo, shrunk to 560px (about 65 KB)
  public/assets/pdfs/          the five PDFs the results page links to (baked in for the demo)
  public/admin/index.html      the leads portal (PIN sign-in, list, filters, detail, WhatsApp link, CSV export)
  netlify/functions/submit.js  saves a completed assessment to the site's Netlify Blobs store
  netlify/functions/leads.js   checks the PIN and returns the leads to the portal
  netlify.toml                 Netlify build settings
  package.json                 one dependency, @netlify/blobs. Netlify installs it on deploy.
  .env.example                 the environment variables Netlify needs
  later-supabase/              the database schema for when volume justifies moving off Blobs. Not used yet.
```

## Deploy for the first time

1. **GitHub.** Push this folder as its own repo.
2. **Netlify.** Add new site > Import from GitHub > pick the repo. Publish directory `public`, functions directory `netlify/functions` (netlify.toml sets both). Add two environment variables before deploying: `COACH_SLUG=lbyd` (must equal `coach.slug` in config.js) and `ADMIN_PIN` (what you'll type at /admin). `COACH_NAME` is optional and shows at the top of the admin.
3. Deploy. Open the site, run through an assessment, then open `/admin`, enter the PIN, and check the lead is there.
4. Point the coach's subdomain at the Netlify site when ready (Netlify > Domain management).

For the demo the PDFs are baked into the repo. When traffic is real, move them to Google Drive to take download bandwidth off Netlify. See "PDFs on Drive" below.

Where the leads live: Netlify > the site > Blobs > store `leads`. One JSON file per completed assessment, named by timestamp. The admin portal is the readable view; the CSV export is the backup.

## The admin portal

`https://yoursite.netlify.app/admin`. PIN only. Counts, search, filter by assessment and pattern, tap a lead for contact details, scores, the actions they were shown and every answer, one-tap WhatsApp with a pre-filled opener, CSV export of whatever is filtered. Read-only: nothing here can change or delete a lead (do that in Netlify > the site > Blobs if ever needed). Not linked from anywhere a customer sees, set to no-index, and a wrong PIN is slowed to make guessing slow. To change the PIN, change `ADMIN_PIN` in Netlify and trigger a deploy.

## Links to share

Each assessment has its own link, and people never see the other one (`linkBetweenAssessments: false` in config.js).

- `https://yoursite.netlify.app/scorecard` is the business one (Are You Winning Everywhere?).
- `https://yoursite.netlify.app/heart-over-head` is Heart Over Head.
- The bare address `https://yoursite.netlify.app/` opens `defaultAssessment` (the scorecard).

The link name is the assessment's key in config.js. Rename the key and the link changes.

## PDFs on Drive

Each pattern's `pdf` field currently holds a path under assets/pdfs/. It can instead hold a normal Google Drive share link (`https://drive.google.com/file/d/FILE_ID/view?usp=sharing`). The engine converts it to a direct download when the button is tapped. The file's sharing must be set to "anyone with the link". A field still reading `PASTE_DRIVE_LINK_...` hides the download block, so nothing is broken while links are missing.

LBYD files to upload: LBYD-Profile-Lone-Operator.pdf, LBYD-Profile-Burning-Engine.pdf, LBYD-Profile-Drifting-Achiever.pdf, LBYD-Profile-Integrated-Performer.pdf (one per scorecard profile) and LBYD-Heart-Over-Head-Workbook.pdf (all four Heart Over Head patterns). To update a guide, replace the file in Drive (right-click > Manage versions) and the link stays the same.

Bandwidth: with PDFs on Drive and the logo cached, a completed assessment costs roughly 100 KB of Netlify bandwidth.

## Editing content

Everything a person reads is in `public/config.js`. No engine changes needed for:

- **Brand.** `coach` block: name, logo path, the program line used under the offers.
- **Lead capture.** `gate` block: heading, body, fields (add, remove, make optional; `type: "select"` with `options` gives a dropdown, used for revenue), consent line, button. Fields beyond name, WhatsApp, email and Instagram are stored under `lead_extra` and show in the admin.
- **Offers.** `offers.items`: set `enabled: true` and fill `url` to show one. `code` shows a discount code above the button. Two offers (`call` and `join`) ship disabled, waiting on a booking link and the offer details.
- **Questions.** Four types:
  - `branch`: `opts` is a list of `[text, branchKey]`. The pick sets the person's branch. Any later question with `branch: "x"` shows only for that branch. One branch question per assessment, early.
  - `scenario`: `opts` is a list of `[text, patternKey]`. Each pick counts one for that pattern.
  - `scale`: `key` is the dimension it scores, `max` is 5 or 10, `ends` are the two labels under the buttons. `also: { key, reverse: true }` scores the same answer into a second dimension, flipped.
  - `grid`: several dimensions on one screen. `keys` lists them.
- **Patterns (or profiles).** `patterns`: name, tagline, body, a labelled foot line (the cost, what it protects), the pattern's own action, `video` (YouTube or Vimeo link, converted to an embed automatically) and `pdf` (path or full URL). The Scorecard points each profile at a different LBYD guide.
  Two ways to decide the pattern: by scenario picks (`patternOrder` tie-break, `forcePattern`), or by a `profile` function that reads the scores (`s.dims`, `s.low`, `s.overall`) and returns a pattern key. The Scorecard uses the function; Heart Over Head uses picks. `patternWord` is the noun used on the actions list ("profile" or "pattern").
- **Overall score.** `overall: true` shows the average of the lowest-from group in the hero.
- **Branch-specific text.** Any `action` can be an object keyed by branch, for example `{ partner: "...", single: "..." }`.
- **Dimensions.** Scored 0 to 100. `group` decides which results section the bar appears in. `action` is used when it's the person's lowest, `why` is the one-line reason shown above it. `notes` are the high / mid / low lines under the bar. `lowestOrder` on the assessment breaks ties for the lowest area.
- **Groups.** Results sections. `labels` are the high / mid / low words (Strong / Steady / Running low). `thresholds` default to `[65, 40]`. `lowestFrom: true` marks the group the "lowest" logic reads from. `lowIsBad: false` stops low bars turning rust (used for Heart Over Head's critic and blame bars, where low is good).
- **Rules.** Optional. The first rule whose `when` returns true takes action two. If no rule fires (the Scorecard has none), action two is the lowest area's action and action three is the next lowest.

Pattern tie-break: `patternOrder` lists patterns with the reactive ones first, so ties go to where the work is. `forcePattern` overrides when one pattern is picked at least `min` times.

House rules for anything a person reads: no em dashes, no AI-isms, no claims the coach can't back up, and never a grade. Score a pattern, never a person.

## Adding a second assessment to a coach

Copy an existing block inside `assessments`, give it a new id (the key and the `id` field must match, lowercase, hyphens), write the questions, patterns, dimensions, groups and rules. It gets its own `#id` link and its own saved progress. The intro and results pages link between assessments automatically.

## Setting up a new coach

1. Copy this folder into a new repo. Replace `config.js` with the new coach's content. Replace the logo and PDFs. Change the colours in the `:root` block of `index.html` if the coach has a brand (gold on black and ivory is the LBYD look).
2. New Netlify site from that repo, `COACH_SLUG` set to the new slug, `ADMIN_PIN` set to their PIN, `COACH_NAME` to their name.

That's the whole product: one site and one config per coach. For a coach running paid traffic, the plan is to rebuild on a shared database (`later-supabase/`) with one admin across coaches.

## What is deliberately not here yet

- Videos per pattern: the slot exists, the links are empty. Add a YouTube or Vimeo link to `patterns[x].video`.
- Moving the PDFs to Drive (demo runs with them baked in).
- A database. Leads sit in Netlify Blobs, which is fine for hundreds of leads. `later-supabase/` holds the schema for when it's time to move.
- Sending the person anything after they finish (WhatsApp follow-up, email). The database has everything needed for it.
- Offers on the results page mirror the closing page of the guides: community (Skool), Talk to Noah (JotForm), Book a call with Brett (Calendly). The workshop offer is kept in config but switched off.
- Brett has not yet reviewed the Scorecard. The ten items marked `client: true` are his client scorecard. The other ten, the four profiles, the per-area actions and "why" lines came from the kit's founder-scorecard draft; the profile actions and the "cost" lines were drafted here. All of it needs his sign-off before public launch.
- An earlier Scorecard draft (Nov 1) scored an attachment-style pattern (Anxious / Avoidant / Secure Founder) from five scenario questions. It was replaced by this version because of the partner / single branch and the twenty-item baseline. The scenario idea could come back as a third assessment if Brett wants it.

## Built

Nov 1, 2026 by Noah (XPLR Systems) with Claude. Grew out of the Heart Over Head check-in (Oct 20, 2026).
