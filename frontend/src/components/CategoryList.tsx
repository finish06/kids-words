import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/client";
import type { CategorySummary } from "../types";
import { Icon } from "./Icon";

const CATEGORY_ICONS: Record<string, string> = {
  animals: "paw",
  foods: "apple",
  colors: "palette",
};

const CATEGORY_ILLUSTRATIONS: Record<string, string> = {
  animals: "/illustrations/cat-animals.svg",
  foods: "/illustrations/cat-foods.svg",
  colors: "/illustrations/cat-colors.svg",
};

export function CategoryList() {
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

  if (loading) {
    return (
      <div className="category-list">
        <h1 className="title">Kids Words</h1>
        <div className="loading">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="category-list">
        <h1 className="title">Kids Words</h1>
        <p className="error-text">{error}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="category-list">
      <h1 className="title">Kids Words</h1>
      <p className="subtitle">Pick a category!</p>
      <div className="categories-grid">
        {categories.map((cat) => (
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
                <Icon name={CATEGORY_ICONS[cat.slug]} size={32} className="category-icon" />
              )}
              <span className="category-name">{cat.name}</span>
              <span className="category-count">
                {cat.word_count} words
              </span>
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
    </div>
  );
}
