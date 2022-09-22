import React from 'react'
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import LoginForm from '../game/loginForm/LoginForm';




export default function Gamelobby(){
    let navigate = useNavigate();
    function OpenRules(){
        
        navigate("../Help")
    } 
    function CreateLobby(){
        document.getElementById("CLobby").classList.remove("visually-hidden");
    }
    function GotoLogin(){
        navigate("../Startscreen")
    }
    const adminUser= {
        password: "admin123"
    }
    const [user, setUser] = useState({name: ""});
    const [error, setError] = useState("");

    const Login = details => {
        console.log(details);
    }
    const Logout = () => 
        console.log("Logout");
    return (
        <div>
        <div class ="sidenav">
        <h1>Game Of the Amazons</h1>
        {(user.name !== "") ? (
            <h2>Welcome, <span>{user.name}</span></h2>
        ):(
          <LoginForm />  
        )}
        <button onClick={CreateLobby}>Create new Lobby</button>
        <button onClick={OpenRules}>Rules</button>
        <button onClick={GotoLogin}>Login</button>
        <button onClick={GotoLogin}>Sign Up</button>
    </div>
    <div className="main">
       
        <div className="OpenLobbies">
            <h1>Open Lobbies</h1>
            <button onClick={CreateLobby}>Create new Lobby</button>
            
        </div>

            

    </div>
    <div id="CLobby" className="visually-hidden CLobby">
        <h1 className="Create Lobby">Create Lobby</h1>
        <p>Lobby Name</p>
        <input id="lobbyName" type="text"></input>
        <button id="createLobby" onClick={CreateLobby}>Create Lobby</button>
    </div>
    </div>
    )
}