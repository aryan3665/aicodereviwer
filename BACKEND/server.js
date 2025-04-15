import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Support __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = 9050;

app.use(cors());
app.use(express.json());

// Serve frontend files from public folder
app.use(express.static(path.join(__dirname, "../public")));

const GROQ_API_KEY = process.env.GROQ_API_KEY;

app.post("/review", async (req, res) => {
  const { code, lang, level } = req.body;

  const prompt = `
You are an expert code reviewer. Please analyze the following ${lang} code and provide:
1. Line-by-line explanation
2. Error detection (if any)
3. Code optimization suggestions
4. Overall code quality score out of 10 
5. Explain like I'm ${level} also run on a sample test case 

Code:
\`\`\`${lang}
${code}
\`\`\`
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
      }),
    });

    const data = await response.json();
    const output = data.choices?.[0]?.message?.content || "⚠ No explanation received.";
    res.json({ output });
  } catch (err) {
    console.error("❌ Error in API call:", err.message);
    res.status(500).json({ output: "❌ Error processing the code." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
