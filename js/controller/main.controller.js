'use strict'

// All Action From Dom Start and End From Here!
function onInit() {
    galleryController.renderGallery()
    galleryController.renderKeywordsOptions()
    galleryController.renderKeywordsBtns()

    window.gMeme = {
        filter: '',
        activePageStr: 'gallery',
        domEl: {
            links: {
                elLinkGallery: document.querySelector('.gallery'),
                elLinkMeme: document.querySelector('.meme'),
                elLinkAbout: document.querySelector('.about'),
                elLinkSaved: document.querySelector('.saved'),
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
    console.log('gMeme:', gMeme.domEl)
    // If Not Move Paged In Timeout FlashMsg
    setTimeout(() => {
        const { elLinkGallery } = gMeme.domEl.links
        if (elLinkGallery.classList.contains('active')) {
            flashMsg('Select Meme Background!')
        }
    }, 5000)
}
function onClickKeyword(elKeyWord) {
    const { dataset } = elKeyWord
    const maxFontSize = 12
    if (+dataset.fs >= maxFontSize) return
    dataset.fs++
}


function onNav(navToStr) {
    if (!navToStr) navToStr = 'Gallery'
    const _capitalize = (str) => {
        return str[0].toUpperCase() + str.substring(1)
    }

    document.querySelector('.active').classList.remove('active')

    const { links } = gMeme.domEl
    const elActiveLink = links[`elLink${_capitalize(navToStr)}`]
    elActiveLink.classList.add('active')

    //  
    const elPages = document.querySelectorAll('.page')
    elPages.forEach(elPage => elPage.hidden = true)

    const { pages } = gMeme.domEl
    const elActivePage = pages[`elPage${_capitalize(navToStr)}`]
    elActivePage.hidden = false
}




//                          🐱‍👤👀🐱‍👤
function onAddImg(ev) {
    galleryController.loadImg(ev);
}


function onToggleMenu(elMenuBar) {
    const elMainNav = document.querySelector('.main-nav')
    // Add Event Listener
    elMainNav.setAttribute('onclick', 'closeNav()')
    //?
    document.body.classList.toggle('menu-opened')
    // dropDown animation
    elMainNav.classList.toggle('menu-opened')
    // menuBar animation
    elMenuBar.classList.toggle('nav-open')
}

function closeNav() {
    const elOpenNavBtn = document.querySelector('.open-nav-btn')
    console.log("🚀 ~ file: main.controller.js:31 ~ closeNav ~ elOpenNavBtn", elOpenNavBtn)
    const elMainNav = document.querySelector('.main-nav')
    // Remove Event Listener
    elMainNav.removeAttribute('onclick')
    //?
    document.body.classList.remove('menu-opened')
    // dropDown animation
    elMainNav.classList.remove('menu-opened')
    // menuBar animation
    elOpenNavBtn.classList.remove('nav-open')
}

function flashMsg(str) {
    const elUserMsg = document.querySelector('.user-msg')
    elUserMsg.innerText = str
    elUserMsg.classList.add('user-msg-open')
    setTimeout(() => {
        elUserMsg.classList.remove('user-msg-open')
    }, 3000)
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