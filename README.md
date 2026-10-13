# Magical Byte Academy: The Enchanted Help Desk

A playable, kawaii pixel-style visual novel for course **273411**, teaching English through nine IT support cases. The player is the academy’s Magical IT Advisor. [GAME_DESIGN.md](GAME_DESIGN.md) is the design source; [GAME_DOCUMENT.md](GAME_DOCUMENT.md) is the concise English assignment document.

## Play locally

Use the existing checkout; no game dependencies or API keys are needed. Serve the files rather than opening index.html with file://, because JavaScript modules need HTTP.

```sh
cd /workspace/magical-byte-academy
python3 -m http.server 8000
```

Open the server in your browser. Start a story or Continue; read the visitor’s goal, type an English response, and send. A helpful response unlocks Continue conversation. Hints and guided phrases support retries. Ctrl/Command + Enter sends. The journal offers practice replay after completion without changing rewards. Progress stays in LocalStorage on the current browser/device, and storage failures are reported in the game.

Implemented: nine five-turn cases, three chapters, six recurring characters with expression variants, original pixel-style SVG office and portraits, typing, microphone transcript review, rule-based educational feedback, rewards, friendship, achievements, local save/resume, help, settings, credits, dictionary, and practice replay. Optional office decorations and desktop inbox applications are not implemented.

## Microphone and evaluation

Speak uses SpeechRecognition/webkitSpeechRecognition with English recognition. HTTPS (or a trusted local development origin), a supported browser, microphone permission, and possibly network access to the browser provider are needed. Review and confirm the transcript before sending. Permission, capture, service, network, and unsupported-browser errors offer a typing fallback. The game does not store audio or measure pronunciation. A browser provider may process audio remotely.

The evaluator matches selected intent synonyms, technical terms, polite wording, and a clear sentence-length range. It rejects common unsafe advice and insults, but is not a full semantic or grammar evaluator. Valid expressions may fall outside its patterns; guided phrases offer a transparent fallback. Scores and satisfaction are game mechanics, not validated English proficiency scores. Humans should review educational content and technical advice before classroom use.

## Validation

Node.js 18+ is sufficient for the dependency-free checks (tested with Node 24):

```sh
npm run check
npm test
```

The six unit tests cover all 45 guided answers, Luna synonyms, wrong/unsafe/rude responses, polite feedback, complete reward progression, and save corruption/unavailable storage. Browser integration tests cover the story, resume, replay, mobile overflow, settings, and simulated microphone states:

```sh
# Optional browser-test tooling; the application itself has no dependencies.
npm install --no-save --package-lock=false playwright
npx playwright install chromium
# Start the local server in another terminal first.
npm run test:browser
```

Set `CHROMIUM_PATH` to an installed Chromium executable to avoid downloading a browser. `GAME_TEST_URL` can select another server URL; default is http://127.0.0.1:8000. Automated speech tests simulate the browser API; an actual microphone and browser speech-service quality have not been tested. No human user-study results are claimed.

## Deploy on Vercel

Import this repository into Vercel and select **Other** as the framework. Use the repository root as Root Directory. `vercel.json` sets the build command to `npm run check && npm test` and output directory to `.`. There are no runtime dependencies, environment variables, or secrets. Vercel provides HTTPS for supported speech recognition. Deploy the reviewed commit through the Vercel dashboard; no deployment was performed by this implementation.

## Deploy on GitHub Pages

In repository **Settings → Pages**, select **Deploy from a branch**, the desired branch, and **/(root)**. All game asset and module paths are relative and work under a repository subpath. `.nojekyll` keeps this a plain static site. No build is required. GitHub Pages publication has not been performed.

## Credits and classroom review

Original artwork and content were produced with OpenAI Codex assistance. No external artwork or fonts are required. Runtime checks do not use AI. Fill in actual team member names, IDs, and contributions in GAME_DOCUMENT.md. Before presenting, review English and pedagogical value with the course team, and test real microphone support on the intended browser/device.
