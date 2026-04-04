import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryWords } from "../api/client";
import { useRound } from "../hooks/useRound";
import type { CategoryDetail, Word } from "../types";
import { RoundComplete } from "./RoundComplete";

function MatchGame({
  words,
  category,
}: {
  words: Word[];
  category: CategoryDetail;
}) {
  const {
    currentWord,
    options,
    isCorrect,
    selectedId,
    isComplete,
    progress,
    handleSelect,
  } = useRound(words);
  const navigate = useNavigate();

  if (isComplete) {
    return (
      <RoundComplete
        categoryName={category.name}
        onPlayAgain={() => window.location.reload()}
        onHome={() => navigate("/")}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="match-round">
      <div className="round-header">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Back
        </button>
        <span className="category-label">{category.name}</span>
        <span className="progress">
          {progress.current} / {progress.total}
        </span>
      </div>

      <div className="word-display">
        <h1 className={`word-text ${isCorrect === true ? "correct" : ""}`}>
          {currentWord.text}
        </h1>
      </div>

      <div className="image-grid">
        {options.map((option) => {
          let cardClass = "image-card";
          if (selectedId === option.id && isCorrect === true) {
            cardClass += " correct";
          } else if (selectedId === option.id && isCorrect === false) {
            cardClass += " shake";
          }

          return (
            <button
              key={option.id}
              className={cardClass}
              onClick={() => handleSelect(option)}
              disabled={isCorrect === true}
            >
              <img
                src={option.image_url}
                alt={option.text}
                className="card-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector(".fallback")) {
                    const fallback = document.createElement("span");
                    fallback.className = "fallback";
                    fallback.textContent = option.text;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MatchRound() {
  const { slug } = useParams<{ slug: string }>();
  const [words, setWords] = useState<Word[]>([]);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    getCategoryWords(slug)
      .then((data) => {
        setWords(data.words);
        setCategory(data.category);
        setLoading(false);
      })
      .catch(() => {
        setError("Oops! Let's try again.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="match-round">
        <div className="loading">Loading words...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="match-round">
        <p className="error-text">{error ?? "Something went wrong"}</p>
        <button className="retry-button" onClick={() => navigate("/")}>
          Go Home
        </button>
      </div>
    );
  }

  return <MatchGame words={words} category={category} />;
}
