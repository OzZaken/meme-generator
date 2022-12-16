'use strict'

// StorageData
const STORAGE_KEY = 'memeDB'
let gMemes // Saved to Store

// Initial Meme
const gMeme = {
    selectedImgIdx: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Add some text',
            lineWidth: 2,
            fontSize: 30,
            align: 'center',
            color: 'black',
            pos: { x: 250, y: 100 },
            family: 'impact',
            borderColor: 'red',
            isDrag: false,
            isSaved: false,
        },
    ]
}

_createMemes()

// return gMeme
function getMeme() {
    return gMeme
}

// Private
function _createMemes() {
    let memes = _loadFromStorage(STORAGE_KEY)
    if (!memes || !memes.length) {
        memes = []
        for (let i = 0; i < gImgs.length; i++) {
            memes[i] = _createMeme(i)
        }
    }
    gMemes = memes
    _saveToStorage()
}

function _createMeme(imgIdx) {
    const { keywords, url } = gImgs[imgIdx]
    return {
        id: makeId(),
        keywords,
        url,
        selectedImgId: null,
        selectedLineIdx: null,
        lines: [],
    }
}

function _saveToStorage() {
    storageService.saveToStorage(STORAGE_KEY, gMemes)
}

function _loadFromStorage() {
    return storageService.loadFromStorage(STORAGE_KEY)
}

// gMemes.length
function getTotalCount() {
    return gMemes.length
}

// gMeme.selectedImgIdx
function setImg(imgIdx) {
    gMeme.selectedImgIdx = imgIdx
}







//* Meme btns lines  
function setLineText(txt) {
    const { lines } = gMeme
    lines[gMeme.selectedLineIdx].txt = txt
}
function changeLinePos(x, y) {
    const meme = getMeme()
    const { lines } = meme
    const { pos } = lines[meme.selectedLineIdx]
    pos.x += x
    pos.y += y
}
function switchLines() {
    const { lines } = getMeme()
    if (lines.length === 2) {
        let secPos = lines[1].pos
        lines[1].pos = lines[0].pos
        lines[0].pos = secPos
    }
}
function addTxtLine(txt) {
    const val = document.querySelector('.line-txt').value
    if (val === '') return
    const meme = getMeme()
    meme.lines.push(newLine(txt))
    setSelectedLineIdx()
    document.querySelector('.line-txt').value = ''
    renderMeme()
}
function newLine(txt = 'New Line txt') {
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

// Second line
function changeElSize(num) {
    const meme = getMeme()
    const { lines } = meme
    lines[meme.selectedLineIdx].size += num
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



//*      Draw   
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