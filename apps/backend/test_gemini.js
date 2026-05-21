require("dotenv").config();
const apiKey = process.env.GEMINI_API_KEY;

async function test() {
  const models = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-pro-latest",
    "gemini-2.5-flash",
    "gemini-3.5-flash"
  ];
  
  for (const model of models) {
    try {
      console.log(`Testing model: ${model}...`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Hello" }] }]
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log(`✅ ${model} works! Response:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
      } else {
        console.log(`❌ ${model} failed:`, data.error?.message || JSON.stringify(data));
      }
    } catch (err) {
      console.log(`❌ ${model} error:`, err.message);
    }
  }
}

test();
