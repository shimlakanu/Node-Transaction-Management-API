require('dotenv').config();
const express = require('express');
const supabase = require('./supabaseClient');
const uuid = require("uuid");
const app = express();
app.use(express.json());
const port = 3000;


let cur_id = 1;



app.post('/account', async(req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    let account_id = uuid.v4(); 

    const {data, error} = await supabase
        .from ('Account')
        .insert({
            'account_id' : account_id,
            'id' : cur_id++,
            'created_at' : new Date().toJSON(),
            'password' :  password,
            'name' : name,
            "balance" : 0,
            'reward_point' : 0
        });

    if(!error) 
    {
        res.send("successfully done :D ")
    }
    else 
    {
        res.send(" please recheck ")
    }
    
})


app.get('/Account/:id', async (req,res) => {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase
        .from('Account')
        .select()
        .eq('id', id);

    if (!error) 
    {
        const response = {
            "name " : data[0].name,
            "id" : data[0].id,
            "created_at" : data[0].created_at,
            "reward_point" : data[0].reward_point,
            "balance" : data[0].balance
        }
        res.json(response);
    }
    else 
    {
        res.send("no such id exists");
    }
})


app.get('/Account/:id/balance', async (req,res) => {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase
        .from('Account')
        .select()
        .eq('id', id);

    if (!error) 
    {
        const response = {
            "balance" : data[0].balance
        }
        res.json(response);
    }
    else 
    {
        res.send("no such id exists");
    }
})

app.get('/Account/:id/reward_point', async (req,res) => {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase
        .from('Account')
        .select()
        .eq('id', id);

    if (!error) 
    {
        const response = {
            "reward_point" : data[0].reward_point
        }
        res.json(response);
    }
    else 
    {
        res.send("no such id exists");
    }
})

app.listen(port);
