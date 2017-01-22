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

var msgs = require('./todo.json');
var flockutils = require('../flockutils');

var AddTaskSession = function (_ChatSession) {
    _inherits(AddTaskSession, _ChatSession);

    function AddTaskSession(userId) {
        _classCallCheck(this, AddTaskSession);

        var _this = _possibleConstructorReturn(this, (AddTaskSession.__proto__ || Object.getPrototypeOf(AddTaskSession)).call(this, userId));

        _this.state = 0;
        _this.task = {};
        return _this;
    }

    _createClass(AddTaskSession, [{
        key: 'initConversation',
        value: function initConversation() {
            flockutils.sendChatMessage(this.userId, msgs.sequence[this.state].question);
        }
    }, {
        key: 'handleTaskName',
        value: function handleTaskName(text) {
            this.task.taskName = text;
            this.task.created = new Date();
            return true;
        }
    }, {
        key: 'handleNumberOfSessions',
        value: function handleNumberOfSessions(text) {
            var num = parseInt(text) || -1;
            if (num > 0) {
                this.task.numSessions = num;
                return true;
            }
            return false;
        }
    }, {
        key: 'handleDreadScale',
        value: function handleDreadScale(text) {
            var num = parseInt(text) || -1;
            if (num > 0 && num < 6) {
                this.task.dread = num;
                return true;
            }
            return false;
        }
    }, {
        key: 'success',
        value: function success() {
            user_stats[this.userId]['todos'].push(this.task);
        }
    }, {
        key: 'advanceState',
        value: function advanceState() {
            this.state++;
            if (this.state == msgs.sequence.length) {
                this.success();
                this.endSession();
            } else {
                flockutils.sendChatMessage(this.userId, msgs.sequence[this.state].question);
            }
        }
    }, {
        key: 'retryState',
        value: function retryState() {
            flockutils.sendChatMessage(this.userId, msgs.sequence[this.state].exception);
        }
    }, {
        key: 'onMessage',
        value: function onMessage(text) {
            var fMap = {
                'handleTaskName': this.handleTaskName.bind(this),
                'handleNumberOfSessions': this.handleNumberOfSessions.bind(this),
                'handleDreadScale': this.handleDreadScale.bind(this)
            }
            if (fMap[msgs.sequence[this.state].handler](text)) {
                this.advanceState();
            } else {
                this.retryState();
            }
        }
    }]);

    return AddTaskSession;
}(_ChatSession3.default);

exports.default = AddTaskSession;