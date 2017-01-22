import Base from './Base';

var allChannels = []; // TODO persist to JSON file and read from it rather than keep in memory

class Channel extends Base {

    constructor(id, name, desc, routine) {
        super();
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.routine = routine;
        allChannels.push(this);
    }

    hasSubscribed(userId) {
        if (!('channels' in user_stats[userId]))
            return -1;
        var length = user_stats[userId].channels.length;
        for (var i = 0; i < length; i++) {
            if (user_stats[userId].channels[i].id == this.id)
                return i;
        }
        return -1;
    }

    activateFor(userId) {
        var _this = this;
        if (hasSubscribed(userId == -1)) {
            if (!('channels' in user_stats[userId]))
                user_stats[userId].channels = [];

            user_stats[userId].channels.push({
                id: _this.id
            });
            return _this.routine.startRoutine(userId);
        }
        return undefined;
    }

    getDetails() {
        return {name: this.name, desc: this.desc};
    }

    deactivateFor(userId) {
        var index = hasSubscribed(userId);
        if (index > -1) {
            user_stats[userId].channels.splice(index, 1);
        }
    }

    static channels() {
        return allChannels;
    }

}