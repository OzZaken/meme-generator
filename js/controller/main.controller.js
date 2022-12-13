'use strict'

var gElCanvas
var gCtx
var gIsDraw
let gAudio

function onInit() {
    // setUserDefaultLang()
    // initCanvas()
    renderGallery()
    flashMsg('Welcome!')
}

function toggleMenu(elMenuBar) {
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
    saveMeme()
}
