const supabase = require("../supabaseClient");
const uuid = require("uuid");

function generateAccountId() {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const minute = now.getMinutes().toString().padStart(2, '0');
  const second = now.getSeconds().toString().padStart(2, '0');
  const millisecond = now.getMilliseconds().toString().substring(-2);
  const randomNumber = Math.floor(1000 + Math.random() * 9000).toString().substring(-2);
  const accountId = `${year}${month}${day}${hour}${minute}${second}${millisecond}${randomNumber}`;
  return accountId;
}


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

async function createAccount({ name, password }) {
  let account_id = generateAccountId();
  const accountInfo = {
    account_id: account_id,
    name: name,
    password: password,
    created_at: new Date().toJSON(),
    balance: 0,
    reward_point: 0,
  }
  const { status, error } = await supabase.from("Account").insert(accountInfo);
  if(!error){
    return  {status,accountInfo};
  }
  return null;
}

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
