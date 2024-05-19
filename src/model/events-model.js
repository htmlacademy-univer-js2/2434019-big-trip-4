import Observable from '../framework/observable.js';
import { updateItem } from '../utils/common.js';
import { adaptToClient } from '../utils/adapt.js';
import { UpdateType } from '../const.js';

export default class EventsModel extends Observable {
  #eventsApiService = null;
  #destinationsModel = null;
  #offersModel = null;
  #events = [];

  constructor({eventsApiService, destinationsModel, offersModel}) {
    super();
    this.#eventsApiService = eventsApiService;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  get() {
    return this.#events;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offersModel.init()
      ]);
      const events = await this.#eventsApiService.events;
      this.#events = events.map(adaptToClient);
      this._notify(UpdateType.INIT, {isError: false});
    } catch(err) {
      this.#events = [];
      this._notify(UpdateType.INIT, {isError: true});
    }
  }

  async updateEvent(updateType, update) {
    try {
      const response = await this.#eventsApiService.updateEvent(update);
      const updatedEvent = adaptToClient(response);
      this.#events = updateItem(this.#events, updatedEvent);
      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
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
