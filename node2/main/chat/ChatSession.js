import Base from '../Base';

class ChatSession extends Base {
    constructor(userId) {
        super();
        this.userId = userId;
    }

    endSession() {
        user_stats[userId]['bot'] = undefined;
    }
}

export default ChatSession;