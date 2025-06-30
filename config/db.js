const mongoose=require('mongoose');
require("dotenv").config;

const connectDB=async()=>{
  try{
    await mongoose.connect("mongodb+srv://ayushchoudharycdeee22:<db_password>@cluster1.sxtimky.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
    ,{
        useNewUrlPareser:true,
        useUnfiedTopology:true,
    });    
  }
  catch(error){
   console.error("MongoDB connection failed: ",error.message);
   proccess.exit(1);
  }
};

module.exports=connectDB;
