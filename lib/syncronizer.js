const parking = require('../config/parking.json')
const axios = require('axios');

const URL = "http://ipchannels.integreen-life.bz.it"

module.exports = { start }

function start(options = {}) {
    
    console.log("syncronizer started.")
    // fetch newest informaiton from parking stations

    parking.stations.forEach(station => {
        console.log("station:", station)
        axios.get( URL + '/parking/rest/get-newest-record?station=' + station)
                .then(function (response) {
                    // handle success
                    console.log(response.data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
    });

    return true
}