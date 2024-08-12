
const bcrypt=require("bcrypt");
const User=require('../models/User');
const jwt=require("jsonwebtoken");
require("dotenv").config();
//signup code:signup route handler

exports.signup = async(req,res)=>{
    try{
        //get data from req body
        const {email,name,password,role}=req.body;
        //check if user already exist or not
        //need to interect wuth db
        //findOne ka use karega if I got a same email
        const existingUser=await User.findOne({email});
        //check karenge ki email ame h ya nhi agar same h to user already exist
        if(existingUser){
            res.status(400).json({
                success:false,
                message:`User already exist`,
            });
         }
         //secure password
  let hashedPassword;
  try{
    hashedPassword=await bcrypt.hash(password,10); 
  }
  catch(err){
    return res.status(500).json({
          success:false,
       message:`Error in hashing mapping`,
    });
  }
  //create entry for user
  const user=await User.create({
    name,email,password:hashedPassword,role
  })

  return res.status(200).json({
    success:true,
 message:`Usr created successfully`,
 data:user
});
 }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
         message:"USer cannot be registered",
      });


    }
}


//login

exports.login = async(req,res) => {
  try{
    //data fetch
    const {email,password}=req.body;
    //step2:check dono data email and pass. fill kiye h ki nhi ui ms
    if(!email || !password)
    {
     return res.status(400).json({
        success:false,
        message:"Fill the data carefully",
    });
    }

    //step 3:check for registered user
    //const mat karna
    let user=await User.findOne({email});
    //if not registerd email the?
    if(!user){
      return res.status(401).json({
        success:false,
        message:"User  is not registered",
    });
    }
// jwt token m 3 part hota h HAeder,playload,,verify sign
//playload m data hota ha
//verify signature m secret key
const payload={
  email : user.email,
  id : user._id,
  role : user.role,
}


 //step3:verify password and generate jwt token
  if(await bcrypt.compare(password,user.password)){
    //password match ho gaya
    let token = jwt.sign(payload,process.env.JWT_SECRET,{
      expiresIn:"2h",
    });

    user = user.toObject();
    console.log(user);
    user.token=token;
    user.password=undefined;//user ko password nhi bhejna ha
    console.log(user);
    //creating cookies
    const options = {
      expires:new Date(Date.now()+3*24*60*60*1000),
      httpOnly:true,
    }

    res.cookie("abhishekkicookies",token,options).status(200).json({
      success:true,
      token,
      user,
      message:"User Logged in Succeffuly",
    });
  }
  else{
    //password nahi match huhha
   return res.status(403).json({
      success:false,
      message:`Password not matched`,
  });
    
  }

  }
  catch(error){
    console.log(error);
   return res.status(500).json({
      success:false,
      message:`login Failure`,
  });
   


  }
}
