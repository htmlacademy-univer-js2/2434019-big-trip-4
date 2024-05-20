import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MSEC_IN_HOUR, MSEC_IN_DAY } from '../const';

dayjs.extend(duration);
dayjs.extend(relativeTime);

const formatStringToDateTime = (dateF) => dayjs(dateF).format('DD/MM/YY HH:mm');
const formatStringToShortDate = (dateF) => dayjs(dateF).format('MMM DD');
const formatStringToTime = (dateF) => dayjs(dateF).format('HH:mm');

const getEventDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDiff >= MSEC_IN_DAY) {
    return dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= MSEC_IN_HOUR) {
    return dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }
  return dayjs.duration(timeDiff).format('mm[M]');
};

function sortByDay(event1, event2) {
  return new Date(event1.dateFrom) - new Date(event2.dateFrom);
}

const sortByTime = (event1, event2) => {
  const time1 = dayjs(event1.dateTo).diff(dayjs(event1.dateFrom));
  const time2 = dayjs(event2.dateTo).diff(dayjs(event2.dateFrom));

  return time2 - time1;
};

const sortByPrice = (event1, event2) => event2.price - event1.price;

function isBigDifference(event1, event2) {
  return event1.price !== event2.price
    || getEventDuration(event1.dateFrom, event1.dateTo) !== getEventDuration(event2.dateFrom, event2.dateTo);
}

export {
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  getEventDuration,
  sortByDay,
  sortByTime,
  sortByPrice,
  isBigDifference};
