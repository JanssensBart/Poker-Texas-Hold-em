const SUITS = require('../../../Constants/suits');

module.exports = card => {
  const { value, suit } = card;

  // value should be of type Number
  if (isNaN(value)) {
    return false;
  }

  // value cannot be less than 1 or be greater than 15
  if (value <= 1 || value >= 15) {
    return false;
  }

  // suit cannot be of type Number
  if (!isNaN(suit)) {
    return false;
  }

  // suit should be of type String
  if (typeof suit !== 'string') {
    return false;
  }

  // suit should be one of the predefined suits
  if (!SUITS.includes(suit)) {
    return false;
  }

  // parse value to Number if passed as String
  parseInt(value);

  return card;
};
