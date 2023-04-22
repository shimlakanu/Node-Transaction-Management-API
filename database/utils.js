/**
 * The function checks if the receiver is not null.
 * @returns a boolean value. It will return `true` if the `receiver` parameter is not null, and `false`
 * if it is null.
 */
function isValidReceiver({ receiver }) {
  return receiver !== null;
}

/**
 * The function checks if the sender and password are valid.
 * @returns a boolean value. It will return `true` if the `sender` object has a `password` property
 * that matches the `password` argument passed to the function, and `false` otherwise.
 */
function isValidSender({ sender, password }) {
  if (!sender || sender.password !== password) {
    return false;
  }
  return true;
}

/**
 * The function checks if the balance of a given account is sufficient for a given amount.
 * @returns The function `isSufficientAmount` is returning a boolean value indicating whether the
 * `account` object has a balance greater than or equal to the `amount` specified.
 */
function isSufficientAmount({ account, amount }) {
  return account.balance >= amount;
}

module.exports = { isSufficientAmount, isValidReceiver, isValidSender };
