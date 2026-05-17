"""Unit tests for `app.star_math.compute_star_summary`.

Pure function, no DB. Testing the math contract documented in
`specs/game-progress-bar.md` AC-005, AC-011, AC-022, AC-017.
"""

from app.star_math import compute_star_summary


def test_empty_iterable_returns_zero_zero() -> None:
    earned, possible = compute_star_summary([], max_per_item=3)
    assert earned == 0
    assert possible == 0


def test_all_zeros_returns_zero_earned() -> None:
    earned, possible = compute_star_summary([0, 0, 0, 0, 0], max_per_item=3)
    assert earned == 0
    assert possible == 15


def test_mixed_levels_sum_correctly() -> None:
    earned, possible = compute_star_summary([3, 2, 1, 0, 0], max_per_item=3)
    assert earned == 6
    assert possible == 15


def test_all_max_returns_full() -> None:
    earned, possible = compute_star_summary([3, 3, 3], max_per_item=3)
    assert earned == 9
    assert possible == 9


def test_per_item_cap_clips_anomalous_values() -> None:
    """A single corrupt row at star_level=99 contributes only 3 stars."""
    earned, possible = compute_star_summary([99, 0, 0], max_per_item=3)
    assert earned == 3
    assert possible == 9


def test_total_cap_holds_when_per_item_cap_already_applied() -> None:
    """Even after per-item capping, total never exceeds possible."""
    earned, possible = compute_star_summary([3, 3, 3, 3], max_per_item=3)
    assert earned == 12
    assert possible == 12
    assert earned <= possible


def test_max_per_item_keyword_only() -> None:
    """`max_per_item` is keyword-only — protects against arg ordering bugs."""
    import pytest

    with pytest.raises(TypeError):
        compute_star_summary([1, 2, 3], 3)  # type: ignore[misc]


def test_works_with_generator() -> None:
    """Iterable input — supports generator expressions used by the routes."""
    levels_gen = (level for level in [1, 2, 3])
    earned, possible = compute_star_summary(levels_gen, max_per_item=3)
    assert earned == 6
    assert possible == 9
