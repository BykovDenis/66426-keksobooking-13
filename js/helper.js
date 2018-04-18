'use strict';

(function () {
  window.getRandomValue = function (min, max) {
    return Math.floor((Math.random()) * ((max + 1) - min)) + min;
  };

  window.getURLPhoto = function (url, name, number, extension) {
    return url + name + number + extension;
  };

  window.shuffleArray = function (arr) {
    return arr.sort(shuffleArrayCondition);
  };

  window.getRandomArray = function (from, to) {
    var arr = [];
    for (var i = from; i <= to; i++) {
      arr.push(i);
    }
    return window.shuffleArray(arr);
  }

  function shuffleArrayCondition() {
    return Math.random() - 0.5;
  }

})();


