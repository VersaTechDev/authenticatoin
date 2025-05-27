import { mailtrapClient , sender } from "./mailtrap.config.js"
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplets.js";
import { response } from "express";
export const sendverificationEmail = async(email , verificationToken) => {
    const recipient = [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender , 
            to: recipient , 
            subject: "verify email address" ,
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category:"email verification",
        });

        console.log("Email sent successfully" , response) ;
    }
    catch(error){
        console.log(`Error sending verification`, error) ;
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendWelcomeEmail = async (email , name) => {
    const recipient = [{ email }]

    try {
        await mailtrapClient.send({
            from: sender ,
            to: recipient ,
            template_uuid: "f8e3187b-3ddb-439d-a3e0-9d0cbadcf485",
            template_variables: {
                "company_info_name": "DNA SKEW VISULIZATIONS",
                "name": name
              },
        }) ;
        console.log("WElcome email send successfully" , response) ;
    } catch (error){
        console.log(`Error sending welcome email` , error) ;
        throw new error(`Error sending welcome email : ${error}`) ;
    }
} ;

export const sendPasswordResetEmail = async (email , resetURL) =>{
    const recipient = [{email}] ;

    try {
        const response = await mailtrapClient.send({
            from: sender ,
            to: recipient ,
            subject: "Reset your password" ,
            html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}" , resetURL) ,
            category: "password Reset" ,
        })
    } catch(error){
        console.log(`Error sending password reset email`,error) ;

        throw new Error(`Error sending password reset email : ${error}`) ;
    }
} ;

export const sendResetSuccessEmail = async(email) =>{
    const recipient = [{email}] ;

    try {
        const response = await mailtrapClient.send({
            form: sender ,
            to: recipient , 
            subject : "Password Reset Successful" ,
            html : PASSWORD_RESET_SUCCESS_TEMPLATE ,
            category : "Password reset" 
        })
    }
    catch (error){
            console.log("Erorr in reseting the passwords " , error) ;
            res.status(400).json({success : false , message : error.message})
    }
} ;

