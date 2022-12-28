export const MEME_SERVICE = {
    getMeme,
    setMeme,
    getLines,
    getLine,
    setLine,
    getLinePos,
    setLinePos,
    createLine,
    removeLine,
    getSelectedLineIdx,
    setSelectedLineIdx,
    getFontMap,
    setFontMap,
    setImg,
}

const MEME = {
    storageKey: 'memeDB',
    memes: null,
    meme: {
        src: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: [
            {
                fillStyle: '#fb9623',
                textBaseline: 'middle',
                txt: 'Edit some text!',
                lineWidth: 2,
                textAlign: 'center',
                strokeStyle: '#9623fbd2',
                pos: { x: null, y: null },
                font: '40px papyrus',
            },
        ]
    }
}



//  Meme
function getMeme() { return MEME.meme }

function setMeme(meme) {
    console.log(`🚀 ~ setMeme`, meme)
    console.log('MEME.meme:', MEME.meme)
    MEME.meme = { ...MEME.meme, ...meme }
    console.log('MEME.meme AFTER:', MEME.meme)
}

//  Line
function createLine() {
    getLines().push({
        txt: 'New Line',
        lineWidth: 2,
        textAlign: 'center',
        fillStyle: 'black',
        strokeStyle: 'red',
        pos: { x: null, y: null },
        fontMap: {
            size: 50,
            unit: 'px',
            family: 'fa-solid',
        },
    })
    setSelectedLineIdx()
}

function removeLine() {
    const lines = getLines()
    if (lines.length <= 0) return
    lines.splice(-1)
    setSelectedLineIdx()
}

function getLine() { return getLines()[getSelectedLineIdx()] }

function setLine(val) { getLine() = { ...getLine(), ...val } }

function getLines() { return getMeme().lines }

//  Line Pos
function getLinePos() { return getLine().pos }

function setLinePos(val) { getLine().pos = { ...getLine().pos, ...val } }

//  FontMap
function getFontMap() { return getLine().fontMap }

function setFontMap(key, val) { getLine().fontMap[key] = val }

// Selected Line Idx
function getSelectedLineIdx() {
    return MEME.meme.selectedLineIdx
}

function setSelectedLineIdx() {
    const lines = getLines()
    const { meme } = MEME
    if (!lines.length || lines.length === 0) return
    if (meme.selectedLineIdx >= lines.length) meme.selectedLineIdx = 0
    else meme.selectedLineIdx++
}

// switch img based url 
function setImg(imgCount, diff) {
    const { src } = getMeme()
    const path = src.slice(src.lastIndexOf('/') + 1)

    let name = path.split('.')[0]
    const type = path.split('.')[1]
    // Next Image
    if (+name >= imgCount && diff === 1) name = 0
    else if(diff === 1)name++
    else name--
    // Previous Image
    getMeme().src = src.substr(0, src.lastIndexOf('/') + 1) + name + '.' + type
}