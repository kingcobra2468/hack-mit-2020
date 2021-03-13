let num_socket_connections = 0

module.exports.num_socket_connections = num_socket_connections;

module.exports.socket_controller = function (socket) {

    socket.on("broadcaster", () => { // When new node is introduced. Hand shaking to all sockets in room
        console.log(socket.id)
        socket.broadcast.emit("broadcaster", socket.id);
    });

    socket.on("watcher", (id) => {
        console.log(`watcher ${id} from ${socket.id}`)
        socket.to(id).emit("watcher", socket.id);
    });

    socket.on("disconnect", (id) => {
        socket.to(id).emit("disconnectPeer", socket.id);
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

    socket.on('connect', function () { num_socket_connections++; });

    socket.on('disconnect', function () { num_socket_connections--; });
}