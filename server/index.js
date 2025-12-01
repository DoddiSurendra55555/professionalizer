// DEBUG LOG: Line 1 - Proves the file is actually running
console.log("🔄 SYSTEM STARTING: Loading modules...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load env vars
dotenv.config();

const app = express();
// RENDER FIX: Render ALWAYS uses port 10000. We must respect process.env.PORT
const port = process.env.PORT || 10000;

console.log(`✅ Modules Loaded. Configuring server for Port: ${port}...`);

// Middleware
app.use(cors());
app.use(express.json());

// 1. Health Check Route (Vital for Render to know we are alive)
app.get('/', (req, res) => {
  console.log("💓 Health check ping received!");
  res.send('Professionalizer Backend is Active & Running.');
});

// Initialize AI
const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("❌ CRITICAL ERROR: GOOGLE_API_KEY is missing in environment variables!");
} else {
    console.log("🔑 API Key found. Initializing Gemini...");
}
const genAI = new GoogleGenerativeAI(apiKey || "dummy_key_to_prevent_crash");

app.post('/api/rewrite', async (req, res) => {
  try {
    const { text, tone } = req.body;
    console.log(`📩 Request received: ${tone}`);
    
    if (!text) return res.status(400).json({ error: 'Text is required' });

    // Use the confirmed model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `Rewrite to be ${tone}: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ result: response.text() });
    console.log("✅ Response sent successfully.");

  } catch (error) {
    console.error('❌ AI Error:', error.message);
    res.status(500).json({ error: 'AI Error', details: error.message });
  }
});

// 2. STARTUP COMMAND
// We use '0.0.0.0' to bind to all network interfaces (Required for Render)
app.listen(port, '0.0.0.0', (err) => {
    if (err) {
        console.error("❌ FAILED TO START SERVER:", err);
    } else {
        console.log(`🚀 SERVER IS LIVE on http://0.0.0.0:${port}`);
    }
});