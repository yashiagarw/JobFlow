import cron from "node-cron"; // for scheduling tasks
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

// why we r not using setInterval here? 1. cron can be written in seperare file (neat nd clean code)
//2.felxible (easy) 3. if any chance server down then crons will still work 

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => { // first * = minutes /1 = every 1 minute, second * = hours, third * = day, fourth * = month, fifth * =week days 
    console.log("Running Cron Automation");
    const jobs = await Job.find({ newsLettersSent: false });
    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });
        for (const user of filteredUsers) {
          const subject = `Exciting Opening: ${job.title} in ${job.jobNiche} Just Posted!`;
          const message = `Hi ${user.name},\n\nExciting news! A new job perfectly aligned with your niche just went live. ${job.companyName} is now hiring for the **${job.title}** role, and this could be a great match for you.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nHot roles like this don't stay open for long—make sure to check it out and apply while it's fresh!
          \n\nWishing you all the best in your job search!\n\nBest Regards,\nNicheNest Team`;
          sendEmail({
            email: user.email,
            subject,
            message,
          });
        }
        job.newsLettersSent = true;
        await job.save();
      } catch (error) {
        console.log("ERROR IN NODE CRON CATCH BLOCK");
        return next(console.error(error || "Some error in Cron."));
      }
    }
  });
};