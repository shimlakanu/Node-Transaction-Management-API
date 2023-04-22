const supabase = require("../supabaseClient");
const {
  fetchAccountById,
  createSavingsAccount,
  fetchSavingsAccountById,
} = require("./account");
const { postSavingsTransaction } = require("./transaction");
const { isValidReceiver, isSufficientAmount, isValidSender } = require("./utils");

//making savings account :
async function makeSavingsAccount({
  account_id,
  account_password,
  savings_password,
}) {
  const accountInfo = await fetchAccountById(account_id);
  const isValidAccount = isValidReceiver({ receiver: accountInfo });
  if (!isValidAccount) {
    throw new Error("Invalid account id");
  }
  if (accountInfo.password !== account_password) {
    throw new Error("Invalid account password");
  }

  const { status, savings_accountInfo } = await createSavingsAccount({
    account_id,
    savings_password,
  });
  return { status, savings_accountInfo };
}

// savings transactions :
async function makeSavingsTransaction({ amount, account_id, password }) {
  const account = await fetchAccountById(account_id);
  if (!isValidSender({ sender: account, password })) {
    throw new Error("Invalid account id");
  }

  const savingsAccount = await fetchSavingsAccountById(account_id);
  if (!isValidReceiver({ savingsAccount })) {
    throw new Error("Savings account not found");
  }
  if (!isSufficientAmount({ account: account, amount })) {
    throw new Error("Insufficient balance");
  }

  await postSavingsTransaction({
    senderAccount: account,
    savingsAccount: savingsAccount,
    amount,
  });
}

module.exports = { makeSavingsAccount, makeSavingsTransaction };
