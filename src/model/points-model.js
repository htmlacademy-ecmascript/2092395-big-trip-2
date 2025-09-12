import { getRandomPoint } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';

const POINT_COUNT = 3;

// Создаем заготовку для модели
export default class PointsModel {

  // У конструктора массивов Array вызываем метод from, который позволяет из масиво-подобного объекта получить нормальный массив
  // Вторым аргументом передаем функцию, которая будет применена к каждому элементу массива
  // Получаем массив из 3х элементов
  points = Array.from({length: POINT_COUNT}, getRandomPoint);
  offers = mockOffers;
  destinations = mockDestinations;

  // Публичный метод который ворзвращает массив точек
  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getOffersByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, itemsId) {
    const offersType = this.getOffersByType(type);
    if (!offersType || !itemsId) {
      return [];
    }
    return offersType.offers.filter((item) => itemsId.includes(item.id));
  }

  getDestinations() {
    return this.destinations;
  }

  getDestinationsById(id) {
    const allDestinations = this.getDestinations();
    return allDestinations.find((item) => item.id === id) ?? null;
  }
}
