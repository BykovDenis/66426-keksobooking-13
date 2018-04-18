'use strict';

(function () {

  window.getLocation = function (pin) {
    return {
      x: pin.offsetLeft + Math.ceil(pin.offsetWidth / 2),
      y: pin.offsetTop + Math.ceil(pin.offsetHeight / 2)
    };
  };

  function renderHotels() {
    var dom = window.getDOMElements();
    window.changeStateFieldsets(dom.fieldsets, true);
    window.getInitialLocation(dom.mainPin, dom.address);
    dom.mainPin.addEventListener('mousedown', window.initMoveMainMarker);
  }

  renderHotels();

})();
