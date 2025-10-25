import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import NewPointButtonView from './view/add-new-point-view.js';

/**
 * Основной класс приложения
 */
class App {
  #pointsModel = null;
  #filterModel = null;
  #boardPresenter = null;
  #filterPresenter = null;
  #tripInfoPresenter = null;
  #newPointButtonComponent = null;

  constructor() {
    this.#pointsModel = new PointsModel();
    this.#filterModel = new FilterModel();
  }

  /**
   * Инициализирует приложение
   */
  init() {
    this.#initComponents();
    this.#renderComponents();
  }

  #initComponents() {
    const siteHeader = document.querySelector('.page-header');
    const siteHeaderMainElement = siteHeader.querySelector('.trip-main');
    const siteHeaderFilters = siteHeader.querySelector('.trip-controls__filters');
    const siteMainElement = document.querySelector('.page-main .trip-events');

    // Создаем кнопку "New Event"
    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick.bind(this)
    });

    // Создаем презентеры
    this.#filterPresenter = new FilterPresenter({
      filterContainer: siteHeaderFilters,
      filterModel: this.#filterModel,
      pointsModel: this.#pointsModel
    });

    this.#boardPresenter = new BoardPresenter({
      boardContainer: siteMainElement,
      pointsModel: this.#pointsModel,
      filterModel: this.#filterModel,
      onNewPointDestroy: this.#handleNewPointFormClose.bind(this)
    });

    this.#tripInfoPresenter = new TripInfoPresenter({
      container: siteHeaderMainElement,
      pointsModel: this.#pointsModel,
    });
  }

  #renderComponents() {
    const siteHeaderMainElement = document.querySelector('.trip-main');

    // Удаляем существующую кнопку если есть
    const existingButton = siteHeaderMainElement.querySelector('.trip-main__event-add-btn');
    if (existingButton) {
      existingButton.remove();
    }

    // Рендерим нашу кнопку "New Event"
    render(this.#newPointButtonComponent, siteHeaderMainElement);

    // Инициализируем презентеры
    this.#filterPresenter.init();
    this.#boardPresenter.init();
    this.#tripInfoPresenter.init();
  }

  #handleNewPointFormClose() {
    this.#newPointButtonComponent.setDisabled(false);
  }

  #handleNewPointButtonClick() {
    this.#boardPresenter.createPoint();
    this.#newPointButtonComponent.setDisabled(true);
  }
}

// Запускаем приложение
const app = new App();
app.init();
