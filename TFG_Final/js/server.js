import express from "express";
import OpenAI from "openai"; // O cambia a Gemini más adelante
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: './.env' });

console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "OK" : "NO");

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ia", async (req, res) => {
  try {
    const { personaje, mensajes } = req.body;

    if (!personaje || !mensajes) {
      return res.status(400).json({ error: "Datos incompletos" });
    }

    const systemPrompt = `
Eres un Dungeon Master de D&D.
Narrador inmersivo y coherente.
Nunca controlas al jugador.
Describe acciones, entornos y NPCs.
Personaje del jugador:
Nombre: ${personaje.nombre}
Clase: ${personaje.clase}
Trasfondo: ${personaje.trasfondo || "Desconocido"}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...mensajes
      ],
      max_tokens: 300,
      temperature: 0.8
    });

    res.json({ respuesta: completion.choices[0].message.content });

  } catch (error) {
    console.error("Error IA:", error);

    // Detectar cuota excedida (429 o insufficient_quota)
    if (error.code === 'insufficient_quota' || error.status === 429) {
      // Restablecimiento estimado de cuota (fin del día UTC)
      const reset = new Date();
      reset.setUTCHours(24, 0, 0, 0);
      return res.status(429).json({
        error: "Cuota superada",
        resetUTC: reset.toISOString()
      });
    }

    res.status(500).json({ error: "Error al consultar la IA" });
  }
});

app.listen(3000, () => {
  console.log("Servidor IA listo en puerto 3000");
});
