'use strict';

var flock = require('./flockos');

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
			}
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
		user_stats[userId]['tasks'] = [{
			taskName: 'Buy more bread',
			started: new Date(),
			ongoing: true,
			completed: false
		}];
		user_stats[userId]['todos'] = [];
		user_stats[userId]['bot'] = undefined;
	}
};