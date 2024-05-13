const isEscapeKey = (evt) => evt.key === 'Escape';

function getRandomInteger (min, max) {
  const lower = Math.ceil(Math.min(Math.abs(min), Math.abs(max)));
  const upper = Math.floor(Math.max(Math.abs(min), Math.abs(max)));
  const result = Math.random() * (upper - lower + 1) + lower;

  return Math.floor(result);
}

function getRandomArrayElement(items) {
  return items[getRandomInteger(0, items.length - 1)];
}

function firstLetterToUpperCase(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function firstLetterToLowerCase(type) {
  return type.toLowerCase();
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}

export {
  getRandomInteger,
  getRandomArrayElement,
  firstLetterToUpperCase,
  firstLetterToLowerCase,
  updateItem,
  isEscapeKey};
