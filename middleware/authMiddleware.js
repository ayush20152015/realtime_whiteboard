const jwt=require("jsonwebtoken");

const SECRET_KEY="qwerty";

exports.authMiddleware=(req,res,next)=>{
        const token=req.header("Authorization");

        if(!token) return res.status(401).json({error:"Acess Denied: No token"});

        try{
          const decoded=jwt.verify(token.replace("Bearer ",""),SECRET_KEY);
          req.userId=decoded.userId;
          next();
        }
        catch(error){
           res.status(401).json({error:"Invalid Token"});
        }
};
