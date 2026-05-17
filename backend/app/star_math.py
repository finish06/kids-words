"""Star-summary math shared across game progress endpoints.

Used by both `/api/progress` (Word Matching aggregate) and
`/api/word-builder/progress` to compute the `stars_earned` /
`stars_possible` fields surfaced on Home progress bars per
`specs/game-progress-bar.md`.

Forward-compatible with the proposed CVC builder
(`specs/cvc-builder.md`): its `/api/cvc-builder/progress` endpoint
will reuse this helper unchanged.
"""

from collections.abc import Iterable


def compute_star_summary(
    star_levels: Iterable[int],
    *,
    max_per_item: int,
) -> tuple[int, int]:
    """Return (stars_earned, stars_possible) for a set of tracked items.

    `star_levels` is the per-item star count (0..max_per_item). Anomalous
    values above `max_per_item` are capped (AC-022 defensive math).
    `stars_possible` = item_count × max_per_item.
    `stars_earned` is additionally capped at `stars_possible` so the
    progress bar can never exceed 100% even with corrupt data.
    """
    levels = list(star_levels)
    stars_possible = len(levels) * max_per_item
    stars_earned = sum(min(level, max_per_item) for level in levels)
    stars_earned = min(stars_earned, stars_possible)
    return stars_earned, stars_possible
