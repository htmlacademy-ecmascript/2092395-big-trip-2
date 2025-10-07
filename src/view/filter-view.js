import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter) {
  const { type, name, count, isChecked, isDisabled } = filter;

  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${type}">
        ${name} ${count}
      </label>
    </div>
  `;
}

function createFilterTemplate(filters) {
  return `<form class="trip-filters" action="#" method="get">
            ${filters.map(createFilterItemTemplate).join('')}
          </form>`;
}

export default class FilterView extends AbstractView {
  #filters = [];

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
