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

function cancelAllState(bot, user, receiver) {
  user.state = 'none';
  user.place = {};
  bot.postTo(receiver, '취소됐어.', { icon_emoji: ':face_with_rolling_eyes:' });
}

bot.on('start', function() {
  bot.user = bot.users.filter((user) => user.name === bot.name)[0];
  // Create unregistered users And load all user's data.
  bot.users.map(function(user) {
    if (user.id && user.name) {
      db.User.findOrCreate({
        where: { slack_id: user.id },
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
  bot.channels.map(function(channel) {
    channels[channel.id] = channel;
  });
  bot.groups.map(function(group) {
    channels[group.id] = group;
  });
});

bot.on('message', function(data) {
  let receiver = '';

  if (data.channel && channels[data.channel]) receiver = channels[data.channel].name;
  else if (data.user && users[data.user]) receiver = users[data.user].name;
  else return;

  if (u.isBobMentioned(bot, data) || u.isBobChannel(bot, data) && data.text) {
    let args = u.parseUserMessage(bot, data.text);

    if (args[0] === '안녕') {
      bot.postTo(receiver, '안녕! 나는 로앤컴퍼니의 점심 메뉴 선택을 책임지기 위해서 태어난 밥이야!\n뭘 할 수 있는지 궁금하면 `@밥 명령`을 입력해봐!', { icon_emoji: ':grin:' });
    } else if (args[0] === '명령') {
      bot.postTo(receiver, '내가 뭘 도와줄까?', attachments.commands);
    } else if (args[0] === '등록') {
      bot.postTo(receiver, '우와! 가게를 등록할거야? 가게 이름을 말해줘.\n하다가 잘못 입력하면 `취소`라고 해줘!', { icon_emoji: ':blushblush:' });
      users[data.user].state = 'registPlace1';
      return;
    } else if (args[0] === '추천') {
      db.Place
      .count()
      .then(function(count) {
        return db.Place.findOne({
          where: { id: 1 + Math.floor(Math.random() * count) },
          include: { model: db.User }
        });
      })
      .then(function(place) {
        bot.postTo(
          receiver,
          '오늘은 여기 어때?',
          attachments.place({
            name: place.dataValues.name,
            desc: place.dataValues.desc,
            price: place.dataValues.price,
            informer: place.dataValues.User.dataValues.name
          }, ':chorongchorong:')
        );
      });
    } else if (args[0] === '가게') {
      db.Place.findAll({
        include: { model: db.User }
      }).then(function(places) {
        bot.postTo(receiver, '가게 목록이야.', attachments.places(places));
      });
    } else if (args[0] === '기록') {
      bot.postTo(receiver, '식사 기록을 남기면 추천이 정확해 질거야! 가게 이름이 뭐야?\n잘못 입력했으면 `취소`라고 해줘!', { icon_emoji: ':kissing:' });
      users[data.user].state = 'record1';
      return;
    } else if (args[0] === '로그') {
      db.Log.findAll({
        where: { UserSlackId: data.user },
        include: { model: db.Place }
      }).then(function(logs) {
        bot.postTo(receiver, '지금까지 갔던 곳들이야.', attachments.logs(logs));
      });
    } else if (args[0] === '뭐야') {
      bot.postTo(
        receiver,
        `>>> *밥* v0.1.0
https://github.com/HyunSeob/bob
Copyright (c) 2016, HyunSeob. Licensed under the MIT license.
_맛있는 점심 드세요!_
        `, { icon_emoji: ':grin:' }
      );
    } else if (args[0] === '테스트') {
      return;

      let userObject = {};
      let ratingObject = {};
      let placeObject = {};

      db.User
      .findOne({ where: { slack_id: data.user } })
      .then(function(user) {
        userObject = user;
        return db.Place.create({
          name: '돈뜰',
          desc: '테스트 중',
          price: 6000
        });
      })
      .then(function(place) {
        placeObject = place;
        return db.Rating.create({ rating: 5 });
      })
      .then(function(rating) {
        placeObject.addRating(rating);
        return userObject.addRating(rating);
      })
      .then(() => userObject.getRatings())
      .then((ratings) => console.log('Ratings', ratings));

    } else if (args[0] === '취소') {
      cancelAllState(bot, users[data.user], receiver);
    }
  }

  // Only for specific state
  if (data.text) {
    if (users[data.user].state === 'registPlace1') {
      let placeName = data.text;
      db.Place.findOne({
        where: { name: placeName },
        include: { model: db.User }
      }).then(function (place) {
        if (place) {
          users[data.user].state = 'none';
          bot.postTo(
            receiver,
            '이미 등록된 정보가 있어서 취소됐어.',
            attachments.place({
              name: place.dataValues.name,
              desc: place.dataValues.desc,
              price: place.dataValues.price,
              informer: place.dataValues.User.dataValues.name
            })
          );
        } else {
          users[data.user].place = {};
          users[data.user].place.name = placeName
          users[data.user].state = 'registPlace2';
          bot.postTo(receiver, `${placeName}이구나! 이번엔 그 가게 메뉴랑 설명을 부탁할게, 너무 길게 하면 안돼!`, { icon_emoji: ':laughing:' });
        }
      });
    } else if (users[data.user].state === 'registPlace2') {
      users[data.user].place.desc = data.text;
      users[data.user].state = 'registPlace3';
      bot.postTo(receiver, '마지막으로 가격대가 얼마정도야? 숫자만 입력해줘. 에러가 날지도 몰라.', { icon_emoji: ':sunglasses:' });
    } else if (users[data.user].state === 'registPlace3') {
      let args = u.parseUserMessage(bot, data.text);
      users[data.user].place.price = args[0];
      users[data.user].state = 'registPlace4';
      bot.postTo(
        receiver,
        '아래의 정보가 맞아? 맞으면 `응` 혹은 `맞아`라고 대답해줘! 정보가 틀리면 `취소`라고 대답해줘!',
        attachments.place({
          name: users[data.user].place.name,
          desc: users[data.user].place.desc,
          price: users[data.user].place.price,
          informer: users[data.user].name
        })
      );
    } else if (users[data.user].state === 'registPlace4') {
      let args = u.parseUserMessage(bot, data.text);
      if (args[0] === '응' || args[0] === '맞아') {
        db.User.findOne({
          where: { slack_id: data.user }
        }).then(function(user) {
          user
          .createPlace(users[data.user].place)
          .then(function(place) {
            users[data.user].state = 'none';
            users[data.user].place = {};
            bot.postTo(
              receiver,
              '고마워, 가게가 등록됐어!',
              attachments.place({
                name: place.dataValues.name,
                desc: place.dataValues.desc,
                price: place.dataValues.price,
                informer: users[data.user].name
              }, ':stuck_out_tongue_winking_eye:')
            );
          });
        });
      } else if (args[0] === '취소') {
        cancelAllState(bot, users[data.user], receiver);
      }
    } else if (users[data.user].state === 'record1') {
      let placeName = data.text;
      db.Place.findOne({
        where: { name: placeName },
        include: { model: db.User }
      }).then(function (place) {
        if (place) {
          db.Rating.findOne({
            where: {
              UserSlackId: data.user,
              PlaceId: place.dataValues.id
            }
          }).then(function(rating) {
            if (rating) {
              users[data.user].state = 'record3';
              users[data.user].place = place;
              bot.postTo(
                receiver,
                placeName + '에 다녀왔구나! 이대로 입력할까?\n입력하려면 `응` 혹은 `맞아`라고 대답해줘. 취소하려면 `취소`라고 입력해줘.',
                attachments.place({
                  name: place.dataValues.name,
                  desc: place.dataValues.desc,
                  price: place.dataValues.price,
                  informer: place.dataValues.User.dataValues.name
                },':kissing_smiling_eyes:')
              );
            } else {
              users[data.user].state = 'record2';
              users[data.user].place = place;
              bot.postTo(
                receiver,
                `${placeName}에 다녀왔구나! 오늘의 평점을 1점에서 10점 사이로 숫자만 입력해줘.`,
                attachments.place({
                  name: place.dataValues.name,
                  desc: place.dataValues.desc,
                  price: place.dataValues.price,
                  informer: place.dataValues.User.dataValues.name
                },':kissing_smiling_eyes:')
              );
            }
          });
        } else {
          bot.postTo(receiver, '앗! 등록되지 않은 가게야. 다시 입력해봐!', { icon_emoji: ':confused:' });
        }
      });
    } else if (users[data.user].state === 'record2') {
      let args = u.parseUserMessage(bot, data.text);
      let rating = parseInt(args[0]);
      if (rating > 10 || rating < 1) bot.postTo(receiver, '점수를 잘 못 입력했어. 다시 입력해볼래?', { icon_emoji: ':anguished:' });
      else {
        users[data.user].rating = rating;
        users[data.user].state = 'record3';
        bot.postTo(
          receiver,
          '아래의 정보가 맞아? 맞으면 `응` 혹은 `맞아`라고 대답해줘!\n정보가 틀리면 `취소`라고 대답해줘!',
          attachments.log({
            placeName: users[data.user].place.dataValues.name,
            rating: rating
          })
        );
      }
    } else if (users[data.user].state === 'record3') {
      let args = u.parseUserMessage(bot, data.text);
      if (args[0] === '응' || args[0] === '맞아') {
        db.User.findOne({
          where: { slack_id: data.user }
        }).then(function(user) {
          user.createLog().then(function(log) {
            users[data.user].place.addLog(log);
            if (users[data.user].rating) {
              user.createRating({
                rating: users[data.user].rating
              }).then(function(rating) {
                users[data.user].place.addRating(rating);
                bot.postTo(
                  receiver,
                  '식사기록이 등록됐어!',
                  attachments.log({
                    placeName: users[data.user].place.dataValues.name,
                    createdAt: log.createdAt,
                    rating: users[data.user].rating
                  }, ':grinning:')
                );
              })
            } else {
              bot.postTo(
                receiver,
                '식사기록이 등록됐어!',
                attachments.log({
                  placeName: users[data.user].place.dataValues.name,
                  createdAt: log.createdAt,
                }, ':grinning:')
              );
            }
          });
        });
      } else if (args[0] === '취소') {
        cancelAllState(bot, users[data.user], receiver);
      }
    }
  }
});
