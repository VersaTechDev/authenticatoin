//const express = require("express") ;
import express from "express" ;
import cookieParser from "cookie-parser";


import path from "path";
import dotenv from "dotenv" ;
import cors from "cors" ;
import { connectDb } from "./db/connectDb.js";
import authRoutes from "./routes/auth.js"
dotenv.config() ;
const app = express() ;
const PORT = process.env.PORT || 3000 ;

const __dirname = path.resolve() ;
//testing part
// app.get("/" , (req,res)=>{
//     res.send("Hello vikrant")
// })
app.use(cors({ origin: "http://localhost:5173" , credentials: true})) ;
app.use(express.json()) ; //allows us to parse incoming requests : req.body
app.use(cookieParser()) ; // allows as to parse incoming cookies 
app.use("/api/auth" , authRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , "/fronted/dist"))) ;

    app.get("*" , (req , res) => {
        res.sendFile(path.resolve(__dirname , "fronted" , "dist" , "index.html"));
    });
}
app.listen(PORT,() =>{
    connectDb() ;
    console.log("server is running at port number" , PORT)
})