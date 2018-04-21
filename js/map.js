'use strict';

window.map = (function () {

  var dom = window.dom.getDOMElements();
  getInitialLocation(dom.mainPin, dom.address);
  dom.mainPin.addEventListener('mousedown', window.pin.initMoveMainMarker);

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

  return {
    getInitialLocation: getInitialLocation,
  };

})();
