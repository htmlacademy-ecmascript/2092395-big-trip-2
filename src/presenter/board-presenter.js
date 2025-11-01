import { render, remove } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { sortPointsDay, sortPointsTime, sortPointsPrice } from '../utils/point.js';
import { SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../const.js';
import { filter } from '../utils/filter.js';

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
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ boardContainer, pointsModel, filterModel, onNewPointDestroy }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: null,
      pointsModel: this.#pointsModel,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#renderBoard();
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

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    if (this.#boardComponent && !this.#newPointPresenter.hasContainer()) {
      this.#newPointPresenter.setContainer(this.#boardComponent.element);
    }

    this.#newPointPresenter.init();
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#pointPresenters.get(update.id)?.setSaving();
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          this.#newPointPresenter.setSaving();
          await this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          this.#pointPresenters.get(update.id)?.setDeleting();
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch (err) {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          this.#pointPresenters.get(update.id)?.setAborting();
          break;
        case UserAction.ADD_POINT:
          this.#newPointPresenter.setAborting();
          break;
        case UserAction.DELETE_POINT:
          this.#pointPresenters.get(update.id)?.setAborting();
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        if (data && data.id) {
          this.#pointPresenters.get(data.id)?.init(data);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.ERROR:
        this.#renderError();
        break;
    }
  };

  #renderError() {
    this.#clearBoard();
    this.#noPointComponent = new NoPointView({
      filterType: 'error'
    });
    render(this.#noPointComponent, this.#boardContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    // Рендерим сортировку ПЕРЕД списком точек
    render(this.#sortComponent, this.#boardContainer);
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#boardContainer);
  }

  #renderPoint(point) {
    if (!point || !point.id) {
      return;
    }

    const destination = this.#pointsModel.getDestinationsById(point.destination);
    const offers = this.#pointsModel.getOffersById(point.type, point.offers || []);
    const allOffers = this.#pointsModel.getOffersByType(point.type);

    if (!destination) {
      return;
    }

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
      this.#noPointComponent = null;
    }

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderBoard() {
    this.#boardContainer.innerHTML = '';

    if (this.#pointsModel.isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;

    if (points.length === 0) {
      this.#renderNoPoints();
      return;
    }

    // Сначала рендерим сортировку
    this.#renderSort();

    // Затем создаем и рендерим контейнер для списка точек
    this.#boardComponent = new EventListView();
    render(this.#boardComponent, this.#boardContainer);

    // Устанавливаем контейнер для новой точки
    this.#newPointPresenter.setContainer(this.#boardComponent.element);

    // И только потом рендерим точки
    this.#renderPoints();
  }

  #renderLoading() {
    const loadingView = new NoPointView({
      filterType: 'loading'
    });
    render(loadingView, this.#boardContainer);
  }
}
