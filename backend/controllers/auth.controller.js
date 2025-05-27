
import crypto from "crypto" ;
import bcryptjs from "bcryptjs" ;

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendverificationEmail , sendWelcomeEmail , sendPasswordResetEmail ,sendResetSuccessEmail } from "../mailtrap/emails.js";
export const signup = async(req , res) => {
//    res.send("singup route")
   const {email , password , name } = req.body ;
   try{
    if(!email || !password || !name){
        throw new Error("All fields are required ") ;
    }

    const userAlreadyExists = await User.findOne({email}) ;
    // console.log("userAlreadyExists" , userAlreadyExists) ;
    if(userAlreadyExists){
        return res.status(400).json({success : false , message : "user already exists"}) ;
    }

    const hashedPassword = await bcryptjs.hash(password , 10) ;
    const verificationToken = Math.floor(1000 + Math.random() * 900000).toString()  ;
    const user = new User({
        email , 
        password : hashedPassword ,
        name ,
        verificationToken,
        verificationTokenExpireAt : Date.now() + 24 * 60 *60 *1000 // 24 hr
    })
    await user.save() ;
    // jwt
    generateTokenAndSetCookie(res ,user._id) ;

 await sendverificationEmail(user.email , verificationToken) ;

    res.status(201).json({
        success : true ,
        message : "User Created Successfully" ,
        user : {
            ...user._doc ,
            password : undefined 
        
        } ,
    })
   }
   
   catch(error){
    res.status(400).json({success : false , message : error.message}) ;
   }

} ;

export const verifyEmail = async(req , res) => {
    const {code} =  req.body ;

    try{
        const user = await User.findOne( {
            verificationToken : code ,
            verificationTokenExpireAt : {$gt: Date.now()}
        }) ;

        if(!user){
            return res.status(400).json({success: false , message : "Invalid or expires verification code"})
        }
        user.isVerified = true ;
        user.verificationToken = undefined ;
        user.verificationTokenExpireAt = undefined ;
        await user.save() ;

        await sendWelcomeEmail(user.email , user.name) ;

        res.status(200).json({
            success : true,
            message:"Email verified successfully",
            user:{
                ...user._doc ,// Copies all data fields from user._doc
                password: undefined,
            }
        })
    }catch(error){
        console.log("error in verify Email " , error) ;
        res.status(500).json({success:false , message : "server error"}) ;
    }
};

export const login = async(req , res) => {
   // res.send("login route")
   //in this function update last login date and verfiy users is correct or not 
   const { email , password } = req.body ;

   try{
        const user = await User.findOne({email}) ;
        if(!user){
            return res.status(400).json({ success: false , message: "Invalid credentails"}) ;
        }
        const isPasswordValid = await bcryptjs.compare(password , user.password) ;
        if(!isPasswordValid){
            return res.status(400).json({success: false , message: "Invalid credentials"}) ;

        }

        generateTokenAndSetCookie(res , user._id) ;

        user.lastLogin = new Date() ;
        await user.save() ;

        res.status(200).json({
            success: true ,
            message: "login successfully" ,

            user:{
                ...User._doc ,
                password : undefined
            },
        });
   } catch(error){

    console.log("Error in login " , error) ;
    res.status(400).json({success: false , message: error.message}) ;

   }

} ;


export const logout = async(req , res) => {
    //res.send("logout route")
    res.clearCookie("token") ;
    res.status(200).json({success : true , message : "you are logged out successfully"}) 

} ;

export const forgetPassword = async(req,res) =>{
    const {email} = req.body ;
    try {
        const user = await User.findOne({ email }) ;
        if(!user){
            return res.status(400).json({success: false , message : "User not found"}) ;

        }

        // genrate reset token
        const resetToken = crypto.randomBytes(20).toString("hex") ;
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000 ; // 1 hour

        user.resetPasswordToken = resetToken ;
        user.resetPasswordExpireAt = resetTokenExpiresAt;

        await user.save() ;

        // send email
        await sendPasswordResetEmail(user.email , `${process.env.CLIENT_URL}/reset-password/${resetToken}`) ;
        res.status(200).json({success: true , message : "password reset link sent to your email"}) ;
    } catch (error){
        console.log("Error in forgotpassword" , error) ;
        res.status(400).json({success: false , message: error.message}) ;
    }
} ;


export const resetPassword = async (req,res) =>{
    try {
        const {token} = req.params ;
        const {password} = req.body ;

        const user = await User.findOne({
            resetPasswordToken: token ,
            resetPasswordExpireAt: {$gt: Date.now() } ,
        }) ;

        if(!user) {
            return res.status(400).json({success: false , message: "Invalid or expired reset token"}) ;
        }

        // update pssword
        const hashedPassword= await bcrypt.hash(password , 10) ;
        user.password = hashedPassword ;
        user.resetPasswordToken = undefined ;
        user.resetPasswordExpireAt = undefined ;
        await sendResetSuccessEmail(user.email) ;

        res.status(200).json({success: true , message: "password reset successfully"}) ;
    }
    catch(error){
          console.log("Error in resetpassword" , error) ;
          res.status(400).json({success: false , message: error.message}) ;
    }
}


export const checkAuth = async(req,res) =>{
    try{

        const user = await User.findById(req.user.Id).select("-password") // that means not select the password(-password)
        if(!user) {
            return res.status(400).json({success:false , message: "User not found"}) ;
        }

        res.status(200).json({success: true , user}) ;

    } catch(error){
        console.log("Error in check auth" , error) ;
        res.status(400).json({success: false , message: error.message}) ;
    }
} ;
