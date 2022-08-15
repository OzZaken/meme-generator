'use strict'
function renderGallery() {
    const elGallery =_LoadMemeFromStorage()
    if (elGallery) {
        
    }
    let strHTML = ''
    getImg().forEach(img => {
        strHTML += `<img onclick="onImgSelect(${img.id})" class="gallery-img" src=${img.url} alt="gallery-img">`
    })
    document.querySelector('.gallery-container').innerHTML = strHTML
}
function filterGallery() {
    const imgs = getImg()
    var strHTML = ''
    imgs.map((img) => {
        strHTML += `<img onclick="onImgSelect(${img.id})" class="gallery-img" src=${img.url} alt="gallery-img">\n`
    })
    document.querySelector('.gallery-container').innerHTML = strHTML
}
function getKeyWords() {
    return gKeywordSearchCountMap
}
function countKeyWords() {
    let keywords = getKeyWords()
    console.log('keywords:', keywords)
}