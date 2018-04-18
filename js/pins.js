'use strict';

window.createPins = function (pins) {
  var documentFragment = document.createDocumentFragment();
  var dom = window.getDOMElements();
  for (var i = 0; i < window.houses.length; i++) {
    var house = window.houses[i];
    var dataForPin = {
      x: house.location.x,
      y: house.location.y,
      house: house,
      avatar: house.avatar,
      title: house.offer.title,
    };
    var pin = window.createPin(dataForPin);
    documentFragment.appendChild(pin);
  }
  if (pins) {
    pins.appendChild(documentFragment);
  }
}
