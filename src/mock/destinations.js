import { getRandomInteger, getRandomArrayElement } from '../utils.js';
import { CITIES, DESCRIPTIONS } from '../const.js';

const createDescriptions = () =>
  Array.from({ length: getRandomInteger(1, 3) }, () =>
    getRandomArrayElement(DESCRIPTIONS)
  ).join(' ');

export const mockDestinations = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808a',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808b',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808d',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808e',
    description: 'Chamonix parliament building',
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808f',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808j',
    description: 'Chamonix parliament building',
    name: getRandomArrayElement(CITIES),
    pictures: [
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808h',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808i',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: ''
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      },
      {
        src: `img/photos/${getRandomInteger(1, 5)}.jpg`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808j',
    description: createDescriptions(),
    name: getRandomArrayElement(CITIES),
    pictures: [
    ]
  }
];
