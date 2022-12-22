export const MEME_SERVICE = {
    getMeme,
    setMeme,
    setLine,
}

const MEME = {
    storageKey: 'memeDB',
    memes: null,
    meme: {
        src: null,
        aspectRatio: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: [
            {
                pos: { x: null, y: null },
                txt: 'Add some text',
                lineWidth: 2,
                textAlign: 'center',
                fillStyle: 'black',
                strokeStyle: 'red',
                fontMap: {
                    size: 30,
                    sizeUnit: 'px',
                    family: 'impact',
                },
                isDrag: false,
                isSaved: false,
            }
        ]
    }
}

// Return Meme
function getMeme() {
    return MEME.meme
}

// OverRight Meme
function setMeme(meme) {
    console.log(`📝 ~ Service update MEME`, MEME.meme,'\nWITH:',meme)
    MEME.meme = {
        ...MEME.meme,
        ...meme
    }
    console.log(`📝 ~ Service UPDATED MEME`, MEME.meme)
}

// OverRight Line
function setLine(updatedValues) {
    console.log(`📝 ~ Service update LINE`, updatedValues)
    const { meme } = MEME
    const { lines, selectedLineIdx } = meme
    lines[selectedLineIdx] = {
        ...lines[selectedLineIdx],
        ...updatedValues
    }
    console.log(`📝 ~ Service UPDATED LINE`, lines[selectedLineIdx])
}


// function getNewLine(txt = 'New txt line') {
//     return {
//         txt,
//         lineWidth: 2,
//         textAlign: 'center',
//         fillStyle: 'black',
//         strokeStyle: 'red',
//         fontMap: {
//             size: 30,
//             sizeUnit: 'px',
//             family: 'impact',
//         },
//     }
// }
// function onShareMeme() {
//     var elCanvas = getElCanvas()
//     console.log('elCanvas:', elCanvas)
//     const imgDataUrl = elCanvas.toDataURL('image/jpeg')
//     // A function to be called if request succeeds
//     function onSuccess(uploadedImgUrl) {
//         const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
//         // console.log(encodedUploadedImgUrl)
//         document.querySelector(
//             '.url-msg'
//         ).innerText = `Your photo is available here: ${uploadedImgUrl}`
//         document.querySelector('.sharing-btn').innerHTML = `
//             <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
//                Share
//             </a>`
//     }
//     doUploadImg(imgDataUrl, onSuccess)
// }
// function isDrag() {
// 	return MEME.meme.isDrag
// }
// function moveLine(diffX = 0, diffY = 0) {
// 	const line = getLine()
// 	// don't let the text to go out of the canvas completely
// 	const posX = line.pos.x + diffX
// 	const posY = line.pos.y + diffY
// 	if (posY < 0 || posY > gCanvas.height) return
// 	if (posX < 0 || posX > gCanvas.width) return

// 	line.pos.x = posX
// 	line.pos.y = posY
// }
// function changeAlign(str) {
//     const meme = getMeme()
//     const { lines } = meme
//     if (dir === 'left') lines[meme.selectedLineIdx].align = 'right'
//     else if (dir === 'right') lines[meme.selectedLineIdx].align = 'left'
//     else lines[meme.selectedLineIdx].align = 'center'
// }
// function isInLine(pos, isClicked) {
// 	// reverse order so we chose the line on top
// 	for (let i = gMeme.lines.length - 1; i >= 0; i--) {
// 		const box = gMeme.lines[i].bindBox
// 		if (
// 			pos.x >= box.x &&
// 			pos.x <= box.x + box.width &&
// 			pos.y >= box.y &&
// 			pos.y <= box.y + box.height
// 		) {
// 			if (isClicked) gMeme.selectedLineIdx = i
// 			return true
// 		}
// 	}
// 	return false
// }
// function addNewLine(txt = 'New line') {
// 	gMeme.lines.push({
// 		pos: { x: gCanvas.width / 2, y: gCanvas.height / 2 },
// 		txt,
// 		size: (48 * gCanvas.width) / 500,
// 		align: 'center',
// 		textColor: 'white',
// 		strokeColor: 'black',
// 	})

// 	if (txt !== 'TOP TEXT' && txt !== 'BOTTOM TEXT') {
// 		gMeme.selectedLineIdx = gMeme.lines.length - 1
// 	}
// }
// function removeLine() {
// 	if (gMeme.lines.length === 0) return

// 	gMeme.lines.splice(gMeme.selectedLineIdx, 1)

// 	if (gMeme.selectedLineIdx === gMeme.lines.length) gMeme.selectedLineIdx = 0
// }
// function changeLinePos(x, y) {
//     console.log(`🚀 ~ y`, y)
//     console.log(`🚀 ~ x`, x)
//     const meme = getMeme()
//     const { lines } = meme
//     const { pos } = lines[meme.selectedLineIdx]
//     pos.x += x
//     pos.y += y
// }
// function changeFont(fontStyle) {
//     console.log('fontStyle:', fontStyle)
//     const meme = getMeme()
//     const { lines } = meme
//     lines[meme.selectedLineIdx].font = fontStyle

// }
// function getFillColor() {
//     return gStroke.fillStyle
// }
// function getStrokeColor() {
//     return gStroke.strokeStyle
// }
// function getStokeSize() {
//     return gStroke.size
// }
// function drawRect(x, y) { //? have some bugs
//     gCtx.beginPath()
//     gCtx.rect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
//     gCtx.fillStyle = gFillColor
//     gCtx.fillRect(gPosOnDown.x, gPosOnDown.y, x - gPosOnDown.x, y - gPosOnDown.y)
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.stroke()
//     gCtx.closePath()
// }
// function draw(pos) {
//     gCtx.lineWidth = getStokeSize()
//     gCtx.strokeStyle = getStrokeColor()
//     gCtx.fillStyle = getFillColor()
//     gCtx.lineTo(pos.x, pos.y)
//     gCtx.stroke()
// }

