import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const HF_TOKEN = process.env.HF_API_KEY;

// memoria simple (demo)
let history = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  history.push(`User: ${userMessage}`);
  if (history.length > 6) history.shift();

  const prompt = history.join("\n") + "\nBot:";

  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/microsoft/DialoGPT-medium",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 80,
            temperature: 0.7,
            top_p: 0.9
          }
        })
      }
    );

    const data = await response.json();
    let reply = data[0]?.generated_text || "No entendí, intenta de nuevo.";

    reply = reply.replace(prompt, "").trim();
    history.push(`Bot: ${reply}`);

    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error del servidor" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🤖 Backend CNS activo en puerto ${PORT}`)
);
