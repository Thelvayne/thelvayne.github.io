import React from 'react'
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import LoginForm from '../game/loginForm/LoginForm';
import { GenerateBoard } from '../game/createBoardSettings/GenerateBoard';




export default function Gamelobby(){
    let navigate = useNavigate();
    function OpenRules(){
        
        navigate("../Help")
    }

    function CreateGame() {
            document.getElementById("CGame").classList.remove("visually-hidden");
    }
   
    const adminUser= {
        name: "admin",
        password: "admin123"
    }
    const [user, setUser] = useState({name: ""});
    const [error, setError] = useState("");


    const Login = details => {
        console.log(details);

        if (details.name === adminUser.name && details.password === adminUser.password){

        console.log("Logged in");
        setUser({
            name: details.name

        });
            }else{
                console.log("Details do not match");
                setError("Details do not match")
            }
        }
    const Logout = () => {
        setUser({
            name: ""
        })
        console.log("Logout");
    }
        
    return (
        <div>
        <div class ="sidenav">
        <h1>Game Of the Amazons</h1>
        {(user.name !== "") ? (
            <div className='welcome'>
                <h2>Welcome, <span>{user.name}</span></h2>
                <button onClick={Logout}>Logout</button>
                <button onClick={CreateGame}>Create new Game</button>
                <button onClick={OpenRules}>Rules</button>
            </div>
        ):(
          <LoginForm Login={Login} error={error}/>  
        )}
        
        
    </div>
    <div className="main">
       
        <div className="OpenGames">
            <h1>Existing Games</h1>
            <p>Click on game to Spectate</p>
            {(user.name !== "") ? (
            <button onClick={CreateGame}>Create new Game</button>
            ):(
                <div>
                    <p>Login first to create a Game</p>
                </div>
              )}
              <li><a href='#'>Game von Atze</a></li>

              <li><a href='#'>Game von Atze2</a></li>
        </div>

            

    </div>
    <div id="CGame" className="visually-hidden CGame">
        <h1 className="CreateGame">Create Game</h1>
        <p>Game Name</p>
        <input id="gameName" type="text"></input>
        < GenerateBoard/>

        <button id="createGame" className="createGame" onClick={CreateGame}>Create Game</button>
    </div>

    </div>
    )
}