import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';
import { humanizePointDate } from '../utils/point.js';
import { POINT_COUNT } from '../const.js';
import { generateFilter } from '../mock/filter.js';

export default class PointsModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #offers = mockOffers;
  #destinations = mockDestinations;

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  get offers() {
    return this.#offers;
  }

  getOffersByType(type) {
    const allOffers = this.#offers;
    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    if (!offersType || !itemsId) {
      return [];
    }
    return offersType.offers.filter((item) => itemsId.includes(item.id));
  }

  get destinations() {
    return this.#destinations;
  }

  getDestinationsById(id) {
    const allDestinations = this.#destinations;
    return allDestinations.find((item) => item.id === id) || null;
  }

  getDestinationsByName(name) {
    const allDestinations = this.#destinations;
    return allDestinations.find((item) => item.name === name) || null;
  }

  getTripTitle() {
    const points = this.#points;
    if (points.length === 0) {
      return 'No points added yet';
    }

    const destinationNames = points
      .map((point) => this.getDestinationsById(point.destination)?.name)
      .filter(Boolean);

    const uniqueNames = [...new Set(destinationNames)];

    if (uniqueNames.length > 3) {
      return `${uniqueNames[0]} — ... — ${uniqueNames[uniqueNames.length - 1]}`;
    }
    return uniqueNames.join(' — ');
  }

  getTripDateRange() {
    const points = this.points;
    if (points.length === 0) {
      return '';
    }

    const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    const startDate = sortedPoints[0].dateFrom;
    const endDate = sortedPoints[sortedPoints.length - 1].dateTo;

    return `${humanizePointDate(startDate)} — ${humanizePointDate(endDate)}`;
  }

  getTotalCost() {
    const points = this.points;
    return points.reduce((total, point) => {
      const pointCost = point.basePrice;
      const offersForPoint = this.getOffersById(point.type, point.offers);
      const offersCost = offersForPoint.reduce((sum, offer) => sum + offer.price, 0);
      return total + pointCost + offersCost;
    }, 0);
  }

  getAvailableFilters() {
    return generateFilter(this.#points);
  }
}
