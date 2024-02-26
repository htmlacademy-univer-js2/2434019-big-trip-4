import { createElement } from '../render.js';

function createTripEventsElement() {
  return '<ul class="trip-events__list"></ul>';
}

export default class TripEventsView {
  getTemplate() {
    return createTripEventsElement();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
