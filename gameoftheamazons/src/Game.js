import React from 'react'
import { getGameID, move, reset } from './communication'
import { useNavigate } from 'react-router-dom'
import { markMoveable } from './game/markMoveable'
import { markShootable } from './game/markShootable'
import { letter } from './game/letter'


export default function Game() {

  // Spieler 1: blau, turnPlayer = 0, pieceblack
  // Spieler 2: rot, turnPlayer = 1, piecewhite
  let navigate = useNavigate();
  // Variablen
  let amazoneSelected = 0
  let currentSelectedRow
  let currentSelectedColumn
  let startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn
  let thereIsAWinner = false


  // Funktion, die das Spielfeld setzt
  // holt und ließt aus Array, wie das Spielfeld auszusehen hat
  const setBoard = async () => {
    console.log("text");

    // Methodeninterne Variable(n)
    let idToGet = ""

    // GET-Aufruf, um Informationen über das laufende Spiel zu bekommen
    let b = await getGameID(0)
      .then((res) => {
        return res
      }).catch((error) => {
        console.log('GetGameID error. Message is: ' + error.message)
        return { message: error.message }
      })

    console.log(b);

    //falls noch keinen Gewinner gibt, gebe den Spieler an, der als nächstes am Zug ist
    if (thereIsAWinner === false) {
      if (b.turnPlayer === 0) {
        var cplayer = b.players[0].name;
        document.getElementById("currentPlayer").textContent = cplayer
      } else {
        var cplayertwo = b.players[1].name;
        document.getElementById("currentPlayer").textContent = cplayertwo
      }
    }

    // geschachtelte for-Schleifen, um über das Spielfeld zu gehen und die Felder korrekt zu belegen (Amazonen und Giftpfeile, sowie freie Felder)
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // wenn blaue Amazone gefunden wird
        if (b.board.squares[i][j] === 0 && !document.getElementById(letter(j) + i).classList.contains("pieceblack")) {
          idToGet = ""
          idToGet += letter(j)
          idToGet += i
          document.getElementById(idToGet).className += ", pieceblack"
        }
        // wenn rote Amazone gefunden wird
        else if (b.board.squares[i][j] === 1 && !document.getElementById(letter(j) + i).classList.contains("piecewhite")) {
          idToGet = ""
          idToGet += letter(j)
          idToGet += i
          document.getElementById(idToGet).className += ", piecewhite"
        }
        // wenn Giftpfeil gefunden wird
        else if (b.board.squares[i][j] === -2 && !document.getElementById(letter(j) + i).classList.contains("arrow")) {
          idToGet = ""
          idToGet += letter(j)
          idToGet += i
          document.getElementById(idToGet).className += ", arrow"
        }
      }
    }
  }


  setBoard()


  // Funktion für onClick Ereignis
  // entscheidet je nach State, was zu machen ist
  const select = async (row, column) => {

    if (thereIsAWinner === false) {
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
            str = str.replace(", pieceblackselect", "")
            document.getElementById(letter(startcolumn) + startrow).className = str
            document.getElementById(letter(endcolumn) + endrow).className += ", pieceblack"
          }
          else {
            str = str.replace(", piecewhiteselect", "")
            document.getElementById(letter(startcolumn) + startrow).className = str
            document.getElementById(letter(endcolumn) + endrow).className += ", piecewhite"
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
    navigate("../Help")
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
    navigate("../")

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
      <div className="board">

        <div id="a0" className="box white" onClick={() => select(0, 0)}></div>
        <div id="b0" className="box black" onClick={() => select(0, 1)}></div>
        <div id="c0" className="box white" onClick={() => select(0, 2)}></div>
        <div id="d0" className="box black" onClick={() => select(0, 3)}></div>
        <div id="e0" className="box white" onClick={() => select(0, 4)}></div>
        <div id="f0" className="box black" onClick={() => select(0, 5)}></div>
        <div id="g0" className="box white" onClick={() => select(0, 6)}></div>
        <div id="h0" className="box black" onClick={() => select(0, 7)}></div>
        <div id="i0" className="box white" onClick={() => select(0, 8)}></div>
        <div id="j0" className="box black" onClick={() => select(0, 9)}></div>

        <div id="a1" className="box black" onClick={() => select(1, 0)}></div>
        <div id="b1" className="box white" onClick={() => select(1, 1)}></div>
        <div id="c1" className="box black" onClick={() => select(1, 2)}></div>
        <div id="d1" className="box white" onClick={() => select(1, 3)}></div>
        <div id="e1" className="box black" onClick={() => select(1, 4)}></div>
        <div id="f1" className="box white" onClick={() => select(1, 5)}></div>
        <div id="g1" className="box black" onClick={() => select(1, 6)}></div>
        <div id="h1" className="box white" onClick={() => select(1, 7)}></div>
        <div id="i1" className="box black" onClick={() => select(1, 8)}></div>
        <div id="j1" className="box white" onClick={() => select(1, 9)}></div>

        <div id="a2" className="box white" onClick={() => select(2, 0)}></div>
        <div id="b2" className="box black" onClick={() => select(2, 1)}></div>
        <div id="c2" className="box white" onClick={() => select(2, 2)}></div>
        <div id="d2" className="box black" onClick={() => select(2, 3)}></div>
        <div id="e2" className="box white" onClick={() => select(2, 4)}></div>
        <div id="f2" className="box black" onClick={() => select(2, 5)}></div>
        <div id="g2" className="box white" onClick={() => select(2, 6)}></div>
        <div id="h2" className="box black" onClick={() => select(2, 7)}></div>
        <div id="i2" className="box white" onClick={() => select(2, 8)}></div>
        <div id="j2" className="box black" onClick={() => select(2, 9)}></div>

        <div id="a3" className="box black" onClick={() => select(3, 0)}></div>
        <div id="b3" className="box white" onClick={() => select(3, 1)}></div>
        <div id="c3" className="box black" onClick={() => select(3, 2)}></div>
        <div id="d3" className="box white" onClick={() => select(3, 3)}></div>
        <div id="e3" className="box black" onClick={() => select(3, 4)}></div>
        <div id="f3" className="box white" onClick={() => select(3, 5)}></div>
        <div id="g3" className="box black" onClick={() => select(3, 6)}></div>
        <div id="h3" className="box white" onClick={() => select(3, 7)}></div>
        <div id="i3" className="box black" onClick={() => select(3, 8)}></div>
        <div id="j3" className="box white" onClick={() => select(3, 9)}></div>

        <div id="a4" className="box white" onClick={() => select(4, 0)}></div>
        <div id="b4" className="box black" onClick={() => select(4, 1)}></div>
        <div id="c4" className="box white" onClick={() => select(4, 2)}></div>
        <div id="d4" className="box black" onClick={() => select(4, 3)}></div>
        <div id="e4" className="box white" onClick={() => select(4, 4)}></div>
        <div id="f4" className="box black" onClick={() => select(4, 5)}></div>
        <div id="g4" className="box white" onClick={() => select(4, 6)}></div>
        <div id="h4" className="box black" onClick={() => select(4, 7)}></div>
        <div id="i4" className="box white" onClick={() => select(4, 8)}></div>
        <div id="j4" className="box black" onClick={() => select(4, 9)}></div>

        <div id="a5" className="box black" onClick={() => select(5, 0)}></div>
        <div id="b5" className="box white" onClick={() => select(5, 1)}></div>
        <div id="c5" className="box black" onClick={() => select(5, 2)}></div>
        <div id="d5" className="box white" onClick={() => select(5, 3)}></div>
        <div id="e5" className="box black" onClick={() => select(5, 4)}></div>
        <div id="f5" className="box white" onClick={() => select(5, 5)}></div>
        <div id="g5" className="box black" onClick={() => select(5, 6)}></div>
        <div id="h5" className="box white" onClick={() => select(5, 7)}></div>
        <div id="i5" className="box black" onClick={() => select(5, 8)}></div>
        <div id="j5" className="box white" onClick={() => select(5, 9)}></div>

        <div id="a6" className="box white" onClick={() => select(6, 0)}></div>
        <div id="b6" className="box black" onClick={() => select(6, 1)}></div>
        <div id="c6" className="box white" onClick={() => select(6, 2)}></div>
        <div id="d6" className="box black" onClick={() => select(6, 3)}></div>
        <div id="e6" className="box white" onClick={() => select(6, 4)}></div>
        <div id="f6" className="box black" onClick={() => select(6, 5)}></div>
        <div id="g6" className="box white" onClick={() => select(6, 6)}></div>
        <div id="h6" className="box black" onClick={() => select(6, 7)}></div>
        <div id="i6" className="box white" onClick={() => select(6, 8)}></div>
        <div id="j6" className="box black" onClick={() => select(6, 9)}></div>

        <div id="a7" className="box black" onClick={() => select(7, 0)}></div>
        <div id="b7" className="box white" onClick={() => select(7, 1)}></div>
        <div id="c7" className="box black" onClick={() => select(7, 2)}></div>
        <div id="d7" className="box white" onClick={() => select(7, 3)}></div>
        <div id="e7" className="box black" onClick={() => select(7, 4)}></div>
        <div id="f7" className="box white" onClick={() => select(7, 5)}></div>
        <div id="g7" className="box black" onClick={() => select(7, 6)}></div>
        <div id="h7" className="box white" onClick={() => select(7, 7)}></div>
        <div id="i7" className="box black" onClick={() => select(7, 8)}></div>
        <div id="j7" className="box white" onClick={() => select(7, 9)}></div>

        <div id="a8" className="box white" onClick={() => select(8, 0)}></div>
        <div id="b8" className="box black" onClick={() => select(8, 1)}></div>
        <div id="c8" className="box white" onClick={() => select(8, 2)}></div>
        <div id="d8" className="box black" onClick={() => select(8, 3)}></div>
        <div id="e8" className="box white" onClick={() => select(8, 4)}></div>
        <div id="f8" className="box black" onClick={() => select(8, 5)}></div>
        <div id="g8" className="box white" onClick={() => select(8, 6)}></div>
        <div id="h8" className="box black" onClick={() => select(8, 7)}></div>
        <div id="i8" className="box white" onClick={() => select(8, 8)}></div>
        <div id="j8" className="box black" onClick={() => select(8, 9)}></div>

        <div id="a9" className="box black" onClick={() => select(9, 0)}></div>
        <div id="b9" className="box white" onClick={() => select(9, 1)}></div>
        <div id="c9" className="box black" onClick={() => select(9, 2)}></div>
        <div id="d9" className="box white" onClick={() => select(9, 3)}></div>
        <div id="e9" className="box black" onClick={() => select(9, 4)}></div>
        <div id="f9" className="box white" onClick={() => select(9, 5)}></div>
        <div id="g9" className="box black" onClick={() => select(9, 6)}></div>
        <div id="h9" className="box white" onClick={() => select(9, 7)}></div>
        <div id="i9" className="box black" onClick={() => select(9, 8)}></div>
        <div id="j9" className="box white" onClick={() => select(9, 9)}></div>
      </div>
    </>
  )
}

