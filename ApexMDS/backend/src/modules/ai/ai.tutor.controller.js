import { generateWithGemini } from "./gemini.service.js";

// ===============================
// 🧠 Structured Study Plan
// ===============================
export const generateTutorPlan = async (req, res) => {
  try {
    console.log("BODY RECEIVED:", req.body);
    const { prompt, history } = req.body || {};

    

    if (!prompt) {
      return res.status(400).json({ message: "Prompt required" });
    }

    const structuredPrompt = `
You are a NEET MDS expert mentor.

Previous conversation:
${history || "None"}

Current question:
${prompt}

Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap in backticks.
Do NOT add commentary outside JSON.

Structure:
{
  "coreConcepts": ["string"],
  "commonMistakes": ["string"],
  "examTraps": ["string"],
  "rapidRevision": ["string"],
  "mcqTraps": ["string"]
}

${prompt}
`.trim();

    const raw = await generateWithGemini(structuredPrompt, {
      model: "gemini-1.5-pro"
    });

    // 🔥 Clean markdown if Gemini wraps it
    let cleaned = raw.trim();

// Remove markdown wrapping if present
if (cleaned.startsWith("```")) {
  cleaned = cleaned.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();
}

const parsed = JSON.parse(cleaned);

    res.json(parsed);

  } catch (error) {
    console.error("TUTOR PLAN ERROR:", error);
     if (
    error.message?.includes("quota") ||
    error.message?.includes("limit")
  ) {
    return res.status(429).json({
      message: "Daily AI tutor limit reached"
    });
  }
    res.status(500).json({ message: "Tutor generation failed" });
  }
};

export const generateTutorChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const prompt = `
You are a friendly NEET MDS mentor.

Conversation so far:
${history || "None"}

User: ${message}

if user message is irrelevent from neet mds concepts or question reply with a short like "I cant answer questions irrelevant to neet preparation but ask me anything related to neet preparation i will answer it clearly"

Reply naturally like ChatGPT. Do NOT return JSON.
`.trim();

    const raw = await generateWithGemini(prompt, {
      model: "gemini-1.5-pro"
    });

    res.json({ reply: raw });

  } catch (error) {
    console.error("TUTOR CHAT ERROR:", error.message);

    if (error.message?.includes("quota") || error.message?.includes("limit")) {
      return res.status(429).json({
        message: "Daily AI tutor limit reached"
      });
    }

    res.status(500).json({ message: "Chat generation failed" });
  }
};



// ===============================
// 📝 Practice MCQ Generator
// ===============================
/*export const generateTutorMCQs = async (req, res) => {
  try {
    const { subject } = req.body || {};

    if (!subject) {
      return res.status(400).json({ message: "Subject required" });
    }

    const mcqPrompt = `
Generate 5 NEET MDS MCQs from ${subject}.

Return ONLY valid JSON.
Do NOT use markdown.
Do NOT wrap in backticks.
Do NOT add commentary outside JSON.

Structure:
[
  {
    "questionText": "string",
    "options": ["", "", "", ""],
    "correctOption": 0,
    "explanation": "string"
  }
]
`.trim();

    const raw = await generateWithGemini(mcqPrompt, {
      model: "gemini-1.5-pro"
    });

    // 🔥 Clean markdown if wrapped
    let cleaned = raw.trim();

// Remove markdown wrapping if present
if (cleaned.startsWith("```")) {
  cleaned = cleaned.replace(/```json/g, "")
                   .replace(/```/g, "")
                   .trim();
}

const parsed = JSON.parse(cleaned);

    res.json(parsed);

  } catch (error) {
    console.error("TUTOR MCQ ERROR:", error);
    res.status(500).json({ message: "MCQ generation failed" });
  }
};*/