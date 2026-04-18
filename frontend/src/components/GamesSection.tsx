import { WordBuilderCard } from "./WordBuilderCard";
import { WordPhoneticsCard } from "./WordPhoneticsCard";

export function GamesSection() {
  return (
    <section className="games-section">
      <h2 className="section-heading">Games</h2>
      <div className="games-grid">
        <WordBuilderCard />
        <WordPhoneticsCard />
      </div>
    </section>
  );
}
