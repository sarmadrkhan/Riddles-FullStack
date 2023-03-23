import {Riddle} from './models/Riddle';

const SERVER_URL = 'http://localhost:3001/api/';

function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
  
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch( err => reject({ error: "Cannot parse server response" }))
  
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => 
                reject(obj)
                ) // error msg in the response body
              .catch(err => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch(err => 
          reject({ error: "Cannot communicate"  })
        ) // connection error
    });
}

const getRiddles = async () => {
  return getJson(
     fetch(SERVER_URL + 'riddles', { credentials: 'include'})
  ).then( json => {
    return json.map((riddle) => new Riddle(riddle))
  })
}
const getPlayers = async () => {
  return getJson(
     fetch(SERVER_URL + 'players', { credentials: 'include'})
  ).then( json => {
    return json.map((user) => {
      return {
        id: user.id,
        name: user.name,
        score: user.score
      }
    })
  })
}

/**
 * This function wants a riddle object as parameter. If the riddleId exists, it updates the riddle in the server side.
 */
 function closeRiddle(riddle) {
  return getJson(
    fetch(SERVER_URL + "riddles/" + riddle.riddleId+"/close", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
  )
}
/**
 * This function wants a reply object as parameter. it takes riddleId, authorId and reply text to update the replies table i.e appends to the array of replies for an array
 */
function addReply(reply) {
  return getJson(
    fetch(SERVER_URL + "riddles/" + reply.riddleId+ "/addReply", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reply)
    })
  )
}
/**
 * This funciton adds a new riddle in the back-end library.
 */
 function addRiddle(riddle) {
  return getJson(
    fetch(SERVER_URL + "riddles/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(riddle) 
    })
  )
}
/**
 * This function needs an object with user id and new score to be added (based on riddle difficulty)
 */
function updateScore(player) {
  return getJson(
    fetch(SERVER_URL + "players/" + player.id+ "/updateScore", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(player)
    })
  )
}
/**
 * This function wants username and password inside a "credentials" object.
 * It executes the log-in.
 */
 const logIn = async (credentials) => {
  return getJson(fetch(SERVER_URL + 'sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })
  )
};
/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
 const getUserInfo = async () => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    credentials: 'include',
  })
  )
};

/**
 * This function destroy the current user's session and execute the log-out.
 */
const logOut = async() => {
  return getJson(fetch(SERVER_URL + 'sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  })
  )
}

const API = {getRiddles,updateScore, closeRiddle, addRiddle, addReply, logIn, getUserInfo , logOut, getPlayers}
export default API;