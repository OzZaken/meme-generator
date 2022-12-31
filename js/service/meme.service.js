export const MEME_SERVICE = {
    getMeme,
    setMeme,
    switchLine,
    getNextImg,
    resetLines,
    getLine,
    setLine,
    setLinePos,
    addLine,
    removeLine,
    getFont,
    setFont,
    setTxt
}

const MEME = {
    meme: {
        src: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: []
    }
}

// Meme
function getMeme() {
    return MEME.meme
}

function setMeme(meme) {
    console.log('setMeme(meme):', meme)
    MEME.meme = { ...MEME.meme, ...meme }
    console.log('MEME.meme:', MEME.meme)
}

// Line
function addLine(x, y) {
    console.log(`create line: X:${x} Y:${y}`)
    const lines = getMeme().lines
    lines.push({
        pos: { x, y },
        // direction: 'lfr',
        fillStyle: '#cc2e2e',
        strokeStyle: '#9623fbd2',
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        // filter: 'none',
        font: `40px papyrus`,
        // fontKerning: `auto`,
        txt: 'Edit Line!',
        lineWidth: 2,
        textAlign: 'center',
    })
    // MEME.meme.selectedLineIdx++ 
    console.log('MEME.meme Before switchLine:', MEME.meme)
    switchLine()
}

function getLine() {
    const lines = getMeme().lines
    const selectedLine = lines[MEME.meme.selectedLineIdx] // || lines[0]
    return selectedLine
}

function setLine(val) {
    const line = getLine()
    getLine() = {
        ...line,
        ...val
    }
}

function resetLines() {
    MEME.meme.lines = []
}

function removeLine() {
    const { lines, selectedLineIdx } = getMeme()
    console.log(`🚀 ~ lines[selectedLine]`, lines[selectedLineIdx])
    const idx = lines.findIndex(line => line === lines[selectedLineIdx])
    lines.splice(idx, 1)
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

function setFont(fontData) {
    const { size, unit, family } = fontData
    getLine().font = `${size}${unit} ${family}`
}

function setTxt(val) {
    const line = getLine()
    line.txt = val
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