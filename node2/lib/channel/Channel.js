'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var flockutils = require('../flockutils');

var _Base2 = require('../Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var allChannels = []; // TODO persist to JSON file and read from it rather than keep in memory

var Channel = function (_Base) {
    _inherits(Channel, _Base);

    function Channel(id, name, desc, routine) {
        _classCallCheck(this, Channel);

        var _this2 = _possibleConstructorReturn(this, (Channel.__proto__ || Object.getPrototypeOf(Channel)).call(this));
        _this2.id = id;
        _this2.name = name;
        _this2.desc = desc;
        _this2.routine = routine;
        allChannels.push(_this2);
        return _this2;
    }

    _createClass(Channel, [{
        key: 'hasSubscribed',
        value: function hasSubscribed(userId) {
            if (!(userId in user_stats)) {
                flockutils.initUserAttrs(userId);
            }
            if (!('channels' in user_stats[userId])) return -1;
            var length = user_stats[userId].channels.length;
            for (var i = 0; i < length; i++) {
                if (user_stats[userId].channels[i].id == this.id) return i;
            }
            return -1;
        }
    }, {
        key: 'activateFor',
        value: function activateFor(userId) {
            var _this = this;
            if (this.hasSubscribed(userId == -1)) {
                if (!('channels' in user_stats[userId])) user_stats[userId].channels = [];

                user_stats[userId].channels.push({
                    id: _this.id
                });
                return _this.routine.startRoutine(userId);
            }
            return undefined;
        }
    }, {
        key: 'getDetails',
        value: function getDetails() {
            return { name: this.name, desc: this.desc };
        }
    }, {
        key: 'deactivateFor',
        value: function deactivateFor(userId) {
            var index = this.hasSubscribed(userId);
            if (index > -1) {
                user_stats[userId].channels.splice(index, 1);
            }
        }
    }], [{
        key: 'channels',
        value: function channels() {
            return allChannels;
        }
    }]);

    return Channel;
}(_Base3.default);

exports.default = Channel;