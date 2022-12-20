'use strict'

// Init MemeController
function initMemeController() {
    // HTML dependencies:
    // div.meme-container
    // canvas#meme
    window.gMemeController = {
        elMeme: document.querySelector('#meme'),
        elMemeContainer: document.querySelector('.meme-container'),
        elKeywordsContainer: document.querySelector('.meme-keyword-container'),
        elCtx: document.querySelector('#meme').getContext('2d'),
        isDraw: false,
        isGrab: false,
    }
    _initCTX()
    setMemeListeners()
}

// After init Set elCtx
function _initCTX() {
    const { elCtx } = gMemeController
    elCtx.currShape = 'circle' // 🤨
    elCtx.fillStyle = 'black'//#000000
    elCtx.strokeStyle = 'white'//#000000
    // Note: elCtx already declared 
    // elCtx.size = 20 // 🤨
    // elCtx.direction = 'ltr'//#ltr
    // elCtx.wordSpacing = '0px'
    // elCtx.filter = 'none'
    // elCtx.textAlign = 'start'
    // elCtx.shadowColor = 'rgba(0, 0, 0, 0)'
    // elCtx.font = '10px sans-serif'// fontMap?
}

// Set Canvas Listeners 
function setMemeListeners() {
    const { elMeme } = gMemeController
    window.addEventListener('resize', () => {
        resizeMeme()
    })
    // Mouse
    elMeme.addEventListener('mousemove', onMove)
    elMeme.addEventListener('mousedown', onDown)
    elMeme.addEventListener('mouseup', onUp)
    // Mobile
    elMeme.addEventListener('touchmove', onMove)
    elMeme.addEventListener('touchstart', onDown)
    elMeme.addEventListener('touchend', onUp)
}

// Resize Using offsetWidth and render again
function resizeMeme() {
    const { elMeme, elMemeContainer } = gMemeController
    elMemeContainer.width = elMemeContainer.offsetWidth
    elMeme.width = elMemeContainer.offsetWidth;
    renderMeme()
}

// Render Meme 
function renderMeme() {
    const img = new Image()
    const { aspectRatio, keywords, lines, src } = getMeme()
    const { elCtx, elMeme, elMemeContainer } = gMemeController
    if (!src) {
        flashMsg('Select Image first!')
        elCtx.drawLine({
            txt: 'First Select Image!'
        })
        return
    }
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
        elCtx.drawImage(img, 0, 0, elMeme.width, elMeme.height)
        lines.forEach(line => drawLine(line))
    }
}

// Get Line model from Service And render
function drawLine(line) {
    console.log(`🚀 ~ line`, line)
    const { elCtx, elMeme } = gMemeController
    elCtx.beginPath()
    elCtx.lineWidth = line.lineWidth
    elCtx.textAlign = line.textAlign
    elCtx.fillStyle = line.fillStyle
    elCtx.strokeStyle = line.strokeStyle
    // Set Font 
    const { fontMap } = line
    elCtx.font = `${fontMap.size}${fontMap.sizeUnit} ${fontMap.family}`
    // Set pos
    let posX
    let posY
    if (!line.x) posX = elMeme.width / 2
    if (!line.y) posY = elMeme.height / 2
    elCtx.fillText(line.txt, posX, posY)
    elCtx.strokeText(line.txt, posX, posY)
    elCtx.closePath()
}


function setCtx(...ctx) {
    console.log(`🚀 ~ ctx`, ctx)
    const { elCtx } = gMemeController
    console.log(`🚀 ~ elCtx`, elCtx)
    elCtx = { ...elCtx, ctx }
    console.log(`🚀 ~ elCtx`, elCtx)
}
// isDraw = false TODO: check if needed
function onMouseOutCanvas() {
    console.log('onMouseOutCanvas')
    gMemeController.IsDraw = false
}

function onDownloadMeme(elLink) {
    const data = elMeme.toDataURL()
    console.log('data:', data)
    elLink.href = data
    elLink.download = 'My Meme'
}
//*                                   🐱‍👤👀🐱‍👤   
function onUp() {
    gMemeController.isDraw = false
    gMemeController.isGrab = false
}

function onUp(ev) {
	const pos = getEvPos(ev)
	setIsMemeDrag(false)
	if (isInLine(pos, false)) document.body.style.cursor = 'grab'
}
function isInLine(pos, isClicked) {
	// reverse order so we chose the line on top
	for (let i = gMeme.lines.length - 1; i >= 0; i--) {
		const box = gMeme.lines[i].bindBox
		if (
			pos.x >= box.x &&
			pos.x <= box.x + box.width &&
			pos.y >= box.y &&
			pos.y <= box.y + box.height
		) {
			if (isClicked) gMeme.selectedLineIdx = i
			return true
		}
	}
	return false
}
function onMove(ev) {
	const pos = getEvPos(ev)
	if (isMemeDrag()) {
		ev.preventDefault()
		const pos = getEvPos(ev)

		const dx = pos.x - gDragStartPos.x
		const dy = pos.y - gDragStartPos.y
		moveLine(dx, dy)
		gDragStartPos = pos
		renderMeme()
	} else {
		if (isInLine(pos, false)) document.body.style.cursor = 'grab'
		else document.body.style.cursor = 'default'
	}
}
function moveLine(diffX = 0, diffY = 0) {
	const line = getLine()
	// don't let the text to go out of the canvas completely
	const posX = line.pos.x + diffX
	const posY = line.pos.y + diffY
	if (posY < 0 || posY > gCanvas.height) return
	if (posX < 0 || posX > gCanvas.width) return

	line.pos.x = posX
	line.pos.y = posY
}

function onUp() {
    gIsDragging = gIsScaling = false;
    document.body.style.cursor = 'grab';
}


function onMove(ev) {
    if(!gIsDragging && !gIsScaling) return;
    const pos = getEvPos(ev);
    if (gIsDragging) {
        moveSelectedByDragging(pos, gStartPos);
        gStartPos = pos;
        renderCanvas();
        return
    }
    scaleSelectedByDragging(pos, gStartPos);
    gStartPos = pos;
    renderCanvas();

}



function onMove(ev) {
    if(!gIsDragging && !gIsScaling) return;
    const pos = getEvPos(ev);
    if (gIsDragging) {
        moveSelectedByDragging(pos, gStartPos);
        gStartPos = pos;
        renderCanvas();
        return
    }
    scaleSelectedByDragging(pos, gStartPos);
    gStartPos = pos;
    renderCanvas();

}

function onDown(ev) {
	//Get the ev pos from mouse or touch
	const pos = getEvPos(ev)
	if (!isInLine(pos, true)) return
	// in case we change the line with the click
	renderAccordingToLine()
	setIsMemeDrag(true)
	gDragStartPos = pos
	document.body.style.cursor = 'grabbing'
	renderMeme()
}
function onDown(ev) {
    const pos = getEvPos(ev);
    const {isDragging, isScaling} = isDraggingOrScaling(pos);
    gIsDragging = isDragging;
    gIsScaling = isScaling;
    renderCanvas();
    updateMemeTxtInput();
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}
function onDown(ev) {
    console.log('gStroke:', gStroke)
    isDraw = true
    draw(getEvPos(ev))
}
function onDown(ev) {
    const pos = getEvPos(ev);
    const {isDragging, isScaling} = isDraggingOrScaling(pos);
    gIsDragging = isDragging;
    gIsScaling = isScaling;
    renderCanvas();
    updateMemeTxtInput();
    gStartPos = pos;
    document.body.style.cursor = 'grabbing';
}

// ✍🏽🤏🏽
function onDraw(ev) {
    if (isDraw) draw(getEvPos(ev))
}
function onLineInput(txt) {
	setLineTxt(txt)
	renderMeme()
}
function onChangeTextColor(color) {
	setTextColor(color)
	renderMeme()

	document.querySelector('.color-btn').style.color = color
}
function onChangeStrokeColor(color) {
	setStrokeColor(color)
	renderMeme()

	document.querySelector('.stroke-btn').style.color = color
}
function onChangeLinePos(x, y) {
    changeLinePos(x, y)
    playAudio('click')
    renderMeme()
}
function onSetLineText(txt) {
    setTxt(txt)
    playAudio('click', gAudio)
    renderMeme()
}
function onAddTxtLine(txt) {
    addTxtLine(txt)
    playAudio('click', gAudio)
    renderMeme()
}
function onSwitchLines() {
    setSelectedLine()
    playAudio('click', gAudio)
    renderMeme()
}
function onDeleteTxtLine() {
    deleteLastLine()
    playAudio('click', gAudio)
    renderMeme()
}
function onChangeElSize(num) {
    setTxtSize(num)
    renderMeme()
}
function onChangeAlign(dir) {
    changeAlign(dir)
    renderMeme()
}
function downloadCanvas(elLink) {
    // Todo: Make more reUse which Canvas to Download in case of multi
    const data = gElDrawCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-canvas'
}
function onSetColor(val, className) {
    console.log('el:', val)
    console.log('className:', className)
    if (className === 'fill-color') gStroke.fillStyle = val
    else gStroke.strokeStyle = val
    document.querySelector(`.${className}`).style.color = val.value
    console.log('gStroke:', gStroke)
}
function onChangeFont(val) {
    changeFont(val)
    playAudio('click')
    renderMeme()
}
function onUpdateStrokeSize(num) {
    // onUpdateStrokeSize(num)
    gStrokeSize = num // UpdateStrokeSize()?
}

function onMouseOutCanvas() {
    gCtx.beginPath()
    isDraw = false
}
function onClearMeme() {
    playAudio('click', gAudio)
    clearMeme()
}

//Download& share

// on submit call to this function
function onSaveMeme() {
    saveMeme()
}
function onDownloadImg() {
    resetSelections();
    renderCanvas();
    setTimeout(setDownloadLink, 700);
}
function loadImgFromInput(ev) {
    document.querySelector('.share-container').innerHTML = '';
    var reader = new FileReader();

    reader.onload = function (event) {
        var img = new Image();
        img.src = event.target.result;
        onChooseImg(-1, event.target.result);
    };
    reader.readAsDataURL(ev.target.files[0]);
}
function setDownloadLink() {
    const imgContent = gElCanvas.toDataURL('image/jpeg');
    const strHtml = `<a href="${imgContent}" class="btn start-action" download="Awesomeme" 
    onclick="onCloseDownloadShareModal()">Click to download</a>`;
    toggleModalScreen(strHtml);
}
function uploadImg(elForm, ev) {
    ev.preventDefault();
    resetSelections();
    renderCanvas();
    document.getElementById('imgData').value = gElCanvas.toDataURL('image/jpeg');

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        const strHtml = `
        <a class="btn start-action" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" 
        title="Share on Facebook" target="_blank" onclick="onCloseDownloadShareModal();
        window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
        Click to share on facebook   
        </a>`;
        toggleModalScreen(strHtml);
    }

    doUploadImg(elForm, onSuccess);
}
function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData,
    })
        .then(function (res) {
            return res.text();
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err);
        });
}
function onSaveImg() {
    resetSelections();
    renderCanvas();
    setTimeout(setSaveLink, 700);
}
function setSaveLink() {
    const imgContent = gElCanvas.toDataURL('image/jpeg');
    addToSavedMemes(imgContent);
    const strHtml = `<a class="btn start-action">Meme has been saved</a>  <div class="modal-btns-container flex space-between"><button onClick="onCloseDownloadShareModal()">Close</button></div`;
    toggleModalScreen(strHtml);
}
function onClickSavedMeme(ev, elImg) {
    ev.stopPropagation();
    const strHtml = `<a href="${elImg.src}" class="btn start-action meme-action" download="Awesomeme" 
    onClick="onCloseDownloadShareModal()">Download meme</a>
    <a href="#" class="btn start-action meme-action"
    onClick="onDeleteMeme('${elImg.dataset.id}')">Delete meme</a>`;
    toggleModalScreen(strHtml);
}
function onDeleteMeme(memeId) {
    toggleModalScreen();
    const strHtml = `<h2 class="btn start-action">Are you sure?</h2> <div class="modal-btns-container flex space-between"><button onClick="onRemoveMeme('${memeId}')">Yes</button> <button onClick="onCloseDownloadShareModal()">No!</button></div>`;
    toggleModalScreen(strHtml);
}
function onRemoveMeme(id) {
    removeSavedMeme(id);
    renderSavedMemes();
    onCloseDownloadShareModal();
}
function onCloseDownloadShareModal() {
    toggleModalScreen();
}
function toggleModalScreen(strHtml) {
    if (strHtml) document.querySelector('.download-share.modal').innerHTML = strHtml;
    document.body.classList.toggle('open-modal');
}
function onImgInput(ev) {
    loadImgFromInput(ev);
}