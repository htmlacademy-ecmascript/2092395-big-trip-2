import SortView from '../view/sort-view.js';
import EditListView from '../view/event-list-view.js';
// import FormEditView from '../view/';
import PointView from '../view/point-view.js';
import { render } from '../render.js';

export default class PointPresenter {
  sortComponent = new SortView();
  pointComponent = new PointView();
  // pointListComponent = new PointListView();
  editListComponent = new EditListView();

  constructor({pointContainer}) {
    this.pointComponent = pointContainer;
  }

  init() {
    render (this.sortComponent, this.pointContainer);
    render (this.editListComponent, this.pointContainer);
    render (this.FormEditView(), this.editListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render (this.PointView(), this.editListComponent.getElement());
    }
  }
}
