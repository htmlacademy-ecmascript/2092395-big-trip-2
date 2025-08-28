import { NewPointButtonView } from './view/add-new-point-view.js';
import { FilterView } from './view/filter-view.js';
import { InfoTripView } from './view/info-trip-view.js';
import { render } from './render.js';
// Найдем main разметки
// const siteMainElement = document.querySelector('.main');

const siteHeader = document.querySelector('.page-header');
const siteHeaderMainElement = document.querySelector('.trip-main');
const siteHeaderElement = siteHeader.querySelector('.trip-filters');
const siteHeaderFilter = siteHeaderMainElement .querySelector('.trip-controls__filters');

render (new InfoTripView(), siteHeaderMainElement);
// render (new NewPointButtonView(), siteHeaderElement);
render (new FilterView(), siteHeaderFilter);
