import {
    locService
} from './services/loc.service.js'
import {
    mapService
} from './services/map.service.js'
import {
    PosByNameService
} from './services/pos-by-name.service.js'
import {
    weatherService
} from './services/weather.service.js'

import {storageService} from './services/storageService.js'




window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchPlace = onSearchPlace;
window.onCopyLink = onCopyLink;
window.onGetWeather = onGetWeather;

function onInit() {
    storageService.loadFromStorage()
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params)
    if (params.hasOwnProperty('lat') && params.hasOwnProperty('lng')) {
        mapService.initMap(+params.lat, +params.lng)
            .then(() => {
                
                console.log('Map is ready');
            })
            .catch(() => console.log('Error: cannot init map'));
    } else {
        mapService.initMap()
            .then(() => {
                renderPlaces(locService.getLocs())
                console.log('Map is ready');
            })
            .catch(() => console.log('Error: cannot init map'));
    }

}

function renderPlaces(places){
    console.log(places)
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(lat, lng) {
    console.log('Adding a marker');
    mapService.addMarker({
        lat,
        lng
    });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            onPanTo(pos.coords.latitude, pos.coords.longitude)
            onAddMarker(pos.coords.latitude, pos.coords.longitude)
            // console.log('User position is:', pos.coords);
            // document.querySelector('.user-pos').innerText =
            //     `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat = 32.047201, lng = 34.832581) {
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
}

function onSearchPlace() {
    var value = document.querySelector('[name="search-input"]').value
    PosByNameService.getPositionByName(value)
        .then((pos) => {
            onPanTo(pos.lat, pos.lng)
            onAddMarker(pos.lat, pos.lng)
        })
}

function onCopyLink(lat, lng) {
    const link = `https://yaakovmargalit.github.io/travel-tip/?lat=${lat}&lng=${lng}`
    navigator.clipboard.writeText(link)
}


function onGetWeather(lat, lng) {
    return weatherService.getWeather(lat, lng)
        .then(res => res.data.main.temp)
}