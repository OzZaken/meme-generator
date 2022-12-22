
import { I18_SERVICE } from "../service/i18.service.js";
import { UTIL_SERVICE } from "../service/util.service.js";

import { GALLERY_CONTROLLER } from "../controller/gallery.controller.js";
import { MEME_CONTROLLER } from "../controller/meme.controller.js";

// Pointer Controller dependencies
let gMainController

// #1 rule: give only What necessary
window.app = { onInit }

// TODO: 01 if user already been in the site welcome back
//       02 LoadingSvg...
function onInit() {
    // Gallery dependencies
    const initGalleryData = {
        galleryName: 'meme',
        elKeywordContainer: document.querySelector('ul.gallery-keyword-container'),
        elGalleryHeading: document.querySelector('h1.gallery-heading'),
        elFilterBy: document.querySelector('[name="gallery-filter"]'),
        elGalleyData: document.querySelector('datalist#gallery-keyword'),
        elGallery: document.querySelector('div.gallery-container'),
        elUploadImg: document.querySelector('#upload-img'),
        renderModal,
    }

    // Meme dependencies 
    const initMemeData = {
        elEditHeading: document.querySelector('h1.edit-heading'),
        elMeme: document.querySelector('#meme'),
        elMemeContainer: document.querySelector('.meme-container'),
        elKeywordsContainer: document.querySelector('.meme-keyword-container'),
        flashMsg,
        getPosOnEl,
    }

    // Set Controller State
    gMainController = {
        audio: {},
        elUserMsg: document.querySelector('.user-msg'),
        elModal: document.querySelector('.modal'),
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
        ...GALLERY_CONTROLLER.init(initGalleryData),
        ...MEME_CONTROLLER.init(initMemeData)
    }

    // Send Dom The App
    // 
    const {
        onSetAspectRatio,
        onClickKeyword,
        onSetFilter,
        onClickTotalKeywords
    } = gMainController
// renderGallery,
// renderKeywordsOpts,
// renderKeywordsBtns,

// onSetFilter,
// onSetAspectRatio,
// onClickKeyword,
// onClickTotalKeywords,
// onAddImg,

    window.app = {
        gMainController, //TODO UT : remember Delete!
        onUploadImg,
        onReLoadPage,
        onTranslateDom,
        onNav,
        onTouchScreen,
        onToggleMenu,
        onTouchModal,
        // Gallery
        onImgSelect,
        onSetFilter,
        onSetAspectRatio,
        onClickKeyword,
        onClickTotalKeywords,
        // Meme
    }

    // Gallery
    gMainController.renderGallery()
    gMainController.elGalleryStatContainer = document.querySelector('.gallery-stat')

    gMainController.renderKeywordsOpts()
    gMainController.renderKeywordsBtns()

    // i18
    I18_SERVICE.setUserDefaultLang(navigator.languages[1])
    const userLang = I18_SERVICE.getLangStr()
    // add class to html and body
    document.documentElement.setAttribute("lang", userLang)
    // Set the right Select on
    //TODO: need on the body? or just set direction to rtl
    document.body.classList.add(userLang)
    document.querySelector('[name="select-lang"]').selectedOptions.value === userLang
    // TODO: // onTranslateDom()

    // User-Msg
    flashMsg('Welcome!')
    setTimeout(() => {
        if (document.body.classList.contains('page-gallery')) flashMsg('Choose Meme Background!')
    }, 5000)
}

// return current click Pos on Element.
function getPosOnEl(ev) {
    const pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    const touchEvs = ['touchstart', 'touchmove', 'touchend']
    if (touchEvs.includes(ev.type)) {
        ev.preventDefault()
        // Take 1 Mobile touch {Pos} in case of multi fingers clicking
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

// location.reload().
function onReLoadPage() {
    location.reload()
}

// i18 - send all the data-tarns (keys) and get from the service the a valueMap.
function onTranslateDom() {
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

// Navigation.
function onNav(navToStr) {
    !navToStr ? navToStr = 'gallery' : navToStr
    const capitalName = UTIL_SERVICE.capitalize(navToStr)

    // Set Mobile menu Bar
    if (document.body.classList.contains('mobile-menu-open')) onToggleMenu()

    // If navigate to Edit without pick image, show nac-back
    const { elEditHeading } = gMainController
    const { elNavBack } = gMainController.links

    if (navToStr === 'edit') {
        const { src } = MEME_SERVICE.getMeme()
        if (!src) {
            elNavBack.hidden = false
            const strHTML = `
           <h2>no image selected!</h2>
            <a class="nav-back" onclick="app.onNav()" title="return to gallery" href="#"></a>
            <p>
            Choose from the the
            <span role="link" data-href="#" class="btn underline" title="return to gallery" onclick="app.onNav()" tabindex="0">
            Gallery
            </span>
            </p>
            <label for="upload-img">Or Choose from Your Device!</label>
            `
            renderModal(false, strHTML)
        }
        else {
            elEditHeading.value = 'Edit Your Meme!'
            setTimeout(() => elEditHeading.style.marginTop = '-15vh', 4000)
        }
    }
    else {
        onTouchScreen()
        elNavBack.hidden = true
    }

    // Set .active class
    const { links } = gMainController
    document.querySelector('.active').classList.remove('active')
    links[`elLink${capitalName}`].classList.add('active')

    // Set body .page-${} class 
    const curClassStr = Object.values(document.body.classList)
        .find(classStr => /page-/.test(classStr))
    document.body.classList.remove(`${curClassStr}`)
    document.body.classList.add(`page-${navToStr}`)

    // Make sure all pages are Hidden apart from current page 
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)
    const { pages } = gMainController
    const elActivePage = pages[`elPage${capitalName}`]
    elActivePage.hidden = false

    playAudio('click')
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

// Mobile Menu ☰.
function onToggleMenu() {
    const { elBtnToggleNav } = gMainController
    document.body.classList.toggle('mobile-menu-open') // notify elScreen 
    elBtnToggleNav.classList.toggle('nav-open') // menuBar animation
}

// Hide Modal.
function onTouchModal(isForceClose) {
    const touchPos = getPosOnEl(event)
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

// User Msg.
function flashMsg(str) {
    const { elUserMsg } = gMainController
    elUserMsg.innerText = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => elUserMsg.classList.remove('user-msg-open'), 3000)
}

// Play audio.
function playAudio(audioKey) {
    const { audio } = gMainController
    if (audio[audioKey]) audio[audioKey].pause()
    return new Promise((resolve, reject) => { // return a promise
        audio[audioKey] = new Audio()         // create audio wo/ src
        audio[audioKey].preload = "auto"    // intend to play through
        audio[audioKey].autoplay = true    // autoplay when loaded
        // onlySong overLoop when loaded
        if (/music/.test(audioKey)) {
            audio[audioKey].loop = true
            audio[audioKey].volume = 0.4
        }
        audio[audioKey].src = `assets/audio/${audioKey}.mp3`
        audio[audioKey].onerror = reject   // on error, reject
        audio[audioKey].onended = resolve  // when done, resolve
    })
}

// Show Modal.
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

// The linking Func between GALLERY to MEME.
function onImgSelect(ev) {
    flashMsg(`Image\n selected!`)

    const isSelectExitImage = ev.type === 'click'
    const isUploadNewImage = ev.type === 'load'

    const memeSrc = isSelectExitImage || isUploadNewImage ? ev.target.src : null
    const memeKeywords = isSelectExitImage ? ev.target.dataset.keyword.split(',') : []

    const meme = {
        src: memeSrc,
        keywords: memeKeywords,
    }

    gMainController.onSetMeme(meme)
    onNav('edit')
}

// Upload new image 
function onUploadImg() {
    let reader = new FileReader()
    reader.onload = (ev) => {
        let img = new Image()
        img.src = ev.target.result
        img.onload = (ev) => onImgSelect(ev)
    }
    reader.readAsDataURL(event.target.files[0])
}