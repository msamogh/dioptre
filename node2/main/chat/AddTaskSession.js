import ChatSession from './ChatSession';

class AddTaskSession extends ChatSession {
    constructor(userId) {
        super(userId);
        this.state = 0;
        this.task = {};       
    }

   makeLove() {
       this.task.taskName = 'fe';
   }

}

var a = new AddTaskSession('efe');
a.makeLove();