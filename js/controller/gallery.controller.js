'use strict'

// Later:
// import galleryService from '../service/gallery.service'
// export const galleryController = {
//         renderGallery,
//         renderKeywordsOptions,
//         renderKeywordsBtns,
//         onUploadImg,
//         onSetFilter,
// }

function initGalleryController(galleryName) {
    // Dependencies:
    //     · HTML:
    // datalist#keywords
    // datalist.keyword-container
    // input[name="filter"]
    // ul.gallery-keywords-container
    //     · JS:
    !galleryName ? galleryName = 'Image' : galleryName
    console.log('initGalleryController:\nGallery Name:', galleryName)

    //? callBack func onImgSelect
    window.gGalleryController = {
        galleryName,
        elFilterBy: document.querySelector('input[name="gallery-filter"]'),
        elDataList: document.querySelector('datalist#gallery-keywords'),
        elKeywordContainer: document.querySelector('ul.gallery-keywords-container'),
        elGallery: document.querySelector('div.gallery-container'),
    }
    // Opt, Better in Timeout for Ending init
    setTimeout(() => {
        renderGallery()
        renderKeywordsOptions()
        renderKeywordsBtns()
    }, 30)
}

// render Gallery + filter-stat + upload-image   
function renderGallery() {
    const { galleryName } = gGalleryController
    // Set Images template
    const imgs = getImgsForDisplay()
    const strHTMLs = imgs.map((img, idx) => {
        return `
        <img onclick="onImgSelect('${img.id}')" 
        onload="setAspectRatio(this,'${img.id}')"
        class="gallery-${galleryName}-container"
        src=${img.url}
        alt="${_capitalize(galleryName)} #${idx + 1} ${_capitalizes(img.keywords)}"       
        title="${_capitalize(galleryName)} #${idx + 1}\n${_capitalizes(img.keywords)}">
        `}
    )
    // Set Stats and Upload Option
    const foundCount = imgs.length >= 0 ? imgs.length : '0'
    strHTMLs.unshift(`
    <div class="gallery-${galleryName}-container gallery-stat">
    <span title="filtered ${galleryName} count">${foundCount}</span>
    &#47;
    <span title="Total ${_capitalize(galleryName)}s Founds">${getTotalCount()}</span>
    <p>Upload New ${galleryName}!</p>
    <input type="file" name="img" onchange="onUploadImg(event)"/>
    </div>
    `)
    // render Gallery
    const { elGallery } = gGalleryController
    elGallery.innerHTML = strHTMLs.join('')
}

// render Options keywords to the DataList
function renderKeywordsOptions() {
    const keywordsCountMap = getOptionsForDisplay()
    console.log(`🚀 ~ keywordsCountMap`, keywordsCountMap)
    const strHTMLs = keywordsCountMap.map(keywordStr =>
        `<option value="${keywordStr}">${_capitalize(keywordStr)}</option>`
    )
    strHTMLs.unshift(`<option value=" ">ALL</option>`)
    const { elDataList } = gGalleryController
    elDataList.innerHTML = strHTMLs.join('')
}

// Filter
function onSetFilter(str) {
    !str || str === ' ' ? str = '' : str
    // Give Option for emptySpace
    // DOM
    const { elFilterBy } = gGalleryController
    elFilterBy.value = str

    setFilter(str) // MODEL - GalleryService.
    renderGallery()  // DOM
}

// render keywords buttons based sorted options 
function renderKeywordsBtns() {
    const { galleryName } = gGalleryController
    const strHTMLs = getKeywordsForDisplay()
        .map(keyword =>
            `<li>
            <button class="btn btn-keyword"
            title="${keyword[1]} ${_capitalize(galleryName)}s Founds"
             onclick="onClickFilterKeyword(ev,this)" 
            data-fs="${keyword[1]}">${keyword[0]}
            </button>
            </li>`
        )
    const { elKeywordContainer } = gGalleryController
    elKeywordContainer.innerHTML = strHTMLs.join('')
}

// Keywords Buttons
function onClickFilterKeyword(ev, elKeyWord) {
    ev.preventDefault()
    ev.stopPropagations()
    const { dataset, innerText } = elKeyWord
    elKeyWord.style.color = utilService.getRandomColor()
    onSetFilter(innerText)
    if (+dataset.fs >= 16) return
    dataset.fs++
}

// Common aspect-ratio for Images:
//  1:1 a square image
//  2:3 has an 500px × 750px, 1500px × 2250px
//  2:3 aspect-ratio: 3 ÷ 2 = 1.5, so you'd drag the slider to 150.
//  3:2 aspect-ratio: 2 ÷ 3 = .667, so you'd type in 66.7 next to the slider.
//  4:3
//  16:9
function setAspectRatio(elMeme) {
    //  NOTE: formula
    //      CH / CW = IH / IW
    //      CW = IH * CH / IW
    //      CH = IH * CW / IW
    const canvasHight = elMeme.naturalHeight * elMeme.offsetWidth / elMeme.naturalWidth
    // elMeme.style.naturalHeight = Math.ceil(canvasHight)

}

// Upload Image // TODO:Save on the GalleryService
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
    console.log(reader.readAsDataURL(ev.target.files[0]));
}

function uploadImg() { // MODEL //  galleryService

}

// Capitalize Arr 
function _capitalizes(keywordsStr) {
    return keywordsStr.slice(0, 3).map(keyword => {
        if (keyword) return (_capitalize(keyword))
    })
        .join(', ')
}

// Capitalize Str 
function _capitalize(word) {
    return word.replace(/^\w/, c => c.toUpperCase())
}