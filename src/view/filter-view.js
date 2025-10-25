import AbstractView from '../framework/view/abstract-view.js';

/**
 * Создает шаблон для одного элемента фильтра
 */
function createFilterItemTemplate(filter, currentFilterType) {
  const { type, name, count, isDisabled } = filter;
  const isChecked = type === currentFilterType;

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
        ${name} <span class="filter__${type}-count">${count}</span>
      </label>
    </div>
  `;
}

/**
 * Создает основной шаблон компонента фильтров
 */
function createFilterTemplate(filters = [], currentFilterType) {
  // Гарантируем, что filters - массив
  const safeFilters = Array.isArray(filters) ? filters : [];
  const filterItemsTemplate = safeFilters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}
          </form>`;
}

/**
 * Компонент фильтров
 */
export default class FilterView extends AbstractView {
  #filters = [];
  #currentFilter = null;
  #handleFilterTypeChange = null;

  constructor({ filters, currentFilterType, onFilterTypeChange }) {
    super();

    // Гарантируем, что filters - массив
    this.#filters = Array.isArray(filters) ? filters : [];
    this.#currentFilter = currentFilterType;
    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
