// import NewPointButtonView from './view/add-new-point-view.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import { render } from './render.js';

const siteHeader = document.querySelector('.page-header');
const siteHeaderMainElement = siteHeader.querySelector('.trip-main');
const siteHeaderFilters = siteHeader.querySelector('.trip-controls');

const siteMain = document.querySelector('.page-main');
const siteMainElement = siteMain.querySelector('.trip-events');
const pointsModel = new PointsModel();

// Создаем Презентер доски (занимается списком точек)
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  pointsModel,
});

// Создаем Презентер хедера (занимается информацией о поездке)
const tripInfoPresenter = new TripInfoPresenter({
  container: siteHeaderMainElement,
  pointsModel,
});

render (new FilterView(), siteHeaderFilters);


boardPresenter.init();
tripInfoPresenter.init();
