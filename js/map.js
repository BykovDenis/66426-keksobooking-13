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

var MAIN_PIN_WIDTH = 62;
var MAIN_PIN_HEIGHT = 62;

var MIN_COST_HOUSE_PRICE = {
  'Лачуга': 0,
  'Квартира': 1000,
  'Дом': 5000,
  'Дворец': 10000
};

var MAP_NUMBER_ROOM_TO_GUEST = {
  0: [2],
  1: [1, 2],
  2: [0, 1, 2],
  3: [3]
};

var houses = createHouses();
var firstInit = false;

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
  var posX = getPosPinX(locationX);
  var posY = locationY;
  return {
    avatar: 'img/avatars/user' + avatarNum + '.png',
    offer: {
      title: houseTitle,
      address: posX + ', ' + posY,
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
    fieldsets: document.querySelectorAll('.ad-form__element'),
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
    popupAvatar: root.querySelector('.popup__avatar'),
    popupClose: root.querySelector('.popup__close'),
    btnPin: root.querySelector('.map__pin')
  };
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

  domTmplEl.popupClose.addEventListener('click', closeMainCard(domTmplEl.mapCard));
}

function closeMainCard(popup) {
  return function () {
    // popupClose.removeEventListener('click');
    popup.parentNode.removeChild(popup);
  };
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

function getPosPinX(x) {
  var offsetX = Math.ceil(PIN_WIDTH / 2);
  return x - offsetX;
}

function getPosPinY(y) {
  var offsetY = Math.ceil(PIN_HEIGHT / 2);
  return y - offsetY;
}

function getPosMainPinX(x) {
  var offsetX = Math.ceil(MAIN_PIN_WIDTH / 2);
  return x - offsetX;
}

function getPosMainPinY(y) {
  var offsetY = Math.ceil(MAIN_PIN_HEIGHT / 2);
  return y - offsetY;
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

function createPin(x, y, dom, avatar, title) {
  var template = dom.template.content;
  var card = template.cloneNode(true);
  var domTmplEl = getDOMTemplatesElement(card);
  var btn;
  if (domTmplEl) {
    btn = domTmplEl.btnPin;
    if (btn) {
      btn.style.left = 'left: ' + x + 'px';
      btn.style.top = 'top: ' + y + 'px';
      btn.style.className = 'map__pin';
      var img = btn.querySelector('img');
      if (img) {
        img.src = avatar;
        img.alt = title;
        img.width = WIDTH_AVATAR;
        img.height = HEIGHT_AVATAR;
        img.draggable = false;
      }
    }
  }
  return btn;
}

function createPins(pins) {
  var documentFragment = document.createDocumentFragment();
  var dom = getDOMElements();
  for (var i = 0; i < houses.length; i++) {
    var house = houses[i];
    var pin = createPin(house.location.x, house.location.y, dom, house.avatar, house.offer.title);
    documentFragment.appendChild(pin);
  }
  if (pins) {
    pins.appendChild(documentFragment);
  }

}


function createHouses() {
  var arrHouse = [];
  var numAddresses = getRandomArray(1, HOUSE_COUNT);
  for (var i = 0; i < HOUSE_COUNT; i++) {
    var house = getHouseInfo(numAddresses[i]);
    arrHouse.push(house);
  }
  return arrHouse;
}

function btnHandlerClick(dom, house) {
  return function () {
    renderMainCard(dom, house);
    dom.address.value = house.location.x + ' ' + house.location.y;
  };
}

function renderSimilarAdresses(dom) {
  var template = dom.template.content;
  var templateMapPin = template.querySelector('.map__pin');
  for (var i = 0; i < houses.length; i++) {
    var house = houses[i];
    var posY = house.location.y - PIN_HEIGHT;
    var pin = templateMapPin.cloneNode(true);
    var img = pin.querySelector('img');
    img.src = house.avatar;
    pin.style.left = house.location.x + 'px';
    pin.style.top = posY + 'px';
    dom.map.appendChild(pin);
    pin.addEventListener('click', btnHandlerClick(dom, house, posY));
  }
}

function controlPositionMarker(dom, x, y) {
  var posX = x;
  var posY = y;
  var minTop = 0;
  var maxTop = dom.map.offsetHeight;
  var minLeft = 0;
  var maxLeft = dom.map.offsetWidth;

  if (x < minLeft) {
    posX = minLeft;
  } else if (x > maxLeft) {
    posX = maxLeft;
  }

  if (y < minTop) {
    posY = 0;
  } else if (x > maxTop) {
    posY = maxTop;
  }

  return {x: posX, y: posY};
}

function initMoveMainMarker(evt) {
  evt.preventDefault();
  var dom = getDOMElements();
  var target = evt.currentTarget;
  if (!firstInit) {
    createPins(dom.pins);
    setFormToActiveState(dom);
    getInitialLocation(dom.mainPin, dom.address);
    renderSimilarAdresses(dom);
    firstInit = true;
  }

  var setup = {
    x: event.pageX,
    y: event.pageY,
  };


  function onMouseMove(event) {
    event.preventDefault();

    var shift = {
      x: setup.x - event.pageX,
      y: setup.y - event.pageY,
    };

    setup = {
      x: event.pageX,
      y: event.pageY,
    };

    var x = (event.pageX - shift.x);
    var y = (event.pageY - shift.y);
    var coords = controlPositionMarker(dom, x, y);
    target.style.left = getPosMainPinX(coords.x) + 'px';
    target.style.top = getPosMainPinY(coords.y) + 'px';
    dom.address.value = x + ', ' + y;

  }

  function onMouseUp(evt2) {
    event.preventDefault();
    onMouseMove(evt2);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', initMoveMainMarker);
  }

  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mousemove', onMouseMove);
}

function renderHotels() {
  var dom = getDOMElements();
  changeStateFieldsets(dom.fieldsets, true);
  getInitialLocation(dom.mainPin, dom.address);
  dom.mainPin.addEventListener('mousedown', initMoveMainMarker);
}

function validateCostHouse(form) {
  var selectTypes = form.querySelector('#type');
  selectTypes.addEventListener('change', function (evt) {
    var inputPrice = form.querySelector('#price');
    var selectedElement = evt.target.selectedIndex;
    var contentElement = selectTypes[selectedElement].textContent;
    inputPrice.min = MIN_COST_HOUSE_PRICE[contentElement];
  });
}

function validateInputTitle(inputTitle) {
  return function () {
    if (inputTitle.validity.valueMissing) {
      inputTitle.setCustomValidity('Поле обязательное для заполнения');
    } else if (inputTitle.validity.tooShort) {
      inputTitle.setCustomValidity('Введен слишком короткий заголовок объявления. Должен быть не менее 30 символов');
    } else if (inputTitle.validity.tooLong) {
      inputTitle.setCustomValidity('Введен слишком длинный заголовок объявления. Должен быть не более 150 символов');
    } else {
      inputTitle.setCustomValidity('');
    }
  };
}

function validateInputPrice(inputPrice) {
  return function () {
    if (inputPrice.validity.valueMissing) {
      inputPrice.setCustomValidity('Поле обязательное для заполнения');
    } else if (inputPrice.validity.rangeUnderflow) {
      inputPrice.setCustomValidity('Ниже минимальной допустимой стоимости жилья');
    } else if (inputPrice.validity.rangeOverflow) {
      inputPrice.setCustomValidity('Превышена максимальная допустимая стоимость жилья 1000000 рублей');
    } else {
      inputPrice.setCustomValidity('');
    }
  };
}

function validateChangeTime(form) {
  var selectTimeIn = form.querySelector('#timein');
  var selectTimeOut = form.querySelector('#timeout');
  selectTimeIn.addEventListener('change', function () {
    var selectedIndex = selectTimeIn.selectedIndex;
    selectTimeOut.selectedIndex = selectedIndex;
  });
  selectTimeOut.addEventListener('change', function () {
    var selectedIndex = selectTimeOut.selectedIndex;
    selectTimeIn.selectedIndex = selectedIndex;
  });
}

function validateRoomsAndGuest(form) {
  var selectRoomNumber = form.querySelector('#room_number');
  var selectCapacity = form.querySelector('#capacity');
  selectRoomNumber.addEventListener('change', function () {
    var selIndex = selectRoomNumber.selectedIndex;
    var position = MAP_NUMBER_ROOM_TO_GUEST[selIndex];
    Object.keys(selectCapacity).forEach(function (index) {
      if (position.some(function (elem) {
        return parseInt(elem, 10) === parseInt(index, 10);
      })) {
        selectCapacity.options[index].removeAttribute('disabled');
        selectCapacity.options[index].setAttribute('selected', 'true');
      } else {
        selectCapacity.options[index].setAttribute('disabled', 'true');
        selectCapacity.options[index].removeAttribute('selected');
      }
    });
  });
}

function validationForm() {
  var dom = getDOMElements();
  var form = dom.noticeForm;
  var inputTitle = form.querySelector('#title');
  inputTitle.addEventListener('invalid', validateInputTitle(inputTitle));
  inputTitle.addEventListener('input', validateInputTitle(inputTitle));
  var inputPrice = form.querySelector('#price');
  inputPrice.addEventListener('invalid', validateInputPrice(inputPrice));
  inputPrice.addEventListener('input', validateInputPrice(inputPrice));
  validateCostHouse(form);
  validateChangeTime(form);
  validateRoomsAndGuest(form);
}

validationForm();
renderHotels();
