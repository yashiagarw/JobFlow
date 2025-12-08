import mongoose from "mongoose";

export const connection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        // MongoDB Atlas connection options
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    })
    .then(() => {
        console.log("Database connected successfully to MongoDB Atlas");
    })
    .catch((error) => {
        console.log(`Error occurred while connecting to database: ${error.message}`);
        // Exit process if connection fails
        process.exit(1);
    });
}