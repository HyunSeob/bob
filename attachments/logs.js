'use strict';

const u = require('../util');

module.exports = function(logs, icon) {
  return {
    icon_emoji: icon || ':grimacing:',
    attachments: [{
      color: u.getRandomRGB(),
      title: '식사 기록',
      fields: logs.map(function(log) {
        return {
          title: log.dataValues.Place.dataValues.name,
          value: u.formatTime(log.dataValues.createdAt),
          short: true
        };
      })
    }]
  };
};
