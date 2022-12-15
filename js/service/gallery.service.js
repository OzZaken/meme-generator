'use strict'

let gFilterBy

const galleryService = {
    getMemesForDisplay,
    getKeyWordsCountMap,
    setFilter,
    getTotalCount,
}

// Filter Memes
function getMemesForDisplay() {
    console.log("🚀 ~ getMemesForDisplay")
    
    if (!gFilterBy) return gMemes
    return gMemes.filter(meme => {
        const regex = new RegExp(gFilterBy)
        return meme.keywords.some(keyword => regex.test(keyword))
    })
}

function getKeyWordsCountMap() {
    const countMap = {}
    gImgs.forEach(img => {
        const { keywords } = img
        keywords.forEach(keyword => {
            countMap[keyword] = (countMap[keyword] || 0) + 1
        })
    })
    return countMap
}

function setFilter(filterBy) {
    gFilterBy = filterBy
}

function getTotalCount() {
    return gImgs.length - 1
}