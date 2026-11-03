/**
 * AgriBridge Offline Agricultural Question-Answering Engine
 * Evaluates farmer questions completely locally without network dependency.
 */

import { AGRI_KNOWLEDGE_BASE, KnowledgeEntry } from '../data/agriKnowledgeBase.ts';

export interface RetrievalResult {
  entry: KnowledgeEntry | null;
  score: number;
  confidence: 'high' | 'medium' | 'low' | 'none';
  formattedAnswer: string;
  source: 'local_knowledge';
  platformAction?: KnowledgeEntry['platformAction'];
  matchedKeywords: string[];
}

export interface FarmContextData {
  district?: string;
  sector?: string;
  crops?: string[];
  growthStage?: string;
  plotCount?: number;
}

// Common stop words in English and Kinyarwanda to exclude from matching
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'in', 'for', 'to', 'of', 'how', 'what', 'can', 'i', 'my', 'do',
  'ni', 'iki', 'mu', 'ku', 'no', 'cyangwa', 'kwa', 'muri', 'nka', 'bya', 'byo', 'rya', 'ryo', 'za', 'zo', 'ko', 'se', 'ese', 'yanjye', 'wanjye'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"’]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Detects natural human conversational intents (greetings, pleasantries, identity, capabilities, gratitude)
 * to provide a warm, empathetic, and culturally respectful dialogue instead of cold database misses.
 */
export function detectConversationalIntent(
  rawQuery: string,
  language: 'en' | 'rw' = 'en',
  farmContext?: FarmContextData | null
): RetrievalResult | null {
  const clean = rawQuery
    .toLowerCase()
    .trim()
    .replace(/[?!.,;:()'"`~]/g, '');

  const district = farmContext?.district || (language === 'rw' ? 'mu Karere kanyu' : 'your district');
  const cropsList = farmContext?.crops?.join(', ') || '';

  // 1. GREETINGS (hi, hello, hey, muraho, bite, etc.)
  const greetingPatterns = [
    /^(hi|hello|hey|heya|howdy|good\s*(morning|afternoon|evening|day)|greetings)$/i,
    /^(muraho|mwaramutse|mwiriwe|bite|uraho|amakuru|amakuru\s*ki|bite\s*se|komera|ni\s*amahoro)$/i,
    /^(hi\s*there|hello\s*agribridge|hello\s*there|hey\s*there)$/i,
    /^(muraho\s*neza|mwiriwe\s*neza|mwaramutse\s*neza|bite\s*byanyu)$/i,
  ];

  if (greetingPatterns.some((pattern) => pattern.test(clean))) {
    const isRw = language === 'rw';
    const answer = isRw
      ? `Muraho neza! Ni amahoro? Nkurangamiye n'umutima ukunze.\n\nUmurima n'amatungo bimeze bite uyu munsi muri ${district}? ${cropsList ? `(Nabashije kubona ko ufite ibihingwa nka: ${cropsList}).` : ''}\n\nNiteguye kubafasha mu buhinzi n'ubworozi — guhera ku gufata neza ubutaka, kurwanya uburwayi bw'ibihingwa, kumenya ibiciro ku isoko no gukoresha serivisi za AgriBridge.\n\nMumbwire, ni ikihe kibazo cyangwa icyo dushobora gufatanya uyu munsi?`
      : `Hello there! Wonderful to connect with you. How are you and how is your farm doing today in ${district}? ${cropsList ? `(I see you are currently cultivating: ${cropsList}).` : ''}\n\nI'm here as your dedicated farming companion to assist you with crop health, soil fertility, livestock care, market prices, and using AgriBridge features.\n\nWhat's on your mind today? Feel free to ask any farming or platform question!`;

    return {
      entry: null,
      score: 10,
      confidence: 'high',
      formattedAnswer: answer,
      source: 'local_knowledge',
      matchedKeywords: ['greeting'],
    };
  }

  // 2. HOW ARE YOU
  const howAreYouPatterns = [
    /^(how\s*are\s*you|how\s*are\s*you\s*doing|how\s*do\s*you\s*do|how\s*is\s*it\s*going|how\s*r\s*u)$/i,
    /^(umeze\s*ute|mumeze\s*mute|amakuru\s*ki|bite\s*se|muraho\s*mute|ni\s*meza)$/i,
  ];
  if (howAreYouPatterns.some((pattern) => pattern.test(clean))) {
    const isRw = language === 'rw';
    const answer = isRw
      ? `Ni meza cyane, amakuru ni meza kandi nishimiye cyane kuvugana namwe! Umurima n'amatungo bihagaze bite muri iki gihe? Niteguye kubagira inama ku buhinzi bunoze no kubahuza n'isoko. Ni iki dushobora kuganiraho uyu munsi?`
      : `I'm doing great, thank you for asking! I'm energetic and ready to help you thrive with your crops, soil, and livestock. How are things on your farm today? What can I help you check or plan?`;

    return {
      entry: null,
      score: 10,
      confidence: 'high',
      formattedAnswer: answer,
      source: 'local_knowledge',
      matchedKeywords: ['how_are_you'],
    };
  }

  // 3. WHO ARE YOU / FOUNDERS / ABOUT
  const identityPatterns = [
    /who\s*(are\s*you|created\s*you|made\s*you|founded|invented)/i,
    /(uri\s*nde|ninde\s*wagukoze|ninde\s*washinze)/i,
    /^(about\s*(agribridge|you)|founders|idris|melody)$/i,
  ];
  if (identityPatterns.some((pattern) => pattern.test(clean))) {
    const isRw = language === 'rw';
    const answer = isRw
      ? `Ndi **AgriBridge AI — Umufasha Wawe mu Bumenyi bw'Ubuhinzi**!\n\nNaremewe gufasha abahinzi, aborozi n'abaguzi mu Rwanda kuri platform ya **AgriBridge Rwanda**, yashinzwe na **IDRIS & MELODY** bafite intego igira iti: *"Growing Together. Connecting Markets." (Dukurane. Twagure Amasoko).*\n\nIntego yanjye ni ukuguha amakuru yizewe ya RAB na MINAGRI, kugufasha gucunga imirima, kumenya ibiciro by'isoko no kugurisha nta bamamyi barimo — kandi bikora 100% niyo waba nta interineti ufite. Ni iki mwifuza ko dufatanya uyu munsi?`
      : `I am **AgriBridge AI — Your Farming Knowledge Companion**!\n\nI was created for **AgriBridge Rwanda**, proudly founded by **IDRIS & MELODY** with the foundational vision: *"Growing Together. Connecting Markets."*\n\nMy purpose is to walk alongside smallholder farmers, agronomists, and agribusiness buyers across Rwanda. I provide scientifically verified guidance (RAB & MINAGRI standards), transparent direct market access, and 100% offline-ready farming tools. How can I assist you with your farming journey today?`;

    return {
      entry: null,
      score: 10,
      confidence: 'high',
      formattedAnswer: answer,
      source: 'local_knowledge',
      matchedKeywords: ['founders', 'identity'],
      platformAction: {
        tab: 'marketplace',
        labelEn: 'Explore Marketplace by Idris & Melody',
        labelRw: 'Sura Isoko ryashinzwe na Idris & Melody',
      },
    };
  }

  // 4. THANK YOU / APPRECIATION
  const thanksPatterns = [
    /^(thank\s*you|thanks|thx|thank\s*you\s*so\s*much|thanks\s*a\s*lot|awesome|perfect)$/i,
    /^(urakoze|murakoze|urakoze\s*cyane|murakoze\s*cyane|mwakoze|n\'ibyiza)$/i,
  ];
  if (thanksPatterns.some((pattern) => pattern.test(clean))) {
    const isRw = language === 'rw';
    const answer = isRw
      ? `Murakaza neza cyane! Ni umunezero ukomeye gufatanya namwe guteza imbere ubuhinzi bwanyu. Umurima wanyu uzagire uburumbuke n'isoko ryiza! Buri gihe muzaze mwisanga igihe cyose mugize ikibazo.`
      : `You are very welcome! It's a true privilege to support your farm and harvest. May your crops be healthy and your harvest bountiful! Feel free to ask anytime you need guidance.`;

    return {
      entry: null,
      score: 10,
      confidence: 'high',
      formattedAnswer: answer,
      source: 'local_knowledge',
      matchedKeywords: ['gratitude'],
    };
  }

  // 5. CAPABILITIES / WHAT CAN YOU DO
  const capabilityPatterns = [
    /what\s*can\s*you\s*do|how\s*can\s*you\s*help|capabilities|features/i,
    /ushobora\s*gukora\s*iki|wamfasha\s*iki|agribridge\s*ifasha\s*ite/i,
  ];
  if (capabilityPatterns.some((pattern) => pattern.test(clean))) {
    const isRw = language === 'rw';
    const answer = isRw
      ? `Dore ibyo nshobora kugufasha nk'umufasha wawe mu buhinzi:\n\n1. **Ubuzima bw'Ibihingwa**: Baza ku bigori (nkongwa), ibishyimbo, ibirayi (miyirire), imyumbati (ububembe), umuceri, inyanya (bacterial wilt), n'ikawa.\n2. **Ubutaka n'Ifumbire**: Gukora ifumbire y'imborera yihuta, gukoresha ishwagara ku butaka busharira, n'umusemburo wa Rhizobium.\n3. **Amatungo n'Ubworozi**: Kurinda inka indwara y'amabere (mastite), kubika ubwatsi bwa silage mu mpeshyi, inkingo z'inkoko n'ihene.\n4. **Isoko rya AgriBridge**: Kwinjiza umusaruro ucuruza, kugenzura ibiciro no guhuzwa n'abaguzi bakuru.\n5. **Gucunga Imirima n'Imari**: Wandike itariki yo gutera, ugenzure intambwe z'igihingwa n'igitabo cy'imari (ledger).\n6. **Gukora Nta Nterineti (100% Offline)**: Nsubiza ibibazo byawe muri telefone yawe nubwo interineti yaba itagenda!\n\nNi ikihe cyiciro mushaka ko dutangiriraho uyu munsi?`
      : `Here is what I can assist you with as your farming companion:\n\n1. **Crop Health & Diagnosis**: Ask me about maize (fall armyworm), beans, potatoes (late blight), cassava (CBSD/mosaic), rice, tomatoes, and coffee.\n2. **Soil & Fertility**: Quick aerobic composting, lime (Ishwagara) for acidic soils, and Rhizobium bio-fertilizers.\n3. **Livestock & Dairy**: Cattle mastitis prevention, dry-season silage making in Nyagatare, poultry vaccines, and goat health.\n4. **Produce Marketplace**: Step-by-step guidance to list produce, evaluate buyer offers, and track delivery on AgriBridge.\n5. **Farm Plots & Finances**: Track growth stages from germination to maturity and calculate net profit in the Farm Finance Ledger.\n6. **100% Offline**: All core agricultural knowledge is stored locally on your device for immediate access anywhere.\n\nWhat would you like to explore today?`;

    return {
      entry: null,
      score: 10,
      confidence: 'high',
      formattedAnswer: answer,
      source: 'local_knowledge',
      matchedKeywords: ['capabilities'],
      platformAction: {
        tab: 'marketplace',
        labelEn: 'Visit AgriBridge Marketplace',
        labelRw: 'Sura Isoko rya AgriBridge',
      },
    };
  }

  // 6. FAREWELL
  const farewellPatterns = [
    /^(bye|goodbye|see\s*you|take\s*care|good\s*night)$/i,
    /^(murabeho|wirirwe|mwirirwe|mwirirwe\s*neza|igitondo\s*cyiza)$/i,
  ];
  if (farewellPatterns.some((pattern) => pattern.test(clean))) {
    const isRw = language === 'rw';
    const answer = isRw
      ? `Murabeho neza! Mugire umunsi mwiza n'ubuhinzi buhire. Nzakomeza kuba hano gufasha imirima yanyu igihe cyose.`
      : `Goodbye! Have a wonderful and productive day on the farm. I will be right here whenever you need agricultural guidance!`;

    return {
      entry: null,
      score: 10,
      confidence: 'high',
      formattedAnswer: answer,
      source: 'local_knowledge',
      matchedKeywords: ['farewell'],
    };
  }

  return null;
}

/**
 * Searches and ranks local agricultural knowledge entries based on query tokens.
 */
export function searchOfflineAgriKnowledge(
  query: string,
  language: 'en' | 'rw' = 'en',
  farmContext?: FarmContextData | null,
  personalize: boolean = true
): RetrievalResult {
  // Check for natural human conversational intent first
  const conversationalMatch = detectConversationalIntent(query, language, farmContext);
  if (conversationalMatch) {
    return conversationalMatch;
  }

  const queryTokens = tokenize(query);

  if (queryTokens.length === 0) {
    const emptyMsg =
      language === 'rw'
        ? 'Nyamuneka baza ikibazo cy\'ubuhinzi cyangwa icyerekeye AgriBridge, urugero: "Nigute narwanya nkongwa mu bigori?" cyangwa "Nigute nagurisha ibishyimbo ku isoko?"'
        : 'Please ask an agricultural or AgriBridge platform question, for example: "How do I control Fall Armyworm in maize?" or "How do I sell my harvested beans?"';
    return {
      entry: null,
      score: 0,
      confidence: 'none',
      formattedAnswer: emptyMsg,
      source: 'local_knowledge',
      matchedKeywords: [],
    };
  }

  let bestEntry: KnowledgeEntry | null = null;
  let bestScore = 0;
  let bestMatchedKeywords: string[] = [];

  for (const entry of AGRI_KNOWLEDGE_BASE) {
    let score = 0;
    const matched: string[] = [];

    // Target fields based on language and general metadata
    const questionText = (language === 'rw' ? entry.questionRw : entry.questionEn).toLowerCase();
    const altQuestionText = (language === 'rw' ? entry.questionEn : entry.questionRw).toLowerCase();
    const answerText = (language === 'rw' ? entry.directAnswerRw : entry.directAnswerEn).toLowerCase();
    const keywords = language === 'rw' ? [...entry.keywordsRw, ...entry.keywordsEn] : [...entry.keywordsEn, ...entry.keywordsRw];

    for (const token of queryTokens) {
      // Exact keyword match (High weight: 5 pts)
      if (keywords.some((k) => k.toLowerCase() === token || token.includes(k.toLowerCase()) || k.toLowerCase().includes(token))) {
        score += 5;
        matched.push(token);
      }
      // Question title match (Weight: 4 pts)
      else if (questionText.includes(token)) {
        score += 4;
        matched.push(token);
      }
      // Alt language question match (Weight: 2.5 pts)
      else if (altQuestionText.includes(token)) {
        score += 2.5;
        matched.push(token);
      }
      // Category / Topic match (Weight: 3 pts)
      else if (entry.category.toLowerCase().includes(token) || entry.topic.toLowerCase().includes(token)) {
        score += 3;
        matched.push(token);
      }
      // Answer body match (Weight: 1.5 pts)
      else if (answerText.includes(token)) {
        score += 1.5;
        matched.push(token);
      }
    }

    // Boost score if question matches user's recorded crops
    if (personalize && farmContext?.crops) {
      for (const crop of farmContext.crops) {
        if (entry.category.toLowerCase().includes(crop.toLowerCase())) {
          score += 2.0;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
      bestMatchedKeywords = Array.from(new Set(matched));
    }
  }

  // Determine confidence thresholds
  const isHighConfidence = bestScore >= 7;
  const isMediumConfidence = bestScore >= 3.5;

  if (!bestEntry || bestScore < 2.5) {
    // Unknown or low-matching query: Do not fabricate!
    const unknownMsg =
      language === 'rw'
        ? `Iki kibazo ntabwo kiraboneka mu bubiko bwa tekiniki bwo muri telefone (Offline Knowledge Base).

Icyo mwakora:
1. Gerageza kubaza mu yandi magambo yoroshye (urugero: "ibigori", "ibishyimbo", "imifuka ya PICS", "ifumbire", "kugurisha").
2. Niba ikibazo cyihutirwa ku burwayi bukomeye bw'ibihingwa cyangwa amatungo, gana Agronome w'Umurenge cyangwa muganga w'amatungo ukwegereye.
3. Kanda ku makarita y'ibibazo by'ingenzi biri hasi kugira ngo ubone ubumenyi bwizewe.`
        : `This specific inquiry is not yet indexed in the local offline knowledge base.

Recommended steps:
1. Try rephrasing with key agricultural terms (e.g., "maize", "beans", "soil fertility", "PICS bags", "pests", "marketplace").
2. For severe, acute crop disease or livestock health crises, please consult your local Sector Agronomist or Veterinary Officer directly.
3. You can also explore the quick question cards below for verified offline agricultural guidelines.`;

    return {
      entry: null,
      score: bestScore,
      confidence: 'none',
      formattedAnswer: unknownMsg,
      source: 'local_knowledge',
      matchedKeywords: bestMatchedKeywords,
    };
  }

  // Format the structured answer adhering to Section 12 requirements
  const isRw = language === 'rw';
  const directAns = isRw ? bestEntry.directAnswerRw : bestEntry.directAnswerEn;
  const causes = isRw ? bestEntry.causesRw : bestEntry.causesEn;
  const actions = isRw ? bestEntry.actionStepsRw : bestEntry.actionStepsEn;
  const precautions = isRw ? bestEntry.precautionsRw : bestEntry.precautionsEn;
  const expert = isRw ? bestEntry.expertConsultationRw : bestEntry.expertConsultationEn;

  let answerText = `**${isRw ? 'Igisubizo Nyacyo' : 'Direct Answer'}**\n${directAns}\n\n`;

  if (causes) {
    answerText += `**${isRw ? 'Ibishobora Kubitera' : 'What may be causing it'}**\n${causes}\n\n`;
  }

  if (actions && actions.length > 0) {
    answerText += `**${isRw ? 'Ibyo Umuhinzi Yakora (Intambwe z\'Ingenzi)' : 'What you can do (Recommended Steps)'}**\n`;
    actions.forEach((act, idx) => {
      answerText += `${idx + 1}. ${act}\n`;
    });
    answerText += '\n';
  }

  if (precautions) {
    answerText += `**${isRw ? 'Ibyo Kwitondera n\'Ibyago' : 'What to watch out for'}**\n${precautions}\n\n`;
  }

  if (expert) {
    answerText += `**${isRw ? 'Igihe cyo Kugana Umuhanga mu Buhinzi' : 'When to ask an agricultural expert'}**\n${expert}\n\n`;
  }

  // Note source verification
  answerText += `*${isRw ? 'Inkomoko y\'Ubumenyi' : 'Knowledge Source'}: ${bestEntry.source} (${bestEntry.lastReviewed})*`;

  // Add subtle personalization mention if used
  if (personalize && farmContext?.crops?.length) {
    const relevantCrop = farmContext.crops.find((c) => bestEntry?.category.toLowerCase().includes(c.toLowerCase()));
    if (relevantCrop) {
      const personalNote = isRw
        ? `\n\n*(Iki gisubizo cyitaweho hashingiwe ku murima wawe w'${relevantCrop} wanditswe muri AgriBridge)*`
        : `\n\n*(Tailored for your recorded ${relevantCrop} plot in ${farmContext.district || 'Rwanda'})*`;
      answerText += personalNote;
    }
  }

  return {
    entry: bestEntry,
    score: bestScore,
    confidence: isHighConfidence ? 'high' : isMediumConfidence ? 'medium' : 'low',
    formattedAnswer: answerText,
    source: 'local_knowledge',
    platformAction: bestEntry.platformAction,
    matchedKeywords: bestMatchedKeywords,
  };
}
