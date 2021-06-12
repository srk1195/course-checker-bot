const { Composer } = require('micro-bot');
const { Telegraf } = require('telegraf');
const debug = require('debug')('app:config:  :hammer_and_wrench:   ');

let puppeteerConfig = {};
let bot;

debug(`App runninng on Environment: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === 'DEVELOPMENT') {
  bot = new Telegraf(process.env.BOT_TOKEN);
  puppeteerConfig = {
    executablePath: process.env.BROWSER,
    headless: false,
  };
} else {
  bot = new Composer();
  puppeteerConfig = { args: ['--no-sandbox'] };
}

module.exports = { bot, puppeteerConfig };
