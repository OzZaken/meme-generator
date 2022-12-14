'use strict'

// All Action From Dom Start and End From Here!
function onInit() {
    galleryController.renderGallery()
    galleryController.renderKeywordsOptions()
    galleryController.renderKeywordsBtns()

    window.gMeme = {
        filter: '',
        activePageStr: 'gallery',
        isMenuOpen: false,
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
                elImgInput: document.querySelector('[name="img"]'),
            },
        },
    }

    // Get Default Language from User Browser, if (i18 contain Default) Set Language 
    // setUserDefaultLang()

    flashMsg('Generate\n New Meme!')
    flashMsg('Welcome!')
    console.log('gMeme:', gMeme.domEls)
    // If Not Move Paged In Timeout FlashMsg
    setTimeout(() => {
        const { elLinkGallery } = gMeme.domEls.links
        if (elLinkGallery.classList.contains('active')) flashMsg('Choose Meme Background!')
    }, 5000)
}
function onClickKeyword(elKeyWord) {
    const { dataset } = elKeyWord
    const maxFontSize = 12
    if (+dataset.fs >= maxFontSize) return
    dataset.fs++
}


function onNav(navToStr) {
    if (gMeme.isMenuOpen) onToggleMenu()

    if (!navToStr) navToStr = 'Gallery'
    const _capitalize = (str) => {
        return str[0].toUpperCase() + str.substring(1)
    }

    // Remove First(and only) .active class and remove it
    document.querySelector('.active').classList.remove('active')

    // add .active to curPage
    const { links } = gMeme.domEls
    const elActiveLink = links[`elLink${_capitalize(navToStr)}`]
    elActiveLink.classList.add('active')

    //  Hide all pages and 
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)
    // reveal curPage 
    const { pages } = gMeme.domEls
    const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    elActivePage.hidden = false
}

function onAddImg(ev) {
    galleryController.loadImg(ev);
}

//                          🐱‍👤 👀 🐱‍👤
function onToggleMenu() {
    const { elMainNav, elBtnToggleNav } = gMeme.domEls
    // notify elScreen 
    document.body.classList.toggle('menu-opened')
    // dropDown animation
    elMainNav.classList.toggle('menu-opened')
    // menuBar animation
    elBtnToggleNav.classList.toggle('nav-open')
    gMeme.isMenuOpen = !gMeme.isMenuOpen
}

function flashMsg(str) {
    const { elUserMsg } = gMeme.domEls
    elUserMsg.innerText = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => elUserMsg.classList.remove('user-msg-open'), 3000)
}

function addListeners() {
    window.addEventListener('resize', () => {
        OnResizeCanvas()
    })
    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onDraw)
    gElCanvas.addEventListener('mouseup', onUp)

    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onDraw)
    gElCanvas.addEventListener('touchend', onUp)
}

function onImgSelect(imgId) {
    console.log(`onImgSelect(${imgId})`);
    setMemeImg(imgId)
    document.querySelector('.gallery-container').hidden = true
    flashMsg('img selected')
    renderMeme()
}

function setSelectedLineIdx() {
    const meme = getMeme()
    const { lines } = meme
    meme.selectedLineIdx = lines.length - 1
    document.querySelector('.line-txt').value = lines[meme.selectedLineIdx].txt
}

function onDownloadMeme(elLink) {
    const data = gElCanvas.toDataURL()
    console.log('data:', data)
    elLink.href = data
    elLink.download = 'my-meme'
}

function onSaveMeme() {
    const { newMeme } = gMeme
    saveMeme(newMeme)
}