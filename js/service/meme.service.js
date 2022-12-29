export const MEME_SERVICE = {
    getMeme,
    setMeme,
    createLine,
    removeLine,
    getLine,
    setLine,
    getLines,
    setLinePos,
    getSelectedLineIdx,
    switchLine,
    getNextImg,
    resetLines,
    getFontSize,
}

const MEME = {
    meme: {
        src: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: []
    }
}

//  Meme
function getMeme() { return MEME.meme }

function setMeme(meme) { MEME.meme = { ...MEME.meme, ...meme } }

//  Line
function getLines() { return MEME.meme.lines }

function resetLines() { MEME.meme.lines = [] }

function getSelectedLineIdx() { return MEME.meme.selectedLineIdx }


function createLine(x, y) {
    console.log('create line:', x, y)
    const lines = getLines()
    lines.push({
        txt: 'New Line',
        lineWidth: 2,
        textAlign: 'center',
        fillStyle: 'white',
        strokeStyle: 'red',
        pos: { x, y },
        font: `30px fa-solid`,
    })
    MEME.meme.selectedLineIdx++
}

function switchLine() {
    const { meme } = MEME
    const lines = getLines()
    const lineIdx = getSelectedLineIdx()
    if (lineIdx >= lines.length) meme.selectedLineIdx = 0
    else meme.selectedLineIdx++
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


function removeLine() {
    const lines = getLines()
    if (!lines.length || lines.length <= 0) return
    lines.pop()
    switchLine()
}

function getLine() {
    const line = MEME.meme.lines[getSelectedLineIdx()] || MEME.meme.lines[0]
    console.log(`🚀 ~ line`, line)
    return line
}

function setLine(val) {
    const lines = getLine()
    lines[getSelectedLineIdx()] = { ...lines[getSelectedLineIdx()], ...val }
}

function setLinePos(val) {
    const pos = getLine().pos
    getLine().pos = { ...pos, ...val }
}
function setFont() {
    const font = getMeme().lines[getSelectedLineIdx()].font
    console.log(`🚀 ~ font`, font)
}
function getFontSize() {
    const { meme } = MEME
    
    const font = getMeme().lines[getSelectedLineIdx()]
    console.log(`🚀 ~ font`, font)

}