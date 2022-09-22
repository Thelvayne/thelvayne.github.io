import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Gamelobby(){
    let navigate = useNavigate();
    function OpenRules(){
        
        navigate("./help/Help")
    } 
    function CreateLobby(){
        document.getElementById("CLobby").classList.remove("visually-hidden");
    }
    function GotoLogin(){
        navigate("./Startscreen/Startscreen")
    }
    return (
        <div>
        <div class ="sidenav">
        <h1>Game Of the Amazons</h1>
        <button onClick={CreateLobby}>Create new Lobby</button>
        <button onClick={OpenRules}>Rules</button>
        <button onClick={GotoLogin}>Login</button>
        <button onClick={GotoLogin}>Sign Up</button>
    </div>
    <div className="main">
       
        <div className="OpenLobbies">
            <h1>Open Lobbies</h1>
            <button>Create new Lobby</button>
        </div>

            

    </div>
    <div id="CLobby" className="visually-hidden">
        <h1 className="Create Lobby">Create Lobby</h1>
        <input id="lobbyName" type="text" value="New Lobby"></input>
        <button id="createLobby" onClick={CreateLobby}>Create Lobby</button>
    </div>
    </div>
    )
}