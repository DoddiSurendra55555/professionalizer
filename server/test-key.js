const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("---------------------------------------------------");
console.log("🔍 DIAGNOSTIC TOOL: Checking API Key Permissions...");
console.log("---------------------------------------------------");

if (!apiKey) {
    console.error("❌ ERROR: No GOOGLE_API_KEY found in .env file");
    process.exit(1);
}

async function checkModels() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
        console.log("❌ API RESPONSE ERROR:");
        console.log(`   Code: ${data.error.code}`);
        console.log(`   Message: ${data.error.message}`);
        console.log("👉 FIX: Create a NEW key at https://aistudio.google.com/app/apikey");
    } else if (!data.models) {
        console.log("❌ CRITICAL: Your API Key works, but has NO ACCESS to models.");
        console.log("👉 FIX: You must enable 'Generative Language API' in Google Cloud Console.");
        console.log("👉 EASIER FIX: Create a fresh key at https://aistudio.google.com/app/apikey");
    } else {
        console.log("✅ SUCCESS! Your key has access to these models:");
        
        // Filter and show only relevant models
        const names = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace('models/', ''));
            
        console.log(names);
        console.log("---------------------------------------------------");
        console.log(`👉 RECOMMENDED: Use '${names.includes('gemini-1.5-flash') ? 'gemini-1.5-flash' : 'gemini-pro'}' in your index.js`);
    }
  } catch (err) {
    console.log("❌ NETWORK ERROR:", err.message);
  }
}

checkModels();