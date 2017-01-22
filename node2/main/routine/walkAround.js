'use strict';

var _Routine = require('./Routine');

var _Routine2 = _interopRequireDefault(_Routine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flockutils = require('../flockutils');

module.exports = function (userId) {
    var FIFTEEN_MINUTES = 15;
    var r = new _Routine2.default('Walk around', function (started, date) {
        return date.getMinutes() - started.getMinutes() == FIFTEEN_MINUTES;
    }, function () {
        flockutils.sendChatMessage(userId, 'Walk around');
    });
};