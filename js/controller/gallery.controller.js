'use strict'

// import galleryService from '../service/gallery.service'
// * Opt Give the Service initialize Data
// const initializeImgs = {
//     imgCount: 25,
//     fileType: 'jpg',
//     path: 'assets/img/gallery/',
//     keywords: [
//         [
//             "view",
//             "dance"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "dog",
//             "cute"
//         ],
//         [
//             "baby",
//             "angry"
//         ],
//         [
//             "dog",
//             "baby",
//             "cute"
//         ],
//         [
//             "cute",
//             "cat"
//         ],
//         [
//             "celeb"
//         ],
//         [
//             "funny",
//             "baby"
//         ],
//         [
//             "celeb"
//         ],
//         [
//             "angry",
//             "celeb"
//         ],
//         [
//             "celeb"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "funny",
//             "dance"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "baby",
//             "surprised"
//         ],
//         [
//             "funny",
//             "dog"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "celeb"
//         ],
//         [
//             "celeb",
//             "angry"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "funny",
//             "celeb"
//         ],
//         [
//             "celeb"
//         ],
//         [
//             "celeb",
//             "angry"
//         ],
//         [
//             "funny",
//             "celeb"
//         ]
//     ],
// }
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
    // · HTML dependencies:
    // datalist#keywords
    // datalist.keyword-container
    // input[name="filter"]
    // ul.gallery-keywords-container
    !galleryName ? galleryName = 'Image' : galleryName
    GALLERY_SERVICE.setStorageKey(galleryName)
    window.gGalleryController = {
        galleryName,
        elFilterBy: document.querySelector('input[name="gallery-filter"]'),
        elDataList: document.querySelector('datalist#gallery-keywords'),
        elKeywordContainer: document.querySelector('ul.gallery-keywords-container'),
        elGallery: document.querySelector('div.gallery-container'),
    }
}

// Render Gallery + Filter-stat + Upload-image   
function renderGallery() {
    const { galleryName } = gGalleryController
    const imgs = getImgsForDisplay()

    // Images template
    const strHTMLs = imgs.map((img, idx) => `
        <img onclick="onImgSelect()" 
        onload="onSetAspectRatio(this)"
        data-keyword="${img.keywords}"
        class="gallery-img-container"
        src=${img.url}
        alt="${_capitalize(galleryName)} #${idx + 1}\n${_capitalizes(img.keywords).join(', ')}"       
        title="${_capitalize(galleryName)} #${idx + 1}\n${_capitalizes(img.keywords).join(', ')}">
        `
    )

    // Stats and Upload image Option
    const foundCount = imgs.length >= 0 ? imgs.length : '0'
    strHTMLs.unshift(`
    <div class="gallery-img-container gallery-stat">
    <span title="filtered ${galleryName} count">${foundCount}</span>
    &#47;
    <span title="Total ${_capitalize(galleryName)}s Founds">${getImgsCount()}</span>
    <p>Upload New ${_capitalize(galleryName)}!</p>
    <input type="file" name="img" onchange="onUploadImg(event)"/>
    </div>
    `)

    // render Gallery
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
    !str || str === ' ' ? str = '' : str
    // Give Option for emptySpace
    const { elFilterBy } = gGalleryController
    elFilterBy.value = str

    setFilter(str) // MODEL - GalleryService.
    renderGallery()  // DOM
}

// Render keywords buttons based sorted options 
function renderKeywordsBtns() {
    const { galleryName } = gGalleryController
    const strHTMLs = getKeywordsForDisplay()
        .map(keyword =>
            `<li>
            <button class="btn btn-keyword"
            title="${keyword[1]} ${_capitalize(galleryName)}s Founds"
             onclick="onClickFilterKeyword(event,this)" 
            data-fs="${keyword[1]}">${keyword[0]}
            </button>
            </li>`
        )
    const { elKeywordContainer } = gGalleryController
    elKeywordContainer.innerHTML = strHTMLs.join('')
}

// Set filter and UI effect Buttons
function onClickFilterKeyword(ev, elKeyWord) {
    const { dataset, innerText } = elKeyWord
    ev.preventDefault()
    elKeyWord.style.color = utilService.getRandomColor()
    onSetFilter(innerText)
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