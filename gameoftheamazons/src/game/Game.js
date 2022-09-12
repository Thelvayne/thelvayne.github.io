import React, { useRef } from 'react'
import { getGameByID, move, reset } from '../communication/Communication'
import { useNavigate } from 'react-router-dom'
import { letter } from './letter'
import { useState } from 'react'
import { BackgroundColor } from './RenderBoard'
import { firstSelectionProcess, redoFirstSelectionProcess } from './selectionProcess/FirstSelectionProcess'
import { moveAmazone, redoMove } from './selectionProcess/SecondSelectionProcess'
import { shotArrow } from './selectionProcess/ThirdSelectionProcess'


export default async function Game() {

  let navigate = useNavigate();

  // Spieler 1: blau, turnPlayer = 0 pieceblack
  // Spieler 2: rot, turnPlayer = 1 piecewhite

  // Variablen
  const [idGame, setIDGame] = useState({ id: -1 });
  const [game, setGame] = useState();

  const [currentPlayer, setCurrentPlayer] = useRef();
  const [selectedCoordinates, setSelectedCoordinates] = useRef({ currentRow: null, currentColumn: null });
  const amazoneSelected = useRef(0);
  const thereIsAWinner = useRef(false);
  const firstRunFinished = useRef(false);

  const selectionProcess = useRef({startrow: null, startcolumn: null, endrow: null, endcolumn: null, shotrow: null, shotcolumn: null})

  const fetchGameData = async () => {
    const g = await getGameByID(idGame.id).then((res) => {
      return res;
    }).catch((error) => {
      console.log("getGameByID error. Error message is: " + error.message);
      return { message: error.message };
    });
    setGame(g);
    return g;
  }

  async function firstRun() {

    if (firstRunFinished.current === true) {
      return
    } else {
      const g = await fetchGameData();
      currentPlayer.current = g.turnPlayer
    }
    firstRunFinished.current = true;
  }

  const element = game.board.squares.forEach((row, indexRow) => {
    row.forEach((column, indexColumn) => {
      React.createElement("div", { id: letter(indexColumn) + indexRow, className: BackgroundColor(indexRow, indexColumn), onClick: select })
    });
  });  

  // Funktion für onClick Ereignis
  const select = async (row, column) => {

    if (thereIsAWinner.current === false) {

      const g = await fetchGameData();
      setCurrentPlayer.current = g.turnPlayer;

      // falls noch keine Amazone gewählt wurde
      if (amazoneSelected === 0) {
        firstSelectionProcess(row, column, g)
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Züge
      else if (amazoneSelected.current === 1 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        redoFirstSelectionProcess();        
      }
      // Zweig für den Zug
      else if (amazoneSelected === 1) {
        moveAmazone(row, column, game);
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Ziele
      else if (amazoneSelected === 2 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        redoMove();
      }
      // verschieße den Pfeil
      else {
        shotArrow();
      }

      // aktuelles Spielbrett aktuallisieren
      setGame(await fetchGameData);

      // wenn es einen Gewinner gibt
      if (game.winningPlayer !== undefined) {
        document.getElementById("currentPlayer").textContent = "GEWINNER: " + game.winningPlayer
        thereIsAWinner.current = true
        return
      }

      console.log(game);
      // Spieler, der am Zug ist anzeigen
      document.getElementById("currentPlayer").textContent = game.turnPlayer
      if (game.turnPlayer === 0) {
        var cplayerone = game.players[0].name;
        document.getElementById("currentPlayer").textContent = cplayerone
      } else {
        var cplayertwo = game.players[1].name;
        document.getElementById("currentPlayer").textContent = cplayertwo
      }
    }
    else {
      console.log(thereIsAWinner);
    }
  }

  // Funktion für den 'Aktuelles Spiel Beenden'
  // setzt alles auf die Anfangswerte zurück (Spieler und Spiele werden gelöscht)
  const resetAll = async () => {

    const r = await reset()
      .then((res) => {
        return res
      }).catch((error) => {
        console.log('GET error. Message is: ' + error.message)

        return { message: error.message }

      })
    console.log(r)



  }

  function navigatehelp() {
    // thereIsAWinner.current = false //wird das hier überhaupt gebraucht?
    navigate("../help/Help")
  }

  // Funktion um zu Hilfe zu navigieren
  async function navigateback() {
    await resetAll()
      .then((res) => {
        return res
      }).catch((error) => {
        console.log('GET error. Message is: ' + error.message)

        return { message: error.message }

      })
    navigate("../gamelobby/Gamelobby")

  }

  return (
    <>
      <div className="Ui" onLoad={firstRun}>
        <div className='grid-container'>

          <div className='grid-item'><h1 className='CurrentPlayer'>Aktueller Spieler</h1></div>
          <div className='grid-item'><p id="currentPlayer" className='currentPlayerone'></p></div>
          <div className='grid-item'><input type="button" className="resetGame" value="Aktuelles Spiel Beenden" onClick={navigateback}></input></div>
          <div className='grid-item'><input type="button" className="resetGame help" value="Hilfe" onClick={navigatehelp} /></div>
        </div>
      </div>
      <div className="Board" id="root">
        {element}
      </div>
    </>
  )
}



