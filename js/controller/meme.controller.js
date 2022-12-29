import { GALLERY_SERVICE } from "../service/gallery.service.js"
import { MEME_SERVICE } from "../service/meme.service.js"

export const MEME_CONTROLLER = {
    init,
    onSetMeme,
    onMove,
    onUp,
    onDown,
}

let gMemeController

function init(dependencies) {
    gMemeController = {
        ...dependencies,
        isTouchScreen: false,
        isGrab: false,
        isScale: false,
        elCtx: dependencies.elMeme.getContext('2d'),
        onSaveMeme,
        onSetMeme,
        onCreateLine,
    }

    // Set Listeners
    window.addEventListener('resize', resizeMeme)
    const { elMeme } = gMemeController
    // Mouse
    elMeme.addEventListener('mousemove', onMove)
    elMeme.addEventListener('mousedown', onDown)
    elMeme.addEventListener('mouseup', onUp)
    // Mobile
    elMeme.addEventListener('touchmove', onMove)
    elMeme.addEventListener('touchstart', onDown)
    elMeme.addEventListener('touchend', onUp)
    // Update Main controller
    return gMemeController
}

function onSetMeme(meme) {
    if (meme) MEME_SERVICE.setMeme(meme)
    else {
        const { elMeme } = gMemeController
        const val = event.target.dataset.font ? event.target.dataset.font : event.target.value

        const editor = {
            onMoveLine: () => {
                const line = MEME_SERVICE.getLine()
                if (!line) return
                const { font } = line
                // get the first group of digits in the string
                const size = font.match(/\d+/)[0]
                const regEx = font.match(/\d+\D+/)
                const fonts = regEx[0].substring(regEx[0].match(/\d+/)[0].length).split(' ')
                const unit = fonts[0]
                const family = fonts[1]
                const { pos } = line
                const y = pos.y // shallow copy
                const operator = event.target.dataset.operator
                if (operator === '+') if (y <= size) return
                else if (y + size >= elMeme.height) return
                MEME_SERVICE.setLinePos({ y: y + operator + 10 })
            },
            onSwitchLine: () => MEME_SERVICE.switchLine(),
            onCreateLine: () => MEME_SERVICE.createLine(elMeme.width / 2, elMeme.height / 2),
            onRemoveLine: () => MEME_SERVICE.removeLine(),
            // 🐱‍👤
            onSetFS: () => {
                const operator = event.target.dataset.operator
                console.log(`🚀 ~ operator`, operator)
                MEME_SERVICE.getFontSize()
                
                
            },
            onAlienL: () => MEME_SERVICE.setLine({ 'textAlign': 'left' }),
            onAlienC: () => MEME_SERVICE.setLine({ 'textAlign': 'center' }),
            onAlienR: () => MEME_SERVICE.setLine({ 'textAlign': 'right' }),
            onFamily: () => {
                event.target.style.fontFamily = event.target.value
                MEME_SERVICE.setFontMap('family', event.target.value)
            },
            onSetImg: () => {
                const { diff } = event.target.dataset
                const length = GALLERY_SERVICE.getImgsCount()
                MEME_SERVICE.resetLines()
                const src = MEME_SERVICE.getNextImg(length, diff)
                event.target.src = src
                gMemeController.onImgSelect()
            }
        }
        editor[val]()
    }
    renderMeme()
}

// Handle Events
function onMove() {
    const { isTouchScreen, isDarg, isScale, isDraw } = gMemeController
    if (!isTouchScreen) return
    const pos = getPos(ev)
    // if (isMemeDrag()) {
    //     ev.preventDefault()
    //     const pos = getEvPos(ev)

    //     const dx = pos.x - gDragStartPos.x
    //     const dy = pos.y - gDragStartPos.y
    //     moveLine(dx, dy)
    //     gDragStartPos = pos
    //     renderMeme()
    // } else {
    //     if (isInLine(pos, false)) document.body.style.cursor = 'grab'
    //     else document.body.style.cursor = 'default'
    // }
}
function onUp() {
    gMemeController.isDraw = gMemeController.isGrab =
        gMemeController.isScale = gMemeController.isScale = false
    console.log('document.body.offsetWidth:', document.body.offsetWidth)
    console.log('window.innerWidth:', window.innerWidth)
    // document.body.style.cursor = 'grab'
}
function onDown() {
    const touchPos = gMemeController.getPos(event)
    console.log(`🚀 ~ touchPos`, touchPos)
    const lines = gMemeController.getLines()
    console.log(`🚀 ~ lines`, lines)
}

// Resize Meme Container based offsetWidth 
function resizeMeme() {
    const { elMemeContainer, elMeme } = gMemeController
    elMemeContainer.width = elMeme.offsetWidth
    elMemeContainer.height = elMeme.offsetHeight
    renderMeme()
}
// Render Meme 
function renderMeme() {
    const { keywords, lines, src } = MEME_SERVICE.getMeme()
    const { elCtx, elMeme } = gMemeController

    const img = new Image()
    img.src = src
    img.onload = () => {
        // render keywords
        if (keywords) {
            const { elKeywordsContainer } = gMemeController
            elKeywordsContainer.innerText = keywords.slice(0, 3).join(', ')
        }
        // Set Canvas Size
        elMeme.width = img.width
        elMeme.height = img.height
        // render Image 
        elCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height)
        // render Lines
        if (!lines.length) return
        lines.forEach(line => drawLine(line))
    }
}

// Set ctx
function _setCtx(line) {
    const { elCtx } = gMemeController
    for (const key in line) {
        elCtx[key] = line[key]
        // console.log(`🚀 ~  elCtx[${key}]`, elCtx[key])
    }
    elCtx.save()
}

// Get Line model from Service And render
function drawLine(line) {
    // Give Opt for empty Pos
    const { elMeme, elCtx } = gMemeController
    if (!line.pos.x) {
        line.pos.x = elMeme.width / 2
        const horizontal = { x: line.pos.x }
        MEME_SERVICE.setLinePos(horizontal)
    }
    if (!line.pos.y) {
        line.pos.y = elMeme.height / 2
        const vertical = { y: line.pos.y }
        MEME_SERVICE.setLinePos(vertical)
    }
    // Update Line value on the Ctx
    const { lineWidth, textAlign, fillStyle, strokeStyle, txt } = line

    const fonts = line.font.split(' ')
    const updateCtx = {
        lineWidth,
        textAlign,
        fillStyle,
        strokeStyle,
        txt,
        font: `${fonts[0]} ${fonts[1]}`,
    }
    _setCtx(updateCtx)

    // Draw Line
    elCtx.beginPath()
    elCtx.strokeText(txt, line.pos.x, line.pos.y)
    elCtx.closePath()
    // Set Focus 
    if (MEME_SERVICE.getLine() === line) drawOutLine()
}

function showFocusBorder() {
    const borderParams = getBorderParams()
    if (!borderParams) return
    const { xStart, yStart, w, h, scalePntPos } = borderParams
    gCtx.beginPath()
    gCtx.rect(xStart, yStart, w, h)
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'white'
    gCtx.stroke()
    showScalePnt(scalePntPos)
}
function getBorderParams() {
    let idx = gMeme.selectedLineIdx
    if (idx >= 0) {
        const { pos, size, width, align } = gMeme.lines[idx]
        let widthOffst = -width
        if (align === 'left') widthOffst = 0
        else if (align === 'center') widthOffst = -width / 2
        const xStart = pos.x + widthOffst - 5
        const yStart = pos.y - size
        const w = width + 10
        const h = size + 15
        const scalePntPos = { x: xStart + w, y: yStart + h }
        setScalePnt(gMeme.lines[idx], scalePntPos)
        return { xStart, yStart, w, h, scalePntPos }
    }
    idx = gMeme.selectedStickerIdx
    if (idx < 0) return
    const { pos, width, height } = gMeme.stickers[idx]
    const xStart = pos.x
    const yStart = pos.y
    const w = width
    const h = height
    const scalePntPos = { x: xStart + w, y: yStart + h }
    setScalePnt(gMeme.stickers[idx], scalePntPos)
    return { xStart, yStart, w, h, scalePntPos }
}
function drawOutLine() {
    console.log('drawOutLine')
    return
    const { txt, x, y } = MEME_SERVICE.getLine()
    const { elCtx } = gMemeController

    const TxtMetrics = elCtx.measureText(txt)
    const width = TxtMetrics.width
    const height = TxtMetrics.fontBoundingBoxDescent + TxtMetrics.fontBoundingBoxAscent

    elCtx.beginPath()
    elCtx.rect(x, y, width, height)
    elCtx.stroke()
    elCtx.closePath()
}

function onCreateLine() {
    MEME_SERVICE.createLine()
}
function onSaveMeme() {
    console.log(`🚀 ~ onSaveMeme`,)
    console.log('event:', event)
    console.log('getMeme(),', getMeme())
}

// function isInLine( isClicked) {
// 	// reverse order so we chose the line on top
//     const pos = getPos()
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
// function moveLine() {
//     const line = getLine()
//     const pos = getPos()
//     const { elMeme } = gMemeController
//     // don't let the text to go out of the canvas completely
//     const lineX = line.pos.x + diffX
//     const lineY = line.pos.y + diffY

//     if (lineY < 0 || lineY > elMeme.height) return
//     if (lineX < 0 || lineX > elMeme.width) return

//     line.pos.x = lineX
//     line.pos.y = lineY
// }
// run over elCtx
// function setSaveLink() {
//     const imgContent = gElCanvas.toDataURL('image/jpeg')
//     addToSavedMemes(imgContent)
//     const strHtml = `<a class="btn start-action">Meme has been saved</a>  <div class="modal-btns-container flex space-between"><button onClick="onCloseDownloadShareModal()">Close</button></div`
//     toggleModalScreen(strHtml)
// }
// function onDownloadMeme(elLink) {
//     const data = elMeme.toDataURL()
//     elLink.href = data
//     elLink.download = 'My_Meme'
// }
// function moveLine(diffX = 0, diffY = 0) {
//     const line = getLine()
//     const { elMeme } = gMemeController
//     const posX = line.pos.x + diffX
//     const posY = line.pos.y + diffY
//     if (posY < 0 || posY > elMeme.height) return
//     if (posX < 0 || posX > elMeme.width) return

//     line.pos.x = posX
//     line.pos.y = posY
// }
// function onDownloadMeme() {
//     renderMeme(false)
//     setTimeout(() => {
//         const memeImg = convertMemeToJpeg()
//         const elMemeImgLink = document.createElement('a')
//         elMemeImgLink.href = memeImg
//         elMemeImgLink.download = 'My Meme.jpeg'
//         document.body.appendChild(elMemeImgLink)
//         elMemeImgLink.click()
//         document.body.removeChild(elMemeImgLink)
//     }, 100)
//     resumeEditing()
// }
// function setDownloadLink() {
//     elLink.href = data
//     const { elMeme } = gMemeController
//     const data = elMeme.toDataURL('image/jpeg')
//     const strHtml = `<a href="${data}" class="btn" download="Awesomeme">Click to download</a>`
// }
// function onSuccess(uploadedImgUrl) {
//     // document.getElementById('imgData').value = gElCanvas.toDataURL('image/jpeg')
//     // A function to be called if request succeeds
//     uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
//     const strHtml = `
//         <a class="btn start-action" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}"
//         title="Share on Facebook" target="_blank" onclick="onCloseDownloadShareModal()
//         window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}') return false">
//         Click to share on facebook
//         </a>`
//     toggleModalScreen(strHtml)
// }
// function onClickSavedMeme(ev, elImg) {
//     ev.stopPropagation()
//     const strHtml = `<a href="${elImg.src}" class="btn start-action meme-action" download="Awesomeme"
//     onClick="onCloseDownloadShareModal()">Download meme</a>
//     <a href="#" class="btn start-action meme-action"
//     onClick="onDeleteMeme('${elImg.dataset.id}')">Delete meme</a>`
//     toggleModalScreen(strHtml)
// }
// function onShareMeme() {
//     console.log('onShareMeme event:', event)
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
//             <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}') return false">
//                Share
//             </a>`
//     }
//     doUploadImg(imgDataUrl, onSuccess)
// }
// function shareMeme(uploadedImgUrl) {
//     uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
//     const strHtml =
//         `
//     <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}"
//     title="Share on Facebook" target="_blank" onclick="app.()"
//     window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}') return false">
//     Click to share on facebook
//     </a>`
//     renderModal(strHtml)
// }