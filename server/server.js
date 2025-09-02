const express= require('express');
const mongoose= require('mongoose');
const cors= require('cors');
const dotenv= require('dotenv');

const app=express();
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

app.get('/', (req,res)=>{
    res.send('API is working fine')
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });