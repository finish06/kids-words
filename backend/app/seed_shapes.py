"""Shape word list with OpenMoji emoji codes.

OpenMoji CDN:
  https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/{code}.png

License: CC BY-SA 4.0 (https://openmoji.org/)
"""

# (word_text, emoji_unicode_hex)
SHAPES: list[tuple[str, str]] = [
    ("CIRCLE", "1F534"),  # red circle
    ("SQUARE", "1F7E8"),  # yellow square
    ("TRIANGLE", "1F53A"),  # red triangle pointed up
    ("STAR", "2B50"),  # star
    ("HEART", "2764"),  # red heart (shape)
    ("DIAMOND", "1F537"),  # large blue diamond
    ("RECTANGLE", "1F7E9"),  # green square (proxy)
    ("OVAL", "1F7E0"),  # orange circle (proxy)
    ("PENTAGON", "2B1F"),  # black pentagon
    ("HEXAGON", "2B22"),  # black hexagon
    ("ARROW", "27A1"),  # right arrow
    ("CRESCENT", "1F319"),  # crescent moon
    ("CROSS", "271D"),  # latin cross
    ("RING", "1F48D"),  # ring
    ("CUBE", "1F532"),  # black square button
    ("SPHERE", "1F30D"),  # globe (proxy for sphere)
    ("CONE", "1F4D0"),  # triangular ruler (proxy)
    ("CYLINDER", "1F9F4"),  # lotion bottle (cylinder shape)
    ("SPIRAL", "1F300"),  # cyclone / spiral
    ("INFINITY", "267E"),  # infinity
]

# Deduplicate by word text
_seen: set[str] = set()
SHAPES_UNIQUE: list[tuple[str, str]] = []
for word, code in SHAPES:
    if word not in _seen:
        _seen.add(word)
        SHAPES_UNIQUE.append((word, code))
