'use strict'

const STORAGE_KEY = 'memesDB'
var gSavedMemes = []
var gSearchFilter = ''
var gKeywordSearchCountMap = {
    'funny': 7,
    'cute': 5,
    'celeb': 6,
    'dog': 11,
    'cat': 16,
    'baby': 2,
}
var gStroke = {
    currShape: 'circle',
    fillStyle: 'black',
    strokeStyle: 'white',
    size: 20,
}
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Add some text',
            pos: { x: 250, y: 100 },
            size: 30,
            font: 'impact',
            align: 'center',
            color: 'black',
            borderColor: 'white',
            isSaved: false,
            isDrag: false
        },
    ]
}
const gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'celeb'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dog', 'cute'] },
    { id: 3, url: 'img/3.jpg', keywords: ['dog', 'cute', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['dog', 'cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'celeb'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'celeb'] },
    { id: 13, url: 'img/13.jpg', keywords: ['celeb'] },
    { id: 14, url: 'img/14.jpg', keywords: ['celeb'] },
    { id: 15, url: 'img/15.jpg', keywords: ['celeb'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny'] },
    { id: 17, url: 'img/17.jpg', keywords: ['funny', 'celeb'] },
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'celeb'] }
]

//*      Gallery   *\\
function createMems() {
    const memes = loadFromStorage()
    if (!memes || !memes.length) {
        memes = []
        getImgs()
        for (let i = 0; i < 99; i++) {
            memes[i] = _createMeme()
        }
    }
    gBooks = memes
    console.log('gBooks:', gBooks)
    saveToStorage()
}
function getImgs() {
    return gImgs
}
function getImg() {
    if (!gSearchFilter) return gImgs
    return gImgs.filter((img) => img.keywords.includes(gSearchFilter))
}
function setFilterBy(value) {
    gSearchFilter = value.toLowerCase()
}
function onSetFilterBy() {
    const searchTxt = document.querySelector('.filter-input').value
    setFilterBy(searchTxt)
    filterGallery()

}

//*      Canvas   *\\
function initCanvas() {
    gElCanvas = canvas
    gCtx = gElCanvas.getContext('2d')
    gCtx.strokeStyle = 'black'
    resizeCanvas()
    addListeners()
}
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    // gElCanvas.height = gElCanvas.width
    elContainer.width = gElCanvas.width
    elContainer.height = gElCanvas.height
}

//*      Meme   *\\
function getMeme() {
    return gMeme
}
function setMemeImg(imgId) {
    const meme = getMeme()
    meme.selectedImgId = imgId
}

//*      Meme btns lines   *\\
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

//Second line
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

//third line
function changeFont(fontStyle) {
    console.log('fontStyle:', fontStyle)
    const meme = getMeme()
    const { lines } = meme
    lines[meme.selectedLineIdx].font = fontStyle

}
function saveMeme() {
    gSavedMemes.push(gMeme)
    console.log('gSavedMemes:', gSavedMemes)
    _saveMemeToStorage()
}
function _saveMemeToStorage() {
    saveToStorage(STORAGE_KEY, gSavedMemes)
}
function _LoadMemeFromStorage() {
    return loadFromStorage(STORAGE_KEY)
}
//*      Draw    *\\
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