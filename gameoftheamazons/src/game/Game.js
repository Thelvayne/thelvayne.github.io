import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'

import { deleteGame, getGameByID, getPlayers, reset } from '../communication/Communication'

import { firstSelectionProcess, redoFirstSelectionProcess } from './selectionProcess/FirstSelectionProcess'
import { moveAmazone, redoMove } from './selectionProcess/SecondSelectionProcess'
import { shotArrow } from './selectionProcess/ThirdSelectionProcess'

import { letter } from './letter'
import { BackgroundColor, PlaceAmazons } from './RenderBoard'

export default function Game() {

  let navigate = useNavigate();

  // Spieler 1: blau, turnPlayer = 0 pieceblack
  // Spieler 2: rot, turnPlayer = 1 piecewhite

  // Variablen
  const gameboard = useRef({ board: undefined });
  const idGame = useRef({ id: 0 });
  const currentPlayer = useRef();
  const thereIsAWinner = useRef(false);
  const winningPlayer = useRef();
  const selectedCoordinates = useRef({ currentRow: undefined, currentColumn: undefined });
  const amazoneSelected = useRef(0);
  const firstRunFinished = useRef(false);
  const elementLoaded = useRef(false);
  const selectionProcess = useRef({
    startrow: undefined,
    startcolumn: undefined,
    endrow: undefined,
    endcolumn: undefined,
    shotrow: undefined,
    shotcolumn: undefined
  })
  const figureAssigned = useRef({ pOne: undefined, pTwo: undefined });
  

  const fetchGameData = () => {
    const id = /*idGame.id !== undefined ? idGame.id : */5;
    const game = getGameByID(id).then((g) => {
      // console.log(g);
      gameboard.current.board = g.board;
      currentPlayer.current = g.turnPlayer;
      winningPlayer.current = g.winningPlayer;
      figureAssigned.current.pOne = g.players[0].id;
      figureAssigned.current.pTwo = g.players[1].id;
      idGame.current.id = g.id;
      return g;
    }).catch((error) => {
      console.log("setGame error. Message is: " + error.message);
      return { message: error.message };
    });
    if (currentPlayer.current === 0) {
      var cplayerone = currentPlayer.current;
      document.getElementById("currentPlayer").textContent = cplayerone
    } else {
      var cplayertwo = currentPlayer.current;
      document.getElementById("currentPlayer").textContent = cplayertwo
    }
    
    
    return game;
  }

  async function firstRun() {
    if (firstRunFinished.current === false) {
      const g = await fetchGameData();
      console.log(await g);
      figureAssigned.current.pOne = g.players[0].id;
      figureAssigned.current.pTwo = g.players[1].id;
      firstRunFinished.current = true;
    }
  }

  const element = async () => {
    await firstRun();
    if (elementLoaded.current === true) return;
    // console.log(gameboard);
    const parent = document.getElementById("parent");
    const board = gameboard.current.board.squares;
    board.forEach((row, indexr) => {
      row.forEach((column, indexc) => {
        const child = document.createElement("div");
        child.id = letter(indexc) + indexr;
        child.className = BackgroundColor(indexr, indexc);
        // child.onClick = () => select(indexr, indexc);
        parent.appendChild(child);
        loadAmazone(column, indexc, indexr);
      })
    })
    elementLoaded.current = true;
  }

  const loadAmazone = (val, c, r) => {
    var str = " " + PlaceAmazons(val);
    var box = document.getElementById(letter(c)+r);
    box.className += str;
  }

  const loadPlayfield = (field) => {
    field.forEach((row, indR) => {
      row.forEach((column, indC) => {
        const el = document.getElementById(letter(indC) + indR);
        var str = el.className;
        str = str.trim();
        el.className = str
        el.classList.includes("box") ? el.classList.remove("box") : console.log("nothing to delete");
        el.classList.includes("arrow") ? el.classList.remove("arrow") : console.log("nothing to delete");
        el.classList.includes("piecewhite") ? el.classList.remove("piecewhite") : console.log("nothing to delete");
        el.classList.includes("pieceblack") ? el.classList.remove("pieceblack") : console.log("nothing to delete");
        el.classList.includes("arrowselected") ? el.classList.remove("arrowselected") : console.log("nothing to delete");
        el.classList.includes("selected") ? el.classList.remove("selected") : console.log("nothing to delete");
        el.classList.includes("select") ? el.classList.remove("select") : console.log("nothing to delete");
        el.classList.includes("white") ? el.classList.remove("white") : console.log("nothing to delete");
        el.classList.includes("black") ? el.classList.remove("black") : console.log("nothing to delete");
        
        el.className = BackgroundColor(indR, indC);
        el.className = loadAmazone(column, indR, indC);
      })
    })
  }

  // Funktion für onClick Ereignis
  const select = async (row, column) => {
     /**
     * Bedingung: es gibt keinen Gewinner
     * -> führe den Algorithmus aus
     */
    if (thereIsAWinner.current === false) {
      /**
       * 1te Überprüfung: wurde noch keine Amazone gewählt -> merke Amazone und markiere mögliche Züge
       * 2te Überprüfung: es ist eine Amazone gewählt und erneut gleiche ausgewählt -> lösche alle Einträge aus 1.
       * 3te Überprüfung: es ist eine Amazone gewählt -> bewege die Amazone
       * 4te Überprüfung: es wurde die Amazone bewegt und wählt nochmal die Amazone -> setze die Amazone zurück und lösche alle Einträge aus 1.
       * else: verschieße den Pfeil und beende den Zug
       */
      console.log("Stage 1.0");
      console.log(amazoneSelected.current);
      console.log("AmazoneSelectedBoolean1: " + amazoneSelected.current === 1);
      const g = await fetchGameData();

      // falls noch keine Amazone gewählt wurde
      if (amazoneSelected.current === 0) {
        console.log("Stage 1.1");
        if (await firstSelectionProcess(row, column, g, figureAssigned.current) === true) {
          // speichere letztes gewähltes Feld
          selectedCoordinates.current.currentRow = row;
          selectedCoordinates.current.currentColumn = column
          // setze auf 1, weil Amazone ausgewählt wurde
          amazoneSelected.current = 1
          // speichere Koordinaten der Amazone für den Startpunkt des Zuges
          selectionProcess.current.startrow = row;
          selectionProcess.current.startcolumn = column      
        }
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Züge
      else if (amazoneSelected.current === 1 && (selectedCoordinates.current.currentColumn === column && selectedCoordinates.current.currentRow === row)) {
        console.log("Stage 1.1.r");
        await redoFirstSelectionProcess();
        // setze letztes Feld auf Koordinaten auserhalb des wählbaren Bereichs
        selectedCoordinates.current.currentRow = -1;
        selectedCoordinates.current.currentColumn = -1;
        // setze den Wert auf 0, da keine Amazone mehr ausgewählt ist
        amazoneSelected.current = 0;
      }
      // Zweig für den Zug
      else if (amazoneSelected.current === 1) {
        console.log("Stage 1.2");
        await moveAmazone(row, column, gameboard.current, selectionProcess.current);
        // speichere letzten gewählte Koordinaten
        selectedCoordinates.current.currentRow = row;
        selectedCoordinates.current.currentColumn = column;
        // setze den Wert auf 2, weil wir die Amazone bewegt haben
        amazoneSelected.current = 2;
        // merke die Position, an die sich die Amazone bewwegt hat
        selectionProcess.current.endrow = row;
        selectionProcess.current.endcolumn = column;
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Ziele
      else if (amazoneSelected.current === 2 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        console.log("Stage 1.2.r");
        await redoMove();
        // setze den Wert auf 1, da die Amazone wieder auf ihre Startposition gesetzt wird
        amazoneSelected.current = 0;
      }
      // verschieße den Pfeil
      else if (amazoneSelected.current === 2) {
        console.log("Stage 1.3");
        console.log(idGame.current);
        await shotArrow(row, column, idGame.current.id, currentPlayer.current, selectionProcess, amazoneSelected.current);
        // speicher letzte Auswahl
        selectedCoordinates.current.currentRow = row;
        selectedCoordinates.current.currentColumn = column;
        // setzt Wert auf 0 da der Zug beendet wird
        amazoneSelected.current = 0;
        // merkt sich die Position, an die der Pfeil verschossen wurde
        selectionProcess.current.shotrow = row;
        selectionProcess.current.shotcolumn = column;
        // aktuelles Spielbrett aktuallisieren
        let newGameData = fetchGameData().then((res) => {
          console.log(res);
          gameboard.current.board = newGameData.board;
          currentPlayer.current = newGameData.turnPlayer;
          winningPlayer.current = newGameData.winningPlayer;
          return res;
        }).catch((error) => {
          console.log("newGameData error. Message is: " + error.message);
          return { message: error.message }
        });

        // if (newGameData.players[1].controllable === false) {
        //   setTimeout(loadPlayfield(gameboard.current.board),2500)
        // }
      }
      else {
        console.log("wtf you doing here? you ain't supposed to be here!!");
      }

      // wenn es einen Gewinner gibt
      const w = await fetchGameData();
      if (w.winningPlayer !== undefined) {
        console.log("WINNING PLAYER: " + winningPlayer.current === 0 ? "Spieler1" : "Spieler2");
        document.getElementById("currentPlayer").textContent = "GEWINNER: " + Number(winningPlayer.current) === 0 ? "Spieler 1" : "Spieler 2";
        thereIsAWinner.current = true
        return;
      }

      // Spieler, der am Zug ist anzeigen
      document.getElementById("currentPlayer").textContent = currentPlayer.current
      if (currentPlayer.current === 0) {
        var cplayerone = currentPlayer.current;
        document.getElementById("currentPlayer").textContent = cplayerone
      } else {
        var cplayertwo = currentPlayer.current;
        document.getElementById("currentPlayer").textContent = cplayertwo
      }
    }
    /*if (player2 === ki-gesteuert*{
      document.addEventListener("load", () => {
        //seite neu laden
      } , warte-zeit)
    }*/
  }

  // Funktion für den 'Aktuelles Spiel Beenden'
  // setzt alles auf die Anfangswerte zurück (Spieler und Spiele werden gelöscht)
  const resetAll = async () => {
    const r = await reset();
    console.log(r)
  }

  function Navigatehelp() {
    navigate("/Help")
  }

  // Funktion um zu Hilfe zu navigieren
  async function Navigateback() {
    await deleteGame(0);
    navigate("/GenerateBoard")
  }

  // window.addEventListener("load", element);
  useEffect(() => {
    element();
  });

  window.addEventListener("click", evt => {
    const targetClick = evt.target.className;
    if (targetClick.includes("box")) {
      console.log(evt.target.id);
      const row = Number(evt.target.id.charAt(1));
      const column = Number((evt.target.id.charCodeAt(0) - 97));
      console.log(row + ", " + column);
      select(row, column);
    }
  })

  return (
    <div className='outer-container'>
      <div className="Ui">
        <div className='grid-container'>

          <div className='grid-item'><h1 className='CurrentPlayer'>Aktueller Spieler</h1></div>
          <div className='grid-item'><p id="currentPlayer" className='currentPlayerone'></p></div>
          <div className='grid-item'><input type="button" className="resetGame" value="Aktuelles Spiel Beenden" onClick={Navigateback}></input></div>
          <div className='grid-item'><input type="button" className="resetGame help" value="Hilfe" onClick={Navigatehelp} /></div>
          <div className='grid-item'><input type="button" className='test' value="log" onClick={element} /></div>
        </div>
      </div>
      <div className="board" id="parent">
      </div>
    </div>
  )
}



