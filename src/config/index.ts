import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  port: process.env.PORT || 3000,
  fileSizeLimit: (Number(process.env.FILE_SIZE_LIMIT) || 5) * 1024 * 1024, // Default of 5mb;
  geminiKey: process.env.GEMINI_KEY || '',
};
