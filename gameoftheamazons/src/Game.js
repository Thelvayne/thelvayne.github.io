import React from 'react'
import { getGameID, move, reset } from './communication'
import { useNavigate } from 'react-router-dom'


export default function Game() {

  // Spieler 1: blau, turnPlayer = 0, pieceblack
  // Spieler 2: rot, turnPlayer = 1, piecewhite
let navigate = useNavigate();
  // Variablen
  let currentSelectedRow
  let currentSelectedColumn
  let countGenerateBoard = 0
  let amazoneSelected = 0
  let startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn

  // Funktion, die das Spielfeld setzt
  // holt und ließt aus Array, wie das Spielfeld auszusehen hat
  const setBoard = async () => {
    
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
      if (b.turnPlayer=== 1){
        var cplayer = b.players[1].name;
        console.log(cplayer)
      document.getElementById("currentPlayer").textContent=cplayer}
      
    // geschachtelte for-Schleifen, um über das Spielfeld zu gehen und die Felder korrekt zu belegen (Amazonen und Giftpfeile, sowie freie Felder)
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // wenn blaue Amazone gefunden wird
        if (b.board.squares[i][j] === 0) {
          idToGet = ""
          idToGet += letter(j)
          idToGet += i
          document.getElementById(idToGet).className += ", pieceblack"
        }
        // wenn rote Amazone gefunden wird
        else if (b.board.squares[i][j] === 1) {
          idToGet = ""
          idToGet += letter(j)
          idToGet += i
          document.getElementById(idToGet).className += ", piecewhite"
        }
        // wenn Giftpfeil gefunden wird
        else if (b.board.squares[i][j] === -2) {
          idToGet = ""
          idToGet += letter(j)
          idToGet += i
          document.getElementById(idToGet).className += ", poisonarrow"
        }
      }
    }

  }

  // Funktion für onClick Ereignis
  const select = async (row, column) => {

    if (countGenerateBoard === 0){
      setBoard()
      countGenerateBoard = 1
    }

      // GET-Aufruf, um Informationen über das laufende Spiel zu bekommen
      let b = await getGameID(0)
        .then((res) => {
          console.log(res)
          return res
        }).catch((error) => {
          console.log('GetGameID error. Message is: ' + error.message)
          return { message: error.message }
        })

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

      console.log(b.turnPlayer)
      
      console.log(isPlayer1())
      console.log(isPlayer2())
      //überprüfen, ob korrekte Figur ausgewählt wurde
      if (isPlayer1() || isPlayer2()) {
        amazoneSelected = 1
        // markieren aller erlaubten Spielzüge
        markMoveable()

        startrow = row
        startcolumn = column
      }

    }
    // Zweig für den Zug
    else if (amazoneSelected === 1) {
      currentSelectedRow = row
      currentSelectedColumn = column
      // falls ein Feld gewählt wurde, welches gültig ist
      if (document.getElementById(letter(column) + row).classList.contains("selected")) {
        console.log("selected");
        endrow = row
        endcolumn = column

        let list = document.getElementsByClassName("selected")

        // entferne die Markierung der möglichen Felder
        while (list.length > 0) {
          let ind = 0
          let id = list[ind].id
          let i = list[ind].className.indexOf("selected")
          let str = list[ind].className
          str = str.replace("selected", "")
          document.getElementById(id).className = str
          ind++
        }
        markShootable()
      }
      amazoneSelected = 2
    }
    else {
      currentSelectedRow = row
      currentSelectedColumn = column

      // falls ein Feld gewählt wurde, welches gültig ist
      if (document.getElementById(letter(column) + row).classList.contains("arrowselected")) {
        console.log("arrowselected");
        shotrow = row
        shotcolumn = column

        let list = document.getElementsByClassName("arrowselected")

        // entferne die Markierung der möglichen Felder
        while (list.length > 0) {
          let ind = 0
          let id = list[ind].id
          let i = list[ind].className.indexOf("arrowselected")
          let str = list[ind].className
          str = str.replace(" arrowselected", "")
          document.getElementById(id).className = str
          ind++
        }
      }

      console.log(b.turnPlayer + ", " + b.id + ", " + startrow + ", " + startcolumn + ", " + endrow + ", " + endcolumn + ", " + shotrow + ", " + shotcolumn);

      await move(b.turnPlayer, b.id, startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn)
      .then((res) => {
        console.log(res)
        return res
      }).catch((error) => {
        console.log('GetGameID error. Message is: ' + error.message)
        return { message: error.message }
      })

      let str = document.getElementById(letter(startcolumn)+startrow).className
      if (document.getElementById(letter(startcolumn)+startrow).classList.contains("pieceblack")){
        str=str.replace(", pieceblack", "")
        document.getElementById(letter(startcolumn)+startrow).className = str
        document.getElementById(letter(endcolumn)+endrow).className += ", pieceblack"
      }
      else{
        str=str.replace(", piecewhite", "")
        document.getElementById(letter(startcolumn)+startrow).className = str
        document.getElementById(letter(endcolumn)+endrow).className += ", piecewhite"
      }
      document.getElementById(letter(shotcolumn)+shotrow).className += " arrow"}
      document.getElementById("currentPlayer").textContent=b.turnPlayer
      if (b.turnPlayer=== 0){
        var cplayerone = b.players[0].name;
        console.log(cplayerone)
      document.getElementById("currentPlayer").textContent=cplayerone
    } else {
        var cplayertwo = b.players[1].name;
        console.log(cplayertwo)
      document.getElementById("currentPlayer").textContent=cplayertwo
    }
  }


  // Hilfsfunktion um id für document.getElementById(id) dynamisch zu bekommen
  function letter(num) {
    let str = String.fromCharCode(97 + (num % 26))
    return str.toLowerCase()
  }

  // FIXME still don't mark everything right
  // Funktion um alle erlaubten Züge zu markieren
  const markMoveable = async () => {
    // GET-Aufruf, um Informationen über das laufende Spiel zu bekommen
    let b = await getGameID(0)
      .then((res) => {
        console.log(res)
        return res
      }).catch((error) => {
        console.log('GetGameID error. Message is: ' + error.message)
        return { message: error.message }
      })

    // Variablen
    const startrow = currentSelectedRow
    const startcolumn = currentSelectedColumn
    console.log(startrow + ", " + startcolumn);
    let i = 1

    // Schleife, die nach unten alle erlaubten Felder markiert
    do {
      if (startrow + i === 10 || b.board.squares[startrow + i][startcolumn] === 0 || b.board.squares[startrow + i][startcolumn] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn)
        let n = startrow + i
        console.log(l + n)
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow + i++][startcolumn] === -1)

    // Schleife, die nach oben alle erlaubten Felder markiert
    i = 1
    do {
      if (startrow - i === -1 || b.board.squares[startrow - i][startcolumn] === 0 || b.board.squares[startrow - i][startcolumn] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn)
        let n = startrow - i
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow - i++][startcolumn] === -1)

    // Schleife, die nach links alle erlaubten Felder markiert
    i = 1
    do {
      if (startcolumn - i === -1 || b.board.squares[startrow][startcolumn - i] === 0 || b.board.squares[startrow][startcolumn - i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn - i)
        let n = startrow
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow][startcolumn - i++] === -1)

    // Schleife, die nach rechts alle erlaubten Felder markiert
    i = 1
    do {
      if (startcolumn + i === b.board.columns || b.board.squares[startrow][startcolumn + i] === 0 || b.board.squares[startrow][startcolumn + i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn + i)
        let n = startrow
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow][startcolumn + i++] === -1)

    // Schleife, die nach rechts-oben alle erlaubten Felder markiert
    i = 1
    do {
      if (startrow - i === -1 || startcolumn + i === b.board.columns || b.board.squares[startrow - i][startcolumn + i] === 0 || b.board.squares[startrow - i][startcolumn + i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn + i)
        let n = startrow - i
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow - i][startcolumn + i++] === -1)

    // Schleife, die nach rechts-unten alle erlaubten Felder markiert
    i = 1
    do {
      if (startrow + i === b.board.rows || startcolumn + i === b.board.columns || b.board.squares[startrow + i][startcolumn + i] === 0 || b.board.squares[startrow + i][startcolumn + i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn + i)
        let n = startrow + i
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow + i][startcolumn + i++] === -1)

    // Schleife, die nach links-oben alle erlaubten Felder markiert
    i = 1
    do {
      if (startrow - i === -1 || startcolumn - i === -1 || b.board.squares[startrow - i][startcolumn - i] === 0 || b.board.squares[startrow - i][startcolumn - i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn - i)
        let n = startrow - i
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow - i][startcolumn - i++] === -1)

    // Schleife, die nach links-unten alle erlaubten Felder markiert
    i = 1
    do {
      if (startrow + i === b.board.rows || startcolumn - i === -1 || b.board.squares[startrow + i][startcolumn - i] === 0 || b.board.squares[startrow + i][startcolumn - i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(startcolumn - i)
        let n = startrow + i
        let str = document.getElementById(l + n).className
        str += " selected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[startrow + i][startcolumn - i++] === -1)
  }

  // gleiches Vorgehen wie markMovable, bloß mit anderen className-Anhang
  const markShootable = async () => {

    // GET-Aufruf, um Informationen über das laufende Spiel zu bekommen
    let b = await getGameID(0)
      .then((res) => {
        console.log(res)
        return res
      }).catch((error) => {
        console.log('GetGameID error. Message is: ' + error.message)
        return { message: error.message }
      })

    // Variablen
    const rowForShoot = currentSelectedRow
    const columnForShot = currentSelectedColumn
    console.log(rowForShoot + ", " + columnForShot);
    let i = 1

    // Schleife, die nach unten alle erlaubten Felder markiert
    do {
      if (rowForShoot + i === 10 || b.board.squares[rowForShoot + i][columnForShot] === 0 || b.board.squares[rowForShoot + i][columnForShot] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot)
        let n = rowForShoot + i
        console.log(l + n)
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot + i++][columnForShot] === -1)

    // Schleife, die nach oben alle erlaubten Felder markiert
    i = 1
    do {
      if (rowForShoot - i === -1 || b.board.squares[rowForShoot - i][columnForShot] === 0 || b.board.squares[rowForShoot - i][columnForShot] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot)
        let n = rowForShoot - i
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot - i++][columnForShot] === -1)

    // Schleife, die nach links alle erlaubten Felder markiert
    i = 1
    do {
      if (columnForShot - i === -1 || b.board.squares[rowForShoot][columnForShot - i] === 0 || b.board.squares[rowForShoot][columnForShot - i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot - i)
        let n = rowForShoot
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot][columnForShot - i++] === -1)

    // Schleife, die nach rechts alle erlaubten Felder markiert
    i = 1
    do {
      if (columnForShot + i === 10 || b.board.squares[rowForShoot][columnForShot + i] === 0 || b.board.squares[rowForShoot][columnForShot + i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot + i)
        let n = rowForShoot
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot][columnForShot + i++] === -1)

    // Schleife, die nach rechts-oben alle erlaubten Felder markiert
    i = 1
    do {
      console.log((rowForShoot-i) + ", " + (columnForShot + i))
      if (rowForShoot - i === -1 || columnForShot + i === 10 || b.board.squares[rowForShoot - i][columnForShot + i] === 0 || b.board.squares[rowForShoot - i][columnForShot + i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot + i)
        let n = rowForShoot - i
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot - i][columnForShot + i++] === -1)

    // Schleife, die nach rechts-unten alle erlaubten Felder markiert
    i = 1
    do {
      if (rowForShoot + i === 10 || columnForShot + i === 10 || b.board.squares[rowForShoot + i][columnForShot + i] === 0 || b.board.squares[rowForShoot + i][columnForShot + i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot + i)
        let n = rowForShoot + i
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot + i][columnForShot + i++] === -1)

    // Schleife, die nach links-oben alle erlaubten Felder markiert
    i = 1
    do {
      if (rowForShoot - i === -1 || columnForShot - i === -1 || b.board.squares[rowForShoot - i][columnForShot - i] === 0 || b.board.squares[rowForShoot - i][columnForShot - i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot - i)
        let n = rowForShoot - i
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot - i][columnForShot - i++] === -1)

    // Schleife, die nach links-unten alle erlaubten Felder markiert
    i = 1
    do {
      if (rowForShoot + i === 10 || columnForShot - i === -1 || b.board.squares[rowForShoot + i][columnForShot - i] === 0 || b.board.squares[rowForShoot + i][columnForShot - i] === 1) {
        console.log("works as intended")
        break
      }
      else {
        let l = letter(columnForShot - i)
        let n = rowForShoot + i
        let str = document.getElementById(l + n).className
        str += " arrowselected"
        document.getElementById(l + n).className = str
      }
    } while (b.board.squares[rowForShoot + i][columnForShot - i++] === -1)
  }
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
function navigateback(){
  resetAll()
  navigate("../")
  
}

  return (
    <>
    <div className="Ui">
      <h1 className='CurrentPlayer'>Aktueller Spieler</h1>
      <p id="currentPlayer" className='currentPlayerone'></p>
      <input type="button" className="resetGame" value="Aktuelles Spiel Beenden" onClick={navigateback}></input>
    </div>
    <div className="board" onLoad={setBoard}>

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

