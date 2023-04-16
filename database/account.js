const supabase = require("../supabaseClient");
const uuid = require("uuid");

async function fetchAccountById(account_id) {
  const { data, error } = await supabase
    .from("Account")
    .select()
    .eq("id", account_id)
    .limit(1)
    .single();

  if (!error) {
    return data;
  } else {
    return null;
  }
}

async function createAccount({ name, password }) {
  let account_id = uuid.v4();
  const { data, error } = await supabase.from("Account").insert({
    account_id: account_id,
    name: name,
    password: password,
    created_at: new Date().toJSON(),
    balance: 0,
    reward_point: 0,
  });
}

async function updateAccount({ updatedAccountInfo }) {
  const { data, error } = await supabase
    .from("Account")
    .upsert(updatedAccountInfo);
}

module.exports = {
  fetchAccountById,
  createAccount,
  updateAccount,
};
