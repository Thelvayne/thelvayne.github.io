import { letter } from "./letter"
import { getGameID } from "../communication"

// Funktion um alle erlaubten Züge zu markieren
export const markMoveable = async (currentSelectedRow, currentSelectedColumn) => {
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