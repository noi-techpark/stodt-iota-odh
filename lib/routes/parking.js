const { Router } = require('express')
const app = Router()
const database = require('../database')

app.get('/parking/get-stations', (req, res) => {
    res.json(database.get('parking').map('station').value())
})
app.get('/parking/get-newest-record', (req, res) => {
    if(req.query.station) {
        res.json(database.get('parking').find({station: req.query.station}).value())
    } else {
        res.json(req.query)
    }
})

app.get('/parking/get-records', (req, res) => {
    if(req.query.station) {
        let station = database.get('parking').find({station: req.query.station}).value();
        getMessages(station.id).then(messages => {
            res.json(messages)
        })
    }
    else if(req.query.root) {
        let stations = database.get('parking').value();
        let found_station = null
        stations.forEach(station => {
            Object.keys(station).forEach(key => {
                if(key === "mam") {
                    if(station.mam.root === req.query.root) {
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


app.get('/parking/append_dataset', (req, res) => {
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

module.exports = app