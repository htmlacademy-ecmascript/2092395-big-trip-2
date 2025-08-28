import { createElement } from '../render.js';

function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>';
}

export default class NewPointButtonView {
  getTemplate() {
    return createNewPointButtonTemplate();
  }

  // Создаем DOM элемент
  getElement() {
    // Проверяем, заполнено ли свойство Element
    if(!this.element) {
      // Записываем в него результат работы ф-ии createElement в который передаем результат выполнения getTemplate()
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
