import Observable from '../framework/observable.js';
import { humanizePointMonth } from '../utils/point.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];
  #isLoading = true;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  async init() {
    this.#isLoading = true;

    try {
      const [points, offers, destinations] = await Promise.all([
        this.#pointsApiService.points,
        this.#pointsApiService.offers,
        this.#pointsApiService.destinations
      ]);

      this.#points = points.map(this.#adaptToClient);
      this.#offers = offers;
      this.#destinations = destinations;

    } catch(err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    } finally {
      this.#isLoading = false;
      this._notify(UpdateType.INIT);
    }
  }

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

    return `${humanizePointMonth(startDate)} — ${humanizePointMonth(endDate)}`;
  }

  getTotalCost() {
    const points = this.points;
    if (points.length === 0) {
      return 0;
    }

    return points.reduce((total, point) => {
      const pointCost = point.basePrice || 0;
      const offersForPoint = this.getOffersById(point.type, point.offers);
      const offersCost = offersForPoint.reduce((sum, offer) => sum + (offer.price || 0), 0);
      return total + pointCost + offersCost;
    }, 0);
  }

  hasPoint(pointId) {
    return this.#points.some((point) => point.id === pointId);
  }

  getPointById(pointId) {
    return this.#points.find((point) => point.id === pointId) || null;
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatedPoint);

    } catch (error) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);

      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);

    } catch (error) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);

      this.#points = this.#points.filter((point) => point.id !== update.id);
      this._notify(updateType);

    } catch (error) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
