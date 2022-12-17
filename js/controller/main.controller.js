'use strict'

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

    //* Meme
    // initMemeController()

    // i18
    // setUserDefaultLang()

    // User-Msg
    flashMsg('Welcome!')
    setTimeout(() => {
        const { elLinkGallery, activePageStr } = gMainController.domEls.links
        if (document.body.classList.contains('active')) flashMsg('Choose Meme Background!')
        // if (activePageStr === 'gallery') flashMsg('Choose Meme Background!')
        // if (elLinkGallery.classList.contains('active')) flashMsg('Choose Meme Background!')
    }, 5000)
}
; (() => {
    console.log('🐱‍👤')
})()

// Navigation
function onNav(navToStr) {
    const pageClassStrs = Object.keys(document.body.classList) // TODO: filter using regex
    console.log(`🚀 ~ pageClassStrs`, pageClassStrs)
    const curClassStr = pageClassStrs.find(classStr => /page-/.test(classStr))

    console.log(`🚀 ~ curPageStr`, curClassStr)
    if (!navToStr) navToStr = 'gallery'
    if (document.body.classList.contains('mobile-menu-open')) onToggleMenu()
    const _capitalize = (str) => str[0].toUpperCase() + str.substring(1)

    // Get First (and only) .active class and remove it
    document.querySelector('.active').classList.remove('active')

    // Add .active to current Link Page
    const { links } = gMainController.domEls
    const elActiveLink = links[`elLink${_capitalize(navToStr)}`]
    elActiveLink.classList.add('active')

    //  Hide all pages  
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)

    // Notify other Element current page
    document.body.classList.add(`page-${navToStr}`)

    // Reveal current page 
    const { pages } = gMainController.domEls
    const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    elActivePage.hidden = false

    playAudio('click')
}

// Mobile Menu ☰
function onToggleMenu() {
    const { elMainNav, elBtnToggleNav } = gMainController.domEls
    // notify elScreen 
    document.body.classList.toggle('mobile-menu-open')
    // dropDown animation
    elMainNav.classList.toggle('mobile-menu-open')
    // menuBar animation
    elBtnToggleNav.classList.toggle('nav-open')
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

// the linking function Function on GalleryController
function onImgSelect(imgUrl) {
    console.log(`onImgSelect(${imgUrl})`)
    flashMsg(`Image ${imgUrl}\n selected.`)
    onNav('edit')
    setImg(imgUrl + 1) // memeService
    renderMeme()
}