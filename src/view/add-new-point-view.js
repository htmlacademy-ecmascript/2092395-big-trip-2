import AbstractView from '../framework/view/abstract-view.js';

/**
 * Функция для создания шаблона кнопки "New Event"
 */
function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

/**
 * Компонент кнопки создания новой точки маршрута
 */
export default class NewPointButtonView extends AbstractView {
  #handleClick = null;

  /**
   * @param {Object} param0 - параметры конструктора
   * @param {Function} param0.onClick - колбэк при клике на кнопку
   */
  constructor({ onClick }) {
    super();
    this.#handleClick = onClick;

    // Добавляем обработчик клика
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  /**
   * Обработчик клика по кнопке
   */
  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

  /**
   * Блокирует кнопку (например, во время создания точки)
   */
  setDisabled(isDisabled) {
    this.element.disabled = isDisabled;
  }
}
