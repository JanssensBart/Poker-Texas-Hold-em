module.exports = (player) => {
  const { name, socket } = player;

  // name must be a string
  if (typeof name !== "string") {
    return false;
  }
  // name must exist
  if (name === "") {
    return false;
  }

  return player;
};
