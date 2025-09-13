import { createElement } from '../render.js';

function createInfoTripTemplate({title, dateRange, totalCost}) {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${title}</h1>

              <p class="trip-info__dates">${dateRange}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
            </p>
          </section>`;
}

export default class InfoTripView {
  constructor({title, dateRange, totalCost}) {
    this.title = title;
    this.dateRange = dateRange;
    this.totalCost = totalCost;
  }

  getTemplate() {
    return createInfoTripTemplate({
      title: this.title,
      dateRange: this.dateRange,
      totalCost: this.totalCost
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
