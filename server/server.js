const express= require('express');
const mongoose= require('mongoose');
const cors= require('cors');
const dotenv= require('dotenv');
const connectDB= require('./configs/db.js');

const {clerkMiddleware} = require('@clerk/express');
const { clerkWebhooks } = require('./controllers/clerkWebhooks.js');

dotenv.config();

connectDB();

const app=express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

//Middleware
app.use(express.json());
app.use(clerkMiddleware())

//API to listen to Clerk Webhooks
// app.use('/api/clerk', clerkWebhooks);

app.get('/', (req,res)=>{
    res.send('API is working fine')
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });