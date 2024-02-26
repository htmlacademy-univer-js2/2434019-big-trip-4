import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import {render, RenderPosition} from './render.js';
import RoutePresenter from './presenter/route-presenter.js';

const tripMainContainer = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const routePresenter = new RoutePresenter({
  container: tripEventsContainer
});

render(new TripInfoView(), tripMainContainer, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterContainer);

routePresenter.init();
