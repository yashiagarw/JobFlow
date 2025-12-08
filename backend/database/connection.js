import mongoose from "mongoose";

// Cache the connection to reuse in serverless environments
let cachedConnection = null;

export const connection = async () => {
    // In serverless, reuse existing connection if available
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log("Using existing database connection");
        return cachedConnection;
    }

    // If already connecting, wait for that connection
    if (mongoose.connection.readyState === 2) {
        await new Promise((resolve) => {
            mongoose.connection.once('connected', resolve);
        });
        cachedConnection = mongoose.connection;
        return cachedConnection;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // MongoDB Atlas connection options optimized for serverless
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            // Serverless-friendly options
            maxPoolSize: 1, // Limit connections in serverless
        });
        
        cachedConnection = conn;
        console.log("Database connected successfully to MongoDB Atlas");
        return conn;
    } catch (error) {
        console.error(`Error occurred while connecting to database: ${error.message}`);
        // In serverless, don't exit process - let the function handle the error
        // In traditional server, you might want to exit
        if (process.env.VERCEL !== '1') {
            process.exit(1);
        }
        throw error; // Re-throw so calling code can handle it
    }
}