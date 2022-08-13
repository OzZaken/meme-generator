'use strict'

var gElCanvas
var gCtx
var gIsDraw
var gKeywordSearchCountMap = {
    'funny': 12,
    'celeb': 11,
    'dog': 11,
    'cat': 16,
    'baby': 2,
    'cute': 5,
}
let gAudio
// function markSelectedLine() {
// 	// set stroke for text selection
// 	gCtx.lineWidth = 3
// 	gCtx.shadowOffsetX = 5
// 	gCtx.shadowOffsetY = 5
// 	gCtx.shadowBlur = 5
// 	gCtx.strokeStyle = 'yellowgreen'
// 	gCtx.strokeRect(pos.x, pos.y, pos.width, pos.height)
// }
function onInit() {
    initCanvas()
    renderGallery()
    flashMsg('Welcome!')
}
//* //  ///   /////      Meme     \\\\\    \\\  *\\
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
        setSelectedLineIdx()
        // markSelectedLine()
    }
}
function onImgSelect(imgId) {
    setMemeImg(imgId)
    document.querySelector('.gallery-section').hidden = true
    flashMsg('img selected')
    renderMeme()
}
function OnResizeCanvas() {
    resizeCanvas()
    renderMeme()
}
function setSelectedLineIdx() {
    const meme = getMeme()
    const { lines } = meme
    meme.selectedLineIdx = lines.length - 1
    document.querySelector('.line-txt').value = lines[meme.selectedLineIdx].txt
}

//* //  ///   /////      Meme btns     \\\\\    \\\  *\\
// First row
function onSetLineText(txt) {
    setLineText(txt)
    playAudio('click',gAudio)
    renderMeme()
}
function onChangeLinePos(x, y) {
    changeLinePos(x, y)
    playAudio('click',gAudio)
    renderMeme()
}
function onAddTxtLine(txt) {
    addTxtLine(txt)
    playAudio('click',gAudio)
    renderMeme()
}
function onSwitchLines() {
    switchLines()
    playAudio('click',gAudio)
    renderMeme()
}
function onDeleteTxtLine() {
    deleteLastLine()
    playAudio('click',gAudio)
    renderMeme()
}
// Second row
function onClearMeme() {
    playAudio('click',gAudio)
    clearMeme()
}
function onChangeElSize(num) {
    changeElSize(num)
    playAudio('click',gAudio)
    renderMeme()
}
function onChangeAlign(dir) {
    changeAlign(dir)
    playAudio('click',gAudio)
    renderMeme()
}
// third
function onChangeFont(val) {
    changeFont(val)
    playAudio('click')
    renderMeme()
}
//* //  ///   /////      Draw     \\\\\    \\\  *\\
function onSetColor(el, className) {
    if (className === 'fill-color') gStroke.fillStyle = el
    else gStroke.strokeStyle = el
    document.querySelector(`.${className}`).style.color = el.value
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
//* //  ///   /////      Export btns     \\\\\    \\\  *\\
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
function onDown(ev) {
    //Get the ev pos from mouse or touch
    const pos = getEvPos(ev)
    if (!isInLine(pos, true)) return
    // in case we change the line with the click
    renderAccordingToLine()
    setIsMemeDrag(true)
    gDragStartPos = pos
    document.body.style.cursor = 'grabbing'
    renderMeme()
}
function onMouseOutCanvas() {
    // console.log('onMouseOutCanvas')
    // gCtx.beginPath()
    // gIsDraw = false
}
//* //  ///   /////      Helpers     \\\\\    \\\  *\\
function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}
function toggleGallery() {
    var elGallery = document.querySelector('.gallery-section')
    elGallery.hidden ? elGallery.hidden = false : elGallery.hidden = true
}
///////////////////////////////////////////////////////////////////////////////////////////////
function drawText() {
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
function onDown(ev) {
    gIsDraw = true
    let pos = getPosByEv(ev)
    draw(pos)
}
function onUpdateStrokeSize(num) {
    // onUpdateStrokeSize(num)
    gStrokeSize = num // UpdateStrokeSize()?
}
function onDraw(ev) {
    if (gIsDraw) {
        let pos = getPosByEv(ev)
        draw(pos)
    }
}

//! //  ///   /////      Delete at the end     \\\\\    \\\  *\\
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