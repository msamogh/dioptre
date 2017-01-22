'use strict';

var flock = require('./flockos');
var flockutils = require('./flockutils');
var express = require('express');
var tokenHandler = require('./tokenhandler')(flock);
var chatbot = require('./chatbot');
var chrome = require('./chrome');
var fs = require('fs');
var stats = require('./stats');
var path = require('path');

/* Constants BEGIN */
global.NORMAL = 'normal';
global.ZEN = 'zen';
global.PLAYING = 'playing';
global.MUTED = 'muted';
/* Constants END */

/* Global variables declaration BEGINS */
global.chrome_config = {};
var user_stats_json;
try {
    user_stats_json = require('./user_stats.json');
    console.log('user_stats loaded and count=' + user_stats_json.count);
} catch (e) {
    console.log('oops ' + e);
    user_stats_json = {};
}
global.user_stats = user_stats_json;
/* Global variables declaration ENDS */

/* Express configuration BEGINS */
var app = express();
// set the view engine to ejs
app.set('view engine', 'ejs');
// here you set that all templates are located in `/views` directory
app.set('views', __dirname + '/views/pages');
app.use(express.static(path.join(__dirname, 'public')));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
/* Express configuration ENDS */

/* Flock configuration BEGINS */
// Listen for events on /events, and verify event tokens using the token verifier.

app.use(flock.events.tokenVerifier);
app.post('/events', flock.events.listener);
/* Flock configuration ENDS */

var tasks = require('./tasks')(chrome.setZenMode);

var routes = require('./routes')(tasks.endTask);
app.use('/', routes);

function getCommand(t) {
    var text = t;
    if (text == null || text.trim() == '') {
        text = '';
    }
    return text.split(' ')[0];
}

flock.events.on('client.slashCommand', function (event) {
    var text = event.text;
    var userId = event.userId;

    var returnMessage = 'Command executed';

    if (event.text == null || event.text.trim() == '') {
        text = '';
    }

    var command = getCommand(event.text); //text.split(' ')[0];

    switch (command) {
        case 'start':
            if (text.length < 2) {
                returnMessage = 'Use "/zen start [task]" to start session';
            } else {
                var taskName = text.split(' ').slice(1).join(' ');
                if (tasks.beginTask(userId, taskName)) {
                    returnMessage = 'Your session has started. Get to work!';
                } else {
                    returnMessage = 'You\'re already in a Zen session.';
                }
            }
            break;

        case 'mute':
            chrome.setAudioPlaying(userId, MUTED);
            break;

        case 'unmute':
            chrome.setAudioPlaying(userId, PLAYING);
            break;

        case 'stats':
            stats.displayStats(userId);
            break;

        case 'new':
            chatbot.startSession(userId, 'new');
            break;

        default:
            returnMessage = '/zen [command] [options]';
    }

    return {
        text: returnMessage
    };
});

// Start the listener after reading the port from config
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('Listening on port: ' + port);
});

function cleanup() {
    console.log('Cleaning up');
    console.log(__dirname);
    fs.writeFileSync(__dirname + '/user_stats.json', JSON.stringify(user_stats));
    tokenHandler.cleanup();
}

// exit handling -- save tokens in token.js before leaving
process.on('SIGINT', process.exit);
process.on('SIGTERM', process.exit);
process.on('exit', function () {
    cleanup();
});