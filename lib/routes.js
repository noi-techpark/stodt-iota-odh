const { version } = require('../package.json')
const { Router } = require('express')
const parking = require('./routes/parking')
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
    
    app.use(parking)

    return app
}