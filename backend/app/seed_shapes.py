"""Shape word list using custom shape:// URL scheme.

Images are rendered as inline SVG by the frontend ShapeImage component,
not fetched from a CDN. The URL format is: shape://{WORD_TEXT}

Each shape maps to a colorful geometric SVG in the frontend.
"""

# (word_text, image_url)
SHAPES: list[tuple[str, str]] = [
    ("CIRCLE", "shape://CIRCLE"),
    ("SQUARE", "shape://SQUARE"),
    ("TRIANGLE", "shape://TRIANGLE"),
    ("STAR", "shape://STAR"),
    ("HEART", "shape://HEART"),
    ("DIAMOND", "shape://DIAMOND"),
    ("RECTANGLE", "shape://RECTANGLE"),
    ("OVAL", "shape://OVAL"),
    ("PENTAGON", "shape://PENTAGON"),
    ("HEXAGON", "shape://HEXAGON"),
    ("ARROW", "shape://ARROW"),
    ("CRESCENT", "shape://CRESCENT"),
    ("CROSS", "shape://CROSS"),
    ("RING", "shape://RING"),
    ("CUBE", "shape://CUBE"),
    ("SPHERE", "shape://SPHERE"),
    ("CONE", "shape://CONE"),
    ("CYLINDER", "shape://CYLINDER"),
    ("SPIRAL", "shape://SPIRAL"),
    ("SEMICIRCLE", "shape://SEMICIRCLE"),
    ("OCTAGON", "shape://OCTAGON"),
    ("DECAGON", "shape://DECAGON"),
]

# Deduplicate by word text
_seen: set[str] = set()
SHAPES_UNIQUE: list[tuple[str, str]] = []
for word, url in SHAPES:
    if word not in _seen:
        _seen.add(word)
        SHAPES_UNIQUE.append((word, url))
