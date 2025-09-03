import dayjs from 'dayjs';

const DATE_FORMAT = 'MMMM D';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(dateFrom) {
  return dateFrom ? dayjs(dateFrom).format(DATE_FORMAT) : '';
}

export {getRandomArrayElement, humanizePointDate};
