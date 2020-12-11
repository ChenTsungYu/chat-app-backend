const express = require('express');
const config = require('./config/app');
const bodyParser = require('body-parser');
const app = express();
const http = require('http');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// implement cors; keep it before any route
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE, PATCH");
    next();
});
const router = require('./router');
app.use(router);
// static file root path
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

const port = config.appPort;

const server = http.createServer(app);
const SocketServer = require('./socket');
SocketServer(server);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
