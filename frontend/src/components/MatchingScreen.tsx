import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/client";
import type { CategorySummary } from "../types";
import { Icon } from "./Icon";

const CATEGORY_ICONS: Record<string, string> = {
  animals: "paw",
  food: "apple",
  colors: "palette",
};

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  animals: "/illustrations/cat-animals.svg",
  food: "/illustrations/cat-foods.svg",
  colors: "/illustrations/cat-colors.svg",
  shapes: "/illustrations/cat-shapes.svg",
  "body-parts": "/illustrations/cat-bodyparts.svg",
};

/**
 * Word Matching landing screen — `/matching`.
 *
 * Displays the 5 category cards (Animals, Colors, Food, Shapes, Body Parts).
 * Relocated from the Home screen in cycle-16 per specs/home-games-practice.md.
 * Handles loading, error, and empty states. Back navigates to Home.
 */
export function MatchingScreen() {
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then((data) => {
        setCategories(data.categories);
        setLoading(false);
      })
      .catch(() => {
        setError("Oops! Let's try again.");
        setLoading(false);
      });
  }, []);

  const visibleCategories = categories.filter((cat) => cat.slug !== "body-parts");

  return (
    <div className="matching-screen">
      <div className="matching-screen-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <Icon name="arrow-left" size={20} /> Back
        </button>
        <h1 className="matching-screen-title">Word Matching</h1>
      </div>

      {loading && (
        <div className="loading">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      )}

      {error && !loading && (
        <div className="matching-screen-error">
          <p className="error-text">{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && visibleCategories.length === 0 && (
        <div className="matching-screen-empty">
          <p>No categories yet — check back soon!</p>
        </div>
      )}

      {!loading && !error && visibleCategories.length > 0 && (
        <>
          <p className="matching-screen-subtitle">Pick a category!</p>
          <div className="categories-grid">
            {visibleCategories.map((cat) => (
              <div key={cat.id} className="category-card">
                {CATEGORY_ILLUSTRATIONS[cat.slug] && (
                  <img
                    src={CATEGORY_ILLUSTRATIONS[cat.slug]}
                    alt=""
                    className="category-illustration"
                  />
                )}
                <button
                  className="category-play-btn"
                  onClick={() => navigate(`/play/${cat.slug}`)}
                >
                  {CATEGORY_ICONS[cat.slug] && (
                    <Icon
                      name={CATEGORY_ICONS[cat.slug]}
                      size={32}
                      className="category-icon"
                    />
                  )}
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.word_count} words</span>
                </button>
                <button
                  className="category-words-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/words/${cat.slug}`);
                  }}
                >
                  <Icon name="book" size={16} /> View Words
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
