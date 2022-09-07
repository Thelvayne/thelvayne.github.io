import { letter } from "../letter";
import { getGameID } from "../../communication/Communication";

export const CreateBoard = (rows, columns) => {

    var container = document.getElementById("Board");

    // erzeuge die divs für das Spielfeld
    for (let i = 0; i < rows; i++) {
        var row = document.createElement("div");
        var idRow = "row" + i;
        row.id = idRow;
        container.appendChild("row");

        for (let j = 0; j < columns; j++) {
            var cell = document.createElement("div");
            var idCell = letter(j) + i;
            cell.id = idCell;
            cell.className += "box"
            if ((i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1)) {
                cell.className += " white";
            } else {
                cell.className += " black";
            }
            row.appendChild(cell);
        }
    }
}

export const setBoard = async (thereIsAWinner) => {
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

    // falls noch keinen Gewinner gibt, gebe den Spieler an, der als nächstes am Zug ist
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
                document.getElementById(idToGet).className += " pieceblack"
            }
            // wenn rote Amazone gefunden wird
            else if (b.board.squares[i][j] === 1 && !document.getElementById(letter(j) + i).classList.contains("piecewhite")) {
                idToGet = ""
                idToGet += letter(j)
                idToGet += i
                document.getElementById(idToGet).className += " piecewhite"
            }
            // wenn Giftpfeil gefunden wird
            else if (b.board.squares[i][j] === -2 && !document.getElementById(letter(j) + i).classList.contains("arrow")) {
                idToGet = ""
                idToGet += letter(j)
                idToGet += i
                document.getElementById(idToGet).className += " arrow"
            }
        }
    }
}
