import express from "express";
const router = express.Router() ;

router.get("/signup" , (req , res) =>{
    res.send("signup routes")
}) ;
router.get("/login" , (req , res) =>{
    res.send("login route")
}) ;

router.get("/logout" , (req , res) =>{
    res.send("logout route") ;
}) ;
export default router ;