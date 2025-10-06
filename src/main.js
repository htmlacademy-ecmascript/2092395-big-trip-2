import { render } from './framework/render.js';
import FilterView from './view/filter-view.js';
import BoardPresenter from './presenter/board-presenter.js';
import PointsModel from './model/points-model.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

// Находим основные DOM-элементы на странице
const siteHeader = document.querySelector('.page-header');           // Верхняя часть страницы
const siteHeaderMainElement = siteHeader.querySelector('.trip-main'); // Основная информация о поездке
const siteHeaderFilters = siteHeader.querySelector('.trip-controls'); // Контейнер для фильтров

const siteMain = document.querySelector('.page-main');               // Основная часть страницы
const siteMainElement = siteMain.querySelector('.trip-events');      // Контейнер для точек маршрута

// Создаем экземпляр модели данных
const pointsModel = new PointsModel();

// Получаем информацию о доступных фильтрах из модели
// Модель сама решает, какие фильтры должны быть заблокированы
const availableFilters = pointsModel.getAvailableFilters();

// Создаем компонент фильтров и передаем ему данные о доступности
const filterComponent = new FilterView(availableFilters);

// Рендерим компонент фильтров в соответствующий контейнер
render(filterComponent, siteHeaderFilters);

// Создаем презентер доски (управляет списком точек маршрута)
const boardPresenter = new BoardPresenter({
  boardContainer: siteMainElement,  // Контейнер для отрисовки точек
  pointsModel,                      // Модель данных
});

// Создаем презентер информации о поездке (управляет шапкой)
const tripInfoPresenter = new TripInfoPresenter({
  container: siteHeaderMainElement,  // Контейнер для информации о поездке
  pointsModel,                       // Модель данных
});

// Инициализируем презентеры (запускаем отрисовку компонентов)
boardPresenter.init();
tripInfoPresenter.init();
