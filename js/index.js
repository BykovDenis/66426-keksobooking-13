'use strict';

window.getDOMElements = function () {
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
};

window.getDOMTemplatesElement = function (root) {
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
};
