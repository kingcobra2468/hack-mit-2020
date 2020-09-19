const express = require("express");
const app = express();
const {socket_controller} = require('./sockets/webrtc_socket')
const port = 4001;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);

app.use(express.static("/public"));
app.use(express.static('node_modules'));
io.sockets.on('connection', socket => socket_controller(socket))

io.sockets.on("error", e => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));