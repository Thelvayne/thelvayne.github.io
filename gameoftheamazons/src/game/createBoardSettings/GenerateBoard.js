
import { useRef, useState } from "react";
import { newGame } from "../../communication/Communication";
import { createBoard } from "../createBoard/CreateNewBoard";
import { setIDGame } from "../Game"

export function GenerateBoard() {

    const xSize = useRef();
    const ySize = useRef();
    const amount = useRef();
    const timeout = useRef();

    const [settings, setSettings] = useState({ boardWidth: 10, boardHeigth: 10, amountAmazons: 4, timeoutTime: 600 });

    function submit() {
        setSettings({
            boardWidth: xSize.current.value,
            boardHeigth: ySize.current.value,
            amountAmazons: amount.current.value,
            timeoutTime: timeout.current.value
        });
        console.log(xSize.current.value + ", " + ySize.current.value + ", " + amount.current.value + ", " + timeout.current.value)
    };

    async function startGame() {
        const g = await newGame(
            settings.timeoutTime,
            settings.boardHeigth,
            settings.boardWidth,
            createBoard(settings.boardHeigth, settings.boardWidth, settings.amountAmazons)
        )
        setIDGame({ id: g.id })
    }

    return (
        <>
            <div className="settingswindow" id="sw">
                <div className="input">
                    <p>Gib die Breite des Spielfeldes an: </p>
                    <input type="number" ref={xSize} placeholder="Enter Board width" />
                    <p>Gib die Höhe des Spielfeldes an: </p>
                    <input type="number" ref={ySize} placeholder="Enter Board heigth" />
                    <p>Gib die Anzahl der Spielfiguren pro Spieler an: </p>
                    <input type="number" ref={amount} placeholder="Enter amount of Amazons" />
                    <p>Gib die timeout-Dauer an: </p>
                    <input type="number" ref={timeout} placeholder="Enter timeout-length" />
                </div>
                <div className="submitbutton">
                    <input type="button" className="submitSettings" value="save settings" onClick={submit} />
                    <input type="button" className="generateField" value={"create Playfield"} onClick={startGame} />
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