const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const checkUser= async(req, res, next)=>{
    try{
   let token;
         // 1. For web → read from cookies
  if (req.cookies &&  req.cookies.JWTkraftToken) {
    token = req.cookies.JWTkraftToken;
  }
  // 2. For mobile → read from Authorization header
  else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }else{
     return res.status(401).json({
            success:false,
            message:"token is not available!!!"
        })
  }

    const decoded = jwt.verify(token, process.env.JWT_SECURITY);
    const user = await User.findById(decoded);
       // user is not available with this token
      if(!user){
         return res.status(400).json({
          successfull: false,
          message:"user is not available!"
         })
      }
    req.user = user; // attach user to request
    next();
    }catch(err){
        console.error(err);
         return res.status(500).json({ 
        success: "false",
        message: "something went wrong" });
         }
};

const checkAdminOrModerator = async(req, res, next)=>{
        if(req?.user?.role!='Admin' && req?.user?.role !="Moderator" ){
            return res.status(400).json({
                successfull:false,
                message:"User is neither Admin nor Moderator"
            })
        }
       next();
}

const checkModerator = async(req, res, next)=>{
        if(req?.user?.role!='Moderator'){
            return res.status(400).json({
                successfull:false,
                message:"User is not Moderator"
            })
        }
       next();
}
const checkAdmin = async(req, res, next)=>{
        if(req?.user?.role!='Admin'){
            return res.status(400).json({
                successfull:false,
                message:"User is not Admin"
            })
        }
       next();
}

module.exports = {checkUser,checkAdminOrModerator,checkModerator,checkAdmin};