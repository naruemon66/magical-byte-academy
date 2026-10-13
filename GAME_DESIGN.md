# Magical Byte Academy: The Enchanted Help Desk

## 1. Game Concept

Create a complete, playable, story-driven English-learning browser game combining a visual novel, magical school storytelling, and an IT support simulator.

The player is a **Magical IT Advisor** working inside a cozy IT support office at a fantasy magic school.

**Important:** The player is NOT a student traveling around the school. The main gameplay takes place from the advisor's perspective, facing students, teachers, and school staff who visit the office to request help.

Each visitor has a unique personality, emotional situation, and technical problem. The player communicates with them in English, investigates the issue, and recommends solutions.

The game should feel like a charming indie visual novel rather than a conventional quiz website.

## 2. Target Audience and Learning Objectives

Target audience: Beginner-to-intermediate university Computer Science and IT students.

Learning objectives:
- Practice professional English greetings.
- Understand technical support requests.
- Ask diagnostic questions.
- Explain troubleshooting procedures.
- Use IT vocabulary appropriately.
- Practice English writing and speaking.
- Communicate politely and clearly.

## 3. Art Direction

Style: Kawaii Japanese anime pixel art, retro 1990s computer games, Windows 95/98 interfaces, and cozy magical school fantasy.

Colors:
- Pastel Pink: #F8BBD5
- Lavender: #E6D7FA
- Cream: #FFF1D9
- Mint: #C7EBDD
- Baby Blue: #BBDFF9
- Deep Purple: #594479

Create an immersive magical IT office with computers, bookshelves, magical decorations, plants, warm lighting, and a cozy café atmosphere.

The gameplay scene must feature expressive character portraits, visual novel dialogue boxes, character nameplates, support tickets, and retro computer windows.

Use original artwork or appropriately licensed assets. Do not use random emoji as substitutes for the main character illustrations.

## 4. Characters

**Luna:** A shy first-year witch who struggles with Wi-Fi and applications.

**Noah:** A friendly coding wizard who needs help debugging programs.

**Professor Ivy:** A technology professor who needs assistance with presentations and email.

**Mochi:** A mischievous magical cat who encounters password and account-security problems.

**Celeste:** A librarian who needs help organizing digital documents.

**Pixel:** A tiny computer fairy who provides hints and explains learning points.

Each character needs a consistent design, personality, expressions, and recurring storyline.

## 5. Story Chapters

Chapter 1 — First Day at the Academy:
1. Luna's Wi-Fi problem.
2. Celeste's missing digital files.
3. Professor Ivy's presentation problem.

Chapter 2 — Magical Technology Troubles:
4. Noah's programming syntax error.
5. Mochi's password-security problem.
6. Luna's frozen application.

Chapter 3 — The Academy System Crisis:
7. Professor Ivy's suspicious email.
8. Noah's network troubleshooting problem.
9. A final academy-wide technology crisis.

Implement nine complete support cases.

Each case must contain multiple conversational turns, including greeting, diagnostic questions, troubleshooting advice, follow-up explanations, and professional closing.

Use branching dialogue, emotional reactions, and character relationship development.

## 6. Core Gameplay Loop

Visitor Arrives → Story Dialogue → Player Responds in English → Educational Feedback → Investigation → Troubleshooting → Case Resolution → Rewards → Next Story.

The game must teach meaningful English communication rather than simple memorization.

## 7. English Response System

Players must choose between:

**Type Mode**
- Type a free-form English response.
- Submit, clear, request hints, and retry.

**Speak Mode**
- Speak through a microphone.
- Use browser SpeechRecognition or webkitSpeechRecognition when supported.
- Convert English speech into editable text.
- Confirm the transcript before submission.
- Provide clear errors and a typing fallback.

Do not claim pronunciation scoring without a genuine pronunciation assessment system.

## 8. English Evaluation

Implement a transparent rule-based English response evaluator that works without paid APIs.

Evaluate communication intent, technical relevance, politeness, clarity, and selected language patterns.

Support multiple natural English expressions and synonyms, not only exact text matching.

Give meaningful feedback explaining why a response is appropriate or how it can improve.

Include hints, example sentences, and retry opportunities.

If a free-form answer cannot be reliably evaluated, offer a guided phrase-building fallback.

Do not pretend the rule-based system uses a language model.

## 9. Rewards and Progression

Implement:
- Magic Stars
- Friendship Hearts
- Customer Satisfaction
- Experience Points
- Chapter unlocking
- Achievements
- Character relationships
- Automatic progress saving with LocalStorage

Optional additions after core gameplay works: Office decorations and an interactive magical desktop.

## 10. Main Screens

Create:
- Animated title screen
- Start and Continue
- English How to Play
- Settings and Credits
- Cozy magical IT office
- Visual novel conversations
- Support ticket panel
- English typing and speaking controls
- Educational feedback
- Case completion and rewards
- Story progression

Optional magical desktop applications: Inbox, Support Ticket Journal, Spellbook Dictionary, Friendship Journal, and Achievements.

All visible controls must function.

## 11. Technology

Use HTML5, CSS3, and vanilla JavaScript.

The game must work without a paid API, API key, or required backend.

Use LocalStorage for saving progress.

Make it responsive for desktop and mobile.

Support GitHub Pages deployment using relative asset paths.

## 12. University Assignment Requirements

This game is for course 273411, Communicative English for Computer and Information Technology.

The game must provide:
- Accurate and natural English
- Clear language-learning objectives
- Meaningful educational interactions
- A repeatable input → action → feedback → reward loop
- Explanatory feedback
- Responsible documentation of AI use
- English How to Play instructions
- English presentation readiness

Reported grading categories:
- English Accuracy: 25 points
- Pedagogical Value: 20 points
- Game Design: 20 points
- AI and Technology: 15 points
- Presentation: 15 points
- Completeness: 5 points

Create a concise one-page English Game Document including title, target learners, objectives, instructions, core loop, actual AI tools used, and placeholders for team members' names, student IDs, and contributions.

Do not invent team contributions or playtesting results.

## 13. Development Priorities

First, implement one polished and fully playable Luna support case.

Then implement the reusable dialogue engine, English evaluation, typing and speaking input, rewards, and save system.

Next, complete the remaining eight cases.

Finally, polish visuals, accessibility, documentation, and GitHub Pages deployment.

Prioritize a complete playable game over unfinished extra features.

Make actual code changes and test the implemented features.

Do not stop after producing a static mockup.

If implementation cannot be completed in one session, leave a working version and clearly document unfinished tasks.
