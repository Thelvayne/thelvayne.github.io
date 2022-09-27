import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../game/loginForm/LoginForm';
import { GenerateBoard } from '../game/createBoardSettings/GenerateBoard';
import { createPlayer, deletePlayer, getGames, getPlayers } from '../communication/Communication';

export default function Gamelobby() {
    let [searchParams] = useSearchParams();
    
    let userId = searchParams.get("userId");
    if (userId === undefined || userId === null || Number.isNaN(userId)) {
        userId = '-1'
    }

    let pId = searchParams.get("pId");
    if (pId === undefined || pId === null || Number.isNaN(pId)) {
        pId = '-1'
    }

    let opId = searchParams.get("opId");
    if (opId === undefined || opId === null || Number.isNaN(opId)) {
        opId = '-1'
    }

    setInterval(console.log("Das ist von der Gamelobby.js, um zu sehen ob es die ID von searchParams: " + pId + ", " + opId), 1000);




    let navigate = useNavigate();
    function OpenRules() {
        userId !== -1 ? opId !== -1 ? 
        navigate("../Help/?userId=" + userId + "&pId=" + pId + "&opId=" + opId) : 
        navigate("../Help/?userId=" + userId + "&pId=" + pId) : 
        navigate("../Help/");
    }
    function CreateGame() {
        document.getElementById("CGame").classList.remove("visually-hidden");
        //document.getElementById("sidebarright").classList.remove("visually-hidden");
    }

    const adminUser = {
        name: "admin",
    }
    const [user, setUser] = useState({ name: "" });
    const [error, setError] = useState("");


    const Login = details => {
        console.log(details);

     

            console.log("Logged in");
            setUser({
                name: details.name
            });
            createPlayer(details.name).then((c)=>{pId = c.id});
        
    }
   const Logout = async() => {
        setUser({
            name: ""
        })
        document.getElementById("CGame").classList.add("visually-hidden");
        document.getElementById("sidebarright").classList.add("visually-hidden");
        console.log("Logout");
        await deletePlayer(pId);
    }

    const renderGameList = async () => {
        const allCurrentGames = await getGames();
        console.log(await allCurrentGames);

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
                const child = document.createElement('li');
                const baby = document.createElement('a');
                baby.href = "/Game/?id=" + allCurrentGames.games[ind].id;
                baby.innerText = "Spiel " + allCurrentGames.games[ind].id;
                child.appendChild(baby);
                parent.appendChild(child);
            }
        }
    }

    setInterval(renderGameList, 5000);

    const renderPlayerList = async () => {
        const allCurrentPlayer = await getPlayers();
        const list = await getAllPlayersInGames()
        console.log(await allCurrentPlayer + "||" + list);

        const parent = document.getElementById("sidebarright");
        if (parent.childElementCount !== 0) {
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }
        }
        for (const ind in allCurrentPlayer.players) {
            if (Object.hasOwnProperty.call(allCurrentPlayer.players, ind)) {
                if (!list.includes(allCurrentPlayer.players[ind].id)){
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
        console.log(await games);
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
        let opponentId = evt.target.id;
        let opponentIdStr = opponentId.toString()

        if (evt.target.className.includes("clickable")) {
            if ('URLSearchParams' in window) {
                searchParams.set("opId", opponentIdStr);
                var newURL = window.location.pathname + '?' + searchParams.toString();
                window.history.pushState({}, null, newURL);
                console.log("Das ist von der Gamelobby.js, um zu sehen ob es die ID von searchParams: " + pId + ", " + opId);
            }
        }
    }

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
                        <button onClick={CreateGame}>Create new Game</button>
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
                <h1 className="CreateGame">Create Game</h1>
                <p>Game Name</p>
                <input id="gameName" type="text"></input>
                < GenerateBoard />

                {/* <button id="createGame" className="createGame" onClick={CreateGame}>Create Game</button>*/ }
            </div>
            <div id="sidebarright" className="sidebarright" onClick={choseOpponent}>
                Choose your Opponent.
            </div>
        </div>

    )
}