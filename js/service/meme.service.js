export const MEME_SERVICE = {
    getMeme,
    setMeme,
    switchLine,
    getNextImg,
    resetLines,
    // Class
    getLine,
    setLine,
    setLinePos,
    addLine,
    removeLine,
    getFont,
    // setFont,
}

const MEME = {
    meme: {
        src: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: []
    }
}

function getMeme() {
    return MEME.meme
}

function setMeme(meme) {
    console.log('setMeme(meme):', meme)
    MEME.meme = { ...MEME.meme, ...meme }
    console.log('MEME.meme:', MEME.meme)
}

function getLine() {
    // console.log(`🚀 ~ getLine`, getMeme())
    const lines = getMeme().lines
    // console.log(`🚀 ~ lines`, lines)
    const selectedLine = lines[MEME.meme.selectedLineIdx] // || lines[0]
    // console.log(`🚀 ~ selectedLine`, selectedLine,getMeme())
    return selectedLine
}

function setLine(val) {
    console.log(`🚀 ~ setLine(val)`, val)
    console.log(`🚀 ~ line`, line)
    const line = getLine()
    console.log(`🚀 ~ line`, line)
    getLine() = {
        ...line,
        ...val
    }
    console.log(`🚀 ~ Line After:`, getLine())
}

function resetLines() {
    MEME.meme.lines = []
}

function removeLine() {
    const lines = getMeme().lines
    if (!lines.length) return
    lines.pop()
    switchLine()
}

function switchLine(isSwitch) {
    const { meme } = MEME
    const { selectedLineIdx } = meme
    const { length } = meme.lines
    if (isSwitch) {
        if (!selectedLineIdx) meme.selectedLineIdx = meme.lines.length - 1
        else if (length > 1) meme.selectedLineIdx--
    }
    else meme.selectedLineIdx = meme.lines.length - 1
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

function setLinePos(val) {
    const pos = getLine().pos
    getLine().pos = { ...pos, ...val }
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

function addLine(x, y) {
    console.log(`create line: X:${x} Y:${y}`)
    const lines = getMeme().lines
    lines.push({
        pos: { x, y },
        txt: 'New Line',
        lineWidth: 2,
        textAlign: 'center',
        fillStyle: 'white',
        strokeStyle: 'red',
        font: `30px fa-solid`,
    })
    // MEME.meme.selectedLineIdx++ 
    console.log('MEME.meme Before switchLine:', MEME.meme)
    switchLine()
}

class Line {
    constructor(x, y) {
        this.pos = { x, y }
        this.txt = 'New Line'
        this.lineWidth = 2
        this.textAlign = 'center'
        this.fillStyle = 'white'
        this.strokeStyle = 'red'
        this.font = '30px fa-solid'
    }

    setLine(txt) {
        this.txt = txt
    }

    setLinePos(x, y) {
        this.pos.x = x
        this.pos.y = y
    }

    getFont() {
        return this.font
    }
}