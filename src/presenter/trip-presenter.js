import { render, RenderPosition } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import TripEventsView from '../view/trip-events-view.js';
import SortView from '../view/sort-view.js';
import EventPresenter from './event-presenter.js';
import NoEventView from '../view/no-event-view.js';

export default class TripPresenter {
  #eventListComponent = new TripEventsView();
  #sortComponent = new SortView();
  #noEventComponent = new NoEventView();

  #tripContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #eventsModel = null;
  #tripEvents = null;

  #eventPresenters = new Map();

  constructor({tripContainer, destinationsModel, offersModel, eventsModel}) {
    this.#tripContainer = tripContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#eventsModel = eventsModel;
  }

  init() {
    this.#tripEvents = [...this.#eventsModel.get()];

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

  #renderSort() {
    render(this.#sortComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #renderNoEvents() {
    render(this.#noEventComponent, this.#tripContainer, RenderPosition.AFTERBEGIN);
  }

  #handleEventChange = (updatedEvent) => {
    this.#tripEvents = updateItem(this.#tripEvents, updatedEvent);
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
