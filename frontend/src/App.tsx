import { Route, Routes } from "react-router-dom";
import { CategoryList } from "./components/CategoryList";
import { MatchRound } from "./components/MatchRound";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<CategoryList />} />
        <Route path="/play/:slug" element={<MatchRound />} />
      </Routes>
    </div>
  );
}

export default App;
