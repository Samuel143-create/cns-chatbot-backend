import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para recibir mensajes del frontend
app.post("/chat", async (req, res) => {
  const mensaje = req.body.message;

  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          { role: "system", content: "Eres un asistente para explicar resultados del CNS." },
          { role: "user", content: mensaje }
        ]
      })
    });

    const data = await r.json();
    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error del servidor" });
  }
});

// Puerto 3000
app.listen(3000, () => console.log("Servidor listo en puerto 3000"));