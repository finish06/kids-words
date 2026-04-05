"""Initial schema — all tables.

Revision ID: 001
Revises: None
Create Date: 2026-04-05

"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "profiles",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("color", sa.String(7), nullable=False, server_default="#9ca3af"),
        sa.Column("is_guest", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "parent_settings",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("pin_hash", sa.String(255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "categories",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column("icon_url", sa.String(500), nullable=True),
        sa.Column("display_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
    )
    op.create_index("ix_categories_slug", "categories", ["slug"])

    op.create_table(
        "words",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("text", sa.String(100), nullable=False),
        sa.Column("image_url", sa.String(500), nullable=False),
        sa.Column("category_id", sa.Uuid(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"]),
    )

    op.create_table(
        "match_results",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("word_id", sa.Uuid(), nullable=False),
        sa.Column("selected_word_id", sa.Uuid(), nullable=False),
        sa.Column("profile_id", sa.Uuid(), nullable=True),
        sa.Column("is_correct", sa.Boolean(), nullable=False),
        sa.Column("attempt_number", sa.Integer(), nullable=False, server_default="1"),
        sa.Column(
            "responded_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["word_id"], ["words.id"]),
        sa.ForeignKeyConstraint(["selected_word_id"], ["words.id"]),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"]),
    )

    op.create_table(
        "word_progress",
        sa.Column("id", sa.Uuid(), nullable=False),
        sa.Column("word_id", sa.Uuid(), nullable=False),
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
        sa.ForeignKeyConstraint(["word_id"], ["words.id"]),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"]),
        sa.UniqueConstraint("word_id", "profile_id", name="uq_word_profile"),
    )


def downgrade() -> None:
    op.drop_table("word_progress")
    op.drop_table("match_results")
    op.drop_table("words")
    op.drop_index("ix_categories_slug", "categories")
    op.drop_table("categories")
    op.drop_table("parent_settings")
    op.drop_table("profiles")
