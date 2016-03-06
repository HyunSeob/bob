'use strict';

const u = require('../util');

module.exports = {
  icon_emoji: ':chorongchorong:',
  attachments: [{
    color: u.getRandomRGB(),
    fields: [{
      title: '@밥 안녕',
      value: '나하고 인사를 나누자!',
      short: true
    }, {
      title: '@밥 명령',
      value: '명령어 목록을 보여줄게!',
      short: true
    }, {
      title: '@밥 가게',
      value: '가게 목록을 전부 보여줄게!',
      short: true
    }, {
      title: '@밥 추천',
      value: '맛있는 가게 추천해줄게!',
      short: true
    }, {
      title: '@밥 기록',
      value: '식사 후에 기록 남기는 것 잊지마!',
      short: true
    }, {
      title: '@밥 로그',
      value: '지금까지 뭘 먹었는지 볼 수 있어!',
      short: true
    }, {
      title: '@밥 등록',
      value: '맛집을 찾았으면 이걸로 등록해줘!',
      short: true
    }, {
      title: '@밥 심심',
      value: '(개발 중.. ㅠ_ㅠ)',
      short: true
    }, {
      title: '@밥 뭐야',
      value: '내가 궁금해?',
      short: true
    }]
  }]
};
