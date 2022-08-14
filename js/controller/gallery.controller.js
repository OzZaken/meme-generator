'use strict'

let gSearchFilter = ''

var gKeywordSearchCountMap = {
    'funny': 7,
    'cute': 5,
    'celeb': 6,
    'dog': 11,
    'cat': 16,
    'baby': 2,
}


function renderGallery() {
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
function onSetFilterBy() {
    const searchTxt = document.querySelector('.filter-input').value
    setFilterBy(searchTxt)
    filterGallery()

}
function getKeyWords() {
    return gKeywordSearchCountMap
}
function countKeyWords() {
    let keywords = getKeyWords()
    console.log('keywords:', keywords)
}