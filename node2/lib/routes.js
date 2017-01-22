'use strict';

var Frequency = require('date-frequency');

var _Routine = require('./routine/Routine');

var _Routine2 = _interopRequireDefault(_Routine);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var tasks = require('./tasks');
var stats = require('./stats');
var path = require("path");
var flockutils = require('./flockutils');
var flock = require('./flockos');
var tokenhandler = require('./tokenhandler')(flock);

module.exports = function (endTask) {
  'use strict';

  var router = require('express').Router();

  router.get('/', function (req, res) {
    res.send('Thanks for installing');
  });

  router.get('/status', function (req, res) {
    var userId = req.query.userId;
    try {
      if (userId in chrome_config) res.send(chrome_config[req.query.userId]['mode']);else res.send('wtf man');
    } catch (e) {
      console.log(e);
    }
  });

  router.get('/audio', function (req, res) {
    try {
      var userId = req.query.userId;
      if (userId in chrome_config) res.send(chrome_config[req.query.userId]['audio']);else res.send('wtf man');
    } catch (e) {
      console.log(e);
    }
  });

  router.get('/timeout', function (req, res) {
    var userId = req.query.userId;
    endTask(userId);
  });

  

  router.get('/stats', function (req, res) {
    flockutils.initUserAttrs('u:nuxrclfnxddqlcdr');

    user_stats['u:nuxrclfnxddqlcdr']['tasks'].push({
      taskName: 'Do shit',
      started: new Date(),
      ongoing: false,
      completed: true
    });

    user_stats['u:nuxrclfnxddqlcdr']['tasks'].push({
      taskName: 'Do more shit',
      started: new Date(),
      ongoing: false,
      completed: true
    });

    var userId = req.query.userId;
    var dayWise = [];
    var today = new Date();
    for (var i = 0; i < 7; i++) {
      var r = new Date(today.getTime());
      r.setDate(today.getDate() - i);
      console.log(stats.getTasksForDate(userId, r));
      dayWise.push({day: r, tasks: stats.getTasksForDate(userId, r)});
    }
    stats.getTasksForDate()
    console.log('penguin');
    console.log(user_stats[userId].routines);
    res.render('webapp/stats', {userId: userId, dayWise: dayWise, routines: user_stats[userId].routines, getRoutine: _Routine2.default.getRoutine});
  });

  //var drinkWater = new  _Routine2.default('u:nuxrclfnxddqlcdr', 'drinkWater', 
    //    'Stay hydrated', 'Reminds you to sip some water every 30 minutes', 'Drink water!', new Frequency());

  router.get('/channels', function (req, res) {
    res.render('webapp/channels', { userId: req.query.userId, routines: _Routine2.default.getRoutines() });
  });

  router.get('/channels/new', function(req, res) {
    res.render('webapp/often', {userId: req.query.userId});
  });

  var juration = require('./juration');
  var chrono = require('chrono-node');

  router.get('/channels/create', function(req, res) {
    console.log(req.query.freq);
    new _Routine2.default(req.query.userId, new Date().getTime() + '', req.query.name, 
      req.query.desc, req.query.msg, req.query.freq);
  });

  router.get('/channels/subscribe/:id', function (req, res) {
    var id = req.params.id;
    var userId = req.query.userId;
    _Routine2.default.getRoutine(id).addUser(userId);
    res.send('Subscribed!');
  });

  router.get('/channels/unsubscribe/:id', function (req, res) {
    var id = req.params.id;
    var userId = req.query.userId;
    _Routine2.default.getRoutine(id).removeUser(userId);
    flockutils.sendChatMessage(userId, 'Unsubscribed from ' + req.params.id);
    res.send('Unsubscribed');
  });

  router.get('/leaderboard', function(req, res) {
    res.render('leaderboard', { userId: req.query.userId });
  });

  router.get('/newTask', function(req, res) {
    res.render('webapp/newTask', {userId: req.query.userId});
  });

  var request = require('request');
  var get = require('get-urls');
  var html = '<html>Error</html>';

  router.get('/readable', function(req, res) {
    var event = JSON.parse(req.query.flockEvent);
    console.log(event);
    console.log(event['userId']);
    console.log(tokenhandler.getToken(event['userId']));
    console.log(event['messageUids']['messageUid']);
    flock.callMethod('chat.fetchMessages', tokenhandler.getToken(event['userId']), {
        token: tokenhandler.getToken(event['userId']),
        chat: event['chat'],
        uids: [event.messageUids.messageUid]
    }, function(error, messages) {
      if (!error) {
        console.log('logging like a boss');
        console.log(messages);
        console.log(messages);
        console.log(messages);
        console.log(messages);
          for (var i = 0; i < messages.length; i++) {
              var message = messages[i].text;
              console.log(message);
              var url = undefined;
              for (var i of get(message)) {
                url = i;
                break;
              }
              var options = {
                  url: 'https://mercury.postlight.com/parser?url=' + url,
                  headers: {
                      'x-api-key': 'F1osgIGXz4OIoWxTgkzmkVRQsslUo14PBSgJ1sq1'
                  }
              };
              console.log(get(message));
              request(options, function(error, response, body) {
                  if (!error & response.statusCode == 200) {
                      var result = JSON.parse(body);
                      html = result.content;
                      console.log(html);
                      res.writeHeader(200, {"Content-Type": "text/html"});  
                      res.write(html);  
                      res.end();  
                      console.log(result.content);
                  } else {
                      console.log(error);
                  }
              });
          }
      } else {
        console.log('Fucking hate this');
        console.log(error);
      }
    });
    console.log('Here I come!!!');
    console.log(html);
    
  });

  router.get('/todos', function (req, res) {
    var userId = req.query.userId;
    var todaysTasks = stats.getTasksForDate(userId, new Date());
    var completedTasks = [];
    for (var task in todaysTasks) {
      if (task.completed) {
        completedTasks.push(task);
      }
    }
    res.render('stats', { name: 'Amogh', stats: user_stats[userId] });
  });

  return router;
};
