import { render, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import NoPointView from '../view/no-point-view.js';

export default class BoardPresenter {
  #boardContainer = null;
  #pointsModel = null;
  #boardComponent = new EventListView();
  #boardPoints = [];

  constructor({ boardContainer, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    // 1. Получаем данные из модели
    this.#boardPoints = [...this.#pointsModel.points];

    // 2. Запускаем рендеринг доски
    this.#renderBoard();
  }

  #renderPoint(point) {
    // 3. Получаем дополнительные данные для точки
    const offers = [...this.#pointsModel.getOffersById(point.type, point.offers)];
    const destination = this.#pointsModel.getDestinationsById(point.destination);
    const allOffers = this.#pointsModel.getOffersByType(point.type);

    // 4. Создаем обработчик Escape
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    // 5. Создаем компонент точки маршрута
    const pointComponent = new PointView({
      point: point,
      offers: offers,
      destination: destination,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    // 6. Создаем компонент формы редактирования
    const editPointComponent = new EditPointView({
      point: point,
      offers: allOffers,
      checkedOffers: offers,
      destination: destination,
      onFormSubmit: () => {
        closeEditForm();
      },
      onCloseClick: () => {
        closeEditForm();
      }
    });

    // 7. Функции для замены компонентов
    function replacePointToForm () {
      replace(editPointComponent, pointComponent);
    }

    function replaceFormToPoint () {
      replace(pointComponent, editPointComponent);
    }

    function closeEditForm () {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    // 8. Изначально рендерим точку маршрута
    render(pointComponent, this.#boardComponent.element);
  }

  #renderBoard() {
    // 9. Рендерим контейнер для точек
    render(this.#boardComponent, this.#boardContainer);
    // 10. Рендерим сортировку
    render(new SortView(), this.#boardComponent.element);

    // 11. Рендерим все точки маршрута
    if (this.#boardPoints.length === 0) {
      render(new NoPointView(), this.#boardContainer);
      return;
    }

    for (let i = 0; i < this.#boardPoints.length; i++) {
      this.#renderPoint(this.#boardPoints[i]);
    }
  }
}
