import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { text } = req.body;

    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/kPzsL2i3teMYv0FxEYQ6",
      { text },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.VOICE_ELEVEN,
        },
        responseType: "arraybuffer", // áudio binário
      }
    );

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(response.data);
  } catch (error) {
    console.error("Erro ElevenLabs:", error.response?.data || error.message);
    res.status(500).json({ error: "Falha ao gerar áudio" });
  }
}
