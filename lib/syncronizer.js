const parking = require('../config/parking.json')

module.exports = { start }

function start(options = {}) {
    
    console.log("syncronizer started.")
    // fetch newest informaiton from parking stations

    parking.stations.forEach(station => {
        console.log("station:", station)
    });

    return true
}