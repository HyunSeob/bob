'use strict';

// This code is written using the Node.js v5.4.1
// So, we can use cool features of ES2015.

require('dotenv').config();
const util        = require('util');
const path        = require('path');
const fs          = require('fs');
const Bot         = require('slackbots');
const db          = require('./models');
const attachments = require('./attachments');
const u           = require('./util');

const botSettings = {
  token: process.env.SLACK_BOT_TOKEN,
  name: 'bob'
};

let bot = new Bot(botSettings);
let users = {};
let channels = {};
let groups = {};

db.sequelize.sync();

bot.on('start', function() {
  bot.user = bot.users.filter((user) => user.name === bot.name)[0];
  // Create unregistered users And load all user data.
  bot.users.map(function (user) {
    if (user.id && user.name) {
      db.User.findOrCreate({
        where: {
          slack_id: user.id
        },
        defaults: {
          name: user.name,
          real_name: user.real_name,
          email: user.profile.email
        }
      }).spread(function(user, created) {
        let userData = user.get({ plain: true });
        userData.state = 'none';
        if (created) console.log('NEW USER: ', userData.name);
        users[userData.slack_id] = userData;
      });
    }
  });
  bot.channels.map(function (channel) {
    channels[channel.id] = channel;
  });
  bot.postTo('hyunseob.lee', `Start ${bot.user.name}!`, { icon_emoji: ':chorongchorong:' });
});

bot.on('message', function(data) {
  if (u.isBobMentioned(bot, data) || u.isBobChannel(bot, data) && data.text) {
    let args = u.parseUserMessage(bot, data.text);
    let receiver = '';
    // console.log(channels);
    console.log('DATA', data);
    // console.log('CHANNEL NAME', channels[data.channel]);
    // console.log('USER NAME', users[data.user]);

    if (u.isBobChannel(bot, data)) receiver = users[data.user].name;
    else receiver = channels[data.channel].name;

    if (args[0] === '안녕') {
      bot.postTo(receiver, '안녕! 나는 로앤컴퍼니의 점심 메뉴 선택을 책임지기 위해서 태어난 밥이야!\n뭘 할 수 있는지 궁금하면 `@밥 명령`을 입력해봐!', { icon_emoji: ':grin:' });
    } else if (args[0] === '명령') {
      bot.postTo(receiver, '내가 뭘 도와줄까?', attachments.commands);
    } else if (args[0] === '등록') {
      bot.postTo(receiver, '우와! 맛집을 등록할거야? 가게 이름을 말해줘. 하다가 잘못 입력하면 `취소`라고 해줘!', { icon_emoji: ':blushblush:' });
      users[data.user].state = 'registPlace1';
    } else if (args[0] === '기록') {
    } else if (args[0] === '취소') {
      users[data.user].state = 'none';
      users[data.user].place = {};
      bot.postTo(receiver, '취소됐어.', { icon_emoji: ':face_with_rolling_eyes:' });
    } else {
      if (users[data.user].state === 'registPlace1') {
        let placeName = args.join(' ');
        db.Place.findOne({
          where: {
            name: placeName
          }
        }).then(function (place) {
          if (place) {
            users[data.user].state = 'none';
            bot.postTo(receiver, '이미 등록된 정보가 있어서 취소됐어.', attachments.place(place.dataValues));
          } else {
            users[data.user].place = {};
            users[data.user].place.name = placeName
            users[data.user].state = 'registPlace2';
            bot.postTo(receiver, `${placeName}이구나! 이번엔 그 가게 메뉴랑 설명을 부탁할게! 너무 길게 하면 안돼!`, { icon_emoji: ':laughing:' });
          }
        });
      } else if (users[data.user].state === 'registPlace2') {
        users[data.user].place.desc = args.join(' ');
        users[data.user].state = 'registPlace3';
        bot.postTo(receiver, '마지막으로 가격대가 얼마정도야? 숫자만 입력해줘. 에러가 날지도 몰라.', { icon_emoji: ':sunglasses:' });
      } else if (users[data.user].state === 'registPlace3') {
        users[data.user].place.price = args[0];
        users[data.user].state = 'registPlace4';
        bot.postTo(receiver, '아래의 정보가 맞아? 맞으면 `응` 혹은 `맞아`라고 대답해줘! 정보가 틀리면 `취소`라고 대답해줘!', attachments.place(users[data.user].place));
      } else if (users[data.user].state === 'registPlace4') {
        if (args[0] === '응' || args[0] === '맞아') {
          db.Place
          .create(users[data.user].place)
          .then(function(place) {
            users[data.user].state = 'none';
            bot.postTo(receiver, '고마워, 맛집이 등록됐어!', attachments.place(place.dataValues, ':stuck_out_tongue_winking_eye:'));
          });
        }
      }
    }
  }
});
