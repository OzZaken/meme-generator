'use strict'

function initMemeController() {
    // HTML dependencies:
    // div.meme-container
    // canvas#meme
    window.gMemeController = {
        elMeme: document.querySelector('#meme'),
        elMemeContainer: document.querySelector('.meme-container'),
        elKeywordsContainer: document.querySelector('.meme-keyword-container'),
        isDraw: false,
        elCtx: null,
    }
    _initCTX()
    setListeners()
}

function _initCTX() {
    const { elMeme } = gMemeController
    gMemeController.elCtx = elMeme.getContext('2d')
    const { elCtx } = gMemeController
    elCtx.currShape = 'circle'
    elCtx.fillStyle = 'black'
    elCtx.strokeStyle = 'white'
    elCtx.size = 20
}

function renderMeme() {
    const img = new Image()
    const { aspectRatio ,keywords,lines, imgSrc} = getMeme()
    if (!imgSrc) {
        flashMsg('Pick Meme Background first!')
        drawLine({
                txt: 'Pick Meme Background first!',
                lineWidth: 2,
                fontSize: 30,
                align: 'center',
                color: 'black',
                family: 'impact',
                strokeStyle: 'red',
            }
        )
        return
    }

    // TODO: Fix aspectRatio
    if (aspectRatio) {
        const memeWidth = +aspectRatio.split('/')[0]
        const memeHeight = +aspectRatio.split('/')[1]
        const { style } = gMemeController.elMeme
        style.aspectRatio = aspectRatio
        style.width = memeWidth
        style.height= memeHeight
    }

    if (keywords) {
        const { elKeywordsContainer } = gMemeController
        elKeywordsContainer.innerText = keywords.slice(0, 3).join(', ')
    }

    const { elCtx, elMeme } = gMemeController
    img.src = imgSrc
    img.onload = () => {
        elCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height)
        lines.forEach(line => drawLine(line))
    }
    
}

function setListeners() {
    const { elMeme } = gMemeController
    window.addEventListener('resize', () => {
        resizeMeme()
        renderMeme()
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
//* //  ///   /////      🐱‍👤👀🐱‍👤     \\\\\    \\\  *\\

function resizeMeme() {
    const { elMemeContainer, elMeme } = gMemeController
    elMeme.style.aspectRatio = `${el.naturalWidth}/${el.naturalHeight}`
    elMemeContainer.style.aspectRatio = `${el.naturalWidth}/${el.naturalHeight}`
    // elMeme.width = elMemeContainer.offsetWidth
    // elMeme.width = elMemeContainer.offsetWidth - 100;
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
    switchSelectedLine()
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