'use strict'

// The Action Of the Model Append in The Front Service 
// Later Send the Action || the new State to Remote Server

const galleryService = {
    getImgsForDisplay,
    getKeyWordsCountMap,
}

const gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['funny', 'celeb'] },
    { id: 2, url: 'img/2.jpg', keywords: ['dog', 'cute'] },
    { id: 3, url: 'img/3.jpg', keywords: ['dog', 'cute', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['dog', 'cute'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['funny', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'celeb'] },
    { id: 11, url: 'img/11.jpg', keywords: ['funny'] },
    { id: 12, url: 'img/12.jpg', keywords: ['funny', 'celeb'] },
    { id: 13, url: 'img/13.jpg', keywords: ['celeb'] },
    { id: 14, url: 'img/14.jpg', keywords: ['celeb'] },
    { id: 15, url: 'img/15.jpg', keywords: ['celeb'] },
    { id: 16, url: 'img/16.jpg', keywords: ['funny'] },
    { id: 17, url: 'img/17.jpg', keywords: ['funny', 'celeb'] },
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'celeb'] }
]

function getImgsForDisplay() {
    return gImgs
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