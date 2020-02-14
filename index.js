const express = require('express')
const app = express()
const mamModule = require('./lib/mam-server')
const synchronizer = require('./lib/synchronizer')


const startServer = () => {
    let server = mamModule.createServer(app, {})

    server.listen(3000, function() {
        console.log(`Server started on http://localhost:3000 `)
        try {
            synchronizer.start();
        } catch (error) {
            console.log("synchronizer error", error)
        }
    })
}


// Run the service
startServer();