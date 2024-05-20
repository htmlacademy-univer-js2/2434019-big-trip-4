import { sortByDay, sortByPrice, sortByTime } from './event.js';
import { SortType } from '../const.js';

const sort = {
  [SortType.DAY]: (points) => points.sort(sortByDay),
  [SortType.PRICE]: (points) => points.sort(sortByPrice),
  [SortType.TIME]: (points) => points.sort(sortByTime),
  [SortType.EVENT]: () => {
    throw new Error(`Sort by ${SortType.EVENT} is not implemented`);
  },
  [SortType.OFFER]: () => {
    throw new Error(`Sort by ${SortType.OFFER} is not implemented`);
  }
};

export {sort};
