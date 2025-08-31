import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render} from '../render.js';

const POINT_COUNT = 3;

export default class BoardPresenter {
  boardComponent = new EventListView();


  constructor({boardContainer}) {
    this.boardContainer = boardContainer;
  }

  init() {
    render(this.boardComponent, this.boardContainer);
    render(new SortView(), this.boardComponent.getElement());

    Array.from({ length: POINT_COUNT }).forEach(() => {
      render(new PointView(), this.boardComponent.getElement());
    });

    render(new EditPointView(), this.boardComponent.getElement());
  }
}
