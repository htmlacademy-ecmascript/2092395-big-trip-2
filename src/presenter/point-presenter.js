import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType, Mode, PriceLimit } from '../const.js';


export default class PointPresenter {
  #point = null;
  #offers = [];
  #destination = null;
  #allOffers = null;
  #pointsModel = null;
  #pointComponent = null;
  #editPointComponent = null;
  #container = null;
  #onDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;
  #isDestroyed = false;

  constructor({ point, offers, destination, allOffers, pointsModel, container, onDataChange, onModeChange }) {
    if (!point || !point.id) {
      throw new Error('PointPresenter: point is required and must have id');
    }

    if (!destination) {
      throw new Error(`PointPresenter: destination not found for point ${point.id}`);
    }

    if (!Array.isArray(offers)) {
      offers = [];
    }

    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#allOffers = allOffers;
    this.#pointsModel = pointsModel;
    this.#container = container;
    this.#onDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point = this.#point) {
    if (!point || !point.id) {
      this.destroy();
      return;
    }

    if (!this.#pointsModel.hasPoint(point.id)) {
      this.destroy();
      return;
    }

    this.#point = point;
    this.#isDestroyed = false;

    try {
      this.#offers = [...(this.#pointsModel.getOffersById(this.#point.type, this.#point.offers) || [])];
      this.#destination = this.#pointsModel.getDestinationsById(this.#point.destination);

      if (!this.#destination) {
        this.destroy();
        return;
      }
    } catch (error) {
      this.destroy();
      return;
    }

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    try {
      this.#pointComponent = new PointView({
        point: this.#point,
        offers: this.#offers,
        destination: this.#destination,
        onEditClick: this.#handleEditClick,
        onFavoriteClick: this.#handleFavoriteClick
      });

      this.#editPointComponent = new EditPointView({
        point: this.#point,
        pointsModel: this.#pointsModel,
        onFormSubmit: this.#handleFormSubmit,
        onCloseClick: this.#handleCloseClick,
        onDeleteClick: this.#handleDeleteClick
      });

      if (prevPointComponent === null && prevEditPointComponent === null) {
        render(this.#pointComponent, this.#container);
        return;
      }

      if (this.#mode === Mode.DEFAULT) {
        replace(this.#pointComponent, prevPointComponent);
      }

      if (this.#mode === Mode.EDITING) {
        replace(this.#pointComponent, prevEditPointComponent);
        this.#mode = Mode.DEFAULT;
      }

      remove(prevPointComponent);
      remove(prevEditPointComponent);

    } catch (error) {
      this.#pointComponent = null;
      this.#editPointComponent = null;
    }
  }

  destroy() {
    if (this.#isDestroyed) {
      return;
    }

    this.#isDestroyed = true;
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
    this.#pointComponent = null;
    this.#editPointComponent = null;
  }

  resetView() {
    if (this.#isDestroyed || this.#mode === Mode.DEFAULT) {
      return;
    }

    if (this.#editPointComponent) {
      this.#editPointComponent.reset(this.#point);
    }
    this.#replaceFormToPoint();
  }

  setSaving() {
    if (this.#isDestroyed || this.#mode !== Mode.EDITING || !this.#editPointComponent) {
      return;
    }

    this.#editPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setDeleting() {
    if (this.#isDestroyed || this.#mode !== Mode.EDITING || !this.#editPointComponent) {
      return;
    }

    this.#editPointComponent.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  }

  setAborting() {
    if (this.#isDestroyed) {
      return;
    }

    const resetFormState = () => {
      if (!this.#isDestroyed && this.#editPointComponent) {
        this.#editPointComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
      }
    };

    if (this.#mode === Mode.DEFAULT) {
      if (this.#pointComponent) {
        this.#pointComponent.shake(resetFormState);
      }
    } else {
      if (this.#editPointComponent) {
        this.#editPointComponent.shake(resetFormState);
      }
    }
  }

  #replacePointToForm = () => {
    if (this.#isDestroyed || !this.#editPointComponent || !this.#pointComponent) {
      return;
    }

    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    if (this.#isDestroyed || !this.#pointComponent || !this.#editPointComponent) {
      return;
    }

    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    if (this.#isDestroyed) {
      return;
    }

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleEditClick = () => {
    if (this.#isDestroyed) {
      return;
    }
    this.#replacePointToForm();
  };

  #handleCloseClick = () => {
    if (this.#isDestroyed) {
      return;
    }
    this.resetView();
  };

  #handleDeleteClick = (point) => {
    if (this.#isDestroyed) {
      return;
    }

    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormSubmit = (updatedPoint) => {
    if (this.#isDestroyed) {
      return;
    }

    // Вызываем валидацию из формы
    if (!this.#editPointComponent || !this.#isPointValid(updatedPoint)) {
      if (this.#editPointComponent) {
        this.#editPointComponent.shake();
      }
      return;
    }

    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, ...updatedPoint },
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

    // Проверяем даты
    if (!point.dateFrom || !point.dateTo) {
      return false;
    }

    const dateFrom = new Date(point.dateFrom);
    const dateTo = new Date(point.dateTo);

    return dateTo > dateFrom;
  }
}
