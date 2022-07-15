  import { letter } from "./letter"
  import { getGameID } from "../communication"
  
  // gleiches Vorgehen wie markMovable, bloß mit anderen className-Anhang
  export const markShootable = async (currentSelectedRow, currentSelectedColumn) => {

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
      console.log((rowForShoot - i) + ", " + (columnForShot + i))
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
