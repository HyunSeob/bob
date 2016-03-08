'use strict';

require('dotenv').config();
const channelId = process.env.SLACK_BOT_CHANNEL;
const moment = require('moment');
moment.locale('ko');

function getRandomRGB() {
  let letters ='0123456789ABCDEF'.split('');
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function parseUserMessage(bot, text) {
  let re = new RegExp(`<@${bot.user.id}>?:`, 'g');

  return text
  .replace(re, '')
  .replace('@밥', '')
  .split(' ')
  .filter((str) => str !== '');
}

function isBobMentioned(bot, data) {
  return data.user && data.text && (data.text.includes(bot.user.id) || data.text.includes('@밥'));
}

function isBobChannel(bot, data) {
  return data.user && data.channel && data.channel === channelId;
}

function formatTime(time) {
  return moment(time).utcOffset('+0900').format('YYYY년 M월 D일 A h시');
}

module.exports = {
  getRandomRGB: getRandomRGB,
  parseUserMessage: parseUserMessage,
  isBobMentioned: isBobMentioned,
  isBobChannel: isBobChannel,
  formatTime: formatTime
};
