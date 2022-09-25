import { useRef, useState } from "react";
import { newGame } from "../../communication/Communication";
import { createBoard } from "../createBoard/CreateNewBoard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackgroundColor } from "../RenderBoard"
import { letter } from "../letter"
import { PlaceAmazons } from "../RenderBoard";

export var gameID;
export function GenerateBoard() {
    let [searchParams, setSearchParams] = useSearchParams();

    let idOne = searchParams.get("pIdOne");
    if (idOne === undefined || idOne === null || Number.isNaN(idOne)) {
        idOne = '-1'
    }
    let idTwo = searchParams.get("pIdTwo");
    if (idTwo === undefined || idTwo === null || Number.isNaN(idTwo)) {
        idTwo = '-1'
    }

    console.log("Das ist von der GenerateBoard.js, um zu sehen ob es die ID von searchParams: " + idOne + ", " + idTwo);

    let navigate = useNavigate();

    const xSize = useRef();
    const timeout = useRef();

    const [settings, setSettings] = useState({ boardWidth: 10, timeoutTime: 60000 });
    const [boardPrev, setBoardPrev] = useState();
    const [change, setChange] = useState(0)

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

        if (checkFigureValidity() === true) {
            const g = newGame(
                Number(settings.timeoutTime),
                Number(settings.boardWidth),
                Number(settings.boardWidth),
                boardPrev,
                0,
                1
            ).then((res) => {
                console.log(res);
                return res;
            })
            console.log(await g);
            gameID = g.id;
            if (await g.id !== undefined) {
                console.log("bin trotzdem hier :P");
                navigate("/Game/?id=" + gameID)
            }
        }
    }


    async function showField() {
        var bb = await createBoard(settings.boardWidth);
        setBoardPrev(bb);

        const parent = document.getElementById("parent");
        const board = bb;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const child = document.createElement("div");
                child.id = letter(j) + i;
                child.className = BackgroundColor(i, j);
                parent.appendChild(child);
                
            }
            let br = document.createElement('br');
            parent.appendChild(br);
        }
    }

    const checkFigureValidity = () => {
        let p1hasAFigure = false;
        let p2hasAFigure = false;

        for (let i = 0; i < boardPrev.length; i++) {
            for (let j = 0; j < boardPrev[i].length; j++) {
                if (boardPrev[i][j] === 0 && p1hasAFigure===false) {
                    p1hasAFigure = true;
                    console.log(p1hasAFigure);
                    continue;
                }
                if (boardPrev[i][j] === 1 && p2hasAFigure === false) {
                    p2hasAFigure = true;
                    console.log(p1hasAFigure);
                    continue;
                }
                if (p1hasAFigure === true && p2hasAFigure === true) {
                    console.log(p1hasAFigure + " | " + p2hasAFigure);
                    return true;
                }
            }

        }
        console.log(p1hasAFigure + " | " + p2hasAFigure);
        return (p1hasAFigure && p2hasAFigure);
    }

    const loadAmazone = (val, c, r) => {
        var str = " " + PlaceAmazons(Number(val));
        var box = document.getElementById(letter(c) + r);
        box.className += str;
    }

    function changeAmazone() {
        change === 0 ? setChange(1) : setChange(0);
    }

    const clicks = (evt) => {
        const targetClick = evt.target.className

        if (targetClick.includes("box")) {
            // console.log(change);
            const row = Number(evt.target.id.charAt(1));
            const column = Number((evt.target.id.charCodeAt(0) - 97));

            // console.log(boardPrev);
            // var b = boardPrev
            if (boardPrev !== undefined) {
                if (boardPrev[row][column] === -1) {
                    boardPrev[row][column] = change;
                    loadAmazone(change, column, row);
                } else {
                    boardPrev[row][column] = -1;
                    var el = document.getElementById(letter(column) + row);
                    if (el.className.includes("pieceblack")) el.classList.remove("pieceblack")
                    else el.classList.remove("piecewhite")
                }
                console.log(boardPrev);
            }
            // setBoardPrev(b)
        }
    }

    // useEffect(() => {
    //     console.log(boardPrev);
    //     console.log(change);


    // const e = document.getElementById("parent");
    // e.addEventListener("click", clicks)
    // e.removeEventListener("click", clicks)
    // }, [boardPrev, change])

    // const place = (row, column, c) => {
    //     if (boardPrev === undefined) return
    //     var board = boardPrev
    //     console.log(boardPrev);
    //     console.log(board);
    //     if (board[row][column] === -1) {
    //         board[row][column] = c;
    //         loadAmazone(c, column, row)
    //     } else {
    //         board[row][column] = -1
    //         var el = document.getElementById(letter(column) + row);
    //         if (el.className.includes("pieceblack")) {
    //             let str = el.className
    //             str = str.replace("pieceblack", "")
    //             el.className = str;
    //         } else {
    //             let str = el.className
    //             str = str.replace("piecewhite", "")
    //             el.className = str;
    //         }
    //     }
    // }

    return (
        <div className="settingswindow" id="sw">
            <div className="input">
                <p>Gib die Breite des Spielfeldes an: </p>
                <input id="inputBoardSize" type="number" ref={xSize} value={settings.boardWidth} min="5" onChange={submit} />
                <p>Gib die timeout-Dauer an: </p>
                <input id="inputTimeoutLength" type="number" ref={timeout} value={settings.timeoutTime} min="30000" onChange={submit} />
            </div>
            <div className="submitbutton">

                <input type="button" className="showUserPlayfield" value={"showField"} onClick={showField} />
            </div>
            <div>
                <p>Deine Aktuellen Einstellungen sind:</p>
                <p>Höhe: {settings.boardWidth}</p>
                <p>Timeout: {settings.timeoutTime}</p>
                <p>Ab hier soll das Feld dargestellt werden: </p>
                <input type="button" className="setAmazone" value="changePlayerAmazone" onClick={changeAmazone} />
                <p>gewählte Amazone: {change}</p>
            </div>
            <div className="currentBoard" id="parent" onClick={clicks}>

            </div>
            <input type="button" id="createGame" className="createGame" value={"createGame"} onClick={startGame} />
        </div>
    )
}