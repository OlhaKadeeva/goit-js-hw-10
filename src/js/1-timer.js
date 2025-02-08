import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');
const dataElements = {
  daysEl: document.querySelector('[data-days]'),
  hoursEl: document.querySelector('[data-hours]'),
  minutesEl: document.querySelector('[data-minutes]'),
  secondsEl: document.querySelector('[data-seconds]'),
};

let userSelectedDate; //датa, обранa користувачем
let currentInterval;

const flatpickrOptins = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  position: 'below left', //вертикаль і горизонталь
  positionElement: input, //на нашому импуті для дати

  //Метод onClose() з об'єкта параметрів викликається щоразу під час закриття елемента інтерфейсу, який створює flatpickr. Саме в ньому варто обробляти дату, обрану користувачем. Параметр selectedDates — це масив обраних дат, тому ми беремо перший елемент selectedDates[0].
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    console.log(userSelectedDate);
    correctDate(userSelectedDate); //після валідації
  },
};

const timeUnits = {
  days: 1000 * 60 * 60 * 24,
  hours: 1000 * 60 * 60,
  minutes: 1000 * 60,
  seconds: 1000,
};

//Вішаємо прослуховувач на баттон start
startBtn.addEventListener('click', startTimer);

flatpickr(input, flatpickrOptins);

//Сповіщення для користувача через бібліотеку iziToast
function showMessage() {
  iziToast.show({
    position: 'topRight',
    title: ' Error',
    titleColor: 'white',
    messageColor: 'white',
    backgroundColor: 'red',
    message: 'Please choose a date in the future',
    iconColor: 'white',
  });
}

function checkDate(date) {
  if (new Date(date) > new Date()) {
    startBtn.disabled = false;
    startBtn.classList.toggle('is-active');
    //При обранні дати з майбутнього кнопка Start стає активною.
    return true;
  } else {
    startBtn.disabled = true; //При обранні дати з минулого, кнопка Start стає неактивною і з’являється повідомлення
    showMessage();
    return false;
  }
}

// Таймер це об'єкт, у якого є дві функції start і stop.
//При натисканні на кнопку Start вона стає неактивною, на сторінку виводиться час, що лишився до обраної дати у форматі xx:xx:xx:xx, і запускається зворотний відлік часу до обраної дати.
function startTimer() {
  if (!checkDate(userSelectedDate)) return;

  clearInterval(currentInterval);

  currentInterval = setInterval(() => checkTimer(timeUnits), 1000);
  input.disabled = true;
  startBtn.disabled = true;
}

//Таймер зупиняється, коли доходить до кінцевої дати, тобто залишок часу дорівнює нулю і інтерфейс виглядає так 00:00:00:00
function checkTimer(timeUnits) {
  let totalTime = userSelectedDate - new Date();
  if (totalTime <= 0) {
    return stopTimer();
  }

  //Час в інтерфейсі відформатований і, якщо воно містить менше двох символів, на початку числа доданий 0.
  const showTime = unit =>
    Math.floor(totalTime / timeUnits[unit])
      .toString()
      .padStart(2, '0');

  //виводимо контент
  for (let key in timeUnits) {
    dataElements[key + 'El'].textContent = showTime(key);
    totalTime %= timeUnits[key];
  }
}
function stopTimer() {
  clearInterval(currentInterval);
  input.disabled = false;
}
