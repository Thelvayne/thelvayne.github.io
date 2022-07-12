import React, {useRef} from 'react'
import Avatar from './Avatar.jpg'
import Avatar2 from './Avatar2.jpg'
import { useNavigate} from 'react-router-dom'
import { createPlayer } from './communication'




export default function Startscreen() {
    let navigate = useNavigate();
    
    const playernameone = useRef()
    
    const playernametwo = useRef()
    
    
 
    

  var objPlayers = [
      {
          playername: "Nick",
        
      },
      {
          playername: "Philipp",
         
      },
      {
          playername: "Danny",
         
      }
  ]

  async function getInfoone() {
      const playername = playernameone.current.value  
      
 
      
      console.log("your playername is " + playername)
  
      for(var i = 0; i < objPlayers.length; i++) {
          if(playername === objPlayers[i].playername) {               
                 
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
      
  
              
              console.log("your playername is " + playername)
          
              for(var i = 0; i < objPlayers.length; i++) {
                  if(playername === objPlayers[i].playername) {               
                       

                        
                          
                          
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

     
      
  return (
    <>
     <div className="loginbox playerone" id="playeruno">
        <img src={Avatar2} className="avatar" alt='Avatar2'/>
        <h1>Player 1 Login</h1>
        <form>
            <p>Playername</p>
            <input type="text" ref={playernameone} placeholder="Enter Name"></input>
            
            <input type="button" className="submitone" name="" value="Create as Player" onClick={getInfoone}></input>
            <input type="button" className="registerbutton" value="Create as KI"></input>
            
        </form>
    </div>
    <div className="loginbox playertwo" id="playerdos">
        <img src={Avatar} className="avatar" alt='Avatar'></img>
        <h1>Player 2 Login</h1>
        <form>
            <p>Playername</p>
            <input type="text" ref={playernametwo} placeholder="Enter Name"></input>
          
            <input type="button" className="submittwo" name="" value="Create as Player" onClick={getInfotwo}></input>
            <input type="button" className="registerbutton" value="Create as KI" ></input>
            
        </form>
    </div>
    
        
    </>
  );
}
