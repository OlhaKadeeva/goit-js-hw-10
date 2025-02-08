import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const inputDelay = document.querySelector('input[name="delay"]');

form.addEventListener('submit', resetSubmit);

function resetSubmit(evt) {
  evt.preventDefault();

  const stateRadio = document.querySelector('input[name="state"]:checked');

  const state = stateRadio.value === 'fulfilled' ? true : false;
  const delay = +inputDelay.value;

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise.then(showMessage(true, delay)).catch(showMessage(false, delay));
}

function showMessage(status, delay) {
  const title = status ? 'OK' : 'Error';
  const message = status
    ? `✅ Fulfilled promise in ${delay}ms`
    : `❌ Rejected promise in ${delay}ms`;

  const backgroundColor = status ? '#59A10D' : '#EF4040';

  iziToast.show({
    position: 'topRight',
    title,
    titleSize: '16px',
    titleLineHeight: '24px',
    titleColor: 'white',
    message,
    messageSize: '16px',
    messageLineHeight: '24px',
    messageColor: 'white',
    backgroundColor,
  });
}
