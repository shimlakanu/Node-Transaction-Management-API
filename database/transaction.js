const { updateAccount, fetchAccountById } = require("./account");

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
 * The function checks if the receiver is not null.
 * @returns a boolean value. It will return `true` if the `receiver` parameter is not null, and `false`
 * if it is null.
 */
function isValidReceiver({ receiver }) {
  return receiver !== null;
}

/**
 * The function checks if the balance of a given account is sufficient for a given amount.
 * @returns The function `isSufficientAmount` is returning a boolean value indicating whether the
 * `account` object has a balance greater than or equal to the `amount` specified.
 */
function isSufficientAmount({ account, amount }) {
  return account.balance >= amount;
}

//TODO : chect integrity
/**
 * The function updates the balances of the sender and receiver accounts and then updates their account
 * information.
 */
async function postTransaction({ sender, receiver, amount }) {
  sender.balance -= amount;
  receiver.balance += amount;
  await updateAccount({ updatedAccountInfo: sender });
  await updateAccount({ updatedAccountInfo: receiver });
}

/**
 * The function checks if the provided admin ID and password match the actual admin ID and password
 * stored in the environment variables.
 * @returns a boolean value - `true` if the `adminId` and `adminPassword` passed as arguments match the
 * values of `process.env.ADMIN_ID` and `process.env.ADMIN_PASSWORD` respectively, and `false`
 * otherwise.
 */
function isValidAdmin({ adminId, adminPassword }) {
  const actual_adminId = process.env.ADMIN_ID;
  const actual_adminPassword = process.env.ADMIN_PASSWORD;
  if (actual_adminId === adminId && actual_adminPassword === adminPassword) {
    return true;
  }
  return false;
}

/**
 * The function makes a transaction between two accounts after validating the sender, receiver, and
 * amount.
 */
async function makeTransaction({
  senderId,
  receiverId,
  senderPassword,
  amount,
}) {
  const sender = await fetchAccountById(senderId);
  const receiver = await fetchAccountById(receiverId);
  if (
    !isValidSender({ sender, password: senderPassword }) ||
    !isValidReceiver({ receiver })
  ) {
    throw new Error("Invalid sender / reciever info");
  }

  if (!isSufficientAmount({ account: sender, amount })) {
    throw new Error("Insufficient balance");
  }

  await postTransaction({ sender, receiver, amount });
}

/**
 * This function performs a transaction initiated by an admin after validating their credentials.
 */
async function adminTransaction({
  amount,
  receiverId,
  adminId,
  adminPassword,
}) {
  const is_valid_admin = isValidAdmin({ adminId, adminPassword });
  if (!is_valid_admin) {
    throw new Error("Invalid admin request");
  }
  await makeTransaction({
    amount,
    receiverId,
    senderId: adminId,
    senderPassword: adminPassword,
  });
}

module.exports = {
  makeTransaction,
  adminTransaction,
};
