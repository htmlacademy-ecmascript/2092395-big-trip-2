// Импортируем базовый класс для компонентов
import AbstractView from '../framework/view/abstract-view.js';

// Функция для создания HTML-разметки одного элемента фильтра
function createFilterItemTemplate(filter, isChecked, isDisabled) {
  // Деструктурируем объект фильтра для удобства
  const { type, name } = filter;

  // Возвращаем HTML-разметку одного фильтра
  // Стили уже предусмотрены в CSS для атрибута disabled
  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${name}</label>
    </div>
  `;
}

// Функция для создания полной HTML-разметки всех фильтров
function createFilterTemplate(filters) {
  // Преобразуем массив фильтров в HTML-строку
  const filterItemsTemplate = filters.map((filter) =>
    // Для каждого фильтра вызываем функцию создания разметки
    createFilterItemTemplate(filter, filter.isChecked, filter.isDisabled)
  ).join('');  // Объединяем массив строк в одну строку

  // Возвращаем полную форму с фильтрами
  return `<form class="trip-filters" action="#" method="get">
            ${filterItemsTemplate}  <!-- Вставляем созданные элементы фильтров -->
          </form>`;
}

// Класс компонента фильтров, наследуется от AbstractView
export default class FilterView extends AbstractView {
  #filters = [];  // Приватное поле для хранения данных фильтров

  // Конструктор класса
  constructor(filters) {
    super();  // Вызываем конструктор родительского класса
    this.#filters = filters;  // Сохраняем переданные фильтры в приватное поле
  }

  // Геттер для получения HTML-шаблона
  get template() {
    // Возвращаем разметку, созданную на основе данных фильтров
    return createFilterTemplate(this.#filters);
  }
}
