# Magical Byte Academy — Cinematic Fantasy Edition

An English-learning visual novel for **273411 — Communicative English for Computer and Information Technology**. You are the Magical IT Advisor in the castle’s Magical Technology Support Chamber. [GAME_DESIGN_V2.md](GAME_DESIGN_V2.md) is the current source of truth and takes precedence over [GAME_DESIGN.md](GAME_DESIGN.md).

## What changed in V2

- Cinematic fantasy chamber and ten original, distinct character portraits replace the pixel art and retro windows. These are **generated 3D-style rendered illustrations with CSS lighting and particles, not real-time 3D**. There is one portrait per character; emotion is conveyed by authored reactions and lighting rather than separate facial-expression renders.
- The title offers only Start Game, Continue, How to Play, and Settings. A short guide-light introduction explains your role. During a case, the scene, dialogue, response, Hint, Submit, and feedback are the focus. Detailed progress lives in the journal.
- The original nine five-turn story cases retain stable indices and technical content. Characters are aligned with V2 roles: Mix handles programming, Direx presents history, Felix handles networking, and Serena leads incident communication. Three new cases introduce Noah’s hardware issue, Aurora’s research backup, and Professor Ivy’s online meeting, creating **12 cases across four chapters**.
- All **ten characters** have three authored Endless templates, distinct roles, speech styles, specialties, and relationship-dependent return dialogue.
- **Endless Support** unlocks after the story. A shuffled bag covers **30 authored templates** before cycling, avoids adjacent repeats even across cycle boundaries, and prefers a different visitor when possible. Context, vocabulary, difficulty, and communication goals vary. Foundation teaches technical intent; Standard also requires a polite request; advanced advice also asks for a reason using a purpose connector. These are reusable authored variations, not newly generated AI content.
- Endless scores, friendship, completed requests, average/best score, template coverage, and achievements are stored separately from story rewards. Replaying a completed story case never awards its main rewards again.
- **Existing V1 LocalStorage saves migrate in place**, retaining completed indices, stars, XP, relationships, settings, and the partial conversation/draft. Players who finished the original nine cases can continue with chapter four. Historical friendship keys are preserved even when a V2 story role changes.

## Run locally

No runtime dependencies, backend, paid API, or secrets are needed. Serve the existing checkout over HTTP; JavaScript modules do not work by opening index.html directly as a file.

```sh
cd /workspace/magical-byte-academy
python3 -m http.server 8000
```

Open the local server in a browser. Ctrl/Command + Enter submits. Every case can be completed by typing. Progress is stored on this browser and device; when storage is unavailable, the game warns you. It does not synchronize between devices or site origins. A Vercel preview URL has separate storage; V1 migration applies when V2 runs on the same origin as the existing save.

## Learning and microphone support

Each case covers welcome → investigate → troubleshoot → explain/verify → professional closing. Type a natural English response, read the feedback, and retry if needed. Hint gives an example; Build a phrase offers guided sentences when the evaluator misses valid wording. The vocabulary journal collects technical terms as cases are completed.

The transparent evaluator checks selected intent synonyms, technical relevance, polite wording, and response length, and rejects common unsafe instructions or insults. It is not a full grammar or semantic evaluator and can miss valid answers or accept incomplete reasoning. “Why this score?” explains the rules. Scores are game feedback, not validated language proficiency measures. There is no runtime language model or pronunciation scoring.

Speak uses SpeechRecognition/webkitSpeechRecognition. On supported browsers, start the microphone, review/edit the transcript, stop listening, confirm the transcript, and Submit. HTTPS or a trusted local origin, microphone permission, and potentially the browser provider’s online service are needed. Errors provide a typing fallback. The game does not store audio; the browser provider may process it remotely.

## Artwork and accessibility

The local WebP chamber and shared ten-portrait atlas total about **700 KB**. The portrait atlas loads once and is cropped by CSS, so no ten-image request waterfall is needed. The game has an image-loading screen and a readable text-play fallback if artwork fails. System reduced motion and a manual effects toggle are respected; larger reading text, native buttons/dialogs, keyboard focus, and responsive layouts are supported. Details of generated artwork and compression are in [ARTWORK.md](ARTWORK.md).

## Tests

Node.js 18+ can run the dependency-free syntax and unit tests:

```sh
npm run check
npm test
```

Ten tests check 12 story cases and all 30 templates at three difficulties, alternative English, safe/unsafe advice, score effects, story rewards, V1 migration, 65 Endless completions across bag boundaries, difficulty/context variation, save corruption, and unavailable storage.

Optional browser tooling (not a game dependency):

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
# Keep the static server running in another terminal.
npm run test:browser
```

`CHROMIUM_PATH` can select an installed Chromium executable. `GAME_TEST_URL` can select another port or a repository-subpath server; default is http://127.0.0.1:8000. The browser suite exercises all 60 story turns and 31 Endless cases (155 turns), all 30 templates before cycling, save/resume, replay reward protection, a returning visitor, old-save migration, mobile layouts, keyboard submission, settings/reset, loading failures, and simulated microphone confirmation/error/fallback paths. Real microphone hardware, provider recognition quality, and classroom outcomes require manual testing; no human playtesting results are claimed.

## Update the Vercel website

The site remains static. Import the repository into Vercel with **Other** as the framework and the repository root as Root Directory. Existing `vercel.json` uses `npm run check && npm test` as Build Command and `.` as Output Directory. No environment variables or secrets are required.

For an existing Git-connected project, create and review a PR into `main`. If Vercel preview deployments are enabled, inspect the branch preview, then merge; a project configured with `main` as its production branch will deploy automatically. Otherwise, import or deploy the reviewed commit through the Vercel dashboard. This code change does not itself publish Vercel or prove a production deployment succeeded.

Before merging, check the desktop/mobile scene, resume an existing save, complete a case, test a real microphone in the intended HTTPS browser, and inspect the Vercel build output. After production deploy, verify the new cinematic artwork, chapter four, and Endless unlock with a completed save.

## GitHub Pages and course documentation

Relative module and asset paths still support a repository subpath. For Pages select **Deploy from a branch**, the desired branch, and **/(root)**; `.nojekyll` keeps the site static. No publication is performed by the code itself.

[GAME_DOCUMENT.md](GAME_DOCUMENT.md) contains the concise English assignment document. Fill in actual names, IDs, and contributions. OpenAI Codex assisted with authored code/dialogue/tests; OpenAI image generation produced the cinematic illustrations. Human review of English accuracy, pedagogical effectiveness, and technical advice remains necessary. No team contributions or user-study results are invented.
