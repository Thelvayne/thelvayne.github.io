const urlPlayer = "https://gruppe17.toni-barth.com/players/"
const urlGame = "https://gruppe17.toni-barth.com/games/"


async function getPlayers()
{
    try
    {
        let response = await fetch(urlPlayer);
        return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

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


export async function createPlayer(name)
{
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

        // const options = {
        //     method: 'POST',
        //     body: JSON.stringify(user),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }
        
        // // send POST request
        // fetch(urlPlayer, options)
        //     .then(res => res.json())
        //     .then(res => console.log(res));

        
        // // let response = await fetch(urlPlayer, {method: 'POST', 'Content-Type':'application/json'});
        // return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

async function deletePlayer(player)
{
    try
    {
        let response = await fetch(urlPlayer+player.getAttribute("id"), {method: 'DELETE', headers: {'Content-Type':'application/json'}});
        return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

async function getGames()
{
    try
    {
        let response = await fetch(urlGame);
        return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

async function getGame(number)
{
    try
    {
        let response = await fetch(urlGame + number);
        return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

async function deleteGame(game)
{
    try
    {
        let response = await fetch(urlGame+game.getAttribute("id"), {method: 'DELETE', headers: {'Content-Type':'application/json'}});
        return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

async function move(player, game)
{
    try
    {
        let response = await fetch(
            "gruppe17.toni-barth.com/move/" + player.getAttribute("id") + "/" + game.getAttribute("id"),
            {method: 'POST', 'Content-Type':'application/json'}
         );
         return await response.json();
    }
    catch(ex)
    {
        console.error(ex)
    }
}

