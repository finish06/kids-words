import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryProgress } from "../api/client";
import type { CategoryDetail, WordProgressItem } from "../types";
import { ColorCircle, isColorUrl, parseColorHex } from "./ColorCircle";
import { Icon } from "./Icon";
import { Stars } from "./Stars";

export function WordList() {
  const { slug } = useParams<{ slug: string }>();
  const [words, setWords] = useState<WordProgressItem[]>([]);
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    getCategoryProgress(slug)
      .then((data) => {
        setWords(data.words);
        setCategory(data.category);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="word-list">
        <div className="loading">Loading words...</div>
      </div>
    );
  }

  return (
    <div className="word-list">
      <div className="round-header">
        <button className="back-button" onClick={() => navigate("/")}>
          <Icon name="arrow-left" size={20} /> Back
        </button>
        <span className="category-label">{category?.name} Words</span>
        <span className="progress">
          {words.filter((w) => w.star_level >= 3).length}/{words.length} mastered
        </span>
      </div>

      <div className="word-grid">
        {words.map((word) => (
          <div key={word.word_id} className="word-card">
            {isColorUrl(word.image_url) ? (
              <ColorCircle color={parseColorHex(word.image_url)} />
            ) : (
              <img
                src={word.image_url}
                alt={word.word_text}
                className="word-card-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <span className="word-card-text">{word.word_text}</span>
            <Stars level={word.star_level} size="small" />
          </div>
        ))}
      </div>
    </div>
  );
}
