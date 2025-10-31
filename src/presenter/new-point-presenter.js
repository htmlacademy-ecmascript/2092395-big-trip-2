import { remove, render, RenderPosition } from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType, TYPE_OF_EVENTS, startPrice, PriceLimit } from '../const.js';

/**
 * Презентер для создания новой точки маршрута
 */
export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointsModel = null;

  #pointEditComponent = null;
  #isDestroyed = false;

  constructor({ pointListContainer, pointsModel, onDataChange, onDestroy }) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  /**
   * Устанавливает контейнер для рендеринга
   */
  setContainer(container) {
    this.#pointListContainer = container;
  }

  /**
   * Проверяет, установлен ли контейнер
   */
  hasContainer() {
    return this.#pointListContainer !== null;
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
      onDeleteClick: this.#handleDeleteClick,
      isNewPoint: true
    });

    this.#isDestroyed = false;
    render(this.#pointEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#isDestroyed = true;
    this.#handleDestroy();
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    if (this.#isDestroyed || !this.#pointEditComponent) {
      return;
    }

    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    if (this.#isDestroyed || !this.#pointEditComponent) {
      return;
    }

    const resetFormState = () => {
      if (!this.#isDestroyed && this.#pointEditComponent) {
        this.#pointEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #createBlankPoint() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Берем первое доступное направление по умолчанию
    const defaultDestination = this.#pointsModel.destinations[0];
    const defaultType = TYPE_OF_EVENTS[0];

    return {
      id: `new-${Date.now()}`,
      basePrice: startPrice,
      dateFrom: now.toISOString(),
      dateTo: tomorrow.toISOString(),
      destination: defaultDestination?.id || '',
      offers: [],
      type: defaultType,
      isFavorite: false
    };
  }

  #handleFormSubmit = (point) => {
    // Проверяем, что презентер не уничтожен
    if (this.#isDestroyed) {
      return;
    }

    // Дополнительная валидация перед отправкой
    if (!this.#isPointValid(point)) {
      this.#pointEditComponent?.shake();
      return;
    }

    // Для новой точки удаляем временный ID
    const pointToSend = { ...point };
    if (pointToSend.id && pointToSend.id.startsWith('new-')) {
      delete pointToSend.id;
    }

    this.setSaving();
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      pointToSend,
    );
  };

  #isPointValid(point) {
    // Проверяем обязательные поля
    if (!point.destination) {
      return false;
    }

    // Проверяем цену
    if (point.basePrice < PriceLimit.MIN || point.basePrice > PriceLimit.MAX) {
      return false;
    }

    // Проверяем, что направление существует
    const destination = this.#pointsModel.getDestinationsById(point.destination);
    if (!destination) {
      return false;
    }

    // Проверяем, что тип события валиден
    if (!TYPE_OF_EVENTS.includes(point.type)) {
      return false;
    }

    // Проверяем, что дата окончания позже даты начала
    const dateFrom = new Date(point.dateFrom);
    const dateTo = new Date(point.dateTo);
    if (dateTo <= dateFrom) {
      return false;
    }

    return true;
  }

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
}
