import app from './app.js';
import cloudinary from 'cloudinary';

// Configure Cloudinary only if credentials are available
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log("Cloudinary configured successfully");
} else {
    console.warn("Cloudinary credentials not found. File uploads may not work.");
}

// For Vercel serverless: export the app as a handler
// Vercel will automatically detect and use this export
export default app;

// For local development: start the server
// This only runs when NOT in a serverless environment
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}                          