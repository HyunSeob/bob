'use strict';

require('dotenv').config();
const channelId = process.env.SLACK_BOT_CHANNEL;

function getRandomRGB() {
  let letters ='0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function parseUserMessage(bot, text) {
  return text.replace(bot.user.id, '').replace('@밥', '').split(' ').filter((str) => str !== '');
}

function isBobMentioned(bot, data) {
  return data.text && (data.text.includes(bot.user.id) || data.text.includes('@밥'));
}

function isBobChannel(bot, data) {
  return data.channel && data.channel === channelId;
}

module.exports = {
  getRandomRGB: getRandomRGB,
  parseUserMessage: parseUserMessage,
  isBobMentioned: isBobMentioned,
  isBobChannel: isBobChannel
};
