// server/debug.js
const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

async function checkModels() {
  console.log("🔍 Testing API Key...");
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.log("❌ API KEY ERROR:", data.error.message);
    } else {
      console.log("✅ SUCCESS! Your API Key works.");
      console.log("Here are the models you are allowed to use:");
      console.log("------------------------------------------------");
      // Filter for "generateContent" models only
      const available = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", ""));
      
      console.log(available.join("\n"));
      console.log("------------------------------------------------");
      console.log("👉 Pick one of these names and put it in index.js");
    }
  } catch (err) {
    console.log("Network Error:", err);
  }
}

checkModels();