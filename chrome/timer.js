BASE = 'https://zenflock.herokuapp.com'
//MINUTE = 500;
MINUTE = 60 * 1000;
ZEN_MODE = 'zen';
NORMAL_MODE = 'normal';

PLAYING = 'playing';
MUTED = 'muted';

whiteNoise = new Audio();
whiteNoise.loop = true;
whiteNoise.src = 'white.mp3';

userId = 'u:nuxrclfnxddqlcdr';
paused = false;

function doIt(details) { return {cancel: true}; }

function disableDistractions() {
	chrome.webRequest.onBeforeRequest.addListener(
	       doIt,
	       {urls: [ "*://*.facebook.com/*", "*://*.twitter.com/*", "*://*.reddit.com/*"]},
	       ["blocking"]);
	
	whiteNoise.play();
}

function enableDistractions() {
	chrome.webRequest.onBeforeRequest.removeListener(doIt);
	$.ajax({
		type: 'GET',
		url: BASE + '/timeout?userId=' + userId,
		success: function() {
			console.log('Timeout successful');
		}
	});
	whiteNoise.pause();
}

function startTimer(duration) {
	startTimeMs = new Date().getTime();
	disableDistractions();

	chrome.browserAction.setBadgeText({text: String(duration / MINUTE)});

	// Decrements badge count every minute
	var badge = setInterval(function() {
		var remainingMinutes = String(Math.ceil(((startTimeMs + duration) - new Date().getTime()) / MINUTE));
		console.log(remainingMinutes);
		chrome.browserAction.setBadgeText({text: remainingMinutes});
	}, 1 * MINUTE);

	setTimeout(function() {
		clearInterval(badge);
		chrome.browserAction.setBadgeText({text: ''});
		enableDistractions();
		paused = false;
	}, duration);
}

setInterval(function() {
	if (!paused) {
		$.get(BASE + '/status?userId=' + userId, function(data) {
			if (data != null) {
				if (data == ZEN_MODE) {
					console.log("I'm a fucking zen");
					startTimer(25 * MINUTE);
					paused = true;
				}
			}
		});
	}
}, 2000);

setInterval(function() {
	if (paused) {
		$.get(BASE + '/audio?userId=' + userId, function(data) {
			if (data != null) {
				if (data == MUTED) {
					whiteNoise.pause();
				} else {
					whiteNoise.play();
				}
			}
		});
	}
}, 2000);
