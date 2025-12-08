import express from 'express';
import {config} from "dotenv";
import cros from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import {connection} from "./database/connection.js";
import {errorMiddleware}  from './middlewares/error.js';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import jobRouter from './routes/jobRouter.js';
import applicationRouter from "./routes/applicationRouter.js";
import {newsLetterCron} from './automation/newsLetterCron.js';

const app = express();
config({path:"./config/config.env"})

app.use(cros({
    origin:[process.env.FRONTEND_URL], //url of frontend
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,
})); //app.use means we r using cros as a middleware 

app.use(cookieParser()); //for accessing token from cookies
app.use(express.json()); //to accept json data
app.use(express.urlencoded({extended:true})); //to accept form data
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp/",
})); //file upload

// Home route - shows server status
app.get("/", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    res.status(200).json({
        success: true,
        message: "Server is running successfully! 🚀",
        status: "connected",
        database: dbStatus,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.use("/api/v1/users",userRouter);//user routes
app.use("/api/v1/job",jobRouter);  //job routes
app.use("/api/v1/application", applicationRouter); //application routes

// Initialize database connection
connection(); //database connection

// Only run cron jobs in non-serverless environments
// Cron jobs don't work in serverless functions (they need a persistent process)
// For serverless, use Vercel Cron Jobs or external cron service instead
if (process.env.VERCEL !== '1') {
  newsLetterCron();
}

app.use(errorMiddleware);
export default app;
