// Word Builder is gated behind "Coming soon" as of cycle-14 (2026-04-18)
// after PAT surfaced a design ambiguity: challenges allow multiple valid
// English answers (e.g., PAINT + -S = PAINTS, PAINT + -ED = PAINTED — both
// real words) but the current challenge model marks only one as correct.
//
// Backend (cycle-12) + frontend (cycle-13) + routes (/build, /build/play)
// remain shipped for internal access and future re-enablement. The Home
// card is disabled to prevent user confusion until the challenge model
// is re-designed (candidates: target-word / instruction-based / reverse /
// multi-correct — see cycle-13 PAT discussion).
export function WordBuilderCard() {
  return (
    <div
      className="game-card game-card--word-builder game-card--disabled"
      aria-label="Word Builder game — coming soon"
    >
      <div className="game-card-icon" aria-hidden="true">🧩</div>
      <div className="game-card-content">
        <h3 className="game-card-title">Word Builder</h3>
        <div className="game-card-subtitle">Coming soon</div>
        <div className="game-card-tease">
          Build words with prefixes &amp; suffixes
        </div>
      </div>
    </div>
  );
}
