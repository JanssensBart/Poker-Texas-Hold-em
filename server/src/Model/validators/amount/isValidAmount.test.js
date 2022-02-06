const isValidAmount = require('./isValidAmount');

const badAmount = 'Jonas';

describe('A bad amount', () => {
  test('should not be a valid amount', () => {
    expect(isValidAmount(badAmount)).toEqual(false);
  });
});

const emptyAmount = {};

describe('A empty amount', () => {
  test("should not be a valid amount because it's empty", () => {
    expect(isValidAmount(emptyAmount)).toEqual(false);
  });
});

const wrongAmount = -9874;

describe('A wrong amount', () => {
  test("should not be a valid amount because it's wrong one", () => {
    expect(isValidAmount(wrongAmount)).toEqual(false);
  });
});

const goodAmount = 1400;

describe('A good amount', () => {
  test('should be a valid amount', () => {
    expect(isValidAmount(goodAmount)).toEqual(goodAmount);
  });
});
