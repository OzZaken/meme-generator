'use strict'

var gElCanvas
var gCtx
var gKeywordSearchCountMap = {
    'funny': 12,
    'celeb': 11,
    'dog': 11,
    'cat': 16,
    'baby': 2,
    'cute': 5,
}

function onInit() {
    initCanvas()
    renderGallery()
    flashMsg('Welcome!')
}
function renderMeme() {
    //handle img
    const img = new Image()
    img.src = `img/${gMeme.selectedImgId}.jpg`
    img.onload = () => {
        var { lines } = getMeme()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        //handle each line        
        lines.forEach(line => {
            const { x, y } = line.pos
            gCtx.beginPath()
            // NeedToAdd
            gCtx.lineWidth = 2
            //Added
            gCtx.textAlign = line.align
            gCtx.font = `${line.size}px ${line.font}`
            gCtx.fillStyle = line.color
            gCtx.fillText(line.txt, x, y)
            gCtx.strokeStyle = line.borderColor
            gCtx.strokeText(line.txt, x, y)
            gCtx.closePath()
        })
        setSelectedLine()
        // markSelectedLine()
    }
}

// function markSelectedLine() {
// 	// set stroke for text selection
// 	gCtx.lineWidth = 3
// 	gCtx.shadowOffsetX = 5
// 	gCtx.shadowOffsetY = 5
// 	gCtx.shadowBlur = 5
// 	gCtx.strokeStyle = 'yellowgreen'

// 	setBindBoxes()
// 	const bindBox = getBindBox()
// 	gCtx.strokeRect(bindBox.x, bindBox.y, bindBox.width, bindBox.height)
// }

function drawText(isSelected) {
    const { lines } = getMeme()
    const line = lines[selectedLineIdx]
    gCtx.beginPath()
    // NeedToAdd
    gCtx.lineWidth = 2
    //Added
    gCtx.textAlign = line.align
    gCtx.font = `${line.size}px ${line.font}`
    gCtx.fillStyle = line.color
    gCtx.fillText(txt, x, y)
    gCtx.strokeStyle = line.borderColor
    gCtx.strokeText(txt, x, y)
    gCtx.closePath()
}
function OnResizeCanvas() {
    resizeCanvas()
    renderMeme()
}
function onUpdateCtx(shape) {
    updateCtx(shape)
}
function onImgSelect(imgId) {
    setMemeImg(imgId)
    document.querySelector('.gallery-section').hidden = true
    flashMsg('img selected')
    renderMeme()
}
function onMouseOutCanvas() {
    // console.log('onMouseOutCanvas')
    // gCtx.beginPath()
    // gIsDraw = false
}
function getPosByEv(ev) {
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    let pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}
function setSelectedLine() {
    const meme = getMeme()
    const { lines } = meme
    meme.selectedLineIdx = lines.length - 1
    document.querySelector('.line-txt').value = lines[meme.selectedLineIdx].txt
}
function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}
function toggleGallery() {
    var elGallery = document.querySelector('.gallery-section')
    elGallery.hidden ? elGallery.hidden = false : elGallery.hidden = true
}
//* //  ///   /////      Meme btns     \\\\\    \\\  *\\
// First row
function onSetLineText(txt) {
    setLineText(txt)
    renderMeme()
}
function onChangeLinePos(x, y) {
    changeLinePos(x, y)
    renderMeme()
}
function onAddTxtLine(txt) {
    addTxtLine(txt)
    renderMeme()
}
function onSwitchLines() {
    switchLines()
    renderMeme()
}
function onDeleteTxtLine() {
    deleteLastLine()
    renderMeme()
}
// Second row
function onClearMeme() {
    clearMeme()
}

function onChangeElSize(num) {
    changeElSize(num)
    renderMeme()
}

function onChangeAlign(dir) {
    changeAlign(dir)
    renderMeme()
}
// third
function onChangeFont(val){
    changeFont(val)
    renderMeme()
}
//export btns
function onClearMeme() {
    clearMeme()
    renderMeme()
}
function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    console.log('data:', data)
    elLink.href = data
    elLink.download = 'my-meme'
}
///////////////////////////////////////////////////////////////////////////////////////////////

// function onDown(ev) {
//     gIsDraw = true
//     let pos = getPosByEv(ev)
//     draw(pos)
// }
// function onUpdateStrokeSize(num) {
//     gStrokeSize = num //? UpdateStrokeSize()?
// }
// function onDraw(ev) {
//     if (gIsDraw) {
//         let pos = getPosByEv(ev)
//         draw(pos)
//     }
// }
// !Delete at the end
const elBody = document.querySelector('body')
let gViewportWidth = window.innerWidth
let state
elBody.onresize = () => {
    gViewportWidth = window.innerWidth;
    if (gViewportWidth > 768 || gViewportWidth < 1020) state = 'Tablet'
    if (gViewportWidth < 520) state = 'Mobile'
    if (gViewportWidth > 1020) state = 'Desktop'
    renderViewPort()
}
elBody.onresize()
function renderViewPort() {
    document.querySelector('.viewport').innerText = `${state}\n${gViewportWidth}px`
}//!