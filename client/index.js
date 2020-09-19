
const express = require('express')
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const helmet = require("helmet");
const io = require("socket.io-client");
const cors = require('cors');

// Routes

const app = express()
app.use(cors());
//app.locals.user_tracker = user_tracker

app.set('view engine', 'pug')

// app.use(block_spam_users.filter.bind(this))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(helmet());

//app.use('/static/', express.static('public'));  
//app.use('/', home_page)
//app.use('/resume', resume_page)
//app.use('/my-projects', my_projects_page)
app.use('/static/', express.static('public'));  

app.get('/', function(req, res) { // home page
    res.render('index');
})

app.listen(8000)