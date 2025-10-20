import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { mockDestinations } from '../mock/destinations.js';
import { TYPE_OF_EVENTS } from '../const.js';
import { humanizePointDate } from '../utils/point.js';

function createTypeTemplate(type, currentType) {
  const isChecked = type === currentType ? 'checked' : '';
  return (
    `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`
  );
}

function createOfferTemplate(offer, checkedOffers) {
  const { id, title, price } = offer;
  const isChecked = checkedOffers.some((checkedOffer) => checkedOffer.id === id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer" ${isChecked}>
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function createOffersListTemplate(offers, checkedOffers) {
  if (offers && offers.offers && offers.offers.length > 0) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers.offers.map((offer) => createOfferTemplate(offer, checkedOffers)).join('')}
        </div>
      </section>`
    );
  }
  return '';
}

function createPhotoTemplate(photo) {
  const { src, description } = photo;
  return `<img class="event__photo" src="${src}" alt="${description}">`;
}

function createPhotoContainerTemplate(pictures) {
  if (pictures && pictures.length > 0) {
    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures.map((item) => createPhotoTemplate(item)).join('')}
        </div>
      </div>`
    );
  }
  return '';
}

function createDestinationTemplate(destination) {
  if (destination && (destination.description || (destination.pictures && destination.pictures.length > 0))) {
    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${destination.description || ''}</p>
        ${createPhotoContainerTemplate(destination.pictures || [])}
      </section>`
    );
  }
  return '';
}

function createDestinationList(destination) {
  return `<option value="${destination.name}"></option>`;
}

function createEditPointTemplate(point, offers, checkedOffers, destination) {
  const { type, dateFrom, dateTo, basePrice, isSaving, isDeleting } = point;
  const destinationName = destination ? destination.name : '';

  const saveButtonText = isSaving ? 'Saving...' : 'Save';
  const deleteButtonText = isDeleting ? 'Deleting...' : 'Delete';
  const saveButtonDisabled = isSaving ? 'disabled' : '';
  const deleteButtonDisabled = isDeleting ? 'disabled' : '';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${TYPE_OF_EVENTS.map((item) => createTypeTemplate(item, type)).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationName}" list="destination-list-1" ${isSaving ? 'disabled' : ''}>
            <datalist id="destination-list-1">
              ${mockDestinations.map((dest) => createDestinationList(dest)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizePointDate(dateFrom)}" ${isSaving ? 'disabled' : ''}>
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizePointDate(dateTo)}" ${isSaving ? 'disabled' : ''}>
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isSaving ? 'disabled' : ''}>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${saveButtonDisabled}>
            ${saveButtonText}
          </button>
          <button class="event__reset-btn" type="reset" ${deleteButtonDisabled}>
            ${deleteButtonText}
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${createOffersListTemplate(offers, checkedOffers)}
          ${createDestinationTemplate(destination)}
        </section>
      </form>
    </li>`
  );
}

export default class EditPointView extends AbstractStatefulView {
  #pointsModel = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;

  constructor({ point, pointsModel, onFormSubmit, onCloseClick }) {
    super();
    this.#pointsModel = pointsModel;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;

    this._setState(EditPointView.parsePointToState(point));
    this._restoreHandlers();
  }

  get template() {
    const currentOffers = this.#pointsModel.getOffersById(this._state.type, this._state.offers || []);
    const currentDestination = this.#pointsModel.getDestinationsById(this._state.destination);
    const availableOffers = this.#pointsModel.getOffersByType(this._state.type);

    return createEditPointTemplate(
      this._state,
      availableOffers,
      currentOffers,
      currentDestination
    );
  }

  //Метод для сброса состояния
  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point)
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#closeClickHandler);

    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#deleteClickHandler);

    this.#setPriceChangeHandler();
    this.#setTypeChangeHandler();
    this.#setDestinationChangeHandler();
    this.#setOffersChangeHandler();
  }

  #setPriceChangeHandler() {
    const priceInput = this.element.querySelector('.event__input--price');
    if (priceInput) {
      priceInput.addEventListener('input', this.#priceInputHandler);
    }
  }

  #setTypeChangeHandler() {
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });
  }

  #setDestinationChangeHandler() {
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      destinationInput.addEventListener('change', this.#destinationChangeHandler);
    }
  }

  #setOffersChangeHandler() {
    const offerCheckboxes = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
  }

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    const value = parseInt(evt.target.value, 10);
    // Добавляем валидацию цены
    if (value < 0 || isNaN(value)) {
      this._setState({
        basePrice: 0
      });
    } else {
      this._setState({
        basePrice: value
      });
    }
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [] // Сбрасываем выбранные офферы при смене типа
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const newDestination = this.#pointsModel.getDestinationsByName(destinationName);

    if (newDestination) {
      this.updateElement({
        destination: newDestination.id
      });
    }
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.id;
    const isChecked = evt.target.checked;
    const currentOffers = [...this._state.offers || []];

    const newOffers = isChecked
      ? [...currentOffers, offerId]
      : currentOffers.filter((id) => id !== offerId);

    this.updateElement({
      offers: newOffers
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      isDeleting: true
    });
    this.#handleFormSubmit(null);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    // Собираем актуальные данные перед отправкой
    const formData = this.#getFormData();
    const pointData = EditPointView.parseStateToPoint({
      ...this._state,
      ...formData
    });

    this.updateElement({
      isSaving: true
    });

    this.#handleFormSubmit(pointData);
  };

  #getFormData() {
    const formData = {};

    // Получаем направление из инпута
    const destinationInput = this.element.querySelector('.event__input--destination');
    if (destinationInput) {
      const destinationName = destinationInput.value;
      const destination = this.#pointsModel.getDestinationsByName(destinationName);
      if (destination) {
        formData.destination = destination.id;
      }
    }

    return formData;
  }

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  static parsePointToState(point) {
    return {
      ...point,
      isSaving: false,
      isDeleting: false
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }
}
