// cloudinary-config.js
// Unified Cloudinary configuration that supports both profiles
// Define both configurations
const cloudinaryConfigs = {
  // Chano's configuration
  chano: {
    cloudName: "dvuxh6hdz",
    apiKey: "655451124663453",
    apiSecret: "GieHcKFOIkmouZStsau6ownuXsQ",
    secure: true,
  },
  
  // Santi's configuration
  santi: {
    cloudName: "dhzpcvjg6",
    apiKey: "627681417512586",
    apiSecret: "rT7PY90ZM7LXO6sCy7TD-5zHZ6o",
    secure: true,
  }
};

// Determine which configuration to use based on environment variable
const configProfile = import.meta.env.VITE_FIREBASE_PROFILE || "santi";

// Export the active configuration
const cloudinaryConfig = cloudinaryConfigs[configProfile] || cloudinaryConfigs.santi;

console.log(`Using Cloudinary configuration for profile: ${configProfile}`);

export default cloudinaryConfig;