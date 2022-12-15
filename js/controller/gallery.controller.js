'use strict'
// import galleryService from '../service/gallery.service'

const galleryController = {
    renderGallery,
    renderKeywordsOptions,
    renderKeywordsBtns,
    onUploadImg,
    onSetFilter,
}

// render Filtered  
function renderGallery() {
    const saveMemes = storageService.loadFromStorage('memeDB') || []
    const imgs = saveMemes.length ? saveMemes.concat(galleryService.getImgsForDisplay()) : galleryService.getImgsForDisplay()
    const strHTMLs = imgs.map((img, idx) =>
        `
        <img onclick="onImgSelect(${img.id})" 
        class="gallery-img-container"
        src=${img.url}
        alt="Meme Background ${idx}"       
        title="Meme Background ${idx}">
        `
    )
    strHTMLs.unshift(
        `
        <div class="flex-column column gallery-img-container">
        <h3>Choose your own image!</h3>
        <input type="file" name="img" onchange="onUploadImg(event)"/>
        </div>
        `
    )
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}

// render options Based CountMap  
function renderKeywordsOptions() {
    const keywordsCountMap = galleryService.getKeyWordsCountMap()
    const strHTMLs = Object.keys(keywordsCountMap).map(keywordStr =>
        `<option value="${keywordStr}"></option>`
    )
    document.querySelector('#keywords').innerHTML = strHTMLs.join('')
}

// font Size Based CountMap
function renderKeywordsBtns() {
    const strHTMLs = Object.entries(galleryService.getKeyWordsCountMap()).map(keyword =>
        `
        <li>
        <button class="btn btn-keyword" onclick="onClickFilterKeyword(this)" 
        data-fs="${keyword[1]}">${keyword[0]}
        </button>
        </li>
        `
    )
    document.querySelector('.keyword-container').innerHTML = strHTMLs.join('')
}

// Upload  Meme Background
function onUploadImg(ev) {
    const { elImgInput } = gMeme.domeEls.inputs
    elImgInput.innerHTML = ''
    const reader = new FileReader()
    reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        onChooseImg(event.target.result)
    }
    reader.readAsDataURL(ev.target.files[0])
}

// Filter
function onSetFilter(str) {
    const { elFilterBy } = gMeme.domEls.inputs
    // const imgs = getImgsForDisplay()
    galleryService.setFilter(str)
    elFilterBy.value = str
    renderGallery()
}

// keywords Buttons
function onClickFilterKeyword(elKeyWord) {
    const { dataset, innerText } = elKeyWord
    const maxFontSize = 12
    if (+dataset.fs >= maxFontSize) return
    dataset.fs++
    onSetFilter(innerText)
}

// Last Function on Gallery Controller
function onImgSelect(imgId) {
    console.log(`onImgSelect(${imgId})`)
    setMemeImg(imgId)
    document.querySelector('.gallery-container').hidden = true
    flashMsg('img selected')
    renderMeme()
}