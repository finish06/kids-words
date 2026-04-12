"""Body parts word list with OpenMoji emoji codes.

OpenMoji CDN:
  https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/{code}.png

License: CC BY-SA 4.0 (https://openmoji.org/)
"""

# (word_text, emoji_unicode_hex)
BODY_PARTS: list[tuple[str, str]] = [
    ("HEAD", "1F9D1"),  # person (head)
    ("FACE", "1F642"),  # slightly smiling face
    ("EYE", "1F441"),  # eye
    ("EAR", "1F442"),  # ear
    ("NOSE", "1F443"),  # nose
    ("MOUTH", "1F444"),  # mouth
    ("TOOTH", "1F9B7"),  # tooth
    ("TONGUE", "1F445"),  # tongue
    ("HAND", "270B"),  # raised hand
    ("FOOT", "1F9B6"),  # foot
    ("ARM", "1F4AA"),  # flexed biceps
    ("LEG", "1F9B5"),  # leg
    ("FINGER", "1F446"),  # pointing up
    ("KNEE", "1F9B5"),  # leg (proxy — no dedicated knee emoji)
    ("BONE", "1F9B4"),  # bone
    ("BRAIN", "1F9E0"),  # brain
    ("HEART", "1FAC0"),  # anatomical heart
    ("MUSCLE", "1F4AA"),  # flexed biceps
    ("NECK", "1F9E3"),  # scarf (proxy for neck)
    ("SHOULDER", "1F937"),  # shrug (proxy for shoulder)
    ("BACK", "1F9CD"),  # person standing (proxy)
    ("BELLY", "1F930"),  # pregnant (proxy for belly)
    ("THUMB", "1F44D"),  # thumbs up
    ("NAIL", "1F485"),  # nail polish
    ("HAIR", "1F9B1"),  # curly hair
]

# Deduplicate by word text
_seen: set[str] = set()
BODY_PARTS_UNIQUE: list[tuple[str, str]] = []
for word, code in BODY_PARTS:
    if word not in _seen:
        _seen.add(word)
        BODY_PARTS_UNIQUE.append((word, code))
