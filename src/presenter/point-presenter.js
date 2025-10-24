import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { UserAction, UpdateType } from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #point = null;
  #offers = null;
  #destination = null;
  #allOffers = null;
  #pointsModel = null;
  #pointComponent = null;
  #editPointComponent = null;
  #container = null;
  #onDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ point, offers, destination, allOffers, pointsModel, container, onDataChange, onModeChange }) {
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
    this.#point = point;

    // Получаем актуальные данные для точки
    this.#offers = [...this.#pointsModel.getOffersById(this.#point.type, this.#point.offers)];
    this.#destination = this.#pointsModel.getDestinationsById(this.#point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    // Создаем компоненты точки и редактирования
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

    // Первоначальный рендеринг
    if (prevPointComponent === null && prevEditPointComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    // Замена компонентов при повторном рендеринге
    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    // Удаляем старые компоненты
    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  #handleFavoriteClick = () => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, isFavorite: !this.#point.isFavorite },
    );
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCloseClick = () => {
    this.#editPointComponent.reset(this.#point);
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleDeleteClick = (point) => {
    this.#onDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormSubmit = (updatedPoint) => {
    this.#onDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      { ...this.#point, ...updatedPoint },
    );
    this.#replaceFormToPoint();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }
}
