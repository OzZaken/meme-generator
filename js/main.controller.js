'use strict'
let gElCanvas
let gCtx
let gIsDraw

///////////////////////////////////////////////////////////////////////////////////////////////
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
}

///////////////////////////////////////////////////////////////////////////////////////////////

function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}

function onInit() {
    initCanvas()
}
function resizeCanvas() {
    let elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 100
    gElCanvas.height = elContainer.offsetHeight - 50
}
function addListeners() {
    window.addEventListener('resize', () => {
        resizeCanvas()
        renderCanvas()
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
function onDown(ev) {
    gIsDraw = true
    let pos = getPosByEv(ev)
    draw(pos)
}
function onDraw(ev) {
    if (gIsDraw) {
        let pos = getPosByEv(ev)
        draw(pos)
    }
}
function onUp() {
    gCtx.beginPath()
    gIsDraw = false
}
function getPosByEv(ev) {
    let pos = { x: ev.offsetX, y: ev.offsetY }
    if (gTouches.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}
function renderCanvas() {
    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}
function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}
function onUpdateStrokeSize(num) {
    gStrokeSize = num
}
