module.exports = { start }


const parking = require('../config/parking.json')
const axios = require('axios');

const uuid = require('uuid-random');
const URL = "http://ipchannels.integreen-life.bz.it"
const db = require('./database')

// Set some defaults (required if your JSON file is empty)
const {
    createChannel,
    getAllChannels,
    createMessage,
    getMessages,
} = require('../utils/mam.js')


async function synchronizer(options = {}) {
    console.log("start sync...")
    
    try{
        // fetch newest informaiton from parking stations
        parking.stations.forEach(async(station) => {
          
            const response = await axios.get( URL + '/parking/rest/get-newest-record?station=' + station);
            console.log("got resp");

            let db_station = db.get('parking')
                .find({ station: station })
                .value()
    
            if(!db_station) {
                // There is no station yet, save in db and create a new mam stream.
                console.log("Create station entry...")
                // create a new mam stream
                const channel = await createChannel(response.data)
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
                    .assign({ id: uuid(), createdAt: Date.now().toString() })
                    .write()
    
                console.log("Syncing done.")
                
            } else {
                // Station already exist
                // IF db_timestamp < new timestamp -> save in mam channel 
                if(db_station.last_record.timestamp < response.data.timestamp) {
                    // newer entry detected, save it!
                    console.log("newer entry detected!")
                    const log = await createMessage(db_station.mam, response.data);
    
                    let db_object = db_station
                    db_object.last_record = response.data
                    db_object.mam.state = log.state
    
                    console.log(`published update for ${db_station.station} at start ${log.state.channel.start} with root ${log.root.substr(0,20) + '...'}`);
                    // Better to DB outside MAM logic util, keep it simple 
                    db.get('parking').find({id: db_station.id}).assign(db_object).write();
                    
                } else {
                    // no new entry detected, continue with next station...
                    console.log("equal entry!")
                }
            }
        });

    }catch(ex){
        console.log("SYNC", ex);
    }

    // return true
}

function start() {
    console.log("synchronizer started.")
    setInterval(synchronizer, 100000, true);
    synchronizer();
}