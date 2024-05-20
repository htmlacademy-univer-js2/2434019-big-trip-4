import dayjs from 'dayjs';
import { DESTINATION_ITEMS_LENGTH, SortType } from '../const';
import { sort } from './sort';

function getTripTitle(events = [], destinations = []) {
  const destinationNames = sort[SortType.DAY]([...events])
    .map((event) => destinations.find((destination) => destination.id === event.destination).name);

  return destinationNames.length <= DESTINATION_ITEMS_LENGTH
    ? destinationNames.join('&nbsp;&mdash;&nbsp;')
    : `${destinationNames.at(0)}&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${destinationNames.at(-1)}`;
}

function getTripDuration(events = []) {
  const sortedEvents = sort[SortType.DAY]([...events]);

  return (sortedEvents.length > 0)
    ? `${dayjs(sortedEvents.at(0).dateFrom).format('DD MMM')}&nbsp;&mdash;&nbsp;${dayjs(sortedEvents.at(-1).dateTo).format('DD MMM')}`
    : '';
}

function getOffersCost(offerIds = [], offers = []) {
  return offerIds.reduce(
    (result, id) => result + (offers.find((offer) => offer.id === id)?.price ?? 0),
    0
  );
}

function getTripCost(events = [], offers = []) {
  return events.reduce(
    (result, event) => result + event.price + getOffersCost(event.offers, offers.find((offer) => event.type === offer.type)?.offers),
    0
  );
}

export {
  getTripTitle,
  getTripDuration,
  getTripCost
};
