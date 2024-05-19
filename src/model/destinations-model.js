export default class DestinationsModel {
  #eventsApiService = null;
  #destinations = null;

  constructor(eventsApiService) {
    this.#eventsApiService = eventsApiService;
  }

  async init() {
    this.#destinations = await this.#eventsApiService.destinations;
    return this.#destinations;
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    return this.#destinations.find((destination) => destination.id === id);
  }
}
