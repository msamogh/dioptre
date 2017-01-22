'use strict';

var flock = require('./flockos');
var tokens = require('./tokenhandler');

flock.setAppId('c4171ca1-37f2-47aa-975e-928dbb05fec5');
flock.setAppSecret('59c60fd2-6979-432f-8776-39aa25ffccad');


module.exports = {
	sendChatMessage: function sendChatMessage(userId, text, flockml) {
		flock.callMethod('chat.sendMessage', '7092c698-4b8b-4685-aa98-ec03ea39066a', {
			to: userId,
			text: text,
			flockml: flockml
		}, function (error, response) {
			if (!error) {
				console.log(response);
			} else {
				console.log(response);
				console.log(error);
			}
		});
	},

	newHabit: function(userId, desc) {
		console.log('Poking');
		flock.callMethod('chat.sendMessage', '7092c698-4b8b-4685-aa98-ec03ea39066a', {
			to: userId,
			text: 'Add routine',
			attachments: [{
				"description": desc,
				"views": {
					"widget": { "src": "https://zenflock.herokuapp.com/channels/new?userId=" + userId, "width": 400, "height": 700 }
				}
			}]
		});
	},

	sendStreakUpdate: function(userId, streak) {
		this.sendChatMessage(userId, '',"<flockml>Your current streak is <b>" + streak + "</b>. </flockml>");
	},

	routinePoke: function(userId, name, message, routineId) {
		flock.callMethod('chat.sendMessage', '7092c698-4b8b-4685-aa98-ec03ea39066a', {
			to: userId,
			attachments: [{
				"title": name,
				"description": "",
				"views": {
					"flockml": "<flockml>Reminder: " + message + "<br />Did you complete the task?</flockml>"
			    },
				"buttons": [{
					"name": 'I completed it!',
					"action": {'type': 'sendEvent'},
					"icon": "https://www.shareicon.net/data/128x128/2015/10/08/653159_check_512x512.png",
					"id": "yes;" + routineId
				}, {
					"name": 'Not this time',
					"action": {'type': 'sendEvent'},
					"icon": "https://cdn0.iconfinder.com/data/icons/controls-and-navigation-arrows-3/24/146-128.png",
					"id": "no;" + routineId
				}]
			}]
		});
	},

	sendAttachmentMessage: function sendAttachmentMessage(userId, aTitle, aDesc, aSrc) {
		flock.callMethod('chat.sendMessage', '7092c698-4b8b-4685-aa98-ec03ea39066a', {
			to: userId,
			attachments: [{
				title: aTitle,
				description: aDesc,
				views: {
					widget: {
						src: aSrc,
						width: 600,
						height: 400
					}
				}
			}]
		}, function (error, response) {
			console.log(error);
		});
	},

	initUserAttrs: function initUserAttrs(userId) {
		chrome_config[userId] = {};
		user_stats[userId] = {};
		user_stats[userId]['tasks'] = [];
		user_stats[userId]['todos'] = [];
		user_stats[userId]['bot'] = undefined;
		user_stats[userId]['routines'] = [];
	}
};