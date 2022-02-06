/**
 * @description validates given amount to be of type Number and the value cannot be less than 0
 * @param { number } amount
 * @returns { number } amount
 */
module.exports = amount => {
  // amount should be of type Number
  if (isNaN(amount)) {
    return false;
  }

  // amount should not be less than 0
  if (amount < 0) {
    return false;
  }

  return amount;
};
