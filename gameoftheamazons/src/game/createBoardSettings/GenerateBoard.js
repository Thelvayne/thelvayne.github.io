import { useRef, useState } from "react";
import { newGame } from "../../communication/Communication";
import { createBoard } from "../createBoard/CreateNewBoard";
import { useNavigate } from "react-router-dom";
import { BackgroundColor } from "../RenderBoard"
import { letter } from "../letter"
import { PlaceAmazons } from "../RenderBoard";

export var gameID;
export function GenerateBoard() {
    let navigate = useNavigate();

    const xSize = useRef();
    const timeout = useRef();

    const [settings, setSettings] = useState({ boardWidth: 10, timeoutTime: 60000 });
    var boardPrev;
    const [change, setChange] = useState({val: 0})

    function submit() {
        if (xSize.current.value === "" ||
            timeout.current.value === "" ||
            xSize.current.value < 5 ||
            timeout.current.value < 30000
        ) {
            return
        } else {
            setSettings({
                boardWidth: xSize.current.value,
                timeoutTime: timeout.current.value
            });
        }
    };


    async function startGame() {
        const g = newGame(
            Number(settings.timeoutTime),
            Number(settings.boardWidth),
            Number(settings.boardWidth),
            createBoard(settings.boardWidth),
            0,
            1
        ).then((res) => {
            console.log(res);
            return res;
        })
        console.log(await g);
        gameID = g.id;
        if (await g.message !== 400) {
            navigate("/Game")
        }
    }

    async function showField() {
        var bb = await createBoard(settings.boardWidth);
        boardPrev = bb;

        const parent = document.getElementById("parent");
        const board = bb;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const child = document.createElement("div");
                child.id = letter(j) + i;
                child.className = BackgroundColor(i, j);
                parent.appendChild(child);
            }
        }
    }

    const loadAmazone = (val, c, r) => {
        var str = " " + PlaceAmazons(Number(val));
        var box = document.getElementById(letter(c) + r);
        box.className += str;
    }

    document.addEventListener("click", evt => {
        const targetClick = evt.target.className;
        if (targetClick.includes("box")) {
            console.log(change.val);
            const row = Number(evt.target.id.charAt(1));
            const column = Number((evt.target.id.charCodeAt(0) - 97));

            console.log(boardPrev);
            if (boardPrev[row][column] === -1) {
                boardPrev[row][column] = change.val;
                loadAmazone(change.val, column, row)
            } else {
                boardPrev[row][column] = -1
                var el = document.getElementById(letter(column) + row);
                if (el.className.includes("pieceblack")) {
                    let str = el.className
                    str = str.replace("pieceblack", "")
                    el.className = str;
                } else {
                    let str = el.className
                    str = str.replace("piecewhite", "")
                    el.className = str;
                }
            }
           
        }
    })

    function changeAmazone() {
        if (change.val === 0) {
            setChange({val: 1})
        } else {
            setChange({val: 0})
        }
    }

    return (
        <div className="settingswindow" id="sw">
            <div className="input">
                <p>Gib die Breite des Spielfeldes an: </p>
                <input id="inputBoardSize" type="number" ref={xSize} value={settings.boardWidth} min="5" onChange={submit} />
                <p>Gib die timeout-Dauer an: </p>
                <input id="inputTimeoutLength" type="number" ref={timeout} value={settings.timeoutTime} min="30000" onChange={submit} />
            </div>
            <div className="submitbutton">
                <input type="button" className="generateField" value={"create Playfield"} onClick={startGame} />
                <input type="button" className="showUserPlayfield" value={"showField"} onClick={showField} />
            </div>
            <div className="currentBoard" id="parent">
                <p>Deine Aktuellen Einstellungen sind:</p>
                <p>Höhe: {settings.boardWidth}</p>
                <p>Timeout: {settings.timeoutTime}</p>
                <p>Ab hier soll das Feld dargestellt werden: </p>
                <input type="button" className="setAmazone" value="changePlayerAmazone" onClick={changeAmazone} />
                <p>gewählte Amazone: {change.val}</p>
            </div>
        </div>
    )
}