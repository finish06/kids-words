export interface LevelUpModalProps {
  newLevel: number;
  newPatterns: string[];
  onDismiss: () => void;
}

export function LevelUpModal({
  newLevel,
  newPatterns,
  onDismiss,
}: LevelUpModalProps) {
  return (
    <div className="level-up-modal-backdrop" role="dialog" aria-modal="true">
      <div className="level-up-modal">
        <div className="level-up-modal-title">
          ✨ Level {newLevel} Unlocked! ✨
        </div>
        <div className="level-up-modal-body">
          You&rsquo;ve mastered Level {newLevel - 1}.
          {newPatterns.length > 0 && (
            <>
              <br />
              New patterns: {newPatterns.join(", ")}
            </>
          )}
        </div>
        <button className="level-up-modal-button" onClick={onDismiss}>
          Let&rsquo;s go!
        </button>
      </div>
    </div>
  );
}
