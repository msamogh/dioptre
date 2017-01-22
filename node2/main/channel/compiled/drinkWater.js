'use strict';

var _Channel = require('./Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _Routine = require('./Routine');

var _Routine2 = _interopRequireDefault(_Routine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flockutils = require('../flockutils');

module.exports = function () {
    var FIFTEEN_MINUTES = 15;
    var r = new _Routine2.default(function (userId, started, date) {
        return date.getMinutes() - started.getMinutes() == FIFTEEN_MINUTES;
    }, function (userId) {
        flockutils.sendChatMessage(userId, 'Sip some water!');
    });
    var channel = new _Channel2.default('drinkWater', 'Stay hydrated', 'Reminds you to sip some water every 30 minutes', r);
    return channel;
};