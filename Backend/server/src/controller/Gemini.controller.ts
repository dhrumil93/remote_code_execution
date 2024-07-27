import { GoogleGenerativeAI } from '@google/generative-ai';
import { Response, Request } from 'express';
import fs from 'fs';
import path from 'path';

const GEMINI_API_KEY = process.env.GEMINI_API;

if (!GEMINI_API_KEY) throw new Error('Please Provide Value of API Key');

const googleAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
});

const generateTest = async (req: Request, res: Response) => {
  let { code, lang, className } = req.body;

  if (!className) className = '';

  try {
    const prompt = `
        Write all Possible Edge Case Test Cases got given below code ${code}\n in ${lang}`;

    const result = await geminiModel.generateContent(prompt);

    const response = result.response;

    // Save the test cases to a file
    const testFilePath = path.join(__dirname, 'generatedTests.js');
    fs.writeFileSync(testFilePath, response.text());

    console.log(`Test cases saved to ${testFilePath}`);

    // Respond with a success message
    res.json({ message: 'Test cases generated and saved successfully.' });
  } catch (error) {
    console.log('Error generating test cases:', error);
    res.status(500).json({ error: 'Failed to generate test cases.' });
  }
};

const generateCode = async (req: Request, res: Response) => {
  try {
    const { comment, lang } = req.body;

    const prompt = `
        write a code for given below description,\n
        ${comment},in ${lang}
        `;

    const result = await geminiModel.generateContent(prompt);

    const response = result.response;

    // Respond with a success message
    res.json({ message: 'Code Generated Successfully', code: response.text() });
  } catch (error) {
    console.log(error);
  }
};

export { generateTest, generateCode };
