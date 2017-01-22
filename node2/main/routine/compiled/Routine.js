'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Base2 = require('../Base');

var _Base3 = _interopRequireDefault(_Base2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Routine = function (_Base) {
    _inherits(Routine, _Base);

    function Routine(name, isTime, action) {
        _classCallCheck(this, Routine);

        var _this = _possibleConstructorReturn(this, (Routine.__proto__ || Object.getPrototypeOf(Routine)).call(this));

        _this.name = name;
        _this.isTime = isTime;
        _this.action = action;
        _this.started = new Date();
        setInterval(function () {
            var date = new Date();
            if (this.isTime(started, date)) {
                this.action(started, date);
            }
        }, 60 * 1000);
        return _this;
    }

    return Routine;
}(_Base3.default);

exports.default = Routine;