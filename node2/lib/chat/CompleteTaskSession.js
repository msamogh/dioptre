'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ChatSession2 = require('./ChatSession');

var _ChatSession3 = _interopRequireDefault(_ChatSession2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var flockutils = require('../flockutils');

var CompleteTaskSession = function (_ChatSession) {
    _inherits(CompleteTaskSession, _ChatSession);

    function CompleteTaskSession(userId) {
        _classCallCheck(this, CompleteTaskSession);

        var _this = _possibleConstructorReturn(this, (CompleteTaskSession.__proto__ || Object.getPrototypeOf(CompleteTaskSession)).call(this, userId));

        this.initConversation();
        return _this;
    }

    _createClass(CompleteTaskSession, [{
        key: 'initConversation',
        value: function initConversation() {
            var nTasks = user_stats[this.userId]['todos'].length;
            user_stats[this.userId]['todos'][nTasks - 1].ongoing = false;
            this.currentTask = user_stats[this.userId]['todos'][nTasks - 1];
            flockutils.sendChatMessage(this.userId, 'Did you complete ' + this.currentTask.taskName + '?');
        }
    }, {
        key: 'onMessage',
        value: function onMessage(text) {
            if (text[0] == 'n' || text[0] == 'N') {
                flockutils.sendChatMessage(this.userId, 'No problem! Remember, energy and persistence conquer all things.');
                this.endSession();
            } else if (text[0] == 'y' || text[0] == 'Y') {
                flockutils.sendChatMessage(this.userId, 'Awesome!');
                this.endSession();
            } else {
                flockutils.sendChatMessage(this.userId, 'Sorry, I didn\'t catch that! Reply with Y/N');
            }
        }
    }]);

    return CompleteTaskSession;
}(_ChatSession3.default);

exports.default = CompleteTaskSession;