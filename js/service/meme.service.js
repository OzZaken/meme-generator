export const MEME_SERVICE = {
    getMeme,
    setMeme,
    getLine,
    setLine,
    getLinePos,
    setLinePos,
    createLine,
    removeLine,
    setSelectedLineIdx,
    setFontMap,
    getFontMap,
}

const MEME = {
    storageKey: 'memeDB',
    memes: null,
    // setMeme
    meme: {
        src: null,
        selectedLineIdx: 0,
        keywords: [],
        lines: [
            // setLine
            {
                txt: 'Add some text',
                lineWidth: 2,
                textAlign: 'center',
                fillStyle: 'black',
                strokeStyle: 'red',
                //setLinePos
                pos: { x: null, y: null },
                // setFontMap
                fontMap: {
                    size: 30,
                    sizeUnit: 'px',
                    family: 'impact',
                },
            },
        ]
    }
}

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
            sizeUnit: 'px',
            family: 'fa-solid',
        },
    })
    setSelectedLineIdx()
}

function removeLine() {
    getLines().splice(-1)
    setSelectedLineIdx()
}

function setSelectedLineIdx() {
    const lines = getLines()
    const { meme } = MEME
    if (!lines.length || lines.length === 0) return
    if (meme.selectedLineIdx >= lines.length) meme.selectedLineIdx = 0
    else meme.selectedLineIdx++
}

//  Meme
function getMeme() { return MEME.meme }

function setMeme(meme) { MEME.meme = { ...MEME.meme, ...meme } }

//  Line
function getLine() { return MEME.meme.lines[MEME.meme.selectedLineIdx] }

function getLines() { return getMeme().lines }

function setLine(val) { getLine() = { ...getLine(), ...val } }

//  Line Pos
function getLinePos() { return getLine().pos }

function setLinePos(val) { getLine().pos = { ...getLine().pos, ...val } }

//  FontMap
function getFontMap() { return getLine().fontMap }

function setFontMap(key, val) { getLine().fontMap[key] = val }