'use strict';

var fs = require('fs');

module.exports = function (flock) {
	// Read tokens from a local file, if possible.
	var tokens;
	try {
		tokens = require('./tokens.json');
	} catch (e) {
		console.log('jk');
		tokens = {};
	}

	function getToken(userId) {
		return tokens[userId];
	}

	// save tokens on app.install
	flock.events.on('app.install', function (event) {
		var userId = event.userId;
		tokens[userId] = event.token;
	});

	// delete tokens on app.uninstall
	flock.events.on('app.uninstall', function (event) {
		delete tokens[event.userId];
	});

	return {
		cleanup: function() {
			fs.writeFileSync(__dirname + '/tokens.json', JSON.stringify(tokens));
		}
	};
};