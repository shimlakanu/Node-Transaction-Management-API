const supabase = require('./supabaseClient');


async function isValidId(id){
    const {data, error} = await supabase 
    .from('Account')
    .select()
    .eq('id', id);

    if(!error){
        return data;
    }
    else{
        return -1;
    }
}


async function isValidSender(password, sender_id, amount) {

    // console.log(password,sender_id,amount);
    const validSender = await isValidId(sender_id);
    console.log(validSender);

    if (validSender!=null) {
        const actual_password = validSender[0].password;
        const current_balance = validSender[0].balance;

        if (actual_password == password) {
            if (current_balance >= amount) {
                const validSender = isValidId(sender_id);
                //("Successfully done :D");
                return 1;
            }
            else {
                //("Insufficient balance :D ");
                return 2;
            }
        }
        else {
            //("Incorrect password. Please try again :D")
            return 3;
        }
    }
    else {
        //("No such account exist :D");
        return 4;
    }
}


// module.exports = isValidSender;
// module.exports = isValidId;

module.exports = {isValidId,isValidSender};

// exports.isValidId = isValidId;
// exports.isValidSender = isValidSender;



//
--> fetch sender 
--> fetch receiver 
--> isValidSender (sender,password,amount)
--> isValidReceiver(receiver)
--> transaction (sender,receiver,amount)
