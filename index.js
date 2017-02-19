var cool = require('cool-ascii-faces');
var express = require('express');
const bodyParser = require('body-parser')
const request = require('request')
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index')
});

app.get('/cool', function(request, response) {
    response.send(cool());
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'go_haven') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})
