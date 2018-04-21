'use strict';

window.pins = (function () {
  return {
    createPins: function (pins) {
      var documentFragment = document.createDocumentFragment();
      var houses = window.data.houses;
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
    }
  };
})();
