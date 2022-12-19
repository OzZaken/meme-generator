'use strict'

const MEME_SERVICE = {
    setMeme,
    getMeme,
    setSelectedLine,
}

const MEME = {
    storageKey: 'memeDB',
    memes: null,
    meme: {
        imgSrc: null,
        aspectRatio: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: [
            {
                pos: { x: null, y: null },
                txt: 'Add some text',
                lineWidth: 2,
                textAlign: 'center',
                fillStyle: 'black',
                strokeStyle: 'red',
                fontMap: {
                    size: 30,
                    sizeUnit: 'px',
                    family: 'impact',
                },
                isDrag: false,
                isSaved: false,
            },
        ]
    },
}

// Return Meme
function getMeme() {
    return MEME.meme
}

// OverRight Meme
function setMeme(meme) {
    MEME.meme = {
        ...MEME.meme,
        ...meme
    }
}

function setSelectedLine(diff) {
    console.log('selectedLineIdx:', MEME.meme.selectedLineIdx)
    const { meme } = MEME
    const { lines } = meme
    if (meme.selectedLineIdx >= lines.length) meme.selectedLineIdx = 0
    meme.selectedLineIdx += diff
    console.log('selectedLineIdx:', MEME.meme.selectedLineIdx)
}

function setTxt(txt) {
    const { lines, selectedLineIdx } = MEME.meme
    lines[selectedLineIdx].txt = txt
}

function setTxtSize(diff) {
    const { lines, selectedLineIdx } = MEME.meme
    lines[selectedLineIdx].size += diff
}

function getNewLine(txt = 'New txt line') {
    return {
        txt,
        lineWidth: 2,
        textAlign: 'center',
        fillStyle: 'black',
        strokeStyle: 'red',
        fontMap: {
            size: 30,
            sizeUnit: 'px',
            family: 'impact',
        },
    }
}

// function _saveToStorage() {
//     const { storageKey, memes } = MEME_SERVICE
//     storageService.saveToStorage(storageKey, memes)
// }

// function _loadFromStorage() {
//     const { storageKey } = MEME_SERVICE
//     return storageService.loadFromStorage(storageKey)
// }

function changeAlign(str) {
    const meme = getMeme()
    const { lines } = meme
    if (dir === 'left') lines[meme.selectedLineIdx].align = 'right'
    else if (dir === 'right') lines[meme.selectedLineIdx].align = 'left'
    else lines[meme.selectedLineIdx].align = 'center'
}



function changeLinePos(x, y) {
    const meme = getMeme()
    const { lines } = meme
    const { pos } = lines[meme.selectedLineIdx]
    pos.x += x
    pos.y += y
}

// third line
function changeFont(fontStyle) {
    console.log('fontStyle:', fontStyle)
    const meme = getMeme()
    const { lines } = meme
    lines[meme.selectedLineIdx].font = fontStyle

}
function getFillColor() {
    return gStroke.fillStyle
}
function getStrokeColor() {
    return gStroke.strokeStyle
}
function getStokeSize() {
    return gStroke.size
}
function drawRect(x, y) { //? have some bugs 
    gCtx.beginPath()
    gCtx.rect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
    gCtx.fillStyle = gFillColor
    gCtx.fillRect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
    gCtx.strokeStyle = getStrokeColor()
    gCtx.stroke()
    gCtx.closePath()
}
function draw(pos) {
    gCtx.lineWidth = getStokeSize()
    gCtx.strokeStyle = getStrokeColor()
    gCtx.fillStyle = getFillColor()
    gCtx.lineTo(pos.x, pos.y)
    gCtx.stroke()
}
function saveMeme() {
    gSavedMemes.push(gMeme)
    console.log('gSavedMemes:', gSavedMemes)
    _saveMemeToStorage()
}