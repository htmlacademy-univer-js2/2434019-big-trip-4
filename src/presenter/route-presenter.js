import { render } from '../render.js';
import TripEventsView from '../view/trip-events-view.js';
import SortView from '../view/sort-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';

export default class RoutePresenter {
  EVENT_COUNT = 3;
  tripEventsComponent = new TripEventsView();

  constructor({container}) {
    this.container = container;
  }

  init() {
    render(new SortView(), this.container);
    render(this.tripEventsComponent, this.container);
    render(new EventEditView(), this.tripEventsComponent.getElement());

    for (let i = 0; i < this.EVENT_COUNT; i++) {
      render(new EventView(), this.tripEventsComponent.getElement());
    }
  }
}
