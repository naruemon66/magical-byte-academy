# Cinematic artwork provenance

The V2 artwork was generated with the OpenAI image-generation tool for this implementation, using original Magical Byte Academy character descriptions and chamber requirements from GAME_DESIGN_V2.md. No supplied visual references or external franchise assets were used. No real-time geometry, rigging, or 3D renderer is present in the game.

## Chamber

`assets/chamber.webp`: a generated cinematic 3D-style illustration of an original castle support chamber. The brief specified carved arches, stained glass overlooking castle towers, royal-blue and amethyst shadows, warm amber floating candles, emerald crystals, levitating books and letters, antique wood, and a magical brass computer. The generated source was 1672 × 941 pixels. ImageMagick encoded it to WebP quality 84 without changing the composition.

## Cast atlas

`assets/cast.webp`: one generated 1774 × 887 image with exactly ten equally sized portraits, five columns and two rows. It was encoded with ImageMagick WebP quality 86. CSS uses background-size 500% 200% and positions each panel at 0%, 25%, 50%, 75%, or 100% horizontally and 0% or 100% vertically.

| Row | Portraits from left to right |
| --- | --- |
| Top | Luna, Mix, Direx, Celeste, Noah |
| Bottom | Professor Ivy, Aurora, Felix, Mochi, Serena |

The portrait brief specified distinct ages, hair, attire, roles, a diverse cast, three-dimensional stylized lighting, and consistent dark-blue backgrounds. Each character currently has **one** rendered expression. Dialogue reactions and CSS light/saturation vary with response feedback; they are not newly rendered facial expressions. The backgrounds deliberately remain part of the portrait illustrations and are softly blended into the scene.

The combined shipped assets are about 700 KB; a shared atlas avoids separate network loads for each portrait. Original generated PNG files are not required at runtime. Pixel-art SVG assets from V1 were removed from the application repository. No external fonts or image CDNs are required.

Presentation credits identify AI assistance. Team authorship and contributions must be documented by the actual team; no human artist or reviewer is invented here.
