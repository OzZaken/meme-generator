export const MEME_SERVICE = {
    getMeme,
    setMeme,
    createLine,
    removeLine,
    getLine,
    setLine,
    setLinePos,
    switchLine,
    getNextImg,
    getFont,
    resetLines,
}

const MEME = {
    meme: {
        src: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: []
    }
}

function getFont() {
    const { font } = getLine()
    // get the first group of digits in the string
    const size = font.match(/\d+/)[0]
    const regEx = font.match(/\d+\D+/)
    const fonts = regEx[0].substring(regEx[0].match(/\d+/)[0].length).split(' ')
    const family = fonts[1] // || font.split(' ')[1]
    const unit = fonts[0]
    return {
        size,
        unit,
        family,
    }
}

function getMeme() { return MEME.meme }

function setMeme(meme) {
    console.log('setMeme(meme):', meme)
    MEME.meme = { ...MEME.meme, ...meme }
    console.log('MEME.meme:', MEME.meme)
}

function getLine() {
    const lines = getMeme().lines
    const selectedLine = lines[getMeme().selectedLineIdx] // || lines[0]
    return selectedLine
}

function setLine(val) {
    console.log(`🚀 ~ setLine(val)`, val)
    const line = getLine()
    console.log(`🚀 ~ line`, line)
    getLine() = {
        ...line,
        ...val
    }
    console.log(`🚀 ~ getLine`, getLine())
}

function resetLines() { MEME.meme.lines = [] }

function createLine(x, y) {
    console.log('create line:', x, y)
    const lines = getMeme().lines
    lines.push({
        txt: 'New Line',
        lineWidth: 2,
        textAlign: 'center',
        fillStyle: 'white',
        strokeStyle: 'red',
        pos: { x, y },
        font: `30px fa-solid`,
    })
    // MEME.meme.selectedLineIdx++ 
    switchLine()
}

function removeLine() {
    const lines = getLines()
    if (!lines.length || lines.length <= 0) return
    lines.pop()
    switchLine()
}

function switchLine() {
    const { meme } = MEME
    console.log('meme.selectedLineIdx:', meme.selectedLineIdx)
    const lines = meme.lines
    const lineIdx = meme.selectedLineIdx
    if (lineIdx >= lines.length) meme.selectedLineIdx = 0
    else meme.selectedLineIdx++
    console.log('meme.selectedLineIdx:', meme.selectedLineIdx)
}

function getNextImg(imgCount, diff) {
    const { src } = getMeme()
    const path = src.slice(src.lastIndexOf('/') + 1)
    let nameNum = path.split('.')[0]
    const type = path.split('.')[1]
    if (+nameNum >= imgCount && diff === 1) nameNum = 0
    else if (diff === 1) nameNum++
    else nameNum--
    return src.substr(0, src.lastIndexOf('/') + 1) + nameNum + '.' + type
}


function setLinePos(val) {
    const pos = getLine().pos
    getLine().pos = { ...pos, ...val }
}

function setFS(size) {
    console.log(`🚀 ~ size`, size)


}