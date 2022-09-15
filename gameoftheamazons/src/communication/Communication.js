const urlPlayer = "https://gruppe12.toni-barth.com/players/"
const urlGame = "https://gruppe12.toni-barth.com/games/"
const urlMove = "https://gruppe12.toni-barth.com/move/"


// CRUD-Operationen
const FETCH = async (requestOptions, url) => {
    console.log("FETCH: " + requestOptions + ", " + url);
    const fetched = await fetch(url, requestOptions)
        .then(async (response) => {
           if(response.status === 400){
            return {message: 400}
           }
            return response.json()
        })
        .catch((error) => {
            console.log("FETCH error. Message is: " + error.message);
            return { message: error.message }
        })
        // console.log("FETCH returned...")
        // console.log(fetched)
    return fetched;
}

export const GET = async (url) => {

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            accept: '*/*'
        },
    };

    const fetched = await FETCH(requestOptions, url)
        .then((response) => {
            return response;
        })
        .catch((error) => {
            console.log("GET error. Message is: " + error.message);
            return { message: error.message }
        })
        // console.log("GET returned...")
        // console.log(fetched)
    return fetched;
}

// PUT
export const PUT = async (value, url) => {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(value)
    };

    const fetched = await FETCH(requestOptions, url)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("PUT error. Message is: " + error.message);
            return { message: error.message }
        });
        // console.log("PUT returned...")
        // console.log(fetched)
    return fetched;
}

export const DELETE = async (url) => {

    const requestOptions = {
        method: 'DELETE',
        headers: { accept: '*/*' }
    };

    const fetched = await FETCH(requestOptions, url)
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log("DELETE error. Message is: " + error.message);
            return { message: error.message }
        });
        // console.log("DELETE returned...")
        // console.log(fetched)
    return fetched;
}

export const POST = async (value, url) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            accept: '*/*'
        },
        body: JSON.stringify(value)
    };
    const fetched = await FETCH(requestOptions, url)
        .then((response) => {
            return response;
        }).catch((error) => {
            console.log("POST error. Message is: " + error.message);
            return { message: error.message }
        });
    // console.log("POST returned...")
    // console.log(fetched)
    return fetched;
}

// befiehlt Backend einen Spieler anzulegen
export const createPlayer = async (name) => {
    try {
        const user = {
            "name": name,
            "controllable": true,
        }

        const res = await POST(user, urlPlayer)
            .then((response) => {
                return response;
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message);
                return { message: error.message }
            });
        return res;
    }
    catch (error) {
        console.error(error)
    }
}

// befiehlt Backend eine KI anzulegen
export const generateAI = async (name) => {
    try {
        const user = {
            "name": name,
            "controllable": false,
        }

        const res = await POST(user, urlPlayer)
            .then((response) => {
                return response;
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message);
                return { message: error.message }
            });
        return res;
    }
    catch (error) {
        console.error(error)
    }
}

// hole vom Server eine Liste von Spielern
export const getPlayers = async () => {
    try {
        const res = await GET(urlPlayer)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("GET error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}

// beauftrage den Server einen Spieler aus der Liste zu löschen
export const deletePlayer = async (id) => {
    try {
        const res = await DELETE(urlPlayer + id)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("DELETE error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}

// Anfrage an Server ein neues Spiel zu erstellen
// FIXME: muss noch angepasst werden an die neuen Vorraussetzungen
export const newGame = async (/*maxTurnTime, gameSizeRows, gameSizeColumns, board, playerOne, playerTwo*/) => {
    try {
        const game = {
            "maxTurnTime": 60000, 
            "players": [
                0,
                1
            ],
            "board": {
                "gameSizeRows": 10, // Zeilen des Spielbrettes
                "gameSizeColumns": 10, // Spalten des Spielbrettes
                "squares": [
                    [-1, -1, -1, 0, -1, -1, 0, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [1, -1, -1, -1, -1, -1, -1, -1, -1, 1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                    [-1, -1, -1, 1, -1, -1, 1, -1, -1, -1]
                ]
            }
        }

        const res = await POST(game, urlGame)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// gib Liste von allen Spielen
export const getGames = async () => {
    try {
        const res = await GET(urlGame)
            .then((response) => {
                return response
            })
            .catch((error) => {
                console.log("GET error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// gib zu einem spezifischen Spiel die Statistiken
export const getGameByID = async (id) => {
    try {
        const res = await GET(urlGame + id)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("GET error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// lösche ein Spiel
export const deleteGame = async (id) => {
    try {
        const res = await DELETE(urlGame + id)
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("DELETE error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}

// gib den Server den Spielzug zum setzen
export const move = async (playerID, gameID, startrow, startcolumn, endrow, endcolumn, shotrow, shotcolumn) => {
    try {
        const move = {
            "move": {
                "start": {
                    "row": startrow, // Startzeile der Bewegung
                    "column": startcolumn, // Startspalte der Bewegung
                },
                "end": {
                    "row": endrow, // Zielzeile der Bewegung
                    "column": endcolumn, // Zielspalte der Bewegung
                }
            },
            "shot": {
                "row": shotrow, // Zeile des Pfeilschusses
                "column": shotcolumn, // Spalte des Pfeilschusses
            }
        }

        
        const res = await POST(move, urlMove + playerID + "/" + gameID)
        .then((response) => {
                return response
            }).catch((error) => {
                console.log("POST error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.log(error)
    }
}

// reset Server
export const reset = async () => {
    try {
        const res = await DELETE("https://gruppe12.toni-barth.com/reset/")
            .then((response) => {
                return response
            }).catch((error) => {
                console.log("DELETE error. Message is: " + error.message)
                return { message: error.message }
            })
        return res
    } catch (error) {
        console.error(error)
    }
}