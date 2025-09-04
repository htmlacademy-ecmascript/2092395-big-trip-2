import dayjs from 'dayjs';

const DATE_FORMAT = 'MMMM D';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function humanizePointDate(dateFrom) {
  return dateFrom ? dayjs(dateFrom).format(DATE_FORMAT) : '';
}

// function getDifferenceInTime(start, end) {
//   const difference = dayjs(end).diff(start) / MILLISECONDS_IN_MINUTES;

//   switch (difference) {
//     case difference < SECONDS_IN_MINUTES:
//       return dayjs(difference).format('mm[M]');

//     case difference > SECONDS_IN_MINUTES && difference < SECONDS_IN_MINUTES * HOURS_IN_DAY:
//       return dayjs(difference).format('HH[H] mm[M]');
//     default:
//       return dayjs(difference).format('DD[D] HH[H] mm[M]');
//   }
// }

export {getRandomArrayElement, humanizePointDate};
