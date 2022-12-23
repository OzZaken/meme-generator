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

//  Meme
function getMeme() { return MEME.meme }
function setMeme(meme) {
    // console.log(`📝 ~ Service update MEME`, MEME.meme, '\nWITH:', meme)
    MEME.meme = {
        ...MEME.meme,
        ...meme
    }
    // console.log(`📝 ~ Service UPDATED MEME`, MEME.meme)
}

// Line
function createLine() {
    getLines().push(
        {
            fontMap: {
                size: 36,
                sizeUnit: 'px',
                family: 'fa-solid',
            },
            pos: { x: null, y: null },
            txt: 'New Line',
            lineWidth: 2,
            textAlign: 'center',
            fillStyle: 'black',
            strokeStyle: 'red',
        }
    )
    setSelectedLineIdx()
}

function removeLine() {
    getLines().splice(-1)
    setSelectedLineIdx()
}

function getLine() {
    const { lines, selectedLineIdx } = MEME.meme
    return lines[selectedLineIdx]
}

function setLine(val) {
    console.log(`🚀 ~ setLine with`, val)
    const selectedLine = getLine()
    selectedLine = {
        ...selectedLine,
        ...val
    }
}

function setSelectedLineIdx() {
    const lines = getLines()
    const { meme } = MEME
    if (meme.selectedLineIdx >= lines.length) meme.selectedLineIdx = 0
    else meme.selectedLineIdx++
}

function getLines() { return getMeme().lines }

function getLinePos() { return getLine().pos }

function setLinePos(val) {
    const selectedLine = getLine()
    selectedLine.pos = {
        ...selectedLine.pos,
        ...val
    }
}

function setFontMap(key, val) {
    console.log(`🚀 ~ setFontMap:${key}`, val)
    getLine().fontMap[key] = val
}

function getFontMap() {return getLine().fontMap}
// function changeLinePos(x, y) {
//     console.log(`🚀 ~ y`, y)
//     console.log(`🚀 ~ x`, x)
//     const meme = getMeme()
//     const { lines } = meme
//     const { pos } = lines[meme.selectedLineIdx]
//     pos.x += x
//     pos.y += y
// }

// function moveLine(diffX = 0, diffY = 0) {
// 	const line = getLine()
// 	// don't let the text to go out of the canvas completely
// 	const posX = line.pos.x + diffX
// 	const posY = line.pos.y + diffY
// 	if (posY < 0 || posY > gCanvas.height) return
// 	if (posX < 0 || posX > gCanvas.width) return

// 	line.pos.x = posX
// 	line.pos.y = posY
// }
// function isInLine(pos, isClicked) {
// 	// reverse order so we chose the line on top
// 	for (let i = gMeme.lines.length - 1; i >= 0; i--) {
// 		const box = gMeme.lines[i].bindBox
// 		if (
// 			pos.x >= box.x &&
// 			pos.x <= box.x + box.width &&
// 			pos.y >= box.y &&
// 			pos.y <= box.y + box.height
// 		) {
// 			if (isClicked) gMeme.selectedLineIdx = i
// 			return true
// 		}
// 	}
// 	return false
// }