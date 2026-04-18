import { GamesSection } from "./GamesSection";
import { WordMatchingSection } from "./WordMatchingSection";

export function HomeScreen() {
  return (
    <div className="home-screen">
      <h1 className="title">Kids Words</h1>
      <GamesSection />
      <WordMatchingSection />
    </div>
  );
}
