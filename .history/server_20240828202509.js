const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');  // Ensure this import aligns with the OpenAI SDK version you are using

const app = express();
const port = 5000;

// Initialize OpenAI with API Key
const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY
});

app.use(bodyParser.json());

app.post('/api/check-grammar', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Check the following text for grammar and spelling errors:\n\n${text}`,
            max_tokens: 1000
        });
        res.json({ correctedText: response.choices[0].text.trim() });
    } catch (error) {
        console.error('Error checking grammar:', error);
        res.status(500).send('Error checking grammar');
    }
});

app.post('/api/suggest-style', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Suggest improvements for the following text in terms of style and tone:\n\n${text}`,
            max_tokens: 1000
        });
        res.json({ suggestions: response.choices[0].text.trim() });
    } catch (error) {
        console.error('Error suggesting style:', error);
        res.status(500).send('Error suggesting style');
    }
});

app.post('/api/auto-complete', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await openai.completions.create({
            model: "text-davinci-003",
            prompt: `Complete the following text:\n\n${text}`,
            max_tokens: 50
        });
        res.json({ completion: response.choices[0].text.trim() });
    } catch (error) {
        console.error('Error with auto-completion:', error);
        res.status(500).send('Error with auto-completion');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
