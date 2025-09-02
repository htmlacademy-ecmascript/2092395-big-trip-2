// import NewPointButtonView from './view/add-new-point-view.js';
import FilterView from './view/filter-view.js';
import InfoTripView from './view/info-trip-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import { RenderPosition, render } from './render.js';
import PointsModel from './model/points-model.js';

const siteHeader = document.querySelector('.page-header');
const siteHeaderMainElement = siteHeader.querySelector('.trip-main');
const siteHeaderFilters = siteHeader.querySelector('.trip-controls');

const siteMain = document.querySelector('.page-main');
const siteMainElement = siteMain.querySelector('.trip-events');
const pointsModel = new PointsModel();
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  pointsModel,
});

render (new InfoTripView(), siteHeaderMainElement, RenderPosition.AFTERBEGIN);
render (new FilterView(), siteHeaderFilters);
// render (new NewPointButtonView(), siteHeaderMainElement);


boardPresenter.init();
