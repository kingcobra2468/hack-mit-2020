module.exports.socket_controller = function (socket) {

    console.log(socket)
    socket.join('game-session');

    socket.on("broadcaster", () => { // When new node is introduced. Hand shaking to all sockets in room
        socket.broadcast.emit("broadcaster", socket.id);
    });

    socket.on("watcher", (id) => {
        socket.to(id).emit("watcher", socket.id);
    });

    socket.on("disconnect", () => {
        socket.to(broadcaster).emit("disconnectPeer", socket.id);
    });

    socket.on("offer", (id, message) => {
        socket.to(id).emit("offer", socket.id, message);
    });

    socket.on("answer", (id, message) => {
        socket.to(id).emit("answer", socket.id, message);
    });

    socket.on("candidate", (id, message) => {
        socket.to(id).emit("candidate", socket.id, message);
    });
}