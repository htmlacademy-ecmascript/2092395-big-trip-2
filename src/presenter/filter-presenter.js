import { render, replace, remove } from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import { isPointFuture, isPointPresent, isPointPast } from '../utils/point.js';
import { FilterType, UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  init(container = this.#filterContainer) {
    if (container) {
      this.#filterContainer = container;
    }

    if (this.#pointsModel.isLoading) {
      return;
    }

    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        count: points.length,
        isDisabled: points.length === 0,
        isChecked: this.#filterModel.filter === FilterType.EVERYTHING
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        count: points.filter((point) => isPointFuture(point)).length,
        isDisabled: points.filter((point) => isPointFuture(point)).length === 0,
        isChecked: this.#filterModel.filter === FilterType.FUTURE
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        count: points.filter((point) => isPointPresent(point)).length,
        isDisabled: points.filter((point) => isPointPresent(point)).length === 0,
        isChecked: this.#filterModel.filter === FilterType.PRESENT
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        count: points.filter((point) => isPointPast(point)).length,
        isDisabled: points.filter((point) => isPointPast(point)).length === 0,
        isChecked: this.#filterModel.filter === FilterType.PAST
      }
    ];
  }

  #handleModelEvent = (updateType) => {
    if (updateType === 'INIT') {
      this.init();
    }
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
