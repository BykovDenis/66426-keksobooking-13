'use strict';

window.pins = (function () {

  return {
    createPins: function (pins) {
      var documentFragment = document.createDocumentFragment();
      var houses = window.data.createHouses();
      for (var i = 0; i < houses.length; i++) {
        var house = houses[i];
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
    },
    removeAllPins: function () {
      var pins = document.querySelectorAll('.map__pin');
      Object.keys(pins).forEach(function (elem) {
        var pin = pins[elem];
        if (!pin.classList.contains('map__pin--main')) {
          pins[elem].parentNode.removeChild(pins[elem]);
        }
      });
    }
  };
})();
