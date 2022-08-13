'use strict'

var gKeywordSearchCountMap = {
    'funny': 12,
    'celeb': 11,
    'dog': 11,
    'cat': 16,
    'baby': 2,
    'cute': 5,
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
    { id: 18, url: 'img/18.jpg', keywords: ['funny', 'celeb'] },
]

function renderGallery() {
    let strHTML = ''
    gImgs.forEach(img => {
        strHTML += `<img onclick="onImgSelect(${img.id})" class="gallery-img" src=${img.url} alt="gallery-img">`
    })
    document.querySelector('.gallery-container').innerHTML = strHTML
}