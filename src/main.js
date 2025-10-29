import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import NewPointButtonView from './view/add-new-point-view.js';
import PointsApiService from './points-api-service.js';
import LoadingView from './view/loading-view.js';

const AUTHORIZATION = 'Basic er989jdzbVv';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

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
  #pointsApiService = null;
  #loadingComponent = new LoadingView();

  constructor() {
    this.#pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
    this.#pointsModel = new PointsModel({
      pointsApiService: this.#pointsApiService
    });
    this.#filterModel = new FilterModel();

    this.#pointsModel.addObserver(this.#handleModelEvent.bind(this));
  }

  async init() {
    this.#initComponents();
    this.#showLoading();

    await this.#pointsModel.init();

    this.#hideLoading();
    this.#renderComponents();
  }

  #initComponents() {
    const siteHeader = document.querySelector('.page-header');
    const siteHeaderMainElement = siteHeader.querySelector('.trip-main');
    const siteHeaderFilters = siteHeader.querySelector('.trip-controls__filters');
    const siteMainElement = document.querySelector('.page-main .trip-events');

    this.#newPointButtonComponent = new NewPointButtonView({
      onClick: this.#handleNewPointButtonClick.bind(this)
    });

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

  #showLoading() {
    const siteMainElement = document.querySelector('.page-main .trip-events');
    render(this.#loadingComponent, siteMainElement);
  }

  #hideLoading() {
    this.#loadingComponent.removeElement();
  }

  #renderComponents() {
    const siteHeaderMainElement = document.querySelector('.trip-main');

    const existingButton = siteHeaderMainElement.querySelector('.trip-main__event-add-btn');
    if (existingButton) {
      existingButton.remove();
    }

    render(this.#newPointButtonComponent, siteHeaderMainElement);

    this.#filterPresenter.init();
    this.#boardPresenter.init();
    this.#tripInfoPresenter.init();
  }

  #handleModelEvent = (updateType) => {
    if (updateType === 'MINOR' || updateType === 'MAJOR' || updateType === 'PATCH') {
      this.#tripInfoPresenter.update();
    }
  };

  #handleNewPointFormClose() {
    this.#newPointButtonComponent.setDisabled(false);
  }

  #handleNewPointButtonClick() {
    this.#boardPresenter.createPoint();
    this.#newPointButtonComponent.setDisabled(true);
  }
}

const app = new App();
app.init();
