import { getRandomInteger } from '../utils/common.js';
import { getDate } from '../utils/event.js';
import { Price } from '../const.js';

function generateEvent(type, offersID, destinationID) {
  return {
    id: crypto.randomUUID(),
    type,
    price: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    isFavorite: getRandomInteger(0, 1),
    destination: destinationID,
    offers: offersID
  };
}

export {generateEvent};
