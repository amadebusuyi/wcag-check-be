// eslint-disable-next-line import/no-extraneous-dependencies
import  { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config';

const geminiQuery = async (prompt: string) => {
  // Access your API key as an environment variable (see "Set up your API key" above)
  const genAI = new GoogleGenerativeAI(config.geminiKey);
  // ...
  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const { response } = result;
  const text = response.text();
  return text;
};

export default {
  geminiQuery,
};
