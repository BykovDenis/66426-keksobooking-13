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

  function validateCostHouse(form) {
    var selectTypes = form.querySelector('#type');
    selectTypes.addEventListener('change', function (evt) {
      var inputPrice = form.querySelector('#price');
      var selectedElement = evt.target.selectedIndex;
      var contentElement = selectTypes[selectedElement].textContent;
      inputPrice.min = MIN_COST_HOUSE_PRICE[contentElement];
    });
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
    var selectCapacity = form.querySelector('#capacity');
    selectRoomNumber.addEventListener('change', function () {
      var selIndex = selectRoomNumber.selectedIndex;
      var position = MAP_NUMBER_ROOM_TO_GUEST[selIndex];
      Object.keys(selectCapacity).forEach(function (index) {
        if (position.some(function (elem) {
          return parseInt(elem, 10) === parseInt(index, 10);
        })) {
          selectCapacity.options[index].removeAttribute('disabled');
          selectCapacity.options[index].setAttribute('selected', 'true');
        } else {
          selectCapacity.options[index].setAttribute('disabled', 'true');
          selectCapacity.options[index].removeAttribute('selected');
        }
      });
    });
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
  }

  function changeStateFieldsets(fieldsets, state) {
    Object.keys(fieldsets).forEach(function (index) {
      fieldsets[index].disabled = state;
    });
  }

  validationForm();
  return {
    setFormToActiveState: function (dom) {
      dom.map.classList.remove('map--faded');
      dom.noticeForm.classList.remove('ad-form--disabled');
      changeStateFieldsets(dom.fieldsets);
    }
  };

})();
