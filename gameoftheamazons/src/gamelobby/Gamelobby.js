import React from 'react'
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../game/loginForm/LoginForm';
import { GenerateBoard } from '../game/createBoardSettings/GenerateBoard';
import { getGames, getPlayers } from '../communication/Communication';




export default function Gamelobby() {

    let navigate = useNavigate();
    function OpenRules() {

        navigate("../Help")
    }
    function CreateGame() {
        document.getElementById("CGame").classList.remove("visually-hidden");
        document.getElementById("sidebarright").classList.remove("visually-hidden");
    }

    const adminUser = {
        name: "admin",
        password: "admin123"
    }
    const [user, setUser] = useState({ name: "" });
    const [error, setError] = useState("");


    const Login = details => {
        console.log(details);

        if (details.name === adminUser.name && details.password === adminUser.password) {

            console.log("Logged in");
            setUser({
                name: details.name

            });
        } else {
            console.log("Details do not match");
            setError("Details do not match")
        }
    }
    const Logout = () => {
        setUser({
            name: ""
        })
        document.getElementById("CGame").classList.add("visually-hidden");
        document.getElementById("sidebarright").classList.add("visually-hidden");
        console.log("Logout");
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
                console.log(ind);
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
        console.log(await allCurrentPlayer);

        const parent = document.getElementById("sidebarright");
        if (parent.childElementCount !== 0) {
            while (parent.childElementCount > 0) {
                parent.removeChild(parent.lastChild);
            }         
        }
        for (const ind in allCurrentPlayer.players) {
            if (Object.hasOwnProperty.call(allCurrentPlayer.players, ind)) {
                const child = document.createElement('li');
                const baby = document.createElement('a');
                console.log(allCurrentPlayer.players);
                console.log(ind);
                console.log(allCurrentPlayer.players[ind]);
                baby.innerHTML = allCurrentPlayer.players[ind].name;
                baby.id = allCurrentPlayer.players[ind].id;
                child.appendChild(baby);
                parent.appendChild(child);
            }
        }
    }

    setInterval(renderPlayerList, 5000);

    const choseOpponent = (evt) => {
        let userID = evt.target.id;
        console.log(userID);
        
    }

    return (
        <div>
            <div className="sidenav">
                <h1>Game Of the Amazons</h1>
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

                {/* <button id="createGame" className="createGame" onClick={CreateGame}>Create Game</button> */}
            </div>
            <div id="sidebarright" className="sidebarright visually-hidden" onClick={choseOpponent}>
                Choose your Opponent.
            </div>
        </div>

    )
}