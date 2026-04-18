import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryWords } from "../api/client";
import { useRound } from "../hooks/useRound";
import type { CategoryDetail, Word } from "../types";
import { BodyPartImage } from "./BodyPartImage";
import { ColorCircle } from "./ColorCircle";
import { isBodyPartUrl, isColorUrl, isShapeUrl, parseBodyPartName, parseColorHex, parseShapeName } from "./colorUtils";
import { ShapeImage } from "./ShapeImage";
import { Icon } from "./Icon";
import { LengthPicker } from "./LengthPicker";
import { RoundComplete } from "./RoundComplete";

// QuizLengthPicker shim: thin wrapper over shared LengthPicker that preserves
// MatchRound's existing call sites (categoryName prop).
function QuizLengthPicker({
  categoryName,
  maxWords,
  onPick,
  onBack,
}: {
  categoryName: string;
  maxWords: number;
  onPick: (count: number) => void;
  onBack: () => void;
}) {
  return (
    <LengthPicker
      title={categoryName}
      maxWords={maxWords}
      onPick={onPick}
      onBack={onBack}
    />
  );
}

function MatchGame({
  words,
  category,
  onPlayAgain,
}: {
  words: Word[];
  category: CategoryDetail;
  onPlayAgain: () => void;
}) {
  const {
    currentWord,
    options,
    isCorrect,
    selectedId,
    isComplete,
    progress,
    wordResults,
    handleSelect,
  } = useRound(words);
  const navigate = useNavigate();

  if (isComplete) {
    return (
      <RoundComplete
        categoryName={category.name}
        wordResults={wordResults}
        onPlayAgain={onPlayAgain}
        onHome={() => navigate("/")}
      />
    );
  }

  if (!currentWord) return null;

  return (
    <div className="match-round">
      <div className="round-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <Icon name="arrow-left" size={20} /> Back
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
              {isColorUrl(option.image_url) ? (
                <ColorCircle color={parseColorHex(option.image_url)} />
              ) : isShapeUrl(option.image_url) ? (
                <ShapeImage name={parseShapeName(option.image_url)} />
              ) : isBodyPartUrl(option.image_url) ? (
                <BodyPartImage name={parseBodyPartName(option.image_url)} />
              ) : (
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
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function MatchRound() {
  const { slug } = useParams<{ slug: string }>();
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [quizWords, setQuizWords] = useState<Word[] | null>(null);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    getCategoryWords(slug)
      .then((data) => {
        setAllWords(data.words);
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

  if (!quizWords) {
    return (
      <QuizLengthPicker
        categoryName={category.name}
        maxWords={allWords.length}
        onPick={(count) => {
          const shuffled = [...allWords].sort(() => Math.random() - 0.5);
          setQuizWords(shuffled.slice(0, count));
        }}
        onBack={() => navigate("/")}
      />
    );
  }

  return (
    <MatchGame
      words={quizWords}
      category={category}
      onPlayAgain={() => setQuizWords(null)}
    />
  );
}
