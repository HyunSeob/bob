'use strict';

const u = require('../util');

module.exports = function(log, icon) {
  let payload = {
    icon_emoji: icon || ':thinking_face:',
    attachments: [{
      color: u.getRandomRGB(),
      title: '오늘의 식사기록',
      fields: [{
        title: '가게',
        value: log.placeName,
        short: true
      }]
    }]
  };
  if (log.rating) {
    payload.attachments[0].fields.push({
      title: '평점',
      value: log.rating,
      short: true
    });
  }
  if (log.createdAt) {
    payload.attachments[0].fields.push({
      title: '일시',
      value: u.formatTime(log.createdAt),
      short: true
    });
  }

  return payload;
};
