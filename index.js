require("dotenv").config();
const express = require("express");
const supabase = require("./supabaseClient");
const {
  fetchAccountById,
  createAccount,
  updateAccount,
} = require("./database/account");
const { makeTransaction } = require("./database/transaction");
const app = express();
app.use(express.json());
const port = 3000;

// creating new account : (id kmne janbe?)
app.post("/account", async (req, res) => {
  const { name, password } = req.body;
  const { status, accountInfo } = await createAccount({
    name: name,
    password: password,
  });
  if (status == 201) {
    res.json(accountInfo);
    return;
  }
  res.send("failed :(");
});

//fetch account by id:
app.get("/account/:account_id", async (req, res) => {
  const account_id = req.params.account_id;
  const data = await fetchAccountById(account_id);
  if (data) {
    res.send(data);
    return;
  }
  res.send("Account not found!");
});

// get balance of specific account :
app.get("/account/:account_id/balance", async (req, res) => {
  const account_id = req.params.account_id;
  const data = await fetchAccountById(account_id);
  if (data) {
    res.json({ balance: data.balance });
    return;
  }
  res.send("Account not found!");
});

// get reward point of specific account :
app.get("/account/:account_id/reward_point", async (req, res) => {
  const account_id = req.params.account_id;
  const data = await fetchAccountById(account_id);
  if (data) {
    res.json({ "reward point": data.reward_point });
    return;
  }
  res.send("Account not found!");
});

app.post("/transaction", async (req, res) => {
  const {
    amount,
    sender_id: senderId,
    receiver_id: receiverId,
    password,
  } = req.body;
  try{
    await makeTransaction({
      amount,
      receiverId,
      senderId,
      senderPassword: password,
    });
  }
  catch(error){
    res.json({message : error.message});
  }
});


// 1. crate admin account using post with balance
// 2. admin account id, pass -- in .env
// 3. receiver id, admin id, amount 
// 4. adminTransaction(receiverid, admin id, amount)
// 5. (admin id == env. admin id and pass macthed?) if yes then transaction .account
// 6. error handle  


// app.post("/admin/transafer-balance",(req,res)=>{
//   const {amount,password,adminId,receiverId} = req.body;

// });

// app.post("/transaction", async (req, res) => {
//   const from_id = req.body.from_id;
//   const to_id = req.body.to_id;
//   const amount = req.body.amount;
//   const type = req.body.type;
//   const password = req.body.password;

//   const is_valid_sender = await isValidSender(password, from_id, amount);
//   const is_valid_receiver = await isValidId(to_id);
//   console.log(is_valid_sender);
//   console.log(is_valid_receiver);
// });

app.listen(port);
