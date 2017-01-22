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
                flockutils.sendChatMessage(userId, 'You can\'t initiate conversation yet', '<flockml><a href="http://omegle.com">Feeling lonely? Wanna talk?</a></flockml>');
            }
        });
    }

    return {
        startSession: startSession
    };
}();