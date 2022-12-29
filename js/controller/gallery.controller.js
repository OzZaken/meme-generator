import { GALLERY_SERVICE } from "../service/gallery.service.js"
import { UTIL_SERVICE } from '../service/util.service.js'


export const GALLERY_CONTROLLER = {
    init,
    onSetFilter,
    onSetLayout,
    renderGallery,
}

let gGallery

// Init State
function init(args) {
    // Set Gallery Name in case of more then one gallery in the App 
    !args.galleryName ? args.galleryName = 'image' : args.galleryName
    GALLERY_SERVICE.setGalleryStorageKey(args.galleryName)
    gGallery = {
        ...args,
        onSetFilter,
        onSetLayout,
        renderGallery,
    }
    return gGallery
}

// Render Gallery + Stat and Upload-Image Opt   
function renderGallery() {
    const { elGallery, galleryName, elGalleryHeading } = gGallery
    elGalleryHeading.innerText = 'choose meme background!'
    const CapitalName = UTIL_SERVICE.capitalize(galleryName)
    const imgs = GALLERY_SERVICE.getImgsForDisplay()
    const keyWords = GALLERY_SERVICE.getKeywords()
    // Images template
    const strHTMLs = imgs.map((img, idx) => {
        return `<a role="article" 
        href="#"
        class="gallery-item">
        <img
        onclick="app.onImgSelect(event)"
        onload="app.onSetLayout(this)"
        data-keyword="${img.keywords}"
        alt="${CapitalName} #${idx + 1}\n${UTIL_SERVICE.capitalizes(img.keywords).join(' | ')}"       
        title="${CapitalName} #${idx + 1}\n${UTIL_SERVICE.capitalizes(img.keywords).join(' | ')}"
        src=${img.url}>
        </a>
        `})
    // Stat and Upload Image Option
    const foundCount = imgs.length >= 0 ? imgs.length : '0'
    strHTMLs.unshift(`
    <div class="gallery-item gallery-stat">
    <button class="underline" onclick="app.onShowKeywords()" data-keyword="${keyWords.join('')}" title="${keyWords.join(' | ')}">
    ${keyWords.length} KeyWords
    </button>
    <div class="filter-stat">
    <span title="Filtered ${galleryName} count">${foundCount}</span>
    &#47;
    <span title="Total ${CapitalName}s founds">${GALLERY_SERVICE.getImgsCount()}</span>
    ${CapitalName}s
    </div>
    <label for="upload-img">Upload Image</label>
    </div>
    `)
    // Render Gallery
    elGallery.innerHTML = strHTMLs.join('')
}

// Filter
function onSetFilter() {
    event.preventDefault()
    let str = event.target.value
    const { elFilterBy } = gGallery
    !str ? str = elFilterBy.value : str
    elFilterBy.value = str === ' ' ? '' : str
    GALLERY_SERVICE.setFilter(str)
    renderGallery()
}

// Set Grid-items Layout 
function onSetLayout(img) {
    const { naturalWidth, naturalHeight, parentElement } = img
    const width = naturalWidth
    const height = naturalHeight
    const elGridItem = parentElement
    const { style } = elGridItem
    style.width = width
    style.height = width

    // Square Image 2 row 2 column 
    if (width === height) {
        elGridItem.dataset.gallerySize = 'img-square'
        img.title += '\nSquare Image'
        style.gridColumn = `3 / 1`
        style.gridRows = `3 / 1`
        img.style.aspectRatio = '1 / 1'
    }
    // Horizontal Image 2 row 1 column 
    else if (width > height && Math.ceil(width / height) > 2) {
        elGridItem.dataset.gallerySize = 'img-horizontal'
        img.title += '\nHorizontal Image'
        style.gridColumn = `${Math.ceil(width / height)} / 1`
        style.gridRows = `1 / 1`
    }
    // Vertical Image 2 row 1 column 
    else if (height > width) {
        elGridItem.dataset.gallerySize = 'img-vertical'
        img.title += '\nVertical Image'
        style.gridColumn = `1 / 1` //span 1
        style.gridRows = ` 3 / 1`
    }
    else { // TODO: take only the column and the row you need
        style.gridRows = `auto / span 1`
        style.gridColumn = `auto / span 1`
    }
}

function onAddImg(src) {
    GALLERY_SERVICE.createImage(src)
}