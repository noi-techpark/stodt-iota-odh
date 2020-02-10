const express = require('express')
const app = express()
const mamModule = require('./lib/mam-server')
const synchronizer = require('./lib/synchronizer')


const startServer = () => {
    let server = mamModule.createServer(app, {})

    server.listen(3000, function() {
        console.log(`Server started on http://localhost:3000 `)
        synchronizer.start();
    })
}


// Run the service
startServer();