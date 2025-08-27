import { NewPointButtonView } from './view/add-new-point-view.js';
import { render } from './render.js';
// Найдем main разметки
// const siteMainElement = document.querySelector('.main');

const siteHeader = document.querySelector('.page-header');
const siteHeaderElement = siteHeader.querySelector('.trip-filters');

render (new NewPointButtonView(), siteHeaderElement);
