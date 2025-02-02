// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';
import config from '../config';

// Use memory storage so that file content is available in req.file.buffer
const storage = multer.memoryStorage();

/**
 * File filter to allow only HTML files.
 */
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype === 'text/html') {
    if (file.size > config.fileSizeLimit) {
      cb(new Error('File too f large'));
    }
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only HTML files are allowed.'));
  }
};

// Set up the Multer middleware with file size limit (get the default)
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.fileSizeLimit,
  },
});
