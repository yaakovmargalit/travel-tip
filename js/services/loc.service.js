export const locService = {
    getLocs,
    addMyLocation,
    removePlace

}

import {utilService} from '../utilService.js'
import { storageService } from './storageService.js'
import { mapService } from './map.service.js'


var PLACE_KEY = 'placesDB'
var gPlaces = storageService.loadFromStorage(PLACE_KEY) || []

function addMyLocation(position, placeName) {
    onAddMarker(position.lat,position.lng)
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
        createdAt: Date.now(),
    }
}





// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 }, 
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
// ]

function getLocs() {
        console.log(gPlaces)
        return gPlaces
}


function removePlace(id){
    console.log('idddd',id)
    const idx = gPlaces.findIndex(place => place.id === id);
    gPlaces.splice(idx, 1);
    storageService.saveToStorage(PLACE_KEY, gPlaces);
}


