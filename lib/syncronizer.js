const parking = require('../config/parking.json')
const axios = require('axios');

const URL = "http://ipchannels.integreen-life.bz.it"

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({ parking: [] })
  .write()

module.exports = { start }

function syncronizer(options = {}) {
    
    // fetch newest informaiton from parking stations
    parking.stations.forEach(station => {
      
        axios.get( URL + '/parking/rest/get-newest-record?station=' + station)
                .then(function (response) {
                    let db_station = db.get('parking')
                        .find({ station: station })
                        .value()
                    if(!db_station) {
                        // There is no station yet, save in db and create a new mam stream.
                        console.log("Create station entry...")
                        // TODO: create a new mam stream

                        // create object 
                        let db_object = {
                            station: station,
                            last_record: response.data
                        }

                        // save in db
                        db.get('parking')
                            .push(db_object)
                            .last()
                            .assign({ id: Date.now().toString() })
                            .write()

                    } else {
                        // Station already exist
                        // IF db_timestamp < new timestamp -> save in mam channel 
                        if(db_station.last_record.timestamp < response.data.timestamp) {
                            // newer entry detected, save it!
                            console.log("newer entry detected!")
                        } else {
                            // no new entry detected, continue with next station...
                            console.log("equal entry!")
                        }
                    }

                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                })
    });

    return true
}

function start() {
    console.log("syncronizer started.")
    setInterval(syncronizer, 5000);
}