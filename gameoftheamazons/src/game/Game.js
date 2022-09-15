import { getGameByID, reset } from '../communication/Communication'
import { firstSelectionProcess, redoFirstSelectionProcess } from './selectionProcess/FirstSelectionProcess'
import { moveAmazone, redoMove } from './selectionProcess/SecondSelectionProcess'
import { shotArrow } from './selectionProcess/ThirdSelectionProcess'
import { getID } from './createBoardSettings/GenerateBoard'
import { useState, useRef} from 'react'
import {  useNavigate } from 'react-router-dom'
import React from 'react'
import { letter } from './letter'
import { BackgroundColor } from './RenderBoard'

export default function Game() {

  let navigate = useNavigate();

  // Spieler 1: blau, turnPlayer = 0 pieceblack
  // Spieler 2: rot, turnPlayer = 1 piecewhite

  // Variablen
  const [idGame, setIDGame] = useState({ id: 0 });
  const [game, setGame] = useState();

  const currentPlayer = useRef({});
  const selectedCoordinates = useRef({ currentRow: -1, currentColumn: -1 });
  const amazoneSelected = useRef(0);
  const thereIsAWinner = useRef(false);
  const firstRunFinished = useRef(false);

  const selectionProcess = useRef({ startrow: -1, startcolumn: -1, endrow: -1, endcolumn: -1, shotrow: -1, shotcolumn: -1 })

  const fetchGameData = async () => {
    const g = await getGameByID(idGame.id).then((res) => {
      return res;
    }).catch((error) => {
      console.log("getGameByID error. Error message is: " + error.message);
      return { message: error.message };
    });
    setGame({g});
    return g;
  }

  async function firstRun() {


    if (firstRunFinished.current === true) {
      return
    } else {
      const g = await fetchGameData();
      currentPlayer.current = g.turnPlayer
      setIDGame({getID});
    }
    firstRunFinished.current = true;
  }


  const element = () => {
    game.board.squares.forEach((row, indexRow) => {
      row.forEach((column, indexColumn) => {
        React.createElement("div", { id: letter(indexColumn) + indexRow, className: BackgroundColor(indexRow, indexColumn), onClick: select })
      });
    })
  }

  // Funktion für onClick Ereignis
  const select = async (row, column) => {

    if (thereIsAWinner.current === false) {

      const g = await fetchGameData();
      currentPlayer.current = g.turnPlayer;

      // falls noch keine Amazone gewählt wurde
      if (amazoneSelected.current === 0) {
        await firstSelectionProcess(row, column, g, currentPlayer, selectedCoordinates, amazoneSelected, selectionProcess);
        selectedCoordinates({ currentRow: row, currentColumn: column });
        amazoneSelected(1);
        selectionProcess({startrow: row, startcolumn: column});
        

      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Züge
      else if (amazoneSelected.current === 1 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        redoFirstSelectionProcess();
        selectedCoordinates({ currentRow: -1, currentColumn: -1 });
        amazoneSelected({ amazoneSelected: 0 });
      }
      // Zweig für den Zug
      else if (amazoneSelected === 1) {
        let obj = await moveAmazone(row, column, game, selectedCoordinates, amazoneSelected, selectionProcess);
        selectedCoordinates({ selectedCoordinates: obj.selectedCoordinates });
        amazoneSelected({ amazoneSelected: obj.amazoneSelected });
        selectionProcess({ selectionProcess: obj.selectionProcess });
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Ziele
      else if (amazoneSelected === 2 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        let obj = redoMove(amazoneSelected);
        amazoneSelected({ amazoneSelected: obj.amazoneSelected });
      }
      // verschieße den Pfeil
      else {
        let obj = await shotArrow(row, column, idGame, currentPlayer, selectedCoordinates, selectionProcess, amazoneSelected);
        selectedCoordinates({ selectedCoordinates: obj.selectedCoordinates });
        amazoneSelected({ amazoneSelected: obj.amazoneSelected });
        selectionProcess({ selectionProcess: obj.selectionProcess });
        // aktuelles Spielbrett aktuallisieren
        const newGameData = await fetchGameData
        setGame({newGameData});
      }

      // wenn es einen Gewinner gibt
      if (game.winningPlayer !== undefined) {
        document.getElementById("currentPlayer").textContent = "GEWINNER: " + game.winningPlayer;
        // thereIsAWinner.current = true;
        thereIsAWinner(true);
        return;
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
      console.log(thereIsAWinner.current);
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

  function Navigatehelp() {
    // thereIsAWinner.current = false //wird das hier überhaupt gebraucht?
    useNavigate("../help/Help")
  }

  // Funktion um zu Hilfe zu navigieren
  async function Navigateback() {
    await resetAll()
      .then((res) => {
        return res
      }).catch((error) => {
        console.log('GET error. Message is: ' + error.message)

        return { message: error.message }

      })
    useNavigate("../gamelobby/Gamelobby")

  }

  return (
    <div>
      <div className="Ui" onLoad={firstRun}>
        <div className='grid-container'>

          <div className='grid-item'><h1 className='CurrentPlayer'>Aktueller Spieler</h1></div>
          <div className='grid-item'><p id="currentPlayer" className='currentPlayerone'></p></div>
          <div className='grid-item'><input type="button" className="resetGame" value="Aktuelles Spiel Beenden" onClick={Navigateback}></input></div>
          <div className='grid-item'><input type="button" className="resetGame help" value="Hilfe" onClick={Navigatehelp} /></div>
        </div>
      </div>
      <div className="Board" id="root">
        <element/>
      </div>
    </div>
  )
}



