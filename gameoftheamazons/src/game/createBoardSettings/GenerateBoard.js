import { useEffect, useRef, useState } from "react";
import { newGame } from "../../communication/Communication";
import { createBoard } from "../createBoard/CreateNewBoard";
import { useNavigate } from "react-router-dom";
import { BackgroundColor } from "../RenderBoard"
import { letter } from "../letter"
import { PlaceAmazons } from "../RenderBoard";


export function GenerateBoard() {

    let navigate = useNavigate();

    const xSize = useRef();
    const timeout = useRef();
    const ids = useRef({ userId: undefined, pId: undefined, opId: undefined });
    var gameID;

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

    function closeWindow() {
        document.getElementById("CGame").classList.add("visually-hidden");
        //document.getElementById("sidebarright").classList.add("visually-hidden");
    }

    async function startGame() {

        if (checkFigureValidity() === true && boardPrev !== undefined) {
            const g = await newGame(
                Number(settings.timeoutTime),
                Number(settings.boardWidth),
                Number(settings.boardWidth),
                boardPrev,
                ids.current.pId,
                ids.current.opId
            )
            console.log(await g);
            gameID = await g.id;
            console.log(g.id);
            if (g.id !== undefined) {
                console.log("bin trotzdem hier :P");
                navigate("/Game/?userId="+ids.current.userId+"gameId=" + gameID)
            }
        }
    }

    async function showField() {
        var bb = await createBoard(settings.boardWidth);
        setBoardPrev(bb);

        const parent = document.getElementById("parent");
        parent.style.width = 100 * settings.boardWidth + 'px';
        const board = bb;


        if (parent.childElementCount !== 0) {
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const child = document.createElement("div");
                child.id = letter(j) + i;
                child.className = BackgroundColor(i, j);
                parent.appendChild(child);
            }

        }
    }


    const checkFigureValidity = () => {
        let p1hasAFigure = false;
        let p2hasAFigure = false;

        for (let i = 0; i < boardPrev.length; i++) {
            for (let j = 0; j < boardPrev[i].length; j++) {
                if (boardPrev[i][j] === 0 && p1hasAFigure === false) {
                    p1hasAFigure = true;
                    // console.log(p1hasAFigure);
                    continue;
                }
                if (boardPrev[i][j] === 1 && p2hasAFigure === false) {
                    p2hasAFigure = true;
                    // console.log(p1hasAFigure);
                    continue;
                }
                if (p1hasAFigure === true && p2hasAFigure === true) {
                    // console.log(p1hasAFigure + " | " + p2hasAFigure);
                    return true;
                }
            }

        }
        // console.log(p1hasAFigure + " | " + p2hasAFigure);
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
            const row = Number(evt.target.id.charAt(1));
            const column = Number((evt.target.id.charCodeAt(0) - 97));

            if (boardPrev !== undefined) {
                if (boardPrev[row][column] === -1) {
                    boardPrev[row][column] = change;
                    loadAmazone(change, column, row);
                } else {
                    boardPrev[row][column] = -1;
                    var el = document.getElementById(letter(column) + row);
                    if (el.className.includes("pieceblack")) el.classList.remove("pieceblack");
                    else el.classList.remove("piecewhite");
                }
                console.log(boardPrev);
            }
        }
    }
    useEffect(() => readIds)

    const readIds = () => {
        var url = window.location.href;
        var stringuserId, stringpId, stringopId;
        stringuserId = url.indexOf("userId=");
        stringpId = url.indexOf("pId=");
        stringopId = url.indexOf("opId=");
        var s1 = url.substring(stringuserId + 7, stringpId - 1);
        var s2 = url.substring(stringpId + 4, stringopId - 1);
        var s3 = url.substring(stringopId + 5);
        console.log(s1 + ", " + s2 + ", " + s3);
        ids.current.userId = Number(s1);
        ids.current.pId = Number(s2);
        ids.current.opId = Number(s3);
        console.log(ids.current.userId);
        console.log(ids.current.pId);
        console.log(ids.current.opId);
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
            <input type="button" id="readIds" className="readIds" value={"readIds"} onClick={readIds} />
            <input type="button" id="back" className="readIds" value={"closeWindow"} onClick={closeWindow} />
        </div>
    )
}