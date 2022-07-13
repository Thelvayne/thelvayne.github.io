const urlPlayer = "https://gruppe17.toni-barth.com/players/"
const urlGame = "https://gruppe17.toni-barth.com/games/"

const FETCH = async(requestOptions, url) =>
{
    console.log("FETCH: " + url);
    const fetched = await fetch(url, requestOptions)
    .then(async (response) => {
        return response.json()})
    .catch((error)=>{
        console.log("FETCH error. Message is: " + error.message);
        return {message: error.message}
    })
    
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
        
        const fetched = await FETCH(requestOptions,url)
        .then((response)  =>{
            return response;
        })
        .catch((error)=>{
            console.log("GET error. Message is: " + error.message);
            return {message: error.message}
        })

        return fetched;
  }


  export const PUT = async (value, url) => {

    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(value)
    };
        
    const fetched = await FETCH(requestOptions,url)
    .then((response)=>{
        return response
    }).catch((error)=>{
        console.log("PUT error. Message is: " + error.message);
        return {message: error.message}
    });
    return fetched;
  }

export const DELETE = async (url) => {

    const requestOptions = {
        method: 'DELETE',
        headers: { accept: '*/*'}
    };

    const fetched = await FETCH(requestOptions,url)
    .then((response)=>{
        return response
    })
    .catch((error)=>{
        console.log("DELETE error. Message is: " + error.message);
        return {message: error.message}
    });
    return fetched;
}

export const POST = async (value, url) => {
    const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json',
    accept: '*/*' },
    body: JSON.stringify(value)
    };
    const fetched = await FETCH(requestOptions,url)
    .then((response)=>{
        return response;
    }).catch((error)=>{
        console.log("POST error. Message is: " + error.message);
        return {message: error.message}
    });      
    console.log("POST returned...")
    console.log(fetched)  
    return fetched;
}


export const createPlayer = async (name) =>{
    try
    {
        const user = {
            "name": name,
            "controllable":true,
        }

        const res = await POST(user, urlPlayer)
        .then((response)=>{
            return response;
        }).catch((error)=>{
            console.log("POST error. Message is: " + error.message);
            return {message: error.message}
        });    
        return res;
    }
    catch(error)
    {
        console.error(error)
    }
}

export const generateAI = async (name) =>{
    try
    {
        const user = {
            "name": name,
            "controllable":false,
        }

        const res = await POST(user, urlPlayer)
        .then((response)=>{
            return response;
        }).catch((error)=>{
            console.log("POST error. Message is: " + error.message);
            return {message: error.message}
        });    
        return res;
    }
    catch(error)
    {
        console.error(error)
    }
}

export const getPlayers = async () => {
    try{
        const res = await GET(urlPlayer)
        .then((response) =>{
            return response
        }).catch((error)=>{
            console.log("GET error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    }catch(error) {
        console.error(error)
    }
}

export const deletePlayer = async (id) => {
    try{
        const res = await DELETE(urlPlayer+id)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("DELETE error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    }catch(error){
        console.error(error)
    }
}

export const newGame = async () => {
    try{
        const game = {
            "maxTurnTime": 60000, // eine Minute
            "players": [
                0,
                1
            ],
            "board": {
                "gameSizeRows": 10, // Zeilen des Spielbrettes
                "gameSizeColumns": 10, // Spalten des Spielbrettes
                "squares": [ // Liste von Zeilen des Spielbrettes (von 0 bis gameSizeRows - 1)
                // folgende Integer-Werte sind in diesen Arrays erlaubt:
                // 0: Amazone des Spielers mit Index 0 in players
                // 1: Amazone des Spielers mit Index 1 in players
                // -1: leeres Feld
                // -2: Giftpfeil
                [0, -1, 0, -1, 0, -1, 0, -1, 0, -1],
                [0, -1, -1, -1, -1, -1, -1, -1, -1, 0],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [1, -1, -1, -1, -1, -1, -1, -1, -1, 1],
                [1, -1, 1, -1, 1, -1, 1, -1, 1, -1]
            ]
            }
        }

        const res = await POST(game, urlGame)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("POST error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    } catch (error){
        console.log(error)
    }
}

export const getGames = async () => {
    try {
        const res = await GET(urlGame)
        .then((response) => {
            return response
        })
        .catch((error) => {
            console.log("GET error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    } catch (error){
        console.log(error)
    }
}

export const getGameID = async (id) => {
    try {
        const res = await GET(urlGame + id)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("GET error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    } catch(error) {
        console.log(error)
    }
}

export const deleteGame = async (id) => {
    try{
        const res = await DELETE(urlGame + id)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("DELETE error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    }catch(error){
        console.error(error)
    }
}

// FIXME: fix this stuff
export const move = async (playerID, gameID, infos) => {
    try{
        const move = {
            "move": {
                "start": {
                    "row": 3, // Startzeile der Bewegung
                    "column": 2, // Startspalte der Bewegung
                },
                "end": {
                    "row": 6, // Zielzeile der Bewegung
                    "column": 2, // Zielspalte der Bewegung
                }
            },
            "shot": {
                "row": 5, // Zeile des Pfeilschusses
                "column": 2, // Spalte des Pfeilschusses
            }
        }
        
        const res = await POST(move, urlGame + playerID + "/" + gameID)
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("POST error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    } catch (error){
        console.log(error)
    }
}


export const reset = async () => {
    try{
        const res = await DELETE("https://gruppe17.toni-barth.com/reset/")
        .then((response) => {
            return response
        }).catch((error) => {
            console.log("DELETE error. Message is: " + error.message)
            return {message: error.message}
        })
        return res
    }catch(error){
        console.error(error)
    }
}