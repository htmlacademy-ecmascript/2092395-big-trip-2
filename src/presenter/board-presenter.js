import { render } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;

  #boardComponent = new EventListView();

  #boardPoints = [];

  constructor({boardContainer, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#boardPoints = [...this.#pointsModel.points];

    render(this.#boardComponent, this.#boardContainer);
    render(new SortView(), this.#boardComponent.element);

    const firstPoint = this.#boardPoints[0];

    render(new EditPointView({
      point: firstPoint,
      checkedOffers: [...this.#pointsModel.getOffersById(firstPoint.type, this.#boardPoints[0].offers)],
      offers: this.#pointsModel.getOffersByType(firstPoint.type),
      destination: this.#pointsModel.getDestinationsById(firstPoint.destination)
    }), this.#boardComponent.element);

    for (let i = 0; i < this.#boardPoints.length; i++) {
      const point = this.#boardPoints[i];
      render(new PointView({
        point: this.#boardPoints[i],
        offers:[...this.#pointsModel.getOffersById(point.type, point.offers)],
        destination: this.#pointsModel.getDestinationsById(point.destination)
      }), this.#boardComponent.element);
    }
  }
}
