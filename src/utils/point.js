import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT, TIME_FORMAT, } from '../const.js';

// Расширяем dayjs плагином duration
dayjs.extend(duration);

function humanizePointDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function getDifferenceInTime(dateStart, dateEnd) {
  const timeDuration = dayjs.duration(dayjs(dateEnd).diff(dateStart));
  const days = timeDuration.days();
  const hours = timeDuration.hours();
  const minutes = timeDuration.minutes();

  switch (true) {
    case days > 0:
      return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
    case hours > 0:
      return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
    default:
      return `${minutes}M`;
  }
}

const sortPointsDay = (pointA, pointB) => dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
const sortPointsTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA; // Сортировка по убыванию длительности
};
const sortPointsPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {
  humanizePointDate,
  humanizePointTime,
  getDifferenceInTime,
  sortPointsDay,
  sortPointsTime,
  sortPointsPrice,
};
