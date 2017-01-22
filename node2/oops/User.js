import Base from './Base';

var users = [];

class User extends Base {
    constructor(userId, fName, lName) {
        this.userId = userId;
        this.fName = fName;
        this.lName = lName;
        this.routines = [];
        users.push(this);
    }

    hasSubscribed(routineId) {
        for (var routine in this.routines) {
            if (routine.id == routerId)
                return true;
        }
        return false;
    }

    subscribe(routineId) {
        if (!this.hasSubscribed(routerId)) {
            this.routines.push({
                routine: routineId,
                from: new Date()
            });
        }
    }

    static getUser(userId) {
        for (var user in users) {
            if (user.userId == userId)
                return user;
        }
        return null;
    }

    static removeUser(userId) {
        for (var i = 0; i < users.length; i++) {
            if (users[i].userId == userId) {
                users.splice(i, 1);
                break;
            }
        }
    }
}

export default User;