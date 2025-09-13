import InfoTripView from '../view/info-trip-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripInfoPresenter {
  constructor({ container, pointsModel }) {
    this.container = container;
    this.pointsModel = pointsModel;
  }

  init() {
    // Используем методы модели для получения данных
    const tripTitle = this.pointsModel.getTripTitle();
    const tripDateRange = this.pointsModel.getTripDateRange();
    const totalCost = this.pointsModel.getTotalCost();

    // Создаем экземпляр View, передавая в него данные
    this.infoComponent = new InfoTripView({
      title: tripTitle,
      dateRange: tripDateRange,
      totalCost: totalCost
    });

    // Рендерим компонент в переданный контейнер
    render(this.infoComponent, this.container, RenderPosition.AFTERBEGIN);
  }
}
