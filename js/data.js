'use strict';

window.data = (function () {

  var HOUSE_COUNT = 8;
  var HOUSE_TITLE = [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ];
  var HOUSE_TYPE = ['palace', 'flat', 'house', 'bungalo'];
  var TIME_RESERVATION = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];

  var COORD_X_MIN = 300;
  var COORD_X_MAX = 900;
  var COORD_Y_MIN = 150;
  var COORD_Y_MAX = 500;

  var PRICE_MIN = 1000;
  var PRICE_MAX = 1000000;

  var PHOTO_URL = 'http://o0.github.io/assets/images/tokyo/';
  var PHOTO_NAME = 'hotel';
  var PHOTO_EXTENSION = '.jpg';

  var PHOTOS_COUNT = 3;

  function getPhotos() {
    var photos = [];
    var photosNum = [];
    while (photosNum.length < PHOTOS_COUNT) {
      var randomIndex = window.utils.getRandomValue(1, PHOTOS_COUNT);
      if (!photosNum.some(function (elem) {
        return elem === randomIndex;
      })) {
        photosNum.push(randomIndex);
        photos.push(window.utils.getURLPhoto(PHOTO_URL, PHOTO_NAME, randomIndex, PHOTO_EXTENSION));
      }
    }
    return photos;
  }

  function getHouseInfo(numAddress) {
    var randomValue = window.utils.getRandomValue(1, HOUSE_COUNT);
    var avatarNum = numAddress >= 10 ? numAddress : '0' + numAddress;
    var houseTitle = HOUSE_TITLE[randomValue - 1];
    var locationX = window.utils.getRandomValue(COORD_X_MIN, COORD_X_MAX);
    var locationY = window.utils.getRandomValue(COORD_Y_MIN, COORD_Y_MAX);
    var randomTypeHouse = HOUSE_TYPE[window.utils.getRandomValue(0, 3)];
    var roomsCount = window.utils.getRandomValue(1, 5);
    var guestCount = window.utils.getRandomValue(0, Math.pow(2, 32));
    var checkIn = TIME_RESERVATION[window.utils.getRandomValue(0, TIME_RESERVATION.length - 1)];
    var checkOut = TIME_RESERVATION[window.utils.getRandomValue(0, TIME_RESERVATION.length - 1)];
    var featureTo = window.utils.getRandomValue(1, FEATURES.length - 1);
    var featureFrom = window.utils.getRandomValue(0, featureTo - 1);
    var features = FEATURES.slice(featureFrom, featureTo);
    var posX = locationX;
    var posY = locationY;
    return {
      avatar: 'img/avatars/user' + avatarNum + '.png',
      offer: {
        title: houseTitle,
        address: posX + ', ' + posY,
        price: window.utils.getRandomValue(PRICE_MIN, PRICE_MAX),
        type: randomTypeHouse,
        rooms: roomsCount,
        guests: guestCount,
        checkin: checkIn,
        checkout: checkOut,
        features: features,
        description: '',
        photos: getPhotos()
      },
      location: {
        x: posX,
        y: posY
      },
    };
  }

  return {
    createHouses: function () {
      var arrHouse = [];
      var numAddresses = window.utils.getRandomArray(1, HOUSE_COUNT);
      for (var i = 0; i < HOUSE_COUNT; i++) {
        var house = getHouseInfo(numAddresses[i]);
        arrHouse.push(house);
      }
      return arrHouse;
    }
  };

})();
