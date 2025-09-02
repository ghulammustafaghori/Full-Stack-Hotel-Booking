const User = require('../models/User.js');
const {Webhook} = require('svix');


const clerkWebhooks= async (req,res)=>{
    try {
        const whook= new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Getting Headers
        const headers = {
            'svix-id': req.headers['svix-id'],
            'svix-timestamp': req.headers['svix-timestamp'],
            'svix-signature': req.headers['svix-signature'],
        };

        //Verifying Headers
        await whook.verify(JSON.stringify(req.body), headers);

        //Getting Data from request body
        const {data, type} =req.body;
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.profile_url
        }
        //switch cases for different events
        switch (type) {
            case "user.created" : {
                await User.create(userData);
                break;
            }
             case "user.deleted" : {
                await User.findByIdAndUpdate(data.id);
                break;
            }
            default:
             
           break;
        }
         res.json({success: true, message: "Webhook Recieved"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

module.exports=clerkWebhooks;