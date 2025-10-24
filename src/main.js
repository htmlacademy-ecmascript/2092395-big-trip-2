import { render } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import NewPointButtonView from './view/add-new-point-view.js';

// Находим основные DOM-элементы на странице
const siteHeader = document.querySelector('.page-header');
const siteHeaderMainElement = siteHeader.querySelector('.trip-main');
const siteHeaderFilters = siteHeader.querySelector('.trip-controls__filters');

const siteMain = document.querySelector('.page-main');
const siteMainElement = siteMain.querySelector('.trip-events');

// Создаем экземпляры моделей
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

/**
 * Обработчик закрытия формы создания новой точки
 */
function handleNewPointFormClose() {
  newPointButtonComponent.setDisabled(false);
}

/**
 * Обработчик клика по кнопке "New Event"
 */
function handleNewPointButtonClick() {
  boardPresenter.createPoint();
  newPointButtonComponent.setDisabled(true);
}

// Создаем кнопку "New Event"
const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

// Создаем презентер фильтров
const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderFilters,
  filterModel,
  pointsModel
});

// Создаем презентер доски (списка точек маршрута)
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

// Создаем презентер информации о поездке
const tripInfoPresenter = new TripInfoPresenter({
  container: siteHeaderMainElement,
  pointsModel,
});

/**
 * Инициализирует приложение
 */
function init() {
  // Удаляем существующую кнопку из HTML если есть
  const existingButton = siteHeaderMainElement.querySelector('.trip-main__event-add-btn');
  if (existingButton) {
    existingButton.remove();
  }

  // Рендерим нашу кнопку "New Event"
  render(newPointButtonComponent, siteHeaderMainElement);

  // Инициализируем презентеры
  filterPresenter.init();
  boardPresenter.init();
  tripInfoPresenter.init();
}

// Запускаем приложение
init();
