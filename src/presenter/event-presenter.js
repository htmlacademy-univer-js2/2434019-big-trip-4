import { render, replace } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class EventPresenter {
  #eventListContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #event = null;
  #eventComponent = null;
  #eventEditComponent = null;

  constructor({eventListContainer, destinationsModel, offersModel}) {
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init(event) {
    this.#event = event;

    this.#eventComponent = new EventView({
      event: this.#event,
      eventDestination: this.#destinationsModel.getById(event.destination),
      eventOffers: this.#offersModel.getByType(event.type),
      onRollupClick: this.#eventRollupClickHandler,
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      eventDestination: this.#destinationsModel.getById(event.destination),
      eventOffers: this.#offersModel.getByType(event.type),
      onEditSubmit: this.#editSubmitHandler,
      onRollupClick: this.#editorRollupClickHandler,
    });

    render(this.#eventComponent, this.#eventListContainer.element);
  }

  #replaceEventToEditor() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditorToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #eventRollupClickHandler = () => {
    this.#replaceEventToEditor();
  };

  #editorRollupClickHandler = () => {
    this.#replaceEditorToEvent();
  };

  #editSubmitHandler = () => {
    this.#replaceEditorToEvent();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditorToEvent();
    }
  };
}
