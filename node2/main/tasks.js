'use strict';

var flockutils = require('./flockutils');
var chrome = require('./chrome');
var chatbot = require('./chatbot');

module.exports = function (setZenMode) {
	var tasks = {
		beginTask: function beginTask(userId, taskName) {
			if (!(userId in user_stats)) flockutils.initUserAttrs(userId);

			if (user_stats[userId]['tasks'].length > 0 && user_stats[userId]['tasks'][user_stats[userId]['tasks'].length - 1].ongoing) {
				return false;
			} else {
				setZenMode(userId, ZEN);
				// Add to task history list
				user_stats[userId]['tasks'].push({
					taskName: taskName,
					started: new Date(),
					ongoing: true,
					completed: false
				});
				return true;
			}
		},

		endTask: function endTask(userId) {
			if (!(userId in user_stats)) {
				flockutils.initUserAttrs(userId);
			}
			setZenMode(userId, NORMAL);
			var nTasks = user_stats[userId]['tasks'].length;
			user_stats[userId]['tasks'][nTasks - 1].ongoing = false;
			var currentTask = user_stats[userId]['tasks'][nTasks - 1];

			chatbot.startSession(userId, 'complete');
		}
	};
	return tasks;
};