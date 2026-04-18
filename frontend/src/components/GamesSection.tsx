import { WordBuilderCard } from "./WordBuilderCard";
import { WordMatchingCard } from "./WordMatchingCard";

/**
 * Games section on Home — cycle-16 restructure.
 * Word Builder + Word Matching sit here as peer games.
 * Phonetics moves to the new PracticeSection.
 */
export function GamesSection() {
  return (
    <section className="games-section">
      <h2 className="section-heading">Games</h2>
      <div className="games-grid">
        <WordBuilderCard />
        <WordMatchingCard />
      </div>
    </section>
  );
}
