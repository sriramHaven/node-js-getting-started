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

app.post('/webhook/', function (req, res) {
    var messaging_events = req.body.entry[0].messaging
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i]
        var sender = event.sender.id
        if (event.message && event.message.text) {
            var text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200);
})

function sendTextMessage(sender, text) {
    var messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

const token = "EAACH4CpO82wBAOHqoxEVZCsq15EcjTaMR4YZA1Vpk2zvTKHXjR5Bo8FQz9ZB4ZCQ8QSNXIqm9QJBR8wrjpkakYVQL5gvA8Y72dOkoubfLmOK3DcczTXKPEvi6ZCgwFI44EZC5aypBzFq9c5DnUpUZChOeAWxZCNPbz0ggnAliuNpGwZDZD";
