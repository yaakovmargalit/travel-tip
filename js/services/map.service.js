import {
    utilService
} from "../utilService.js";
import {
    storageService
} from "./storageService.js";

import { locService } from "./loc.service.js";



export const mapService = {
    initMap,
    addMarker,
    panTo,
}

var gMap;


function initMap(lat = 32.166313, lng = 34.843311) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: {
                        lat,
                        lng
                    },
                    zoom: 15
                })
            console.log('Map!', gMap);
            addMarker({
                lat,
                lng
            })
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: {
                    lat,
                    lng
                },
            });

            infoWindow.open(gMap);
            gMap.addListener("click", (mapsMouseEvent) => {
                let spotName = prompt('What is the name of the location you want to save?');
                if (!spotName) return 
                let clickedPos = mapsMouseEvent.latLng.toJSON();
                console.log(spotName, clickedPos)
                locService.addMyLocation(clickedPos, spotName);
            })
        })
}



function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
        icon: 'img/icon.png'
        
    });
    var infowindow = new google.maps.InfoWindow({
        content:`<div class="marker">
        <img src="img/ca.png"/>
        </div>`

      });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
      });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDbCgiLMOvSqpuGSWeahVxane6dGFfR_CA';
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&language=en&region=IL`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}