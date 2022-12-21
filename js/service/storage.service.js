// import { STORAGE_SERVICE } from './service/storage.service.js'

export const STORAGE_SERVICE = {
    saveToStorage,
    loadFromStorage
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}