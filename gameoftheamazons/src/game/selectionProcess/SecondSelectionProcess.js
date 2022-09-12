import { setSelectedCoordinates, amazoneSelected, selectionProcess } from '../Game'
import { letter } from '../letter'
import { markShootable } from '../markShootable'

export const moveAmazone = async (row, column, game) => {
    setSelectedCoordinates({ currentRow: row, currentColumn: column })
    // falls ein Feld gewählt wurde, welches gültig ist
    if (document.getElementById(letter(column) + row).classList.contains("selected")) {
        selectionProcess({ endrow: row, endcolumn: column })

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

        await markShootable(row, column, selectionProcess.startrow, selectionProcess.startcolumn, game)
        amazoneSelected.current = 2
    }
}

export const redoMove = () => {
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

    amazoneSelected.current = 0
}