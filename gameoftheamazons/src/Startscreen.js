import React, {useRef} from 'react'
import Avatar from './Avatar.jpg'
import Avatar2 from './Avatar2.jpg'
import { useNavigate} from 'react-router-dom'
import { createPlayer } from './communication'




export default function Startscreen() {
    let navigate = useNavigate();
    
    const playernameone = useRef()
    const passwordone = useRef()
    const playernametwo = useRef()
    const passwordtwo = useRef()
    const playernameregister = useRef()
    const passwordregister = useRef()
 
    

  var objPlayers = [
      {
          playername: "Nick",
          password: "1234"
      },
      {
          playername: "Philipp",
          password: "5678"
      },
      {
          playername: "Danny",
          password: "9012"
      }
  ]

  async function getInfoone() {
      const playername = playernameone.current.value  
      
      const password = passwordone.current.value
      
      console.log("your playername is " + playername + " and your password is " + password)
  
      for(var i = 0; i < objPlayers.length; i++) {
          if(playername === objPlayers[i].playername && password === objPlayers[i].password) {               
                 
                  document.getElementById("playeruno").style.display = "none"
                  document.getElementById("playerdos").style.display = "block"
                  let p1 = await createPlayer(playername).then(res => {
                    console.log (res) 
                    return res
                  }).catch((error) => {
                    console.log("CREATEPLAYER error. Message is: " + error)
                    return {message: error.message}
                  })
                  
                  console.log("Return from url: ")
                  console.log(p1)
                  console.log(playername + " is Player one!")  
                  
              
              return;
            
          
              }  
                  
              } alert("Incorrect Login")
          }
      

          function getInfotwo() {
            const playername = playernametwo.current.value  
      
            const password = passwordtwo.current.value
              
              console.log("your playername is " + playername + " and your password is " + password)
          
              for(var i = 0; i < objPlayers.length; i++) {
                  if(playername === objPlayers[i].playername && password === objPlayers[i].password) {               
                       

                        
                          
                          
                          localStorage.setItem('playerNameOne', playernametwo);
                          const p2 = createPlayer(playername);
                          console.log("Return from url: ")
                          console.log(p2.name)
                          console.log(p2.id)
                          console.log(playername + " is Player two!")  

                          navigate("/Game")

                          return;
                  
                      } 
                          
                      
                  }alert("Incorrect Login")
                  
      }

      function signup(){
        document.getElementById("playeruno").style.display = "none"
        document.getElementById("playerdos").style.display = "none"
        document.getElementById("register").style.display = "block"
      }

      function register(){
          if (playernameregister != null && passwordregister != null) {
           document.getElementById("playeruno").style.display = "block"
              document.getElementById("register").style.display = "none"

              const fs = require('fs');

              const playerData = document.getElementById("playeruno").style.display + "\n" +
                  document.getElementById("register").style.display

              fs.writeFile("player.txt", playerData)


        }else{
            alert("Bitte füllen sie die Textfelder aus")
        }
      }
  return (
    <>
     <div className="loginbox playerone" id="playeruno">
        <img src={Avatar2} className="avatar" alt='Avatar2'/>
        <h1>Player 1 Login</h1>
        <form>
            <p>Playername</p>
            <input type="text" ref={playernameone} placeholder="Enter Name"></input>
            <p>Password</p>
            <input type="password" ref={passwordone} placeholder="Enter Password"></input>
            <input type="button" className="submitone" name="" value="login" onClick={getInfoone}></input>
            <input type="button" className="registerbutton" value="sign up" onClick={signup}></input>
            
        </form>
    </div>
    <div className="loginbox playertwo" id="playerdos">
        <img src={Avatar} className="avatar" alt='Avatar'></img>
        <h1>Player 2 Login</h1>
        <form>
            <p>Playername</p>
            <input type="text" ref={playernametwo} placeholder="Enter Name"></input>
            <p>Password</p>
            <input type="password" ref={passwordtwo} placeholder="Enter Password"></input>
            <input type="button" className="submittwo" name="" value="login" onClick={getInfotwo}></input>
            <input type="button" className="registerbutton" value="sign up" onClick={signup}></input>
            
        </form>
    </div>
    <div className="loginbox register" id="register">
        <img src={Avatar} className="avatar" alt='Avatar'></img>
        <h1>Registrate your Account</h1>
        <form>
            <p>Playername</p>
            <input type="text" ref={playernameregister} placeholder="Create Name"></input>
            <p>Password</p>
            <input type="password" ref={passwordregister} placeholder="Create Password"></input>
            <input type="button" className="submitregister" name="" value="create Account" onClick={register}></input>
            
            
        </form>
    </div>
        
    </>
  );
}
