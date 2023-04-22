const {
  updateAccount,
  fetchAccountById,
  updateSavingsAccount,
} = require("./account");
const {
  isValidSender,
  isValidReceiver,
  isSufficientAmount,
} = require("./utils");

//TODO : chect integrity
/**
 * The function updates the balances of the sender and receiver accounts and then updates their account
 * information.
 */
async function postTransaction({ sender, receiver, amount }) {
  sender.balance -= amount;
  receiver.balance += amount;
  await updateAccount( sender );
  await updateAccount( receiver );
}

async function postSavingsTransaction({
  senderAccount,
  savingsAccount,
  amount,
}) {
  senderAccount.balance -= amount;
  savingsAccount.balance += amount;
  await updateAccount(senderAccount);
  await updateSavingsAccount(savingsAccount);
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
  postTransaction,
  postSavingsTransaction,
};
