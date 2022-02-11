const express = require('express')
const http = require('http')
const routes = require('./routes')

module.exports = { createServer }

function createServer(app, options = {}) {
    options = options || {}
    app = app || express()

    app.use(routes({}))

    let server

    server = http.createServer(app)
    
    return server
}