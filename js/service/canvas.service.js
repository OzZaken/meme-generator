'use strict'

let gCurrShape
let gFillColor
let gStrokeColor
let gStrokeSize
let gTouches = ['touchstart', 'touchmove', 'touchend']

function initCanvas() {
    gElCanvas = canvas
    gCtx = gElCanvas.getContext('2d')
    gCurrShape = 'draw'
    gStrokeSize = 5
    resizeCanvas()
    renderCanvas()
    addListeners()

}
function onUpdateCtx(shape) {
    gCurrShape = shape
}

function draw(pos) {
    switch (gCurrShape) {
        case 'center-line':
            drawCenterLine(pos)
            break;
        case 'circle':
            drawCircle(pos)
            break;
        case 'triangle':
            drawTriangle(pos)
            break;
        case 'square':
            drawSquare(pos)
            break;
        case 'draw':
            freeDraw(pos)
            break;
        case 'single-line':
            drawSingleLine(pos)
            break;
        default:
            freeDraw(pos)
            break;
    }
}
function drawCenterLine(pos) {
    gCtx.beginPath()
    gCtx.strokeStyle = getStrokeColor()
    gCtx.moveTo(pos.x, pos.y)
    gCtx.lineTo(gElCanvas.width / 2, gElCanvas.height / 2)
    gCtx.stroke()
    gCtx.closePath()
}
function drawTriangle(pos) {
    gCtx.beginPath()
    gCtx.strokeStyle = getStrokeColor()
    gCtx.fillStyle = getFillColor()
    gCtx.moveTo(pos.x, pos.y)
    gCtx.lineTo(gElCanvas.width / 2, gElCanvas.height / 2)
    gCtx.lineTo(gElCanvas.width / 2 - 100, gElCanvas.height / 2 - 100)
    gCtx.lineTo(pos.x, pos.y)
    gCtx.fill()
    gCtx.stroke()
    gCtx.closePath()
}
function drawSquare(pos) {
    gCtx.beginPath()
    gCtx.strokeStyle = getStrokeColor()
    gCtx.fillStyle = getFillColor()
    gCtx.rect(pos.x, pos.y, 100, 110)
    gCtx.fill()
    gCtx.stroke()
    gCtx.closePath()
}
function freeDraw(pos) {
    gCtx.lineWidth = gStrokeSize
    gCtx.strokeStyle = gStrokeColor
    gCtx.lineTo(pos.x, pos.y)
    gCtx.stroke()
}
function drawCircle(pos) {
    gCtx.beginPath()
    gCtx.lineWidth = 2;
    gCtx.arc(pos.x, pos.y, gStrokeSize, 0, 2 * Math.PI);
    gCtx.fillStyle = getFillColor()
    gCtx.fill();
    gCtx.strokeStyle = getStrokeColor()
    gCtx.stroke();
    gCtx.closePath()
}

function setColors() {
    gFillColor = document.querySelector('.fill-color').value
    gStrokeColor = document.querySelector('.stroke-color').value
}
function getFillColor() {
    return gFillColor
}
function getStrokeColor() {
    return gStrokeColor
}
///////////////////////////////////////////////////////////////////////////////////////////////

function drawSingleLine(pos) {
    console.log('pos:', pos)
    gCtx.beginPath()
    gCtx.lineWidth = 2
    gCtx.moveTo(pos.x, pos.y)
    gCtx.lineTo(x, y)
    gCtx.strokeStyle = getStrokeColor()
    gCtx.stroke();
    gCtx.closePath();
}

// function drawTriangle(x, y) {
//     gCtx.beginPath()
//     gCtx.lineWidth = 2
//     gCtx.moveTo(gPosOnDown.x, gPosOnDown.y)
//     gCtx.lineTo(x, y)
//     gCtx.lineTo(x - 100, y - 100)
//     gCtx.lineTo(gPosOnDown.x, gPosOnDown.y)
//     gCtx.fillStyle = getFillColor()
//     gCtx.fill()
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.stroke()
//     gCtx.closePath()
// }

// function drawRect(x, y) {
//     gCtx.beginPath()
//     gCtx.rect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
//     gCtx.fillStyle = gFillColor
//     gCtx.fillRect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.stroke()
//     gCtx.closePath()
// }
