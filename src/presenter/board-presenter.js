import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render} from '../render.js';

export default class BoardPresenter {
  boardComponent = new EventListView();

  constructor({boardContainer, pointsModel}) {
    this.boardContainer = boardContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.boardPoints = [...this.pointsModel.getPoints()];

    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());

    const firstPoint = this.boardPoints[0];

    render(new EditPointView({
      point: firstPoint,
      checkedOffers: [...this.pointsModel.getOffersById(firstPoint.type, this.boardPoints[0].offers)],
      offers: this.pointsModel.getOffersByType(firstPoint.type),
      destination: this.pointsModel.getDestinationsById(firstPoint.destination)
    }), this.boardComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      const point = this.boardPoints[i];
      render(new PointView({
        point: this.boardPoints[i],
        offers:[...this.pointsModel.getOffersById(point.type, point.offers)],
        destination: this.pointsModel.getDestinationsById(point.destination)
      }), this.boardComponent.getElement());
    }
  }
}
