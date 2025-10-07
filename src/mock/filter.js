// Импортируем объект с функциями фильтрации
import { filter } from '../utils/filter.js';

// Функция для генерации данных фильтров (аналогично вашему примеру с задачами)
function generateFilter(points) {
  // Преобразуем объект filter в массив с информацией о каждом фильтре
  return Object.entries(filter).map(
    ([filterType, filterPoints]) => {
      // Применяем фильтр к точкам и получаем отфильтрованный массив
      const filteredPoints = filterPoints(points);
      return {
        type: filterType,
        name: getFilterDisplayName(filterType),
        count: filteredPoints.length,
        isDisabled: filteredPoints.length === 0,
        isChecked: filterType === 'everything'
      };
    }
  );
}

// Вспомогательная функция для получения отображаемого имени фильтра
function getFilterDisplayName(filterType) {
  const names = {
    everything: 'Everything',
    future: 'Future',
    present: 'Present',
    past: 'Past'
  };

  return names[filterType] || filterType;
}

// Экспортируем функцию для использования в других модулях
export { generateFilter };
