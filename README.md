# ARCANEXUS ACADEMY — The Enchanted Help Desk

An English-learning visual novel for **273411 — Communicative English for Computer and Information Technology**. You are the Magical IT Advisor in the castle’s Magical Technology Support Chamber. [GAME_DESIGN_V2.md](GAME_DESIGN_V2.md) is the current source of truth and takes precedence over [GAME_DESIGN.md](GAME_DESIGN.md).

## What changed in V2

- Cinematic fantasy chamber and twelve original transparent, detailed illustrated character portraits. The scene uses **2D Cinematic Fantasy Visual Novel artwork**, with soft shadows, subtle glow, 8px CSS idle motion and a short speaking reaction. There are no toy-like models or WebGL requirements. Each character currently has one facial expression; mood affects motion, glow and authored dialogue, not facial morphing. Optional alternate expression images are supported.
- The title offers only Start Game, Continue, How to Play, and Settings. A short guide-light introduction explains your role. During a case, the scene, dialogue, response, Hint, Submit, and feedback are the focus. Detailed progress lives in the journal.
- The original nine five-turn story cases retain stable indices and technical content. Characters are aligned with V2 roles: Mix handles programming, Direx presents history, Felix handles networking, and Serena leads incident communication. Three new cases introduce Noah’s hardware issue, Aurora’s research backup, and Professor Ivy’s online meeting, creating **12 cases across four chapters**.
- The original **ten characters** have at least three authored Endless templates, distinct roles, speech styles, specialties, and relationship-dependent return dialogue.
- **Endless Support** unlocks after the story. A shuffled bag covers **41 authored templates** before cycling, avoids adjacent repeats even across cycle boundaries, and prefers a different visitor when possible. Context, vocabulary, difficulty, and communication goals vary. Foundation teaches technical intent; Standard also requires a polite request; advanced advice also asks for a reason using a purpose connector. These are reusable authored variations, not newly generated AI content.
- Endless scores, friendship, completed requests, average/best score, template coverage, and achievements are stored separately from story rewards. Replaying a completed story case never awards its main rewards again.
- **Existing V1 LocalStorage saves migrate in place**, retaining completed indices, stars, XP, relationships, settings, and the partial conversation/draft. Players who finished the original nine cases can continue with chapter four. Historical friendship keys are preserved even when a V2 story role changes.

## Run locally

No runtime dependencies, backend, paid API, or secrets are needed. Serve the existing checkout over HTTP; JavaScript modules do not work by opening index.html directly as a file.

```sh
cd /workspace/magical-byte-academy
python3 -m http.server 8000
```

Open the local server in a browser. Ctrl/Command + Enter submits. Every case can be completed by typing. Progress is stored on this browser and device; when storage is unavailable, the game warns you. It does not synchronize between devices or site origins. A Vercel preview URL has separate storage; V1 migration applies when V2 runs on the same origin as the existing save.

## Player experience draft — seven improvements

1. **Quests panel:** shows the current visitor, all story quests, completed/locked status, and the next visitor. Story order stays unchanged.
2. **Best score and 1–5 stars:** each completed quest records the five-turn average, best score, latest attempt, and attempt count. Ratings are 1 star below 60, 2 at 60–74, 3 at 75–84, 4 at 85–94, and 5 at 95–100. The replay dropdown updates a personal best without reducing it or repeating XP/Magic Stars/friendship rewards. A paused later quest and its typed draft are preserved.
3. **Advisor status:** your name, level, XP, best-score total out of 1200, and original story Magic Stars are visible above the scene. Level is `1 + floor(XP / 200)`; best-score improvements do not farm XP. Legacy Magic Stars remain a separate currency from the new 1–5 quest rating.
4. **Name screen:** new players enter a nickname before the introduction. Existing unnamed saves are prompted once, retaining progress. Names remain local to the saved browser and are escaped when displayed.
5. **Instrumental music:** an original 32-note magical bell-and-pad loop is synthesized locally using Web Audio in `music.js`, with no vocals, downloaded recordings, external services, or licensing dependency. It starts after user interaction, has mute and volume settings, and pauses before microphone recognition or when the tab is hidden. Browser support failures never block play. Automated checks validate the audio graph; device listening quality still needs manual checking.
6. **Feedback cards:** a gem/sprout/shield badge, score orb, small learning cards, and expandable comparison panels replace the wall of feedback text. Details remain available through keyboard-accessible controls.
7. **Partial credit and three model replies:** MCQ uses the same underlying analysis but allows 35-point progression for a relevant technical action with a minor modal/tone error. Professional, Polite, Direct, and Growing skill form four learning tiers; unsafe/insulting answers get 0 and still require a retry. Type/Speak retain analytical scoring and retry requirements, with three distinct accepted model replies per turn. “Improve this response” lets a learner revise a partial answer before continuing.

Old V1/V2 saves infer best quest results from recorded case satisfaction and gain default music settings without resetting progress. Per-quest ratings use a different scale from the retained legacy reward currency.

## Unit 4: Polite and Professional Communication

Type, Speak, and the new **Choose** mode share one text evaluator. Every turn offers four contrasting choices; positions vary. The strongest choice combines a safe, relevant technical action with correct functional language and a useful reason/follow-up. Direct and polite answers can still advance at lower scores; taught modal errors earn partial progression credit in Choose when the technical action is relevant; unsafe or insulting instructions still require revision. Type/Speak show analytical scores and require correction of detected taught errors. A polite word cannot make wrong advice professional.

Practice `Could you please + base verb`, `Would you mind + -ing`, `May I suggest`, `I'd be happy to help`, `We could`, and `Shall we`. Several natural forms and contractions are accepted. Feedback summarizes the visitor’s specific request and what the reply achieved, with three optional model replies. Scoring still checks tone and safe technical intent without displaying textbook theory in the feedback. It is a limited rule-based check, not a complete semantic or grammar assessment.

**Journal → Team Talk practice** is available during the story. Five complete software-team situations cover Sprint Planning, Code Review, Asking for Help, Blockers, and advice to a teammate. Disagreement tasks require acknowledgment, a concern, an alternative, and a reason. These five scenarios also enter Endless, expanding its library from 30 to 35 templates. Six Orion/Ember context variants now bring the pool to 41. Existing saved bags finish before a fresh 41-template cycle; no save reset is required. Team practice does not duplicate story rewards.

The activities implement the Unit 4 patterns requested by the user. Instructor materials or approval have not been provided, and no classroom validation is claimed.

## Learning and microphone support

Each case covers welcome → investigate → troubleshoot → explain/verify → professional closing. Type a natural English response, read the feedback, and retry if needed. Hint gives an example; Build a phrase offers guided sentences when the evaluator misses valid wording. The vocabulary journal collects technical terms as cases are completed.

The transparent evaluator checks selected intent synonyms, technical relevance, contextual functional language, targeted modal grammar, and response length, and rejects common unsafe instructions or insults. It is not a full grammar or semantic evaluator and can miss valid answers or accept incomplete reasoning. “Why this score?” explains the rules. Scores are game feedback, not validated language proficiency measures. There is no runtime language model or pronunciation scoring.

Speak uses SpeechRecognition/webkitSpeechRecognition. On supported browsers, start the microphone, review/edit the transcript, stop listening, confirm the transcript, and Submit. HTTPS or a trusted local origin, microphone permission, and potentially the browser provider’s online service are needed. Errors provide a typing fallback. The game does not store audio; the browser provider may process it remotely.

## Artwork and accessibility

The local castle image and twelve separate full-body WebP illustrations total about **4.6 MB**. Each solo asset is 264–426 KB, preserves alpha transparency and is shared by poster, dialogue and appreciation views. There is no group-image cropping. The game has an image-loading screen and a readable text-play fallback if artwork fails. System reduced motion and a manual effects toggle are respected; larger reading text, native buttons/dialogs, keyboard focus, and responsive layouts are supported. Details are in [ARTWORK.md](ARTWORK.md).

## Tests

Node.js 18+ can run the dependency-free syntax and unit tests:

```sh
npm run check
npm test
```

Thirty-one tests check 12 story cases and all 41 templates at three difficulties, alternative English, safe/unsafe advice, score effects, story rewards, V1 migration, 85 Endless completions across bag boundaries, difficulty/context variation, save corruption, unavailable storage, best-score upgrades, 1–5 rating boundaries, levels, three usable reply models, partial MCQ credit, and music lifecycle.

Optional browser tooling (not a game dependency):

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
# Keep the static server running in another terminal.
npm run test:browser
npm run test:experience
```

`CHROMIUM_PATH` can select an installed Chromium executable. `GAME_TEST_URL` can select another port or a repository-subpath server; default is http://127.0.0.1:8000. The browser suite exercises all 60 story turns and 42 Endless cases (210 turns), all 41 templates before cycling, save/resume, replay reward protection, a returning visitor, old-save migration, mobile layouts, keyboard submission, settings/reset, loading failures, all five Team Talk cases using Choose (25 turns), typed/modal retries, and simulated microphone confirmation/error/fallback paths. The experience suite also checks the name screen, quest order, replay improvement with a preserved next-quest draft, running audio/microphone pause and resume, saved volume/mute settings, and compact mobile feedback. Real microphone hardware, provider recognition quality, physical speaker sound quality, and classroom outcomes require manual testing; no human playtesting results are claimed.

## Update the Vercel website

The site remains static. Import the repository into Vercel with **Other** as the framework and the repository root as Root Directory. Existing `vercel.json` uses `npm run check && npm test` as Build Command and `.` as Output Directory. No environment variables or secrets are required.

For an existing Git-connected project, create and review a PR into `main`. If Vercel preview deployments are enabled, inspect the branch preview, then merge; a project configured with `main` as its production branch will deploy automatically. Otherwise, import or deploy the reviewed commit through the Vercel dashboard. This code change does not itself publish Vercel or prove a production deployment succeeded.

Before merging, check the desktop/mobile scene, resume an existing save, complete a case, test a real microphone in the intended HTTPS browser, and inspect the Vercel build output. After production deploy, verify the new cinematic artwork, chapter four, and Endless unlock with a completed save.

## GitHub Pages and course documentation

Relative module and asset paths still support a repository subpath. For Pages select **Deploy from a branch**, the desired branch, and **/(root)**; `.nojekyll` keeps the site static. No publication is performed by the code itself.

[GAME_DOCUMENT.md](GAME_DOCUMENT.md) contains the concise English assignment document. Fill in actual names, IDs, and contributions. OpenAI Codex assisted with authored code/dialogue/tests; OpenAI image generation produced the cinematic illustrations. Human review of English accuracy, pedagogical effectiveness, and technical advice remains necessary. No team contributions or user-study results are invented.

### Fantasy interface and illustrated characters

The left menu defaults to Quest Replay: current/next main-story visitor, clickable completed/available quests and disabled locked quests. Player Profile, levels, counters, friendship and statistics are in a separate modal opened by the person icon. Accepted turns add to `learningPoints` when Continue is pressed, including replay and Team Talk. Best quest scores and one-time story XP stay separate. Old saves import approximately reconstructable points from stored averages; previously unrecorded replay points cannot be recovered.

Original instrumental music runs at 128 BPM. Cinzel and Nunito fonts are bundled under their SIL Open Font Licenses in `assets/fonts`. Character artwork is generated original full-body transparent art in twelve separate WebP files. The title poster, dialogue, quest path, journal, and appreciation screen share these files; there are no atlas crops. CSS handles idle and speaking animations; Settings and system reduced-motion preferences disable both. If artwork fails, a readable notice appears and text gameplay continues. The castle scene is unchanged.

To install individual transparent PNG/WebP files, add them to `assets/characters/` and set the corresponding `src` in `character-art.js`.  Optional `expressions` keys are `neutral`, `worried`, `thinking`, `happy`, and `surprised`; missing expressions use the same character's base portrait. The current story evaluator uses worried, thinking and happy; surprised is available for future authored scenes. No expression files are claimed to exist unless supplied. Do not use opaque image backgrounds or temporary placeholders.

### Movie poster and character appreciation

The title assembles all twelve individual files into a layered cinematic composition over the original castle. Each file is also used in the corresponding dialogue and reward screen. Rewards show the actual completed visitor, the escaped saved player name, character-specific thanks and problem-specific story details. Replay and Team Talk explicitly show zero XP/stars/friendship; Endless shows its own friendship increment. Animation respects Settings and system reduced motion. `appreciation.js` only supplies presentation text; scoring and saves are unchanged.

Run `CHROMIUM_PATH=/usr/bin/chromium GAME_TEST_URL=http://127.0.0.1:8021 npm run test:portraits` for image loading, distinct solo files, idle/reduced motion, image failure, and desktop/mobile checks. `npm run test:browser` covers the full gameplay regression.

### Persistent quest navigation

The main story cursor (`caseIndex`, `stepIndex`, `draft`) is separate from `selectedQuest`, `replayMode` and `replaySession`. `highestUnlockedQuest` derives only from completed story quests. Completed quests launch a separate practice cursor; selecting the available quest or Continue main story returns immediately without finishing the replay. Title Continue always resumes the unfinished main story (or Endless after the story). The same save key/version is retained, with migration for older saves and stored menu open/closed preference. Replay awards no duplicate story XP/stars/hearts. Profile opening/closing preserves selection and drafts.

Run `npm run test:quests` for the requested eight-step progression/profile sequence on desktop/mobile, and `npm run test:presentation` for poster, dialogue and personalized reward screens. Set `CHROMIUM_PATH` and `GAME_TEST_URL` to your Chromium and running local server.

### ARCANEXUS ACADEMY branding

Where Ancient Magic Meets Modern Technology. Original generated royal shield art is bundled in `assets/branding/`: large transparent `royal-crest.webp`, text-free `crest-small.webp`, `favicon.png` and `apple-touch-icon.png`. The full crest includes the named gold ribbon; the mini version removes lettering for small sizes. Homepage, header, loading screen, browser title and metadata use the new name. The repository/URL and legacy LocalStorage key remain unchanged to preserve deployment and saves. No extra image files are needed.

### Back navigation and guide presentation

Gold Back navigates prior compatible screens in the current session while preserving nickname, draft, scores and quest progress. Stale quest contexts are skipped, and replay can return to the main story. Nickname uses the Royal Crest; both guides use the original pastel-liquid technology orb. Quest navigation appears during gameplay. Desktop portraits have safe head clearance; mobile sizing stays the same. Gold nameplates sit above the dialogue parchment. Run `npm run test:navigation-art` for desktop/laptop/mobile checks.

### Twelve unique story visitors

Story quest6 (same `frozen` ID) now belongs to Orion, an indigo owl archive courier, and quest9 (`crisis`) belongs to Ember, an emerald baby dragon festival messenger. Luna and Serena each own one story quest. Twelve original solo images appear in the poster and in-game; human poster scale is equal across rows with vertical offsets, while three creatures sit at the front. Scores, quest IDs/order, old-save rewards and friendships are preserved. The original 35 Endless templates remain, with six reviewed context variants for Orion/Ember (three each), giving 41 in the pool.

### Royal completion certificate

After the twelve unique story quests, the final reward leads to a royal certificate with real nickname, quest/star/XP/satisfaction totals and carried-forward points. The local canvas document includes school crest, guide orbs, miniature full cast and academy seal, with PNG and single-page PDF downloads. The PDF is an embedded high-resolution certificate image, not selectable text. Dates use Asia/Bangkok. Exports/cancel do not mutate saves.

Continue conversation scrolls to the next character question, or the appreciation screen on completion. Quest Replay offers New journey after graduation; confirmation replaces the current story/rewards/Endless save while keeping nickname/settings, using the established quest order. Save the certificate before restarting. Run `npm run test:certificate` for scroll, real downloads, totals and restart checks on desktop/mobile.

### History & Certificates
The title screen and game menu open the journey archive. Empty history shows only the enchanted-book artwork. Played journeys keep their own nickname, totals and status; each completed journey freezes its own certificate and issue date. Start New Journey/reset preserves these records, and later graduation creates another certificate. Archived PNG/PDF exports remain available after reload. History is stored locally under `arcanexus-journey-history-v1`, separate from the active save; clearing browser storage removes both. Existing saves are imported on resume, with the import date because original historical dates were not recorded. `npm run test:history` verifies English restart, empty history, archived exports, refresh, and completion of the second twelve-quest journey on desktop/mobile.
