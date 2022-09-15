import { letter } from '../letter'
import { move, getGameByID } from '../../communication/Communication'

export const shotArrow = async (row, column, gameID, currentPlayer, selectedCoordinates, selectionProcess, amazoneSelected) => {

    selectedCoordinates({ currentRow: row, currentColumn: column });

    // falls ein Feld gewählt wurde, welches gültig ist
    if (document.getElementById(letter(column) + row).classList.contains("arrowselected")) {
        selectionProcess({ shotrow: row, shotcolumn: column })

        let list = document.getElementsByClassName("arrowselected")

        // entferne die Markierung der möglichen Felder
        while (list.length > 0) {
            let ind = 0
            let id = list[ind].id
            let str = list[ind].className
            str = str.replace(" arrowselected", "")
            document.getElementById(id).className = str
            ind++
        }

        // Zug an Server senden
        let m = await move(currentPlayer,
            gameID,
            selectionProcess.startrow,
            selectionProcess.startcolumn,
            selectionProcess.endrow,
            selectionProcess.endcolumn,
            selectionProcess.shotrow,
            selectionProcess.shotcolumn)
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GetGameByID error. Message is: ' + error.message)
                return { message: error.message }
            })

        // falls 400 bad request zurückkommt, brich den Zug ab und setze den Zug zurück
        if (m.message === 400) {
            let b1 = await getGameByID(gameID)
                .then((res) => {
                    return res
                }).catch((error) => {
                    console.log('GetGameByID error. Message is: ' + error.message)
                    return { message: error.message }
                })

            console.log(b1.turnPlayer)
            console.log("Nicht fortsetzen")
            amazoneSelected.current = 0
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
            return;
        }

        // Figuren setzen
        let str = document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).className
        if (document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).classList.contains("pieceblackselect")) {
            str = str.replace(" pieceblackselect", "")
            document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).className = str
            document.getElementById(letter(selectionProcess.endcolumn) + selectionProcess.endrow).className += " pieceblack"
        }
        else {
            str = str.replace(" piecewhiteselect", "")
            document.getElementById(letter(selectionProcess.startcolumn) + selectionProcess.startrow).className = str
            document.getElementById(letter(selectionProcess.endcolumn) + selectionProcess.endrow).className += " piecewhite"
        }

        // Pfeil setzen
        document.getElementById(letter(selectionProcess.shotcolumn) + selectionProcess.shotrow).className += " arrow"
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
    }

    return {selectedCoordinates, selectionProcess, amazoneSelected}

}