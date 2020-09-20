
const express = require('express')

const io = require("socket.io-client");
const cors = require('cors');

// Routes

const app = express()
app.use(cors());
//app.locals.user_tracker = user_tracker

app.set('view engine', 'pug')

app.use('/static/', express.static('public'));  

app.get('/', function(req, res) { // home page
    res.render('index');
})

app.listen(8000)