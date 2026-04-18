"""Seed Level-1 content for the Word Builder mode (M7 cycle-12 scope).

Level 1 per spec AC-008: UN-, RE-, -ING, -ED, -S, -ER.
Six patterns × ~15 base words → ~30 valid combos with child-friendly definitions.

Idempotent by the same contract as `seed.py`:
- Adds missing rows (patterns, base_words, combos)
- Updates changed definition strings
- Removes combos whose (base_word, pattern) pair is no longer in the source set

Levels 2 and 3 will be added in a later cycle (deferred per cycle-12 Q5 answer).
"""

import asyncio
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings
from app.models import BaseWord, Pattern, WordCombo

PATTERNS: list[dict[str, Any]] = [
    {"text": "UN-", "type": "prefix", "level": 1, "meaning": "not"},
    {"text": "RE-", "type": "prefix", "level": 1, "meaning": "again"},
    {"text": "-ING", "type": "suffix", "level": 1, "meaning": "action"},
    {"text": "-ED", "type": "suffix", "level": 1, "meaning": "past"},
    {"text": "-S", "type": "suffix", "level": 1, "meaning": "plural"},
    {"text": "-ER", "type": "suffix", "level": 1, "meaning": "one who"},
]

BASE_WORDS: list[dict[str, Any]] = [
    {"text": "PLAY", "level": 1},
    {"text": "HAPPY", "level": 1},
    {"text": "RUN", "level": 1},
    {"text": "JUMP", "level": 1},
    {"text": "KIND", "level": 1},
    {"text": "READ", "level": 1},
    {"text": "WRITE", "level": 1},
    {"text": "TEACH", "level": 1},
    {"text": "SING", "level": 1},
    {"text": "DANCE", "level": 1},
    {"text": "PAINT", "level": 1},
    {"text": "DOG", "level": 1},
    {"text": "CAT", "level": 1},
    {"text": "FISH", "level": 1},
    {"text": "BOOK", "level": 1},
]

# (base_word, pattern, result_word, definition used as spoken clue)
# Clue pattern discipline (cycle-15, revised after initial PAT):
#   UN-   → "not X"
#   RE-   → "X it again"
#   -ING  → "X right now"          (bare base; doesn't leak the -ING form)
#   -ED   → "did X"                (past auxiliary + bare base; no -ED leak)
#   -S    → "more than one X"
#   -ER   → "people who X"         (plural + bare base; no -S or -ER leak)
# Each clue unambiguously points to its pattern so challenges have
# no false-negative feedback (cycle-13 PAT finding, resolved cycle-15).
# Initial cycle-15 clues used inflected base forms which accidentally
# contained the answer (e.g., "jumping right now" revealed JUMPING);
# revised to use bare base verb forms.
COMBOS: list[dict[str, str]] = [
    # UN- (not)
    {"base": "HAPPY", "pattern": "UN-", "result": "UNHAPPY", "def": "not happy"},
    {"base": "KIND", "pattern": "UN-", "result": "UNKIND", "def": "not kind"},
    # RE- (again)
    {"base": "PLAY", "pattern": "RE-", "result": "REPLAY", "def": "play it again"},
    {"base": "READ", "pattern": "RE-", "result": "REREAD", "def": "read it again"},
    {
        "base": "WRITE",
        "pattern": "RE-",
        "result": "REWRITE",
        "def": "write it again",
    },
    {
        "base": "PAINT",
        "pattern": "RE-",
        "result": "REPAINT",
        "def": "paint it again",
    },
    # -ING (action right now)
    {"base": "PLAY", "pattern": "-ING", "result": "PLAYING", "def": "play right now"},
    {"base": "RUN", "pattern": "-ING", "result": "RUNNING", "def": "run right now"},
    {"base": "JUMP", "pattern": "-ING", "result": "JUMPING", "def": "jump right now"},
    {"base": "SING", "pattern": "-ING", "result": "SINGING", "def": "sing right now"},
    {
        "base": "DANCE",
        "pattern": "-ING",
        "result": "DANCING",
        "def": "dance right now",
    },
    {"base": "READ", "pattern": "-ING", "result": "READING", "def": "read right now"},
    {
        "base": "PAINT",
        "pattern": "-ING",
        "result": "PAINTING",
        "def": "paint right now",
    },
    # -ED (past)
    {"base": "PLAY", "pattern": "-ED", "result": "PLAYED", "def": "did play"},
    {"base": "JUMP", "pattern": "-ED", "result": "JUMPED", "def": "did jump"},
    {"base": "PAINT", "pattern": "-ED", "result": "PAINTED", "def": "did paint"},
    {"base": "DANCE", "pattern": "-ED", "result": "DANCED", "def": "did dance"},
    # -S (plural)
    {"base": "DOG", "pattern": "-S", "result": "DOGS", "def": "more than one dog"},
    {"base": "CAT", "pattern": "-S", "result": "CATS", "def": "more than one cat"},
    # FISH + -S = FISHS dropped (FISHS is not a valid English word; the real
    # plural is FISHES, and -ES is not a Level-1 pattern). Drop removes it
    # from the DB on next seed via idempotent-seed's auto-remove logic.
    {
        "base": "BOOK",
        "pattern": "-S",
        "result": "BOOKS",
        "def": "more than one book",
    },
    # -ER (people who do the thing)
    {"base": "PLAY", "pattern": "-ER", "result": "PLAYER", "def": "people who play"},
    {"base": "RUN", "pattern": "-ER", "result": "RUNNER", "def": "people who run"},
    {"base": "JUMP", "pattern": "-ER", "result": "JUMPER", "def": "people who jump"},
    {"base": "READ", "pattern": "-ER", "result": "READER", "def": "people who read"},
    {
        "base": "WRITE",
        "pattern": "-ER",
        "result": "WRITER",
        "def": "people who write",
    },
    {
        "base": "TEACH",
        "pattern": "-ER",
        "result": "TEACHER",
        "def": "people who teach",
    },
    {"base": "SING", "pattern": "-ER", "result": "SINGER", "def": "people who sing"},
    {
        "base": "DANCE",
        "pattern": "-ER",
        "result": "DANCER",
        "def": "people who dance",
    },
    {
        "base": "PAINT",
        "pattern": "-ER",
        "result": "PAINTER",
        "def": "people who paint",
    },
]


async def seed_word_builder(db_url: str | None = None) -> None:
    url = db_url or settings.database_url
    engine = create_async_engine(url)
    session_factory = async_sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )

    async with session_factory() as session:
        added_patterns = 0
        added_base_words = 0
        added_combos = 0
        updated_combos = 0
        removed_combos = 0

        # Upsert patterns
        pattern_by_text: dict[str, Pattern] = {}
        for data in PATTERNS:
            pat_result = await session.execute(
                select(Pattern).where(Pattern.text == data["text"])
            )
            existing_pattern: Pattern | None = pat_result.scalar_one_or_none()
            if existing_pattern is None:
                p = Pattern(
                    text=data["text"],
                    type=data["type"],
                    level=data["level"],
                    meaning=data["meaning"],
                )
                session.add(p)
                await session.flush()
                pattern_by_text[p.text] = p
                added_patterns += 1
            else:
                if existing_pattern.meaning != data["meaning"]:
                    existing_pattern.meaning = data["meaning"]
                pattern_by_text[existing_pattern.text] = existing_pattern

        # Upsert base_words
        base_word_by_text: dict[str, BaseWord] = {}
        for data in BASE_WORDS:
            bw_result = await session.execute(
                select(BaseWord).where(BaseWord.text == data["text"])
            )
            existing_bw: BaseWord | None = bw_result.scalar_one_or_none()
            if existing_bw is None:
                bw = BaseWord(text=data["text"], level=data["level"])
                session.add(bw)
                await session.flush()
                base_word_by_text[bw.text] = bw
                added_base_words += 1
            else:
                base_word_by_text[existing_bw.text] = existing_bw

        # Upsert combos, key = (base_word_id, pattern_id)
        seed_combo_keys: set[tuple[str, str]] = set()
        for data in COMBOS:
            base = base_word_by_text[data["base"]]
            pattern = pattern_by_text[data["pattern"]]
            seed_combo_keys.add((str(base.id), str(pattern.id)))

            combo_result = await session.execute(
                select(WordCombo).where(
                    WordCombo.base_word_id == base.id,
                    WordCombo.pattern_id == pattern.id,
                )
            )
            existing_combo: WordCombo | None = combo_result.scalar_one_or_none()
            if existing_combo is None:
                session.add(
                    WordCombo(
                        base_word_id=base.id,
                        pattern_id=pattern.id,
                        result_word=data["result"],
                        definition=data["def"],
                    )
                )
                added_combos += 1
            elif (
                existing_combo.result_word != data["result"]
                or existing_combo.definition != data["def"]
            ):
                existing_combo.result_word = data["result"]
                existing_combo.definition = data["def"]
                updated_combos += 1

        # Remove combos no longer in seed source
        all_combos_result = await session.execute(select(WordCombo))
        for combo in all_combos_result.scalars().all():
            key = (str(combo.base_word_id), str(combo.pattern_id))
            if key not in seed_combo_keys:
                await session.delete(combo)
                removed_combos += 1

        await session.commit()

        changes = {
            "patterns": added_patterns,
            "base_words": added_base_words,
            "combos": added_combos,
            "combos_updated": updated_combos,
            "combos_removed": removed_combos,
        }
        if not any(changes.values()):
            print("Word Builder data already up to date.")
        else:
            non_zero = {k: v for k, v in changes.items() if v}
            print(f"Word Builder seed complete: {non_zero}")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed_word_builder())
