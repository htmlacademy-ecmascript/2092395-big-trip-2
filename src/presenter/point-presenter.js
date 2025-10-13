import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

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

  constructor({ point, offers, destination, allOffers, pointsModel, container, onDataChange }) {
    this.#point = point;
    this.#offers = offers;
    this.#destination = destination;
    this.#allOffers = allOffers;
    this.#pointsModel = pointsModel;
    this.#container = container;
    this.#onDataChange = onDataChange;
  }

  init(point = this.#point) {
    this.#point = point;

    // Получаем актуальные данные для точки
    this.#offers = [...this.#pointsModel.getOffersById(this.#point.type, this.#point.offers)];
    this.#destination = this.#pointsModel.getDestinationsById(this.#point.destination);

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    // Создаем новые компоненты
    this.#pointComponent = new PointView({
      point: this.#point,
      offers: this.#offers,
      destination: this.#destination,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      offers: this.#allOffers,
      checkedOffers: this.#offers,
      destination: this.#destination,
      onFormSubmit: this.#handleFormSubmit,
      onCloseClick: this.#handleCloseClick
    });

    // Если компоненты уже существуют - заменяем их
    if (prevPointComponent === null && prevEditPointComponent === null) {
      // Первоначальный рендеринг
      render(this.#pointComponent, this.#container);
      return;
    }

    // Заменяем компоненты, если они отрендерены
    if (prevPointComponent && this.#container.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (prevEditPointComponent && this.#container.contains(prevEditPointComponent.element)) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    // Удаляем старые компоненты
    remove(prevPointComponent);
    remove(prevEditPointComponent);
  }

  #handleFavoriteClick = () => {
    const updatedPoint = {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    };
    this.#onDataChange(updatedPoint);
  };

  #handleEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replacePointToForm = () => {
    replace(this.#editPointComponent, this.#pointComponent);
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }
}
