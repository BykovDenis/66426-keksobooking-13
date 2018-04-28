'use strict';

window.form = (function () {

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

  var URL = 'https://js.dump.academy/keksobooking';

  function validateCostHouse(form) {
    var selectTypes = form.querySelector('#type');
    selectTypes.addEventListener('change', selectCostChangeHandler(form));
  }

  function selectCostChangeHandler(form) {
    return function (evt) {
      getOptionCostHandler(form, evt.target.selectedIndex);
    };
  }

  function getOptionCostHandler(form, index) {
    var selectTypes = form.querySelector('#type');
    var inputPrice = form.querySelector('#price');
    var contentElement = selectTypes[index].textContent;
    inputPrice.min = MIN_COST_HOUSE_PRICE[contentElement];
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
    changeSelectRoomsAndGuest(0, form);
    selectRoomNumber.addEventListener('change', changeSelectRoomsAndGuestHandler(form));
  }

  function changeSelectRoomsAndGuestHandler(form) {
    return function (evt) {
      var selectRoomNumber = evt.target;
      var selIndex = selectRoomNumber.selectedIndex;
      changeSelectRoomsAndGuest(selIndex, form);
    };
  }

  function changeSelectRoomsAndGuest(indexElement, form) {
    var selectCapacity = form.querySelector('#capacity');
    var position = MAP_NUMBER_ROOM_TO_GUEST[indexElement];
    Object.keys(selectCapacity).forEach(function (index) {
      if (position.some(function (elem) {
        return parseInt(elem, 10) === parseInt(index, 10);
      })) {
        selectCapacity.options[index].removeAttribute('disabled');
        selectCapacity.options[index].selected = true;
      } else {
        selectCapacity.options[index].setAttribute('disabled', 'true');
        selectCapacity.options[index].removeAttribute('selected');
      }
    });
  }

  var showSuccessPopup = function (popupSuccess) {
    popupSuccess.classList.remove('hidden');
    setTimeout(function () {
      popupSuccess.classList.add('hidden');
    }, 3500);
  };

  function prepareFormData(url) {
    var dom = window.dom.getDOMElements();

    function onSuccess() {
      showSuccessPopup(dom.popupSuccess);
    }

    function onError(errorMessage) {
      var div = document.createElement('div');
      div.style.zIndex = 1000;
      div.style.minHeight = 30 + 'px';
      div.style.minWidth = 500 + 'px';
      div.style.position = 'fixed';
      div.style.top = 0;
      div.style.left = 'calc(50% - 250px)';
      div.style.backgroundColor = 'white';
      div.style.opacity = 0.8;
      div.textContent = errorMessage;
      div.style.textAlign = 'center';
      div.style.lineHeight = 30 + 'px';
      div.style.color = 'red';
      document.body.appendChild(div);
      setTimeout(function () {
        document.body.removeChild(div);
      }, 3500);
    }

    return function (evt) {
      evt.preventDefault();
      var formData = new FormData(dom.noticeForm);
      window.backend.sendForm(url, formData, onSuccess, onError);
    };
  }

  function validationForm() {
    var dom = window.dom.getDOMElements();
    var form = dom.noticeForm;
    var inputTitle = form.querySelector('#title');
    inputTitle.addEventListener('invalid', validateInputTitle(inputTitle));
    inputTitle.addEventListener('input', validateInputTitle(inputTitle));
    var inputPrice = form.querySelector('#price');
    inputPrice.addEventListener('invalid', validateInputPrice(inputPrice));
    inputPrice.addEventListener('input', validateInputPrice(inputPrice));
    changeStateFieldsets(dom.fieldsets, true);
    validateCostHouse(form);
    validateChangeTime(form);
    validateRoomsAndGuest(form);

    dom.submit.addEventListener('click', prepareFormData(URL));

  }

  validationForm();

  function changeStateFieldsets(fieldsets, state) {
    Object.keys(fieldsets).forEach(function (index) {
      fieldsets[index].disabled = state;
    });
  }

  return {
    setFormToActiveState: function () {
      var dom = window.dom.getDOMElements();
      dom.map.classList.remove('map--faded');
      dom.noticeForm.classList.remove('ad-form--disabled');
      changeStateFieldsets(dom.fieldsets);
    }
  };

})();
