import React, { useRef } from 'react'
import Avatar from '../pictures/Avatar.jpg'
import Avatar2 from '../pictures/Avatar2.jpg'
import { useNavigate } from 'react-router-dom'
import { createPlayer, deletePlayer, getPlayers } from '../communication/Communication'





export default function Startscreen() {
    let navigate = useNavigate();

    const playernameone = useRef()
    const playernametwo = useRef()

    // Spieler1-Erstellung
    async function getInfoone() {

        const playername = playernameone.current.value

        let p = await createPlayer(playername)
        console.log('Your Playername is: ' + p.name + " and your ID is: " + p.id)
        document.getElementById("playeruno").style.display = "none"
        document.getElementById("playerdos").style.display = "block"

    }

    // Spieler2-Erstellung und anschließend Spielerzeugung
    async function getInfotwo() {
        const playername = playernametwo.current.value

        let p = await createPlayer(playername)
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GET error. Message is: ' + error.message)
                return { message: error.message }
            })
        console.log('Your Playername is: ' + p.name + " and your ID is: " + p.id)

        // let g = await newGame()
        //     .then((res) => {
        //         return res
        //     }).catch((error) => {
        //         console.log('STARTGAME error. Message is: ' + error.message)
        //         return { message: error.message }
        //     })
        // console.log("Your game has the id: " + g.id)
        navigate("/Game")

    }


// löscht den letzten Spieler in der Spielerliste
    const deletePlayerWithID = async () => {

        let ps = await getPlayers()
            .then((res) => {
                return res
            }).catch((error) => {
                console.log('GET error. Message is: ' + error.message)
                return { message: error.message }
            })

        if (ps.players.length > 0) {
            console.log(ps)
            let lastPlayerID = ps.players[ps.players.length - 1].id
            console.log(lastPlayerID)

            await deletePlayer(lastPlayerID)
                .then((res) => {
                    return res
                }).catch((error) => {
                    console.log('GET error. Message is: ' + error.message)
                    return { message: error.message }
                })

        }

    }

    return (
        <>
            <div className="loginbox playerone" id="playeruno">
                <img src={Avatar2} className="avatar" alt='Avatar2' />
                <h1>Player 1 Login</h1>
                <form>
                    <p>Playername</p>
                    <input type="text" ref={playernameone} placeholder="Enter Name"></input>

                    <input type="button" className="submitone" name="" value="Create as Player" onClick={getInfoone}></input>
                    <input type="button" className="ai" value="Create as KI" ></input>
                    <input type="button" className="deletePlayer" value="deletePlayer" onClick={deletePlayerWithID}></input>

                </form>
            </div>
            <div className="loginbox playertwo" id="playerdos">
                <img src={Avatar} className="avatar" alt='Avatar'></img>
                <h1>Player 2 Login</h1>
                <form>
                    <p>Playername</p>
                    <input type="text" ref={playernametwo} placeholder="Enter Name"></input>

                    <input type="button" className="submittwo" name="" value="Create as Player" onClick={getInfotwo}></input>
                    <input type="button" className="ai" value="Create as KI" ></input>
                    <input type="button" className="deletePlayer" value="deletePlayer" onClick={deletePlayerWithID}></input>


                </form>
            </div>


        </>
    );
}
