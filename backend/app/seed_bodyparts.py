"""Body parts word list using custom bodypart:// URL scheme.

Images are rendered as inline SVG by the frontend BodyPartImage component,
not fetched from a CDN. The URL format is: bodypart://{WORD_TEXT}

Each body part maps to a friendly cartoon-style SVG in the frontend.
"""

# (word_text, image_url)
BODY_PARTS: list[tuple[str, str]] = [
    ("HEAD", "bodypart://HEAD"),
    ("FACE", "bodypart://FACE"),
    ("EYE", "bodypart://EYE"),
    ("EAR", "bodypart://EAR"),
    ("NOSE", "bodypart://NOSE"),
    ("MOUTH", "bodypart://MOUTH"),
    ("TOOTH", "bodypart://TOOTH"),
    ("TONGUE", "bodypart://TONGUE"),
    ("HAND", "bodypart://HAND"),
    ("FOOT", "bodypart://FOOT"),
    ("ARM", "bodypart://ARM"),
    ("LEG", "bodypart://LEG"),
    ("FINGER", "bodypart://FINGER"),
    ("KNEE", "bodypart://KNEE"),
    ("BONE", "bodypart://BONE"),
    ("BRAIN", "bodypart://BRAIN"),
    ("HEART", "bodypart://HEART"),
    ("MUSCLE", "bodypart://MUSCLE"),
    ("NECK", "bodypart://NECK"),
    ("SHOULDER", "bodypart://SHOULDER"),
    ("BACK", "bodypart://BACK"),
    ("BELLY", "bodypart://BELLY"),
    ("THUMB", "bodypart://THUMB"),
    ("NAIL", "bodypart://NAIL"),
    ("HAIR", "bodypart://HAIR"),
]

# Deduplicate by word text
_seen: set[str] = set()
BODY_PARTS_UNIQUE: list[tuple[str, str]] = []
for word, url in BODY_PARTS:
    if word not in _seen:
        _seen.add(word)
        BODY_PARTS_UNIQUE.append((word, url))
