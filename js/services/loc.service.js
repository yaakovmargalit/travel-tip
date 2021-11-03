export const locService = {
    getLocs,
    addMyLocation,

}

import {utilService} from '../utilService.js'
import { storageService } from './storageService.js'

var PLACE_KEY = 'placesDB'
var gPlaces = storageService.loadFromStorage(PLACE_KEY) || []

function addMyLocation(position, placeName) {
    var currPlace = _createPlace(position, placeName)
    console.log(currPlace)
    if (!gPlaces.length) gPlaces[0] = currPlace
    else gPlaces.push(currPlace)
    storageService.saveToStorage(PLACE_KEY, gPlaces)
}


function _createPlace(position, placeName) {
    return {
        id: utilService.makeId(),
        name: placeName,
        lat: position.lat,
        lng: position.lng,
        createdAt: Date.now()
    }
}


const locs = [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
        console.log(gPlaces)
        return gPlaces
       
}


