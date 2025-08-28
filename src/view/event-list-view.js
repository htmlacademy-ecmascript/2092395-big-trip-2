import { createElement } from '../render.js';

function createEditListTemplate() {
  return `
          <ul class="trip-events__list"></ul>
          `;
}

export class EditListView {
  getTemplate() {
    return createEditListTemplate();
  }

  getElement() {
    if(!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
