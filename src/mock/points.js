import { getRandomArrayElement } from '../utils.js';
import { TYPE_OF_EVENTS } from '../const.js';

const mockPoints = [
  {
    tripDate: null,
    event: getRandomArrayElement(TYPE_OF_EVENTS),
    startTime: null,
    endTime: null,
    price: 40,
    offers: [],
    isFavourite: false,
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };
