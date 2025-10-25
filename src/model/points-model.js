import Observable from '../framework/observable.js';
import { getRandomPoint } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';
import { humanizePointDate } from '../utils/point.js';
import { POINT_COUNT } from '../const.js';
import { generateFilter } from '../mock/filter.js';

/**
 * Модель для управления точками маршрута
 */
export default class PointsModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #offers = mockOffers;
  #destinations = mockDestinations;
  #isLoading = false; // Изменяем на false, так как данные уже есть

  constructor() {
    super();
    // Данные уже готовы (моки), поэтому сразу уведомляем об инициализации
    this._notify('INIT');
  }

  /**
   * Возвращает список всех точек маршрута
   */
  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  get isLoading() {
    return this.#isLoading;
  }

  // ... остальные методы без изменений
  getOffersByType(type) {
    return this.#offers.find((offer) => offer.type === type) || { offers: [] };
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    if (!offersType || !itemsId || !Array.isArray(itemsId)) {
      return [];
    }
    return offersType.offers.filter((item) => itemsId.includes(item.id));
  }

  getDestinationsById(id) {
    return this.#destinations.find((item) => item.id === id) || null;
  }

  getDestinationsByName(name) {
    return this.#destinations.find((item) => item.name === name) || null;
  }

  getTripTitle() {
    const points = this.#points;
    if (points.length === 0) {
      return 'No points added yet';
    }

    const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    const destinationNames = sortedPoints
      .map((point) => this.getDestinationsById(point.destination)?.name)
      .filter(Boolean);

    if (destinationNames.length === 0) {
      return 'Unknown destination';
    }

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

    if (!startDate || !endDate) {
      return '';
    }

    return `${humanizePointDate(startDate)} — ${humanizePointDate(endDate)}`;
  }

  getTotalCost() {
    const points = this.points;
    return points.reduce((total, point) => {
      const pointCost = point.basePrice || 0;
      const offersForPoint = this.getOffersById(point.type, point.offers);
      const offersCost = offersForPoint.reduce((sum, offer) => sum + (offer.price || 0), 0);
      return total + pointCost + offersCost;
    }, 0);
  }

  getAvailableFilters() {
    return generateFilter(this.#points);
  }

  /**
   * Проверяет, существует ли точка с указанным ID
   */
  hasPoint(pointId) {
    return this.#points.some((point) => point.id === pointId);
  }

  /**
   * Возвращает точку по ID
   */
  getPointById(pointId) {
    return this.#points.find((point) => point.id === pointId) || null;
  }

  // ... методы updatePoint, addPoint, deletePoint остаются без изменений
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
    const pointWithId = {
      ...update,
      id: crypto.randomUUID()
    };

    this.#points = [
      pointWithId,
      ...this.#points,
    ];

    this._notify(updateType, pointWithId);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = this.#points.filter((point) => point.id !== update.id);
    this._notify(updateType);
  }
}
