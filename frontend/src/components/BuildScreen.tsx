import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getWordBuilderRound } from "../api/client";
import { useBuildRound } from "../hooks/useBuildRound";
import type { RoundResponse } from "../types";
import { BuildRoundComplete } from "./BuildRoundComplete";
import { Icon } from "./Icon";
import { LengthPicker } from "./LengthPicker";
import { LevelIndicator } from "./LevelIndicator";
import { PatternTile } from "./PatternTile";

function Build({
  round,
  level,
  onPlayAgain,
  onHome,
  levelUp,
}: {
  round: RoundResponse;
  level: number;
  onPlayAgain: () => void;
  onHome: () => void;
  levelUp: { newLevel: number; newPatterns: string[] } | null;
}) {
  const {
    currentChallenge,
    isCorrect,
    selectedPatternId,
    isComplete,
    progress,
    patternResults,
    handleSelect,
  } = useBuildRound(round.challenges);
  const [dismissedLevelUp, setDismissedLevelUp] = useState(false);

  if (isComplete) {
    return (
      <BuildRoundComplete
        patternResults={patternResults}
        levelUp={dismissedLevelUp ? null : levelUp}
        onDismissLevelUp={() => setDismissedLevelUp(true)}
        onPlayAgain={onPlayAgain}
        onHome={onHome}
      />
    );
  }

  if (!currentChallenge) {
    return (
      <div className="build-screen build-screen--loading">
        <div className="build-base-word build-base-word--skeleton" />
      </div>
    );
  }

  const prefixOptions = currentChallenge.options.filter(
    (o) => o.type === "prefix",
  );
  const suffixOptions = currentChallenge.options.filter(
    (o) => o.type === "suffix",
  );
  const tileState = (id: string): "default" | "correct" | "wrong" => {
    if (selectedPatternId !== id || isCorrect === null) return "default";
    return isCorrect ? "correct" : "wrong";
  };

  return (
    <div className="build-screen">
      <div className="build-header">
        <button className="back-button" onClick={onHome}>
          <Icon name="arrow-left" size={20} /> Back
        </button>
        <LevelIndicator level={level} />
        <div className="build-round-counter">
          Round {progress.current} of {progress.total}
        </div>
      </div>

      <div className="build-play-area">
        <div className="build-flank build-flank--left">
          {prefixOptions.length > 0 ? (
            prefixOptions.map((p) => (
              <PatternTile
                key={p.id}
                pattern={p}
                state={tileState(p.id)}
                onTap={handleSelect}
              />
            ))
          ) : (
            <div className="build-flank--empty" aria-hidden="true" />
          )}
        </div>

        <div className="build-center">
          <div
            className={`build-base-word${
              isCorrect ? " build-base-word--combined" : ""
            }`}
          >
            {isCorrect
              ? currentChallenge.result_word
              : currentChallenge.base_word}
          </div>
          {isCorrect && currentChallenge.definition && (
            <div className="build-definition">{currentChallenge.definition}</div>
          )}
        </div>

        <div className="build-flank build-flank--right">
          {suffixOptions.length > 0 ? (
            suffixOptions.map((p) => (
              <PatternTile
                key={p.id}
                pattern={p}
                state={tileState(p.id)}
                onTap={handleSelect}
              />
            ))
          ) : (
            <div className="build-flank--empty" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}

export function BuildScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const count = Number(searchParams.get("count") ?? 5);

  const [round, setRound] = useState<RoundResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Level-up modal detection deferred to a post-PAT cycle.
  // Backend's `GET /progress` already exposes the `unlocked` flag; frontend
  // can diff pre/post round progress in a follow-up cycle without needing
  // to change the useBuildRound hook shape.
  const levelUp = null as { newLevel: number; newPatterns: string[] } | null;

  useEffect(() => {
    let cancelled = false;
    getWordBuilderRound(count)
      .then((r) => {
        if (cancelled) return;
        setRound(r);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Hmm, let's try again!");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [count]);

  if (loading) {
    return (
      <div className="build-screen build-screen--loading">
        <div className="build-base-word build-base-word--skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="build-screen build-screen--error">
        <div className="error-text">{error}</div>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!round) return null;

  return (
    <Build
      round={round}
      level={round.level}
      levelUp={levelUp}
      onPlayAgain={() => navigate("/build")}
      onHome={() => navigate("/")}
    />
  );
}

export function BuildPicker() {
  const navigate = useNavigate();
  return (
    <LengthPicker
      title="Word Builder"
      subtitle="How many words?"
      maxWords={20}
      onPick={(count) => navigate(`/build/play?count=${count}`)}
      onBack={() => navigate("/")}
    />
  );
}
