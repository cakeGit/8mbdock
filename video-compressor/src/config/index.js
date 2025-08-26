// Development Configuration
const devConfig = {
  ACCESS_TOKEN: "dev-token-123",
  REQUIRES_ACCESS_TOKEN: false,
  MAX_FILE_SIZE_MB: 8,
  MAX_UPLOAD_SIZE_MB: 500,
  DEBUG_MODE: true
};

// Production Configuration
const prodConfig = {
  ACCESS_TOKEN: process.env.REACT_APP_ACCESS_TOKEN || "your-secure-production-token",
  REQUIRES_ACCESS_TOKEN: process.env.REACT_APP_REQUIRES_AUTH === 'true',
  MAX_FILE_SIZE_MB: 8,
  MAX_UPLOAD_SIZE_MB: 200,
  DEBUG_MODE: false
};

// Export based on environment
const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default {
  ...config,
  SUPPORTED_FORMATS: ["mp4", "avi", "mov", "mkv", "webm", "flv", "wmv"],
  COMPRESSION_QUALITY: {
    HIGH: 28,
    MEDIUM: 32,
    LOW: 36
  },
  APP_NAME: "Video Compressor",
  VERSION: "1.0.0"
};
