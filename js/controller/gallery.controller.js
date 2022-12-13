'use strict'
// import galleryService from '../service/gallery.service'

const galleryController = {
    renderGallery,
    onSetFilterGallery,
    renderKeywordsOptions,
    renderKeywordsBtns,
}

function renderGallery() {
    const saveMemes = storageService.loadFromStorage('memeDB') || []
    const imgs = saveMemes.length ? saveMemes.concat(galleryService.getImgsForDisplay()) : galleryService.getImgsForDisplay()
    const strHTMLs = imgs.map(img =>
        `
        <img onclick="onImgSelect(${img.id})" 
        class="gallery-img" src=${img.url} alt="Meme Background ${img.id}">
        `
    )
    document.querySelector('.gallery-container').innerHTML = strHTMLs.join('')
}

function onSetFilterGallery() {
    const imgs = getImg()
    var strHTML = ''
    imgs.map(img => {
        strHTML += `<img onclick="onImgSelect(${img.id})" class="gallery-img" src=${img.url} alt="gallery-img">\n`
    })
    document.querySelector('.gallery-container').innerHTML = strHTML
}

function renderKeywordsOptions() {
    const keywordsCountMap = galleryService.getKeyWordsCountMap()
    const strHTMLs = Object.keys(keywordsCountMap).map(keywordStr =>
        `<option value="${keywordStr}">`
    )
    document.querySelector('#keywords').innerHTML = strHTMLs.join('')
    console.log('strHTMLs:', strHTMLs)
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