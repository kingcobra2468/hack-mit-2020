module.exports = function(io) {
    
    const express = require('express')
    const router = express.Router()
    const {word_generation} = require('../generators/word_generator')

    router.get('/new-game', function(req, res) { // home page
        
        const {num_socket_connections} = require('../sockets/webrtc_socket')
        console.log()
        ids = permittedValues = Object.keys(io.sockets.clients().connected);
        console.log(ids)
        io.sockets.emit('test', ids)

        res.json(ids)
    })

    return router;
}
