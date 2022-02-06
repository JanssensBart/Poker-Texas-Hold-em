const isValidWallet = require('./isValidWallet');

const badWallet = {
  playerId: 'Jonas',
  credits: 'duizend'
};

describe('A bad wallet', () => {
  test('should not be a valid wallet', () => {
    expect(isValidWallet(badWallet)).toEqual(false);
  });
});

const emptyWallet = {};

describe('A empty wallet', () => {
  test("should not be a valid wallet because it's empty", () => {
    expect(isValidWallet(emptyWallet)).toEqual(false);
  });
});

const wrongWallet = {
  brand: 'The money keeping brand'
};

describe('A wrong wallet', () => {
  test("should not be a valid wallet because it's wrong one", () => {
    expect(isValidWallet(wrongWallet)).toEqual(false);
  });
});

const goodWallet = {
  playerId: '123e-hgheg24',
  credits: 16401
};

describe('A good wallet', () => {
  test('should be a valid wallet', () => {
    expect(isValidWallet(goodWallet)).toEqual(true);
  });
});
