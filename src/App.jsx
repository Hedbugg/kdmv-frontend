import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sell from "./components/Sell";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route now opens Sell directly */}
        <Route path="/" element={<Sell />} />
      </Routes>
    </Router>
  );
}

export default App;
