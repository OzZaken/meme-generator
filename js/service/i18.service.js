'use strict'

const I18_SERVICE = {
    getLangStr,
    setUserDefaultLang,
}

const TRANSLATE = {
    storageKey: 'user-lang',
    userLang: 'en',
    trans: {
        'gallery': {
            en: 'Gallery',
            he: 'גלרייה'
        },
        'memes': {
            en: 'Memes',
            he: 'ממים'
        },
        'about': {
            en: 'About',
            he: 'אודות'
        },
        'search-by-keywords': {
            en: 'Search By Keywords',
            he: 'חיפוש לפי מילות מפתח'
        },
        'back-to-gallery': {
            en: 'Back to gallery',
            he: 'חזרה לגלריה'
        },
        'edit-text-lines': {
            en: 'Edit Text Lines',
            he: 'ערוך שורות טקסט'
        },
        'switch-line': {
            en: 'Switch Line',
            he: 'החלפת שורה'
        },
        'add-line': {
            en: 'Add Line',
            he: 'הוספת שורה'
        },
        'save-meme': {
            en: 'Save Meme',
            he: 'שמירת מם'
        },
        'download-meme': {
            en: 'Download Meme',
            he: 'הורדת מם'
        },
        'share-meme-to-facebook': {
            en: 'Share Meme To Facebook',
            he: 'שיתוף לפייסבוק'
        },
        'delete-line': {
            en: 'Delete Line',
            he: 'מחיקת שורה'
        },
        'move-up': {
            en: 'Move Up',
            he: 'הזז למעלה'
        },
        'move-down': {
            en: 'Move Down',
            he: 'הזז למטה'
        },
        'increase-size': {
            en: 'Increase Size',
            he: 'הגדל טקסט'
        },
        'decrease-size': {
            en: 'Decrease Size',
            he: 'הקטן טקסט'
        },
        'align-left': {
            en: 'Align Left',
            he: 'יישר שמאלה'
        },
        'align-center': {
            en: 'Align Center',
            he: 'יישר למרכז'
        },
        'align-right': {
            en: 'Align Right',
            he: 'יישר ימינה'
        },
        'text-color': {
            en: 'Text Color',
            he: 'צבע טקסט'
        },
        'stroke-color': {
            en: 'Stroke Color',
            he: 'צבע מסגרת:'
        },
        'enter-text': {
            en: 'Enter Text',
            he: 'הכנס טקסט'
        },
    },
}

function getLangStr() {return TRANSLATE.userLang}

function setUserDefaultLang(langStr) {setLang(langStr)}

// By user || local storage || navigator.languages[1] 
function setLang(langStr) {
    const { storageKey } = TRANSLATE
    if (!langStr) langStr = storageService.loadFromStorage(storageKey)
    TRANSLATE.userLang = langStr
    const { userLang } = TRANSLATE
    saveToStorage(storageKey, userLang)
    storageService.loadFromStorage(storageKey)
}