import Observable from '../framework/observable.js';
import { FilterType } from '../const.js';

/**
 * Модель для управления состоянием фильтров
 * Наследуется от Observable для уведомления наблюдателей об изменениях
 */
export default class FilterModel extends Observable {
  #filter = FilterType.EVERYTHING; // Текущий активный фильтр

  /**
   * Возвращает текущий активный фильтр
   * @returns {string} текущий фильтр
   */
  get filter() {
    return this.#filter;
  }

  /**
   * Устанавливает новый фильтр и уведомляет наблюдателей
   * @param {string} updateType - тип обновления (MAJOR, MINOR, PATCH)
   * @param {string} filter - новый фильтр
   */
  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }

  /**
   * Сбрасывает фильтр на значение по умолчанию
   * @param {string} updateType - тип обновления
   */
  resetFilter(updateType) {
    this.#filter = FilterType.EVERYTHING;
    this._notify(updateType, this.#filter);
  }
}
