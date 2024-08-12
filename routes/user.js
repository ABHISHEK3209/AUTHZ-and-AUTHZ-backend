
const express=require("express");
const router=express.Router();

const {login,signup}=require("../controllers/Auth");
const {auth, isStudent,isAdmin}=require("../middlewares/auth");


 router.post("/login",login);
router.post("/signup",signup);

///Protected Routes

router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:"WElcome to protected routes for TESTS"
    });
});





//yaha check karenge ki student wala hi h na
//yisiliyea hamne token diya tha
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:"WElcome to protected routes for student"
    });
});
 
router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:"WElcome to protected routes for Admin"
    });
});



module.exports=router;