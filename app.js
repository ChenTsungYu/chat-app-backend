const express = require('express')
const config = require('./config/app')
const router = require('./router')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const http = require('http')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(router)
// static file root path
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/uploads'))

const port = config.appPort

const server = http.createServer(app)
const SocketServer = require('./socket')
SocketServer(server)

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})