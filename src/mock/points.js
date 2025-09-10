import { getRandomArrayElement, getRandomInteger, getRandomBoolean } from '../utils.js';
import { mockDestinations } from './destinations.js';
import { TYPE_OF_EVENTS } from '../const.js';
import { mockOffers } from '../mock/offers.js';

const MIN_PRICE = 1;
const MAX_PRICE = 1000;

function getRandomOffers(offersType) {
  if (!offersType || !offersType.offers) {
    return [];
  }
  return offersType.offers
    .filter(() => Math.random() > 0.5)
    .map((offer) => offer.id);
}

function getRandomPoint() {
  const type = getRandomArrayElement(TYPE_OF_EVENTS);
  const randomDestination = getRandomArrayElement(mockDestinations);

  return {
    id: '',
    basePrice: getRandomInteger(MIN_PRICE, MAX_PRICE),
    dateFrom: new Date('2019-03-18T10:30:56.845Z'),
    dateTo: new Date('2019-03-18T10:30:56.845Z'),
    destination: randomDestination.id,
    isFavorite: getRandomBoolean(),
    offers: getRandomOffers(mockOffers.find((offer) => offer.type === type)),
    type: type,
  };
}

export { getRandomPoint };
