import Observable from '../framework/observable.js';
import { updateItem } from '../utils/common.js';

export default class EventsModel extends Observable {
  #service = null;
  #events = null;

  constructor(service) {
    super();
    this.#service = service;
    this.#events = this.#service.events;
  }

  get() {
    return this.#events;
  }

  updateEvent(updateType, update) {
    this.#events = updateItem(this.#events, update);
    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this.#events.push(update);
    this._notify(updateType, update);
  }

  deleteEvent(updateType, update) {
    this.#events = this.#events.filter((eventItem) => eventItem.id !== update.id);
    this._notify(updateType);
  }
}
