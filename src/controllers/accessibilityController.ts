// src/controllers/accessibilityController.ts
import { Response } from 'express';
import { analyzeHTML } from '../services/accessibilityService';

/**
 * Controller to handle the uploaded HTML file and return accessibility analysis.
 */
export const analyzeAccessibility = async (req: any, res: Response): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const htmlContent = req.file.buffer.toString('utf-8');
  const result = await analyzeHTML(htmlContent);
  return res.json(result);
};
