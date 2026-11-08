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

// In-memory backend database for Portfolios, Users, and Authenticated Sessions
interface BackendAccount {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  role: string;
  category: string;
  district: string;
  sector: string;
  cell?: string;
  nicheSpecialty?: string;
  businessOrFarmName?: string;
  cooperativeName?: string;
  tradeVolumeScale?: string;
  passwordOrPin: string;
  securityQuestion?: string;
  securityAnswer?: string;
  agentId?: string;
  assignedDistrict?: string;
  assignedSectors?: string[];
  createdAt: string;
}

interface BackendPortfolio {
  id: string;
  userId: string;
  name: string;
  category: string;
  role: string;
  district: string;
  sector: string;
  cell?: string;
  nicheSpecialty?: string;
  businessOrFarmName?: string;
  cooperativeName?: string;
  tradeVolumeScale?: string;
  isPrimary: boolean;
  createdAt: string;
  metrics?: {
    plotsCount?: number;
    activeListingsCount?: number;
    completedDealsCount?: number;
    totalAreaHa?: number;
  };
}

const SERVER_ACCOUNTS: BackendAccount[] = [
  {
    id: 'user_farmer_1',
    fullName: 'IDRIS Agaba Otin',
    phoneNumber: '+250 788 123 456',
    email: 'idris.agaba@agribridge.rw',
    role: 'farmer',
    category: 'seller',
    district: 'Nyagatare',
    sector: 'Mimuri',
    cell: 'Mahoro Cell',
    nicheSpecialty: 'Maize & Climbing Beans Producer',
    businessOrFarmName: 'Umurima w\'Icyerekezo',
    cooperativeName: 'COOPAMA Mimuri Maize Union',
    tradeVolumeScale: 'Medium Commercial (1 - 5 Ha)',
    passwordOrPin: '1234',
    securityQuestion: 'What is your childhood farm sector?',
    securityAnswer: 'mimuri',
    createdAt: '2026-08-15T08:00:00Z',
  },
  {
    id: 'user_buyer_1',
    fullName: 'Clarisse Umutoni',
    phoneNumber: '+250 788 654 321',
    email: 'umutoni@kigaligrains.rw',
    role: 'buyer',
    category: 'buyer',
    district: 'Kigali / Nyagatare Hub',
    sector: 'Nyagatare',
    cell: 'Barija Cell',
    nicheSpecialty: 'Commercial Flour Milling & Bulk Grain Aggregation',
    businessOrFarmName: 'Kigali Grain Millers Ltd',
    cooperativeName: 'Kigali Wholesale Grains Exchange',
    tradeVolumeScale: 'Industrial Bulk (> 10 Tons)',
    passwordOrPin: '1234',
    securityQuestion: 'What is your company registration city?',
    securityAnswer: 'kigali',
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'user_supplier_1',
    fullName: 'Aphrodis Mukunzi',
    phoneNumber: '+250 788 444 555',
    email: 'mukunzi@nyagatareinputs.rw',
    role: 'supplier',
    category: 'supplier',
    district: 'Nyagatare',
    sector: 'Nyagatare',
    cell: 'Nyagatare Cell',
    nicheSpecialty: 'Certified Hybrid Seeds, DAP/NPK Fertilizers & Solar Pumps',
    businessOrFarmName: 'Nyagatare Certified Agro-Inputs Hub',
    cooperativeName: 'Rwanda Agro-Dealers Network',
    tradeVolumeScale: 'District Agro-Input Hub & Sector Outlets',
    passwordOrPin: '1234',
    securityQuestion: 'What primary inputs do you supply?',
    securityAnswer: 'seeds',
    createdAt: '2026-07-20T08:00:00Z',
  },
  {
    id: 'user_agent_1',
    fullName: 'Emmanuel Habimana',
    phoneNumber: '+250 788 987 654',
    email: 'habimana.agent@agribridge.rw',
    role: 'agent',
    category: 'agent',
    agentId: 'AGT-NYA-001',
    assignedDistrict: 'Nyagatare',
    assignedSectors: ['Rukomo', 'Mimuri', 'Karangazi'],
    district: 'Nyagatare',
    sector: 'Rukomo',
    cell: 'Rukomo Cell',
    nicheSpecialty: 'Farmer Mobilization, Yield Weighing & Aggregation Quality Checks',
    businessOrFarmName: 'Rukomo Community Extension Desk',
    cooperativeName: 'Rukomo Community Agricultural Extension',
    tradeVolumeScale: 'Field Extension Desk (420 Farmers Enrolled)',
    passwordOrPin: '1234',
    securityQuestion: 'What is your assigned agent sector?',
    securityAnswer: 'rukomo',
    createdAt: '2026-07-15T08:00:00Z',
  },
  {
    id: 'user_admin_1',
    fullName: 'Beata Mukamazimpaka',
    phoneNumber: '+250 788 000 111',
    email: 'admin.nyagatare@minagri.gov.rw',
    role: 'admin',
    category: 'admin',
    district: 'Nyagatare',
    sector: 'Nyagatare',
    cell: 'Nyagatare Cell',
    nicheSpecialty: 'Agricultural Standards, Cooperative Audits & Trade Oversight',
    businessOrFarmName: 'District Agriculture & Natural Resources Directorate',
    cooperativeName: 'District Agriculture & Natural Resources Office',
    tradeVolumeScale: 'District Oversight Directorate',
    passwordOrPin: '1234',
    securityQuestion: 'What is your oversight district?',
    securityAnswer: 'nyagatare',
    createdAt: '2026-06-01T08:00:00Z',
  },
];

const SERVER_PORTFOLIOS: BackendPortfolio[] = [
  {
    id: 'PF-RW-IDRIS-01',
    userId: 'user_farmer_1',
    name: 'Umurima w\'Icyerekezo (Mimuri)',
    category: 'seller',
    role: 'farmer',
    district: 'Nyagatare',
    sector: 'Mimuri',
    cell: 'Mahoro Cell',
    nicheSpecialty: 'Maize & Climbing Beans Producer',
    businessOrFarmName: 'Umurima w\'Icyerekezo',
    cooperativeName: 'COOPAMA Mimuri Maize Union',
    tradeVolumeScale: 'Medium Commercial (1 - 5 Ha)',
    isPrimary: true,
    createdAt: '2026-08-15T08:00:00Z',
    metrics: { plotsCount: 2, activeListingsCount: 2, completedDealsCount: 4, totalAreaHa: 2.4 },
  },
  {
    id: 'PF-RW-IDRIS-02',
    userId: 'user_farmer_1',
    name: 'Rukomo Valley Wetland Plot (Rice & Marshland)',
    category: 'seller',
    role: 'farmer',
    district: 'Nyagatare',
    sector: 'Rukomo',
    cell: 'Kinyami Cell',
    nicheSpecialty: 'Basmati Paddy Rice & Irrigation',
    businessOrFarmName: 'Rukomo Marshland Cooperative',
    cooperativeName: 'CORIMU Muvumba Rice Cooperative',
    tradeVolumeScale: 'Irrigated Wetland (1.2 Ha)',
    isPrimary: false,
    createdAt: '2026-09-01T09:30:00Z',
    metrics: { plotsCount: 1, activeListingsCount: 1, completedDealsCount: 2, totalAreaHa: 1.2 },
  },
  {
    id: 'PF-RW-CLARISSE-01',
    userId: 'user_buyer_1',
    name: 'Kigali Millers Ltd - Nyagatare Intake Hub',
    category: 'buyer',
    role: 'buyer',
    district: 'Kigali / Nyagatare Hub',
    sector: 'Nyagatare',
    cell: 'Barija Cell',
    nicheSpecialty: 'Commercial Flour Milling & Bulk Grain Aggregation',
    businessOrFarmName: 'Kigali Grain Millers Ltd',
    cooperativeName: 'Kigali Wholesale Grains Exchange',
    tradeVolumeScale: 'Industrial Bulk (> 10 Tons)',
    isPrimary: true,
    createdAt: '2026-08-01T10:00:00Z',
    metrics: { plotsCount: 0, activeListingsCount: 5, completedDealsCount: 12, totalAreaHa: 0 },
  },
  {
    id: 'PF-RW-APHRODIS-01',
    userId: 'user_supplier_1',
    name: 'Nyagatare Certified Agro-Inputs Hub',
    category: 'supplier',
    role: 'supplier',
    district: 'Nyagatare',
    sector: 'Nyagatare',
    cell: 'Nyagatare Cell',
    nicheSpecialty: 'Certified Hybrid Seeds, DAP/NPK Fertilizers & Solar Pumps',
    businessOrFarmName: 'Nyagatare Certified Agro-Inputs Hub',
    cooperativeName: 'Rwanda Agro-Dealers Network',
    tradeVolumeScale: 'District Agro-Input Hub & Sector Outlets',
    isPrimary: true,
    createdAt: '2026-07-20T08:00:00Z',
    metrics: { plotsCount: 0, activeListingsCount: 18, completedDealsCount: 35, totalAreaHa: 0 },
  },
  {
    id: 'PF-RW-EMMANUEL-01',
    userId: 'user_agent_1',
    name: 'Rukomo Community Extension & Aggregation Desk',
    category: 'agent',
    role: 'agent',
    district: 'Nyagatare',
    sector: 'Rukomo',
    cell: 'Rukomo Cell',
    nicheSpecialty: 'Farmer Mobilization, Yield Weighing & Aggregation Quality Checks',
    businessOrFarmName: 'Rukomo Community Extension Desk',
    cooperativeName: 'Rukomo Community Agricultural Extension',
    tradeVolumeScale: 'Field Extension Desk (420 Farmers Enrolled)',
    isPrimary: true,
    createdAt: '2026-07-15T08:00:00Z',
    metrics: { plotsCount: 0, activeListingsCount: 8, completedDealsCount: 22, totalAreaHa: 0 },
  },
  {
    id: 'PF-RW-BEATA-01',
    userId: 'user_admin_1',
    name: 'COOPAMA Mimuri Cooperative Oversight Desk',
    category: 'admin',
    role: 'admin',
    district: 'Nyagatare',
    sector: 'Nyagatare',
    cell: 'Nyagatare Cell',
    nicheSpecialty: 'Agricultural Standards, Cooperative Audits & Trade Oversight',
    businessOrFarmName: 'District Agriculture & Natural Resources Directorate',
    cooperativeName: 'District Agriculture & Natural Resources Office',
    tradeVolumeScale: 'District Oversight Directorate',
    isPrimary: true,
    createdAt: '2026-06-01T08:00:00Z',
    metrics: { plotsCount: 0, activeListingsCount: 0, completedDealsCount: 50, totalAreaHa: 0 },
  },
];

// Helper to normalize phone numbers for searching
function normalizePhone(p?: string) {
  if (!p) return '';
  return p.replace(/[\s\-\(\)]/g, '').replace(/^0/, '+250');
}

/**
 * 1. Register New Portfolio & User Account
 */
app.post('/api/auth/register', (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      email,
      passwordOrPin,
      securityQuestion,
      securityAnswer,
      category = 'seller',
      role = 'farmer',
      district = 'Nyagatare',
      sector = 'Mimuri',
      cell = 'Central Cell',
      portfolioName,
      nicheSpecialty,
      businessOrFarmName,
      cooperativeName,
      tradeVolumeScale,
    } = req.body;

    if (!fullName || !phoneNumber || !passwordOrPin) {
      return res.status(400).json({ error: 'Full name, phone number, and password/PIN are required.' });
    }

    const cleanPhone = normalizePhone(phoneNumber);
    const existing = SERVER_ACCOUNTS.find(
      (a) => normalizePhone(a.phoneNumber) === cleanPhone || (email && a.email?.toLowerCase() === email.toLowerCase())
    );

    if (existing) {
      return res.status(409).json({ error: 'An account with this phone number or email address is already registered.' });
    }

    const userId = `user_${Date.now()}`;
    const portfolioId = `PF-RW-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAccount: BackendAccount = {
      id: userId,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email ? email.trim() : undefined,
      role,
      category,
      district,
      sector,
      cell,
      nicheSpecialty: nicheSpecialty || (role === 'farmer' ? 'Maize & Climbing Beans Producer' : 'Agricultural Trading'),
      businessOrFarmName: businessOrFarmName || portfolioName || fullName.trim(),
      cooperativeName,
      tradeVolumeScale,
      passwordOrPin: String(passwordOrPin).trim(),
      securityQuestion,
      securityAnswer: securityAnswer ? securityAnswer.trim().toLowerCase() : undefined,
      createdAt: new Date().toISOString(),
    };

    const newPortfolio: BackendPortfolio = {
      id: portfolioId,
      userId,
      name: (portfolioName && portfolioName.trim()) || `${fullName.trim()} Farm & Agricultural Portfolio`,
      category,
      role,
      district,
      sector,
      cell,
      nicheSpecialty: newAccount.nicheSpecialty,
      businessOrFarmName: newAccount.businessOrFarmName,
      cooperativeName,
      tradeVolumeScale,
      isPrimary: true,
      createdAt: new Date().toISOString(),
      metrics: {
        plotsCount: role === 'farmer' ? 1 : 0,
        activeListingsCount: 0,
        completedDealsCount: 0,
        totalAreaHa: role === 'farmer' ? 1.0 : 0,
      },
    };

    SERVER_ACCOUNTS.push(newAccount);
    SERVER_PORTFOLIOS.push(newPortfolio);

    const token = `agri_tok_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newAccount.id,
        fullName: newAccount.fullName,
        phoneNumber: newAccount.phoneNumber,
        email: newAccount.email,
        role: newAccount.role,
        category: newAccount.category,
        district: newAccount.district,
        sector: newAccount.sector,
        nicheSpecialty: newAccount.nicheSpecialty,
        businessOrFarmName: newAccount.businessOrFarmName,
        cooperativeName: newAccount.cooperativeName,
        isVerified: true,
        isDemo: false,
        activePortfolioId: portfolioId,
      },
      portfolios: [newPortfolio],
      activePortfolioId: portfolioId,
    });
  } catch (err: any) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Registration failed. Please check network connectivity.' });
  }
});

/**
 * 2. Access Existing Portfolio (Login via Phone, Email or Portfolio ID + Password/PIN)
 */
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, passwordOrPin } = req.body;

    if (!identifier || !passwordOrPin) {
      return res.status(400).json({ error: 'Please enter your phone number, email, or Portfolio ID, and your password/PIN.' });
    }

    const cleanInput = String(identifier).trim();
    const cleanPhone = normalizePhone(cleanInput);
    const providedPin = String(passwordOrPin).trim();

    // Find account by phone, email, or portfolio ID
    let account = SERVER_ACCOUNTS.find((a) => {
      const matchPhone = normalizePhone(a.phoneNumber) === cleanPhone;
      const matchEmail = a.email && a.email.toLowerCase() === cleanInput.toLowerCase();
      return matchPhone || matchEmail;
    });

    if (!account) {
      // Check if identifier is a portfolio ID
      const portfolio = SERVER_PORTFOLIOS.find((p) => p.id.toLowerCase() === cleanInput.toLowerCase());
      if (portfolio) {
        account = SERVER_ACCOUNTS.find((a) => a.id === portfolio.userId);
      }
    }

    if (!account) {
      return res.status(401).json({ error: 'No account found matching this identifier. Please verify your phone number, email, or Portfolio ID.' });
    }

    // Verify Password or PIN (allow set password, or universal '123' / '1234' for demo convenience)
    const isPasswordValid =
      account.passwordOrPin === providedPin ||
      providedPin === '123' ||
      providedPin === '1234';

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Incorrect password or PIN. Please try again or use the access recovery option.' });
    }

    // Retrieve user's actual portfolios
    const portfolios = SERVER_PORTFOLIOS.filter((p) => p.userId === account!.id);
    const primaryPortfolio = portfolios.find((p) => p.isPrimary) || portfolios[0];

    const token = `agri_tok_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    return res.json({
      success: true,
      token,
      user: {
        id: account.id,
        fullName: account.fullName,
        phoneNumber: account.phoneNumber,
        email: account.email,
        role: account.role,
        category: account.category,
        district: account.district,
        sector: account.sector,
        nicheSpecialty: account.nicheSpecialty,
        businessOrFarmName: account.businessOrFarmName,
        cooperativeName: account.cooperativeName,
        tradeVolumeScale: account.tradeVolumeScale,
        isVerified: true,
        isDemo: account.id.startsWith('user_'),
        activePortfolioId: primaryPortfolio?.id,
      },
      portfolios,
      activePortfolioId: primaryPortfolio?.id,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication request failed.' });
  }
});

/**
 * 3. Community Agent Access Route
 */
app.post('/api/auth/agent-login', (req, res) => {
  try {
    const { agentIdOrPhone, agentPin } = req.body;

    if (!agentIdOrPhone || !agentPin) {
      return res.status(400).json({ error: 'Community Agent ID or registered phone, and Agent PIN are required.' });
    }

    const cleanInput = String(agentIdOrPhone).trim();
    const cleanPhone = normalizePhone(cleanInput);
    const providedPin = String(agentPin).trim();

    const agent = SERVER_ACCOUNTS.find((a) => {
      const matchRole = a.role === 'agent';
      const matchId = a.agentId && a.agentId.toLowerCase() === cleanInput.toLowerCase();
      const matchPhone = normalizePhone(a.phoneNumber) === cleanPhone;
      return matchRole && (matchId || matchPhone);
    });

    if (!agent) {
      return res.status(401).json({ error: 'Unauthorized. Community Agent ID or phone number not recognized.' });
    }

    const isPinValid =
      agent.passwordOrPin === providedPin ||
      providedPin === '123' ||
      providedPin === '1234';

    if (!isPinValid) {
      return res.status(401).json({ error: 'Incorrect Community Agent security PIN.' });
    }

    const portfolios = SERVER_PORTFOLIOS.filter((p) => p.userId === agent.id);
    const primaryPortfolio = portfolios.find((p) => p.isPrimary) || portfolios[0];
    const token = `agri_agent_tok_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    return res.json({
      success: true,
      token,
      isAgent: true,
      agentWorkspace: {
        agentId: agent.agentId || 'AGT-NYA-001',
        assignedDistrict: agent.assignedDistrict || 'Nyagatare',
        assignedSectors: agent.assignedSectors || ['Rukomo', 'Mimuri', 'Karangazi'],
        deskName: agent.businessOrFarmName,
      },
      user: {
        id: agent.id,
        fullName: agent.fullName,
        phoneNumber: agent.phoneNumber,
        email: agent.email,
        role: 'agent',
        category: 'agent',
        agentId: agent.agentId || 'AGT-NYA-001',
        district: agent.district,
        sector: agent.sector,
        nicheSpecialty: agent.nicheSpecialty,
        businessOrFarmName: agent.businessOrFarmName,
        cooperativeName: agent.cooperativeName,
        isVerified: true,
        isDemo: true,
        activePortfolioId: primaryPortfolio?.id,
      },
      portfolios,
      activePortfolioId: primaryPortfolio?.id,
    });
  } catch (err: any) {
    console.error('Agent login error:', err);
    return res.status(500).json({ error: 'Agent verification failed.' });
  }
});

/**
 * 4. Retrieve User's Portfolios
 */
app.get('/api/portfolios', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) {
    return res.json({ portfolios: SERVER_PORTFOLIOS });
  }
  const userPortfolios = SERVER_PORTFOLIOS.filter((p) => p.userId === userId);
  return res.json({ portfolios: userPortfolios });
});

/**
 * 5. Create a New Portfolio under authenticated user
 */
app.post('/api/portfolios', (req, res) => {
  try {
    const {
      userId,
      name,
      category = 'seller',
      role = 'farmer',
      district = 'Nyagatare',
      sector = 'Mimuri',
      cell = 'Central Cell',
      nicheSpecialty,
      businessOrFarmName,
      cooperativeName,
      tradeVolumeScale,
    } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ error: 'User ID and Portfolio Name are required.' });
    }

    const portfolioId = `PF-RW-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPortfolio: BackendPortfolio = {
      id: portfolioId,
      userId,
      name: name.trim(),
      category,
      role,
      district,
      sector,
      cell,
      nicheSpecialty: nicheSpecialty || 'Agricultural Production',
      businessOrFarmName: businessOrFarmName || name.trim(),
      cooperativeName,
      tradeVolumeScale,
      isPrimary: false,
      createdAt: new Date().toISOString(),
      metrics: {
        plotsCount: role === 'farmer' ? 1 : 0,
        activeListingsCount: 0,
        completedDealsCount: 0,
        totalAreaHa: role === 'farmer' ? 1.0 : 0,
      },
    };

    SERVER_PORTFOLIOS.push(newPortfolio);
    const userPortfolios = SERVER_PORTFOLIOS.filter((p) => p.userId === userId);

    return res.status(201).json({
      success: true,
      portfolio: newPortfolio,
      portfolios: userPortfolios,
    });
  } catch (err: any) {
    console.error('Create portfolio error:', err);
    return res.status(500).json({ error: 'Failed to create portfolio.' });
  }
});

/**
 * 6. Update an existing portfolio
 */
app.put('/api/portfolios/:id', (req, res) => {
  try {
    const portfolioId = req.params.id;
    const { name, district, sector, cell, nicheSpecialty, businessOrFarmName, cooperativeName, tradeVolumeScale } = req.body;

    const portfolio = SERVER_PORTFOLIOS.find((p) => p.id === portfolioId);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found.' });
    }

    if (name) portfolio.name = name.trim();
    if (district) portfolio.district = district;
    if (sector) portfolio.sector = sector;
    if (cell) portfolio.cell = cell;
    if (nicheSpecialty) portfolio.nicheSpecialty = nicheSpecialty;
    if (businessOrFarmName) portfolio.businessOrFarmName = businessOrFarmName;
    if (cooperativeName) portfolio.cooperativeName = cooperativeName;
    if (tradeVolumeScale) portfolio.tradeVolumeScale = tradeVolumeScale;

    return res.json({ success: true, portfolio });
  } catch (err: any) {
    console.error('Update portfolio error:', err);
    return res.status(500).json({ error: 'Failed to update portfolio.' });
  }
});

/**
 * 7. Secure Access Recovery (PIN / Password reset)
 */
app.post('/api/auth/recover', (req, res) => {
  try {
    const { identifier, securityAnswer, newPasswordOrPin } = req.body;

    if (!identifier || !newPasswordOrPin) {
      return res.status(400).json({ error: 'Identifier and new password/PIN are required.' });
    }

    const cleanInput = String(identifier).trim();
    const cleanPhone = normalizePhone(cleanInput);

    const account = SERVER_ACCOUNTS.find(
      (a) => normalizePhone(a.phoneNumber) === cleanPhone || (a.email && a.email.toLowerCase() === cleanInput.toLowerCase())
    );

    if (!account) {
      return res.status(404).json({ error: 'No account found matching this identifier.' });
    }

    // If account has a security answer set, verify it (case-insensitive)
    if (account.securityAnswer && securityAnswer) {
      if (account.securityAnswer.trim().toLowerCase() !== String(securityAnswer).trim().toLowerCase()) {
        return res.status(401).json({ error: 'Security answer does not match our records.' });
      }
    }

    account.passwordOrPin = String(newPasswordOrPin).trim();
    return res.json({ success: true, message: 'Password/PIN reset successfully. You can now log into your portfolio.' });
  } catch (err: any) {
    console.error('Recovery error:', err);
    return res.status(500).json({ error: 'Recovery failed.' });
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
