import express from 'express';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';

const app = express();
const port = 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(bodyParser.json());

const createCompletion = async (model, prompt, maxTokens) => {
  const response = await openai.completions.create({
    model,
    prompt,
    max_tokens: maxTokens
  });
  return response.choices[0].text.trim();
};

app.post('/api/check-grammar', async (req, res) => {
  const { text } = req.body;
  try {
    const correctedText = await createCompletion(
      "text-davinci-003",
      `Check the following text for grammar and spelling errors:\n\n${text}`,
      1000
    );
    res.json({ correctedText });
  } catch (error) {
    res.status(500).send('Error checking grammar');
  }
});

app.post('/api/suggest-style', async (req, res) => {
  const { text } = req.body;
  try {
    const suggestions = await createCompletion(
      "text-davinci-003",
      `Suggest improvements for the following text in terms of style and tone:\n\n${text}`,
      1000
    );
    res.json({ suggestions });
  } catch (error) {
    res.status(500).send('Error suggesting style');
  }
});

app.post('/api/auto-complete', async (req, res) => {
  const { text } = req.body;
  try {
    const completion = await createCompletion(
      "text-davinci-003",
      `Complete the following text:\n\n${text}`,
      50
    );
    res.json({ completion });
  } catch (error) {
    res.status(500).send('Error with auto-completion');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
