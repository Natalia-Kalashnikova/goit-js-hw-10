import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector('button');
let userSelectedDate;
let dateTimePicker;

disableStartButton();

dateTimePicker = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    updateUserInterface();
  },
});

function updateUserInterface() {
  if (!userSelectedDate || userSelectedDate < new Date()) {
    iziToast.error({
      position: 'topRight',
      backgroundColor: '#EF4040',
      message: 'Please choose a date in the future!',
    });
    disableStartButton();
  } else {
    enableStartButton();
  }
}

function disableStartButton() {
  startButton.disabled = true;
}

function enableStartButton() {
  startButton.disabled = false;
  startButton.addEventListener('click', startCountdown);
}

function startCountdown() {
  disableStartButton();

  const currentTime = new Date().getTime();
  const remainingTime = userSelectedDate.getTime() - currentTime;

  let countDownTimer = setInterval(() => {
    const now = new Date().getTime();
    const remainingTime = userSelectedDate.getTime() - now;

    if (remainingTime <= 0) {
      clearInterval(countDownTimer);
      updateDisplay(0);
      enableStartButton();
    } else {
      updateDisplay(remainingTime);
    }
  }, 1000);
  dateTimePicker.destroy();
}

function updateDisplay(remainingTime) {
  const { days, hours, minutes, seconds } = convertMs(remainingTime);
  const addTimerValue = (value) => String(value).padStart(2, '0');

  document.querySelector('[data-days]').textContent = addTimerValue(days);
  document.querySelector('[data-hours]').textContent = addTimerValue(hours);
  document.querySelector('[data-minutes]').textContent = addTimerValue(minutes);
  document.querySelector('[data-seconds]').textContent = addTimerValue(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}