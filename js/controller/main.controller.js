
import { I18_SERVICE } from "../service/i18.service.js";
import { UTIL_SERVICE } from "../service/util.service.js";

import { GALLERY_CONTROLLER } from "../controller/gallery.controller.js";
import { MEME_CONTROLLER } from "./meme.controller.js";
import { GALLERY_SERVICE } from "../service/gallery.service.js";

let gMainController

window.app = { onInit }

function onInit() {
    // Gallery dependencies
    const initGalleryData = {
        galleryName: 'meme',
        elKeywordContainer: document.querySelector('ul.btns-keyword-container'),
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
        flashMsg: renderMsg,
        getPos,
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
        elAboutHeading: document.querySelector('.about-heading'),
        ...GALLERY_CONTROLLER.init(initGalleryData),
        ...MEME_CONTROLLER.init(initMemeData)
    }

    // Take what necessary from the App to the Dom. 
    const {
        // GALLERY_CONTROLLER
        onSetLayout,
        onSetFilter,
        // MEME_CONTROLLER
        onSetMeme,
    } = gMainController

    window.app = {
        gMainController, //TODO UT : remember Delete!
        onUploadImg,
        onTranslateDom,
        onNav,
        onTouchScreen,
        onToggleMenu,
        onTouchModal,
        onClickKeyword,
        onImgSelect,
        onClickKeyword,
        onClickTotalKeywords,
        // Gallery
        onSetFilter,
        onSetLayout,
        // Meme
        onSetMeme,
    }

    // Pretend Latency 
    _showGallery()

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

    // Count Visits
    const visits = parseInt(localStorage.getItem('visits'))
    if (!visits) {
        renderMsg(`<span>&nbsp;First&nbsp;</span> time Welcome!`)
        localStorage.setItem('visits', 1)
    }
    else {
        renderMsg(`Welcome <span>&nbsp;${visits + 1}&nbsp;</span> Times back!`)
        localStorage.setItem('visits', visits + 1)
    }

    setTimeout(() => {
        if (document.body.classList.contains('page-gallery')) renderMsg('Choose Meme Background!')
    }, 5000)

    // set select options font equal to the option
    const elFontSelect = document.querySelector('[data-font="onFamily"]')
    new Array(...elFontSelect.options).forEach(option => {
        option.style.fontFamily = option.value
    })
}
function _showGallery() {
    gMainController.elGallery.innerHTML = `<svg class="gallery-loading" width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill="#fff">
    <circle cx="12.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="0s" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
        <animate attributeName="fill-opacity"
         begin="100ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="300ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="600ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="800ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="400ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="12.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="700ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="500ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="200ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
</svg>
`.repeat(20)
    // Gallery
    setTimeout(() => {
        gMainController.renderGallery()
        gMainController.elGalleryStatContainer = document.querySelector('.gallery-stat')
        renderKeywordsOpts()
        renderKeywordsBtns()
    }, 3000)
}
// Render on DataList keywords Options
function renderKeywordsOpts() {
    const keywordsCountMap = GALLERY_SERVICE.getOptionsForDisplay()
    const strHTMLs = keywordsCountMap.map(keywordStr => {
        return `<option value="${keywordStr}">${UTIL_SERVICE.capitalize(keywordStr)}</option>`
    })
    const { elGalleyData } = gMainController
    elGalleyData.innerHTML = strHTMLs.join('')
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

// Handle navigation
function onNav(navToStr) {
    !navToStr ? navToStr = 'gallery' : navToStr
    const capitalName = UTIL_SERVICE.capitalize(navToStr)

    // Set Mobile menu Bar
    if (document.body.classList.contains('mobile-menu-open')) onToggleMenu()

    // If navigate to Edit without pick image nav-back
    const { elEditHeading } = gMainController
    const { elNavBack } = gMainController.links

    if (navToStr === 'edit') {
        const { src } = gMainController.getMeme()
        if (!src) {
            elNavBack.hidden = false
            const strHTML = `<h2>no image selected!</h2>
                <a class="nav-back" onclick="app.onNav()" title="return to gallery" href="#"></a>
                <p>Choose from the the
                <span role="link" data-href="#" class="btn underline" title="return to gallery" onclick="app.onNav()" tabindex="0">
                Gallery
                </span>
                </p>
                <label for="upload-img">We Recommended Uploads Your Image!</label>`
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
    document.body.classList.add(`page-${navToStr}`)

    // Make sure all pages are Hidden apart from current page 
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)
    const { pages } = gMainController
    const elActivePage = pages[`elPage${capitalName}`]
    elActivePage.hidden = false

    // Set Heading animation
    const elActiveHeading = gMainController[`el${capitalName}Heading`]
    const elClass = document.querySelector('.fade-out-up')
    if (elClass) elClass.classList.remove('fade-out-up')
    setTimeout(() => elActiveHeading.classList.add('fade-out-up'), 2000)

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

// User Msg.
function renderMsg(str) {
    const { elUserMsg } = gMainController
    elUserMsg.innerHTML = str
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

//  linking Func between GALLERY to MEME.
function onImgSelect(ev) {
    renderMsg(`Image\n selected!`)

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

// Set filter and UI effect Buttons
function onClickKeyword() {
    const elBtn = event.target
    const { style, dataset, value } = elBtn
    style.color = UTIL_SERVICE.getRandomColor()
    gMainController.onSetFilter(value)
    if (+dataset.fs >= 16) return
    dataset.fs++
}

// openModal with All Keywords 
function onClickTotalKeywords() {
    const { dataKeyword } =  document.querySelector('.btns-keyword-container')
    const displayKeywords = dataKeyword.split(', ').map(keyword => {
        return `<span role="button" data-pos="modal" class="btn-keyword" onclick="app.onSetFilter(this.innerText);app.onTouchModal(true)">${keyword}</span>`
    }).join('')
    renderModal(event, displayKeywords)
}

// console.log(`body.offsetWidth:\n${document.body.offsetWidth}`)
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

// function doUploadImg(imgDataUrl, onSuccess) {
//     const formData = new FormData()
//     formData.append('img', imgDataUrl)

//     fetch('//ca-upload.com/here/upload.php', {
//         method: 'POST',
//         body: formData
//     })
//         .then(res => res.text())
//         .then((url) => {


//             console.log('Got back live url:', url)
//             onSuccess(url)
//         })
//         .catch((err) => {
//             console.error(err)
//         })
// }