import { WordPhoneticsCard } from "./WordPhoneticsCard";

/**
 * Practice section on Home. Currently hosts the Listening Practice
 * placeholder + a ghost slot signaling that more practice modes
 * are on the way. Added in cycle-16 per
 * specs/home-games-practice.md.
 */
export function PracticeSection() {
  return (
    <section className="practice-section">
      <h2 className="section-heading">Practice</h2>
      <div className="practice-grid">
        <WordPhoneticsCard />
        <div
          className="game-card game-card--ghost"
          aria-hidden="true"
        >
          <div className="game-card-content">
            <div className="game-card-subtitle">More coming soon</div>
          </div>
        </div>
      </div>
    </section>
  );
}
