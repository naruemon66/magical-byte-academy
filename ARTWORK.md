# Original Cinematic Fantasy Visual Novel artwork

The castle in `assets/chamber.webp` is preserved from the existing game. All character assets are original AI-generated illustrations, made individually using the previous character identities as reference. They are detailed stylized fantasy images, not real-time 3D models.

## Separate full-body character files

`assets/characters/` contains ten genuine solo transparent WebP files: Luna, Mix, Direx, Celeste, Noah, Ivy, Aurora, Felix, Mochi and Serena. Each human image is 1024×1536 and shows the complete robe/shoes. Mochi is 1145×1374 and includes ears, paws and tail. Each file contains only that character; no image is extracted from an atlas or shared group crop.

Character design: Luna lavender/purple; Mix black/ruby; Direx silver beard/indigo; Celeste black bob/emerald; Noah chestnut/teal; Ivy blonde/pink; Aurora silver curls and dark skin/royal blue; Felix navy/amber; Mochi cream and lilac cat; Serena silver updo/white and gold. The same file is used in the layered poster, dialogue, quest list, journal and relationship appreciation screen. Dialogue enlarges its own single image for a close-up; appreciation shows the full figure. No other-character fragments can enter from neighboring atlas cells.

PNG outputs were encoded to WebP at quality 90 with alpha quality 100, without cropping or changing proportions. The ten character files total about 3.4 MB. CSS provides shadows, glow, 8px idle motion, speaking reactions, and reward entrance effects. Settings and reduced-motion preferences disable movement. The artwork itself currently has one expression per character; alternate expressions can be supplied in `character-art.js`, but no facial animation/lip sync is claimed.

## Honest failure behavior

There are no placeholder or wrong-character fallbacks. Missing artwork produces a readable notice; learning interactions remain usable. `character-art.js` maps each ID to its own PNG/WebP and optional expression files. The old atlas is removed from shipped assets.

## Verification

Image metadata confirms alpha channels for all ten files. Browser tests verify actual file loading and identity in both desktop and mobile, no overflow/canvas, idle and reduced motion, missing-image notices, ten-image poster composition and personalized appreciation. Full gameplay regression protects English response scoring, MCQ, simulated speech, rewards, saves and Endless. Human review remains needed for course delivery and real-device microphone behavior.

## The Arcanexus Royal Crest

Original generated transparent high fantasy shield, with royal blue/amethyst enamel, gold engraving, sapphire crown jewel, luminous spellbook conjuring AI chip/circuits/holographic displays and a named ribbon. `assets/branding/royal-crest.webp` is the large illustration (640px); a separately generated simplified text-free variant is encoded as `crest-small.webp` (192px), `favicon.png` (64px) and `apple-touch-icon.png` (180px). Full and mini PNG source outputs are retained in the cloud generated-images folder; shipped WebP/PNG files are ready to deploy. Total added branding assets are approximately 250 KB. No character, castle, or gameplay files are replaced for this branding change.

## Enchanted guide orb

`assets/branding/guide-orb.webp` is original generated transparent 480px art: glass sphere, swirling pink/violet/sky-blue magical liquid, enchanted cyan AI chip and circuits, gold/amethyst pedestal. WebP90/alpha100, about81KB. Both introductory guides use it; the nickname page uses the Royal Crest. This is finished artwork, not the earlier CSS gradient orb.

## Orion and Ember

Two additional original transparent solo illustrations: Orion the indigo/brown owl with cyan eyes, bronze glasses and crescent pendant; Ember the emerald/teal baby dragon with golden belly, violet-pink wings and amber eyes. Both full bodies include talons/paws/tail and are separate generated files, encoded WebP90/alpha100 without cropping. `assets/characters/orion.webp` and `ember.webp` share the cast pipeline. The poster now has12 visitors: nine humans at equal scale across rows (height varied through placement only) and three smaller creatures. Historical10-person descriptions above describe earlier versions.

### Enchanted feedback grimoire
`assets/branding/enchanted-grimoire.webp` is an original AI-generated transparent enchanted book with gold/amethyst covers and cyan holographic rune light. Encoded at 192px for compact feedback icons; no franchise reference or sprite cropping. Score-tier icons reuse the existing guide orb with CSS hue/frame differences; the safety tier uses the academy crest. Feedback icons are decorative, with tier text and numeric scores retained for accessibility.

### Six original Magical IT Advisors
`assets/advisors/{moon,flame,grove,rune,tide,storm}.webp` are six newly generated standalone portraits, NOT quest-character images. Each has an original face/hair identity and a shared navy/ivory/gold magical IT uniform: cyan circuit traces, visible IT badge, support headset, USB/cable tools and task-specific holographic screens. Original concept portraits were redesigned after the request for prominent IT identity. All six final images were visually inspected, preserve transparent corners and are encoded at 512×768 WebP. Advisor IDs remain unchanged for existing selections. Images are used only for advisor selection/profile, not the quest cast or graduation group.

### Semantic fantasy UI icons
`assets/ui/*.svg` are original locally drawn vector icons with gold engraving, amethyst fill and cyan accents. Lyre, gear, save document, clock/archive, journal, crystal, star and infinity rune directly represent their actions/statistics. No remote dependencies or generated placeholder art.

### Academy Story environments
`assets/lore/academy-exterior.webp` and `support-laboratory.webp` are newly AI-generated original cinematic fantasy environments: academy courtyard/spires and the magical IT support laboratory with laptops/holographic diagnostics. Both were visually inspected and WebP-encoded for the lore page. `assets/ui/academy.svg` is an original gold/amethyst tower icon for the Academy Story menu action. These environments do not replace gameplay scene assets.
