import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  Sparkles,
  ShieldAlert,
  Sprout,
  HelpCircle,
  FileText,
  Send,
  Eye,
  Info,
} from 'lucide-react';

interface CropProblemSolverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitToChat: (diagnosticSummary: string) => void;
}

export const CropProblemSolverModal: React.FC<CropProblemSolverModalProps> = ({
  isOpen,
  onClose,
  onSubmitToChat,
}) => {
  const { language } = useLanguage();
  const { farms, plots, currentUser } = useApp();

  const isRw = language === 'rw';

  // Step state (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [selectedCrop, setSelectedCrop] = useState<string>('Maize');
  const [district, setDistrict] = useState<string>(currentUser.district || 'Nyagatare');
  const [sector, setSector] = useState<string>(currentUser.sector || 'Nyagatare');
  const [growthStage, setGrowthStage] = useState<string>('Vegetative (Knee-high / Gukura)');
  const [affectedPart, setAffectedPart] = useState<string>('Leaves & Foliage');
  const [symptomsDescription, setSymptomsDescription] = useState<string>('');
  const [whenStarted, setWhenStarted] = useState<string>('Few days ago (2–4 days)');
  const [spreadScope, setSpreadScope] = useState<string>('Scattered patches in the field');
  const [recentRainOrInputs, setRecentRainOrInputs] = useState<string>('Normal rainfall, fertilizer applied');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  // Result state
  const [isGenerated, setIsGenerated] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<{
    summary: string;
    plausibleCauses: { name: string; likelihood: 'High' | 'Moderate' | 'Possible'; details: string }[];
    distinguishingSteps: string[];
    safeInitialActions: string[];
    whatToAvoid: string;
    expertConsultationTrigger: string;
    confidenceExplanation: string;
  } | null>(null);

  if (!isOpen) return null;

  const CROPS_LIST = [
    'Maize (Ibigori)',
    'Beans (Ibishyimbo by\'imishingiriro cyangwa ibigufi)',
    'Irish Potatoes (Ibirayi)',
    'Cassava (Imyumbati)',
    'Rice (Umuceri)',
    'Tomatoes (Inyanya)',
    'Cabbage (Amashu)',
    'Onions (Ibitunguru)',
    'Soybeans (Soya)',
    'Sorghum (Amasaka)',
    'Sweet Potatoes (Ibijumba)',
  ];

  const STAGES_LIST = [
    'Germination / Seedling (Kumera / Umushwi)',
    'Vegetative (Knee-high / Gukura)',
    'Flowering / Tasseling (Kurabyo)',
    'Fruiting / Pod Filling / Maturing (Kweza)',
    'Harvest Ready (Gusarura)',
  ];

  const PARTS_LIST = [
    'Leaves & Foliage (Ibibabi)',
    'Stems & Branches (Igiti cy\'urugori)',
    'Roots & Crown (Imizi yo hasi)',
    'Flowers, Pods & Fruit (Indabyo n\'Imbuto)',
    'Whole Plant Wilting (Igiti cyose cyuma)',
  ];

  const ONSET_LIST = [
    'Just started (1–2 days ago)',
    'Few days ago (3–5 days ago)',
    'Over a week ago',
    'Gradually worsening for weeks',
  ];

  const SCOPE_LIST = [
    'Only 1 or 2 isolated plants',
    'Scattered patches in the field',
    'Spreading along one contour or edge',
    'Widespread across the entire field (>50%)',
  ];

  const CONDITIONS_LIST = [
    'Recent heavy prolonged rain & ponding',
    'Severe heat & drought spell',
    'Recent chemical herbicide/pesticide spray',
    'Recent chemical fertilizer (Urea/DAP) top-dress',
    'Normal weather & regular weeding',
  ];

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Run Knowledge Diagnosis Logic
  const handleGenerateDiagnosis = () => {
    const descLower = symptomsDescription.toLowerCase();
    const cropLower = selectedCrop.toLowerCase();

    let causes: { name: string; likelihood: 'High' | 'Moderate' | 'Possible'; details: string }[] = [];
    let distinguishing: string[] = [];
    let initialActions: string[] = [];
    let whatToAvoid = '';
    let expertConsultation = '';
    let confidenceText = '';

    // Logic 1: Chewing / Holes / Armyworm
    if (descLower.includes('hole') || descLower.includes('chew') || descLower.includes('caterpillar') || descLower.includes('sawdust') || descLower.includes('nkongwa') || descLower.includes('inyo')) {
      causes = [
        {
          name: isRw ? 'Nkongwa idasanzwe (Fall Armyworm)' : 'Fall Armyworm (Spodoptera frugiperda)',
          likelihood: 'High',
          details: isRw
            ? 'Inyo zituruka mu magi y\'ikinyugunyugu zikirya umutima w\'ikigori zigasigamo imyanda nk\'urwengo.'
            : 'Voracious caterpillars feeding deep within the central leaf whorl leaving ragged windowpanes and frass.',
        },
        {
          name: isRw ? 'Inyo icukura ibiti (African Maize Stalk Borer)' : 'Maize Stalk Borer (Busseola fusca)',
          likelihood: 'Moderate',
          details: isRw
            ? 'Inyo icukura imbere mu giti cy\'urugori igatuma urugori ruvunika cyangwa ruzana imitwe y\'umweru.'
            : 'Larvae boring directly into the main stem producing dead-heart and lodging.',
        },
      ];
      distinguishing = [
        isRw
          ? 'Reba mu mutima w\'ikigori: niba inyo ifite amabara y\'umukara n\'utubuto 4 tw\'umukara ku murizo ni Fall Armyworm.'
          : 'Inspect the whorl: Fall armyworm larvae have an inverted "Y" shape on the head capsule and 4 raised dots forming a square on the tail.',
        isRw
          ? 'Reba igiti: niba gifite utwobo duto hasi ku giti gisohokamo ibishingwe ni Stalk borer.'
          : 'Check the lower stalk: Entry pinholes with expelled sawdust indicate internal stalk borer.',
      ];
      initialActions = [
        isRw
          ? 'Mu murima muto, shyira umucanga wumye uvanze n\'ivu mu mutima w\'ikigori kugira ngo wice inyo zikiri nto.'
          : 'For small plots, deposit a pinch of clean dry sand mixed with wood ash directly into the leaf whorl.',
        isRw
          ? 'Tera amazi yabanwemo amababi ya Neem cyangwa umuti wa Bt mu masaha ya mu gitondo kare cyangwa nimugoroba.'
          : 'Spray botanical Neem extract or registered bio-pesticides (Bt) during early morning or evening.',
      ];
      whatToAvoid = isRw
        ? 'Ntukigere utera umuti w\'uburozi ku manywa izuba riva kuko inyo ziba zihishe hasi cyane mu mutima.'
        : 'Do not spray chemical insecticides during hot midday sunlight when larvae are deep inside the whorl and beneficial predators are scorched.';
      expertConsultation = isRw
        ? 'Niba ibigori bifashwe birenze 20% by\'umurima, menyyesha Agronome w\'Umurenge kugira ngo hakorwe umuganda wo gutera umuti hamwe.'
        : 'Contact the Sector Agronomist if pest incidence exceeds 20% of plants for collective neighborhood spraying.';
      confidenceText = isRw
        ? 'Icyizere: Kiringaniye (Moderate). Birasaba gufungura umutima w\'ikigori ukareba inyo nyirizina.'
        : 'Confidence: Moderate. Requires physically inspecting the inner whorl to confirm caterpillar species.';
    }
    // Logic 2: Yellow Leaves / Chlorosis
    else if (descLower.includes('yellow') || descLower.includes('umuhondo') || descLower.includes('pale') || descLower.includes('chlorosis')) {
      causes = [
        {
          name: isRw ? 'Kubura Azote (Nitrogen Deficiency)' : 'Nitrogen Deficiency',
          likelihood: 'High',
          details: isRw
            ? 'Umuhondo utangirira ku mutwe w\'ikibabi mu ishusho ya "V" ku bibabi bikuze byo hasi.'
            : 'V-shaped chlorosis starting at leaf tips of older, lower leaves while top leaves remain greener.',
        },
        {
          name: isRw ? 'Amazi Menshi no Kubura Umwuka w\'Imizi (Waterlogging)' : 'Waterlogging & Root Suffocation',
          likelihood: 'Moderate',
          details: isRw
            ? 'Ubutaka buretse amazi butuma imizi itabasha guhumeka bigatuma igihingwa cyose gisa n\'icyerurutse.'
            : 'Poor drainage saturating root zones, cutting off oxygen and blocking all nutrient uptake.',
        },
        {
          name: isRw ? 'Indwara ya Virusi ya MLND cyangwa Mosaic' : 'Viral Infection (MLND / Mosaic)',
          likelihood: 'Possible',
          details: isRw
            ? 'Amabara y\'uruvange ku bibabi bishya byo hejuru n\'amababi yihinahina.'
            : 'Mottled chlorotic striping spreading to young leaves with stunted growth.',
        },
      ];
      distinguishing = [
        isRw
          ? 'Reba aho umuhondo uri: niba ari hasi ku bibabi bikuze ni Azote; niba ari hejuru mu mutima bishobora kuba virusi cyangwa sulfur.'
          : 'Check leaf position: bottom leaves = mobile nitrogen deficiency; top young leaves = immobile sulfur/iron or viral disease.',
        isRw
          ? 'Genzura ubutaka: niba buretsemo ibyondo n\'amazi, imizi iratosekaje nta mwuka ifite.'
          : 'Inspect soil moisture: if soil is soggy, roots are drowning and cannot feed.',
      ];
      initialActions = [
        isRw
          ? 'Cukura imiferege yohereza amazi hanze y\'umurima niba amazi yararetse.'
          : 'Dig drainage channels to shed standing water immediately if soil is waterlogged.',
        isRw
          ? 'Niba ubutaka buhehereye neza kandi ibibabi byo hasi ari byo by\'umuhondo, shyiramo ifumbire ya Urea mu ntege z\'ibigori.'
          : 'If soil is moist and yellowing is on lower leaves, side-dress with Urea at knee-high stage.',
      ];
      whatToAvoid = isRw
        ? 'Ntukigere ushyira ifumbire ya Urea mu murima urimo ibyondo birenze kuko itwika imizi yarwaye.'
        : 'Do NOT apply chemical nitrogen fertilizer into stagnant mud; saturated roots cannot absorb it and will suffer root scorch.';
      expertConsultation = isRw
        ? 'Hamagara Agronome w\'Umurenge niba umuhondo urimo amababi yumye ku mpera zayo kuko bishobora kuba MLND.'
        : 'Call the Sector Agronomist if entire plots show dead leaf margins or rapid viral spread.';
      confidenceText = isRw
        ? 'Icyizere: Kiringaniye (Moderate). Banza ucukure imizi urebe ko idafite inzoka z\'ubutaka cyangwa kubora.'
        : 'Confidence: Moderate. Must rule out root-knot nematodes and severe root rot before final diagnosis.';
    }
    // Logic 3: Wilting / Sudden death
    else if (descLower.includes('wilt') || descLower.includes('kuma') || descLower.includes('die') || descLower.includes('rot') || descLower.includes('gupfa')) {
      causes = [
        {
          name: isRw ? 'Indwara y\'Ubutaka ya Bacterial Wilt' : 'Bacterial Wilt (Ralstonia solanacearum)',
          likelihood: 'High',
          details: isRw
            ? 'Igiti cyuma kigitoshye ku manywa izuba riva; nta muti w\'uruganda uyikiza.'
            : 'Sudden daytime wilting while foliage remains green; vascular bundles plugged with bacteria.',
        },
        {
          name: isRw ? 'Indwara y\'Imiyege ya Fusarium cyangwa Late Blight' : 'Fungal Root / Crown Rot (Fusarium / Late Blight)',
          likelihood: 'Moderate',
          details: isRw
            ? 'Imizi cyangwa igiti cyo hasi kizana ibara ryirabura rikabye amababi akabora.'
            : 'Dark necrotic water-soaked lesions near soil line rotting the stem base.',
        },
      ];
      distinguishing = [
        isRw
          ? 'Caca igiti cyo hasi ugishyire mu kirahure cy\'amazi asukuye: niba hasohotsemo imirongo myera nk\'amata ni Bacterial Wilt.'
          : 'Perform Stem Glass Test: submerge a cut lower stem in clear water; white milky streaming confirms Bacterial Wilt.',
      ];
      initialActions = [
        isRw
          ? 'Randura igiti cyose uruhambe mu rwobo runini cyangwa ugitwike; ntukagishyire mu mborera.'
          : 'Immediately uproot and deeply bury or burn infected plants with attached root soil; do NOT compost.',
        isRw
          ? 'Hagarika kuhira kuko amazi atemba akwirakwiza bagiteri ku yindi myaka mizima.'
          : 'Improve drainage and avoid surface runoff spreading contaminated water between rows.',
      ];
      whatToAvoid = isRw
        ? 'Ntukagure umuti wo gutera ku mababi ngo ukize bacterial wilt kuko nta muti uyivura mu giti cyafashwe.'
        : 'Do NOT spray expensive foliar fungicides on bacterial wilt; chemicals cannot cure blocked vascular tissue.',
      expertConsultation = isRw
        ? 'Menyesha Agronome w\'Umurenge agufashe kubona imbuto zizewe zihanganira iyi ndwara (resistant varieties).'
        : 'Consult your Sector Agronomist for certified wilt-resistant hybrid rootstocks for future planting seasons.';
      confidenceText = isRw
        ? 'Icyizere: Cyizewe cyane (High) niba igiti cyuma kigitoshye nta kibabi cyumye mbere.'
        : 'Confidence: High if green leaves are wilting under sun; perform the clear water stem test to confirm.';
    }
    // Default Fallback Logic
    else {
      causes = [
        {
          name: isRw ? 'Kunanirwa n\'Ikirere cyangwa Ubutaka (Abiotic Stress)' : 'Abiotic Environmental Stress',
          likelihood: 'High',
          details: isRw
            ? 'Izuba rikaze, kubura amazi ahagije, cyangwa ubutaka busharira burenze urugero.'
            : 'Moisture fluctuations, soil compaction, or nutrient lock caused by high acidity.',
        },
        {
          name: isRw ? 'Icyiciro cya Mbere cy\'Udukoko cyangwa Indwara' : 'Early Stage Pest or Fungal Infection',
          likelihood: 'Moderate',
          details: isRw
            ? 'Icyiciro cyo gutangira cy\'indwara z\'amababi cyangwa udukoko duto tunyunyuza.'
            : 'Emerging fungal leaf spot or microscopic sap-sucking insect feeding.',
        },
      ];
      distinguishing = [
        isRw
          ? 'Suzuma munsi y\'amababi niba hari udukoko duto cyangwa ifu yera n\'ingese.'
          : 'Check undersides of leaves using a magnifying glass for tiny mites, aphids, or fungal spores.',
      ];
      initialActions = [
        isRw
          ? 'Komeza gukurikirana umurima buri minsi 2 wandike uko ibimenyetso bihinduka.'
          : 'Monitor daily for 48 hours to determine if symptoms spread to neighboring plants.',
      ];
      whatToAvoid = isRw
        ? 'Ntukihutire kugura imiti ihenze utazi neza icyateye ikibazo.'
        : 'Do not rush to purchase unverified agro-chemicals before identifying the root cause.',
      expertConsultation = isRw
        ? 'Fata ifoto cyangwa icyitegererezo cy\'igiti ukijyane kwa Agronome w\'Umurenge agisuzume.'
        : 'Bring a fresh physical plant sample with roots in a paper bag to your Sector Agronomist.',
      confidenceText = isRw
        ? 'Icyizere: Gikomeje gukenera ubugenzuzi bwo mu murima (Requires Field Inspection).'
        : 'Confidence: Preliminary advisory. On-site physical inspection is strongly recommended.';
    }

    const summaryText = isRw
      ? `Isuzuma ry\'igihingwa cya ${selectedCrop} mu Murenge wa ${sector} (${growthStage}), igice cyafashwe: ${affectedPart}. Ibimenyetso byatangiye ${whenStarted}, bikwirakwiriye: ${spreadScope}.`
      : `Preliminary diagnostic assessment for ${selectedCrop} in ${sector}, ${district} at ${growthStage}. Part affected: ${affectedPart}. Onset: ${whenStarted}. Extent: ${spreadScope}.`;

    setDiagnosisResult({
      summary: summaryText,
      plausibleCauses: causes,
      distinguishingSteps: distinguishing,
      safeInitialActions: initialActions,
      whatToAvoid,
      expertConsultationTrigger: expertConsultation,
      confidenceExplanation: confidenceText,
    });

    setIsGenerated(true);
  };

  const handleSendToAiChat = () => {
    if (!diagnosisResult) return;
    const chatPayload =
      `**Crop Problem Diagnostic Report:**\n` +
      `- **Crop:** ${selectedCrop}\n` +
      `- **Location:** ${sector}, ${district}\n` +
      `- **Growth Stage:** ${growthStage}\n` +
      `- **Affected Part:** ${affectedPart}\n` +
      `- **Symptoms:** ${symptomsDescription || 'Not specified'}\n` +
      `- **Onset & Spread:** ${whenStarted} (${spreadScope})\n` +
      `- **Environmental Conditions:** ${recentRainOrInputs}\n` +
      `- **Plausible Causes Identified:** ${diagnosisResult.plausibleCauses.map((c) => `${c.name} (${c.likelihood})`).join(', ')}\n` +
      `- **Confidence:** ${diagnosisResult.confidenceExplanation}\n\n` +
      `Please provide deeper follow-up guidance on this crop problem and explain what AgriBridge features or suppliers can help.`;

    onSubmitToChat(chatPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-50">
                {isRw ? 'Ubufasha bwo Gusuzuma Uburwayi bw\'Igihingwa' : 'Guided Crop Problem Diagnostic Assistant'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isRw ? 'Inzira yoroshye yo kumenya icyangiza imyaka yawe' : 'Step-by-step agricultural troubleshooting for Rwandan farmers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!isGenerated && (
          <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-stone-400 border-b border-stone-100 dark:border-stone-800 pb-3">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex-1 flex items-center gap-1.5 pb-1 border-b-2 transition-all ${
                  currentStep === stepNum
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400'
                    : currentStep > stepNum
                    ? 'border-emerald-500/40 text-stone-600'
                    : 'border-transparent text-stone-300 dark:text-stone-700'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px]">
                  {stepNum}
                </span>
                <span className="hidden sm:inline">
                  {stepNum === 1
                    ? isRw ? 'Igihingwa' : 'Crop'
                    : stepNum === 2
                    ? isRw ? 'Intambwe' : 'Stage'
                    : stepNum === 3
                    ? isRw ? 'Ibimenyetso' : 'Symptoms'
                    : isRw ? 'Ifoto' : 'Review'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Wizard Steps */}
        {!isGenerated ? (
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Step 1: Crop and Location */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block mb-1">
                    {isRw ? '1. Hitamo Igihingwa n\'Umurenge' : '1. Select Your Crop & Location'}
                  </span>
                  <p className="text-xs text-stone-500">
                    {isRw
                      ? 'Hitamo igihingwa ufitiye ikibazo n\'umurenge uherereyemo kugira ngo uhuzwe n\'ikirere cyawo.'
                      : 'Choose which crop is facing difficulty and your local sector for microclimate context.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Igihingwa (Crop):' : 'Crop:'}
                  </label>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {CROPS_LIST.map((crop, idx) => (
                      <option key={idx} value={crop}>
                        {crop}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRw ? 'Akarere (District):' : 'District:'}
                    </label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRw ? 'Umurenge (Sector):' : 'Sector:'}
                    </label>
                    <input
                      type="text"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Growth Stage & Part Affected */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? '2. Igihingwa Kigeze ku yihe Ntambwe?' : '2. What Growth Stage is the Crop In?'}
                  </label>
                  <select
                    value={growthStage}
                    onChange={(e) => setGrowthStage(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {STAGES_LIST.map((stage, idx) => (
                      <option key={idx} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Ni ikihe gice cy\'igihingwa kigaragaraho ikibazo?' : 'Which plant part is visibly affected?'}
                  </label>
                  <select
                    value={affectedPart}
                    onChange={(e) => setAffectedPart(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    {PARTS_LIST.map((part, idx) => (
                      <option key={idx} value={part}>
                        {part}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Symptoms Description, Onset & Extent */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Sobanura uko ibimenyetso bimeze:' : 'Describe the symptoms you see:'}
                  </label>
                  <textarea
                    rows={3}
                    value={symptomsDescription}
                    onChange={(e) => setSymptomsDescription(e.target.value)}
                    placeholder={
                      isRw
                        ? 'Urugero: "Ibibabi byo hasi birasa n\'umuhondo nka V", "Umutima w\'urugori uraribwa harimo urwengo", cyangwa "Inyanya ziruma zikiri icyatsi kibisi ku manywa"...'
                        : 'e.g. "Lower leaves have yellow V-shapes", "Holes and sawdust in maize whorl", "Plants suddenly wilt under midday sun while leaves are green"...'
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRw ? 'Iki kibazo cyatangiye ryari?' : 'When did it start?'}
                    </label>
                    <select
                      value={whenStarted}
                      onChange={(e) => setWhenStarted(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                    >
                      {ONSET_LIST.map((onset, idx) => (
                        <option key={idx} value={onset}>
                          {onset}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      {isRw ? 'Uko cyakwirakwiriye mu murima:' : 'Spread across field:'}
                    </label>
                    <select
                      value={spreadScope}
                      onChange={(e) => setSpreadScope(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                    >
                      {SCOPE_LIST.map((scope, idx) => (
                        <option key={idx} value={scope}>
                          {scope}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Ikirere cyangwa ifumbire/umuti byakoreshejwe vuba:' : 'Recent weather, rain, or chemical inputs:'}
                  </label>
                  <select
                    value={recentRainOrInputs}
                    onChange={(e) => setRecentRainOrInputs(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                  >
                    {CONDITIONS_LIST.map((cond, idx) => (
                      <option key={idx} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 4: Optional Photo Upload & Review */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-2">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 block">
                    {isRw ? 'Shyiraho Ifoto (Bishoboka ariko si itegeko)' : 'Attach Photo for Visual Inspection (Optional)'}
                  </span>
                  <p className="text-xs text-stone-500">
                    {isRw
                      ? 'Niba ufite ifoto ifotowe neza igaragaza ikibabi cyangwa igiti, yishyireho kugira ngo ifashe mu isuzuma.'
                      : 'A clear photo showing the leaf underside, stem cross-section, or affected fruit enhances diagnosis accuracy.'}
                  </p>

                  <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-dashed border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 font-bold text-xs hover:bg-stone-50 cursor-pointer">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>{photoDataUrl ? (isRw ? 'Hindura Ifoto' : 'Change Photo') : (isRw ? 'Hitamo Ifoto muri Telefone' : 'Select Photo')}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>

                  {photoDataUrl && (
                    <div className="mt-2 relative w-32 h-32 rounded-xl overflow-hidden border border-emerald-500 shadow-xs">
                      <img src={photoDataUrl} alt="Crop issue preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotoDataUrl(null)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Summary of inputs */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 text-xs space-y-1.5 text-stone-700 dark:text-stone-300">
                  <span className="font-bold text-emerald-900 dark:text-emerald-300 block">
                    {isRw ? 'Incamake y\'Ibyo Wanditse:' : 'Diagnostic Summary Checklist:'}
                  </span>
                  <p><strong>Crop:</strong> {selectedCrop} ({growthStage})</p>
                  <p><strong>Affected Part:</strong> {affectedPart}</p>
                  <p><strong>Scope:</strong> {spreadScope}</p>
                </div>
              </div>
            )}

            {/* Bottom Nav Buttons */}
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isRw ? 'Subira Inyuma' : 'Back'}</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-xs cursor-pointer"
                >
                  <span>{isRw ? 'Komeza' : 'Next Step'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleGenerateDiagnosis}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>{isRw ? 'Tanga Isuzuma ry\'Uburwayi' : 'Generate Diagnostic Advisory'}</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Diagnosis Output View (Part 6 requirements) */
          <div className="space-y-5 text-xs sm:text-sm text-stone-800 dark:text-stone-200 animate-in fade-in duration-300">
            {/* 1. Summary of observed problem */}
            <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <span className="text-[10px] font-bold uppercase text-stone-500 block mb-1">
                1. {isRw ? 'Incamake y\'Ikibazo Cyagaragaye' : 'Summary of Observed Crop Issue'}
              </span>
              <p className="font-semibold text-stone-900 dark:text-stone-100">
                {diagnosisResult?.summary}
              </p>
            </div>

            {/* 2. Plausible Causes */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-stone-900 dark:text-stone-100 block">
                2. {isRw ? 'Ibishobora Kuba Byabiteye (Plausible Causes)' : 'Plausible Causes & Likelihood'}
              </span>
              <div className="space-y-2">
                {diagnosisResult?.plausibleCauses.map((cause, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 dark:text-emerald-300">
                        {cause.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          cause.likelihood === 'High'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600'
                        }`}
                      >
                        {cause.likelihood} Likelihood
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300">{cause.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. How to Distinguish */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1.5">
              <span className="text-xs font-bold uppercase text-blue-900 dark:text-blue-300 block">
                3. {isRw ? 'Uko Watandukanya Ibyabiteye mu Murima' : 'How to Distinguish Between Them in the Field'}
              </span>
              <ul className="list-disc pl-5 space-y-1 text-xs text-blue-950 dark:text-blue-200">
                {diagnosisResult?.distinguishingSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            {/* 4. Safe Initial Actions */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase text-stone-900 dark:text-stone-100 block">
                4. {isRw ? 'Intambwe Zihariye Zo Gukora Ako Kanya' : 'Safe Initial Practical Actions'}
              </span>
              <ol className="list-decimal pl-5 space-y-1 text-xs">
                {diagnosisResult?.safeInitialActions.map((act, idx) => (
                  <li key={idx}>{act}</li>
                ))}
              </ol>
            </div>

            {/* 5. What to Avoid */}
            {diagnosisResult?.whatToAvoid && (
              <div className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/60 text-xs text-red-950 dark:text-red-200">
                <strong className="block mb-0.5 text-red-900 dark:text-red-300 uppercase">
                  5. {isRw ? 'Ibyo Kwirinda' : 'What to Avoid & Safety Warning'}:
                </strong>
                {diagnosisResult.whatToAvoid}
              </div>
            )}

            {/* 6. Expert Consultation Trigger */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300">
              <strong className="block mb-0.5 uppercase text-stone-900 dark:text-stone-100">
                6. {isRw ? 'Igihe cyo Kwitabaza Umuhanga' : 'When to Contact Sector Agronomist'}:
              </strong>
              {diagnosisResult?.expertConsultationTrigger}
            </div>

            {/* 7. Confidence & Uncertainty Statement */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 text-[11px] text-amber-900 dark:text-amber-300 flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <strong>{isRw ? 'Ubusobanuro ku Cyizere cy\'Isuzuma:' : 'Scientific Confidence & Uncertainty Notice:'}</strong>{' '}
                {diagnosisResult?.confidenceExplanation} (AgriBridge AI never claims an unverified field diagnosis is 100% certain without physical laboratory or extension inspection).
              </div>
            </div>

            {/* Transfer to AI Chat & Done Buttons */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleSendToAiChat}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors shadow-md cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRw ? 'Ohereza Ibi Bisubizo muri AgriBridge AI' : 'Transfer Diagnosis to AgriBridge AI Chat'}</span>
              </button>

              <button
                onClick={() => {
                  setIsGenerated(false);
                  setCurrentStep(1);
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 cursor-pointer"
              >
                {isRw ? 'Ongera Ususume Bushya' : 'Start New Diagnosis'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
