import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getRandomInteger } from './common';
import { Duration, MSEC_IN_HOUR, MSEC_IN_DAY } from '../const';

dayjs.extend(duration);
dayjs.extend(relativeTime);

let date = dayjs().subtract(getRandomInteger(0, Duration.DAY), 'day').toDate();

const formatStringToDateTime = (dateF) => dayjs(dateF).format('DD/MM/YY HH:mm');
const formatStringToShortDate = (dateF) => dayjs(dateF).format('MMM DD');
const formatStringToTime = (dateF) => dayjs(dateF).format('HH:mm');

const getPointDuration = (dateFrom, dateTo) => {
  const timeDiff = dayjs(dateTo).diff(dayjs(dateFrom));

  if (timeDiff >= MSEC_IN_DAY) {
    return dayjs.duration(timeDiff).format('DD[D] HH[H] mm[M]');
  } else if (timeDiff >= MSEC_IN_HOUR) {
    return dayjs.duration(timeDiff).format('HH[H] mm[M]');
  }
  return dayjs.duration(timeDiff).format('mm[M]');
};

const sortByTime = (event1, event2) => {
  const time1 = dayjs(event1.dateTo).diff(dayjs(event1.dateFrom));
  const time2 = dayjs(event2.dateTo).diff(dayjs(event2.dateFrom));

  return time2 - time1;
};

const sortByPrice = (event1, event2) => event2.price - event1.price;

function getDate({ next }) {
  const minsGap = getRandomInteger(0, Duration.MIN);
  const hoursGap = getRandomInteger(1, Duration.HOUR);
  const daysGap = getRandomInteger(0, Duration.DAY);

  if (next) {
    date = dayjs(date)
      .add(minsGap, 'minute')
      .add(hoursGap, 'hour')
      .add(daysGap, 'day')
      .toDate();
  }

  return date;
}

function isEventFuture(event) {
  return dayjs().isBefore(event.dateFrom);
}

function isEventPresent(event) {
  return dayjs().isAfter(event.dateFrom) && dayjs().isBefore(event.dateTo);
}

function isEventPast(event) {
  return dayjs().isAfter(event.dateTo);
}

export {
  getDate,
  formatStringToDateTime,
  formatStringToShortDate,
  formatStringToTime,
  getPointDuration,
  isEventFuture,
  isEventPresent,
  isEventPast,
  sortByTime,
  sortByPrice};
