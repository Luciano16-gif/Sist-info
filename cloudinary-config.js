// cloudinary-config.js
// Unified Cloudinary configuration that supports both profiles using environment variables
// Define both configurations
const cloudinaryConfigs = {
  // Chano's configuration
  chano: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CHANO_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_CHANO_API_KEY,
    apiSecret: import.meta.env.VITE_CLOUDINARY_CHANO_API_SECRET,
    secure: true,
  },
  
  // Santi's configuration
  santi: {
    cloudName: import.meta.env.VITE_CLOUDINARY_SANTI_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_SANTI_API_KEY,
    apiSecret: import.meta.env.VITE_CLOUDINARY_SANTI_API_SECRET,
    secure: true,
  }
};

// Determine which configuration to use based on environment variable
const configProfile = import.meta.env.VITE_FIREBASE_PROFILE || "santi";

// Export the active configuration
const cloudinaryConfig = cloudinaryConfigs[configProfile] || cloudinaryConfigs.santi;

console.log(`Using Cloudinary configuration for profile: ${configProfile}`);

export default cloudinaryConfig;