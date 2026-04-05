"""Expanded food word list with OpenMoji emoji codes.

OpenMoji CDN:
  https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/618x618/{code}.png

License: CC BY-SA 4.0 (https://openmoji.org/)
"""

# (word_text, emoji_unicode_hex)
FOODS: list[tuple[str, str]] = [
    # Fruits
    ("APPLE", "1F34E"),
    ("BANANA", "1F34C"),
    ("ORANGE", "1F34A"),
    ("LEMON", "1F34B"),
    ("STRAWBERRY", "1F353"),
    ("WATERMELON", "1F349"),
    ("GRAPE", "1F347"),
    ("PINEAPPLE", "1F34D"),
    ("PEACH", "1F351"),
    ("CHERRY", "1F352"),
    ("MELON", "1F348"),
    ("KIWI", "1F95D"),
    # Vegetables
    ("TOMATO", "1F345"),
    ("CARROT", "1F955"),
    ("CORN", "1F33D"),
    ("BROCCOLI", "1F966"),
    ("POTATO", "1F954"),
    ("CUCUMBER", "1F952"),
    ("AVOCADO", "1F951"),
    ("MUSHROOM", "1F344"),
    ("PEPPER", "1FAD1"),
    ("LETTUCE", "1F96C"),
    ("GARLIC", "1F9C4"),
    ("EGGPLANT", "1F346"),
    # Grains & bread
    ("BREAD", "1F35E"),
    ("RICE", "1F35A"),
    ("PASTA", "1F35D"),
    ("CROISSANT", "1F950"),
    ("WAFFLE", "1F9C7"),
    ("PRETZEL", "1F968"),
    # Main meals
    ("PIZZA", "1F355"),
    ("BURGER", "1F354"),
    ("HOT DOG", "1F32D"),
    ("TACO", "1F32E"),
    ("BURRITO", "1F32F"),
    ("SANDWICH", "1F96A"),
    ("SOUP", "1F372"),
    ("NOODLES", "1F35C"),
    ("SUSHI", "1F363"),
    ("CURRY", "1F35B"),
    # Proteins
    ("EGG", "1F95A"),
    ("CHICKEN LEG", "1F357"),
    ("STEAK", "1F969"),
    ("SHRIMP", "1F364"),
    # Dairy
    ("CHEESE", "1F9C0"),
    ("BUTTER", "1F9C8"),
    ("MILK", "1F95B"),
    # Snacks
    ("POPCORN", "1F37F"),
    ("PEANUT", "1F95C"),
    ("DUMPLING", "1F95F"),
    # Desserts & sweets
    ("ICE CREAM", "1F368"),
    ("CAKE", "1F370"),
    ("COOKIE", "1F36A"),
    ("CHOCOLATE", "1F36B"),
    ("DOUGHNUT", "1F369"),
    ("CANDY", "1F36C"),
    ("LOLLIPOP", "1F36D"),
    ("PUDDING", "1F36E"),
    ("HONEY", "1F36F"),
    ("PIE", "1F967"),
    ("CUPCAKE", "1F9C1"),
    # Drinks (kid-appropriate only)
    ("JUICE", "1F9C3"),
    ("TEA", "1F375"),
]

# Deduplicate by word text
_seen: set[str] = set()
FOODS_UNIQUE: list[tuple[str, str]] = []
for word, code in FOODS:
    if word not in _seen:
        _seen.add(word)
        FOODS_UNIQUE.append((word, code))
