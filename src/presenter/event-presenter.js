import { render, replace, remove } from '../framework/render.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';

export default class EventPresenter {
  #eventListContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #event = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #onDataChange = null;

  constructor({eventListContainer, destinationsModel, offersModel, onDataChange}) {
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
  }

  init(event) {
    this.#event = event;

    const prevEventComponent = this.#eventComponent;
    const prevEventEditComponent = this.#eventEditComponent;

    this.#eventComponent = new EventView({
      event: this.#event,
      eventDestination: this.#destinationsModel.getById(event.destination),
      eventOffers: this.#offersModel.getByType(event.type),
      onRollupClick: this.#eventRollupClickHandler,
      onFavoriteClick: this.#favoriteClickHandler,
    });

    this.#eventEditComponent = new EventEditView({
      event: this.#event,
      eventDestination: this.#destinationsModel.getById(event.destination),
      eventOffers: this.#offersModel.getByType(event.type),
      onEditSubmit: this.#editSubmitHandler,
      onRollupClick: this.#editorRollupClickHandler,
    });


    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer.element);
      return;
    }

    if (this.#eventListContainer.element.contains(prevEventComponent.element)) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#eventListContainer.element.contains(prevEventEditComponent.element)) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  #replaceEventToEditor() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #replaceEditorToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #favoriteClickHandler = () => {
    this.#onDataChange({...this.#event, isFavorite: !this.#event.isFavorite});
  };

  #eventRollupClickHandler = () => {
    this.#replaceEventToEditor();
  };

  #editorRollupClickHandler = () => {
    this.#replaceEditorToEvent();
  };

  #editSubmitHandler = (event) => {
    this.#replaceEditorToEvent();
    this.#onDataChange(event);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditorToEvent();
    }
  };
}
