import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import TripEventsView from '../view/trip-events-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';
import NoEventView from '../view/no-event-view.js';
import { SortType } from '../const.js';
import { sortByTime, sortByPrice } from '../utils/event.js';

export default class TripPresenter {
  #eventListComponent = new TripEventsView();
  #sortComponent = null;
  #noEventComponent = new NoEventView();

  #tripContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #tripEvents = null;

  #eventPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedBoardEvents = [];

  constructor({tripContainer, destinationsModel, offersModel, eventsModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#tripEvents = [...this.#eventsModel.get()];
    this.#sourcedBoardEvents = [...this.#eventsModel.get()];

    this.#renderTrip();
  }

  #renderTrip() {
    if (this.#tripEvents.length === 0) {
      this.#renderNoEvents();
      return;
    }

    this.#renderSort();
    this.#renderEventContainer();
    this.#renderEvents();
  }

  #renderEventContainer() {
    render(this.#eventListComponent, this.#tripContainer);
  }

  #sortEvents(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#tripEvents.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#tripEvents.sort(sortByPrice);
        break;
      default:
        this.#tripEvents = [...this.#sourcedBoardEvents];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortEvents(sortType);
    this.#clearEventList();
    this.#renderEvents();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #clearEventList() {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();
  }

  #renderNoEvents() {
    render(this.#noEventComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #handleEventChange = (updatedEvent) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedEvent);
    this.#sourcedBoardEvents = updateItem(this.#sourcedBoardEvents, updatedEvent);
    this.#eventPresenters.get(updatedEvent.id).init(updatedEvent);
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEvents() {
    for (let i = 0; i < this.#tripEvents.length; i++) {
      this.#renderEvent(this.#tripEvents[i]);
    }
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleEventChange,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }
}
