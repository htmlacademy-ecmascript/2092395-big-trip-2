import { render, RenderPosition } from '../framework/render.js';
import InfoTripView from '../view/info-trip-view.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #infoComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    // Используем методы модели для получения данных
    const tripTitle = this.#pointsModel.getTripTitle();
    const tripDateRange = this.#pointsModel.getTripDateRange();
    const totalCost = this.#pointsModel.getTotalCost();

    // Создаем экземпляр View, передавая в него данные
    this.#infoComponent = new InfoTripView({
      title: tripTitle,
      dateRange: tripDateRange,
      totalCost: totalCost
    });

    // Рендерим компонент в переданный контейнер
    render(this.#infoComponent, this.#container, RenderPosition.AFTERBEGIN);
  }
}
