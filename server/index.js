const express = require("express");
const cors = require('cors');

const app = express();
const {socket_controller} = require('./sockets/webrtc_socket')
const port = 4001;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, {
    origins:["127.0.0.1:8000"],
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 20000,
    pingTimeout: 5000,
    cookie: false
});

app.use(express.static("/public"));
app.use(cors());

app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

io.sockets.on('connection', socket => socket_controller(socket))

io.sockets.on("error", e => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));