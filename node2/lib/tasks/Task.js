import Base from '../Base';

class Task extends Base {
    constructor(userId, taskName, priority) {
        super();
        this.userId = userId;
        this.taskName = taskName;
        this.priority = priority;
        if (!('tasks' in user_stats[userId]))
            user_stats[userId].tasks = [];
        user_stats[userId].tasks.push(this);
    }
}