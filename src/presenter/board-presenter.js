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

    render(new EditPointView({
      point: this.boardPoints[0],
      checkedOffers: [...this.pointsModel.getOffersById(this.boardPoints[0].type, this.boardPoints[0].offers)],
      offers: this.pointsModel.getOffersByType(this.boardPoints[0].type),
      destination: this.pointsModel.getDestinationsById(this.boardPoints[0].destination)
    }), this.boardComponent.getElement());

    for (let i = 0; i < this.boardPoints.length; i++) {
      render(new PointView({
        point: this.boardPoints[i],
        offers:[...this.pointsModel.getOffersById(this.boardPoints[i].type, this.boardPoints[i].offers)],
        destination: this.pointsModel.getDestinationsById(this.boardPoints[i].destination)
      }), this.boardComponent.getElement());
    }

    render(new EditPointView(), this.boardComponent.getElement());
  }
}
