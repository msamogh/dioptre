'use strict';

var flockutils = require('./flockutils');

module.exports = {
    getTasksForDate: function getTasksForDate(userId, date) {
        console.log(date);
        if (!(userId in user_stats)) {
            flockutils.initUserAttrs(userId);
            return [];
        } else if ((user_stats[userId]['tasks'].length == 0)) {
            return [];
        }
        var dayStart = new Date(date.getTime());
        dayStart.setHours(0, 0, 0, 0); // Gets timestamp of start of the day
        var dayEnd = new Date(date.getTime()); // Gets timestamp of end of the day
        dayEnd.setHours(23, 59, 59, 999);

        var tasks = user_stats[userId]['tasks'];
        console.log(tasks);
        
        tasks.reverse();
        var result = [];
        for (var i = 0; i < tasks.length; i++) {
            var task = tasks[i];
            
            if (task['started'].getTime() < dayEnd.getTime() && task['started'].getTime() > dayStart.getTime()) {
                result.push(task);
            } else {
                console.log('Didnt getcha');
            }
        }
        
        return result;
    },

    displayStats: function displayStats(userId) {
        flockutils.sendAttachmentMessage(userId, 'Your stats', '', 'https://zenflock.herokuapp.com/stats?userId=' + userId);
    }

};