const express = require("express");
const { protect } = require("../middleware/auth");
const {
  buildUserDashboardContext,
  buildSystemInstruction,
} = require("../utils/buildUserContext");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { messages } = req.body;
  if (!messages?.length) {
    return res.status(400).json({ error: "Missing messages" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "GEMINI_API_KEY is not set in apps/backend/.env" });
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    const dashboardContext = await buildUserDashboardContext(req.user);
    const systemInstruction = buildSystemInstruction(dashboardContext);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: messages,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const message =
        data.error?.message || `Gemini API error (${response.status})`;
      const status = response.status === 429 ? 429 : 502;
      return res.status(status).json({ error: message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res
        .status(502)
        .json({ error: "No text in Gemini response — try a different prompt" });
    }

    res.json(data);
  } catch (err) {
    console.error("[Gemini proxy]", err);
    res.status(500).json({ error: err.message || "Chat proxy failed" });
  }
});

module.exports = router;
