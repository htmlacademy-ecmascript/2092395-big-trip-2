import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../const.js';

// Тексты заглушек для разных фильтров
const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

/**
 * Функция для создания шаблона заглушки
 */
function createNoPointTemplate(filterType) {
  const noPointTextValue = NoPointsTextType[filterType];
  return `<p class="trip-events__msg">${noPointTextValue}</p>`;
}

/**
 * Компонент заглушки, который отображается когда нет точек маршрута
 * Текст зависит от выбранного фильтра
 */
export default class NoPointView extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
