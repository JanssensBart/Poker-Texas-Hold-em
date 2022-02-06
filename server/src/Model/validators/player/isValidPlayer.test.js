const isValidPlayer = require('./isValidPlayer');

describe('Tests for isValidPlayer.js', () => {
  const playerString = {
    name: 123,
    playerID: '2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d'
  };
  test('Player.name must be a string', () => {
    expect(isValidPlayer(playerString)).toEqual(false);
  });

  const playerEmpty = {
    name: '',
    playerID: '2c5ea4c0-4067-11e9-8bad-9b1deb4d3b7d'
  };
  test('Player.name cannot be empty!', () => {
    expect(isValidPlayer(playerEmpty)).toEqual(false);
  });
});
