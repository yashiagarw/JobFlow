import express from 'express';
import {config} from "dotenv";
import cros from 'cors';
import cookieParser from 'cookie-parser';
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
app.use("/api/v1/users",userRouter);//user routes
app.use("/api/v1/job",jobRouter);  //job routes
app.use("/api/v1/application", applicationRouter); //application routes
newsLetterCron();
connection(); //database connection
app.use(errorMiddleware);
export default app;
