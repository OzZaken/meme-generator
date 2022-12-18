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
    console.log(`🚀 ~ imgs`, imgs)

    const keyWords = getKeywords()
    const titleKeywords = (keywords) => keywords.join(' | ')


    // Images template
    const strHTMLs = imgs.map((img, idx) => `<img
        onclick="onImgSelect()" 
        onload="onSetAspectRatio(this)"
        data-keyword="${img.keywords}"
        class="gallery-img-container"
        alt="${CapitalName} #${idx + 1}\n${_capitalizes(img.keywords).join(', ')}"       
        title="${CapitalName} #${idx + 1}\n${_capitalizes(img.keywords).join(' | ')}"
        src=${img.url}>`)

    // Stats and Upload Image Option
    const foundCount = imgs.length >= 0 ? imgs.length : '0'
    strHTMLs.unshift(`
    <div class="gallery-img-container gallery-stat">
    <span title="Filtered ${galleryName} count">${foundCount}</span>
    &#47;
    <span title="Total ${CapitalName}s Founds">${getImgsCount()}</span>
    ${CapitalName}s
    <p title="${titleKeywords(keyWords)}">${keyWords.length} KeyWords</p>
    <p>upload New Image!</p>
    <input type="file" name="img" onchange="onUploadImg(event)"/>
    </div
    >`)

    // render Gallery
    const { elGallery } = gGalleryController
    elGallery.innerHTML = strHTMLs.join('')
}

// Render on DataList keywords Options
function renderKeywordsOpts() {
    const keywordsCountMap = getOptionsForDisplay()
    console.log(`🚀 ~ keywordsCountMap`, keywordsCountMap)
    const strHTMLs = keywordsCountMap.map(keywordStr =>
        `<option value="${keywordStr}">${_capitalize(keywordStr)}</option>`
    )
    strHTMLs.push(`<option value=" ">ALL</option>`)
    const { elDataList } = gGalleryController
    elDataList.innerHTML = strHTMLs.join('')
}

// Filter
function onSetFilter(str) {
    // Give Option for emptySpace
    !str || str === ' ' ? str = '' : str
    const { elFilterBy } = gGalleryController
    elFilterBy.value = str
    setFilter(str) // MODEL - GalleryService.
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
    const {style, dataset, value} = elBtn
    style.color = utilService.getRandomColor()
    onSetFilter(value)
    if (+dataset.fs >= 16) return
    dataset.fs++
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
    console.log('reader.readAsDataURL(ev.target.files[0]):', reader.readAsDataURL(ev.target.files[0]))
    console.log(reader.readAsDataURL(ev.target.files[0]));
}