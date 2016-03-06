'use strict';

require('dotenv').config();
const db = require('./models');

db.sequelize.sync();

let places = [{
  name: '돈뜰',
  desc: '진리의 불고기 백반! 계란찜!!! 가성비 갑!',
  price: 6000
}, {
  name: '더뚝배기',
  desc: '직화구이에 순두부를 세트로 파는 집이야. 밑반찬으로 두부를 줘 그것은 True :heart:..',
  price: 8000
}, {
  name: '금씨네',
  desc: '요일까스? 제육덮밥? 함박 스테이크? 다 맛있고 싸!',
  price: 6000
}, {
  name: '골든마우스',
  desc: '오일 파스타나 함박 스테이크를 파는 집이야, 맛있긴한데 양이 좀 적어 :sweat_smile:',
  price: 10000
}, {
  name: '길버트',
  desc: '수제 버거는 여기가 갑이지!',
  price: 12000
}, {
  name: '버거킹',
  desc: '갓버킹 콰트로치즈와퍼가 먹고 싶다아..',
  price: 8000
}, {
  name: '진짜갈비',
  desc: '매운 갈비찜은 고기도 많이 주고, 맛있고. 밑반찬도 다양하고, 떠오르는 가성비 갑!',
  price: 7000
}, {
  name: '군산오징어',
  desc: '좀 맵긴한데 맛있는 오징어 볶음, 다 먹고 밥 볶아 먹으면 맛있다!',
  price: 9000
}, {
  name: '잇신라멘',
  desc: '맛있는 라멘집. 차슈만 좀 많이 주면 좋겠다아..',
  price: 9000
}, {
  name: '할머니국수',
  desc: '빠르고 간편하게 할머니 국수로 김치볶음밥 먹으러 갈까?',
  price: 6000
}, {
  name: '골동반',
  desc: '좀 비싸긴 해도 맛은 있어. 고기반 추천!!',
  price: 10000
}, {
  name: '명동칼국수',
  desc: '칼국수냐 만두국이냐 헷갈릴 땐 칼만두를 먹자!',
  price: 7000
}, {
  name: '이층집',
  desc: '맛있는 차돌박이 먹고나서 후식으로는 아이스크림~:icecream:',
  price: 8000
}, {
  name: '최고야짬뽕',
  desc: '짬뽕은 역시 최고야로 가야지. 탕수육도 맛있어!',
  price: 7000
}, {
  name: '바르다김선생',
  desc: '제일 맛있는 김밥집. 좀 먼게 흠이지만 맛있는 거 먹으려면 뭐 어때?',
  price: 8000
}, {
  name: '제육쌈밥',
  desc: '땡기는 거 없을땐 검증된 제육쌈밥을 선택하자! 콩나물 국밥도 괜찮고..',
  price: 7000
}, {
  name: '유달산',
  desc: '원래 생선구이랑 낙지볶음은 같이 먹어줘야~',
  price: 8500
}, {
  name: '유연카레',
  desc: '가끔 카레가 먹고 싶을 땐 유연카레를 가자!',
  price: 9000
}, {
  name: '명동찌개마을',
  desc: '김치찌개! 양도 많고 맛도 괜찮아. 고기 자르다가 팔 떨어져 나갈 듯:joy:',
  price: 7000
}, {
  name: '조랭이부대찌개',
  desc: '부대찌개는 여기서. 근데 새로 생긴데는 가지마.. 맛없어..',
  price: 8000
}];

places.map(function(place) {
  place.UserSlackId = 'U06UGPEJG';
  db.Place
  .create(place)
  .then(function() {
    console.log(`${place.name} insert complete.`);
  });
});
