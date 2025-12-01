const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, tone } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log(`📨 Received request: ${text.substring(0, 20)}... | Tone: ${tone}`);

    // FIX: Using 'gemini-2.0-flash' because your diagnostic tool confirmed 
    // this is the model your API Key has access to.
    const modelName = 'gemini-2.0-flash'; 
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `
      You are an expert Corporate Communication Specialist.
      Rewrite the following text to be "${tone}".
      Rules:
      1. Fix grammar and punctuation.
      2. Keep the core meaning but change the style.
      3. Output ONLY the rewritten text.
      Original Text: "${text}"
    `;

    // Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rewrittenText = response.text();
    
    console.log(`✅ Generated successfully with ${modelName}`);
    return res.json({ result: rewrittenText });

  } catch (error) {
    console.error('❌ AI Generation Error:', error.message);
    res.status(500).json({ 
        error: 'AI Service Failed', 
        details: error.message 
    });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});