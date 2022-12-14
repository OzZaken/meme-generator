'use strict'
// import galleryService from '../service/gallery.service'

const galleryController = {
    renderGallery,
    onSetFilterGallery,
    renderKeywordsOptions,
    renderKeywordsBtns,
    loadImg,
}

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
        <input type="file" name="img" onchange="onAddImg(event)"/>
        </div>
        `
    )
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}

function renderKeywordsOptions() {
    const keywordsCountMap = galleryService.getKeyWordsCountMap()
    const strHTMLs = Object.keys(keywordsCountMap).map(keywordStr =>
        `<option value="${keywordStr}">`
    )
    document.querySelector('#keywords').innerHTML = strHTMLs.join('')
}

function renderKeywordsBtns() {
    const strHTMLs = Object.entries(galleryService.getKeyWordsCountMap()).map(keyword =>
        `
        <li>
        <button class="btn btn-keyword" onclick="onClickKeyword(this)" data-fs="${keyword[1]}">${keyword[0]}</button>
        </li>
        `
    )
    document.querySelector('.keyword-container').innerHTML = strHTMLs.join('')

}

function loadImg(ev) {
    document.querySelector('[name="img"]').innerHTML = ''
    const reader = new FileReader()
    reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        onChooseImg(event.target.result)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function onChooseImg(imgSrc) {
console.log('imgSrc:', imgSrc)
}

function onSetFilterGallery() {

    const imgs = getImg()
    let strHTMLs = ``
    strHTMLs += imgs.map(img =>
        `<img onclick="onImgSelect(${img.id})" class="gallery-img" src=${img.url} alt="gallery-img">`
    )
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}