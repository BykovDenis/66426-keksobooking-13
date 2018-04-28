'use strict';

window.backend = (function () {

  return {
    load: function (url, onSuccess, onError) {
      var xhr = new XMLHttpRequest();

      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onSuccess(xhr.response);
        } else {
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000; // 10s

      xhr.open('GET', url);
      xhr.send();
    },
    sendForm: function (url, formData, onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.timeout = 10000; // 10s
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          console.log('Data sent success');
          onSuccess();
        } else {
          onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', url);
      // xhr.setRequestHeader('Content-type', 'multipart/form-data');
      xhr.send(formData);
    }
  };
})();
