import { useRef, useState } from "react";
import { newGame } from "../../communication/Communication";
import { createBoard } from "../createBoard/CreateNewBoard";
import { useNavigate } from "react-router-dom";

var gameID;

export function GenerateBoard() {
    let navigate = useNavigate();

    const xSize = useRef();
    const ySize = useRef();
    const amount = useRef();
    const timeout = useRef();

    const [settings, setSettings] = useState({ boardWidth: 10, boardHeigth: 10, amountAmazons: 4, timeoutTime: 60000 });

    function submit() {
        if (xSize.current.value === "" ||
            ySize.current.value === "" ||
            amount.current.value === "" ||
            timeout.current.value === "" ||
            xSize.current.value < 5 ||
            ySize.current.value < 5 ||
            amount.current.value < 1 ||
            timeout.current.value < 30000
        ) {
            return
        } else {
            setSettings({
                boardWidth: xSize.current.value,
                boardHeigth: ySize.current.value,
                amountAmazons: amount.current.value,
                timeoutTime: timeout.current.value
            });
        }
    };

    function consoleLog() {
        console.log(settings.boardWidth + ", " + settings.boardHeigth + ", " + settings.amountAmazons + ", " + settings.timeoutTime)
        console.log(settings);
        console.log(xSize);
    }

    async function startGame() {
        console.log(settings.timeoutTime, settings.boardHeigth, settings.boardWidth);
        // const game = await createBoard(settings.boardHeigth, settings.boardWidth, settings.amountAmazons);
        const g = await newGame(
            settings.timeoutTime,
            settings.boardHeigth,
            settings.boardWidth,
            createBoard(settings.boardHeigth, settings.boardWidth, settings.amountAmazons),
            0,
            1
        )
        console.log(g);
        gameID = g.id;
        if (g.message !== 400) {
            navigate("/Game")
        }
    }

    return (
        <>
            <div className="settingswindow" id="sw">
                <div className="input">
                    <p>Gib die Breite des Spielfeldes an: </p>
                    <input id="inputBoardWidth" type="number" ref={xSize} value={settings.boardWidth} min="5" onChange={submit} />
                    <p>Gib die Höhe des Spielfeldes an: </p>
                    <input id="inputBoardHeigth" type="number" ref={ySize} value={settings.boardHeigth} min="5" onChange={submit} />
                    <p>Gib die Anzahl der Spielfiguren pro Spieler an: </p>
                    <input id="inputAmountAmazons" type="number" ref={amount} value={settings.amountAmazons} min="1" onChange={submit} />
                    <p>Gib die timeout-Dauer an: </p>
                    <input id="inputTimeoutLength" type="number" ref={timeout} value={settings.timeoutTime} min="30000" onChange={submit} />
                </div>
                <div className="submitbutton">
                    <input type="button" className="generateField" value={"create Playfield"} onClick={startGame} />
                    <input type="button" className="debugging" value={"gimmeConsoleLogs"} onClick={consoleLog} />
                </div>
                <div className="currentSettings">
                    <p>Deine Aktuellen Einstellungen sind:</p>
                    <p>Höhe: {settings.boardWidth}</p>
                    <p>Breite: {settings.boardHeigth}</p>
                    <p>Anzahl: {settings.amountAmazons}</p>
                    <p>Timeout: {settings.timeoutTime}</p>
                </div>
            </div>
        </>
    )
}