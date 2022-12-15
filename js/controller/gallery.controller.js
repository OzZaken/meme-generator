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
    const memes = galleryService.getMemesForDisplay()
    const strHTMLs = memes.map((meme, idx) =>
        `
        <img onclick="onImgSelect(${meme.url})" 
        class="gallery-meme-container"
        src=${meme.url}
        alt="Meme ${idx + 1} ${meme.keywords.join(', ')}"       
        title="Meme #${idx + 1}\n${meme.keywords.join(', ')}">
        `
    )
    // Stat and upload image
    const foundCount = memes.length >= 0 ? memes.length: '0'
    strHTMLs.unshift(`
    <div class="gallery-meme-container gallery-stat">
    <span title="filtered Meme count">${foundCount}</span>
    &#47;
    <span title="Total Memes Founds">${galleryService.getTotalCount()}</span>
    <p>Upload your own image!</p>
    <input type="file" name="img" onchange="onUploadImg(event)"/>
    </div>
    `)
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
    const strHTMLs = galleryService.getTopCountMap().map(keyword =>
        `
        <li>
        <button class="btn btn-keyword"
        title="${keyword[1]} Meme Founds"
         onclick="onClickFilterKeyword(this)" 
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

function setAspectRatio(el) {

}

// Filter
function onSetFilter(str) {
    const { elFilterBy } = gState.domEls.inputs
    // const imgs = getImgsForDisplay()
    galleryService.setFilter(str)
    elFilterBy.value = str
    renderGallery()
}

// keywords Buttons
function onClickFilterKeyword(elKeyWord) {
    const { dataset, innerText } = elKeyWord
    elKeyWord.style.color = utilService.getRandomColor()
    onSetFilter(innerText)
    if (+dataset.fs >=  16) return
    dataset.fs++
}

// Last Function on Gallery Controller
function onImgSelect(imgId) {
    console.log(`onImgSelect(${imgId})`)
    setImg(imgId)
    document.querySelector('.gallery-container').hidden = true
    flashMsg('img selected')
    renderMeme()
}