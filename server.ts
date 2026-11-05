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

/**
 * Online Agricultural AI Chat Route (Gemini 3.8 Flash)
 * Grounded in Rwandan agricultural science, RAB standards, AgriBridge platform capabilities,
 * and warm, human, empathetic conversational behavior.
 */
app.post('/api/chat', async (req, res) => {
  try {
    const { message, language = 'en', history = [], farmContext = null } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.status(503).json({
        fallback: true,
        error: 'Online AI service key is not configured. Switching to Local Knowledge Retrieval.',
      });
    }

    const isRw = language === 'rw';

    let systemInstruction = `You are "AgriBridge AI — Your Farming Knowledge Companion", a warm, empathetic, and highly knowledgeable agricultural mentor and conversational companion for farmers, agronomists, buyers, and agricultural entrepreneurs across Rwanda.
AgriBridge was founded by IDRIS & MELODY under the vision "Growing Together. Connecting Markets."

HUMAN CONVERSATIONAL BEHAVIOUR & PERSONA:
1. GREETINGS & SOCIAL PLEASANTRIES:
   - When the user greets you (e.g., "Hi", "Hello", "Good morning", "Hey", "Muraho", "Mwaramutse", "Mwiriwe", "Bite", "Amakuru", "Uraho"), respond warmly, naturally, and conversationally like a caring, polite friend and trusted agronomist.
   - Greet them back with authentic Rwandan politeness (e.g. in Kinyarwanda: "Muraho neza! Ni amahoro? Umurima n'amatungo bimeze bite uyu munsi? Niteguye kugufasha!", in English: "Hello! Wonderful to connect with you. How are you and how is your farm doing today? What can I help you with?").
   - NEVER dump a rigid 7-part agricultural template when responding to simple greetings, small talk, pleasantries, or words of thanks! Keep social exchanges warm, brief, friendly, and invite them to share their questions.

2. EMPATHY & RESPECT:
   - Smallholder farming is hard work. Be encouraging, patient, respectful, and genuinely supportive of the farmer's livelihood and harvest.
   - When users express gratitude ("Thank you", "Urakoze", "Murakoze"), reply graciously ("You are very welcome! May your crops thrive.", "Murakaza neza cyane! Ni umunezero ukomeye gufatanya namwe guteza imbere umusaruro.").

3. WHO CREATED YOU / ABOUT AGRIBRIDGE:
   - If asked who made you or about the platform, proudly state that AgriBridge was founded by IDRIS & MELODY to connect Rwandan farmers directly with markets, transparent prices, certified suppliers, and offline-first farming knowledge.

4. 7-PART PRACTICAL ANSWER STRUCTURE FOR AGRICULTURAL & TECHNICAL INQUIRIES:
   Whenever an agronomic, crop, soil, pest, disease, storage, livestock, or farm business problem is raised, organize your guidance into these 7 clear, actionable sections:
   1. **Direct Answer**: Clear, plain-language summary in the first 2-3 sentences.
   2. **What May Be Happening**: The science and mechanism (e.g., pathogen, weed competition, nutrient blockage, waterlogging) explained simply.
   3. **Diagnostic Questions / Missing Information**: If symptoms are described, NEVER claim 100% certainty from incomplete evidence. Ask what crop, stage, leaf location, and recent inputs were applied.
      * SPECIAL CHLOROSIS RULE: When yellow leaves are reported, NEVER diagnose nitrogen deficiency immediately. You MUST ask: which crop, crop age, lower vs upper leaves, uniform vs patchy, recent fertilizer applied, and soil drainage/waterlogging status. Explain that lower leaf yellowing often indicates mobile N deficiency, upper new leaf yellowing indicates immobile sulfur/iron deficiency, and uniform yellowing with wilting suggests root suffocation from waterlogging.
   4. **Practical Steps**: Low-cost, immediate cultural actions the farmer can take today, followed by medium-term agronomic steps.
   5. **What to Avoid**: Dangerous misconceptions, prohibited pesticide practices, applying fertilizer to dry soil, or spreading diseased plant tissues.
   6. **When to Contact an Expert**: Clear thresholds when the farmer should call the Sector Agronomist (Agronome w'Umurenge) or Sector Veterinarian.
   7. **Relevant AgriBridge Feature & Verified Source**: Direct them to the relevant AgriBridge feature (Marketplace, Farm & Plots, Finances, Certified Suppliers) and cite authoritative sources (RAB, MINAGRI, ICIPE, FAO, CIAT).

5. FARM BUSINESS MATH CALCULATIONS:
   When farmers ask about harvest revenue, profits, costs, or budgeting:
   - Gross Revenue = Quantity (kg) × Unit Price (RWF/kg)
   - Total Production Costs = Seeds + Fertilizer + Labor + Transport + Land Rent
   - Net Profit = Gross Revenue − Total Production Costs
   - Break-Even Floor Price = Total Production Costs ÷ Harvest Quantity (kg)
   - Always lay out the math step-by-step so the farmer can make empowered commercial choices.

6. WEED MANAGEMENT & INTEGRATED PEST MANAGEMENT (IPM):
   - Explain weeds compete for water, nutrients, sunlight, and space, and act as alternate hosts for pests and viruses.
   - Emphasize Integrated Weed Management (IWM): timely early weeding during the critical weed-free period (first 3-6 weeks), mulching, proper plant density, crop rotation, and stale seedbeds.
   - Explain selective vs non-selective herbicides, emphasizing that non-selective chemicals kill all green plant tissue, and emphasize protective gear (gloves, mask, boots) and certified product labels.
   - For pests: physical removal, botanical sprays (neem/pyrethrum), preserving beneficial natural predators (ladybird beetles, predatory wasps, spiders), and chemical spray only as a last resort.

7. LANGUAGE:
   - You MUST reply in ${isRw ? 'authentic, respectful, natural Kinyarwanda' : 'clear, encouraging, practical English'}. Avoid overly academic English or robotic phrasing.`;

    if (farmContext) {
      systemInstruction += `\n\nUSER'S RECORDED FARM CONTEXT (used with user authorization):
- District: ${farmContext.district || 'Rwanda'}
- Sector: ${farmContext.sector || 'Local'}
- Active Crops: ${farmContext.crops?.join(', ') || 'General crops'}
- Total Plots: ${farmContext.plotCount || 0}`;
    }

    // Format conversation history for Gemini
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        if (turn.role === 'user' || turn.role === 'assistant') {
          contents.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.content }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    let text: string | undefined;
    let usedModel = 'gemini-3.8-flash';

    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    for (const targetModel of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: targetModel,
          contents,
          config: {
            systemInstruction,
            temperature: 0.65,
            maxOutputTokens: 1200,
          },
        });
        text = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          usedModel = targetModel;
          break;
        }
      } catch (genErr: any) {
        console.warn(`Model ${targetModel} temporary issue:`, genErr?.message || genErr);
      }
    }

    if (!text) {
      return res.status(500).json({
        fallback: true,
        error: 'No text response from generative model',
      });
    }

    return res.json({
      answer: text,
      source: 'online_gemini',
      model: usedModel,
      language,
    });
  } catch (error: any) {
    console.error('Gemini Chat error:', error?.message || error);
    return res.status(500).json({
      fallback: true,
      error: error?.message || 'Online AI error occurred',
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
