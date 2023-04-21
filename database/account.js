const supabase = require("../supabaseClient");
const uuid = require("uuid");

function generateAccountId() {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const second = now.getSeconds().toString().padStart(2, "0");
  const millisecond = now.getMilliseconds().toString().substring(-2);
  const randomNumber = Math.floor(1000 + Math.random() * 9000)
    .toString()
    .substring(-2);
  const accountId = `${year}${month}${day}${hour}${minute}${second}${millisecond}${randomNumber}`;
  return accountId;
}

/**
 * This function fetches an account from a Supabase database by its ID and returns the data if it
 * exists, or null if there was an error.
 */
async function fetchAccountById(account_id) {
  const { data, error } = await supabase
    .from("Account")
    .select()
    .eq("account_id", account_id)
    .limit(1)
    .single();

  if (!error) {
    return data;
  }
  return null;
}

/**
 * This function creates a new account with a generated account ID, name, password, creation date,
 * balance, and reward points, and inserts it into a Supabase database table called "Account".
 */
async function createAccount({ name, password }) {
  let account_id = generateAccountId();
  const accountInfo = {
    account_id: account_id,
    name: name,
    password: password,
    created_at: new Date().toJSON(),
    balance: 0,
    reward_point: 0,
  };
  const { status, error } = await supabase.from("Account").insert(accountInfo);
  if (!error) {
    return { status, accountInfo };
  }
  return null;
}

/**
 * This function updates an account's information in a Supabase database.
 * @param updatedAccountInfo - `updatedAccountInfo` is an object that contains the updated information
 * for an account.
 */
async function updateAccount(updatedAccountInfo) {
  const { data, error } = await supabase
    .from("Account")
    .upsert(updatedAccountInfo);
}

module.exports = {
  fetchAccountById,
  createAccount,
  updateAccount,
};
