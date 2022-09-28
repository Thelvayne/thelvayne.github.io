import React, { useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../game/loginForm/LoginForm';
import { GenerateBoard } from '../game/createBoardSettings/GenerateBoard';
import { createPlayer, deletePlayer, getGames, getPlayers } from '../communication/Communication';

export default function Gamelobby() {
    const [searchParams] = useSearchParams();

    const log = () => {
        console.log("UserId: " + searchParams.get("userId"))
        console.log("pId: " + searchParams.get("pId"))
        console.log("opId: " + searchParams.get("opId"))
    }
    setInterval(log, 15000);

    var navigate = useNavigate();
    function OpenRules() {

        navigate("../HelpLobby")
    }
    function CreateGame() {
        document.getElementById("CGame").classList.remove("visually-hidden");
        document.getElementById("sidebarright").classList.remove("visually-hidden");
    }


    const [user, setUser] = useState({ name: "" });
    const [error, setError] = useState("");


    const Login = async details => {
        console.log(details);

        console.log("Logged in");
        setUser({
            name: details.name
        });
        var p = await createPlayer(details.name);
        var playerId = p.id;
        var userId = playerId.toString();
        if ('URLSearchParams' in window) {
            searchParams.set("userId", userId);
            searchParams.set("pId", userId);
            console.log(searchParams.get("userId") + ", " + searchParams.get("pId"));
            var newURL = window.location.pathname + '?' + searchParams.toString();
            window.history.pushState({}, null, newURL);
            console.log("Das ist von der Gamelobby.js, um zu sehen ob es die ID von searchParams: " +
                searchParams.get("userId") + ", " +
                searchParams.get("pId") + ", " +
                searchParams.get("opId")
            );
        }
    }
    const Logout = () => {
        setUser({
            name: ""
        })
        document.getElementById("CGame").classList.add("visually-hidden");
        document.getElementById("sidebarright").classList.add("visually-hidden");
        console.log("Logout");
        console.log(searchParams.get("userId"));
        deletePlayer(Number(searchParams.get("userId")))
        searchParams.delete("userId")
        searchParams.delete("pId")
        searchParams.delete("opId")
        var newURL = window.location.origin + window.location.pathname
        window.history.pushState({}, null, newURL);
    }

    const renderGameList = async () => {
        const allCurrentGames = await getGames();
        // console.log(await allCurrentGames);

        const parent = document.getElementById("listOfGames");
        if (parent.childElementCount !== 0) {
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (const ind in allCurrentGames.games) {
            if (Object.hasOwnProperty.call(allCurrentGames.games, ind)) {
                // console.log(ind);
                // console.log(await allCurrentGames.games[ind].id);
                // console.log(await allCurrentGames.games[ind].players);
                if (allCurrentGames.games[ind].winningPlayer === undefined) {
                    const child = document.createElement('li');
                    const baby = document.createElement('a');
                    baby.href = "/Game/?userId=" + searchParams.get("userId") + "&gameId=" + allCurrentGames.games[ind].id;
                    baby.innerText = "Spiel " + allCurrentGames.games[ind].id;
                    child.appendChild(baby);
                    parent.appendChild(child);
                }
            }
        }
    }

    setInterval(renderGameList, 5000);

    const renderPlayerList = async () => {
        const allCurrentPlayer = await getPlayers();
        const list = await getAllPlayersInGames()
        // console.log(await allCurrentPlayer + "||" + list);

        const parent = document.getElementById("sidebarright");
        if (parent.childElementCount !== 0) {
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (const ind in allCurrentPlayer.players) {
            if (Object.hasOwnProperty.call(allCurrentPlayer.players, ind)) {
                if (!list.includes(allCurrentPlayer.players[ind].id)) {
                    const child = document.createElement('li');
                    const baby = document.createElement('a');
                    // console.log(allCurrentPlayer.players);
                    // console.log(ind);
                    // console.log(allCurrentPlayer.players[ind]);
                    baby.innerHTML = allCurrentPlayer.players[ind].name;
                    baby.id = allCurrentPlayer.players[ind].id;
                    baby.className = "clickable"
                    child.appendChild(baby);
                    child.style.cursor = "pointer";
                    parent.appendChild(child);
                }
            }
        }
    }

    const getAllPlayersInGames = async () => {
        const games = await getGames();
        var list = new Array([]);
        // console.log(await games);
        for (const ind in games.games) {
            if (Object.hasOwnProperty.call(games.games, ind)) {
                const playerOne = games.games[ind].players[0];
                const playerTwo = games.games[ind].players[1];
                list.push(playerOne);
                list.push(playerTwo);
            }
        }
        return list;
    }

    setInterval(renderPlayerList, 5000);

    const choseOpponent = (evt) => {
        var opponentId = evt.target.id;
        var opponentIdStr = opponentId.toString()

        if (evt.target.className.includes("clickable")) {
            if ('URLSearchParams' in window) {
                searchParams.set("opId", opponentIdStr);
                var newURL = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState({}, null, newURL);
                console.log("Das ist von der Gamelobby.js, um zu sehen ob es die ID von searchParams: " + searchParams.get("pId") + ", " + searchParams.get("opId"));
            }
        }
    }
    function closeWindow() {
        document.getElementById("CGame").classList.add("visually-hidden");
        //document.getElementById("sidebarright").classList.add("visually-hidden");
    }

    const userIdToGenerateBoard = useRef(searchParams.get("userId"));
    const pIdToGenerateBoard = useRef(searchParams.get("pId"));
    const opIdToGenerateBoard = useRef(searchParams.get("opId"));

    if (userIdToGenerateBoard.current === null ) {userIdToGenerateBoard.current = '-1'}
    if (pIdToGenerateBoard.current === null ) {pIdToGenerateBoard.current = '-1'}
    if (opIdToGenerateBoard.current === null ) {opIdToGenerateBoard.current = '-1'}

    const log2 = () => {
        console.log("userID: " + userIdToGenerateBoard.current);
        console.log("pID: " + pIdToGenerateBoard.current);
        console.log("opID: " + opIdToGenerateBoard.current);
    }

    setInterval(log2, 5000)
    return (
        <div>
            <div className="sidenav">
                <h1>Game of the Amazons</h1>
                {(user.name !== "") ? (
                    <div className='welcome'>
                        <h2>Welcome, <span>{user.name}</span></h2>
                        <button onClick={Logout}>Logout</button>
                        <button onClick={CreateGame}>Create new Game</button>
                        <button onClick={OpenRules}>Rules</button>
                    </div>
                ) : (
                    <LoginForm Login={Login} error={error} />
                )}


            </div>
            <div className="main">

                <div className="OpenGames">
                    <h1>Existing Games</h1>
                    <p>Click on game to Spectate</p>
                    {(user.name !== "") ? (
                        <button className="CreateGame" onClick={CreateGame}>Create new Game</button>
                    ) : (
                        <div>
                            <p>Login first to create a Game</p>
                        </div>
                    )}
                    <div id='listOfGames' className='gamelist'>
                    </div>
                    {/* <li><a href='#'>Game von Atze</a></li>

                    <li><a href='#'>Game von Atze2</a></li> */}
                </div>



            </div>
            <div id="CGame" className="visually-hidden CGame">
                <input type="button" id="back" className="back" value={"X"} onClick={closeWindow} />
                <h1 className="CreateGame">Create Game</h1>

                < GenerateBoard userId={userIdToGenerateBoard.current} pId={pIdToGenerateBoard.current} opId={opIdToGenerateBoard.current.value} />

                {/* <button id="createGame" className="createGame" onClick={CreateGame}>Create Game</button>*/}
            </div>

            <div id="sidebarright" className="sidebarright visually-hidden" onClick={choseOpponent}>
                Choose your Opponent
            </div>
        </div>

    )
}