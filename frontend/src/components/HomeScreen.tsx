import { GamesSection } from "./GamesSection";
import { PracticeSection } from "./PracticeSection";

/**
 * Home screen (cycle-16 restructure) — two top-level sections:
 *   Games    — Word Builder + Word Matching
 *   Practice — Listening Practice placeholder + ghost slot
 *
 * The 5 category cards no longer live directly on Home; they render
 * on /matching (MatchingScreen). Tapping the Word Matching card
 * navigates there.
 */
export function HomeScreen() {
  return (
    <div className="home-screen">
      <h1 className="title">Kids Words</h1>
      <GamesSection />
      <PracticeSection />
    </div>
  );
}
