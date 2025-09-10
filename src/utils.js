import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

// Расширяем dayjs плагином duration
dayjs.extend(duration);

const DATE_FORMAT = 'MMMM D';
const TIME_FORMAT = 'HH:mm';

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean() {
  return Math.random() > 0.5;
}

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function getDifferenceInTime(dateStart, dateEnd) {
  const duration = dayjs.duration(dayjs(dateEnd).diff(dateStart));
  const days = duration.days();
  const hours = duration.hours();
  const minutes = duration.minutes();

  return days > 0
    ? `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`
    : hours > 0
      ? `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`
      : `${minutes}M`;
}

export {
  getRandomInteger,
  getRandomBoolean,
  getRandomArrayElement,
  humanizePointDate,
  humanizePointTime,
  getDifferenceInTime,
};
