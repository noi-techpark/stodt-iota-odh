const { version } = require('../package.json')
const { Router } = require('express')
const {
    getMessages,
    createMessage
} = require('../utils/mam.js')

module.exports = function api({ config, db }) {
    const database = require('./database')
    const app = Router()
    // perhaps expose some API metadata at the root
    app.get('/', (req, res) => {
        res.json({ version })
    })
    app.get('/get-stations', (req, res) => {
        res.json(database.get('parking').map('station').value())
    })
    app.get('/get-newest-record', (req, res) => {
        if(req.query.station) {
            res.json(database.get('parking').find({station: req.query.station}).value())
        } else {
            res.json(req.query)
        }
    })

    app.get('/get-records', (req, res) => {
        if(req.query.station) {
            let station = database.get('parking').find({station: req.query.station}).value();
            getMessages(station.id).then(messages => {
                res.json(messages)
            })
        }
        else if(req.query.root) {
            console.log("req.query.root", req.query.root)
            let stations = database.get('parking').value();
            let found_station = null
            stations.forEach(station => {
                Object.keys(station).forEach(key => {
                    if(key === "mam") {
                        if(station.mam.root === req.query.root) {
                            console.log("FOUND", station);
                            found_station = station
                            return
                        }
                    }
                });
                
            })

            getMessages(found_station.id).then(messages => {
                res.json(messages)
            })
        } else {
            res.json(req.query)
        }
    })
    

    app.get('/append_dataset', (req, res) => {
        if(req.query.station) {
            let station = database.get('parking').find({station: req.query.station}).value();
            createMessage(station.mam, {test: "test"}).then(mam => {
                let db_object = station
                db_object.mam.state = mam.state
                database.get('parking').find({id: station.id}).assign(db_object).write();
                res.json(mam)
            })
        } else {
            res.json(req.query)
        }
    })

    return app
}