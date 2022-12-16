'use strict'

// Initial Images 
const gImgs = [
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

// TODO: export *MiniService* To GalleryController
const gGalleryService = {
    filterBy: null,
    keywordsCountMap: null
    //     getMemesForDisplay,
    //     getKeyWordsCountMap,
    //     setFilter,
    //     getTotalCount,
    //     getKeyOptionsToDisplay,
}

// Filtered Images
function getImgsForDisplay() {
    const { filterBy } = gGalleryService
    if (!filterBy) return gImgs
    return gImgs.filter(img => {
        const regex = new RegExp(filterBy, 'i') // Ignore Camel Case
        return img.keywords.some(keyword => regex.test(keyword))
    })
}

// return sort common keyword only STR
function getOptionsForDisplay() {
    if (!gGalleryService.keywordsCountMap) _setKeyWordCountMap()
    const keywordsStrs = []
    getKeywordsForDisplay().forEach(words => {
        keywordsStrs.push(_capitalize(words[0]))
    })
    return keywordsStrs
}

// Sort most common Keyword 
function getKeywordsForDisplay() {
    return Object.entries(gGalleryService.keywordsCountMap)
        .sort((a, b) => b[1] - a[1])
        .splice(0, 5)
}

// return KeywordsCountMap 
function getKeyWordsCountMap() {
    const { keywordsCountMap } = gGalleryService
    if (!keywordsCountMap) _setKeyWordCountMap()
    return keywordsCountMap
}

// Set filterBy
function setFilter(filterBy) {
    gGalleryService.filterBy = filterBy
}

// Set keywordsCountMap 
function _setKeyWordCountMap() {
    // Reset
    gGalleryService.keywordsCountMap = {}
    // Set
    const { keywordsCountMap } = gGalleryService
    gImgs.forEach(img => {
        const { keywords } = img
        keywords.forEach(keyword => {
            keywordsCountMap[keyword] = (keywordsCountMap[keyword] || 0) + 1
        })
    })
}