'use strict'

function initMemeController() {
    // HTML dependencies:
    // div.meme-container
    // canvas#meme
    window.gMemeController = {
        elMeme: document.querySelector('#meme'),
        elMemeContainer: document.querySelector('.meme-container'),
        elKeywordsContainer: document.querySelector('.meme-keyword-container'),
        elCtx: document.querySelector('#meme').getContext('2d'),
        isDraw: false,
    }
    _initCTX()
    setListeners()
}

// After init Set elCtx
function _initCTX() {
    const { elCtx } = gMemeController
    console.log(`🚀 ~ elCtx`, elCtx)
    elCtx.currShape = 'circle' // 🤨
    elCtx.fillStyle = 'black'//#000000
    elCtx.strokeStyle = 'white'//#000000
    // Note: elCtx already declared 
    // elCtx.size = 20 // 🤨
    // elCtx.direction = 'ltr'//#ltr
    // elCtx.wordSpacing = '0px'
    // elCtx.filter = 'none'
    // elCtx.textAlign = 'start'
    // elCtx.shadowColor = 'rgba(0, 0, 0, 0)'
    // elCtx.font = '10px sans-serif'// fontMap?
}

function setCtx(...ctx) {
    console.log(`🚀 ~ ctx`, ctx)
    const { elCtx } = gMemeController
    console.log(`🚀 ~ elCtx`, elCtx)
    elCtx = { ...elCtx, ctx }
    console.log(`🚀 ~ elCtx`, elCtx)
}

// Set Canvas Listeners 
function setListeners() {
    const { elMeme } = gMemeController
    window.addEventListener('resize', () => {
        resizeMeme()
    })
    // Mouse
    // elMeme.addEventListener('mousemove', onMove)
    elMeme.addEventListener('mousedown', onDown)
    elMeme.addEventListener('mouseup', onUp)
    // Mobile
    // elMeme.addEventListener('touchmove', onMove)
    elMeme.addEventListener('touchstart', onDown)
    elMeme.addEventListener('touchend', onUp)
}


function renderMeme() {
    const img = new Image()
    const { aspectRatio, keywords, lines, src } = getMeme()
    const { elCtx, elMeme, elMemeContainer } = gMemeController
    if (!src) {
        flashMsg('Select Image first!')
        elCtx.drawLine({
            txt:'First Select Image!'
        })
        return
    }
    img.src = src
    img.onload = () => {
        // Render Meme keywords
        if (keywords) {
            const { elKeywordsContainer } = gMemeController
            elKeywordsContainer.innerText = keywords.slice(0, 3).join(', ')
        }
        // Set aspect-ratio
        if (aspectRatio) elMeme.style.aspectRatio = aspectRatio
        elMeme.width = elMemeContainer.width = img.naturalWidth
        elMeme.height = elMemeContainer.height = img.naturalHeight
        elCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height)
        lines.forEach(line => drawLine(line))
    }
}

// Get Line model from Service And render
function drawLine(line) {
    console.log(`🚀 ~ line`, line)
    const { elCtx, elMeme } = gMemeController
    elCtx.beginPath()
    elCtx.lineWidth = line.lineWidth
    elCtx.textAlign = line.textAlign
    elCtx.fillStyle = line.fillStyle
    elCtx.strokeStyle = line.strokeStyle
    // Set Font 
    const { fontMap } = line
    elCtx.font = `${fontMap.size}${fontMap.sizeUnit} ${fontMap.family}`
    // Set pos
    let posX
    let posY
    if (!line.x) posX = elMeme.width / 2
    if (!line.y) posY =  elMeme.height / 2
    elCtx.fillText(line.txt, posX, posY)
    elCtx.strokeText(line.txt, posX, posY)
    elCtx.closePath()
}

function resizeMeme() {
    const { elMeme, elMemeContainer } = gMemeController
    elMemeContainer.width = elMemeContainer.offsetWidth
    elMeme.width = elMemeContainer.offsetWidth - 10;
    renderMeme()
}

//*                                   🐱‍👤👀🐱‍👤   
function setCtx() {

}

function getPos(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0] // Mobile take 1 Pos
        console.log(`🚀 ~ ev`, ev)
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
    setTxt(txt)
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
    setSelectedLine()
    playAudio('click', gAudio)
    renderMeme()
}
function onDeleteTxtLine() {
    deleteLastLine()
    playAudio('click', gAudio)
    renderMeme()
}

function onChangeElSize(num) {
    setTxtSize(num)
    renderMeme()
}
function onChangeAlign(dir) {
    changeAlign(dir)
    renderMeme()
}

function downloadCanvas(elLink) {
    // Todo: Make more reUse which Canvas to Download in case of multi
    const data = gElDrawCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-canvas'
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

function getEvPos(ev) {
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    //Gets the offset pos , the default pos
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY,
    }

    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop - ev.target.clientTop - ev.target.offsetParent.offsetTop,
        }
    }
    return pos
}