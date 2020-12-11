const express = require('express');
const config = require('./config/app');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const http = require('http');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// implement cors; keep it before any route
app.use(cors()); 
// Access-Control-Allow-Origin: *
app.options('*', cors());
app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
 // implement cors (better case) : app.use(cors("Frontend URL")); 
//  app.use(cors(" URL")); 
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