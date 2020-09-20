"use strict";

$(document).ready(function () {

    setInterval(function(){ 
        $.get( '/api/num-players', function(data) {
            console.log('num ', data.num_players)
            if (data.num_players !== undefined)
                $("#num-of-players").text(data.num_players)
        })
    
        $.get( '/api/players-ids', function(data) {
            if (data.players_ids) {
                $('#players').val(data.players_ids.join('\n'))
            }
        })
    }, 3000);

    $('#new-game-btn').click(function(){
        $.get( '/api/new-game', function(data) {
            console.log('new game started')
        })
    })

})