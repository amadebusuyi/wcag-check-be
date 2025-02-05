import { Response } from 'express';
import { analyzeHTML } from '../services/accessibilityService';

export const analyzeAccessibility = async (req: any, res: Response): Promise<Response> => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const htmlContent = req.file.buffer.toString('utf-8');
  // const htmlContent = fs.readFileSync(req.file.path, 'utf-8');
  try {
    const result = await analyzeHTML(htmlContent);
    return res.send(result);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).send({ message: `${err.message}` });
    }
    return res.status(400).send({ message: 'Unable to process request right now' });
  }
};
