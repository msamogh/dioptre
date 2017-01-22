'use strict';

var _AddTaskSession = require('./chat/AddTaskSession');

var _AddTaskSession2 = _interopRequireDefault(_AddTaskSession);

var _CompleteTaskSession = require('./chat/CompleteTaskSession');

var _CompleteTaskSession2 = _interopRequireDefault(_CompleteTaskSession);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var init = false;

module.exports = function () {
    var flock = require('./flockos');
    var flockutils = require('./flockutils');

    var startSession = function(userId, command) {
        if (!(userId in user_stats)) {
            flockutils.initUserAttrs(userId);
        }
        switch (command) {
            case 'complete':
                user_stats[userId]['bot'] = new _CompleteTaskSession2.default(userId);
                break;
            case 'new':
                var bot = new _AddTaskSession2.default(userId);
                user_stats[userId]['bot'] = bot;
                bot.initConversation.bind(bot)();
                break;
        }
    };

    if (!init) {
        init = true;
        flock.events.on('chat.receiveMessage', function (event) {
            var userId = event.userId;
            var text = event.message.text;
            if (!(userId in user_stats)) {
                flockutils.initUserAttrs(userId);
            }

            if (user_stats[userId]['bot'] != undefined) {
                if (text.toLowerCase().indexOf('abandon') != -1) {
                    user_stats[userId]['bot'].endSession();
                } else {
                    user_stats[userId]['bot'].onMessage(text);
                }
            } else {
                // to be replaced with Microsoft Bot Services
                if (text.toLowerCase() == 'hi' || text.toLowerCase() == 'hey' || text.toLowerCase() == 'hello' || text.toLowerCase() == 'yo') { 
                    flockutils.sendChatMessage(userId, 'Hey there!', '<flockml>Hi there! You can get started with Dioptre by setting up a habit with Routines. <br />'  
                        + 'You can <a href="https://zenflock.herokuapp.com/channels?userId=' + userId + '">view all routines</a> or add your own with the slash command <b>/zen habit</b>.<br />'
                        + 'Or to start a focus session, simply click the Zen icon to your right!<br />'
                        + 'To check out your stats, use <b>/zen stats</b></flockml>');                }
                else 
                    flockutils.sendChatMessage(userId, 'You can\'t initiate conversation yet', '<flockml><a href="http://omegle.com">Feeling lonely? Wanna talk?</a></flockml>');
            }
        });
    }

    return {
        startSession: startSession
    };
}();