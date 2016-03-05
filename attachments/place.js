'use strict';

const u = require('../util');

module.exports = function (place) {
  return {
    icon_emoji: ':thinking_face:',
    attachments: [{
      color: u.getRandomRGB(),
      title: place.name,
      fields: [{
        title: '설명',
        value: place.desc,
        short: true
      }, {
        title: '가격대',
        value: place.price,
        short: true
      }]
    }]
  };
};
