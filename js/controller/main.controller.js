'use strict'

// All Action From Dom Start From Here!
//                          🐱‍👤 👀 🐱‍👤
function onInit() {
    galleryController.renderGallery()
    galleryController.renderKeywordsOptions()
    galleryController.renderKeywordsBtns()
    
    // Set Global Controller State Variable
    window.gState = {
        activePageStr: 'gallery',
        isMenuOpen: false,
        domEls: {
            elMeme: document.querySelector('#elMeme'),
            elMemeContainer:document.querySelector('meme-container'),
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
                elFilterBy: document.querySelector('input[name="filter"]'),
                elImgInput: document.querySelector('input[name="img"]'),
            },
        },
        audio: {},
    }

    // i18
    // setUserDefaultLang()

    flashMsg('Generate\n New Meme!')
    flashMsg('Welcome!')
    console.log('gState:', gState.domEls)

    // If Not Move Paged In Timeout FlashMsg
    setTimeout(() => {
        const { elLinkGallery } = gState.domEls.links
        if (elLinkGallery.classList.contains('active')) flashMsg('Choose Meme Background!')
    }, 5000)
}

function onNav(navToStr) {
    if (gState.isMenuOpen) onToggleMenu()
    else playAudio('click')
    if (!navToStr) navToStr = 'Gallery'
    const _capitalize = (str) => {
        return str[0].toUpperCase() + str.substring(1)
    }

    // Remove First(and only) .active class and remove it
    document.querySelector('.active').classList.remove('active')

    // add .active to curPage
    const { links } = gState.domEls
    const elActiveLink = links[`elLink${_capitalize(navToStr)}`]
    elActiveLink.classList.add('active')

    //  Hide all pages and 
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)
    
    // reveal curPage 
    const { pages } = gState.domEls
    const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    elActivePage.hidden = false
}

function flashMsg(str) {
    const { elUserMsg } = gState.domEls
    elUserMsg.innerText = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => elUserMsg.classList.remove('user-msg-open'), 3000)
}

// ☰ Mobile Menu
function onToggleMenu() {
    const { elMainNav, elBtnToggleNav } = gState.domEls
    // notify elScreen 
    document.body.classList.toggle('menu-opened')
    // dropDown animation
    elMainNav.classList.toggle('menu-opened')
    // menuBar animation
    elBtnToggleNav.classList.toggle('nav-open')
    gState.isMenuOpen = !gState.isMenuOpen
}

// Audio
function playAudio(audioKey) {
    const { audio } = gState
    if (audio[audioKey]) audio[audioKey].pause()
    return new Promise((resolve, reject) => { // return a promise
        audio[audioKey] = new Audio()         // create audio wo/ src
        audio[audioKey].preload = "auto"    // intend to play through
        audio[audioKey].autoplay = true    // autoplay when loaded
        if (/music/.test(audioKey)) {
            audio[audioKey].loop = true
            audio[audioKey].volume = 0.4
        }
        audio[audioKey].src = `assets/audio/${audioKey}.mp3`
        audio[audioKey].onerror = reject   // on error, reject
        audio[audioKey].onended = resolve  // when done, resolve
    })

}


function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    console.log('data:', data)
    elLink.href = data
    elLink.download = 'my-meme'
}

function onSaveMeme() {
    const { newMeme } = gState
    saveMeme(newMeme)
}
