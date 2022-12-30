export const UTIL_SERVICE = {
    getRandomColor,
    debounce,
    capitalize,
    capitalizes,
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Capitalize  StrS 
function capitalizes(words) {
    return words.slice(0, 3).map(keyword => {
        if (keyword) return (capitalize(keyword))
    })
}

// Capitalize Str 
function capitalize(word) {
    return word.replace(/^\w/, c => c.toUpperCase())
}