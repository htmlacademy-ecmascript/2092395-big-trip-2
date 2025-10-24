import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType } from '../const.js';
import { nanoid } from 'nanoid';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointsModel = null;

  #pointEditComponent = null;

  constructor({ pointListContainer, pointsModel, onDataChange, onDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    const blankPoint = this.#createBlankPoint();

    this.#pointEditComponent = new EditPointView({
      point: blankPoint,
      pointsModel: this.#pointsModel,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #createBlankPoint() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Получаем первое доступное направление для значения по умолчанию
    const defaultDestination = this.#getDefaultDestination();

    return {
      id: nanoid(),
      type: 'flight',
      destination: defaultDestination ? defaultDestination.id : '',
      dateFrom: now.toISOString(),
      dateTo: tomorrow.toISOString(),
      basePrice: 100,
      offers: [],
      isFavorite: false
    };
  }

  #getDefaultDestination() {
    if (!this.#pointsModel || !this.#pointsModel.destinations) {
      return null;
    }

    const destinations = this.#pointsModel.destinations;
    return destinations.length > 0 ? destinations[0] : null;
  }

  #handleFormSubmit = (point) => {
    // Преобразуем имя направления в ID перед сохранением
    const pointWithDestinationId = this.#resolveDestinationId(point);

    if (!this.#isPointValid(pointWithDestinationId)) {
      this.#showValidationError(pointWithDestinationId);
      return;
    }

    const normalizedPoint = this.#normalizePointData(pointWithDestinationId);

    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      normalizedPoint,
    );

    this.destroy();
  };

  #handleCloseClick = () => {
    this.destroy();
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #resolveDestinationId(point) {
    // Если destination уже является ID, оставляем как есть
    if (typeof point.destination === 'string' && point.destination.length > 0) {
      if (this.#pointsModel) {
        const destinationById = this.#pointsModel.getDestinationsById(point.destination);
        if (destinationById) {
          return point;
        }

        // Пробуем найти по имени
        const destinationByName = this.#pointsModel.getDestinationsByName(point.destination);
        if (destinationByName) {
          return {
            ...point,
            destination: destinationByName.id
          };
        }
      }
    }

    return point;
  }

  #isPointValid(point) {
    const hasDestination = point.destination && point.destination.trim() !== '';
    const hasValidDates = point.dateFrom && point.dateTo && new Date(point.dateFrom) < new Date(point.dateTo);
    const hasValidPrice = point.basePrice !== null && point.basePrice !== undefined && point.basePrice >= 0;

    return hasDestination && hasValidDates && hasValidPrice;
  }

  #showValidationError(point) {
    const errors = [];

    if (!point.destination || point.destination.trim() === '') {
      errors.push('Please select a destination from the list');
    }

    if (!point.dateFrom || !point.dateTo) {
      errors.push('Please set start and end dates');
    } else if (new Date(point.dateFrom) >= new Date(point.dateTo)) {
      errors.push('End date must be after start date');
    }

    if (point.basePrice === null || point.basePrice === undefined || point.basePrice < 0) {
      errors.push('Please enter a valid price (≥ 0)');
    }

    alert(`Please fix the following errors:\n\n• ${errors.join('\n• ')}`);
  }

  #normalizePointData(point) {
    return {
      ...point,
      basePrice: Number(point.basePrice) || 0,
      dateFrom: new Date(point.dateFrom).toISOString(),
      dateTo: new Date(point.dateTo).toISOString(),
    };
  }
}
