import Base from '../Base';
var flockutils = require('../flockutils');
var Frequency = require('date-frequency');
var chrono = require('chrono-node');

var routines = [];

class Routine extends Base {

    constructor(owner, id, name, desc, msg, freq) {
        super();
        this.owner = owner;
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.msg = msg;
        if (freq.indexOf(' every ') != -1) {
            this.atOrEvery = 'every';
            var index = freq.indexOf(' every ');
            var ms = juration.parse(freq.substring(freq.indexOf(' every ') + ' every '.length));
            this.ms = ms;
        } else {
            this.atOrEvery = 'at';
            var date = chrono.parseDate(freq);
            this.time = {h: date.getHours(), m: date.getMinutes()};
        }
        routines.push(this);
    }

    isSubscribed(userId) {
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

    getTimeUntilNext(date, last) {
        if (this.atOrEvery == 'at') {
            var newDate = new Date(date.getTime());
            newDate.setHours(this.time.h);
            newDate.setMinutes(this.time.m);
            if (newDate.getTime() - date.getTime() < 0)
                newDate.setDate(date.getDate() + 1);
            return newDate.getTime() - date.getTime();
        } else {
            return last.getTime() + this.ms - date.getTime();
        }
    }

    getRoutineInUser(userId) {
        for (var i = 0; i < user_stats[userId].routines.length; i++) {
            var routine = user_stats[userId].routines[i];
            if (routine.id == this.id)
                return routine;
        }
        return undefined;
    }

    addUser(userId) {
        var _this = this;
        if (!this.isSubscribed(userId)) {
            console.log(Routine.getRoutines());
            var date = new Date();
            if (userId in user_stats) {
                user_stats[userId].routines.push({
                    id: _this.id,
                    streak: 0,
                    started: date
                });
            
                setTimeout(function() {
                    _this.action(userId);
                }, _this.getTimeUntilNext(date, date));
            }
        }
    }

    removeUser(userId) {
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

    action(userId) {
        if (!this.isSubscribed(userId))
            return;
        
        var date = new Date();
        var routine = this.getRoutineInUser(userId);
        var before = routine.started;
        if (this.atOrEvery == 'every') {
            routine.started = date;
        }
        var _this = this;
        flockutils.sendChatMessage(userId, this.msg);
        setTimeout(function() {
            _this.action(userId);
        }, _this.getTimeUntilNext(date, before));
    }

    static getRoutines() {
        return routines;
    }

    static getRoutine(routineId) {
        for (var i = 0; i < routines.length; i++) {
            var routine = routines[i];
            if (routine.id == routineId)
                return routine;
        }
        return null;
    }
}

export default Routine;