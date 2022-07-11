import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Startscreen from "./Startscreen.js";
import Game from "./Game.js";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Startscreen />} />
        <Route exact path="/Game" element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App;
