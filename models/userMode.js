const mongoose =require("mongoose");
const bcrypt=require("bcrypt");

const UserSchema= new mongoose.Schema({
        email:{
          type:String,required:true,unique:true
        },
        password:{
          type:String,require:true
        },
});

// hashing process of password using salts 
UserSchema.pre("save",async function(next){
  
 if(!this.isModified("password")) return next();

 try{
   const salt=await bcrypt.genSalt(10);
   this.password=await bcrypt.hash(this.password,salt);
   next();
 }
 catch(error){
   next(error);
 }


});

UserSchema.methods.comparePassword= async function(enteredPassword){
        return bcrypt.compare(enteredPassword,this.password);

};

module.exports=mongoose.Schema("User",UserSchema);


