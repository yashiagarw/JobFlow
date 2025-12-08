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

// Load environment variables
// In Vercel, environment variables are already set, so we only load from file in local development
// Try to load from config file, but don't fail if it doesn't exist (production)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    try {
        config({path:"./config/config.env"});
    } catch (error) {
        console.log("Config file not found, using environment variables from Vercel");
    }
}

// CORS configuration
// When frontend and backend are on the same domain, CORS doesn't apply (same-origin)
// But we need it for development (different ports) and cross-origin scenarios
app.use(cros({
    origin: function (origin, callback) {
        // Allow requests with no origin (same-origin requests when on same domain)
        // This is crucial when frontend and backend are deployed together
        if (!origin) {
            return callback(null, true);
        }
        
        const allowedOrigins = process.env.FRONTEND_URL ? 
            process.env.FRONTEND_URL.split(',').map(url => url.trim()) : 
            ['http://localhost:5173', 'https://job-flow.vercel.app'];
        
        // Allow if in allowed list, or if it's a same-origin request
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // For same-domain deployments, allow the request
            callback(null, true);
        }
    },
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
// Only connect if MONGO_URI is available
if (process.env.MONGO_URI) {
    connection().catch(err => {
        console.error("Database connection error:", err.message);
    });
} else {
    console.error("MONGO_URI environment variable is not set!");
}

// Only run cron jobs in non-serverless environments
// Cron jobs don't work in serverless functions (they need a persistent process)
// For serverless, use Vercel Cron Jobs or external cron service instead
if (process.env.VERCEL !== '1') {
  newsLetterCron();
}

app.use(errorMiddleware);
export default app;
