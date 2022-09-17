import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import React from 'react'

import { getGameByID, reset } from '../communication/Communication'

import { firstSelectionProcess, redoFirstSelectionProcess } from './selectionProcess/FirstSelectionProcess'
import { moveAmazone, redoMove } from './selectionProcess/SecondSelectionProcess'
import { shotArrow } from './selectionProcess/ThirdSelectionProcess'

import { letter } from './letter'
import { getID } from './createBoardSettings/GenerateBoard'
import { BackgroundColor, PlaceAmazons } from './RenderBoard'

export default function Game() {

  let navigate = useNavigate();

  // Spieler 1: blau, turnPlayer = 0 pieceblack
  // Spieler 2: rot, turnPlayer = 1 piecewhite

  // Variablen
  const gameboard = useRef({});
  const idGame = useRef({});
  const currentPlayer = useRef();
  const [turn, setTurn] = useState();
  const winningPlayer = useRef();


  const [thereIsAWinner, setThereIsAWinner] = useState({b: false});
  const selectedCoordinates = useRef();
  const amazoneSelected = useRef(0);
  const firstRunFinished = useRef(false);
  const elementLoaded = useRef(false);
  const selectionProcess = useRef({/* startrow: undefined, startcolumn: undefined, endrow: undefined, endcolumn: undefined, shotrow: undefined, shotcolumn: undefined */ })

  const fetchGameData = async () => {
    const id = getID() !== undefined ? getID() : 0;
    const _game = getGameByID(id).then((g) => {      
        gameboard.current = g.board;
        // idGame.current = g.id;
        currentPlayer.current = g.players;
        setTurn({playerWithTurn: g.turnPlayer})
        winningPlayer.current = g.winningPlayer;
      return g;
    }).catch((error) => {
      console.log("setGame error. Message is: " + error.message);
      return { message: error.message };
    });
    return _game;
  }

  async function firstRun() {
    if (firstRunFinished.current === true) {
      return;
    } else {
      const g = await fetchGameData();
      setTurn({playerWithTurn: g.turnPlayer})
      idGame.current = g.id;
    }
    firstRunFinished.current = true;
  }

  const element = async () => {
    firstRun();
    if (elementLoaded.current === true) return;
    const parent = document.getElementById("parent");
    // console.log(gameboard.current.squares);
    const board = gameboard.current.squares;
    board.forEach((row, indexr) => {
      row.forEach((column, indexc) => {
        /**
         * erstellt die nötigen divs für das Spielfeld beim erstmaligen laden
         */
        // console.log(indexr, indexc, column);
        const child = document.createElement("div");
        child.id = letter(indexc) + indexr;
        child.className = BackgroundColor(indexr, indexc);
        // child.ref = {row: indexr, column: indexc };
        // child.addEventListener("click", select(indexr, indexc), false);
        // console.log(child);
        parent.appendChild(child);
        /**
         * Plaziert die Pfeile und Amazonen bei erstmaligen Rendern des Spielfeldes
         */
        var str = " " + PlaceAmazons(column);
        var box = document.getElementById(letter(indexc) + indexr);
        box.className += str;
      })
    })
    elementLoaded.current = true;
  }

  // Funktion für onClick Ereignis
  const select = async (row, column) => {

    if (thereIsAWinner.b === false && (document.getElementsByTagName("pieceblack").id === letter(column) + row || document.getElementsByTagName("piecewhite").id === letter(column) + row)) {

      const g = await fetchGameData();
      setTurn({playerWithTurn: g.turnPlayer});

      // falls noch keine Amazone gewählt wurde
      if (amazoneSelected.current === 0) {
        await firstSelectionProcess(row, column, g, currentPlayer, selectedCoordinates, amazoneSelected, selectionProcess);
        selectedCoordinates.current.currentRow = row;
        selectedCoordinates.current.currentColumn = column
        amazoneSelected.current = 1
        selectionProcess.current.startrow = row;
        selectionProcess.current.startcolumn = column


      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Züge
      else if (amazoneSelected.current === 1 && (selectedCoordinates.currentColumn === column && selectedCoordinates.currentRow === row)) {
        redoFirstSelectionProcess();
        selectedCoordinates({ currentRow: -1, currentColumn: -1 });
        amazoneSelected({ amazoneSelected: 0 });
      }
      // Zweig für den Zug
      else if (amazoneSelected === 1) {
        let obj = await moveAmazone(row, column, gameboard, selectedCoordinates, amazoneSelected, selectionProcess);
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
        const newGameData = await fetchGameData;
        gameboard.current = newGameData.board;
        // idGame.current = newGameData.id;
        currentPlayer.current = newGameData.players;
        setTurn({playerWithTurn: newGameData.turnPlayer})
        winningPlayer.current = newGameData.winningPlayer;
      }

      // wenn es einen Gewinner gibt
      if (gameboard.winningPlayer !== undefined) {
        document.getElementById("currentPlayer").textContent = "GEWINNER: " + gameboard.winningPlayer;
        setThereIsAWinner({b: true});
        return;
      }

      console.log(gameboard);
      // Spieler, der am Zug ist anzeigen
      document.getElementById("currentPlayer").textContent = turn.playerWithTurn
      if (turn.playerWithTurn === 0) {
        var cplayerone = gameboard.players[0].name;
        document.getElementById("currentPlayer").textContent = cplayerone
      } else {
        var cplayertwo = gameboard.players[1].name;
        document.getElementById("currentPlayer").textContent = cplayertwo
      }
    }
    else {
      console.log(thereIsAWinner.b);
    }
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
    await resetAll();
    navigate("/Gamelobby")
  }

  // window.addEventListener("load", element);
  useEffect(() => {
    element();
  });

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
      <div className="Board" id="parent">
      </div>
    </div>
  )
}



