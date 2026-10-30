import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Pre-initialize Gemini client if key is provided
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' },
      },
    });
  }
  return aiClient;
}

/**
 * Real Kinyarwanda Audio TTS Generation Route
 * Uses gemini-3.8-flash-lite-tts to generate natural, authentic spoken Kinyarwanda
 */
app.post('/api/tts', async (req, res) => {
  try {
    const { text, speaker = 'keza', speed = 1.0 } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY not configured. Falling back to local synthesizer.',
        fallback: true,
      });
    }

    // Persona selection: Kore for Agronome Keza (female), Puck for Agronome Mugisha (male)
    const isMale = speaker === 'male' || speaker === 'mugisha';
    const voiceName = isMale ? 'Puck' : 'Kore';
    const speakerStyle = isMale
      ? 'Male Rwandan agronomist speaking fluent, warm, authoritative Kinyarwanda with a natural African cadence for rural farmers.'
      : 'Female Rwandan agricultural extension worker speaking clear, gentle, authentic Kinyarwanda for smallholder farmers.';

    const promptText = `Speak in authentic, native Kinyarwanda with clear rural extension pronunciation: "${text}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: promptText,
              speechMetadata: {
                style: speakerStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({
        error: 'No audio data returned by model.',
        fallback: true,
      });
    }

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      voice: voiceName,
      speaker: isMale ? 'mugisha' : 'keza',
    });
  } catch (error: any) {
    console.error('Gemini TTS error:', error?.message || error);
    return res.status(500).json({
      error: error?.message || 'TTS generation encountered an issue',
      fallback: true,
    });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AgriBridge Rwanda Engine',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriBridge Rwanda server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
