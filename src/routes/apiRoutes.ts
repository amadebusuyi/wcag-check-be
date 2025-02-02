// src/routes/apiRoutes.ts
// eslint-disable-next-line import/no-extraneous-dependencies
import multer from 'multer';
import { Router } from 'express';
import { analyzeAccessibility } from '../controllers/accessibilityController';
import { upload } from '../middlewares/fileUploadMiddleware';

const router = Router();

// Endpoint to handle HTML file uploads for accessibility analysis.
router.post('/upload', (req, res, next) => {
  upload.single('file')(req, res, (err: any) => {
    if (err) {
    // Handle Multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
        }
        return res.status(400).json({ error: err.message });
      } else {
      // Unknown error occurred during file upload
        return next(err);
      }
    }
    // Proceed to additional validation if needed
    next();
  });
}, analyzeAccessibility);

export default router;
