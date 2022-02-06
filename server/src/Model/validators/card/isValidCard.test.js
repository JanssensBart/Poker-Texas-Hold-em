const isValidCard = require('./isValidCard');
const SUITS = require('../../../Constants/suits');

describe('Tests for "isValidCard"', () => {
  // value tests
  const badValue = { value: 'vijf', suit: 'Hearts' };
  test('value must be a number', () => {
    expect(isValidCard(badValue)).toEqual(false);
  });

  const unknownValue = { value: 31, suit: 'Hearts' };
  test('value must be <= 1 || value >= 15', () => {
    expect(isValidCard(unknownValue)).toEqual(false);
  });

  //  >>> what if value is empty OR undefined ???
  const emptyValue = { value: null, suit: 'Hearts' };
  test('value cannot be null', () => {
    expect(isValidCard(emptyValue)).toEqual(false);
  });

  // suit tests
  const suitNotIncluded = { value: 11, suit: 'Harten' };
  test('suit must be an item of SUITS', () => {
    expect(SUITS.includes(suitNotIncluded.suit)).toEqual(false);
  });

  const suitNumber = { value: 11, suit: 11 };
  test('suit can not be a number', () => {
    expect(isValidCard(suitNumber)).toEqual(false);
  });

  //  >>> what if suit is empty OR undefined ???
  const R2D2 = undefined;
  const emptySuit = { value: 11, suit: R2D2 }; // suit = 'undefined'
  test('suit must be a string', () => {
    expect(isValidCard(emptySuit)).toEqual(false);
  });
});
