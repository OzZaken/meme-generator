'use strict'

var gElCanvas
var gCtx
var gIsDraw
var gStroke = {
    currShape: 'circle',
    fillStyle: 'black',
    strokeStyle: 'white',
    size: 20,
}

function addListeners() {
    window.addEventListener('resize', () => {
        OnResizeCanvas()
    })
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onDraw)
    gElCanvas.addEventListener('mouseup', onUp)

    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onDraw)
    gElCanvas.addEventListener('touchend', onUp)
}

function renderMeme() {
    const img = new Image()
    img.src = `img/${gMeme.selectedImgId}.jpg`
    img.onload = () => {
        var { lines } = getMeme()
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
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
    }
}

function OnResizeCanvas() {
    resizeCanvas()
    renderMeme()
}

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

function onChangeFont(val) {
    changeFont(val)
    playAudio('click')
    renderMeme()
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
    draw(getEvPos(ev))
}
function onUpdateStrokeSize(num) {
    // onUpdateStrokeSize(num)
    gStrokeSize = num // UpdateStrokeSize()?
}
function onDraw(ev) {
    if (gIsDraw) draw(getEvPos(ev))
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
function onClearMeme() {
    playAudio('click', gAudio)
    clearMeme()
}