import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/client";

/**
 * Consolidated Word Matching card for the Home Games section.
 * Tap navigates to /matching where the 5 category cards live.
 * Shows a visible category-count hint pulled from the existing
 * /api/categories endpoint.
 */
export function WordMatchingCard() {
  const navigate = useNavigate();
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  useEffect(() => {
    getCategories()
      .then((data) => {
        // Exclude the hidden body-parts category from the count shown to kids,
        // same as WordMatchingSection's filter (cycle-13 hide decision).
        const visible = data.categories.filter((c) => c.slug !== "body-parts");
        setCategoryCount(visible.length);
      })
      .catch(() => {
        // Leave count null on failure — the card still navigates.
        setCategoryCount(null);
      });
  }, []);

  return (
    <button
      className="game-card game-card--word-matching"
      onClick={() => navigate("/matching")}
      aria-label="Word Matching game"
    >
      <div className="game-card-icon" aria-hidden="true">🎯</div>
      <div className="game-card-content">
        <h3 className="game-card-title">Word Matching</h3>
        <div className="game-card-subtitle">
          {categoryCount !== null
            ? `${categoryCount} categories`
            : "Match words to images"}
        </div>
      </div>
    </button>
  );
}
