'use strict'

// import galleryService from '../service/gallery.service'
const GALLERY_CONTROLLER = {
    initGalleryController,
    renderGallery,
    renderKeywordsOpts,
    renderKeywordsBtns,
    onUploadImg,
    onSetFilter,
}

// Init GalleryController State On window and render
function initGalleryController(galleryName) {
    !galleryName ? galleryName = 'Image' : galleryName
    GALLERY_SERVICE.setStorageKey(galleryName)
    // · HTML dependencies:
    // datalist#keywords
    // datalist.keyword-container
    // input[name="filter"]
    // ul.gallery-keyword-container
    window.gGalleryController = {
        galleryName,
        elFilterBy: document.querySelector('input[name="gallery-filter"]'),
        elDataList: document.querySelector('datalist#gallery-keyword'),
        elKeywordContainer: document.querySelector('ul.gallery-keyword-container'),
        elGallery: document.querySelector('div.gallery-container'),
    }
}

// Render Gallery + Stat + Upload-Image Opt   
function renderGallery() {
    const { galleryName } = gGalleryController
    const CapitalName = _capitalize(galleryName)
    const imgs = getImgsForDisplay()
    const keyWords = getKeywords()
    const _titleKeywords = (keywords) => keywords.join(' | ')
    // Images template
    const strHTMLs = imgs.map((img, idx) =>
        `<img
        onclick="onImgSelect()"
        onload="onSetAspectRatio(this)"
        data-keyword="${img.keywords}"
        class="gallery-item"
        alt="${CapitalName} #${idx + 1}\n${_capitalizes(img.keywords).join(', ')}"       
        title="${CapitalName} #${idx + 1}\n${_capitalizes(img.keywords).join(' | ')}"
        src=${img.url}>
        `
    )
    // Stat and Upload Image Option
    const foundCount = imgs.length >= 0 ? imgs.length : '0'
    strHTMLs.unshift(`
    <div class="gallery-item gallery-stat">
    <div class="filter-stat">
    <span title="Filtered ${galleryName} count">${foundCount}</span>
    &#47;
    <span title="Total ${CapitalName}s Founds">${getImgsCount()}</span>
    ${CapitalName}s
    </div>
    <p role="button" class="underline" onclick="onClickTotalKeywords(event,this)" title="${_titleKeywords(keyWords)}">${keyWords.length} KeyWords</p>
    <div class="upload-img-container">
    <label onclick="onUploadImg()" class"btn underline" for="Upload Image">
    Upload Image <i class="fa-solid fa-upload"></i>
    </label>
    <input type="file" name="upload-img" onchange="onUploadImg(event)"/>
    </div>
    </div>`
    )
    // Render Gallery
    const { elGallery } = gGalleryController
    elGallery.innerHTML = strHTMLs.join('')
}

// Render on DataList keywords Options
function renderKeywordsOpts() {
    const keywordsCountMap = getOptionsForDisplay()
    const strHTMLs = keywordsCountMap.map(keywordStr =>
        `<option value="${keywordStr}">${_capitalize(keywordStr)}</option>`
    )
    strHTMLs.push(`<option value=" ">ALL</option>`)
    const { elDataList } = gGalleryController
    elDataList.innerHTML = strHTMLs.join('')
}

// Filter
function onSetFilter(str) {
    event.preventDefault()
    const { elFilterBy } = gGalleryController
    !str ? str = elFilterBy.value : str
    elFilterBy.value = str
    setFilter(str)
    renderGallery()
}

// Render common keywords buttons 
function renderKeywordsBtns() {
    const { galleryName } = gGalleryController
    const strHTMLs = getKeywordsForDisplay()
        .map(keyword => `<li>
            <button class="btn btn-keyword"
            title="${keyword[1]} ${keyword[0]} ${_capitalize(galleryName)}s Founds"
            onclick="onClickKeyword()" 
            data-fs="${keyword[1]}"
            value="${keyword[0]}"
            >
            ${keyword[0]}
            </button>
            </li>`)
    const { elKeywordContainer } = gGalleryController
    elKeywordContainer.innerHTML = strHTMLs.join('')
}

// Set filter and UI effect Buttons
function onClickKeyword() {
    const elBtn = event.target
    const { style, dataset, value } = elBtn
    style.color = utilService.getRandomColor()
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
        return `<span role="button" data-pos="modal" class="btn-keyword" onclick="onSetFilter(this.innerText);onTouchModal(true)">${keyword}</span>`
    }).join('')
    openModal(ev, displayKeywords)
}

// TODO:Save on the GalleryService
// Upload Image 
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
    console.log('reader.readAsDataURL(ev.target.files[0]):', reader.readAsDataURL(ev.target.files[0]))
    console.log(reader.readAsDataURL(ev.target.files[0]));
}

// Capitalize STRs 
function _capitalizes(words) {
    return words.slice(0, 3).map(keyword => {
        if (keyword) return (_capitalize(keyword))
    })

}

// Capitalize Str 
function _capitalize(word) {
    return word.replace(/^\w/, c => c.toUpperCase())
}