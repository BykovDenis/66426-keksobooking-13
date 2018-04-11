'use strict';

var HOUSE_COUNT = 8;
var PHOTOS_COUNT = 3;
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

var WIDTH_AVATAR = 40;
var HEIGHT_AVATAR = 40;

var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;

function getRandomValue(min, max) {
  return Math.floor(Math.random() * ((max + 1) - min)) + min;
}

function getURLPhoto(number) {
  return PHOTO_URL + PHOTO_NAME + number + PHOTO_EXTENSION;
}

function shuffleArrayCondition() {
  return Math.random() - 0.5;
}

function shuffleArray(arr) {
  return arr.sort(shuffleArrayCondition);
}

function getPhotos() {
  var photos = [];
  var photosNum = [];
  while (photosNum.length < PHOTOS_COUNT) {
    var randomIndex = getRandomValue(1, PHOTOS_COUNT);
    if (!photosNum.some(function (elem) {
      return elem === randomIndex;
    })) {
      photosNum.push(randomIndex);
      photos.push(getURLPhoto(randomIndex));
    }
  }
  return photos;
}

function getHouseInfo(numAddress) {
  var randomValue = getRandomValue(1, HOUSE_COUNT);
  var avatarNum = numAddress >= 10 ? numAddress : '0' + numAddress;
  var houseTitle = HOUSE_TITLE[randomValue - 1];
  var locationX = getRandomValue(COORD_X_MIN, COORD_X_MAX);
  var locationY = getRandomValue(COORD_Y_MIN, COORD_Y_MAX);
  var randomTypeHouse = HOUSE_TYPE[getRandomValue(0, 3)];
  var roomsCount = getRandomValue(1, 5);
  var guestCount = getRandomValue(0, Math.pow(2, 32));
  var checkIn = TIME_RESERVATION[getRandomValue(0, TIME_RESERVATION.length - 1)];
  var checkOut = TIME_RESERVATION[getRandomValue(0, TIME_RESERVATION.length - 1)];
  var features = FEATURES.splice(0, getRandomValue(0, FEATURES.length - 1));
  var offsetX = Math.round(PIN_WIDTH / 2);
  var offsetY = Math.round(PIN_HEIGHT / 2);
  var posX = locationX + offsetX;
  var posY = locationY - offsetY;
  return {
    avatar: 'img/avatars/user' + avatarNum + '.png',
    offer: {
      title: houseTitle,
      address: locationX + ', ' + posY,
      price: getRandomValue(PRICE_MIN, PRICE_MAX),
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

function getDOMElements() {
  return {
    map: document.querySelector('.map'),
    pins: document.querySelector('.map__pins'),
    template: document.querySelector('template'),
    filters: document.querySelector('.map__filters-container'),
    noticeForm: document.querySelector('.ad-form'),
    fieldsets: document.querySelectorAll('.notice__form > fieldset'),
    mainPin: document.querySelector('.map__pin--main'),
    address: document.getElementById('address')
  };
}

function getDOMTemplatesElement(root) {
  return {
    mapCard: root.querySelector('.map__card'),
    title: root.querySelector('h3'),
    address: root.querySelector('.popup__text--address'),
    price: root.querySelector('.popup__text--price'),
    typeHouse: root.querySelector('h4'),
    numberRoomsGuests: root.querySelector('h4 + p'),
    checkInCheckOut: root.querySelector('h4 + p + p'),
    popupFeatures: root.querySelector('.popup__features'),
    featureWifi: root.querySelector('.feature--wifi'),
    featureDishwasher: root.querySelector('.feature--dishwasher'),
    featureParking: root.querySelector('.feature--parking'),
    featureWasher: root.querySelector('.feature--washer'),
    featureElevator: root.querySelector('.feature--elevator'),
    featureConditioner: root.querySelector('.feature-conditioner'),
    popupPictures: root.querySelector('.popup__photos'),
    popupAvatar: root.querySelector('.popup__avatar')
  };
}

function createButton(x, y) {
  var button = document.createElement('button');
  button.style.left = 'left: ' + x + 'px';
  button.style.top = 'top: ' + y + 'px';
  button.style.className = 'map__pin';
  return button;
}

function createImage(avatar, title) {
  var img = document.createElement('img');
  img.src = avatar;
  img.alt = title;
  img.width = WIDTH_AVATAR;
  img.height = HEIGHT_AVATAR;
  img.draggable = false;
  return img;
}

function renderServices(dom, services) {
  var elements = dom.querySelectorAll('li');
  Object.keys(elements).forEach(function (element) {
    if (!services[element]) {
      elements[element].remove();
    }
  });
}

function renderPictures(domList, pictures) {
  var img = domList.querySelector('img');
  img.src = pictures[0];
  for (var i = 1; i < pictures.length; i++) {
    if (pictures[i]) {
      var imgNode = img.cloneNode(true);
      imgNode.src = pictures[i] || '';
      domList.appendChild(imgNode);
    }
  }
}

function renderMainCard(dom, house) {
  removeMapCards();
  var offer = house.offer;
  var template = dom.template.content;
  var card = template.cloneNode(true);
  var domTmplEl = getDOMTemplatesElement(card);
  domTmplEl.title.textContent = offer.title;
  domTmplEl.address.textContent = offer.address;
  domTmplEl.price.innerHTML = offer.price + ' &#x20bd;/ночь';
  domTmplEl.typeHouse.textContent = offer.type;
  domTmplEl.numberRoomsGuests.innerHTML = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
  domTmplEl.checkInCheckOut.innerHTML = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
  renderServices(domTmplEl.popupFeatures, offer.features);
  renderPictures(domTmplEl.popupPictures, offer.photos);
  domTmplEl.popupAvatar.src = house.avatar;
  dom.map.insertBefore(domTmplEl.mapCard, dom.filters);
}

function removeMapCards() {
  var cards = document.querySelectorAll('.map__card');
  Object.keys(cards).forEach(function (index) {
    cards[index].parentNode.removeChild(cards[index]);
  });
}

function setFormToActiveState(dom) {
  dom.map.classList.remove('map--faded');
  dom.noticeForm.classList.remove('ad-form--disabled');
  changeStateFieldsets(dom.fieldsets);
}

function changeStateFieldsets(fieldsets, state) {
  Object.keys(fieldsets).forEach(function (index) {
    fieldsets[index].disabled = state;
  });
}

function getLocation(pin) {
  return {
    x: pin.offsetLeft + Math.ceil(pin.offsetWidth / 2),
    y: pin.offsetTop + Math.ceil(pin.offsetHeight / 2)
  };
}

function getInitialLocation(mainPin, address) {
  var location = getLocation(mainPin);
  address.value = location.x + ' ' + location.y;
}

function getRandomArray(from, to) {
  var arr = [];
  for (var i = from; i <= to; i++) {
    arr.push(i);
  }
  return shuffleArray(arr);
}

function createPins(pins) {
  var houses = [];
  var numAddresses = getRandomArray(1, HOUSE_COUNT);
  var documentFragment = document.createDocumentFragment();
  for (var i = 0; i < HOUSE_COUNT; i++) {
    var house = getHouseInfo(numAddresses[i]);
    houses.push(house);
    var button = createButton(house.location.x, house.location.y);
    var img = createImage(house.avatar, house.offer.title);
    button.appendChild(img);
    documentFragment.appendChild(button);
  }
  if (pins) {
    pins.appendChild(documentFragment);
  }
  return houses;
}

function btnHandlerClick(dom, house) {
  return function () {
    renderMainCard(dom, house);
    dom.address.value = house.location.x + ' ' + house.location.y;
  };
}

function renderSimilarAdresses(dom, houses) {
  var template = dom.template.content;
  var templateMapPin = template.querySelector('.map__pin');
  for (var i = 0; i < houses.length; i++) {
    var house = houses[i];
    var offsetY = Math.round(PIN_HEIGHT / 2);
    var posY = house.location.y - offsetY;
    var pin = templateMapPin.cloneNode(true);
    var img = pin.querySelector('img');
    img.src = house.avatar;
    pin.style.left = house.location.x + 'px';
    pin.style.top = posY + 'px';
    dom.map.appendChild(pin);
    pin.addEventListener('click', btnHandlerClick(dom, house, posY));
  }
}

function renderHotels() {
  var dom = getDOMElements();
  // п1 ТЗ блокировка формы
  changeStateFieldsets(dom.fieldsets, true);
  var houses = createPins(dom.pins);
  getInitialLocation(dom.mainPin, dom.address);
  renderMainCard(dom, houses[0]);

  dom.map.addEventListener('mouseup', function (evt) {
    var target = evt.currentTarget;
    setFormToActiveState(dom);
    getInitialLocation(dom.mainPin, dom.address);
    renderSimilarAdresses(dom, houses);
    target.style.left = evt.clientX;
    target.style.top = evt.clientY;
  });

}

renderHotels();
