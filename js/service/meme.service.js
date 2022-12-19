'use strict'

const MEME_SERVICE = {
    setMeme,
    getMeme,
    setTxt,
    setTxtSize,
    switchSelectedLine,
    drawLine,

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
                fontSize: 30,
                align: 'center',
                color: 'black',
                family: 'impact',
                strokeStyle: 'red',
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

function setTxt(txt) {
    const { lines, selectedLineIdx } = MEME.meme
    lines[selectedLineIdx].txt = txt
}

function setTxtSize(diff) {
    const { lines, selectedLineIdx } = MEME.meme
    lines[selectedLineIdx].size += diff
}

function switchSelectedLine() {
    const { meme } = MEME
    const linesCount = meme.lines.length
    if (meme.selectedLineIdx >= linesCount) meme.selectedLineIdx = 0
    meme.selectedLineIdx++
}

function drawLine(line) {
    const { elCtx, elMeme } = gMemeController
    const center = { x: elMeme.width / 2, y: elMeme.height / 2 }
    elCtx.beginPath()
    elCtx.lineWidth = line.lineWidth
    elCtx.textAlign = line.align
    elCtx.font = `${line.fontSize}px ${line.family}`
    elCtx.fillStyle = line.color
    elCtx.fillText(line.txt, center.x, center.y)
    elCtx.strokeStyle = line.strokeStyle
    elCtx.strokeText(line.txt, center.x, center.y)
    elCtx.closePath()
}

// function _saveToStorage() {
//     const { storageKey, memes } = MEME_SERVICE
//     storageService.saveToStorage(storageKey, memes)
// }

// function _loadFromStorage() {
//     const { storageKey } = MEME_SERVICE
//     return storageService.loadFromStorage(storageKey)
// }




function newLine(txt = 'New txt line ') {
    return {
        txt,
        pos: { x: 250, y: 250 },
        size: 20,
        font: 'impact',
        align: 'center',
        color: 'red',
        borderColor: 'black',
    }
}
function deleteLastLine() {
    const meme = getMeme()
    const { lines } = meme
    lines.splice(-1)
    console.log('lines:', lines)
    setSelectedLineIdx()
    document.querySelector('.line-txt').value = ''
}
function changeLinePos(x, y) {
    const meme = getMeme()
    const { lines } = meme
    const { pos } = lines[meme.selectedLineIdx]
    pos.x += x
    pos.y += y
}
function changeAlign(dir) {
    const meme = getMeme()
    const { lines } = meme
    if (dir === 'left') lines[meme.selectedLineIdx].align = 'right'
    else if (dir === 'right') lines[meme.selectedLineIdx].align = 'left'
    else lines[meme.selectedLineIdx].align = 'center'
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