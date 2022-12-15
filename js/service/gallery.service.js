'use strict'

let gFilterBy
let gKeyWordCountMap

const galleryService = {
    getMemesForDisplay,
    getKeyWordsCountMap,
    setFilter,
    getTotalCount,
    getTopCountMap,
}

// Filter Memes
function getMemesForDisplay() {
    if (!gFilterBy) return gMemes
    return gMemes.filter(meme => {
        const regex = new RegExp(gFilterBy,'i')
        return meme.keywords.some(keyword => regex.test(keyword))
    })
}


function getKeyWordsCountMap() {
    gKeyWordCountMap = {}
    gImgs.forEach(img => {
        const { keywords } = img
        keywords.forEach(keyword => {
            gKeyWordCountMap[keyword] = (gKeyWordCountMap[keyword] || 0) + 1
        })
    })
    return gKeyWordCountMap
}

// return only the Most common Images based keyword 
function getTopCountMap() {
    let topFive = Object.entries(gKeyWordCountMap)
    return topFive.sort((a, b) => b[1] - a[1]).splice(0, 5)
}

// Set gFilterBy
function setFilter(filterBy) {
    gFilterBy = filterBy
}

// return length
function getTotalCount() {
    return gMemes.length
}