'use strict';

var flockutils = require('./flockutils');

module.exports = {
    getTasksForDate: function getTasksForDate(userId, date) {
        if (!(userId in user_stats)) {
            flockutils.initUserAttrs(userId);
            return;
        } else if (!(user_stats[userId]['tasks'].length == 0)) {
            return;
        }
        var dayStart = new Date(date.getTime()).setHours(0, 0, 0, 0); // Gets timestamp of start of the day
        var dayEnd = new Date(date.getTime()).setHours(23, 59, 59, 999); // Gets timestamp of end of the day

        var tasks = user_stats[userId]['tasks'];
        console.log(tasks.length + ' number of tasks');
        tasks.reverse();
        var result = [];
        for (var task in tasks) {
            if (task['started'].getTime() < dayEnd.getTime() && task['started'].getTime() > dayStart.getTime()) {
                console.log('Gotcha');
                result.push(task);
            } else {
                console.log('Didnt getcha');
            }
        }
        console.log(result);
        return result;
    },

    displayStats: function displayStats(userId) {
        flockutils.sendAttachmentMessage(userId, 'Your stats', '', 'https://zenflock.herokuapp.com/stats?userId=' + userId);
    }

};