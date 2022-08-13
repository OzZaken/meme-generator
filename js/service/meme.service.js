'use strict'
var gStroke = {
    currShape: 'circle',
    fillStyle: 'black',
    strokeStyle: 'white',
    size: 30,
}
var gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'First Comment',
            pos: { x: 250, y: 100 },
            size: 30,
            font: 'impact',

            align: 'center',
            color: 'black',
            borderColor: 'white'
        },
        {
            txt: 'Second Comment',
            pos: { x: 250, y: 400 },
            size: 20,
            font: 'impact',

            align: 'center',
            color: 'black',
            borderColor: 'white'
        }
    ]
}
//* //  ///   /////      Canvas    \\\\\    \\\  *\\
function initCanvas() {
    gElCanvas = canvas
    gCtx = gElCanvas.getContext('2d')
    gCtx.strokeStyle = 'black'
    resizeCanvas()
    addListeners()
}
function clearCanvas() {
    gCtx.clearRect( 0, 0, gElCanvas.width, gElCanvas.height)
}
function resizeCanvas() {
    const elContainer = document.querySelector('.canvas-container')
    gElCanvas.MaxWidth = elContainer.offsetWidth
    gElCanvas.height = elContainer.offsetHeight
    //     gElCanvas.height = gElCanvas.width
    //     elContainer.width = gElCanvas.width + 20
    //     elContainer.height = gElCanvas.height + 20
}
//* //  ///   /////      Meme    \\\\\    \\\  *\\
function getMeme() {
    return gMeme
}
function setMemeImg(imgId) {
    const meme = getMeme()
    meme.selectedImgId = imgId
}
//* //  ///   /////      Meme btns lines    \\\\\    \\\  *\\
function setLineText(txt) {
    const { lines } = gMeme
    lines[gMeme.selectedLineIdx].txt = txt
}
function changeLinePos(x, y) {
    const meme = getMeme()
    const { lines } = meme
    const { pos } = lines[meme.selectedLineIdx]
    pos.x += x
    pos.y += y
}
function switchLines() {
    const { lines } = getMeme()
    if (lines.length === 2) {
        let secPos = lines[1].pos
        lines[1].pos = lines[0].pos
        lines[0].pos = secPos
    }
}
function addTxtLine(txt) {
    const val = document.querySelector('.line-txt').value

    if (val === '') return
    const meme = getMeme()
    meme.lines.push(newLine(txt))
    setSelectedLineIdx()
    document.querySelector('.line-txt').value = ''
    renderMeme()
}
function newLine(txt) {
    return {
        txt,
        pos: { x: 250, y: 250 },
        size: 20,
        font: 'impact',
        align: 'center',
        color: 'red',
        borderColor: 'black',
    }
}
function deleteLastLine() {
    const meme = getMeme()
    const { lines } = meme
    lines.splice(-1)
    console.log('lines:', lines)
    setSelectedLineIdx()
    document.querySelector('.line-txt').value = ''
}
//Second line
function changeElSize(num) {
    const meme = getMeme()
    const { lines } = meme
    lines[meme.selectedLineIdx].size += num
}
function changeAlign(dir) {
    const meme = getMeme()
    const { lines } = meme
    if (dir === 'left') lines[meme.selectedLineIdx].align = 'right'
    else if (dir === 'right') lines[meme.selectedLineIdx].align = 'left'
    else lines[meme.selectedLineIdx].align = 'center'
}
//third line
function changeFont(fontStyle) {
    console.log('fontStyle:', fontStyle)
    const meme = getMeme()
    const { lines } = meme
    lines[meme.selectedLineIdx].font = fontStyle

}
function clearMeme() {
    console.log('gMeme:', gMeme)
}
//* //  ///   /////      Draw     \\\\\    \\\  *\\
function getFillColor() {
    return gStroke.fillStyle
}
function getStrokeColor() {
    return gStroke.strokeStyle
}
function drawRect(x, y) {
    gCtx.beginPath()
    gCtx.rect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
    gCtx.fillStyle = gFillColor
    gCtx.fillRect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
    gCtx.strokeStyle = getStrokeColor()
    gCtx.stroke()
    gCtx.closePath()
}
/////////////////////////////////////
// function freeDraw(pos) {
    //     gCtx.lineWidth = gStroke.size
    //     gCtx.strokeStyle = gStroke.strokeStyle
    //     gCtx.lineTo(pos.x, pos.y)
    //     gCtx.stroke()
    // }

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


// function drawSquare(pos) {
//     gCtx.beginPath()
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.fillStyle = getFillColor()
//     gCtx.rect(pos.x, pos.y, 100, 110)
//     gCtx.fill()
//     gCtx.stroke()
//     gCtx.closePath()
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