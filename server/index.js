const express = require("express");
const app = express();

const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server);
app.use(express.static("/public"));

io.on('connection', socket => {
    socket.join('game-session'); 
    console.log("Made socket connection");
    
    socket.on('test', data => {
        console.log("Made test connection");
        console.log(data)   
    })
})



//io.sockets.on("error", e => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));