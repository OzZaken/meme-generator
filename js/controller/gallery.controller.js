import { GALLERY_SERVICE } from "../service/gallery.service.js"
import { UTIL_SERVICE } from '../service/util.service.js'

export const GALLERY_CONTROLLER = {
    initGalleryController,
    renderGallery,
    renderKeywordsOpts,
    renderKeywordsBtns,
    onSetFilter,
    onSetAspectRatio,
    onClickKeyword,
    onClickTotalKeywords,
}

// Dependencies reference pointer 
let gGallery

// Init GalleryController State On window and render
function initGalleryController(args) {
    const { galleryName: name } = args
    let galleryName
    !name ? galleryName = 'image' : galleryName
    GALLERY_SERVICE.setGalleryStorageKey(galleryName)
    gGallery = {
        ...args,
        elKeywordContainer: document.querySelector('ul.gallery-keyword-container'),
        elFilterBy: document.querySelector('input[name="gallery-filter"]'),
        elGalleyData: document.querySelector('datalist#gallery-keyword'),
    }
    return gGallery
}

// Render Gallery + Stat + Upload-Image Opt   
function renderGallery() {
    const { elGallery, galleryName, elGalleryHeading } = gGallery
    elGalleryHeading.innerHTML = '<h1>choose meme background!</h1>'
    const CapitalName = UTIL_SERVICE.capitalize(galleryName)
    const imgs = GALLERY_SERVICE.getImgsForDisplay()
    const keyWords = GALLERY_SERVICE.getKeywords()
    // Images template
    const strHTMLs = imgs.map((img, idx) => {
        return `
        <img
        onclick="app.onImgSelect(event)"
        onload="app.onSetAspectRatio(this)"
        data-keyword="${img.keywords}"
        class="gallery-item"
        alt="${CapitalName} #${idx + 1}\n${UTIL_SERVICE.capitalizes(img.keywords).join(' | ')}"       
        title="${CapitalName} #${idx + 1}\n${UTIL_SERVICE.capitalizes(img.keywords).join(' | ')}"
        src=${img.url}>
        `
    })
    // Stat and Upload Image Option
    const foundCount = imgs.length >= 0 ? imgs.length : '0'
    strHTMLs.unshift(`
    <div class="gallery-item gallery-stat">
    <button role="button" class="underline" onclick="app.onClickTotalKeywords(event,this)" title="${keyWords.join(' | ')}">
    ${keyWords.length} KeyWords
    </button>
    <div class="filter-stat">
    <span title="Filtered ${galleryName} count">${foundCount}</span>
    &#47;
    <span title="Total ${CapitalName}s founds">${GALLERY_SERVICE.getImgsCount()}</span>
    ${CapitalName}s
    </div>
    <label for="upload-img">Upload Image</label>
    <input type="file" id="upload-img" name="upload-img" onchange="app.onUploadImg(event)"/>
    </div>
    `)
    // Render Gallery
    elGallery.innerHTML = strHTMLs.join('')
}

// Render on DataList keywords Options
function renderKeywordsOpts() {
    const keywordsCountMap = GALLERY_SERVICE.getOptionsForDisplay()
    const strHTMLs = keywordsCountMap.map(keywordStr => {
        return `<option value="${keywordStr}">${UTIL_SERVICE.capitalize(keywordStr)}</option>`
    })
    strHTMLs.push(`<option value=" ">Show All Images</option>`)
    const { elGalleyData } = gGallery
    elGalleyData.innerHTML = strHTMLs.join('')
}

// Filter
function onSetFilter(str) {
    event.preventDefault()
    const { elFilterBy } = gGallery
    !str ? str = elFilterBy.value : str
    elFilterBy.value = str === ' ' ? null : str
    GALLERY_SERVICE.setFilter(str)
    renderGallery()
}

// Calc how menyKeywords btns can put with the with of the userDeisplay
// TODO: Render common keywords buttons based Space left
// console.log(`UT:window.innerWidth:\n${window.innerWidth}`)
// console.log(`body.offsetWidth:\n${document.body.offsetWidth}`)
function renderKeywordsBtns() {
    const { galleryName } = gGallery
    const strHTMLs = GALLERY_SERVICE.getKeywordsForDisplay()
        .map(keyword => `<li>
            <button class="btn btn-keyword"
            title="${keyword[1]} ${keyword[0]} ${UTIL_SERVICE.capitalize(galleryName)}s Founds"
            onclick="app.onClickKeyword()" 
            data-fs="${keyword[1]}"
            value="${keyword[0]}">
            ${keyword[0]}
            </button>
            </li>`)
    const { elKeywordContainer } = gGallery
    elKeywordContainer.innerHTML = strHTMLs.join('')
}

// Set filter and UI effect Buttons
function onClickKeyword() {
    const elBtn = event.target
    const { style, dataset, value } = elBtn
    style.color = UTIL_SERVICE.getRandomColor()
    onSetFilter(value)
    if (+dataset.fs >= 16) return
    dataset.fs++
}

// Set aspect-ratio CSS on Gallery 
function onSetAspectRatio(el) {
    el.style.aspectRatio = `${el.naturalWidth}/${el.naturalHeight}`
}

// openModal with All Keywords 
function onClickTotalKeywords(ev, elBtnKeywordsContainer) {
    const { title } = elBtnKeywordsContainer
    const displayKeywords = title.split(' | ').map(keyword => {
        return `<span role="button" data-pos="modal" class="btn-keyword" onclick="app.onSetFilter(this.innerText);app.onTouchModal(true)">${keyword}</span>`
    }).join('')
    gGallery.renderModal(ev, displayKeywords)
}