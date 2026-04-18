"""M7 Word Builder — 4 new tables.

Revision ID: 002
Revises: 001
Create Date: 2026-04-18

Adds Pattern, BaseWord, WordCombo, and PatternProgress to support the
word-builder learning mode (prefix/suffix tiles with adaptive difficulty).

- `patterns`: prefix/suffix tiles (UN-, RE-, -ING, etc.) with level + meaning
- `base_words`: base words (PLAY, HAPPY, RUN, ...) with level
- `word_combos`: valid (base_word, pattern) pairs with result_word + definition
- `pattern_progress`: profile-scoped mastery per pattern, same star thresholds
  as word_progress (2→1★, 4→2★, 7+→3★)
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "002"
down_revision: str | None = "001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "patterns",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("text", sa.String(20), nullable=False),
        sa.Column("type", sa.String(10), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False),
        sa.Column("meaning", sa.String(100), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("text"),
    )
    op.create_index("ix_patterns_level", "patterns", ["level"])

    op.create_table(
        "base_words",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("text", sa.String(50), nullable=False),
        sa.Column("level", sa.Integer(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("text"),
    )

    op.create_table(
        "word_combos",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("base_word_id", sa.Uuid(), nullable=False),
        sa.Column("pattern_id", sa.Uuid(), nullable=False),
        sa.Column("result_word", sa.String(100), nullable=False),
        sa.Column("definition", sa.String(200), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["base_word_id"], ["base_words.id"]),
        sa.ForeignKeyConstraint(["pattern_id"], ["patterns.id"]),
        sa.UniqueConstraint("base_word_id", "pattern_id", name="uq_combo_base_pattern"),
    )

    op.create_table(
        "pattern_progress",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("pattern_id", sa.Uuid(), nullable=False),
        sa.Column("profile_id", sa.Uuid(), nullable=False),
        sa.Column(
            "first_attempt_correct_count",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
        sa.Column("star_level", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("mastered_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["pattern_id"], ["patterns.id"]),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"]),
        sa.UniqueConstraint("pattern_id", "profile_id", name="uq_pattern_profile"),
    )


def downgrade() -> None:
    # Reverse FK order: child tables first, then parents.
    op.drop_table("pattern_progress")
    op.drop_table("word_combos")
    op.drop_table("base_words")
    op.drop_index("ix_patterns_level", "patterns")
    op.drop_table("patterns")
