// Обрабатывается node.js
const path = require('path'); // Импортировали модуль path
const CopyPlugin = require('copy-webpack-plugin');

// Экспорт объекта конфигураций
module.exports = {
  entry: './src/main.js', // Точка входа
  output: { // output сообщает сборщику, где и как хранить файлы, появляющиеся в результате сборки проекта
    filename: 'bundle.js', // Имя имя файла с итоговым кодом (бандла)
    path: path.resolve(__dirname, 'build'), // Путь к директории, которая будет создана после сборки проекта
    clean: true, // Удаляем предыдущую сборку перед созданием новой
  },
  devtool: 'source-map', // Генерируем карту исходного кода для показа в в DevTools
  plugins: [ // Подключаем плагины
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [ // Добавляем лоадеры
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          },
        },
      },
    ],
  },
};
