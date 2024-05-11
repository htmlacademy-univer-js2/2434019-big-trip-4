import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';
import { isEscapeKey } from '../utils/common.js';
import EventView from '../view/event-view.js';
import EventEditView from '../view/event-edit-view.js';
import { UserAction, UpdateType } from '../const.js';
import { isBigDifference } from '../utils/event.js';

export default class EventPresenter {
  #eventListContainer = null;
  #destinationsModel = null;
  #offersModel = null;

  #event = null;
  #eventComponent = null;
  #eventEditComponent = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({eventListContainer, destinationsModel, offersModel, onDataChange, onModeChange}) {
    this.#eventListContainer = eventListContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
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
      eventDestination: this.#destinationsModel.get(),
      eventOffers: this.#offersModel.get(),
      onEditSubmit: this.#editSubmitHandler,
      onEditReset: this.#editResetHandler,
      onRollupClick: this.#editorRollupClickHandler,
    });


    if (prevEventComponent === null || prevEventEditComponent === null) {
      render(this.#eventComponent, this.#eventListContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#eventComponent, prevEventComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#eventEditComponent.reset(this.#event);
      this.#replaceEditorToEvent();
    }
  }

  destroy() {
    remove(this.#eventComponent);
    remove(this.#eventEditComponent);
  }

  #replaceEventToEditor() {
    replace(this.#eventEditComponent, this.#eventComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditorToEvent() {
    replace(this.#eventComponent, this.#eventEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #favoriteClickHandler = () => {
    this.#onDataChange(
      UserAction.UPDATE_EVENT,
      UpdateType.MINOR,
      {...this.#event, isFavorite: !this.#event.isFavorite},
    );
  };

  #eventRollupClickHandler = () => {
    this.#replaceEventToEditor();
  };

  #editorRollupClickHandler = () => {
    this.#eventEditComponent.reset(this.#event);
    this.#replaceEditorToEvent();
  };

  #editSubmitHandler = (update) => {
    const isMinorUpdate = isBigDifference(update, this.#event);
    this.#onDataChange(
      UserAction.UPDATE_EVENT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
    this.#replaceEditorToEvent();
  };

  #editResetHandler = (event) => {
    this.#onDataChange(
      UserAction.DELETE_EVENT,
      UpdateType.MINOR,
      event,
    );
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#eventEditComponent.reset(this.#event);
      this.#replaceEditorToEvent();
    }
  };
}
