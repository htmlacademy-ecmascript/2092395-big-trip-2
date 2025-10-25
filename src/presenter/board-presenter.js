import { render, remove } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortPointsDay, sortPointsTime, sortPointsPrice } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';

/**
 * Презентер для управления доской с точками маршрута
 */
export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #boardComponent = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #noPointComponent = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #isInitialized = false;

  constructor({ boardContainer, pointsModel, filterModel, onNewPointDestroy }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: null, // Будет установлен позже
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  /**
   * Инициализация презентера
   */
  init(container = this.#boardContainer) {
    if (container) {
      this.#boardContainer = container;
    }

    if (this.#pointsModel.isLoading) {
      // Если данные еще загружаются, не рендерим доску
      return;
    }

    this.#isInitialized = true;
    this.#renderBoard();
  }

  /**
   * Возвращает отфильтрованные и отсортированные точки маршрута
   */
  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    let sortedPoints;
    switch (this.#currentSortType) {
      case SortType.DAY:
        sortedPoints = [...filteredPoints].sort(sortPointsDay);
        break;
      case SortType.TIME:
        sortedPoints = [...filteredPoints].sort(sortPointsTime);
        break;
      case SortType.PRICE:
        sortedPoints = [...filteredPoints].sort(sortPointsPrice);
        break;
      default:
        sortedPoints = filteredPoints;
    }

    return sortedPoints;
  }

  /**
   * Создает новую точку маршрута
   */
  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    // Устанавливаем контейнер для newPointPresenter если его нет
    if (this.#boardComponent && !this.#newPointPresenter.hasContainer()) {
      this.#newPointPresenter.setContainer(this.#boardComponent.element);
    }

    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    if (!this.#isInitialized) {
      return;
    }

    switch (updateType) {
      case UpdateType.PATCH:
        // Обновляем только конкретную точку
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        // Перерисовываем доску
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // Полная перерисовка
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        // Инициализация - перерисовываем доску
        this.#clearBoard();
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#boardComponent.element);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#boardContainer);
  }

  #renderPoint(point) {
    const offers = [...this.#pointsModel.getOffersById(point.type, point.offers)];
    const destination = this.#pointsModel.getDestinationsById(point.destination);
    const allOffers = this.#pointsModel.getOffersByType(point.type);

    const pointPresenter = new PointPresenter({
      point: point,
      offers: offers,
      destination: destination,
      allOffers: allOffers,
      pointsModel: this.#pointsModel,
      container: this.#boardComponent.element,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    pointPresenter.init();
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints() {
    const points = this.points;
    points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    // Очищаем контейнер
    this.#boardContainer.innerHTML = '';

    // Создаем компонент списка событий
    this.#boardComponent = new EventListView();
    render(this.#boardComponent, this.#boardContainer);

    // Устанавливаем контейнер для newPointPresenter
    this.#newPointPresenter.setContainer(this.#boardComponent.element);

    const points = this.points;

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    this.#renderPoints();
  }
}
