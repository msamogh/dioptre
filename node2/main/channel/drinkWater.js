import Channel from './Channel';
import Routine from './Routine';
var flockutils = require('../flockutils');

module.exports = function() {
     var FIFTEEN_MINUTES = 15;
    var r = new Routine(function (userId, started, date) {
        return date.getMinutes() - started.getMinutes() == FIFTEEN_MINUTES;
    }, function (userId) {
        flockutils.sendChatMessage(userId, 'Sip some water!');
    });
    var channel = new Channel('drinkWater', 'Stay hydrated', 'Reminds you to sip some water every 30 minutes', r);
    return channel;
};