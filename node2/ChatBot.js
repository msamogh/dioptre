const config = require('./config.js')
const builder = require('botbuilder');
const recast = require('recastai');

const connector = new builder.ChatConnector({
  appId: config.appId,
  appPassword: config.appPassword,
});

const bot = new builder.UniversalBot(connector);
const recastClient = new recast.Client(config.recast);

bot.dialog('/', (session) => {
  console.log(session.message.text)
});
