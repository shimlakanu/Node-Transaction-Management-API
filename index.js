require("dotenv").config();
const express = require("express");
const supabase = require("./supabaseClient");
const { isValidId } = require("./transaction");
const { isValidSender } = require("./transaction");
const uuid = require("uuid");
const app = express();
app.use(express.json());
const port = 3000;

let cur_id = 1;
// TODO: this file should be simpler.
// Remove all the account and transaction related codes.

app.post("/account", async (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  let account_id = uuid.v4();
  // TODO: use createAccount from /database/account
  const { data, error } = await supabase.from("Account").insert({
    account_id: account_id,
    id: cur_id++,
    created_at: new Date().toJSON(),
    password: password,
    name: name,
    balance: 0,
    reward_point: 0,
  });

  if (!error) {
    res.send("successfully done :D ");
  } else {
    res.send(" please recheck ");
  }
});

// TODO: use /account/:id (small A)
app.get("/Account/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  // TODO use from /account/fetchAccountById
  const { data, error } = await supabase.from("Account").select().eq("id", id);

  if (!error) {
    // TODO: response an error or the object
    const response = {
      "name ": data[0].name,
      id: data[0].id,
      created_at: data[0].created_at,
      reward_point: data[0].reward_point,
      balance: data[0].balance,
    };
    res.json(response);
  } else {
    res.send("no such id exists");
  }
});

// TODO: use /account/:id/balance - small a
app.get("/Account/:id/balance", async (req, res) => {
  const id = parseInt(req.params.id);
  // TODO:  fetch from /database/account/fetchAccountById
  const { data, error } = await supabase.from("Account").select().eq("id", id);

  if (!error) {
    const response = {
      balance: data[0].balance,
    };
    res.json(response);
  } else {
    res.send("no such id exists");
  }
});

app.get("/Account/:id/reward_point", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase.from("Account").select().eq("id", id);

  if (!error) {
    const response = {
      reward_point: data[0].reward_point,
    };
    res.json(response);
  } else {
    res.send("no such id exists");
  }
});

app.put("/cash_in", async (req, res) => {
  const amount = req.body.amount;
  const id = req.body.id;
  const password = req.body.password;
  const { data, error } = await supabase.from("Account").select().eq("id", id);

  if (!error) {
    const actual_password = data[0].password;
    const current_balance = data[0].balance;

    if (actual_password == password) {
      const { data, error } = await supabase
        .from("Account")
        .update({ balance: current_balance + amount })
        .eq("id", id);
      res.send("Successfully done :D");
    } else {
      res.send("Incorrect password. Please try again :D");
    }
  } else {
    res.send("No such account exist :D");
  }
});

app.put("/cash_out", async (req, res) => {
  const amount = req.body.amount;
  const id = req.body.id;
  const password = req.body.password;
  const { data, error } = await supabase.from("Account").select().eq("id", id);

  if (!error) {
    const actual_password = data[0].password;
    const current_balance = data[0].balance;

    if (actual_password == password) {
      if (current_balance >= amount) {
        const { data, error } = await supabase
          .from("Account")
          .update({ balance: current_balance - amount })
          .eq("id", id);
        res.send("Successfully done :D");
      } else {
        res.send("Insufficient balance :D ");
      }
    } else {
      res.send("Incorrect password. Please try again :D");
    }
  } else {
    res.send("No such account exist :D");
  }
});

app.post("/transaction", async (req, res) => {
  const from_id = req.body.from_id;
  const to_id = req.body.to_id;
  const amount = req.body.amount;
  const type = req.body.type;
  const password = req.body.password;

  const is_valid_sender = await isValidSender(password, from_id, amount);
  const is_valid_receiver = await isValidId(to_id);
  console.log(is_valid_sender);
  console.log(is_valid_receiver);
});

app.listen(port);
