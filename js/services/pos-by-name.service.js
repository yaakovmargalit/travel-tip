export const PosByNameService = {
    getPositionByName
}

function getPositionByName(name) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${name}&key=AIzaSyDbCgiLMOvSqpuGSWeahVxane6dGFfR_CA`)
        .then(res => {
            console.log('Axios Res:', res);
            return {
                lat: res.data.results[0].geometry.location.lat,
                lng: res.data.results[0].geometry.location.lng
            }
        })
        .catch(err => {
            console.log('Had issues talking to server', err);
        })
        .finally(() => {
            console.log('Finally always run');
        })
}