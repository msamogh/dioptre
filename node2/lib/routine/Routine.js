'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Base2 = require('../Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var flockutils = require('../flockutils');
var Frequency = require('date-frequency');
var chrono = require('chrono-node');
var juration = require('../juration');

var routines = [];

var Routine = function (_Base) {
    _inherits(Routine, _Base);

    function Routine(owner, id, name, desc, msg, freq) {
        _classCallCheck(this, Routine);

        var _this2 = _possibleConstructorReturn(this, (Routine.__proto__ || Object.getPrototypeOf(Routine)).call(this));

        _this2.owner = owner;
        _this2.id = id;
        _this2.name = name;
        _this2.desc = desc;
        _this2.msg = msg;

        if (freq.toLowerCase().indexOf('every') == 0) {
            _this2.atOrEvery = 'every';
            var ms = juration.parse(freq.substring(5));
            _this2.ms = ms;
        } else {
            _this2.atOrEvery = 'at';
            var date = chrono.parseDate(freq);
            _this2.time = { h: date.getHours(), m: date.getMinutes() };
        }
        routines.push(_this2);
        _this2.addUser(owner);
        return _this2;
    }

    _createClass(Routine, [{
        key: 'isSubscribed',
        value: function isSubscribed(userId) {
            if (userId in user_stats) {
                if ('routines' in user_stats[userId]) {
                    for (var i = 0; i < user_stats[userId].routines.length; i++) {
                        var routine = user_stats[userId].routines[i];
                        if (routine.id == this.id) return true;
                    }
                } else {
                    user_stats[userId].routines = [];
                    return false;
                }
            }
            flockutils.initUserAttrs(userId);
            user_stats[userId].routines = [];
            return false;
        }
    }, {
        key: 'getTimeUntilNext',
        value: function getTimeUntilNext(date, last) {
            if (this.atOrEvery == 'at') {
                var newDate = new Date(date.getTime());
                newDate.setHours(this.time.h);
                newDate.setMinutes(this.time.m);
                if (newDate.getTime() - date.getTime() < 0) newDate.setDate(date.getDate() + 1);
                return newDate.getTime() - date.getTime();
            } else {
                return last.getTime() + this.ms * 1000 - date.getTime();
            }
        }
    }, {
        key: 'getRoutineInUser',
        value: function getRoutineInUser(userId) {
            for (var i = 0; i < user_stats[userId].routines.length; i++) {
                var routine = user_stats[userId].routines[i];
                if (routine.id == this.id) return routine;
            }
            return undefined;
        }
    }, {
        key: 'addUser',
        value: function addUser(userId) {
            var _this = this;
            if (!this.isSubscribed(userId)) {
                var date = new Date();
                if (userId in user_stats) {
                    user_stats[userId].routines.push({
                        id: _this.id,
                        streak: 0,
                        started: date
                    });

                    setTimeout(function () {
                        _this.action(userId);
                    }, _this.getTimeUntilNext(date, date));
                }
            }
        }
    }, {
        key: 'removeUser',
        value: function removeUser(userId) {
            if (this.isSubscribed(userId)) {
                var length = user_stats[userId].routines.length;
                for (var i = 0; i < length; i++) {
                    if (user_stats[userId].routines[i].id == this.id) {
                        user_stats[userId].routines.splice(i, 1);
                        return;
                    }
                }
            }
        }
    }, {
        key: 'action',
        value: function action(userId) {
            if (!this.isSubscribed(userId)) return;
            var routine = this.getRoutineInUser(userId);
            var before = routine.started;
            if (this.atOrEvery == 'every') {
                routine.started = date;
            }
            var date = new Date();
            var _this = this;

            if (this.atOrEvery == 'every') {
                setTimeout(function () {
                    _this.action(userId);
                }, this.ms * 1000);
            } else {
                setTimeout(function() {
                    _this.action(userId);
                }, 24 * 60 * 60 * 1000);
            }

            flockutils.routinePoke(userId, this.name, this.msg, this.id);

        }
    }], [{
        key: 'getRoutines',
        value: function getRoutines() {
            return routines;
        }
    }, {
        key: 'getRoutine',
        value: function getRoutine(routineId) {
            for (var i = 0; i < routines.length; i++) {
                var routine = routines[i];
                if (routine.id == routineId) return routine;
            }
            return null;
        }
    }]);

    return Routine;
}(_Base3.default);

exports.default = Routine;