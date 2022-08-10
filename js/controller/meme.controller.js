'use strict'

function resizeCanvas() {
    let elContainer = document.querySelector('.canvas-container')
    gElCanvas.width = elContainer.offsetWidth - 100
    gElCanvas.height = elContainer.offsetHeight - 50
}
function renderCanvas() {
    gCtx.fillStyle = 'white'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}
function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}
function onDraw(ev) {
    if (gIsDraw) {
        let pos = getOffSetPosByEv(ev)
        draw(pos)
    }
}
function onUp() {
    gCtx.beginPath()
    gIsDraw = false
}
function onDown(ev) {
    gIsDraw = true
    let pos = getOffSetPosByEv(ev)
    draw(pos)
}
function onUpdateStrokeSize(num) {
    gStrokeSize = num //? UpdateStrokeSize()?
}