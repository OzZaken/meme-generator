'use strict'

var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'center',
            color: 'red'
        }
    ]
}

function initCanvas() {
    gElCanvas = canvas
    gCtx = gElCanvas.getContext('2d')
    resizeCanvas()
    clearCanvas()
    addListeners()
}
function getMeme() {
	return gMeme
}
function setMeme(meme) {
    gMeme = meme
}
function clearCanvas() {
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}
function updateCtx(shape) {
    gCurrShape = shape
}
function setMemeImg(imgId){
    gMeme.selectedImgId = imgId
    console.log('gMeme:', gMeme)
	const img = new Image()
	img.src = `img/${imgId}.jpg`
}
function setLineText(txt) {
    const {lines} = gMeme 
    lines[gMeme.selectedLineIdx].txt = txt
}
function clearCanvas() {
    gCtx.fillStyle = 'transparent'
    gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.MaxWidth = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
}
// function resizeCanvas() {
//     gElCanvas.height = gElCanvas.width
//     const elContainer = document.querySelector('.canvas-container')
//     elContainer.width = gElCanvas.width + 20
//     elContainer.height = gElCanvas.height + 20
// }
/////////////////////////////////////
// let gCurrShape
// let gFillColor
// let gStrokeColor
// let gStrokeSize
// let gIsDraw

// on initCanvas( gCurrShape = 'draw'gStrokeSize = 5)

// function draw(pos) {
//     switch (gCurrShape) {
//         case 'center-line':
//             drawCenterLine(pos)
//             break;
//         case 'circle':
//             drawCircle(pos)
//             break;
//         case 'triangle':
//             drawTriangle(pos)
//             break;
//         case 'square':
//             drawSquare(pos)
//             break;
//         case 'draw':
//             freeDraw(pos)
//             break;
//         case 'single-line':
//             drawSingleLine(pos)
//             break;
//         default:
//             freeDraw(pos)
//             break;
//     }
// }
// function drawCenterLine(pos) {
//     gCtx.beginPath()
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.moveTo(pos.x, pos.y)
//     gCtx.lineTo(gElCanvas.width / 2, gElCanvas.height / 2)
//     gCtx.stroke()
//     gCtx.closePath()
// }
// function drawTriangle(pos) {
//     gCtx.beginPath()
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.fillStyle = getFillColor()
//     gCtx.moveTo(pos.x, pos.y)
//     gCtx.lineTo(gElCanvas.width / 2, gElCanvas.height / 2)
//     gCtx.lineTo(gElCanvas.width / 2 - 100, gElCanvas.height / 2 - 100)
//     gCtx.lineTo(pos.x, pos.y)
//     gCtx.fill()
//     gCtx.stroke()
//     gCtx.closePath()
// }
// function drawSquare(pos) {
//     gCtx.beginPath()
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.fillStyle = getFillColor()
//     gCtx.rect(pos.x, pos.y, 100, 110)
//     gCtx.fill()
//     gCtx.stroke()
//     gCtx.closePath()
// }
// function freeDraw(pos) {
//     gCtx.lineWidth = gStrokeSize
//     gCtx.strokeStyle = gStrokeColor
//     gCtx.lineTo(pos.x, pos.y)
//     gCtx.stroke()
// }
// function drawCircle(pos) {
//     gCtx.beginPath()
//     gCtx.lineWidth = 2;
//     gCtx.arc(pos.x, pos.y, gStrokeSize, 0, 2 * Math.PI);
//     gCtx.fillStyle = getFillColor()
//     gCtx.fill();
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.stroke();
//     gCtx.closePath()
// }
// function setColors() {
//     gFillColor = document.querySelector('.fill-color').value
//     gStrokeColor = document.querySelector('.stroke-color').value
// }
// function getFillColor() {
//     return gFillColor
// }
// function getStrokeColor() {
//     return gStrokeColor
// }
// function drawSingleLine(pos) {
//     console.log('pos:', pos)
//     gCtx.beginPath()
//     gCtx.lineWidth = 2
//     gCtx.moveTo(pos.x, pos.y)
//     gCtx.lineTo(x, y)
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.stroke();
//     gCtx.closePath();
// }
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