import { Icon } from "./Icon";

const QUIZ_LENGTHS = [5, 10, 20] as const;

export interface LengthPickerProps {
  title: string;
  subtitle?: string;
  maxWords: number;
  onPick: (count: number) => void;
  onBack: () => void;
}

/**
 * Shared length picker used by Word Matching (MatchRound) and
 * Word Builder (Build). Options above `maxWords` are disabled.
 */
export function LengthPicker({
  title,
  subtitle = "How many words?",
  maxWords,
  onPick,
  onBack,
}: LengthPickerProps) {
  return (
    <div className="quiz-picker">
      <button className="back-button" onClick={onBack}>
        <Icon name="arrow-left" size={20} /> Back
      </button>
      <h1 className="picker-title">{title}</h1>
      <p className="picker-subtitle">{subtitle}</p>
      <div className="picker-options">
        {QUIZ_LENGTHS.map((count) => (
          <button
            key={count}
            className="picker-button"
            onClick={() => onPick(count)}
            disabled={count > maxWords}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
}
