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
    var messaging_events = req.body.entry[0].messaging;
    for (var i = 0; i < messaging_events.length; i++) {
        var event = req.body.entry[0].messaging[i];
        var sender = event.sender.id;
        if (event.message && event.message.text) {
            var text = event.message.text
            if (text === 'Generic') {
                sendGenericMessage(sender);
                continue
            }

            if(text==='Yes'){
                giveQuoteLink(sender);
                sendTextMessage(sender, 'Do you know which option you need?');
                giveQuotes(sender);
                continue
            }
            if(text === 'No'){
                giveNeedsLink(sender);
                continue
            }
            sendTextMessage(sender, 'Hello, Would you like a free Quote today?');
        }
    }
    res.sendStatus(200);
});

function giveQuotes(sender){
    request({
        url: 'http://quotes-service.ci.dev.havenlife.com/quote/coverage?gender=female&health_category=good&is_smoker=false&age=25&term_length=10&product_identifier=CASTerm&coverage_amount=300000',
        auth: {
            'bearer': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODM0NTQyODZ9.3mvuG8Q9v73tGA7gBg2L78Ws8uCk1bO2cPZYt_ZL2Os'
        }
    }, function(err, res) {
            var messageData = { text:res.body[0]["monthly_rate"] };
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
            //process the JSON data et
    })
}

function sendTextMessage(sender, text) {
    var messageData = { text:text };
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

function giveNeedsLink(sender){
    var messageData= {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Haven Life - Needs Calculator",
                    "subtitle": "Life Insurance in 20 minutes",
                    "image_url": "https://havenlife.com/img/hero/hero05.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://havenlife.com/term-life-insurance-calculator.html",
                        "title": "Calculate needs"
                    }],
                }]
            }
        }
    }
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
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);

        }
    });
}

function giveQuoteLink(sender){
    var messageData= {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Haven Life - Free Quote",
                    "subtitle": "Life Insurance in 20 minutes",
                    "image_url": "https://havenlife.com/img/hero/hero05.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://havenlife.com/term-life-insurance-quote.html",
                        "title": "Free Quote"
                    }],
                }]
            }
        }
    }
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
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);

        }
    });
}

function sendGenericMessage(sender) {
    var messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
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
            console.log('Error sending messages: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}

const token = "EAACH4CpO82wBAOHqoxEVZCsq15EcjTaMR4YZA1Vpk2zvTKHXjR5Bo8FQz9ZB4ZCQ8QSNXIqm9QJBR8wrjpkakYVQL5gvA8Y72dOkoubfLmOK3DcczTXKPEvi6ZCgwFI44EZC5aypBzFq9c5DnUpUZChOeAWxZCNPbz0ggnAliuNpGwZDZD";
