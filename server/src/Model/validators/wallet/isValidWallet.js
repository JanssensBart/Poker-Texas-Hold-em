module.exports = wallet => {
  const { credits } = wallet;

  if (isNaN(credits)) {
    return false;
  }

  return true;
};
