'use strict';

var tasks = require('./tasks');
var stats = require('./stats');
var path    = require("path");

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
    console.log('Timeout');
    endTask(userId);
  });

  router.get('/stats', function(req, res) {
    console.log(user_stats[req.query.userId].todos);
    res.render('webapp/index', {todos: user_stats[req.query.userId].todos});
    //res.sendFile(path.join(__dirname + '/views/pages/webapp/' + (req.query.page || 'index') + '.html'));
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