require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    if (response.ok) {
      console.log("Supported Models:");
      data.models.forEach((m) => {
        console.log(`- Name: ${m.name}, DisplayName: ${m.displayName}, SupportedActions: ${m.supportedGenerationMethods}`);
      });
    } else {
      console.log("Error listing models:", data.error?.message || JSON.stringify(data));
    }
  } catch (err) {
    console.log("Fetch error:", err.message);
  }
}

listModels();
