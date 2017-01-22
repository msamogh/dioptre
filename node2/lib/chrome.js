'use strict';

var flockutils = require('./flockutils');

module.exports = {
	setZenMode: function setZenMode(userId, mode) {
		if (!(userId in chrome_config)) {
			flockutils.initUserAttrs(userId);
		}
		chrome_config[userId]['mode'] = mode;
		chrome_config[userId]['audio'] = mode == ZEN ? PLAYING : MUTED;
	},

	setAudioPlaying: function setAudioPlaying(userId, playing) {
		if (!(userId in chrome_config)) {
			flockutils.initUserAttrs(userId);
		}
		chrome_config[userId]['audio'] = playing;
	}
};