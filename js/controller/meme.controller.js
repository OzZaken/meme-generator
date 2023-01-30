import { GALLERY_SERVICE } from "../service/gallery.service.js"
import { MEME_SERVICE } from "../service/meme.service.js"
import { MAIN_CONTROLLER } from "../main.controller.js"

export const MEME_CONTROLLER = {
    init,
    onSetMeme,
    onSetTxt,
    onMove,
    onUp,
    onDown,
    onAddTxt,
    onFocusTxt,
    onSetColor,
    onUploadImg,
}

let gMemeController

function init(args) {
    gMemeController = {
        ...args,
        isTouchScreen: false,
        isGrab: false,
        isScale: false,
        elCtx: args.elMeme.getContext('2d'),
        elTxtInput: document.querySelector('[name="set-txt"]'),
        elKeywordInput: document.querySelector('[name="set-keyword"]'),
        _setMap: {
            onMoveLine: (keyBoardOperator) => {
                const { elMeme } = gMemeController
                const line = MEME_SERVICE.getLine()
                const { y } = line.pos
                // Extract the operator from btns or from keyboard 
                const operator = keyBoardOperator ? keyBoardOperator : event.target.dataset.operator
                const diff = parseInt(operator + 10)
                const { size } = MEME_SERVICE.getFont()
                console.log(`🚀 ~ diff`, diff)
                if (operator === '-' && y + diff <= +size) return
                else if (operator === '+' && y + diff >= elMeme.height) return
                MEME_SERVICE.setLinePos({ y: parseInt(y + +diff) })
            },
            onSwitchLine: () => MEME_SERVICE.switchLine(true),
            onAddLine: () => {
                MEME_SERVICE.addLine(elMeme.width / 2, elMeme.height / 2)
            },
            onRemoveLine: () => MEME_SERVICE.removeLine()
            ,
            onSetFont: () => {
                let fontData = MEME_SERVICE.getFont()
                const key = event.target.dataset.key
                const operator = event.target.dataset.operator
                if (key === 'size') {
                    const diff = parseInt(operator + 10)
                    const num = +MEME_SERVICE.getFont()[key] + diff
                    console.log(`🚀 ~ num`, num)
                    fontData.size = num + ''
                }
                if (key === 'family') {
                    event.target.style.fontFamily = event.target.value
                    fontData.family = event.target.value
                }
                MEME_SERVICE.setFont(fontData)
            },
            onAlienL: () => MEME_SERVICE.setLine({ 'textAlign': 'left' }),
            onAlienC: () => MEME_SERVICE.setLine({ 'textAlign': 'center' }),
            onAlienR: () => MEME_SERVICE.setLine({ 'textAlign': 'right' }),
            onSetImg: () => {
                const { diff } = event.target.dataset
                const length = GALLERY_SERVICE.getImgsCount()
                MEME_SERVICE.resetLines()
                const src = MEME_SERVICE.getNextImg(length, diff)
                event.target.src = src
                gMemeController.onImgSelect()
            }
        }
    }

    // Set Event Listeners
    window.addEventListener('resize', resizeMeme)
    const { elMeme } = gMemeController
    // Pc Mouse 
    elMeme.addEventListener('mousemove', onMove)
    elMeme.addEventListener('mousedown', onDown)
    elMeme.addEventListener('mouseup', onUp)
    // Mobile & Tablet Touch
    elMeme.addEventListener('touchmove', onMove)
    elMeme.addEventListener('touchstart', onDown)
    elMeme.addEventListener('touchend', onUp)

    // Update Main controller
    const miniController = {
        ...gMemeController,
        _setMap: null // Ensure _setMap stay private
    }
    return miniController
}

function onSetMeme(meme) {
    if (!meme) {
        const val = event.target.dataset.key === 'family' ? 'onSetFont' : event.target.value
        gMemeController._setMap[val]()
    }
    else MEME_SERVICE.setMeme(meme)
    renderMeme()
}

// Render Meme 
function renderMeme() {
    const { keywords, lines, src } = MEME_SERVICE.getMeme()
    const { elCtx, elMeme } = gMemeController

    const img = new Image()
    img.src = src
    img.onload = () => {
        if (keywords) { // keywords
            const { elKeywordsContainer } = gMemeController
            elKeywordsContainer.innerText = keywords.slice(0, 3).join(', ')
        }
        // Set Canvas Size
        elMeme.width = img.width
        elMeme.height = img.height
        elCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height) // render Image 
        // Line
        if (!lines.length) MEME_SERVICE.addLine(elMeme.width / 2, elMeme.height / 2)
        lines.forEach(line => drawLine(line))
    }
}

function resizeMeme() {
    const { elMemeContainer, elMeme } = gMemeController
    elMemeContainer.width = elMeme.offsetWidth
    elMemeContainer.height = elMeme.offsetHeight
    renderMeme()
}

// Handle Touch Events
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
    // console.log('document.body.offsetWidth:', document.body.offsetWidth)
    // console.log('window.innerWidth:', window.innerWidth)
    // document.body.style.cursor = 'grab'
}

function onDown() {
    const touchPos = MAIN_CONTROLLER.getPos(event)
    const lines = MEME_SERVICE.getMeme().lines
    const { elCtx } = gMemeController
    console.log(touchPos)
    lines.forEach(line => {
        const { pos, txt, height } = line
        const metrics = elCtx.measureText(txt)
        const lineWidth = metrics.width //+ 20 // Add some padding for touch targets
        if (touchPos.x >= pos.x - lineWidth &&
            touchPos.x <= pos.x + lineWidth &&
            touchPos.y >= pos.y - height &&
            touchPos.y <= pos.y + height) {
            console.log('click on', line)
        }
    })
}

function onAddLine() {
    MEME_SERVICE.createLine()
}

function onSaveMeme() {
    console.log(`🚀 ~ onSaveMeme`,)
    console.log('event:', event)
    console.log('getMeme(),', getMeme())
}

// Set ctx
function _setCtx(line) {
    const { elCtx } = gMemeController
    for (const key in line) {
        elCtx[key] = line[key]
    }
    elCtx.fillStyle = line.fillStyle
    // console.log(`fillStyle: ${elCtx.fillStyle}`)
    elCtx.save()
}

function drawLine(line) {
    const { elMeme, elCtx } = gMemeController
    // Opt for empty Pos
    if (!line.pos.x || !line.pos.y) {
        if (!line.pos.y) {
            line.pos.y = elMeme.height / 2
            const vertical = { y: line.pos.y }
            MEME_SERVICE.setLinePos(vertical)
        }
        if (!line.pos.x) {
            line.pos.x = elMeme.width / 2
            const horizontal = { x: line.pos.x }
            MEME_SERVICE.setLinePos(horizontal)
        }
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
    const { x, y } = line.pos
    elCtx.restore()
    elCtx.beginPath()
    elCtx.fillStyle = line.fillStyle //🐞
    elCtx.strokeText(txt, x, y)
    elCtx.closePath()

    if (MEME_SERVICE.getLine() === line) renderFocus() // Set Focus
}

function onFocusTxt(isFocus) {
    if (isFocus) document.addEventListener('keydown', keydownHandler)
    else document.removeEventListener('keydown', keydownHandler)
}

function keydownHandler() {
    switch (event.key) {
        case 'ArrowUp':
            gMemeController._editMap.onMoveLine('-')
            break;
        case 'ArrowDown':
            gMemeController._editMap.onMoveLine('+')
    }
    renderMeme()
}

function renderFocus() {
    const { elCtx, elTxtInput } = gMemeController
    const line = MEME_SERVICE.getLine()
    const { x, y } = line.pos
    elTxtInput.value = line.txt
    // input style
    elTxtInput.style.fontFamily = MEME_SERVICE.getFont().family
    elTxtInput.style.color = line.strokeStyle
    // Rect
    const metrics = elCtx.measureText(line.txt)

    const width = metrics.width + 30
    const height = +MEME_SERVICE.getFont().size + 10
    // Update Line only on the Controller
    line.width = width
    line.height = height - 10

    const posX = x - width / 2
    const posY = y - height + 10
    elCtx.beginPath()
    elCtx.strokeStyle = 'green'
    elCtx.lineWidth = 5
    elCtx.rect(posX, posY, width, height)
    elCtx.stroke()
    elCtx.closePath()
}

function onSetTxt() {
    const val = event.target.value
    MEME_SERVICE.setTxt(val)
    renderMeme()
}

function onAddTxt() {
    const { elMeme } = gMemeController
    MEME_SERVICE.addLine(elMeme.width / 2, elMeme.height / 2)
    renderMeme()
}

function onSetColor() {
    console.log(event);
}

function onUploadImg() {
    const imgDataUrl = gElCanvas.toDataURL("image/jpeg")
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        // create the new div element
        const elShareContainer = document.createElement('div')
        // add some elements,attrs,text to the div
        elShareContainer.innerHTML = `// add more elements, texts, attrs to the div
        <a class="btn" 
        href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}"
        title="Share on Facebook"
        target="_blank"
        onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}')
        return false">
        Share   
        </a>
        `
        const { elModal } = gMemeController
        // append the new div to the existing element
        elModal.appendChild(elShareContainer)
    }
    MEME_SERVICE.uploadImg(imgDataUrl, onSuccess)
}