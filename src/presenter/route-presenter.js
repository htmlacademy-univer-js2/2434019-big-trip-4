import { render } from '../render.js';
import TripEventsView from '../view/trip-events-view.js';
import SortView from '../view/sort-view.js';
import EventEditView from '../view/event-edit-view.js';
import EventView from '../view/event-view.js';

export default class RoutePresenter {
  tripEventsComponent = new TripEventsView();

  constructor({container, destinationsModel, offersModel, eventsModel}) {
    this.container = container;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.eventsModel = eventsModel;
  }

  init() {
    this.routeEvents = [...this.eventsModel.get()];

    render(new SortView(), this.container);
    render(this.tripEventsComponent, this.container);
    render(new EventEditView({
      event: this.routeEvents[0],
      eventDestination: this.destinationsModel.getById(this.routeEvents[0].destination),
      eventOffers: this.offersModel.getByType(this.routeEvents[0].type)
    }),
    this.tripEventsComponent.getElement());

    for (let i = 1; i < this.routeEvents.length; i++) {
      render(new EventView({
        event: this.routeEvents[i],
        eventDestination: this.destinationsModel.getById(this.routeEvents[i].destination),
        eventOffers: this.offersModel.getByType(this.routeEvents[i].type)
      }),
      this.tripEventsComponent.getElement());
    }
  }
}
