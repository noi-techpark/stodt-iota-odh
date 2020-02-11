const { version } = require('../package.json')
const { Router } = require('express')

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
            res.json(database.get('parking').filter({station: req.query.station}).value())
        } else {
            res.json(req.query)
        }
    })

    return app
}