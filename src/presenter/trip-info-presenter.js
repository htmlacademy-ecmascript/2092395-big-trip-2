import { render, RenderPosition, remove } from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#renderTripInfo();
  }

  /**
   * Обновляет информацию о поездке
   */
  update() {
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    // Удаляем предыдущий компонент, если он есть
    if (this.#tripInfoComponent) {
      remove(this.#tripInfoComponent);
    }

    // Используем методы модели для получения данных
    const tripTitle = this.#pointsModel.getTripTitle();
    const tripDateRange = this.#pointsModel.getTripDateRange();
    const totalCost = this.#pointsModel.getTotalCost();

    // Создаем экземпляр View, передавая в него данные
    this.#tripInfoComponent = new TripInfoView({
      tripTitle,
      tripDateRange,
      totalCost
    });

    // Рендерим компонент в переданный контейнер
    render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }
}
