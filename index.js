require("dotenv").config();
const express = require("express");
const { fetchAccountById, createAccount } = require("./database/account");
const {
  makeSavingsAccount,
  makeSavingsTransaction,
} = require("./database/savings");
const { makeTransaction, adminTransaction } = require("./database/transaction");
const app = express();
app.use(express.json());
const port = 3000;

// creating new account :
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
    res.json(data);
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

//transaction management :
app.post("/transaction", async (req, res) => {
  const {
    amount,
    sender_id: senderId,
    receiver_id: receiverId,
    password,
  } = req.body;
  try {
    await makeTransaction({
      amount,
      receiverId,
      senderId,
      senderPassword: password,
    });
    res.send("transaction successful :D");
  } catch (error) {
    res.json({ message: error.message });
  }
});

//transaction by admin:
app.post("/admin/transafer-balance", async (req, res) => {
  const {
    amount,
    sender_id: adminId,
    password: adminPassword,
    receiver_id: receiverId,
  } = req.body;
  try {
    await adminTransaction({ amount, adminId, adminPassword, receiverId });
    res.send("transaction successful :D");
  } catch (error) {
    res.json({ message: error.message });
  }
});

// creating a new savings account :
app.post("/savings-account", async (req, res) => {
  const { account_id, account_password, savings_password } = req.body;
  // console.log(account_id,account_password,savings_password);
  try {
    const params = {
      account_id,
      account_password,
      savings_password,
    };
    const { status, savings_accountInfo } = await makeSavingsAccount(params);
    if (status == 201) {
      res.json(savings_accountInfo);
      return;
    }
    res.send("failed :(");
  } catch (error) {
    res.json({ message: error.message });
  }
});

//savings accout transactions :
app.post("/savings-transaction", async (req, res) => {
  const { amount, account_id, password } = req.body;
  try {
    await makeSavingsTransaction({ amount, account_id, password });
    res.send("transaction successfull :D");
  } catch (error) {
    res.json({ message: error.message });
  }
});

app.listen(port);
