import mongoose from "mongoose";
export const connection =() =>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "JOb_PORTAL"
    }).then(() =>{
        console.log("Database connected successfully");
    }).catch((error) =>{
        console.log(`Error occur while connecting to database ${error}`);
    })
}