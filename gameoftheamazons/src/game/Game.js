import React from 'react'
import { getGameID, move, reset } from '../communication/Communication'
import { useNavigate } from 'react-router-dom'
import { markMoveable } from './markMoveable'
import { markShootable } from './markShootable'
import { letter } from './letter'
import { CreateBoard, setBoard } from './createBoard/CreateBoard'


export default async function Game() {

  // Spieler 1: blau, turnPlayer = 0 pieceblack
  // Spieler 2: rot, turnPlayer = 1 piecewhite
  let navigate = useNavigate();
  // Variablen
  let amazoneSelected = 0
  let currentSelectedRow
  let currentSelectedColumn
  let startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn
  let thereIsAWinner = false
  let IDGame;

  const game = await getGameID(IDGame).then((res) => {
    return res;
  }).catch((error) => {
    console.log("getGameID error. Error message is: " + error.message);
    return {message: error.message};
  });
  const gameRows = game.board.gameSizeRows;
  const gameColumns = game.board.gameSizeColumns;


  const doOnlyOnce = CreateBoard(gameRows, gameColumns);
  window.addEventListener('load', setBoard(thereIsAWinner));


  // Funktion für onClick Ereignis
  // entscheidet je nach State, was zu machen ist
  const select = async (row, column) => {

    if (thereIsAWinner === false) {
      //TODO: ist nicht mehr automatisch gameID 0
      // GET-Aufruf, um Informationen über das laufende Spiel zu bekommen
      let b = await getGameID(0)
        .then((res) => {
          return res
        }).catch((error) => {
          console.log('GetGameID error. Message is: ' + error.message)
          return { message: error.message }
        })

      let whoHasTurn = b.turnPlayer

      // falls noch keine Amazone gewählt wurde
      if (amazoneSelected === 0) {

        // console.log(row + ", " + column)
        currentSelectedRow = row
        currentSelectedColumn = column

        // schaut, ob Spieler1 auch seine Figur auswählt
        let isPlayer1 = () => {
          if (b.turnPlayer === 0 && b.board.squares[row][column] === 0) {

            return true
          }
          else {
            return false
          }
        }

        // schaut, ob Spieler2 auch seine Figur auswählt
        let isPlayer2 = () => {
          if (b.turnPlayer === 1 && b.board.squares[row][column] === 1) {
            return true
          }
          else {
            return false
          }
        }

        //überprüfen, ob korrekte Figur ausgewählt wurde
        if (isPlayer1()) {
          amazoneSelected = 1
          document.getElementById(letter(column) + row).className += "select"
          // markieren aller erlaubten Spielzüge
          markMoveable(row, column)

          startrow = row
          startcolumn = column
        } else if (isPlayer2()) {
          amazoneSelected = 1
          document.getElementById(letter(column) + row).className += "select"
          // markieren aller erlaubten Spielzüge
          markMoveable(row, column)

          startrow = row
          startcolumn = column
        }

      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Züge
      else if (amazoneSelected === 1 && (currentSelectedColumn === column && currentSelectedRow === row)) {

        let listWhite = document.getElementsByClassName("piecewhiteselect")
        let listBlack = document.getElementsByClassName("pieceblackselect")

        if (listWhite.length > 0) {
          let id = listWhite[0].id
          let str = listWhite[0].className
          str = str.replace("piecewhiteselect", "piecewhite")
          document.getElementById(id).className = str
        } else if (listBlack.length > 0) {
          let id = listBlack[0].id
          let str = listBlack[0].className
          str = str.replace("pieceblackselect", "pieceblack")
          document.getElementById(id).className = str
        }

        let list = document.getElementsByClassName("selected")

        // entferne die Markierung der möglichen Felder
        while (list.length > 0) {
          let ind = 0
          let id = list[ind].id
          let str = list[ind].className
          str = str.replace(" selected", "")
          document.getElementById(id).className = str
          ind++
        }

        amazoneSelected = 0
      }
      // Zweig für den Zug
      else if (amazoneSelected === 1) {
        currentSelectedRow = row
        currentSelectedColumn = column
        // falls ein Feld gewählt wurde, welches gültig ist
        if (document.getElementById(letter(column) + row).classList.contains("selected")) {
          endrow = row
          endcolumn = column

          let list = document.getElementsByClassName("selected")

          // entferne die Markierung der möglichen Felder
          while (list.length > 0) {
            let ind = 0
            let id = list[ind].id
            let str = list[ind].className
            str = str.replace(" selected", "")
            document.getElementById(id).className = str
            ind++
          }

          markShootable(row, column, startrow, startcolumn)
          amazoneSelected = 2
        }
      }
      // falls gleiches Feld nochmal ausgewählt wird, entferne wieder die Anzeige der möglichen Ziele
      else if (amazoneSelected === 2 && (currentSelectedColumn === column && currentSelectedRow === row)) {
        let listWhite = document.getElementsByClassName("piecewhiteselect")
        let listBlack = document.getElementsByClassName("pieceblackselect")

        if (listWhite.length > 0) {
          let id = listWhite[0].id
          let str = listWhite[0].className
          str = str.replace("piecewhiteselect", "piecewhite")
          document.getElementById(id).className = str
        } else if (listBlack.length > 0) {
          let id = listBlack[0].id
          let str = listBlack[0].className
          str = str.replace("pieceblackselect", "pieceblack")
          document.getElementById(id).className = str
        }

        let list = document.getElementsByClassName("arrowselected")

        // entferne die Markierung der möglichen Felder
        while (list.length > 0) {
          let ind = 0
          let id = list[ind].id
          let str = list[ind].className
          str = str.replace("arrowselected", "")
          document.getElementById(id).className = str
          ind++
        }

        amazoneSelected = 0
      }
      // verschieße den Pfeil
      else {
        currentSelectedRow = row
        currentSelectedColumn = column

        // falls ein Feld gewählt wurde, welches gültig ist
        if (document.getElementById(letter(column) + row).classList.contains("arrowselected")) {
          shotrow = row
          shotcolumn = column

          let list = document.getElementsByClassName("arrowselected")

          // entferne die Markierung der möglichen Felder
          while (list.length > 0) {
            let ind = 0
            let id = list[ind].id
            let str = list[ind].className
            str = str.replace(" arrowselected", "")
            document.getElementById(id).className = str
            // ind++
          }


          console.log(whoHasTurn + ", " + b.id + ", " + startrow + ", " + startcolumn + ", " + endrow + ", " + endcolumn + ", " + shotrow + ", " + shotcolumn);

          // Zug an Server senden
          let m = await move(whoHasTurn, b.id, startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn)
            .then((res) => {
              return res
            }).catch((error) => {
              console.log('GetGameID error. Message is: ' + error.message)
              return { message: error.message }
            })

          // falls 400 bad request zurückkommt, brich den Zug ab und setze den Zug zurück
          if (m.message === 400) {
            let b1 = await getGameID(0)
              .then((res) => {
                return res
              }).catch((error) => {
                console.log('GetGameID error. Message is: ' + error.message)
                return { message: error.message }
              })

            console.log(b1.turnPlayer)
            console.log("Nicht fortsetzen")
            amazoneSelected = 0
            let listWhite = document.getElementsByClassName("piecewhiteselect")
            let listBlack = document.getElementsByClassName("pieceblackselect")

            if (listWhite !== null && listWhite.length > 0) {
              let id = listWhite[0].id
              let str = listWhite[0].className
              str = str.replace("piecewhiteselect", "piecewhite")
              document.getElementById(id).className = str
            } else if (listBlack !== null && listBlack.length > 0) {
              let id = listBlack[0].id
              let str = listBlack[0].className
              str = str.replace("pieceblackselect", "pieceblack")
              document.getElementById(id).className = str
            }
            return
          }

          // Figuren setzen
          let str = document.getElementById(letter(startcolumn) + startrow).className
          if (document.getElementById(letter(startcolumn) + startrow).classList.contains("pieceblackselect")) {
            str = str.replace(" pieceblackselect", "")
            document.getElementById(letter(startcolumn) + startrow).className = str
            document.getElementById(letter(endcolumn) + endrow).className += " pieceblack"
          }
          else {
            str = str.replace(" piecewhiteselect", "")
            document.getElementById(letter(startcolumn) + startrow).className = str
            document.getElementById(letter(endcolumn) + endrow).className += " piecewhite"
          }

          // Pfeil setzen
          document.getElementById(letter(shotcolumn) + shotrow).className += " arrow"
          amazoneSelected = 0
        }
        // wenn ein falsches Feld gewählt wird, bring das Spielfeld zum Anfang des Zugs zurück
        else {
          let list = document.getElementsByClassName("arrowselected")
          while (list.length > 0) {
            let ind = 0
            let id = list[ind].id
            let str = list[ind].className
            str = str.replace(" arrowselected", "")
            document.getElementById(id).className = str
          }
          let listWhite = document.getElementsByClassName("piecewhiteselect")
          let listBlack = document.getElementsByClassName("pieceblackselect")

          if (listWhite !== null && listWhite.length > 0) {
            let id = listWhite[0].id
            let str = listWhite[0].className
            str = str.replace("piecewhiteselect", "piecewhite")
            document.getElementById(id).className = str
          } else if (listBlack !== null && listBlack.length > 0) {
            let id = listBlack[0].id
            let str = listBlack[0].className
            str = str.replace("pieceblackselect", "pieceblack")
            document.getElementById(id).className = str
          }
          setBoard()
        }
      }

      // aktuelles Spielbrett aktuallisieren
      let b1 = await getGameID(0)
        .then((res) => {
          return res
        }).catch((error) => {
          console.log('GetGameID error. Message is: ' + error.message)
          return { message: error.message }
        })

      // wenn es einen Gewinner gibt
      if (b1.winningPlayer !== undefined) {
        document.getElementById("currentPlayer").textContent = "GEWINNER: " + b1.winningPlayer
        thereIsAWinner = true
        return
      }

      console.log(b1);
      // Spieler, der am Zug ist anzeigen
      document.getElementById("currentPlayer").textContent = b1.turnPlayer
      if (b1.turnPlayer === 0) {
        var cplayerone = b1.players[0].name;
        document.getElementById("currentPlayer").textContent = cplayerone
      } else {
        var cplayertwo = b1.players[1].name;
        document.getElementById("currentPlayer").textContent = cplayertwo
      }
    }
    else {
      console.log(thereIsAWinner);
      setBoard()
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
    thereIsAWinner = false
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
      <div className="Ui">
        <div className='grid-container'>

          <div className='grid-item'><h1 className='CurrentPlayer'>Aktueller Spieler</h1></div>
          <div className='grid-item'><p id="currentPlayer" className='currentPlayerone'></p></div>
          <div className='grid-item'><input type="button" className="resetGame" value="Aktuelles Spiel Beenden" onClick={navigateback}></input></div>
          <div className='grid-item'><input type="button" className="resetGame help" value="Hilfe" onClick={navigatehelp} /></div>
        </div>
      </div>
      <div className="Board">
      </div>
    </>
  )
}

