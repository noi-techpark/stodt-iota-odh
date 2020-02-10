module.exports = { start }


const parking = require('../config/parking.json')
const axios = require('axios');

const URL = "http://ipchannels.integreen-life.bz.it"
const db = require('./database')

// Set some defaults (required if your JSON file is empty)
const {
    createChannel,
    getAllChannels,
    createMessage,
    getMessages,
} = require('../utils/mam.js')


function synchronizer(options = {}) {
    console.log("start sync...")
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
                        // create a new mam stream
                        createChannel(response.data).then(channel => {
                            console.log('channel: ', channel)
                            // send reponse with address.
                             // create object 
                            let db_object = {
                                station: station,
                                last_record: response.data,
                                mam: channel
                            }

                            // save in db
                            db.get('parking')
                                .push(db_object)
                                .last()
                                .assign({ id: Date.now().toString() })
                                .write()

                            console.log("Syncing done.")
                        })

                       
                    } else {
                        // Station already exist
                        // IF db_timestamp < new timestamp -> save in mam channel 
                        if(db_station.last_record.timestamp < response.data.timestamp) {
                            // newer entry detected, save it!
                            console.log("newer entry detected!")

                            // TODO: Apped channel (createMessage)
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
    console.log("synchronizer started.")
    synchronizer();
    setInterval(synchronizer, 100000, true);
}