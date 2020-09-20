require('dotenv').config()

const express = require("express");
const cors = require('cors');

const app = express();
const {socket_controller} = require('./sockets/webrtc_socket')
const port = 4001;

const http = require("http");
const server = http.Server(app);

const io = require("socket.io")(server, {
    origins:["*:8000"], //127.0.0.1
    serveClient: true,
    pingInterval: 20000,
    pingTimeout: 5000,
    cookie: false
});

// Routes
const witty_lingo = require('./controllers/witty_lingo')(io)
const portal = require('./controllers/admin_portal')

app.set('view engine', 'pug')

app.use('/api', witty_lingo);
app.use('/', portal)
app.use('/static/', express.static('public'));  
app.use(cors());

/*app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log(res.path)
    next();
});*/

io.sockets.on('connection', socket => socket_controller(socket))
io.sockets.on("error", e => console.log(e));

server.listen(port, () => console.log(`Server is running on port ${port}`));