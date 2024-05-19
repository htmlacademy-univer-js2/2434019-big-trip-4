import TripInfoView from './view/trip-info-view.js';
import NewEventButtonView from './view/new-event-view.js';
import { render, RenderPosition } from './framework/render.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventsApiService from './service/events-api-service.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import EventsModel from './model/events-model.js';
import FilterModel from './model/filter-model.js';

const AUTHORIZATION = 'Basic dd89j3m2h5l';
const END_EVENT = 'https://21.objects.htmlacademy.pro/big-trip';

const tripMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const eventsApiService = new EventsApiService(END_EVENT, AUTHORIZATION);
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel(eventsApiService);
const offersModel = new OffersModel(eventsApiService);
const eventsModel = new EventsModel({
  eventsApiService,
  destinationsModel,
  offersModel
});

const routePresenter = new TripPresenter({
  tripEventsContainer,
  destinationsModel,
  offersModel,
  eventsModel,
  filterModel,
  onNewEventDestroy: handleNewEventFormClose
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  eventsModel
});

const newEventButtonComponent = new NewEventButtonView({
  onClick: handleNewEventButtonClick
});

function handleNewEventFormClose() {
  newEventButtonComponent.element.disabled = false;
}

function handleNewEventButtonClick() {
  routePresenter.createEvent();
  newEventButtonComponent.element.disabled = true;
}

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
render(newEventButtonComponent, tripMainContainer, RenderPosition.BEFOREEND);

routePresenter.init();
filterPresenter.init();
eventsModel.init();
