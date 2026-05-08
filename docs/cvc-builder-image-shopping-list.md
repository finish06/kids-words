# CVC Builder — L1 Image Shopping List

**Author:** away-mode agent (cycle-17 prep)
**Date:** 2026-05-07
**Purpose:** Concrete asset spec for the 10 L1 short-`a` CVC words in `specs/cvc-builder.md`. Hand to an image-generation tool, illustrator, or stock-image search.
**Spec:** `specs/cvc-builder.md` AC-012 (L1 set), AC-021 (missing-image fallback)
**Target path:** `frontend/public/assets/cvc/{word}.png`
**Served at:** `/assets/cvc/{word}.png`

## Style guide (apply to every image)

| Property | Value | Why |
|----------|-------|-----|
| **Aspect ratio** | 1:1 (square) | Build screen card layout |
| **Resolution** | 1024×1024 PNG, transparent or solid pastel background | Retina-friendly; transparent = lets dark mode shine through |
| **Background** | Single soft pastel (or transparent) — NO scenes, no patterns | Reduces distraction for ages 4-6; matches the clean aesthetic of `WordMatchingCard` |
| **Subject** | One clear noun, centered, fills ~70% of frame | Recognition is the point; no Where's-Waldo |
| **Style** | Flat illustration with rounded shapes; thick friendly outlines (3-4 px); warm saturated colors | Khan-Academy-Kids / Endless-Alphabet adjacent; readable at thumbnail size |
| **Avoid** | Photorealism, complex scenes, multiple subjects, text in image, copyrighted characters, scary or adult subjects | Audience is 4-6 |
| **Dark-mode contrast** | Subject must remain readable against `#0f0f23` and `#1a1a2e` (the dark background gradient) | App auto-adapts to system theme |
| **Consistency** | All 10 L1 images should feel like one set: same line weight, same palette family, same illustration style | Set cohesion supports the "this is one game" mental model |

**Recommended palette** (project accent is `#6366f1` indigo with raspberry/purple gradients):
- Warm primaries: `#fcd34d` yellow, `#f87171` red, `#fb923c` orange, `#34d399` green, `#60a5fa` blue
- Avoid pure white background (clashes in dark mode); use very light gray `#f8fafc` or transparent.

## L1 word list

| # | Word | Subject suggestion | Framing | Notes for the artist/AI |
|---|------|-------------------|---------|-------------------------|
| 1 | **cat** | A cute domestic cat, seated, facing camera, big eyes, smiling expression | Centered, full body | Tabby orange or gray-and-white. The "default friendly cat." |
| 2 | **bat** | A baseball bat (NOT the animal — too scary for 4yo set) | Wooden bat, light brown, single bat, slight tilt | Or a softball bat. If you go animal-bat, use a cute cartoon style with closed wings. **Recommend baseball bat for least ambiguity.** |
| 3 | **hat** | A simple kid's sun hat or baseball cap | Centered, no head shown | Bright color (yellow or red). Plain — no logos, no patterns. |
| 4 | **mat** | A yoga mat (rolled flat, top-down view) OR a colorful welcome mat | Centered, single mat | Welcome mat with a smile or sun is fine. Avoid prison-mat / wrestling-mat connotations. |
| 5 | **sat** | A small dog or cat **sitting** with good posture | Side or 3/4 profile, sitting clearly visible | The verb "sat" is hardest to image. The TTS speaks the word; the image is associative — kids learn "sat" from context. Alt: a kid sitting on a chair. |
| 6 | **rat** | A friendly cartoon rat — NOT scary, big-eyed, smiling | Centered, full body, standing on hind legs | Mouse-adjacent; pink ears, gray fur, pink tail. Think Ratatouille's Remy. |
| 7 | **can** | A soda can or soup can | Single can, centered, label-free or simple geometric label | If labeled, use a colorful abstract pattern, NOT real brands. |
| 8 | **fan** | A desk fan (oscillating fan) | 3/4 angle, fan blades visible, motor base | NOT a sports fan, NOT a hand fan. The ubiquitous summer fan. |
| 9 | **man** | A friendly cartoon man — diverse default appearance | Waist-up, smiling, neutral clothing | Avoid stereotypes. Generic "person" energy. Could be a dad, a teacher, anyone. |
| 10 | **pan** | A frying pan, top-down or 3/4 angle | Single pan, black or copper, with handle visible | Empty pan. No food in it (would imply other words). |

## Production notes

### Generation prompt template (for AI image tools)

```
Flat illustration of a {SUBJECT}, centered on a soft {COLOR} background,
rounded friendly shapes, thick black outlines, warm saturated colors,
suitable for a children's reading app, ages 4-6, single subject fills
70% of frame, no text in image, no scenes, square 1:1 aspect ratio,
1024x1024.
```

Substitute `{SUBJECT}` and `{COLOR}` per row above. Generate 4-6 variants per word and pick the cleanest single-subject result.

### Manual sourcing alternative

If commissioning or stock-sourcing instead of generating:
- **Freepik / Vecteezy / Flaticon** with "kids", "flat illustration", "cartoon" filters
- **Watch licensing** — must be commercial-use-OK and redistributable inside the app bundle
- **Avoid clipart-vintage-clipart aesthetic** — looks dated and unloved on a modern tablet UI

### Acceptance criteria for each image

- [ ] Single subject, no scene
- [ ] Recognizable to a 4-year-old at 192×192 px (the card thumbnail size)
- [ ] Style consistent with the rest of the L1 set (same illustrator/prompt seed if possible)
- [ ] Readable against both light and dark app backgrounds
- [ ] No text in the image (the word is rendered separately by the UI)
- [ ] No copyrighted characters or trademarks
- [ ] PNG with alpha channel preferred (transparent background) — fall back to soft pastel solid

### File naming

Lowercase `{word}.png`. Examples:
```
frontend/public/assets/cvc/cat.png
frontend/public/assets/cvc/bat.png
frontend/public/assets/cvc/hat.png
frontend/public/assets/cvc/mat.png
frontend/public/assets/cvc/sat.png
frontend/public/assets/cvc/rat.png
frontend/public/assets/cvc/can.png
frontend/public/assets/cvc/fan.png
frontend/public/assets/cvc/man.png
frontend/public/assets/cvc/pan.png
```

The spec's missing-image fallback (AC-021) renders a sound icon if any of these are absent — implementation can ship before all 10 images land, but PAT requires the full set.

## Tricky words (decisions worth flagging when human returns)

1. **bat** — animal bat vs baseball bat. Recommend baseball (least ambiguous, no scary connotation for the audience).
2. **sat** — verb is hard to render unambiguously. Recommend "cat sitting" so the same cat character from `cat.png` reappears, providing visual continuity. Or kid-sitting-on-chair.
3. **rat** — cartoon vs realistic. Recommend cartoon (Remy / Stuart Little energy). A realistic rat is rough on the audience.
4. **man** — diversity defaults. Avoid making "the default man" any specific demographic; consider rotating or using a stylized non-specific cartoon person.

These are not decisions that have to be made before image generation — generate variants and pick.

## Out of scope

- Image generation pipeline / scripting (separate spec)
- L2 / L3 image sets (separate cycle, follow same style guide)
- Image-pulse / hover animation (handled in CSS by the BuildScreen, not in the asset)
- Audio assets — TTS handles all audio (`useSpeech` hook); no PNG-paired audio files.

## See also

- `specs/cvc-builder.md` — content layer + AC-021 missing-image fallback
- `.claude/rules/design-system.md` — global palette and visual conventions
- `.add/config.json` `branding.palette` — accent color tokens (currently indigo `#6366f1`)
