'use strict';

window.pins = (function () {
  // var URL = 'https://js.dump.academy/keksobooking/data';
  var URL = '/data/wizards.json';
  return {
    createPins: function (pins) {
      window.backend.load(URL, onSuccess, onError);
      function onSuccess(data) {
        var documentFragment = document.createDocumentFragment();
        var cards = data;
        for (var i = 0; i < cards.length; i++) {
          var card = cards[i];
          var dataForPin = {
            x: card.location.x,
            y: card.location.y,
            house: card,
            avatar: card.author.avatar,
            title: card.offer.title,
          };
          var pin = window.createPin(dataForPin);
          documentFragment.appendChild(pin);
        }
        if (pins) {
          pins.appendChild(documentFragment);
        }
      }
      function onError(e) {
        console.log(e);
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
