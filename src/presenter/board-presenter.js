import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortPointsDay, sortPointsTime, sortPointsPrice } from '../utils/point.js';
import { SortType } from '../const.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardComponent = new EventListView();
  #boardPoints = [];
  #pointPresenters = new Map();
  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #sourcedBoardPoints = [];

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    // Обновляем локальное состояние
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);

    // Обновляем данные в модели
    this.#pointsModel.updatePoint('MINOR', updatedPoint);

    // Обновляем данные в копии
    this.#sourcedBoardPoints = updateItem(this.#sourcedBoardPoints, updatedPoint);

    // Обновляем презентер точки
    const pointPresenter = this.#pointPresenters.get(updatedPoint.id);
    if (pointPresenter) {
      pointPresenter.init(updatedPoint);
    }
  };

  // 2. Этот исходный массив задач необходим,
  // потому что для сортировки мы будем мутировать
  // массив в свойстве _boardPoints
  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#boardPoints.sort(sortPointsDay);
        break;
      case SortType.PRICE:
        this.#boardPoints.sort(sortPointsPrice);
        break;
      case SortType.TIME:
        this.#boardPoints.sort(sortPointsTime);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardPoints исходный массив
        this.#boardPoints = [...this.#sourcedBoardPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    // Проверяем выбранный вариант сортировки не является ли действующим
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    // Чистим список
    this.#clearPoints();

    // Рендерим список заново
    this.#renderPoints();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element);
  }


  init() {
    // Получаем данные из модели
    this.#boardPoints = [...this.#pointsModel.points];

    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this.#sourcedBoardPoints = [...this.#pointsModel.points];

    // Запускаем рендеринг доски
    this.#renderBoard();
  }

  #renderBoard() {
    // Рендерим контейнер для точек
    render(this.#boardComponent, this.#boardContainer);

    // Рендерим сортировку
    this.#renderSort();

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
      onModeChange: this.#handleModeChange,
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
