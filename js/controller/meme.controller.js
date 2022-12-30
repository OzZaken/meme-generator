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
    // console.log(`🚀 ~ init dependencies`, dependencies)
    gMemeController = {
        ...dependencies,
        isTouchScreen: false,
        isGrab: false,
        isScale: false,
        elCtx: dependencies.elMeme.getContext('2d'),
        onSaveMeme,
        onSetMeme,
        onAddLine,
        editMap: {
            onMoveLine: () => {
                const { elMeme } = gMemeController
                const line = MEME_SERVICE.getLine()
                const { y } = line.pos
                const operator = event.target.dataset.operator
                const diff = parseInt(operator + 10)
                const { size } = MEME_SERVICE.getFont()
                if (operator === '-' && y + diff <= +size) return
                else if (operator === '+' && y + diff >= elMeme.height) return
                MEME_SERVICE.setLinePos({ y: parseInt(y + +diff) })
            },
            onSwitchLine: () => MEME_SERVICE.switchLine(true),
            onAddLine: () => {
                MEME_SERVICE.addLine(elMeme.width / 2, elMeme.height / 2)
            },
            onRemoveLine: () => {
                console.log(MEME_SERVICE.getMeme());
                MEME_SERVICE.removeLine()
            },
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
    console.log(`🚀 ~ onSetMeme meme`, meme || event.target.value)
    if (!meme) {
        const val = event.target.dataset.key === 'family' ? 'onSetFont' : event.target.value
        const { editMap } = gMemeController
        editMap[val]()
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
        // Lines
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
    // NOTE: fillStyle did't catch
    const { elCtx } = gMemeController
    for (const key in line) {
        elCtx[key] = line[key]
        // console.log(`🚀 ~  elCtx[${key}]`, elCtx[key])
    }
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
    elCtx.beginPath()
    elCtx.restore()
    elCtx.strokeText(txt, x, y)
    elCtx.closePath()
    // Set Focus 
    if (MEME_SERVICE.getLine() === line) drawOutLine()
}

function drawOutLine() {
    const { elCtx } = gMemeController
    const line = MEME_SERVICE.getLine()
    const { x, y } = line.pos
    const metrics = elCtx.measureText(line.txt)
    console.log(`🚀 ~ metrics`, metrics)
    const width = metrics.width+2
    const height = +MEME_SERVICE.getFont().size
    elCtx.beginPath()
    console.log('x - width / 2||height',x - width / 2,height);
    const posX = x - width / 2
    const posY = y - height
    
    elCtx.rect(posX, posY, metrics.width, height)
    elCtx.stroke()
    elCtx.closePath()
}