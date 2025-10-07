import { getRandomPoint } from '../mock/points.js';
import { mockDestinations } from '../mock/destinations.js';
import { mockOffers } from '../mock/offers.js';
import { humanizePointDate } from '../utils.js';
import { POINT_COUNT } from '../const.js';

// Создаем заготовку для модели
export default class PointsModel {

  // У конструктора массивов Array вызываем метод from, который позволяет из масиво-подобного объекта получить нормальный массив
  // Вторым аргументом передаем функцию, которая будет применена к каждому элементу массива
  // Получаем массив из 3х элементов
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);
  #offers = mockOffers;
  #destinations = mockDestinations;

  /* Методы для работы  точками */

  get points() {
    return this.#points;
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
    return allDestinations.find((item) => item.id === id) ?? null;
  }

  /* Методы для вычисления данных хедера */

  getTripTitle() {
    const points = this.#points;
    if (points.length === 0) {
      return 'No points added yet';
    }

    // Логика формирования заголовка маршрута
    const destinationNames = points
      .map((point) => this.getDestinationsById(point.destination)?.name)
      .filter(Boolean); // Убираем возможные undefined

    const uniqueNames = [...new Set(destinationNames)]; // Убираем дубликаты

    // Схема: "First — ... — Last" если точек много, или полный маршрут если мало
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

    // Логика вычисления дат поездки
    const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    const startDate = sortedPoints[0].dateFrom;
    const endDate = sortedPoints[sortedPoints.length - 1].dateTo;

    return `${humanizePointDate(startDate)} — ${humanizePointDate(endDate)}`;
  }

  getTotalCost() {
    const points = this.points;
    // Логика вычисления общей стоимости: сумма цен точек + сумма выбранных офферов
    return points.reduce((total, point) => {
      const pointCost = point.basePrice;

      // Добавляем стоимость выбранных офферов для этой точки
      const offersForPoint = this.getOffersById(point.type, point.offers);
      const offersCost = offersForPoint.reduce((sum, offer) => sum + offer.price, 0);

      return total + pointCost + offersCost;
    }, 0);
  }

 // Метод для получения информации о доступных фильтрах
  getAvailableFilters() {
    // Получаем все точки маршрута из модели
    const points = this.#points;
    // Получаем текущую дату и время для сравнения
    const now = new Date();

    // Возвращаем массив объектов с информацией о каждом фильтре
    return [
      {
        type: 'everything',      // Тип фильтра
        name: 'Everything',      // Отображаемое имя
        isChecked: true,         // Выбран ли фильтр по умолчанию
        isDisabled: points.length === 0  // Блокировать, если нет точек
      },
      {
        type: 'future',
        name: 'Future',
        isChecked: false,
        // Блокировать, если нет точек с датой начала в будущем
        isDisabled: !points.some(point => new Date(point.dateFrom) > now)
      },
      {
        type: 'present',
        name: 'Present',
        isChecked: false,
        // Блокировать, если нет текущих точек (начались, но не закончились)
        isDisabled: !points.some(point =>
          new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now
        )
      },
      {
        type: 'past',
        name: 'Past',
        isChecked: false,
        // Блокировать, если нет завершенных точек
        isDisabled: !points.some(point => new Date(point.dateTo) < now)
      }
    ];
  }
}
