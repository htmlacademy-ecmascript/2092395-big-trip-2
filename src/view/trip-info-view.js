import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

function createTripInfoTemplate({tripTitle, tripDateRange, totalCost}) {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${he.encode(tripTitle)}</h1>
              <p class="trip-info__dates">${he.encode(tripDateRange)}</p>
            </div>
            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
            </p>
          </section>`;
}

export default class TripInfoView extends AbstractView {
  #tripTitle = '';
  #tripDateRange = '';
  #totalCost = 0;

  constructor({ tripTitle, tripDateRange, totalCost }) {
    super();
    this.#tripTitle = tripTitle;
    this.#tripDateRange = tripDateRange;
    this.#totalCost = totalCost;
  }

  get template() {
    return createTripInfoTemplate({
      tripTitle: this.#tripTitle,
      tripDateRange: this.#tripDateRange,
      totalCost: this.#totalCost,
    });
  }
}
