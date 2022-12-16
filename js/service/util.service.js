'use strict'
const utilService = {
    getRandInclusive,
    makeId,
    getRandomColor,
    playAudio,
}
function getRandInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 5) {
    var txt = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function playAudio(AudioName, audioEco) {
    if (audioEco) {
        audioEco.pause()
        return
    }
    new Audio(`audio/${AudioName}.mp3`).play()
}

function ask(askWho) {
    let fetchStatus
    fetch(`${askWho}`, {
        method: "GET",
        headers: {
            "Content-type": "application/json;charset=UTF-8"
        }
    }) 
    // Save the response status in a variable to use later.
        .then((response) => {
            fetchStatus = response.status
            // Handle success Convert the response to JSON and return
            return response.json()
        })
        // ? Check if the response were success if (fetchStatus == 200)
        .then(json => console.log(json))
        .catch(error => console.log(error, fetchStatus))
}