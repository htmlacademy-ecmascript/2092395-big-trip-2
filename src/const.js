// Типы событий
const TYPE_OF_EVENTS = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

// Города для точек маршрута
const CITIES = [
  'Amsterdam',
  'Chamonix',
  'Geneva'
];

// Описания для направлений
const DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.'];

// Режимы редактирования
const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

// Типы фильтров
const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

// Типы сортировки
const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

// Действия пользователя
const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

// Типы обновлений
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

// Константы для генерации данных
const POINT_COUNT = 4;
const MIN_PRICE = 1;
const MAX_PRICE = 1000;
const MIN_PHOTO_INDEX = 1;
const MAX_PHOTO_INDEX = 5;

// Форматы дат и времени - ВАЖНО: правильные форматы
const DATE_FORMAT = 'DD/MM/YY HH:mm';
const TIME_FORMAT = 'HH:mm';

export {
  TYPE_OF_EVENTS,
  CITIES,
  DESCRIPTIONS,
  MIN_PRICE,
  MAX_PRICE,
  MIN_PHOTO_INDEX,
  MAX_PHOTO_INDEX,
  DATE_FORMAT,
  TIME_FORMAT,
  POINT_COUNT,
  Mode,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
};
