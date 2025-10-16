// Импортируем типы фильтров из констант
import { FilterType } from '../const.js';

// Функции-предикаты для проверки точек маршрута
const isPointFuture = (point) => new Date(point.dateFrom) > new Date();
const isPointPresent = (point) => {
  const now = new Date();
  return new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now;
};
const isPointPast = (point) => new Date(point.dateTo) < new Date();

// Объект с фильтрами
const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => point),
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPointPresent(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPointPast(point)),
};

export { filter, isPointFuture, isPointPresent, isPointPast };
