'use strict'

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}

///////////////////////////////////////////////////////////////////////////////////////////////
//Canvas
let gElCanvas
let gCtx
let gIsDraw

function onInit() {
    initCanvas()
    renderGallery()
}
function getOffSetPosByEv(ev) {
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
function toggleMenu() {
    document.body.classList.toggle('menu-opened');
}

///////////////////////////////////////////////////////////////////////////////////////////////
// Delete at the end
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