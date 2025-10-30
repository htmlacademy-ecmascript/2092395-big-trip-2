import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { TYPE_OF_EVENTS, PriceLimit } from '../const.js';
import { humanizePointDate, humanizePointTime } from '../utils/point.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';


/**
 * Создает шаблон для типа события
 */
function createTypeTemplate(type, currentType, isDisabled = false) {
  const isChecked = type === currentType ? 'checked' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';

  return (
    `<div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${type}"
        ${isChecked}
        ${disabledAttr}
      >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
        ${type}
      </label>
    </div>`
  );
}

/**
 * Создает шаблон для дополнительного предложения
 */
function createOfferTemplate(offer, checkedOffers, isDisabled = false) {
  const { id, title, price } = offer;
  const isChecked = checkedOffers.some((checkedOffer) => checkedOffer.id === id) ? 'checked' : '';
  const disabledAttr = isDisabled ? 'disabled' : '';

  return (
    `<div class="event__offer-selector">
      <input
        class="event__offer-checkbox  visually-hidden"
        id="${id}"
        type="checkbox"
        name="event-offer"
        ${isChecked}
        ${disabledAttr}
        data-offer-id="${id}"
      >
      <label class="event__offer-label" for="${id}">
        <span class="event__offer-title">${he.encode(title)}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${he.encode(price.toString())}</span>
      </label>
    </div>`
  );
}

/**
 * Создает шаблон списка предложений
 */
function createOffersListTemplate(offers, checkedOffers, isDisabled = false) {
  if (offers && offers.offers && offers.offers.length > 0) {
    return (
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offers.offers.map((offer) => createOfferTemplate(offer, checkedOffers, isDisabled)).join('')}
        </div>
      </section>`
    );
  }
  return '';
}

/**
 * Создает шаблон для фотографии
 */
function createPhotoTemplate(photo) {
  const { src, description } = photo;
  return `<img class="event__photo" src="${src}" alt="${he.encode(description)}">`;
}

/**
 * Создает шаблон контейнера фотографий
 */
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

/**
 * Создает шаблон направления
 */
function createDestinationTemplate(destination) {
  if (destination && (destination.description || (destination.pictures && destination.pictures.length > 0))) {
    const description = destination.description ? he.encode(destination.description) : '';

    return (
      `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${createPhotoContainerTemplate(destination.pictures || [])}
      </section>`
    );
  }
  return '';
}

/**
 * Создает шаблон элемента списка направлений
 */
function createDestinationList(destination) {
  return `<option value="${he.encode(destination.name)}">${he.encode(destination.name)}</option>`;
}

/**
 * Создает основной шаблон формы редактирования точки маршрута
 */
function createEditPointTemplate(point, offers, checkedOffers, destination, destinations, isNewPoint = false) {
  const { type, dateFrom, dateTo, basePrice, isSaving, isDeleting, isDisabled = false } = point;
  const destinationName = destination ? destination.name : '';

  const saveButtonText = isSaving ? 'Saving...' : 'Save';
  const saveButtonDisabled = isSaving || isDisabled ? 'disabled' : '';
  const deleteButtonDisabled = isDeleting ? 'disabled' : '';
  const inputDisabled = isDisabled ? 'disabled' : '';

  let deleteButtonText;
  if (isNewPoint) {
    deleteButtonText = 'Cancel';
  } else if (isDeleting) {
    deleteButtonText = 'Deleting...';
  } else {
    deleteButtonText = 'Delete';
  }

  const rollupButton = isNewPoint ? '' :
    `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
      <span class="visually-hidden">Open event</span>
    </button>`;

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${TYPE_OF_EVENTS.map((item) => createTypeTemplate(item, type, isDisabled)).join('')}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${he.encode(type)}
            </label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${he.encode(destinationName)}"
              list="destination-list-1"
              ${inputDisabled}
              required
            >
            <datalist id="destination-list-1">
              ${destinations.map((dest) => createDestinationList(dest)).join('')}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${humanizePointDate(dateFrom)} ${humanizePointTime(dateFrom)}"
              ${inputDisabled}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${humanizePointDate(dateTo)} ${humanizePointTime(dateTo)}"
              ${inputDisabled}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-1"
              type="number"
              name="event-price"
              value="${basePrice}"
              min="0"
              step="1"
              ${inputDisabled}
              required
            >
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${saveButtonDisabled}>
            ${saveButtonText}
          </button>
          <button class="event__reset-btn" type="reset" ${deleteButtonDisabled}>
            ${deleteButtonText}
          </button>
          ${rollupButton}
        </header>
        <section class="event__details">
          ${createOffersListTemplate(offers, checkedOffers, isDisabled)}
          ${createDestinationTemplate(destination)}
        </section>
      </form>
    </li>`
  );
}

/**
 * Компонент формы редактирования/создания точки маршрута
 */
export default class EditPointView extends AbstractStatefulView {
  #pointsModel = null;
  #handleFormSubmit = null;
  #handleCloseClick = null;
  #handleDeleteClick = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #isNewPoint = false;

  constructor({ point, pointsModel, onFormSubmit, onCloseClick, onDeleteClick, isNewPoint = false }) {
    super();
    this.#pointsModel = pointsModel;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCloseClick = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;

    this._state = EditPointView.parsePointToState(point);

    this._restoreHandlers();
  }

  get template() {
    const currentOffers = this.#pointsModel ?
      [...this.#pointsModel.getOffersById(this._state.type, this._state.offers || [])] : [];

    const currentDestination = this.#pointsModel ?
      this.#pointsModel.getDestinationsById(this._state.destination) : null;

    const availableOffers = this.#pointsModel ?
      this.#pointsModel.getOffersByType(this._state.type) : null;

    const destinations = this.#pointsModel ? this.#pointsModel.destinations : [];

    return createEditPointTemplate(
      this._state,
      availableOffers,
      currentOffers,
      currentDestination,
      destinations,
      this.#isNewPoint
    );
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }

    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  reset(point) {
    this.updateElement(
      EditPointView.parsePointToState(point)
    );
  }

  shake(callback) {
    this.element.classList.add('shake');

    this.element.addEventListener('animationend', () => {
      this.element.classList.remove('shake');
      callback?.();
    }, { once: true });
  }

  _restoreHandlers() {
    const form = this.element.querySelector('form');
    form.addEventListener('submit', this.#formSubmitHandler);

    if (!this.#isNewPoint) {
      const rollupBtn = this.element.querySelector('.event__rollup-btn');
      rollupBtn.addEventListener('click', this.#closeClickHandler);
    }

    const resetBtn = this.element.querySelector('.event__reset-btn');
    resetBtn.addEventListener('click', this.#resetClickHandler);

    this.#setInnerHandlers();
    this.#setDatepicker();
  }

  #setInnerHandlers() {
    const typeInputs = this.element.querySelectorAll('.event__type-input');
    typeInputs.forEach((input) => {
      input.addEventListener('change', this.#typeChangeHandler);
    });

    const destinationInput = this.element.querySelector('.event__input--destination');
    destinationInput.addEventListener('change', this.#destinationChangeHandler);

    const priceInput = this.element.querySelector('.event__input--price');
    priceInput.addEventListener('change', this.#priceChangeHandler);

    const offerCheckboxes = this.element.querySelectorAll('.event__offer-checkbox');
    offerCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', this.#offersChangeHandler);
    });
  }

  #setDatepicker() {
    const [dateFromElement, dateToElement] = this.element.querySelectorAll('.event__input--time');

    const commonConfig = {
      dateFormat: 'd/m/y H:i',
      enableTime: true,
      'time_24hr': true,
    };

    this.#datepickerStart = flatpickr(
      dateFromElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler,
      }
    );

    this.#datepickerEnd = flatpickr(
      dateToElement,
      {
        ...commonConfig,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      }
    );
  }

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const destinationName = evt.target.value;
    const destination = this.#pointsModel.getDestinationsByName(destinationName);

    if (destination) {
      this.updateElement({
        destination: destination.id
      });
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const price = parseInt(evt.target.value, 10);

    if (isNaN(price) || price < PriceLimit.MIN || price > PriceLimit.MAX) {
      evt.target.setCustomValidity(`Price must be between ${PriceLimit.MIN} and ${PriceLimit.MAX}`);
      evt.target.reportValidity();
      return;
    }

    evt.target.setCustomValidity('');
    this._setState({
      basePrice: price
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    const offerId = evt.target.dataset.offerId;
    const isChecked = evt.target.checked;
    let offers = [...this._state.offers];

    if (isChecked) {
      offers.push(offerId);
    } else {
      offers = offers.filter((id) => id !== offerId);
    }

    this.updateElement({
      offers
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate.toISOString()
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate.toISOString()
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    if (!this.#isFormValid()) {
      this.shake();
      return;
    }

    const pointData = EditPointView.parseStateToPoint(this._state);
    this.#handleFormSubmit(pointData);
  };

  #resetClickHandler = (evt) => {
    evt.preventDefault();

    if (this.#isNewPoint) {
      this.#handleCloseClick();
    } else {
      this.#handleDeleteClick(EditPointView.parseStateToPoint(this._state));
    }
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleCloseClick();
  };

  #isFormValid() {
    const destinationInput = this.element.querySelector('.event__input--destination');
    const priceInput = this.element.querySelector('.event__input--price');
    const destinationName = destinationInput.value;
    const destination = this.#pointsModel.getDestinationsByName(destinationName);

    if (!destination) {
      destinationInput.setCustomValidity('Please select a destination from the list');
      destinationInput.reportValidity();
      return false;
    }
    destinationInput.setCustomValidity('');

    const price = parseInt(priceInput.value, 10);
    if (isNaN(price) || price < PriceLimit.MIN || price > PriceLimit.MAX) {
      priceInput.setCustomValidity(`Price must be between ${PriceLimit.MIN} and ${PriceLimit.MAX}`);
      priceInput.reportValidity();
      return false;
    }
    priceInput.setCustomValidity('');

    if (!this._state.dateFrom || !this._state.dateTo) {
      return false;
    }

    const dateFrom = new Date(this._state.dateFrom);
    const dateTo = new Date(this._state.dateTo);

    return dateTo > dateFrom;
  }

  static parsePointToState(point) {
    return {
      ...point,
      isSaving: false,
      isDeleting: false,
      isDisabled: false
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;
    return point;
  }
}
