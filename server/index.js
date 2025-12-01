const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
// CRITICAL FIX: Render assigns a random port, usually 10000. We must use it.
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 1. Health Check Route (Render looks for this)
app.get('/', (req, res) => {
  res.send('Professionalizer Backend is Live! 🚀');
});

// 2. The Rewrite Logic
app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, tone } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });

    console.log(`Processing: ${text.substring(0, 15)}...`);

    // Use the model we confirmed works
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Rewrite to be ${tone}: "${text}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ result: response.text() });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'AI Error', details: error.message });
  }
});

// 3. CRITICAL FIX: Bind to '0.0.0.0' to ensure Render can see the app
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on Port ${port}`);
});