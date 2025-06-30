const User =require("../models/userMode");
const jwt=require("jsonwebtoken");

const SECRET_KEY="qwertyuiop" // best secure key in the world

// Register User
exports.registerUser=async(req,res)=>{
try{ 
  const {email,password}=req.body;
  if(!email || !password){
          res.status(400).json({error:"All fields are required"});

  }
  const existingUser=await User.findOne({email});
  if(existingUser){
         return res.status(400).json({error:"User already exists"});
  }
  const newUser= new User({email,password});
  await newUser.save();
}
catch(error){
  res.status(400).json({error:"Registration failed",details:error.message});
}

};

// login User

exports.loginUser=async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        res.status(400).json({error:"Invalid credentials"});
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){
        res.status(400).json({error:"Invalid Password"});
    }
    
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "7d" });
    res.json({message:"Login succesful",token});

  }
  catch(error){
  res.status(400).json({error:"login failed",details:error.message});
  }
};

// Get user Details
exports.getUser=async(req,res)=>{
 try{
   const user=await User.findById(req.userId).select("-password");
   if(!user) return res.status(400).json({error:"user not found"});
   res.json(user);
 }
 catch(error){
         res.status(500).json({error:"Failed to fetch User",details:error.message});

 }
};

