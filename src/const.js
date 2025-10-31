// Типы событий
const TYPE_OF_EVENTS = [
  'flight',
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
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
const MIN_PHOTO_INDEX = 1;
const MAX_PHOTO_INDEX = 5;

// Форматы дат и времени
const DATE_FORMAT = 'DD/MM/YY HH:mm';
const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT_DAY = 'MMM D';
const DATE_FORMAT_SHORT = 'MMM D';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
const startPrice = 0;

const PriceLimit = {
  MIN: 1,
  MAX: 100000
};

export {
  TYPE_OF_EVENTS,
  CITIES,
  DESCRIPTIONS,
  MIN_PHOTO_INDEX,
  MAX_PHOTO_INDEX,
  DATE_FORMAT,
  TIME_FORMAT,
  DATE_FORMAT_DAY,
  DATE_FORMAT_SHORT,
  Mode,
  FilterType,
  SortType,
  UserAction,
  UpdateType,
  TimeLimit,
  startPrice,
  PriceLimit,
};
