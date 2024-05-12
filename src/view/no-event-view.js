import AbstractView from '../framework/view/abstract-view.js';
import { NoEventsTextType } from '../utils/filter.js';

function createNoEventElement(filterType) {
  return `<p class="trip-events__msg">${NoEventsTextType[filterType]}</p>`;
}

export default class NoEventView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventElement(this.#filterType);
  }
}
