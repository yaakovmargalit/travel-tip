export const weatherService = {
    getWeather
}

function getWeather(lat, lng) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&APPID=e2254bab53389a927094f370960a8e62`)
        .then(res => {
            console.log('Axios Res:', res);
            return res
        })
        .catch(err => {
            console.log('Had issues talking to server', err);
        })
        .finally(() => {
            console.log('Finally always run');
        })
}