import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardComponent = new EventListView();
  #boardPoints = [];
  #pointPresenters = new Map();

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  #handlePointChange = (updatedPoint) => {
    // Обновляем локальное состояние
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);

    // Обновляем данные в модели
    this.#pointsModel.updatePoint('MINOR', updatedPoint);

    // Обновляем презентер точки
    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    if (pointPresenter) {
      pointPresenter.init(updatedPoint);
    }
  };


  init() {
    // Получаем данные из модели
    this.#boardPoints = [...this.#pointsModel.points];

    // Запускаем рендеринг доски
    this.#renderBoard();
  }

  #renderBoard() {
    // Рендерим контейнер для точек
    render(this.#boardComponent, this.#boardContainer);
    // Рендерим сортировку
    render(new SortView(), this.#boardComponent.element);

    // Проверяем есть ли точки
    if (this.#boardPoints.length === 0) {
      render(new NoPointView(), this.#boardContainer);
      return;
    }

    // Рендерим все точки маршрута через дочерние презентеры
    this.#renderPoints();
  }

  #renderPoints() {
    // Очищаем существующие презентеры
    this.#clearPoints();

    // Для каждой точки создаем отдельный презентер
    this.#boardPoints.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    // Получаем дополнительные данные для точки
    const offers = [...this.#pointsModel.getOffersById(point.type, point.offers)];
    const destination = this.#pointsModel.getDestinationsById(point.destination);
    const allOffers = this.#pointsModel.getOffersByType(point.type);

    // Создаем дочерний презентер точки
    const pointPresenter = new PointPresenter({
      point: point,
      offers: offers,
      destination: destination,
      allOffers: allOffers,
      pointsModel: this.#pointsModel,
      container: this.#boardComponent.element,
      onDataChange: this.#handlePointChange,
    });

    // Инициализируем презентер
    pointPresenter.init();
    // Сохраняем презентер для управления
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #clearPoints() {
    // Очищаем все дочерние презентеры
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
