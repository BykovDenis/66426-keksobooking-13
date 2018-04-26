'use strict';

window.pin = (function () {

  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var MAIN_PIN_TAIL_HEIGHT = 15;

  var WIDTH_AVATAR = 40;
  var HEIGHT_AVATAR = 40;

  var PIN_HEIGHT = 70;
  var PIN_WIDTH = 50;

  var MIN_TOP = 100;
  var MAX_TOP = 500;

  function getPosMainPinX(x) {
    var offsetX = Math.ceil(MAIN_PIN_WIDTH / 2);
    return x - offsetX;
  }

  function getPosMainPinY(y) {
    var offsetY = Math.ceil(MAIN_PIN_HEIGHT / 2);
    return y - offsetY;
  }

  function getPosPinX(x) {
    var offsetY = Math.ceil(PIN_WIDTH / 2);
    return x - offsetY;
  }

  function getPosPinY(y) {
    var offsetY = Math.ceil(PIN_HEIGHT);
    return y - offsetY;
  }

  function btnHandlerClick(dom, house) {
    return function () {
      window.card.renderMainCard(dom, house);
    };
  }

  window.createPin = function (props) {
    var dom = window.dom.getDOMElements();
    var template = dom.template.content;
    var card = template.cloneNode(true);
    var domTmplEl = window.dom.getDOMTemplatesElement(card);
    var btn = domTmplEl.btnPin;
    var posY = getPosPinY(props.y);
    var posX = getPosPinX(props.x);
    if (domTmplEl && btn) {
      btn.style.left = posX + 'px';
      btn.style.top = posY + 'px';
      btn.style.className = 'map__pin';
      var img = btn.querySelector('img');
      if (img) {
        img.src = props.avatar;
        img.alt = props.title;
        img.width = WIDTH_AVATAR;
        img.height = HEIGHT_AVATAR;
        img.draggable = false;
      }
      btn.addEventListener('click', btnHandlerClick(dom, props.house, posY));
    }
    return btn;
  };

  function controlPositionMarker(dom, x, y) {
    var posX = x;
    var posY = y;
    var minLeft = 0;
    var maxLeft = dom.map.offsetWidth;

    if (x < minLeft) {
      posX = minLeft;
    } else if (x > maxLeft) {
      posX = maxLeft;
    }

    if (y < MIN_TOP) {
      posY = MIN_TOP;
    } else if (y > MAX_TOP) {
      var offsetY = 46;
      posY = MAX_TOP - offsetY;
    }

    return {x: Math.round(posX), y: Math.round(posY)};
  }

  return {
    initMoveMainMarker: function (evt) {
      evt.preventDefault();
      var dom = window.dom.getDOMElements();
      window.form.setFormToActiveState(dom);
      var target = evt.currentTarget;
      var startMoveMainPin = true;

      var offsetXY = dom.map.getBoundingClientRect();

      var setup = {
        x: event.clientX - offsetXY.left,
        y: event.clientY - offsetXY.top,
      };

      function onMouseMove(event) {
        event.preventDefault();
        if (!startMoveMainPin) {
          return;
        }
        var shift = {
          x: setup.x - (event.clientX - offsetXY.left),
          y: setup.y - (event.clientY - offsetXY.top),
        };

        setup = {
          x: event.clientX - offsetXY.left,
          y: event.clientY - offsetXY.top,
        };

        var x = (event.clientX - shift.x - offsetXY.left);
        var y = (event.clientY - shift.y - offsetXY.top);
        var coords = controlPositionMarker(dom, x, y);
        target.style.left = getPosMainPinX(coords.x) + 'px';
        target.style.top = getPosMainPinY(coords.y) + 'px';
        var xCoords = coords.x + Math.round(MAIN_PIN_WIDTH / 2);
        var yCoords = coords.y + Math.round(MAIN_PIN_HEIGHT / 2) + MAIN_PIN_TAIL_HEIGHT;
        dom.address.value = getPosMainPinX(xCoords) + ', ' + yCoords;

      }

      function onMouseUp(evt2) {
        event.preventDefault();
        if (startMoveMainPin) {
          window.pins.removeAllPins();
          window.pins.createPins(dom.pins);
        }
        startMoveMainPin = false;
        window.map.getInitialLocation(dom.mainPin, dom.address);
        onMouseMove(evt2);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', window.pin.initMoveMainMarker);
      }

      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('mousemove', onMouseMove);
    }
  };

})();

