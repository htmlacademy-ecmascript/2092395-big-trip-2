import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT, TIME_FORMAT, } from './const.js';

// Расширяем dayjs плагином duration
dayjs.extend(duration);

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

  switch (true) {
    case days > 0:
      return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
    case hours > 0:
      return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
    default:
      return `${minutes}M`;
  }
}

export {
  getRandomInteger,
  getRandomBoolean,
  getRandomArrayElement,
  humanizePointDate,
  humanizePointTime,
  getDifferenceInTime,
};
