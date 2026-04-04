"""Expanded animal word list with OpenMoji emoji codes.

OpenMoji CDN pattern:
  SVG: https://cdn.jsdelivr.net/npm/openmoji@15.1/color/svg/{CODE}.svg
  PNG 618px: https://cdn.jsdelivr.net/npm/openmoji@15.1/color/618x618/{CODE}.png

License: CC BY-SA 4.0 (https://openmoji.org/)
"""

# (word_text, emoji_unicode_hex)
ANIMALS: list[tuple[str, str]] = [
    # Farm animals
    ("COW", "1F404"),
    ("PIG", "1F437"),
    ("HORSE", "1F434"),
    ("SHEEP", "1F411"),
    ("GOAT", "1F410"),
    ("CHICKEN", "1F414"),
    ("ROOSTER", "1F413"),
    ("DUCK", "1F986"),
    ("TURKEY", "1F983"),
    ("DONKEY", "1F434"),  # horse face as proxy
    # Pets
    ("CAT", "1F431"),
    ("DOG", "1F436"),
    ("HAMSTER", "1F439"),
    ("RABBIT", "1F430"),
    ("MOUSE", "1F42D"),
    ("FISH", "1F41F"),
    ("BIRD", "1F426"),
    ("PARROT", "1F99C"),
    ("TURTLE", "1F422"),
    # Wild — Africa
    ("LION", "1F981"),
    ("ELEPHANT", "1F418"),
    ("GIRAFFE", "1F992"),
    ("ZEBRA", "1F993"),
    ("HIPPO", "1F99B"),
    ("RHINO", "1F98F"),
    ("GORILLA", "1F98D"),
    ("CHEETAH", "1F406"),
    ("LEOPARD", "1F406"),
    ("HYENA", "1F43A"),  # wolf face as proxy
    # Wild — Americas
    ("BEAR", "1F43B"),
    ("WOLF", "1F43A"),
    ("FOX", "1F98A"),
    ("DEER", "1F98C"),
    ("MOOSE", "1F98C"),
    ("BISON", "1F9AC"),
    ("RACCOON", "1F99D"),
    ("SKUNK", "1F9A8"),
    ("BEAVER", "1F9AB"),
    ("OTTER", "1F9A6"),
    # Wild — Asia & Australia
    ("PANDA", "1F43C"),
    ("TIGER", "1F42F"),
    ("MONKEY", "1F435"),
    ("KOALA", "1F428"),
    ("KANGAROO", "1F998"),
    ("SLOTH", "1F9A5"),
    ("ORANGUTAN", "1F9A7"),
    ("CAMEL", "1F42A"),
    ("LLAMA", "1F999"),
    ("YAK", "1F9AC"),
    # Ocean
    ("WHALE", "1F433"),
    ("DOLPHIN", "1F42C"),
    ("SHARK", "1F988"),
    ("OCTOPUS", "1F419"),
    ("SQUID", "1F991"),
    ("SEAL", "1F9AD"),
    ("CRAB", "1F980"),
    ("LOBSTER", "1F99E"),
    ("SHRIMP", "1F990"),
    ("JELLYFISH", "1FABC"),
    # Reptiles & amphibians
    ("FROG", "1F438"),
    ("SNAKE", "1F40D"),
    ("LIZARD", "1F98E"),
    ("CROCODILE", "1F40A"),
    ("DINOSAUR", "1F995"),
    ("DRAGON", "1F409"),
    # Birds
    ("EAGLE", "1F985"),
    ("OWL", "1F989"),
    ("PENGUIN", "1F427"),
    ("FLAMINGO", "1F9A9"),
    ("PEACOCK", "1F99A"),
    ("SWAN", "1F9A2"),
    ("DOVE", "1F54A"),
    ("DODO", "1F9A4"),
    ("GOOSE", "1FABF"),
    # Bugs & insects
    ("BEE", "1F41D"),
    ("ANT", "1F41C"),
    ("BEETLE", "1FAB2"),
    ("BUTTERFLY", "1F98B"),
    ("LADYBUG", "1F41E"),
    ("SPIDER", "1F577"),
    ("SNAIL", "1F40C"),
    ("WORM", "1FAB1"),
    ("CRICKET", "1F997"),
    ("FLY", "1FAB0"),
    # More animals
    ("BAT", "1F987"),
    ("HEDGEHOG", "1F994"),
    ("SQUIRREL", "1F43F"),
    ("BADGER", "1F9A1"),
    ("MOUSE", "1F401"),
    ("RAT", "1F400"),
    ("PIG", "1F416"),
    ("RAM", "1F40F"),
    ("MAMMOTH", "1F9A3"),
    ("UNICORN", "1F984"),
    ("CATERPILLAR", "1F41B"),
    ("SCORPION", "1F982"),
    ("MOSQUITO", "1F99F"),
    ("MICROBE", "1F9A0"),
    ("TROPICAL FISH", "1F420"),
    ("BLOWFISH", "1F421"),
    ("PUPPY", "1F415"),
    ("KITTEN", "1F408"),
]

# Deduplicate by word text (keep first occurrence)
_seen: set[str] = set()
ANIMALS_UNIQUE: list[tuple[str, str]] = []
for word, code in ANIMALS:
    if word not in _seen:
        _seen.add(word)
        ANIMALS_UNIQUE.append((word, code))

OPENMOJI_CDN = "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/{code}.png"


def get_image_url(emoji_code: str) -> str:
    """Get the OpenMoji CDN URL for an emoji code."""
    return OPENMOJI_CDN.format(code=emoji_code)
