import { render, replace, remove } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { sortPointsDay, sortPointsTime, sortPointsPrice } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #filterModel = null;

  #boardComponent = new EventListView();
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #sortComponent = null;
  #noPointComponent = null;

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ boardContainer, pointsModel, filterModel, onNewPointDestroy }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#boardComponent.element,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

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

  init() {
    this.#renderBoard();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
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
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard({ shouldRenderSort: true });
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true, shouldRenderSort: true });
        this.#renderBoard();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({ shouldRenderSort: true });
    this.#renderBoard();
  };

  #renderSort() {
    // Если компонент сортировки уже существует - заменяем его
    if (this.#sortComponent) {
      const prevSortComponent = this.#sortComponent;
      this.#sortComponent = new SortView({
        currentSortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      });
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      // Если компонента сортировки нет - создаем новый
      this.#sortComponent = new SortView({
        currentSortType: this.#currentSortType,
        onSortTypeChange: this.#handleSortTypeChange
      });
      render(this.#sortComponent, this.#boardComponent.element);
    }
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
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #clearBoard({ resetSortType = false, shouldRenderSort = false } = {}) {
    // Уничтожаем презентер новой точки
    this.#newPointPresenter.destroy();

    // Уничтожаем все презентеры точек
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    // Удаляем компонент заглушки если есть
    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
      this.#noPointComponent = null;
    }

    // Сбрасываем тип сортировки если нужно
    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    const points = this.points;
    const pointsCount = points.length;

    // Рендерим контейнер для точек
    render(this.#boardComponent, this.#boardContainer);

    // Если точек нет - показываем заглушку
    if (pointsCount === 0) {
      this.#renderNoPoints();
      return;
    }

    // Всегда рендерим сортировку
    this.#renderSort();
    this.#renderPoints();
  }
}
