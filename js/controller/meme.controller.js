'use strict'
function getFlexibleMeme() {
    let x = utilService.ask('https://jsonplaceholder.typicode.com/userssss')
    console.log(`🚀 ~ x`, x)
}

//* //  ///   /////      🐱‍👤👀🐱‍👤     \\\\\    \\\  *\\
// controller State on single Global Var
// dependencies:
// HTML: canvas#meme
function initMemeController() {
    window.gMemeController = {
        elMeme: document.querySelector('#meme'),
        ctx: null,
        isDraw: false,
        gStroke: {
            currShape: 'circle',
            fillStyle: 'black',
            strokeStyle: 'white',
            size: 20,
        },

    }
    // gCtx.strokeStyle = 'black'
    // resizeCanvas()
    // window.addEventListener('resize', () => {
    //     OnResizeCanvas()
    // })
    // gElCanvas.addEventListener('mousedown', onDown)
    // gElCanvas.addEventListener('mousemove', onDraw)
    // gElCanvas.addEventListener('mouseup', onUp)

    // gElCanvas.addEventListener('touchstart', onDown)
    // gElCanvas.addEventListener('touchmove', onDraw)
    // gElCanvas.addEventListener('touchend', onUp)
    setTimeout(_setCTX, 30)
}

function _setCTX() {
    const { gMemeController } = window
    const { elMeme } = gMemeController
    gMemeController.ctx = elMeme.getContext('2d')
}

function renderMeme() {
    const img = new Image()
    const path = 'assets/img/gallery/'
    const { lines, selectedImgIdx } = getMeme()
    img.src = `${path}${selectedImgIdx}.jpg`
    img.onload = () => {
        const elMeme = document.querySelector('#canvas')
        gCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height)

        // Draw Lines
        lines.forEach(line => drawLine(line))
    }
}

function drawLine(line) {
    const { x, y } = line.pos
    gCtx.beginPath()
    gCtx.lineWidth = line.lineWidth
    gCtx.textAlign = line.align
    gCtx.font = `${line.fontSize}px ${line.family}`
    gCtx.fillStyle = line.color
    gCtx.fillText(line.txt, x, y)
    gCtx.strokeStyle = line.borderColor
    gCtx.strokeText(line.txt, x, y)
    gCtx.closePath()
}
function addListeners() {
    addMouseListeners()
    addTouchListeners()
    window.addEventListener('resize', () => {
        resizeCanvas()
        const center = { x: elMeme.width / 2, y: elMeme.height / 2 }
        createCircle(center)
        renderCanvas()
    })
}

function addMouseListeners() {
    elMeme.addEventListener('mousemove', onMove)
    elMeme.addEventListener('mousedown', onDown)
    elMeme.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    elMeme.addEventListener('touchmove', onMove)
    elMeme.addEventListener('touchstart', onDown)
    elMeme.addEventListener('touchend', onUp)
}

function OnResizeCanvas() {
    resizeCanvas()
    renderMeme()
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    // gElCanvas.height = gElCanvas.width
    elContainer.width = elMeme.width
    elContainer.height = elMeme.height
}



function getPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }

    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        console.log('ev.changedTouches:', ev.changedTouches)
        ev = ev.changedTouches[0] // Mobile take 1 Pos
        console.log('ev.changedTouches:', ev.changedTouches)
        // Calc current Pos
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function onDownloadMeme(elLink) {
    const data = elMeme.toDataURL()
    console.log('data:', data)
    elLink.href = data
    elLink.download = 'my-meme'
}

function onSaveMeme() {
    const { newMeme } = gMainController
    saveMeme(newMeme)
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
    renderMeme()
}
function onChangeAlign(dir) {
    changeAlign(dir)
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

function getPos(ev) {
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
    isDraw = false
}
function onDown(ev) {
    console.log('gStroke:', gStroke)
    isDraw = true
    draw(getPos(ev))
}
function onUpdateStrokeSize(num) {
    // onUpdateStrokeSize(num)
    gStrokeSize = num // UpdateStrokeSize()?
}
function onDraw(ev) {
    if (isDraw) draw(getPos(ev))
}
function getPos(ev) {
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
    isDraw = false
}
function onClearMeme() {
    playAudio('click', gAudio)
    clearMeme()
}