const { version } = require('../package.json')
const { Router } = require('express')

module.exports = function api({ config, db }) {
    const app = Router()
    // perhaps expose some API metadata at the root
    app.get('/', (req, res) => {
        res.json({ version })
    })

    return app
}