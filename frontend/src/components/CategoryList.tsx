import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api/client";
import type { CategorySummary } from "../types";

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
          <div key={cat.id} className="category-card-wrapper">
            <button
              className="category-card"
              onClick={() => navigate(`/play/${cat.slug}`)}
            >
              <span className="category-name">{cat.name}</span>
              <span className="category-count">
                {cat.word_count} words
              </span>
            </button>
            <button
              className="view-words-link"
              onClick={() => navigate(`/words/${cat.slug}`)}
            >
              View Words
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
