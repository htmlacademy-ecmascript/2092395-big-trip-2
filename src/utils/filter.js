import { FilterType } from '../const.js';
import { isPointFuture, isPointPresent, isPointPast } from './point.js';

/**
 * Объект с функциями фильтрации точек маршрута
 */
export const filter = {
  [FilterType.EVERYTHING]: (points) => Array.isArray(points) ? points : [],
  [FilterType.FUTURE]: (points) => Array.isArray(points) ? points.filter((point) => isPointFuture(point)) : [],
  [FilterType.PRESENT]: (points) => Array.isArray(points) ? points.filter((point) => isPointPresent(point)) : [],
  [FilterType.PAST]: (points) => Array.isArray(points) ? points.filter((point) => isPointPast(point)) : [],
};
