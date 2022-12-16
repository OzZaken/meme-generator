'use strict'

function onInit() {
    // Set Global State MainController 
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

    // i18
    // setUserDefaultLang()

    // User-Msg
    flashMsg('Welcome!')
    setTimeout(() => {
        const { elLinkGallery } = gMainController.domEls.links
        if (elLinkGallery.classList.contains('active')) flashMsg('Choose Meme Background!')
    }, 5000)
    initMemeController()
}

// Navigation
function onNav(navToStr) {
    if (gMainController.isMenuOpen) onToggleMenu()
    if (!navToStr) navToStr = 'Gallery'
    const _capitalize = (str) => {
        return str[0].toUpperCase() + str.substring(1)
    }

    playAudio('click')
    // Remove First(and only) .active class and remove it
    document.querySelector('.active').classList.remove('active')

    // add .active to curPage
    const { links } = gMainController.domEls
    const elActiveLink = links[`elLink${_capitalize(navToStr)}`]
    elActiveLink.classList.add('active')

    //  Hide all pages and 
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)

    // reveal curPage 
    const { pages } = gMainController.domEls
    const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    elActivePage.hidden = false
}

// Mobile Menu ☰
function onToggleMenu() {
    const { elMainNav, elBtnToggleNav } = gMainController.domEls
    // notify elScreen 
    document.body.classList.toggle('menu-opened')
    // dropDown animation
    elMainNav.classList.toggle('menu-opened')
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

// Last Function on GalleryController
function onImgSelect(imgId) {
    console.log(`onImgSelect(${imgId})`)
    flashMsg(`Image ${imgId}\n selected.`)
    onNav('edit')
    setImg(imgId + 1)
    renderMeme()
}