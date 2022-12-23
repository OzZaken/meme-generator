import { MEME_SERVICE } from "../service/meme.service.js";

export const MEME_CONTROLLER = { init }

//  Dependencies Pointer:
let gMemeController

function init(dependencies) {
    // Take and Past to Controller what needed
    const { getMeme, setLinePos, getLinePos, setLine } = MEME_SERVICE
    gMemeController = {
        ...dependencies,
        isTouchScreen: false,
        isDraw: false,
        isGrab: false,
        isScale: false,
        elCtx: dependencies.elMeme.getContext('2d'),
        getMeme,
        onSaveMeme,
        onSetMeme,
        getLinePos,
        setLine,
        setLinePos
    }

    // Init Ctx
    gMemeController.elCtx.fillStyle = 'black'
    gMemeController.elCtx.strokeShape = 'circle'
    gMemeController.elCtx.strokeStyle = 'white'

    // Set Canvas Listeners
    const { elMeme } = gMemeController
    window.addEventListener('resize', resizeMeme)
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

function onMove() {
    const { isTouchScreen, isDarg, isScale, isDraw } = gMemeController
    if (!isTouchScreen) return
    const pos = getPosOnEl(ev)
    console.log(`🚀 ~ pos`, pos)
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
    // document.body.style.cursor = 'grab';
}
function onDown() {
    const touchPos = gMemeController.getPosOnEl(event)
    console.log(`🚀 ~ touchPos`, touchPos)
}

function onSetMeme(meme) {
    if (meme) MEME_SERVICE.setMeme(meme)
    else {
        const { elMeme } = gMemeController
        const val = event.target.value

        // Vertical
        const posY = gMemeController.getLinePos().y
        if (val === 'up') {
            if (posY <= 50) return
            const updatedPos = posY - elMeme.height / 20
            MEME_SERVICE.setLinePos({ y: updatedPos })
        }
        else if (val === 'down') {
            if (posY >= elMeme.height ) return
            const updatedPos = posY + elMeme.height / 20
            MEME_SERVICE.setLinePos({ y: updatedPos })
        }

    }
    renderMeme()
}

function onCreateTxtLine() {
    MEME_SERVICE.createTxtLine()
}

// Resize Meme Container offsetWidth and render again
function resizeMeme() {
    const { elMemeContainer } = gMemeController
    elMemeContainer.width = elMemeContainer.offsetWidth
    renderMeme()
}
// Render Meme 
function renderMeme() {
    const img = new Image()
    const meme = gMemeController.getMeme()
    const { aspectRatio, keywords, lines, src } = meme

    const { elCtx, elMeme, elMemeContainer, elEditHeading } = gMemeController
    if (!src) {
        // TODO: Fill Text on the Canvas Must Pick Image
        gMemeController.flashMsg('Select Image first!')
        return
    }
    else elEditHeading.innerText = 'edit your meme!'
    img.src = src
    img.onload = () => {
        // Render Meme keywords
        if (keywords) {
            const { elKeywordsContainer } = gMemeController
            elKeywordsContainer.innerText = keywords.slice(0, 3).join(', ')
        }
        // Set aspect-ratio
        if (aspectRatio) elMeme.style.aspectRatio = aspectRatio
        elMeme.width = elMemeContainer.width = img.naturalWidth
        elMeme.height = elMemeContainer.height = img.naturalHeight
        // render Meme Canvas
        elCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height)
        lines.forEach(line => drawLine(line))
    }
}

// Get Line model from Service And render
function drawLine(line) {
    const { elCtx } = gMemeController
    elCtx.beginPath()
    elCtx.lineWidth = line.lineWidth
    elCtx.textAlign = line.textAlign
    elCtx.fillStyle = line.fillStyle
    elCtx.strokeStyle = line.strokeStyle

    // Set Font 
    const { fontMap } = line
    elCtx.font = `${fontMap.size}${fontMap.sizeUnit} ${fontMap.family}`

    // Set Pos, Opt start without Pos
    const { elMeme } = gMemeController

    let posX
    if (!line.pos.x) {
        posX = elMeme.width / 2
        const horizontal = { x: posX }
        gMemeController.setLinePos(horizontal)
    }
    else posX = line.pos.x
    let posY
    if (!line.pos.y) {
        posY = elMeme.height / 2
        const vertical = { y: posY }
        gMemeController.setLinePos(vertical)
    }
    else posY = line.pos.y

    elCtx.fillText(line.txt, posX, posY)
    elCtx.strokeText(line.txt, posX, posY)
    elCtx.closePath()
}



function onSaveMeme() {
    console.log(`🚀 ~ onSaveMeme`,)
    console.log('event:', event)
    console.log('getMeme(),', getMeme());
}

function onShareMeme() {
    console.log('onShareMeme event:', event)
}
function shareMeme(uploadedImgUrl) {
    uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
    const strHtml =
        `
    <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" 
    title="Share on Facebook" target="_blank" onclick="app.()";
    window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
    Click to share on facebook   
    </a>`
    renderModal(strHtml)
}




// function setTxt(txt) {
//     const { lines, selectedLineIdx } = MEME.meme
//     lines[selectedLineIdx].txt = txt
// }

// function setTxtSize(diff) {
//     const { lines, selectedLineIdx } = MEME.meme
//     lines[selectedLineIdx].size += diff
// }

// run over elCtx  
function setCtx(ctxKeys) {
    let elCtx = { elCtx } = gMemeController
    elCtx = { ...elCtx, ...ctxKeys }
}

function onDownloadMeme(elLink) {
    const data = elMeme.toDataURL()
    elLink.href = data
    elLink.download = 'My_Meme'
}
//Download& share
function moveLine(diffX = 0, diffY = 0) {
    const line = getLine()
    const { elMeme } = gMemeController
    const posX = line.pos.x + diffX
    const posY = line.pos.y + diffY
    if (posY < 0 || posY > elMeme.height) return
    if (posX < 0 || posX > elMeme.width) return

    line.pos.x = posX
    line.pos.y = posY
}

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
//     const data = elMeme.toDataURL('image/jpeg');
//     const strHtml = `<a href="${data}" class="btn" download="Awesomeme">Click to download</a>`;
// }
// function uploadImg(elForm, ev) {
//     ev.preventDefault();
//     resetSelections();
//     renderCanvas();

//     document.getElementById('imgData').value = gElCanvas.toDataURL('image/jpeg');
//     // A function to be called if request succeeds
//     function onSuccess(uploadedImgUrl) {
//         uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
//         const strHtml = `
//         <a class="btn start-action" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}"
//         title="Share on Facebook" target="_blank" onclick="onCloseDownloadShareModal();
//         window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
//         Click to share on facebook
//         </a>`;
//         toggleModalScreen(strHtml);
//     }

//     onUploadImg(elForm, onSuccess);
// }

// function setSaveLink() {
//     const imgContent = gElCanvas.toDataURL('image/jpeg');
//     addToSavedMemes(imgContent)
//     const strHtml = `<a class="btn start-action">Meme has been saved</a>  <div class="modal-btns-container flex space-between"><button onClick="onCloseDownloadShareModal()">Close</button></div`;
//     toggleModalScreen(strHtml)
// }
// function onClickSavedMeme(ev, elImg) {
//     ev.stopPropagation()
//     const strHtml = `<a href="${elImg.src}" class="btn start-action meme-action" download="Awesomeme"
//     onClick="onCloseDownloadShareModal()">Download meme</a>
//     <a href="#" class="btn start-action meme-action"
//     onClick="onDeleteMeme('${elImg.dataset.id}')">Delete meme</a>`;
//     toggleModalScreen(strHtml)
// }