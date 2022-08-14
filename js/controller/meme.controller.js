'use strict'

var gElCanvas
var gCtx
var gIsDraw
let gAudio

function onInit() {
    initCanvas()
    renderGallery()
    flashMsg('Welcome!')
}
function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}
function toggleGallery() {
    var elGallery = document.querySelector('.gallery-section')
    elGallery.hidden ? elGallery.hidden = false : elGallery.hidden = true
}
function onNavToGallery(){
    document.body.classList.add('.meme-section-open')
}
function onNavToMeme(){
    document.body.classList.add('x')
}
//* //  ///   /////      Listeners     \\\\\    \\\  *\\
function addListeners() {
    window.addEventListener('resize', () => {
        OnResizeCanvas()
    })
    addMouseListeners()
    addTouchListeners()
}
function addMouseListeners() {
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onDraw)
    gElCanvas.addEventListener('mouseup', onUp)
}
function addTouchListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onDraw)
    gElCanvas.addEventListener('touchend', onUp)
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
function getElCanvas() {
    return gElCanvas
}
//* //  ///   /////      btns     \\\\\    \\\  *\\
// First row
function onSetLineText(txt) {
    setLineText(txt)
    playAudio('click', gAudio)
    renderMeme()
}
function onChangeLinePos(x, y) {
    changeLinePos(x, y)
    playAudio('click', gAudio)
    renderMeme()
}
function onAddTxtLine(txt) {
    addTxtLine(txt)
    playAudio('click', gAudio)
    renderMeme()
}
function onSwitchLines() {
    switchLines()
    playAudio('click', gAudio)
    renderMeme()
}
function onDeleteTxtLine() {
    deleteLastLine()
    playAudio('click', gAudio)
    renderMeme()
}
// Second row
function onClearMeme() {
    playAudio('click', gAudio)
    clearMeme()
}
function onChangeElSize(num) {
    changeElSize(num)
    playAudio('click', gAudio)
    renderMeme()
}
function onChangeAlign(dir) {
    changeAlign(dir)
    playAudio('click', gAudio)
    renderMeme()
}
// third row
function onChangeFont(val) {
    changeFont(val)
    playAudio('click')
    renderMeme()
}
//* //  ///   /////      Draw     \\\\\    \\\  *\\
function onSetColor(val, className) {
    console.log('el:', val)
    console.log('className:', className)
    if (className === 'fill-color') gStroke.fillStyle = val
    else gStroke.strokeStyle = val
    document.querySelector(`.${className}`).style.color = val.value
    console.log('gStroke:', gStroke)
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
function onUp() {
    gCtx.beginPath()
    gIsDraw = false
}
function onDown(ev) {
    console.log('gStroke:', gStroke)
    gIsDraw = true
    draw(getPosByEv(ev))
}
function onUpdateStrokeSize(num) {
    // onUpdateStrokeSize(num)
    gStrokeSize = num // UpdateStrokeSize()?
}
function onDraw(ev) {
    if (gIsDraw) draw(getPosByEv(ev))
}
function getEvPos(ev) {
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
function onMouseOutCanvas() {
    gCtx.beginPath()
    gIsDraw = false
}
//* //  ///   /////      Export btns     \\\\\    \\\  *\\
function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    console.log('data:', data)
    elLink.href = data
    elLink.download = 'my-meme'
}
function onSaveMeme() {
    saveMeme()
}
//* //  ///   /////      MQ helper     \\\\\    \\\  *\\
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
}