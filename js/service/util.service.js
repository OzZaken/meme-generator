'use strict'
const UTIL_SERVICE = {
    getRandInclusive,
    makeId,
    getRandomColor,
    playAudio,
    capitalize,
    capitalizes,
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

// Capitalize Str 
function capitalize(word) {
    return word.replace(/^\w/, c => c.toUpperCase())
}

// Capitalize  StrS 
function capitalizes(words) {
    return words.slice(0, 3).map(keyword => {
        if (keyword) return (capitalize(keyword))
    })
}

const _capitalize = (str) => str[0].toUpperCase() + str.substring(1)
