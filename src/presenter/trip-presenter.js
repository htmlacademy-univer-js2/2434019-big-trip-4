import { render, RenderPosition, remove } from '../framework/render.js';
import TripEventsView from '../view/trip-events-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';
import NoEventView from '../view/no-event-view.js';
import { SortType, UserAction, UpdateType } from '../const.js';
import { sortByTime, sortByPrice } from '../utils/event.js';

export default class TripPresenter {
  #eventListComponent = new TripEventsView();
  #sortComponent = null;
  #noEventComponent = new NoEventView();

  #tripContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;

  #eventPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({tripContainer, destinationsModel, offersModel, eventsModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  get events() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#eventsModel.get()].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#eventsModel.get()].sort(sortByPrice);
    }
    return this.#eventsModel.get();
  }

  init() {
    this.#renderTrip();
  }

  #renderTrip() {
    if (this.events.length === 0) {
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

  #clearTrip({ resetSortType = false} = {}) {
    this.#eventPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPresenters.clear();

    remove(this.#sortComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearTrip();
    this.#renderTrip();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_EVENT:
        this.#eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.ADD_EVENT:
        this.#eventsModel.addEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this.#eventsModel.deleteEvent(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#eventPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearTrip();
        this.#renderTrip();
        break;
      case UpdateType.MAJOR:
        this.#clearTrip({resetSortType: true});
        this.#renderTrip();
        break;
    }
  };

  #handleModeChange = () => {
    this.#eventPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderEvents() {
    this.events.forEach((event) => this.#renderEvent(event));
  }

  #renderEvent(event) {
    const eventPresenter = new EventPresenter({
      eventListContainer: this.#eventListComponent,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    eventPresenter.init(event);
    this.#eventPresenters.set(event.id, eventPresenter);
  }
}
