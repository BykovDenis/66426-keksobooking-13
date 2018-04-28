'use strict';

window.card = (function () {

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

  function closeMainCardByEsc(event) {
    if (event.keyCode === 27) {
      var popup = document.querySelector('.map__card');
      if (popup) {
        popup.parentNode.removeChild(popup);
      }
    }
  }

  function closeMainCard(popup) {
    return function () {
      popup.parentNode.removeChild(popup);
    };
  }

  function removeMapCards() {
    var cards = document.querySelectorAll('.map__card');
    Object.keys(cards).forEach(function (index) {
      cards[index].parentNode.removeChild(cards[index]);
    });
  }

  return {
    renderMainCard: function (dom, house) {
      removeMapCards();
      var offer = house.offer;
      var template = dom.template.content;
      var card = template.cloneNode(true);
      var domTmplEl = window.dom.getDOMTemplatesElement(card);
      domTmplEl.title.textContent = offer.title;
      domTmplEl.address.textContent = offer.address;
      domTmplEl.price.innerHTML = offer.price + ' &#x20bd;/ночь';
      domTmplEl.typeHouse.textContent = offer.type;
      domTmplEl.numberRoomsGuests.innerHTML = offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
      domTmplEl.checkInCheckOut.innerHTML = 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
      renderServices(domTmplEl.popupFeatures, offer.features);
      renderPictures(domTmplEl.popupPictures, offer.photos);
      domTmplEl.popupAvatar.src = house.author.avatar;
      dom.map.insertBefore(domTmplEl.mapCard, dom.filters);

      domTmplEl.popupClose.addEventListener('click', closeMainCard(domTmplEl.mapCard));
      document.addEventListener('keydown', closeMainCardByEsc);
    }
  };

})();
