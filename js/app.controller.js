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

import {
    storageService
} from './services/storageService.js'




window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onSearchPlace = onSearchPlace;
window.onCopyLink = onCopyLink;
window.onGetWeather = onGetWeather;
window.onGoTo = onGoTo;
window.onDeleteLocation = onDeleteLocation;


function onInit() {
    storageService.loadFromStorage()
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    console.log(params)
    var lat = 32.166313
    var lng = 34.843311
    if (params.hasOwnProperty('lat') && params.hasOwnProperty('lng')) {
        lat = +params.lat
        lng = +params.lng
    }
    mapService.initMap(lat, lng)
        .then(() => {
            updateCopyBtn(lat, lng)
            mapService.getMap().addListener("click", (mapsMouseEvent) => {
                let spotName = prompt('What is the name of the location you want to save?');
                if (!spotName) return
                let clickedPos = mapsMouseEvent.latLng.toJSON();
                console.log(spotName, clickedPos)
                locService.addMyLocation(clickedPos, spotName);
                renderPlaces()
            })
            renderPlaces()
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}



function renderPlaces(places = locService.getLocs()) {

    var strHTML = places.map((place) => {
        return `    <div class="inner-places-info">
                        <p> id - ${place.id} </p>
                        <p> name - ${place.name} </p>
                        <p> lat - ${place.lat} </p>
                        <p> lng - ${place.lng} </p>
                        <button class="goBtn" onclick="onGoTo(${place.lat}, ${place.lng})">Go</button>
                        <button class="deleteBtn" onclick="onDeleteLocation('${place.id}')">Delete</button>
                    </div>
                    <hr>
                `
    })
    document.querySelector('.locations-box').innerHTML = strHTML.join('')
}

function onGoTo(lat, lng) {

    mapService.panTo(lat, lng)
    onAddMarker(lat, lng)
    weatherService.getWeather(lat, lng)
        .then((res) => {
            var temp = res.data.main.temp
            if (temp < 10) {
                document.querySelector('.weather-box img').src = 'img/rain.png'
                document.querySelector('.weather-box h3').innerText = temp + '??C'
            } else if (temp > 10 && temp < 20) {
                document.querySelector('.weather-box img').src = 'img/medim.png'
                document.querySelector('.weather-box h3').innerText = temp + '??C'
            } else {
                document.querySelector('.weather-box img').src = 'img/sun.png'
                document.querySelector('.weather-box h3').innerText = temp + '??C'
            }
        })
}



function onDeleteLocation(id) {
    console.log(id)
    locService.removePlace(id)
    renderPlaces()
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
            updateCopyBtn(pos.coords.latitude, pos.coords.longitude)
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
            updateCopyBtn(pos.lat, pos.lng)
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

function updateCopyBtn(lat, lng) {
    var elCopyBtn = document.querySelector('.copy-btn')
    console.log('sdsd')
    elCopyBtn.onclick = onCopyLink(lat, lng)
}