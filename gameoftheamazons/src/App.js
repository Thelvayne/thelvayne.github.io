import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Gamelobby from "./gamelobby/Gamelobby.js";
import Game from "./game/Game.js";
import Help from "./help/Help.js";
import HelpLobby from "./help/HelpLobby.js";
import ResetAll from "./reset/Reset.js";



// import { GenerateBoard } from "./game/createBoardSettings/GenerateBoard.js";



function App() {
  // constructor(props){
  //   super(props);
  //   this.state ={
  //     items: [],
  //     isLoaded:false,
  //   }
  // }
  // componentDidMount(){

  //   fetch('https://gitlab.hs-anhalt.de/barth_to/game-of-the-amazons.git')
  // }
 
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Gamelobby />} />
        {/* <Route exact path="/GenerateBoard" element={<GenerateBoard/>} /> */}
        <Route exact path="/HelpLobby" element={<HelpLobby />} />
        <Route exact path="/Game" element={<Game />} />
        <Route exact path="/Help" element={<Help />} />
        <Route exact path="/ResetAll" element={<ResetAll/>} />
      </Routes>
    </Router>
  )
}

export default App;
