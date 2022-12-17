'use strict'
; (() => {
    console.log('Simania')
})()

function onInit() {
    // MainController 
    window.gMainController = {
        activePageStr: 'gallery',
        isMenuOpen: false,
        audio: {},
        domEls: {
            elUserMsg: document.querySelector('.user-msg'),
            elMainNav: document.querySelector('.main-nav'),
            elBtnToggleNav: document.querySelector('.btn-toggle-menu'),
            links: {
                elLinkGallery: document.querySelector('.link-gallery'),
                elLinkEdit: document.querySelector('.link-edit'),
                elLinkAbout: document.querySelector('.link-about'),
                elLinkSaved: document.querySelector('.link-saved'),
            },
            pages: {
                elPageGallery: document.querySelector('.main-gallery-container'),
                elPageEdit: document.querySelector('.main-editor-container'),
                elPageAbout: document.querySelector('.main-about-container')
            },
            inputs: {
                elImgInput: document.querySelector('input[name="img"]'),
            },
        },
    }
    // Gallery
    initGalleryController('meme')
    renderGallery()
    renderKeywordsOpts()
    renderKeywordsBtns()

    // Meme
    initMemeController()

    // i18
    // setUserDefaultLang()

    // User-Msg
    flashMsg('Welcome!')
    setTimeout(() => {
        if (document.body.classList.contains('page-gallery')) flashMsg('Choose Meme Background!')
    }, 5000)
}

// Navigation
function onNav(navToStr) {
    !navToStr ? navToStr = 'gallery' : navToStr

    // Capitalize using methods 
    const _capitalize = (str) => str[0].toUpperCase() + str.substring(1)

    // Set Mobile menu Bar
    if (document.body.classList.contains('mobile-menu-open')) onToggleMenu()

    // Set .active class
    const { links } = gMainController.domEls
    // Get First (and only) .active class and remove it
    document.querySelector('.active').classList.remove('active')
    // Add .active to current Link Page
    links[`elLink${_capitalize(navToStr)}`].classList.add('active')

    // Set body .page-${} class
    const curClassStr = Object.values(document.body.classList)
        .find(classStr => /page-/.test(classStr))
    document.body.classList.remove(`${curClassStr}`)
    document.body.classList.add(`page-${navToStr}`)

    playAudio('click')

    //TODO: the element need to know when to move with css
    // Hide all pages
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)

    // Reveal current page 
    const { pages } = gMainController.domEls
    const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    elActivePage.hidden = false
}

// Mobile Menu ☰
function onToggleMenu() {
    const { elBtnToggleNav } = gMainController.domEls
    document.body.classList.toggle('mobile-menu-open') // notify elScreen 
    elBtnToggleNav.classList.toggle('nav-open') // menuBar animation
    gMainController.isMenuOpen = !gMainController.isMenuOpen
}

// User Msg 
function flashMsg(str) {
    const { elUserMsg } = gMainController.domEls
    elUserMsg.innerText = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => elUserMsg.classList.remove('user-msg-open'), 3000)
}

// Audio
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

// The linking Func between  
// Input from Gallery Controller
//   ↨
// OutPut to Meme Service 
function onImgSelect() {
    const meme = {
        imgSrc: event.target.src,
        keywords: event.target.dataset.keyword.split(','),
    }
    flashMsg(`Image\n selected.`)
    onNav('edit')
    setMeme(meme) 
    renderMeme()
}