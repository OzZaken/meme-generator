'use strict'

var gElCanvas

var gKeywordSearchCountMap = {
    'funny': 12,
    'celeb': 11,
    'dog': 11,
    'cat': 16,
    'baby': 2,
    'cute': 5,
}
let gCtx

function onInit() {
    initCanvas()
    renderGallery()
}
function renderCanvas() {
    gCtx.fillStyle = 'black'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.height = gElCanvas.width
    elContainer.width = gElCanvas.width + 20
    elContainer.height = gElCanvas.height + 20
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
        // Calc pos according to  touch screen
        pos = {
            x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function onUpdateCtx(shape) {
    updateCtx(shape)
}
function onSelectImg(imgId) {
    setMemeImg(imgId)
    renderMeme()
}


function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}

///////////////////////////////////////////////////////////////////////////////////////////////

// function onUp() {
//     gCtx.beginPath()
//     gIsDraw = false
// }
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
    document.querySelector('#viewport').innerText = `${state}\n${gViewportWidth}px`;
}//!