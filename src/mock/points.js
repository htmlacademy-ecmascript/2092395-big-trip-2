import { getRandomArrayElement } from '../utils.js';
// import { TYPE_OF_EVENTS } from '../const.js';

const mockPoints = [
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808c',
    basePrice: 20,
    dateFrom: '2019-03-18T10:30:56.845Z',
    dateTo: '2019-03-18T11:00:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e04',
    isFavorite: true,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa31',
    ],
    type: 'taxi',
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808d',
    basePrice: 160,
    dateFrom: '2019-03-18T12:25:56.845Z',
    dateTo: '2019-03-18T13:35:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e05',
    isFavorite: false,
    offers: [
      'b4c3e4e6-9053-42ce-b747-e281314baa32',
    ],
    type: 'flight',
  },
  {
    id: 'f4b62099-293f-4c3d-a702-94eec4a2808e',
    basePrice: 1300,
    dateFrom: '2019-03-18T14:30:56.845Z',
    dateTo: '2019-03-18T16:05:13.375Z',
    destination: 'bfa5cb75-a1fe-4b77-a83c-0e528e910e06',
    isFavorite: true,
    offers: [],
    type: 'drive',
  },
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export { getRandomPoint };
