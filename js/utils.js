'use strict';

window.utils = (function () {

  function shuffleArrayCondition() {
    return Math.random() - 0.5;
  }

  function shuffleArray(arr) {
    return arr.sort(shuffleArrayCondition);
  }

  return {
    getRandomValue: function (min, max) {
      return Math.floor((Math.random()) * ((max + 1) - min)) + min;
    },
    getURLPhoto: function (url, name, number, extension) {
      return url + name + number + extension;
    },
    getRandomArray: function (from, to) {
      var arr = [];
      for (var i = from; i <= to; i++) {
        arr.push(i);
      }
      return shuffleArray(arr);
    }
  };

})();


