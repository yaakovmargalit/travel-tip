

export const mapService = {
    initMap,
    addMarker,
    panTo
}

var gMap;

function initMap(lat=32.166313, lng= 34.843311) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center:{
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
                let clickedPos = mapsMouseEvent.latLng.toJSON();
                console.log(spotName,clickedPos)
                // addFavSpot(clickedPos, spotName);
              })    
        })
        
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!',
        
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
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}