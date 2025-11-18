import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { postJob, getAllJobs, getASingleJob, getMyJobs, deleteJob } from "../controllers/jobController.js";

const router = express.Router();

router.post("/post", isAuthenticated, isAuthorized("Employer"), postJob); // post a job
router.get("/getall", getAllJobs); // get all jobs with filters
router.get("/getmyjobs", isAuthenticated, isAuthorized("Employer"), getMyJobs); // get jobs posted by logged in employer
router.delete("/delete/:id", isAuthenticated, isAuthorized("Employer"), deleteJob); // delete a job
router.get("/get/:id", getASingleJob) // for specific job details
export default router; 