import { getRandomPoint } from '../mock/points.js';

const POINT_COUNT = 3;

// Создаем заготовку для модели
export default class PointsModel {

  // У конструктора массивов Array вызываем метод from, который позволяет из масиво-подобного объекта получить нормальный массив
  // Вторым аргументом передаем функцию, которая будет применена к каждому элементу массива
  // Получаем массив из 3х элементов
  points = Array.from({length: POINT_COUNT}, getRandomPoint);

  // Публичный метод который ворзвращает массив точек
  getPoints() {
    return this.points;
  }
}
