import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { DATE_FORMAT, TIME_FORMAT } from '../const.js';

// Расширяем dayjs плагином duration
dayjs.extend(duration);

function humanizePointDate(date) {
  return date ? dayjs(date).format(DATE_FORMAT) : '';
}

function humanizePointTime(date) {
  return date ? dayjs(date).format(TIME_FORMAT) : '';
}

function getDifferenceInTime(dateStart, dateEnd) {
  if (!dateStart || !dateEnd) {
    return '';
  }

  const diffInMs = dayjs(dateEnd).diff(dayjs(dateStart));
  const timeDuration = dayjs.duration(diffInMs);

  const days = Math.floor(timeDuration.asDays());
  const hours = timeDuration.hours();
  const minutes = timeDuration.minutes();

  if (days > 0) {
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }

  return `${minutes}M`;
}

// Функции сортировки
const sortPointsDay = (pointA, pointB) => {
  const dateA = dayjs(pointA.dateFrom);
  const dateB = dayjs(pointB.dateFrom);
  return dateA.diff(dateB);
};

const sortPointsTime = (pointA, pointB) => {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA; // Сортировка по убыванию длительности
};

const sortPointsPrice = (pointA, pointB) =>
  pointB.basePrice - pointA.basePrice; // Сортировка по убыванию цены


// Функции для фильтрации
function isPointFuture(point) {
  if (!point.dateFrom) {
    return false;
  }
  return dayjs().isBefore(dayjs(point.dateFrom));
}

function isPointPresent(point) {
  if (!point.dateFrom || !point.dateTo) {
    return false;
  }

  const now = dayjs();
  const start = dayjs(point.dateFrom);
  const end = dayjs(point.dateTo);

  return now.isAfter(start) && now.isBefore(end);
}

function isPointPast(point) {
  if (!point.dateTo) {
    return false;
  }
  return dayjs().isAfter(dayjs(point.dateTo));
}

export {
  humanizePointDate,
  humanizePointTime,
  getDifferenceInTime,
  sortPointsDay,
  sortPointsTime,
  sortPointsPrice,
  isPointFuture,
  isPointPresent,
  isPointPast,
};
