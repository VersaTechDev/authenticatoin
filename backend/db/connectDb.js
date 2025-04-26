import mongoose from "mongoose";

export const connectDb = async() =>{
    try{
        console.log("mongo uri : " , process.env.MONGO_URI)
       const conn = await mongoose.connect(process.env.MONGO_URI)
       console.log(`Mongodb is connected : ${conn.connection.host}`)
    }
    catch(error) {
        console.log("Error in connection to connect mongodb : ",error.message)
        process.exit(1) // not connected 1is failuer 0 is success
    }
}