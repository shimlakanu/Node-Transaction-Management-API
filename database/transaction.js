const { updateAccount, fetchAccountById } = require("./account");

// All the functions related to transactions will go here.
// only those functions will be exported that are actually needed in the top layer.

function isValidSender({ sender, password }) {
  if (!sender || sender.password !== password) {
    return false;
  }
  return true;
}

function isValidReceiver({ receiver }) {
  return receiver !== null;
}

function isSufficientAmount({ account, amount }) {
  return account.balance >= amount;
}

async function postTransaction({ sender, receiver, amount }) {
  sender.amount -= amount;
  receiver.amount += amount;
  await updateAccount({ updatedAccountInfo: sender });
  await updateAccount({ updatedAccountInfo: receiver });
}

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
    !isValidReceiver(receiver)
  ) {
    throw new Error("Invalid sender reciever info");
  }

  if (!isSufficientAmount({ account: sender, amount })) {
    throw new Error("Insufficient amount");
  }

  await postTransaction({ sender, receiver, amount });
}

module.exports = {
  makeTransaction,
};
