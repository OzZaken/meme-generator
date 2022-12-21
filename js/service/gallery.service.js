import { STORAGE_SERVICE } from '../service/storage.service.js'

export const GALLERY_SERVICE = {
    setFilter,
    setInitImgFolder,
    getImgsCount,
    getImgsForDisplay,
    getKeywords,
    getOptionsForDisplay,
    getKeywordsForDisplay,
    getKeyWordsCountMap,
    setGalleryStorageKey,
}

// Initial Images 
const INIT_IMAGES = [
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

// GALLERY_SERVICE MODEL STATE 
const GALLERY = {
    filterBy: null,
    keywordsCountMap: null,
    storageKey: null,
    imgs: null,
}

// Adjust GalleryService to Main App
function setGalleryStorageKey(galleryName) {
    GALLERY.storageKey = `${galleryName}-gallery-DB`
    _createImgs()
}

// After Update StorageKey Find Or Create Imgs
function _createImgs() {
    const { storageKey } = GALLERY
    GALLERY.imgs = STORAGE_SERVICE.loadFromStorage(storageKey)
    if (!GALLERY.imgs || !GALLERY.imgs.length) {
        GALLERY.imgs = INIT_IMAGES
    }
    const { imgs } = GALLERY
    STORAGE_SERVICE.saveToStorage(storageKey, imgs)
}

// imgs.length
function getImgsCount() {
    const { imgs } = GALLERY
    return imgs.length
}

function onSuccess(uploadedImgUrl) {
    uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
    const strHtml = `
    <a class="btn start-action" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" 
    title="Share on Facebook" target="_blank" onclick="onCloseDownloadShareModal();
    window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
    Click to share on facebook   
    </a>`;
    toggleModalScreen(strHtml);
}

function uploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);
    fetch('//ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData,
    })
        .then(function (res) {
            return res.text();
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err);
        })
}

function addImg(imgData) {
    console.log(`🚀 ~ Saving Image`, imgData)
    const { path, name, fileType, keywords } = imgData
    GALLERY.imgs.push({ url: `${path}${name}.${fileType}`, keywords })
    const { storageKey } = GALLERY
    STORAGE_SERVICE.saveToStorage(storageKey, GALLERY.imgs)
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
    const _capitalizeWord = (str) => str[0].toUpperCase() + str.substring(1)
    const keywordsStrs = []
    getKeywordsForDisplay().forEach(words => {
        keywordsStrs.push(_capitalizeWord(words[0]))
    })
    return keywordsStrs
}

function setInitImgFolder(path, imgCount, imgFileType, keywords) {
    GALLERY.imgs = []
    for (let i = 1; i <= imgCount; i++) {
        addImg(path, i, imgFileType, keywords[i - 1])
    }
}
