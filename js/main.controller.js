import { UTIL_SERVICE } from "./service/util.service.js"
import { I18_SERVICE } from "./service/i18.service.js"
import { GALLERY_SERVICE } from "./service/gallery.service.js"
import { GALLERY_CONTROLLER } from "./controller/gallery.controller.js"
import { MEME_SERVICE } from "./service/meme.service.js"
import { MEME_CONTROLLER } from "./controller/meme.controller.js"

export const MAIN_CONTROLLER = {
    onImgSelect,
    getPos,
    renderModal,
    renderMsg,
}

let gMainController

window.app = { onInit }

function onInit() {
    const { onSetFilter, onSetLayout } = GALLERY_CONTROLLER
    const { onSetMeme, onSetTxt, onAddTxt, onFocusTxt, onSetColor, onUploadImg } = MEME_CONTROLLER
    // Configuration: app
    window.app = {
        onImgInput,
        onTranslate,
        onNav,
        onTouchScreen,
        onToggleMenu,
        onTouchModal,
        onImgSelect,
        onClickKeyword,
        onShowKeywords,
        // Gallery
        onSetFilter,
        onSetLayout,
        // Meme
        onSetMeme,
        onSetTxt,
        onAddTxt,
        onFocusTxt,
        onSetColor,
        onUploadImg,
    }
    // Gallery
    const initGalleryData = {
        galleryName: 'meme',
        elKeywordContainer: document.querySelector('ul.btns-keyword-container'),
        elGalleryHeading: document.querySelector('h1.gallery-heading'),
        elFilterBy: document.querySelector('[name="gallery-filter"]'),
        elGalleyData: document.querySelector('datalist#gallery-keyword'),
        elGallery: document.querySelector('div.gallery-container'),
        elUploadImg: document.querySelector('#load-img'),
    }
    // Meme 
    const initMemeData = {
        elEditHeading: document.querySelector('h1.edit-heading'),
        elModal: document.querySelector('.modal'),
        elMeme: document.querySelector('#meme'),
        elMemeContainer: document.querySelector('.meme-container'),
        elKeywordsContainer: document.querySelector('.meme-keyword-container'),
    }
    // Set Global State
    gMainController = {
        audio: {},
        elUserMsg: document.querySelector('.user-msg'),
        elMainNav: document.querySelector('.main-nav'),
        elBtnToggleNav: document.querySelector('.btn-toggle-menu'),
        links: {
            elLinkGallery: document.querySelector('.link-gallery'),
            elLinkEdit: document.querySelector('.link-edit'),
            elLinkAbout: document.querySelector('.link-about'),
            elLinkSaved: document.querySelector('.link-saved'),
            elNavBack: document.querySelector('.nav-back'),
        },
        pages: {
            elPageGallery: document.querySelector('.main-gallery-container'),
            elPageEdit: document.querySelector('.main-edit-container'),
            elPageAbout: document.querySelector('.main-about-container')
        },
        elAboutHeading: document.querySelector('.about-heading'),
        ...GALLERY_CONTROLLER.init(initGalleryData),
        ...MEME_CONTROLLER.init(initMemeData)
    }

    _loadGallery()

    // i18
    I18_SERVICE.setUserDefaultLang(navigator.languages[1])
    const userLang = I18_SERVICE.getLangStr()
    // add class to html and body
    document.documentElement.setAttribute("lang", userLang)
    document.body.classList.add(userLang)
    document.querySelector('[name="select-lang"]').selectedOptions.value = userLang
    onTranslate()

    // Count Visits
    const visits = parseInt(localStorage.getItem('visits'))
    if (!visits) {
        renderMsg(`<span>&nbspFirst&nbsp</span> time Welcome!`)
        localStorage.setItem('visits', 1)
    }
    else {
        renderMsg(`Welcome <span>&nbsp${visits + 1}&nbsp</span> Times back!`)
        localStorage.setItem('visits', visits + 1)
    }

    setTimeout(() => {
        if (document.body.classList.contains('page-gallery')) renderMsg('Choose Meme Background!')
    }, 5000)

    // set select options font equal to the option
    const elFontSelect = document.querySelector('[data-key="family"]')
    new Array(...elFontSelect.options).forEach(option => option.style.fontFamily = option.value)
}

// render Gallery Using Debounce & TimeOut  
function _loadGallery() {
    gMainController.elGallery.innerHTML = `<svg class="gallery-loading" width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill="#fff">
    <circle cx="12.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="0s" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
        <animate attributeName="fill-opacity"
         begin="100ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="300ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="600ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="800ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="400ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="12.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="700ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="500ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="200ms" dur="1s"
         values="1.21" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
</svg>
`.repeat(5)
    setTimeout(() => {
        gMainController.renderGallery()
        gMainController.elGalleryStatContainer = document.querySelector('.gallery-stat')
        renderOpts()
        renderKeywordsBtns()
       
        // Using Debounce 
        const { onSetFilter } = GALLERY_CONTROLLER
        const { elFilterBy } = gMainController
        elFilterBy.addEventListener('input', UTIL_SERVICE.debounce(onSetFilter, 1500))
    }, 1500)
}

// i18 - send all the data-tarns (keys) and get from the service the a valueMap.
function onTranslate() {
    console.log('Translate');
    // const elsText = document.querySelectorAll('[data-trans]')
    // elsText.forEach(el => {
    //     el.innerText = gTrans[el.dataset.trans][gUserLang]
    // })
    // const elsPlaceholder = document.querySelectorAll('[data-placeholdertrans]')
    // elsPlaceholder.forEach(el => {
    //     el.placeholder = gTrans[el.dataset.placeholdertrans][gUserLang]
    // })
    // const elsTitle = document.querySelectorAll('[data-titletrans]')
    // elsTitle.forEach(el => {
    //     el.title = gTrans[el.dataset.titletrans][gUserLang]
    // })
}

// Set filter and UI effect Buttons
function onClickKeyword() {
    const elBtn = event.target
    const { style, dataset, value } = elBtn
    style.color = UTIL_SERVICE.getRandomColor()
    GALLERY_CONTROLLER.onSetFilter(value)
    if (+dataset.fs >= 16) return
    dataset.fs++
}

// openModal with All Keywords 
function onShowKeywords() {
    const { dataKeyword } = document.querySelector('.btns-keyword-container')
    const displayKeywords = dataKeyword.split(', ').map(keyword => {
        return `<span role="button" data-pos="modal" class="btn-keyword" onclick="app.onSetFilter(this.innerText)app.onTouchModal(true)">${keyword}</span>`
    }).join('')
    renderModal(event, displayKeywords)
}

// Play audio.
function onPlayAudio(audioKey) {
    const { audio } = gMainController
    if (audio[audioKey]) {
        audio[audioKey].pause()
        audio[audioKey] = null
    }
    return new Promise((resolve, reject) => { // return a promise
        audio[audioKey] = new Audio()         // create audio wo/ src
        audio[audioKey].preload = "auto"    // intend to play through
        audio[audioKey].autoplay = true    // autoplay when loaded
        audio[audioKey].src = `assets/audio/${audioKey}.mp3`
        audio[audioKey].onerror = reject   // on error, reject
        audio[audioKey].onended = resolve  // when done, resolve
    })
}

// Handle navigation
function onNav(pageStr) {
    !pageStr ? pageStr = 'gallery' : pageStr
    const capitalName = UTIL_SERVICE.capitalize(pageStr)

    // Set Mobile menu Bar
    if (document.body.classList.contains('mobile-menu-open')) onToggleMenu()

    // If navigate to Edit without pick image nav-back
    const { elEditHeading } = gMainController
    const { elNavBack } = gMainController.links

    if (pageStr === 'edit') {
        const { src } = MEME_SERVICE.getMeme()
        if (!src) {
            elNavBack.hidden = false
            const strHTML = `
            <h2>no image selected!</h2>
                <a class="nav-back" onclick="app.onNav()" title="return to gallery" href="#"></a>
                <p>Choose from the the
                <span role="link" data-href="#" class="btn underline" title="return to gallery" onclick="app.onNav()" >
                Gallery
                </span>
                </p>
                <label for="load-img">We Recommended Uploads Your Image!</label>
                `
            renderModal(false, strHTML)
        }
        else elEditHeading.value = 'Edit Your Meme!'
    }
    else {
        onTouchScreen()
        elNavBack.hidden = true
    }

    // Set .active class on App Main Nav
    const { links } = gMainController
    document.querySelector('.active').classList.remove('active')
    links[`elLink${capitalName}`].classList.add('active')

    // Set body .page-${} class 
    const curClassStr = Object.values(document.body.classList).find(classStr => /page-/.test(classStr))
    document.body.classList.remove(`${curClassStr}`)
    document.body.classList.add(`page-${pageStr}`)

    // Ensuring all pages are Hidden apart from current page 
    document.querySelectorAll('.page').forEach(elPage => elPage.hidden = true)
    const { pages } = gMainController
    pages[`elPage${capitalName}`].hidden = false

    // Set Heading animation
    const elClass = document.querySelector('.fade-out-up')
    if (elClass) elClass.classList.remove('fade-out-up')
    setTimeout(() => {
        gMainController[`el${capitalName}Heading`].classList.add('fade-out-up')
    }, 2000)

    onPlayAudio('click')
}

// Mobile Menu ☰.
function onToggleMenu() {
    const { elBtnToggleNav } = gMainController
    document.body.classList.toggle('mobile-menu-open') // notify elScreen 
    elBtnToggleNav.classList.toggle('nav-open') // menuBar animation
}

// Black screen.
function onTouchScreen() {
    event.stopPropagation()
    if (document.body.classList.contains('mobile-menu-open')) {
        onToggleMenu()
        return
    }
    onTouchModal(true)
}

// Hide Modal.
function onTouchModal(isForceClose) {
    const touchPos = getPos(event)
    if (isForceClose || // click on X
        touchPos.x <= 30 && touchPos.y <= 36) {
        const { elModal } = gMainController
        // set Modal pos
        const { style } = elModal
        style.left = '-101vw'
        style.top = '-101vh'
        // Notify screen  
        document.body.classList.remove('modal-open')
    }
}

// Render DataList keywords Options
function renderOpts() {
    const keywordsCountMap = GALLERY_SERVICE.getOptionsForDisplay()
    const strHTMLs = keywordsCountMap.map(keywordStr => {
        return `<option value="${keywordStr}">${UTIL_SERVICE.capitalize(keywordStr)}</option>`
    })
    const { elGalleyData } = gMainController
    elGalleyData.innerHTML = strHTMLs.join('')
}

// render Buttons
function renderKeywordsBtns() {
    const { galleryName } = gMainController
    const strHTMLs = GALLERY_SERVICE.getKeywordsForDisplay()
        .map(keyword => `<li>
            <button class="btn btn-keyword"
            title="${keyword[1]} ${keyword[0]} ${UTIL_SERVICE.capitalize(galleryName)}s Founds"
            onclick="app.onClickKeyword()" 
            data-fs="${keyword[1]}"
            value="${keyword[0]}">
            ${keyword[0]}
            </button>
            </li>
            `)
    const { elKeywordContainer } = gMainController
    elKeywordContainer.innerHTML = strHTMLs.join('')
}

// load Image.
function onImgInput() {
    loadImageFromInput(event, onImgSelect)
}

function loadImageFromInput(ev, onImgSelect) {
    // document.querySelector('.share-container').innerHTML = ''
    const reader = new FileReader()
    reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        // bind the onload event handler to the onImageReady callback function
        img.onload = onImgSelect.bind(null, img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

//  linking Func between GALLERY to MEME.
function onImgSelect() {
    renderMsg(`Image\n selected!`)
    const src = event.target.src
    const meme = {
        src,
        keywords: GALLERY_SERVICE.getImgKeyword(src),
    }
    MEME_CONTROLLER.onSetMeme(meme)
    if (document.body.classList.contains('page-edit')) return
    onNav('edit')
}

// return current click Pos on Element.
function getPos() {
    const pos = {
        x: event.offsetX,
        y: event.offsetY
    }
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    if (touchEvs.includes(event.type)) {
        event.preventDefault()
        // Take 1 Mobile touch {Pos} in case of multi fingers clicking
        event = event.changedTouches[0]
        pos = {
            x: event.pageX - event.target.offsetLeft,
            y: event.pageY - event.target.offsetTop
        }
    }
    return pos
}

// Modal.
function renderModal(ev, strHTML) {
    const { elModal } = gMainController
    // if !ev Set modal pos in center of viewPort
    const { style } = elModal
    if (!ev) {
        style.top = '50%'
        style.left = '50%'
        style.transform = 'translate(-50%, -50%)'
        style.minWidth = window.innerWidth / 2
    }
    else {
        const { clientX, clientY } = ev
        style.top = `${clientY}px`
        style.left = `${clientX}px`
    }
    // Set txt 
    elModal.innerHTML = strHTML
    // Notify screen  
    document.body.classList.add('modal-open')
}

// User-Msg.
function renderMsg(str) {
    const { elUserMsg } = gMainController
    elUserMsg.innerHTML = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => elUserMsg.classList.remove('user-msg-open'), 3000)
}