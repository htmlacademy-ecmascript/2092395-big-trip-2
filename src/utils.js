import dayjs from 'dayjs';

const DATE_FORMAT = 'D MMMM';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(tripDate) {
  return tripDate ? dayjs(tripDate).format(DATE_FORMAT) : '';
}

export {getRandomArrayElement, humanizePointDate};
