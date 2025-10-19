import { render, replace, remove } from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

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
      pointsModel: this.#pointsModel,
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

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (updatedPoint) => {
    if (updatedPoint === null) {
      // Логика удаления
      this.#onDataChange({...this.#point, isDeleted: true});
    } else {
      // Логика обновления - убедимся, что все данные актуальны
      const finalPoint = {
        ...this.#point, // сохраняем оригинальные данные
        ...updatedPoint // применяем обновления
      };
      this.#onDataChange(finalPoint);
    }

    // Закрываем форму
    this.#replaceFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      // Сбрасываем состояние сохранения если было
      if (this.#editPointComponent && this.#editPointComponent._state.isSaving) {
        this.#editPointComponent.updateElement({
          isSaving: false
        });
      }
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
      this.#replaceFormToPoint();
    }
  }
}
