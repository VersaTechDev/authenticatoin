//const express = require("express") ;
 import express from "express" ;
import { connectDb } from "./db/connectDb.js";
import dotenv from "dotenv" ;

import authRoutes from "./routes/auth.js"
dotenv.config() ;
const app = express() ;

app.get("/" , (req,res)=>{
    res.send("Hello vikrant")
})
app.use("/api/auth" , authRoutes)
app.listen(3000,() =>{
    connectDb() ;
    console.log("server is running")
})