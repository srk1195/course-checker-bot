require('dotenv').config();
const debug = require('debug')('app: 🤖');
const { bot } = require('./config');
const courses = require('./courses.json');
const webScrape = require('./courseStatus');
const { splitInToNButtons, welcome, help } = require('./utilities');

// Welcome and Setup Commands!
bot.start((ctx) => ctx.reply(welcome));
bot.help((ctx) => ctx.reply(help));

// Select the term!
bot.command('term', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, 'Terms', {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Fall 21 🍂', callback_data: 'Fall_21' },
          { text: 'Winter 22 ⛄', callback_data: 'Winter_22' },
        ],
      ],
    },
  });
});

// Genertate commands for each Subject to listen!
function generateBotActions(subject) {
  bot.action(subject.command, async (ctx) => {
    ctx.deleteMessage();
    const result = await webScrape(subject);
    const response = `
Course Name: ${subject['Course Name']}
Term: ${subject.term}
Capacity: ${result}
Other /courses
Get /help
LastCheckedAt: ${new Date().toLocaleString()}
    `;
    ctx.reply(response);
  });
}

// Menu Setup!
let inlineCourseButtons = [];
let term;

bot.action('Fall_21', (ctx) => {
  ctx.deleteMessage();

  inlineCourseButtons = splitInToNButtons('Fall_21', 1);

  term = 'Fall 21 🍂';
  courses.Fall_21.map((item) => generateBotActions(item));
  const replyMessage = `Term Set to: Fall 21 🍂
  View Fall Courses : /courses`;
  ctx.reply(replyMessage);
});

bot.action('Winter_22', (ctx) => {
  ctx.deleteMessage();
  inlineCourseButtons = splitInToNButtons('Winter_22', 1);

  term = 'Winter 22 ⛄';
  courses.Winter_22.map((item) => generateBotActions(item));
  const replyMessage = `Term Set to: Winter 22 ⛄
  View Winter Courses : /courses`;
  ctx.reply(replyMessage);
});

// Inline buttons!
bot.command('courses', (ctx) => {
  ctx.telegram.sendMessage(ctx.chat.id, `${term} Courses`, {
    reply_markup: {
      inline_keyboard: inlineCourseButtons,
    },
  });
});

// Rest of the commands
bot.command('currentTerm', (ctx) => {
  ctx.reply(`Current Term is: ${term}
  To change it click /term`);
});

bot.action('help', (ctx) => {
  ctx.reply(help);
});

bot.command('info', (ctx) => {
  ctx.reply(`This bot is only for education purposes! 
  Don't Forward it to wrong hands! -RK`);
});

bot.command('gitLink', (ctx) => {
  ctx.reply('www.google.com');
});

// Launch the bot!
if (process.env.NODE_ENV === 'DEVELOPMENT') {
  debug('Bot Started!');
  bot.launch();
} else {
  module.exports = bot;
}
