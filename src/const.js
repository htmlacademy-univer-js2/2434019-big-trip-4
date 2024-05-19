const DEFAULT_TYPE = 'flight';
const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const CITIES = ['Amsterdam', 'Chamonix', 'Geneva'];

const EVENT_EMPTY = {
  type: DEFAULT_TYPE,
  price: 0,
  dateFrom: null,
  dateTo: null,
  isFavorite: false,
  destination: null,
  offers: []
};

const MSEC_IN_SEC = 1000;
const SEC_IN_MIN = 60;
const MIN_IN_HOUR = 60;
const HOUR_IN_DAY = 24;

const MSEC_IN_HOUR = MIN_IN_HOUR * SEC_IN_MIN * MSEC_IN_SEC;
const MSEC_IN_DAY = HOUR_IN_DAY * MSEC_IN_HOUR;

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer',
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const EditType = {
  EDITING: 'EDITING',
  CREATING: 'CREATING'
};

const ButtonLabel = {
  CANCEL_DEFAULT: 'Cancel',
  DELETE_DEFAULT: 'Delete',
  SAVE_DEFAULT: 'Save'
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export {
  TYPES,
  CITIES,
  EVENT_EMPTY,
  MSEC_IN_HOUR,
  MSEC_IN_DAY,
  FilterType,
  Mode,
  SortType,
  UserAction,
  UpdateType,
  EditType,
  ButtonLabel,
  Method};
