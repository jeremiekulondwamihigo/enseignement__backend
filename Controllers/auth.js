const ErrorResponse = require("../utils/errorResponse");
const Model_User = require("../Models/Users")


module.exports = {
login : async (req, res, next) =>{
  
  const { username, password } = req.body;

  if(!username || !password){
    return next(new ErrorResponse("Veuillez renseigner les champs", 200));
  }

  try {

    //const user = await Model_User.aggregate([ look])
    
    const user = await Model_User.findOne({username}).select("+password");
    
    if(!user){
       return next(new ErrorResponse("username incorrect", 200));
    }

    const isMatch = await user.matchPasswords(password);
   
    if(!isMatch){
       return next(new ErrorResponse("password incorrect", 200));
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ success : false, error: error.message
    })
  }
},


resetPassword : (req, res, next)=>{
  res.send("Reset password");
},

sendToken : (user, statusCode, res)=>{
  
  const token = user.getSignedToken();
  res.status(statusCode).json({sucess : true, token })
}
}