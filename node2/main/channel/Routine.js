import Base from '../Base';

class Routine extends Base {
    constructor(isTime, action) {
        super();
        this.isTime = isTime;
        this.action = action;
    }

    startRoutine(userId) {
        var _this = this;
        return setInterval(function() {
            var date = new Date();
            if (_this.isTime(userId, _this.started, date)) {
                _this.action(userId, _this.started, date);
            }
        }, 60 * 1000);
    }

}

export default Routine;