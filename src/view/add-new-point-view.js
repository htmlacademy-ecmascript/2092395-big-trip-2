import AbstractView from '../framework/view/abstract-view.js';

function createNewPointButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>';
}

export default class NewPointButtonView extends AbstractView {
  get template() {
    return createNewPointButtonTemplate();
  }

}
