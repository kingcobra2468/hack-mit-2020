module.exports = function(io) {
    
    const express = require('express')
    const router = express.Router()
    const {word_generator} = require('../generators/word_generator')

    router.get('/new-game', function(req, res) { // home page
        
        //const {num_socket_connections} = require('../sockets/webrtc_socket')

        console.log('requested new game')
        let ids = Object.keys(io.sockets.clients().connected);
        let words = word_generator(ids.length, './word_banks/vocab-set-spanish-1.txt') //`${process.env.PROJECT_ROOT_DIR}/word_banks/vocab-set-spanish-1.txt`  
        let word_bindings = {};
        
        ids.forEach((id, i) => word_bindings[id] = words[i])

        io.sockets.emit('new-witty-lingo-game', word_bindings)

        res.json(word_bindings)
    })

    router.get('/num-players', function(req, res) { // home page
        
        //const {num_socket_connections} = require('../sockets/webrtc_socket')

        let ids = Object.keys(io.sockets.clients().connected);       
        console.log(ids)
        res.json({"num_players" : ids.length})
    })

    router.get('/players-ids', function(req, res) { // home page
        
        //const {num_socket_connections} = require('../sockets/webrtc_socket')

        let ids = Object.keys(io.sockets.clients().connected);       

        res.json({"players_ids" : ids})
    })

    return router;
}