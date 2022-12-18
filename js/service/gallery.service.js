'use strict'

//*                                                   Init
// Initial Images 
const gInitialImgs = [
    { url: 'assets/img/gallery/1.jpg', keywords: ['view', 'dance'] },
    { url: 'assets/img/gallery/2.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/3.jpg', keywords: ['dog', 'cute',] },
    { url: 'assets/img/gallery/4.jpg', keywords: ['baby', 'angry'] },
    { url: 'assets/img/gallery/5.jpg', keywords: ['dog', 'baby', 'cute'] },
    { url: 'assets/img/gallery/6.jpg', keywords: ['cute', 'cat'] },
    { url: 'assets/img/gallery/7.jpg', keywords: ['celeb'] },
    { url: 'assets/img/gallery/8.jpg', keywords: ['funny', 'baby'] },
    { url: 'assets/img/gallery/9.jpg', keywords: ['celeb'] },
    { url: 'assets/img/gallery/10.jpg', keywords: ['angry', 'celeb'] },
    { url: 'assets/img/gallery/11.jpg', keywords: ['celeb'] },
    { url: 'assets/img/gallery/12.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/13.jpg', keywords: ['funny', 'dance'] },
    { url: 'assets/img/gallery/14.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/15.jpg', keywords: ['baby', 'surprised'] },
    { url: 'assets/img/gallery/16.jpg', keywords: ['funny', 'dog'] },
    { url: 'assets/img/gallery/17.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/18.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/19.jpg', keywords: ['celeb'] },
    { url: 'assets/img/gallery/20.jpg', keywords: ['celeb', 'angry'] },
    { url: 'assets/img/gallery/21.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/22.jpg', keywords: ['funny', 'celeb'] },
    { url: 'assets/img/gallery/23.jpg', keywords: ['celeb'] },
    { url: 'assets/img/gallery/24.jpg', keywords: ['celeb', 'angry'] },
    { url: 'assets/img/gallery/25.jpg', keywords: ['funny', 'celeb'] },
]




//  Export to GALLERY_CONTROLLER
const GALLERY_SERVICE = {
    setStorageKey,
    setInitImgFolder,
    getImgsCount,
    getImgsForDisplay,
    getOptionsForDisplay,
    getKeywordsForDisplay,
    getKeyWordsCountMap,
    setFilter,
}

// GALLERY_SERVICE STATE MODEL
const GALLERY = {
    filterBy: null,
    keywordsCountMap: null,
    storageKey: null,
    imgs: null,
}

// Adjust GalleryService to Main App
function setStorageKey(galleryName) {
    GALLERY.storageKey = `${galleryName}-gallery-DB`
    _createImgs()
}

// After Get StorageKey Find Or Create Imgs
function _createImgs() {
    const { storageKey } = GALLERY
    GALLERY.imgs = storageService.loadFromStorage(storageKey)
    if (!GALLERY.imgs || !GALLERY.imgs.length) {
        GALLERY.imgs = gInitialImgs
    }
    storageService.saveToStorage(storageKey, GALLERY.imgs)
}

// imgs.length
function getImgsCount() {
    const { imgs } = GALLERY
    return imgs.length
}



function uploadImg() {

}

// Optional
function setInitImgFolder(path, imgCount, imgFileType, keywords) {
    GALLERY.imgs = []
    for (let i = 1; i <= imgCount; i++) {
        addImg(path, i, imgFileType, keywords[i - 1])
    }
}

function addImg(imgData) {
    const { path, name, fileType, keywords } = imgData
    GALLERY.imgs.push({ url: `${path}${name}.${fileType}`, keywords })
    const { storageKey } = GALLERY
    storageService.saveToStorage(storageKey, GALLERY.imgs)
}

//*                                                   Filter

// Filtered Images
function getImgsForDisplay() {
    const { filterBy, imgs } = GALLERY
    if (!filterBy) return imgs
    return imgs.filter(img => {
        const regex = new RegExp(filterBy, 'i') // Ignore Camel Case
        return img.keywords.some(keyword => regex.test(keyword))
    })
}

// Set filterBy
function setFilter(filterBy) {
    GALLERY.filterBy = filterBy
}

//*                                                   Keywords
// Set keywordsCountMap 
function _setKeyWordCountMap() {
    const { imgs } = GALLERY
    // Get All Keywords
    const keyWords = imgs.reduce((acc, img) => {
        acc.push(...img.keywords)
        return acc
    }, [])
    // reduce to Map
    GALLERY.keywordsCountMap = keyWords.reduce((acc, keyword) => {
        if (!acc[keyword]) acc[keyword] = 0
        acc[keyword]++
        return acc
    }, {})
}

// return KeywordsCountMap 
function getKeyWordsCountMap() {
    const { keywordsCountMap } = GALLERY
    if (!keywordsCountMap) _setKeyWordCountMap()
    return keywordsCountMap
}

// return All Possibles keywords
function getKeywords() {
    let keyWordsSet = GALLERY.imgs.reduce((acc, img) => {
        img.keywords.forEach(keyword => acc.add(keyword))
        return acc.add(...img.keywords)
    }, new Set())
    return Array.from(keyWordsSet)
}

// Sort most common Keyword 
function getKeywordsForDisplay() {
    if (!GALLERY.keywordsCountMap) _setKeyWordCountMap()
    return Object.entries(GALLERY.keywordsCountMap)
        .sort((a, b) => b[1] - a[1])
        .splice(0, 5)
}

// return sort common keyword only STR
function getOptionsForDisplay() {
    if (!GALLERY.keywordsCountMap) _setKeyWordCountMap()
    const keywordsStrs = []
    getKeywordsForDisplay().forEach(words => {
        keywordsStrs.push(_capitalize(words[0]))
    })
    return keywordsStrs
}



