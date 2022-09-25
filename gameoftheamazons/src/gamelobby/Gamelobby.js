import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginForm from '../game/loginForm/LoginForm';
import { GenerateBoard } from '../game/createBoardSettings/GenerateBoard';
import { getGames } from '../communication/Communication';




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

        for (const ind in allCurrentGames.games) {
            if (Object.hasOwnProperty.call(allCurrentGames.games, ind)) {
                console.log(ind);
                console.log(await allCurrentGames.games[ind].id);
                console.log(await allCurrentGames.games[ind].players);
                const child = document.createElement('li');
                const baby = document.createElement('a');
                baby.href = "/Game/?id="+allCurrentGames.games[ind].id;
                baby.innerText = "Spiel " + allCurrentGames.games[ind].id;
                child.appendChild(baby);
                parent.appendChild(child);
                
            }
        }
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
                        <button onClick={renderGameList}>show all games</button>
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
                    <div id="sidebarright" className="sidebarright visually-hidden">
                        Choose your Opponent.
                    </div>
        </div>

    )
}