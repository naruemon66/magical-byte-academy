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
