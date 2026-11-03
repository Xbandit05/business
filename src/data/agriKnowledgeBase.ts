/**
 * AgriBridge Rwanda — Verified Agricultural & Platform Knowledge Base
 * Designed to provide 100% offline agricultural guidance for Rwandan smallholder farmers.
 * Sources: Rwanda Agriculture and Animal Resources Development Board (RAB), MINAGRI, FAO, ICIPE, CABI.
 */

export interface KnowledgeEntry {
  id: string;
  topic:
    | 'crop_production'
    | 'soil_health'
    | 'soil_preparation'
    | 'planting_spacing'
    | 'seed_selection'
    | 'fertilizer_management'
    | 'organic_farming'
    | 'irrigation'
    | 'weed_management'
    | 'pest_management'
    | 'crop_diseases'
    | 'harvesting'
    | 'post_harvest'
    | 'storage'
    | 'livestock'
    | 'poultry'
    | 'farm_budgeting'
    | 'agricultural_marketing'
    | 'climate_smart'
    | 'sustainable_farming'
    | 'rwanda_guidance'
    | 'platform_usage';
  category: string; // e.g. 'maize', 'beans', 'potatoes', 'cassava', 'rice', 'tomatoes', 'cattle', 'poultry', 'agribridge'
  questionEn: string;
  questionRw: string;
  directAnswerEn: string;
  directAnswerRw: string;
  causesEn?: string;
  causesRw?: string;
  actionStepsEn: string[];
  actionStepsRw: string[];
  precautionsEn?: string;
  precautionsRw?: string;
  expertConsultationEn?: string;
  expertConsultationRw?: string;
  keywordsEn: string[];
  keywordsRw: string[];
  locationContext?: string; // e.g. 'Nyagatare & Eastern Savanna', 'Highland Volcanic Zones', 'Marshland/Igishanga', 'All Rwanda'
  source: string; // e.g. 'RAB Extension Guide 2025/2026', 'MINAGRI National Guidelines'
  lastReviewed: string;
  platformAction?: {
    tab: 'farmer' | 'marketplace' | 'offers' | 'orders' | 'finance' | 'directory' | 'training' | 'weather' | 'agent' | 'admin';
    labelEn: string;
    labelRw: string;
    actionType?: 'navigate' | 'open_modal';
    modalTarget?: 'farm' | 'plot' | 'listing';
  };
}

export const AGRI_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // --- SOIL HEALTH & PREPARATION ---
  {
    id: 'soil-fertility-01',
    topic: 'soil_health',
    category: 'soil',
    questionEn: 'How do I improve soil fertility naturally?',
    questionRw: 'Nigute nateza imbere uburumbuke bw\'ubutaka mu buryo bwa kamere?',
    directAnswerEn: 'Soil fertility is best restored by combining well-cured animal manure, compost, crop rotation with legumes (beans/soya), and liming acid soils.',
    directAnswerRw: 'Uburumbuke bw\'ubutaka bwongerwa no gukoresha ifumbire y\'imborera iboze neza, compost, gusimburanya ibihingwa n\'ibinyamisogwe, no gushyiramo ifumbire y\'ishwagara ku butaka busharira.',
    causesEn: 'Continuous cropping without returning biomass depletes nitrogen, phosphorus, and organic matter, causing hardpan and nutrient lock.',
    causesRw: 'Guhinga ubudahagarara udasubizamo ifumbire bitera kubura kwa azote, fosifore n\'imyunyungugu, bigatuma ubutaka bucika intege.',
    actionStepsEn: [
      'Apply 10–15 tonnes per hectare of well-decomposed farmyard manure or compost during land preparation.',
      'Rotate heavy feeders like maize with leguminous crops (climbing beans or soybeans) which fix atmospheric nitrogen.',
      'In high-rainfall sloping areas, plant agroforestry trees (Calliandra, Leucaena) along contours to stop erosion.',
      'For acidic soils (pH < 5.5 common in Northern/Southern Rwanda), apply agricultural lime (Ishwagara) 2-4 weeks before planting as advised by RAB.',
    ],
    actionStepsRw: [
      'Shyiramo toni 10–15 za manyire iboze neza kuri hegitari imwe mu gihe cyo guhinga.',
      'Simburanya ibihingwa nk\'ibigori n\'ibinyamisogwe (ibishyimbo cyangwa soya) bifata azote mu kirere.',
      'Ku misozi ihanamye, tera ibiti birinda isuri (Calliandra, Leucaena) ku materasi.',
      'Ku butaka busharira (pH < 5.5), shyiramo ishwagara ibyumweru 2 kugeza kuri 4 mbere yo gutera nk\'uko RAB ibiteganya.',
    ],
    precautionsEn: 'Never apply unfermented raw manure directly onto seeds or young roots, as the heat and ammonia will scorch root hair.',
    precautionsRw: 'Wirinda gushyira ifumbire itaboze ku mbuto kuko ubushyuhe bwayo bwatwika imizi y\'urugori.',
    expertConsultationEn: 'Request an agro-dealer soil test or contact the Sector Agronomist if your crops consistently remain stunted despite manure application.',
    expertConsultationRw: 'Baza Agronome w\'Umurenge cyangwa abashinzwe ubuhinzi niba ibihingwa bikomeza gukendera nubwo washyizemo ifumbire.',
    keywordsEn: ['soil', 'fertility', 'manure', 'compost', 'nitrogen', 'lime', 'acidic', 'erosion', 'fertilizer'],
    keywordsRw: ['ubutaka', 'uburumbuke', 'ifumbire', 'imborera', 'ishwagara', 'isuri', 'azote', 'compost'],
    locationContext: 'All Rwanda (Nyagatare, Eastern, Southern & Northern)',
    source: 'RAB Integrated Soil Fertility Management Guidelines',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Lime & Fertilizer Suppliers',
      labelRw: 'Shaka Abacuruzi b\'Ishwagara n\'Ifumbire',
    },
  },

  // --- CROP PRODUCTION: MAIZE ---
  {
    id: 'maize-yellow-leaves-02',
    topic: 'crop_diseases',
    category: 'maize',
    questionEn: 'What causes yellow leaves on maize crops?',
    questionRw: 'Ni iki gitera ibibabi by\'ibigori guhinduka umuhondo?',
    directAnswerEn: 'Yellowing in maize is primarily caused by nitrogen deficiency (V-shaped yellowing starting on older bottom leaves), waterlogging, or Maize Lethal Necrosis Disease (MLND).',
    directAnswerRw: 'Umuhondo ku bibabi by\'ibigori uterwa ahanini no kubura azote (V-shape ku bibabi byo hasi), amazi arenze mu butaka, cyangwa indwara y\'ibigori ya MLND.',
    causesEn: '1. Nitrogen deficiency: Yellowing starts at leaf tips along the midrib in an inverted "V" shape on lower leaves.\n2. Waterlogging: Poor drainage suffocate roots, preventing nutrient uptake.\n3. MLND virus: Mottled chlorotic striping spreading to young leaves with dying leaf margins.',
    causesRw: '1. Kubura azote: Umuhondo utangirira ku mutwe w\'ikibabi mu ishusho ya "V" ku bibabi byo hasi.\n2. Amazi menshi: Ubutaka buretse amazi butuma imizi itabasha guhumeka no gufata ibiryo.\n3. Indwara ya MLND: Ibibabi bishya biramurika bikagira amabara y\'uruvange.',
    actionStepsEn: [
      'Check leaf pattern: If lower leaves have yellow V-shapes, side-dress with Urea at knee-high stage (4–6 weeks after planting) during moist soil.',
      'Ensure proper drainage channels if water is ponding in the plot.',
      'If young whorl leaves show mottled streaks and severe necrosis, uproot and bury affected plants immediately to prevent viral spread by vector insects.',
    ],
    actionStepsRw: [
      'Reba imiterere y\'ikibabi: Niba ari "V" ku bibabi byo hasi, shyiramo ifumbire ya Urea mu gihe ibigori bigeze mu ntege.',
      'Cukura imiferege yohereza amazi hanze y\'umurima niba amazi yararetse.',
      'Niba ibibabi bishya byumye bikaba amabara atangaje, kuramo ibyo bigori ubitwike cyangwa ubihambe kuko bishobora kuba indwara ya MLND.',
    ],
    precautionsEn: 'Do not apply Urea to dry soil under scorching sunlight; apply during evening or before expected rain to avoid volatile nitrogen loss.',
    precautionsRw: 'Ntugashyire Urea mu butaka bwumye izuba riva kuko ihita yuka mu mwuka ikaba imfabusa.',
    expertConsultationEn: 'If multiple plots show rapid yellowing and leaf-edge death across the village, notify the RAB Sector Extension Worker immediately.',
    expertConsultationRw: 'Niba imirima myinshi yafashwe n\'umuhondo ukwirakwira vuba, menyyesha Agronome w\'Umurenge ako kanya.',
    keywordsEn: ['maize', 'yellow', 'leaves', 'nitrogen', 'urea', 'mlnd', 'disease', 'chlorosis', 'ibigori'],
    keywordsRw: ['ibigori', 'umuhondo', 'ibibabi', 'azote', 'urea', 'indwara', 'amazi', 'umurima'],
    locationContext: 'Eastern Province (Nyagatare, Gatsibo) & Bugesera',
    source: 'RAB Maize Production Manual 2025/2026',
    lastReviewed: '2026-01-20',
    platformAction: {
      tab: 'farmer',
      labelEn: 'Check Plot Crop Cycle Stage',
      labelRw: 'Reba Igihe Ibigori Bigezemo mu Murima',
    },
  },

  // --- PEST MANAGEMENT: FALL ARMYWORM ---
  {
    id: 'pest-fall-armyworm-03',
    topic: 'pest_management',
    category: 'maize',
    questionEn: 'How can I control Fall Armyworm in my maize crops?',
    questionRw: 'Nigute narwanya nkongwa idasanzwe (Fall Armyworm) mu bigori?',
    directAnswerEn: 'Control Fall Armyworm (Nkongwa) early when caterpillars are small by regular scouting, physical handpicking, biological neem sprays, sand/ash in whorls, or certified insecticides approved by RAB.',
    directAnswerRw: 'Kurwanya Nkongwa bikorwa hakiri kare isuzuma rikorwa kabiri mu cyumweru, gutoragura inyo zikiri nto, gushyiramo umunyu w\'ivu cyangwa umucanga mu mutima w\'ikigori, n\'imiti yemewe na RAB.',
    causesEn: 'Spodoptera frugiperda moths lay egg masses under leaves. Hatched larvae enter the leaf whorl and devour young leaf shoots, leaving ragged holes and sawdust-like frass.',
    causesRw: 'Ikinyugunyugu gitera amagi munsi y\'ibibabi; inyo zikivuka zinjira mu mutima w\'ikigori zikirya zigasigamo ibishingwe bimeze nk\'urwengo.',
    actionStepsEn: [
      'Scout your field twice a week in early morning: look for small pinholes and dark sawdust-like frass inside the plant whorl.',
      'Cultural method for small plots: Place a pinch of clean dry sand mixed with wood ash directly into the center leaf whorl to desiccate young larvae.',
      'Spray early morning (6:00-8:00 AM) or evening (5:00-7:00 PM) when caterpillars come out of the whorl to feed.',
      'Use RAB-registered bio-pesticides or recommended active ingredients (e.g. Spinetoram, Emamectin benzoate) rotated to prevent resistance.',
    ],
    actionStepsRw: [
      'Suzuma umurima kabiri mu cyumweru mu gitondo: reba uutwobo duto n\'imyanda y\'urwengo mu mutima w\'urugori.',
      'Uburyo bwa kera: Fata umunyu w\'ivu uvanze n\'umucanga wumye uwushyire mu mutima w\'ikigori kugira ngo wice inyo zikiri nto.',
      'Tera umuti mu gitondo kare (saa 12–saa 2 z\'igitondo) cyangwa nimugoroba (saa 11–saa 1 z\'umugoroba) kuko aribwo inyo zirasohoka.',
      'Koresha imiti yemewe na RAB ukoresheje ibipimo byanditswe ku icupa.',
    ],
    precautionsEn: 'Always wear protective gear (gloves, face mask, gumboots) when spraying. Never wash spray equipment near water sources or livestock grazing areas.',
    precautionsRw: 'Igihe cyose wambare ibirinda uburozi (amasogisi, agapfukamunwa, bote) mu gihe utera umuti. Ntukakarabire hafi y\'amazi y\'inka n\'abantu.',
    expertConsultationEn: 'When pest damage exceeds 20% of plants in vegetative stage, contact the Community Agent or Sector Agronomist for collective neighborhood spraying.',
    expertConsultationRw: 'Niba nkongwa irenze 20% by\'umurima, vugana n\'Umujyanama w\'Ubuhinzi (Community Agent) kugira ngo mutere umuti hamwe mu mudugudu.',
    keywordsEn: ['fall armyworm', 'nkongwa', 'caterpillar', 'maize pest', 'spray', 'ash', 'scouting'],
    keywordsRw: ['nkongwa', 'inyo', 'ibigori', 'umuti', 'ivu', 'umucanga', 'agronome'],
    locationContext: 'Eastern Province, Nyagatare, Bugesera, Kamonyi',
    source: 'RAB & FAO Fall Armyworm Integrated Pest Management Guidelines',
    lastReviewed: '2026-02-01',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Agro-Chemical Suppliers',
      labelRw: 'Shaka Abacuruzi b\'Imiti Yemewe',
    },
  },

  // --- CROP PRODUCTION: BEANS ---
  {
    id: 'beans-pest-and-storage-04',
    topic: 'post_harvest',
    category: 'beans',
    questionEn: 'How should I store harvested beans to prevent weevil damage?',
    questionRw: 'Nigute nabika ibishyimbo byeze ngo bitaribwa n\'udusimba (imungu)?',
    directAnswerEn: 'Thoroughly sun-dry beans until moisture is below 13% (tested by biting or salt-in-jar test), then store in airtight hermetic PICS bags without chemical powders.',
    directAnswerRw: 'Yanisha ibishyimbo neza ku zuba kugeza byumye (munsi ya 13% y\'ubuhehere), hanyuma ubishyire mu mifuka y\'ubwirinzi ya PICS ifunze neza idasaba umuti.',
    causesEn: 'Bean weevils (Acanthoscelides obtectus) lay microscopic eggs in the field or in storage. In damp bags, larvae hatch and bore into grains, reducing quality to Grade 3 or total loss.',
    causesRw: 'Imungu y\'ibishyimbo iterera amagi mu murima cyangwa mu bubiko. Niba ibishyimbo bifite ubuhehere, inyo ziraturaga zikarya imbere mu kishyimbo.',
    actionStepsEn: [
      'Dry harvested beans on tarpaulins (never on bare soil to avoid contamination and stone mixing) until moisture is 12–13%.',
      'Test dryness: Biting a seed should produce a sharp, clean crack, not a dent. Alternatively, shake seeds with dry table salt in a clean glass jar: if salt sticks to the glass, beans are still too wet.',
      'Pack tightly into multilayer hermetic PICS bags (Purdue Improved Crop Storage). Squeeze out all excess air and tie each inner liner separately.',
      'Store bags on wooden pallets off the concrete floor, 30cm away from the wall.',
    ],
    actionStepsRw: [
      'Yanika ibishyimbo ku matandaro cyangwa shitingi (ntukayanike ku gitaka cyangwa mu mukungugu) kugeza byumye cyane.',
      'Gupima ubumara: Hekeranya ikishyimbo mu menyo cyumvikane ko giciyemo kabiri giturika. Cyangwa ushire umunyu wumye mu kirahure kirimo ibishyimbo.',
      'Bishyire mu mifuka ya PICS ifite amashashi 3, ukande umwuka wose ube usohotse, uheze buri shashi ukwayo.',
      'Bika imifuka hejuru y\'ibiti (pallets) itegeranye n\'urukuta.',
    ],
    precautionsEn: 'Do not puncture PICS bags with hooks or sharp objects; any pinhole air leak will allow weevils to survive.',
    precautionsRw: 'Ntugashinge igikwasi cyangwa ibyuma mu mufuka wa PICS kuko umwuka wose winjiye watuma imungu ibaho.',
    expertConsultationEn: 'Consult cooperative warehouse managers for bulk storage aggregation or certified grade certification before selling on AgriBridge.',
    expertConsultationRw: 'Baza ubuyobozi bwa Koperative yanyu y\'ubuhinzi kugira ngo ibishyimbo bibikwe muri koperative bishakirwe isoko.',
    keywordsEn: ['beans', 'storage', 'pics bags', 'weevils', 'drying', 'post-harvest', 'moisture', 'quality'],
    keywordsRw: ['ibishyimbo', 'kubika', 'imifuka ya pics', 'imungu', 'kwanika', 'isoko', 'ubwiza'],
    locationContext: 'Eastern Province & Countrywide',
    source: 'RAB & World Food Programme Post-Harvest Loss Prevention Manual',
    lastReviewed: '2026-01-10',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'List Dry Beans on Marketplace',
      labelRw: 'Shyira Ibishyimbo ku Isoko rya AgriBridge',
    },
  },

  // --- CROP PRODUCTION: IRISH POTATOES ---
  {
    id: 'potato-late-blight-05',
    topic: 'crop_diseases',
    category: 'potatoes',
    questionEn: 'How do I protect Irish potatoes from Late Blight (Miyirire)?',
    questionRw: 'Nigute narinda ibirayi indwara y\'imvura n\'imbeho (Miyirire)?',
    directAnswerEn: 'Late blight is managed by using certified resistant seed varieties (e.g. Kinigi, Rwangume), proper ridging, preventive copper or Mancozeb sprays during cool humid weather, and rogueing infected plants.',
    directAnswerRw: 'Miyirire irwanywa no gutera imbuto yizewe yihanganira indwara (Kinigi, Rwangume), guhira ubutaka hejuru, gutera umuti urinda (Mancozeb cyangwa Copper) ku bihe by\'imvura n\'imbeho.',
    causesEn: 'Phytophthora infestans fungus thrives in wet, misty, humid weather with temperatures between 10°C and 20°C, causing dark water-soaked leaf lesions with white fungal mold underneath.',
    causesRw: 'Umuhumyo uterwa n\'ububbere, imbeho n\'imvura nyinshi. Bitera ibibabi kuzana ibibara byirabura byorohereye no kuzaho ibintu byera munsi.',
    actionStepsEn: [
      'Select certified seed tubers from RAB-accredited multipliers; avoid using table potatoes from open markets as seed.',
      'Space plants 75cm between rows and 30cm between plants to allow sun penetration and air circulation.',
      'Hill up soil around stems (buta) to protect emerging tubers from fungal spores washed down by rain.',
      'Apply preventive protective contact fungicides before heavy rains start; repeat every 7–10 days during continuous fog/mist.',
    ],
    actionStepsRw: [
      'Hitamo imbuto yizewe yatubuwe n\'abatubuzi bemewe na RAB; irinde gutera ibirayi byo kurya.',
      'Tera intera ya cm 75 hagati y\'imirongo na cm 30 hagati y\'ikirayi n\'ikindi.',
      'Hira ubutaka hejuru cyane ku giti cy\'ikirayi kugira ngo imyuka y\'indwara itagera ku birayi byo munsi.',
      'Tera umuti urinda mbere y\'uko imvura nyinshi igwa, ugarukeho nyuma y\'iminsi 7 kugeza ku 10.',
    ],
    precautionsEn: 'Never spray fungicides without safety goggles and masks; observe the pre-harvest interval (PHI) written on the product label.',
    precautionsRw: 'Ntukigere utera umuti w\'ibirayi utambaye ibirinda umubiri; ugenzure iminsi igomba gushira mbere yo gusarura.',
    expertConsultationEn: 'Consult local potato cooperatives in Musanze, Nyabihu, or Rubavu for bulk seed procurement schedules.',
    expertConsultationRw: 'Gana koperative z\'aborozi b\'ibirayi i Musanze, Nyabihu cyangwa Rubavu kugira ngo umenye igihe imbuto itangirwa.',
    keywordsEn: ['potatoes', 'irish potatoes', 'late blight', 'miyirire', 'kinigi', 'rwangume', 'fungicide', 'ibirayi'],
    keywordsRw: ['ibirayi', 'miyirire', 'kinigi', 'rwangume', 'imbuto', 'umuti', 'imvura'],
    locationContext: 'Northern & Western Highlands (Musanze, Nyabihu, Burera)',
    source: 'RAB Irish Potato Technical Production Package',
    lastReviewed: '2026-02-10',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Seed Suppliers',
      labelRw: 'Shaka Abatubuzi b\'Imbuto Yemewe',
    },
  },

  // --- CROP PRODUCTION: TOMATOES & VEGETABLES ---
  {
    id: 'tomato-bacterial-wilt-06',
    topic: 'crop_diseases',
    category: 'tomatoes',
    questionEn: 'Why do my tomato plants suddenly wilt while leaves are still green?',
    questionRw: 'Kuki inyanya zanjye zuma zikigwira zikiri icyatsi kibisi?',
    directAnswerEn: 'Sudden daytime wilting of tomato plants with green leaves is the hallmark symptom of Bacterial Wilt (Ralstonia solanacearum), a soil-borne disease with no chemical cure.',
    directAnswerRw: 'Kuma k\'inyanya zikiri icyatsi kibisi ku manywa bitera n\'indwara y\'ubutaka ya Bacterial Wilt (Ralstonia) idafite umuti wo kuyitera.',
    causesEn: 'Ralstonia bacteria enter through root wounds, multiplying and plugging the xylem vessels, cutting off water transportation to the foliage.',
    causesRw: 'Bakteri ya Ralstonia yinjirira mu bikomere by\'imizi, ikabyimba ikaziba imiyoboro y\'amazi, bigatuma igiti cyuma ku buryo butunguranye.',
    actionStepsEn: [
      'Confirm the disease: Cut a lower stem and submerge it in a transparent glass of clean water; milky white bacterial threads streaming out confirms Bacterial Wilt.',
      'Uproot and burn or deeply bury the wilting plant with surrounding soil immediately; do not compost it.',
      'Rotate tomatoes with non-solanaceous crops (maize, sorghum, beans, garlic) for at least 3 years.',
      'Improve drainage and avoid working in wet plots, as tools and runoff spread bacteria to healthy roots.',
    ],
    actionStepsRw: [
      'Gupima indwara: Caca igiti cy\'inyanya hejuru y\'imizi ugishyire mu kirahure cy\'amazi asukuye; niba hasohotsemo utuntu twera nk\'amata ni Bacterial Wilt.',
      'Randura igiti cyose uruhambe cyangwa ugitwike; ntukagishyire mu mborera.',
      'Simburanya umurima n\'ibigori, amasaka cyangwa ibishyimbo mu gihe cy\'imyaka nibura itatu.',
      'Kora imiferege irinda amazi kureta no kwanduza ahandi.',
    ],
    precautionsEn: 'Do not spray pesticides for bacterial wilt; chemical sprays cannot cure blocked vascular tissue and waste farmer money.',
    precautionsRw: 'Ntukagure umuti wo gutera ku mababi ngo ukize iyi ndwara kuko nta muti uyikiza ku giti cyafashwe.',
    expertConsultationEn: 'Consult your local Agronome for certified wilt-tolerant tomato varieties (e.g. hybrid rootstocks or resistant lines).',
    expertConsultationRw: 'Baza umuhanga mu buhinzi ubwoko bw\'inyanya zihanganira ubu burwayi (resistant hybrids).',
    keywordsEn: ['tomatoes', 'bacterial wilt', 'wilting', 'green leaves', 'ralstonia', 'inyanya'],
    keywordsRw: ['inyanya', 'kuma', 'icyatsi', 'bacterial wilt', 'ubutaka', 'isuka'],
    locationContext: 'Eastern & Kigali Peri-urban vegetable belts',
    source: 'RAB Horticulture & Vegetable Health Guide',
    lastReviewed: '2026-01-25',
    platformAction: {
      tab: 'training',
      labelEn: 'View Tomato Management Audio Lessons',
      labelRw: 'Umva Amasomo y\'Ubuhinzi bw\'Inyanya',
    },
  },

  // --- LIVESTOCK MANAGEMENT: CATTLE & GIRINKA ---
  {
    id: 'livestock-cattle-mastitis-07',
    topic: 'livestock',
    category: 'cattle',
    questionEn: 'How do I detect and prevent Mastitis in dairy cows?',
    questionRw: 'Nigute namenya nkanarinda uburwayi bw\'amabere (Mastite) mu nka zikamwa?',
    directAnswerEn: 'Mastitis (uburwayi bw\'amabere) is prevented by strict milking hygiene, teat dipping in disinfectant after milking, dry bedding, and early detection using a strip cup.',
    directAnswerRw: 'Mastite irindwa no gukaraba intoki n\'amazi asukuye mbere yo gukama, kwinika amabere mu muti wisukura nyuma yo gukama, no gusukura ikiraro cy\'inka.',
    causesEn: 'Bacteria (Staphylococcus, Streptococcus) enter the open teat canal after milking from contaminated hands, dirty floors, or rough calf suckling.',
    causesRw: 'Udukoko twinjira mu mwenge w\'ibere ry\'inka rikimara gukamwa ryuguruye, duturutse ku ntoki zanduye cyangwa mu byondo by\'ikiraro.',
    actionStepsEn: [
      'Perform Strip Cup Test: Squirt the first 3 streams of milk from each teat onto a dark surface before milking; check for clots, flakes, or watery milk.',
      'Wash teats with warm clean water and dry thoroughly with a dedicated clean cloth for each cow.',
      'Immediately after milking, dip the teats in a registered iodine-based teat disinfectant solution.',
      'Keep cows standing for 30 minutes after milking by offering feed, so the teat canal can close naturally before she lies down.',
    ],
    actionStepsRw: [
      'Gupima amashereka: Kama amashereka ya mbere ku gikombe gifite umufuniko wirabura urebe niba harimo ibibumbe cyangwa amaraso.',
      'Karaba amabere n\'amazi asukuye uyahanagure n\'igitambaro cyabugenewe mbere yo gukama.',
      'Nyuma yo gukama ako kanya, inika umunwa w\'ibere mu muti wica udukoko (teat dip).',
      'Fungurira inka igihe igikama ngo igume ihagaze iminota 30 umwenge w\'ibere wifunge mbere yo kuryama mu byondo.',
    ],
    precautionsEn: 'Never consume or sell milk from cows undergoing antibiotic treatment until the withdrawal period stated by the veterinarian has elapsed.',
    precautionsRw: 'Ntukanywe cyangwa ngo ugurishe amata y\'inka iri mu miti y\'ubuvuzi kugeza igihe muganga w\'amatungo ateganyije gishize.',
    expertConsultationEn: 'Call a registered veterinary officer immediately if the cow has a swollen, hot, painful quarter with fever.',
    expertConsultationRw: 'Hamagara muganga w\'amatungo (Veterinaire) wemewe niba ibere ryabyimbye, rishyushye cyane cyangwa inka yagize umuriro.',
    keywordsEn: ['cattle', 'cow', 'milk', 'mastitis', 'dairy', 'hygiene', 'inka', 'amata', 'amabere'],
    keywordsRw: ['inka', 'amata', 'amabere', 'mastite', 'gukama', 'ikiraro', 'veterinaire'],
    locationContext: 'Nyagatare, Gatsibo, Gicumbi & Countrywide Dairy Basins',
    source: 'RAB Animal Resources Dairy Extension Manual',
    lastReviewed: '2026-02-12',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Registered Veterinarians',
      labelRw: 'Shaka Abaganga b\'Amatungo mu Karere',
    },
  },

  // --- LIVESTOCK: POULTRY ---
  {
    id: 'livestock-poultry-newcastle-08',
    topic: 'poultry',
    category: 'poultry',
    questionEn: 'How can I protect my chicken flock from Newcastle disease (Umusonga)?',
    questionRw: 'Nigute narinda inkoko zanjye indwara y\'umusonga (Newcastle Disease)?',
    directAnswerEn: 'Newcastle disease is prevented exclusively by scheduled vaccination (eye drops or drinking water vaccine) and rigorous farm biosecurity, as there is no cure once birds are sick.',
    directAnswerRw: 'Umusonga w\'inkoko urindwa gusa n\'urukingo rwa Newcastle rukorwa ku ngengabihe, isuku y\'inzu y\'inkoko, kuko nta muti uyikiza iyo yamaze gufata.',
    causesEn: 'A highly contagious Paramyxovirus spread through airborne droplets, infected wild birds, visitor shoes, or contaminated feed and water.',
    causesRw: 'Virusi ikwirakwizwa n\'umwuka, inyoni zo mu gasozi, inkweto z\'abashyitsi, cyangwa amazi n\'ibiryo byanduye.',
    actionStepsEn: [
      'Vaccinate chicks on Day 1–3 with HB1 or Hitchner B1 eye-drops, booster on Day 21 with LaSota in cool non-chlorinated water, and every 3 months for layers/indigenous birds.',
      'Place a disinfectant footbath (Jik or disinfectant) at the chicken house entrance; all caretakers must step in it.',
      'Isolate new birds brought from the market for at least 14 days before introducing them to your home flock.',
      'Immediately isolate or humanely cull birds exhibiting twisted necks, gasping breath, greenish diarrhea, or paralyzed wings.',
    ],
    actionStepsRw: [
      'Kingiza imishwi ku munsi wa 1–3 n\'amajwi mu maso, usubiremo ku munsi wa 21 n\'amazi asukuye adafite chlorine.',
      'Shyira umuti wisukura mu muryango w\'inzu y\'inkoko buri muntu wese anyukemo mbere yo kwinjira.',
      'Iyo uguze inkoko nshya ku isoko, yishyire ukwayo iminsi 14 mbere yo kuyivanga n\'izindi.',
      'Inkoko zose zifite ijosi rigoramye, impiswi y\'icyatsi, cyangwa ibaba ridakora zikuremo ako kanya.',
    ],
    precautionsEn: 'Keep vaccines in a cold flask with ice packs from the agro-vet to the farm; heat deactivates live vaccines instantly.',
    precautionsRw: 'Bika inkingo mu kintu gikonje kirimo barafu kugeza ugeze mu nzu y\'inkoko; ubushyuhe buhita bwica urukingo.',
    expertConsultationEn: 'Report flock mortality spikes to the District Veterinary Officer immediately to protect neighboring communities.',
    expertConsultationRw: 'Menyesha muganga w\'amatungo ku Karere niba inkoko nyinshi ziri gupfa mu mudugudu.',
    keywordsEn: ['poultry', 'chicken', 'newcastle', 'vaccine', 'lasota', 'disease', 'inkoko', 'umusonga'],
    keywordsRw: ['inkoko', 'umusonga', 'urukingo', 'lasota', 'amagi', 'ibiryo', 'isuku'],
    locationContext: 'All Rwanda Districts',
    source: 'RAB Small Stock & Poultry Development Program',
    lastReviewed: '2026-01-18',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Veterinary Vaccine Providers',
      labelRw: 'Shaka Abacuruzi b\'Inkingo z\'Amatungo',
    },
  },

  // --- FARM BUDGETING & FINANCES ---
  {
    id: 'finance-budgeting-09',
    topic: 'farm_budgeting',
    category: 'finance',
    questionEn: 'How can I calculate my farm production costs and profit?',
    questionRw: 'Nigute nabara ibyakoreshejwe n\'inyungu y\'umurima wanjye?',
    directAnswerEn: 'Calculate total production cost by summing Land Preparation + Certified Seeds + Fertilizer/Manure + Labor + Post-harvest Transport; subtract this sum from total sales revenue to find net profit.',
    directAnswerRw: 'Bara ibyakoreshejwe byose ukusanya: Guhinga + Imbuto + Ifumbire + Abakozi + Gutwara umusaruro; bikure mu mafaranga winjije ku musaruro kugira ngo ubone inyungu nyakuri.',
    causesEn: 'Farmers who do not record daily cash expenses frequently sell below cost of production or lose track of seasonal family labor costs.',
    causesRw: 'Abahinzi batandika amafaranga basohoye usanga bagurisha umusaruro ku giciro gito bituma bahomba batabizi.',
    actionStepsEn: [
      'Record every single cash outflow on the date it occurs (e.g., land preparation labor, seed bags, tractor hire, harvesting bags).',
      'Record unit costs: e.g., 50 kg NPK at 45,000 RWF + 2 laborers for 3 days at 1,500 RWF/day.',
      'Estimate yield in kg and divide your total production cost by estimated harvest kg to know your break-even price per kg.',
      'Never accept a buyer offer below your break-even cost per kilogram.',
    ],
    actionStepsRw: [
      'Andika amafaranga yose asohotse ku munsi nyirizina (abakozi, imbuto, gukodesha imashini, ibikapu).',
      'Bara ikiguzi cya buri kintu: urugero: ifumbire NPK 45,000 RWF + abakozi 2 mu minsi 3 ku 1,500 RWF ku munsi.',
      'Gaba amafaranga yose ku biro witeze gusarura kugira ngo umenye igiciro fatizo cy\'ikiro kimwe.',
      'Ntukigere wemera igiciro cy\'umuguzi kiri munsi y\'ikiguzi cyo kweza ikiro kimwe.',
    ],
    precautionsEn: 'Do not forget small repeated costs like mobile money transaction fees, spray equipment rentals, and storage bags.',
    precautionsRw: 'Ntukibagirwe amafaranga mato nka fagitire ya telefoni (momo), gukodesha umutiba, n\'amafaranga y\'imifuka.',
    expertConsultationEn: 'Use the AgriBridge Farm Finance Ledger to automatically calculate your seasonal crop profit margin.',
    expertConsultationRw: 'Koresha Agashami ka AgriBridge Farm Finances kugira ngo ikubarire inyungu y\'umusaruro mu buryo bw\'ikoranabuhanga.',
    keywordsEn: ['budget', 'costs', 'profit', 'expenses', 'break-even', 'ledger', 'accounting', 'amafaranga'],
    keywordsRw: ['ingengo y\'imari', 'amafaranga', 'inyungu', 'ibyakoreshejwe', 'igitabo', 'umusaruro', 'gucuruza'],
    locationContext: 'All Rwandan Farming Enterprises',
    source: 'MINAGRI Agricultural Economics & Agribusiness Division',
    lastReviewed: '2026-02-14',
    platformAction: {
      tab: 'finance',
      labelEn: 'Open Farm Finance Ledger',
      labelRw: 'Fungura Igitabo cy\'Imari cya AgriBridge',
    },
  },

  // --- AGRIBRIDGE PLATFORM CAPABILITIES ---
  {
    id: 'platform-how-to-sell-10',
    topic: 'platform_usage',
    category: 'agribridge',
    questionEn: 'How do I use AgriBridge to sell my harvested produce?',
    questionRw: 'Nigute nkoresha AgriBridge ngo ngurishe umusaruro wanjye?',
    directAnswerEn: 'Click "+ List Produce" on the navigation bar or Marketplace tab. Enter your crop type, variety, harvest date, available quantity (kg), asking price per kg, and sector location. Certified buyers will discover your listing and submit offers directly.',
    directAnswerRw: 'Kanda "+ List Produce" hejuru kuri paji cyangwa mu Isoko rya AgriBridge. Shyiramo ubwoko bw\'igihingwa, ibiro ufite, igiciro ku kilo, n\'umurenge uherereyemo. Abaguzi bazahita babibona baguhe ibiciro (offers).',
    causesEn: 'Traditional middlemen (abamamyi) take excessive margins from farmers due to lack of transparent market pricing and direct buyer connections.',
    causesRw: 'Abamamyi batwara inyungu nyinshi z\'umuhinzi kubera kutagira amakuru y\'isoko nyakuri n\'abaguzi bakuru.',
    actionStepsEn: [
      'Go to "Produce Market" or click the "+ List Produce" green button at the top of AgriBridge.',
      'Select your farm plot to pre-fill crop details, or enter new produce details manually.',
      'Specify Quality Grade (Grade 1 Premium, Grade 2 Commercial, or Grade 3 Processing) honestly to build buyer trust.',
      'Review incoming buyer offers under the "Buyer Offers" tab; you can Accept, Counter-offer, or Reject based on your bottom-line price.',
      'Once accepted, track delivery logistics and confirm digital mobile money payment.',
    ],
    actionStepsRw: [
      'Gana ahanditse "Produce Market" cyangwa ukande buto y\'icyatsi "+ List Produce".',
      'Hitamo umurima wari wanditse cyangwa ushyiremo amakuru mashya y\'umusaruro.',
      'Hitamo urugero rw\'ubwiza bw\'umusaruro (Grade 1, Grade 2, cyangwa Grade 3).',
      'Reba ibiciro abaguzi baguha munsi ya "Buyer Offers"; ushobora Kwemera, Guhagarika cyangwa Kuganira ku giciro.',
      'Iyo wemeye igiciro, mukomeza amasezerano yo kwishyura no gutwara umusaruro.',
    ],
    precautionsEn: 'Never release produce to an unverified third-party transport without confirming transaction status or escort from your local AgriBridge Community Agent.',
    precautionsRw: 'Ntukigere utanga umusaruro utabanje kwizera ko amafaranga yishyuwe cyangwa ufashe ubufasha bw\'Umujyanama w\'ubuhinzi.',
    expertConsultationEn: 'Need help listing? Contact a local AgriBridge Community Agent in your sector who can assist you with mobile recording.',
    expertConsultationRw: 'Waba ukeneye ubufasha? Gana Umujyanama wa AgriBridge uri mu Murenge wawe agufashe kwinjiza umusaruro.',
    keywordsEn: ['sell', 'produce', 'marketplace', 'listing', 'buyers', 'offers', 'price', 'beans', 'maize', 'agribridge'],
    keywordsRw: ['kugurisha', 'isoko', 'umusaruro', 'ibiciro', 'abaguzi', 'agribridge', 'ibishyimbo', 'ibigori'],
    locationContext: 'Nyagatare, Kigali & Nationwide Market Network',
    source: 'AgriBridge Rwanda Operational Standards',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'Go to Marketplace',
      labelRw: 'Kuri Isoko rya AgriBridge',
    },
  },

  {
    id: 'platform-how-to-add-farm-11',
    topic: 'platform_usage',
    category: 'agribridge',
    questionEn: 'How do I register a new farm or plot on AgriBridge?',
    questionRw: 'Nigute nandikisha umurima mushya kuri AgriBridge?',
    directAnswerEn: 'On the Farms & Plots Dashboard, click "+ Register Plot" or "+ Register Farm". Fill in the farm name, district, sector, plot area in Hectares, and primary soil type. Your plot is saved offline on your device immediately.',
    directAnswerRw: 'Kuri paji ya mbere "Farms & Plots", kanda "+ Register Plot". Shyiramo izina ry\'umurima, akarere, umurenge, ubuso bwa hegitari, n\'ubwoko bw\'ubutaka. Umurima uhita ubikwa muri telefone yawe.',
    actionStepsEn: [
      'Click "+ Register Plot" in the top bar or inside the Farms & Plots tab.',
      'Select your farm and assign a plot identifier (e.g. Plot A - Riverside).',
      'Specify the crop planted (e.g., Maize, Beans, Irish Potatoes) and planting date.',
      'Track growth milestones (Germination -> Vegetative -> Flowering -> Maturing -> Harvested) to get stage-specific agronomic alerts.',
    ],
    actionStepsRw: [
      'Kanda "+ Register Plot" hejuru kuri paji cyangwa munsi y\'umurima.',
      'Hitamo izina ry\'umurima n\'umurenge uherereyemo.',
      'Shyiramo igihingwa cyatewemo (urugero: Ibigori, Ibishyimbo) n\'itariki yo gutera.',
      'Genzura intera y\'urugori (Kumera -> Gukura -> Kurabyo -> Kweza -> Gusarura) kugira ngo uhabwe ubufasha bukwiye.',
    ],
    keywordsEn: ['register farm', 'add plot', 'new farm', 'land size', 'hectares', 'planting', 'agribridge'],
    keywordsRw: ['kwandika umurima', 'igipimo', 'hegitari', 'gutera', 'agribridge', 'ibihingwa'],
    locationContext: 'All Districts',
    source: 'AgriBridge Rwanda Farm Management Protocol',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'farmer',
      labelEn: 'Open Farm Management',
      labelRw: 'Fungura Farms & Plots',
      actionType: 'open_modal',
      modalTarget: 'plot',
    },
  },

  {
    id: 'platform-how-community-agents-work-12',
    topic: 'platform_usage',
    category: 'agribridge',
    questionEn: 'How can a Community Agent help me if I have no smartphone or internet?',
    questionRw: 'Umujyanama w\'ubuhinzi (Community Agent) yamfasha ate niba nta telefoneigezweho mfite?',
    directAnswerEn: 'AgriBridge Community Agents are trained rural extension focal points stationed in sectors who use agent-assisted tablets to record your plots, inspect crop health, register your produce, and connect you with buyers even if you only have a basic feature phone.',
    directAnswerRw: 'Abajyanama ba AgriBridge (Community Agents) bari mu mirenge bafite ibikoresho byabugenewe byo kubafasha kwandika imirima, kureba indwara z\'ibihingwa, no gushyira umusaruro wanyu ku isoko nubwo waba ufite telefone isanzwe.',
    actionStepsEn: [
      'Visit your local Sector Aggregation Point or Cooperative office to meet your designated Community Agent.',
      'Provide your National ID and basic phone number; the agent will register your crop and plot details on your behalf.',
      'When buyers submit offers, you will receive direct SMS or phone calls from the agent with confirmed prices.',
      'You can also access the Agent Desk tab on AgriBridge to view active agent directories and commission transparency.',
    ],
    actionStepsRw: [
      'Gana ku biro bya koperative yanyu cyangwa ahahurirwa umusaruro mu murenge ubonane n\'umujyanama wa AgriBridge.',
      'Mwereke indangamuntu na nimero yawe ya telefone ashyiremo umurima wawe.',
      'Iyo abaguzi batanze ibiciro, uhita uhamagarwa cyangwa wohererezwe ubutumwa bugufi (SMS).',
      'Ushobora kureba ibyerekeye abajyanama mu gace ka "Agent Desk" kuri AgriBridge.',
    ],
    keywordsEn: ['community agent', 'offline support', 'feature phone', 'rural assistance', 'agent desk', 'cooperative'],
    keywordsRw: ['umujyanama', 'abakozi', 'koperative', 'ubufasha', 'sms', 'telefone', 'agent desk'],
    locationContext: 'Nyagatare Sectors & National Expansion',
    source: 'AgriBridge Rural Inclusion Charter',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'agent',
      labelEn: 'Open Agent Desk',
      labelRw: 'Kuri Agent Desk',
    },
  },

  // --- CASSAVA: CBSD & CMD (UBUBEMBE BW'IMYUMBATI) ---
  {
    id: 'cassava-cbsd-cmd-13',
    topic: 'crop_diseases',
    category: 'cassava',
    questionEn: 'How do I identify and manage Cassava Brown Streak Disease (CBSD) and Cassava Mosaic (CMD)?',
    questionRw: 'Nigute namenya nkanarwanya ububembe bw\'imyumbati (CBSD na CMD)?',
    directAnswerEn: 'Cassava Brown Streak Disease (CBSD) and Cassava Mosaic Disease (CMD / Ububembe) are managed by using certified clean disease-free stems from RAB multipliers, rouging infected plants immediately, and controlling whitefly vector insects.',
    directAnswerRw: 'Ububembe bw\'imyumbati (CMD na CBSD) burwanywa no gutera imyumbati y\'imbuto yizewe idafite uburwayi yatanzwe na RAB, kurandura no gutwika ibiti byafashwe hakiri kare, no kwirinda uducurama (whiteflies) dukwirakwiza virusi.',
    causesEn: 'Viruses transmitted through infected stem cuttings or by whiteflies (Bemisia tabaci). CBSD causes brown necrotic dry rot inside root tubers even when foliage looks healthy; CMD causes yellow crumpled mosaic leaves.',
    causesRw: 'Virusi ikwirakwizwa n\'uducurama duto tw\'umweru cyangwa gukata ingeri ku biti birwaye. CBSD iborereza imyumbati imbere mu butaka; CMD izana amabara y\'umuhondo no kwihinahina ku mababi.',
    actionStepsEn: [
      'Plant clean certified cassava stem cuttings of RAB-recommended varieties (e.g., Gahene, Ndamirabana, Mavumbuka).',
      'Cut stems 20–25cm long with 4–6 nodes, planted at a 45-degree angle or horizontal on ridges spaced 1m x 1m.',
      'Rogueing: Inspect the plot weekly for the first 3 months. Gently uproot any plant showing distorted, yellow-mottled leaves and burn it far from the field.',
      'Harvest mature tubers promptly at 10–12 months before CBSD dry rot can expand inside the roots.',
    ],
    actionStepsRw: [
      'Tera ingeri z\'imyumbati yizewe idafite ubwandu yemewe na RAB (urugero: Gahene, Ndamirabana, Mavumbuka).',
      'Kata ingeri zifite santimetero 20–25 zirimo amaso 4–6, uzitere zihengamye kuri dogere 45 ku mirongo ya metero 1 kuri metero 1.',
      'Kurandura ibirwaye: Suzuma umurima buri cyumweru mu mezi 3 ya mbere; urandure igiti cyose gifite amababi yihinahina ugitwike.',
      'Sarura ku gihe (amezi 10 kugeza ku 12) kugira ngo imyumbati itaborera mu butaka.',
    ],
    precautionsEn: 'Never use stem cuttings from an unverified neighborhood field with dry-rotted tubers, as the virus resides inside stem tissue without external symptoms.',
    precautionsRw: 'Ntukigere ufata ingeri ku biti byo mu mirima yagize imyumbati iboze kuko virusi iba iri mu giti imbere.',
    expertConsultationEn: 'Consult the Sector Agronomist to access clean cassava stem multiplication programs sponsored by RAB and MINAGRI.',
    expertConsultationRw: 'Gana Agronome w\'Umurenge aguhuza n\'abatubuzi b\'ingeri z\'imyumbati bafashwa na RAB.',
    keywordsEn: ['cassava', 'cbsd', 'cmd', 'mosaic', 'brown streak', 'tubers', 'whitefly', 'imyumbati', 'ububembe'],
    keywordsRw: ['imyumbati', 'ububembe', 'ingeri', 'cbsd', 'cmd', 'rab', 'kuma', 'kugurisha'],
    locationContext: 'Eastern Province (Nyagatare, Gatsibo, Bugesera), Southern Province (Ruhango, Kamonyi)',
    source: 'RAB Cassava Pathology & National Multiplication Package',
    lastReviewed: '2026-02-14',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Cassava Multipliers',
      labelRw: 'Shaka Abatubuzi b\'Imyumbati Yemewe',
    },
  },

  // --- BANANAS: BXW / KIRABIRANYA ---
  {
    id: 'banana-bxw-kirabiranya-14',
    topic: 'crop_diseases',
    category: 'bananas',
    questionEn: 'How can I stop Banana Bacterial Wilt (BXW / Kirabiranya) from destroying my banana plantation?',
    questionRw: 'Nigute nahagarika kirabiranya y\'insina (Banana Bacterial Wilt) mu rutoki rwanjye?',
    directAnswerEn: 'Banana Bacterial Wilt (Kirabiranya) is strictly controlled by Single Diseased Stem Removal (SDSR), debudding male flower buds with a forked wooden stick, and sterilizing all farm machetes and pruning knives with fire.',
    directAnswerRw: 'Kirabiranya irwanywa no guca umutwe w\'insina ukoresheje igiti gifite ishami (kwica umutwe nta cyuma), gutema no gucagagura igiti kirwaye ako kanya (SDSR), no gutwika imihoro mu muriro mbere yo gukata indi nsina.',
    causesEn: 'Xanthomonas vasicola pv. musacearum bacteria transmitted by insect pollinators visiting male flowers, dirty machetes/pangas, or infected banana suckers.',
    causesRw: 'Bakteri ya Xanthomonas ikwirakwizwa n\'inzuki n\'isazi bisanga indabyo z\'umutwe w\'insina, imihoro yanduye, cyangwa ibitoki by\'insina zirwaye.',
    actionStepsEn: [
      'Debudding: Remove the male flower bud immediately after the last banana hand has formed using a clean wooden forked stick. Never use metal machetes for debudding!',
      'Tool Hygiene: Pass machete and knife blades through open flame for 15 seconds after cutting any banana mat before touching another.',
      'Cut down sick stems at ground level immediately upon seeing premature yellowing, wilting, or yellow bacterial ooze in cut pseudostems.',
      'Chop diseased stems into small slices to dry rapidly in direct sunlight, or bury them.',
    ],
    actionStepsRw: [
      'Guca umutwe w\'insina: Koresha igiti gifite ishami ukuyeho umutwe w\'insina igihe igitoki cyose cyamaze kurabya; ntukoreshe umuhoro!',
      'Gusukura imihoro: Babura umuhoro mu muriro amasegonda 15 mbere yo gutema indi nsina kugira ngo wice udukoko.',
      'Tema hasi igiti cyose kigaragaje amababi y\'umuhondo, ibitoki biborera mu giti cyangwa amayezi y\'umuhondo.',
      'Cagagura ibiti birwaye ubyanike ku zuba ryinshi byume vuba cyangwa ubihambe mu rwobo runini.',
    ],
    precautionsEn: 'Never transport banana suckers, leaves, or fruit bunches from a known BXW-quarantined area to an unaffected orchard.',
    precautionsRw: 'Ntukigere ukura insina cyangwa amakoma mu gace karangwamo kirabiranya ngo uyajyane mu kindi gikingi.',
    expertConsultationEn: 'Notify your local Village Head or Sector Agronomist if Kirabiranya is detected so a coordinated neighborhood eradication campaign is started.',
    expertConsultationRw: 'Menyesha Agronome w\'Umurenge niba ubonye kirabiranya kugira ngo hakorwe umuganda wo kuyirandura mu mudugudu.',
    keywordsEn: ['banana', 'bxw', 'kirabiranya', 'bacterial wilt', 'debudding', 'sterilize machete', 'urutoki', 'insina'],
    keywordsRw: ['insina', 'urutoki', 'kirabiranya', 'umutwe', 'umuhoro', 'ibitoki', 'agronome'],
    locationContext: 'Eastern Province, Bugesera, Kayonza, Rubavu, Rusizi & National',
    source: 'RAB National Banana Wilt Control Guidelines',
    lastReviewed: '2026-02-12',
    platformAction: {
      tab: 'training',
      labelEn: 'Learn Banana Disease Prevention',
      labelRw: 'Amasomo yo Kurwanya Kirabiranya',
    },
  },

  // --- RICE: MARSHLAND PRODUCTION ---
  {
    id: 'rice-marshland-production-15',
    topic: 'crop_production',
    category: 'rice',
    questionEn: 'What are the best practices for rice farming in Rwandan marshlands (ibishanga)?',
    questionRw: 'Ni ubuhe buryo bwiza bwo guhinga umuceri mu bishanga byo mu Rwanda?',
    directAnswerEn: 'High-yield rice production in Rwandan marshlands requires land leveling, transplanting 18–21 day-old single seedlings at 20cm x 20cm spacing, split Urea application, and continuous shallow water depth (3–5 cm).',
    directAnswerRw: 'Kweza umuceri mwinshi mu bishanga bisaba gutunganya ubutaka bubaye ikirundo, gutera ingemwe zifite iminsi 18–21 intera ya cm 20 kuri cm 20 (urugemwe 1 cyangwa 2), gushyiramo Urea inshuro ebyiri, no kugumisha amazi yoroheje ya cm 3–5.',
    causesEn: 'Poor water control, irregular plant spacing, and delayed weeding lead to heavy tillering loss and vulnerability to Rice Blast fungus (Pyricularia oryzae).',
    causesRw: 'Amazi menshi cyane cyangwa yabaye make, kubiba ku buryo bucucitse no gutinda kubagara bituma umuceri utagira uburumbuke ukanarwara Rice Blast.',
    actionStepsEn: [
      'Puddle and level the paddy field thoroughly so water depth remains uniform across the basin.',
      'Transplant robust 18-21 day-old seedlings in straight lines: 20cm between rows and 20cm between hills, with 1–2 healthy seedlings per hill.',
      'Apply basal fertilizer (NPK 17-17-17) at transplanting, then top-dress with Urea in two splits: first at active tillering (21 days) and second at panicle initiation (45 days).',
      'Keep water shallow (3-5cm) during vegetative growth, and drain the field completely 10–14 days before harvest.',
    ],
    actionStepsRw: [
      'Tunganya ubutaka mu gishanga bube buringaniye neza kugira ngo amazi akwire hose ku kigero kimwe.',
      'Tera ingemwe zifite iminsi 18–21 ku mirongo igororotse: intera ya cm 20 kuri cm 20, ingemwe 1–2 ku mwobo.',
      'Shyiramo ifumbire y\'imbuto ya NPK mu itera, hanyuma ugashyiramo Urea inshuro ebyiri: nyuma y\'ibyumweru 3 no mu gihe umuceri urabyo.',
      'Kora imiferege igumisha amazi ya cm 3–5, ukamye amazi yose iminsi 10–14 mbere yo gusarura.',
    ],
    precautionsEn: 'Do not harvest rice when grains are wet with morning dew; dry paddy slowly to 13–14% moisture to prevent cracked grain during milling.',
    precautionsRw: 'Ntukasarure umuceri urimo ikime cya mu gitondo; yanika umuceri ku zuba ringaniye kugeza ku buhehere bwa 14% ngo utamanyagurika mu gusya.',
    expertConsultationEn: 'Coordinate with your Water Users Association (AUE) and Rice Cooperative for irrigation gate scheduling.',
    expertConsultationRw: 'Fatanya na koperative y\'abahinzi b\'umuceri n\'abashinzwe amazi mu gishanga (AUE) ku ngengabihe y\'amazi.',
    keywordsEn: ['rice', 'marshland', 'igishanga', 'paddy', 'urea', 'transplanting', 'bugarama', 'rwamagana', 'umuceri'],
    keywordsRw: ['umuceri', 'igishanga', 'bugarama', 'rwamagana', 'koperative', 'amazi', 'gusarura'],
    locationContext: 'Rwamagana, Bugarama, Nyagatare Muvumba Valleys, Kamonyi, Gatsibo',
    source: 'RAB National Rice Development Strategy & Extension Package',
    lastReviewed: '2026-02-10',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'List Paddy or Milled Rice',
      labelRw: 'Shyira Umuceri ku Isoko',
    },
  },

  // --- CLIMBING BEANS: STAKING & STAGGERING ---
  {
    id: 'beans-staking-climbing-16',
    topic: 'planting_spacing',
    category: 'beans',
    questionEn: 'How do I properly stake climbing beans (Ibishyimbo by\'imishingiriro) for maximum yield?',
    questionRw: 'Nigute nshingirira neza ibishyimbo by\'imishingiriro ngo nsarure byinshi?',
    directAnswerEn: 'Climbing beans produce 3 to 4 times more yield than bush beans when staked early (at 2-3 trifoliate leaves) using 2-meter stakes (bamboo, pennisetum, or eucalyptus branches) spaced at 2 to 3 plants per stake.',
    directAnswerRw: 'Ibishyimbo by\'imishingiriro bitanga umusaruro wikubye inshuro 3 kugeza kuri 4 ugereranyije n\'ibigufi iyo bishingiriwe hakiri kare (amababi 2-3) hifashishijwe imishingiriro ya metero 2 (imigano, urubingo) ku bihingwa 2–3 ku giti.',
    causesEn: 'Delayed staking causes vines to sprawl on muddy soil, rotting flower clusters, encouraging Anthracnose disease, and cutting yield by more than 50%.',
    causesRw: 'Gutinda gushingirira bituma ibishyimbo bikururuka mu byondo, indabyo zikabora, bikazana indwara ya Anthracnose n\'umusaruro ukagabanuka hejuru ya 50%.',
    actionStepsEn: [
      'Plant rows 50cm apart with 20cm between seed holes, 2 seeds per hole.',
      'Place strong 2m stakes firmly into the ground 2–3 weeks after germination when climbing shoots begin to wind.',
      'Use the tripod or cross-trellis system (binding 3-4 stake tops together with sisal or banana fiber) to withstand strong storm winds in high altitudes.',
      'Apply rhizobium bio-fertilizer inoculant at planting to maximize root nitrogen nodules.',
    ],
    actionStepsRw: [
      'Hinga imirongo iri ku ntera ya cm 50 hagati yayo, na cm 20 hagati y\'umwobo n\'uwundi, imbuto 2 ku mwobo.',
      'Shinga imishingiriro ikomeye ya metero 2 mu butaka nyuma y\'ibyumweru 2 kugeza kuri 3 imbuto zimaze kumera.',
      'Zirika imitwe y\'imishingiriro 3 cyangwa 4 hamwe (systeme y\'amapiramidi) kugira ngo imiyaga ikaze itayirandura ku misozi.',
      'Shyiramo umusemburo wa Rhizobium ku mbuto mbere yo gutera kugira ngo wiyongerere ifumbire ya azote.',
    ],
    precautionsEn: 'Do not harvest immature green pods for drying; wait until pods turn straw-yellow and seeds rattle inside.',
    precautionsRw: 'Ntukasarure amayuki y\'ibishyimbo bikiri bibisi ngo ubishyire mu bubiko; tegereza kugeza ibishyimbo byumye byasakuza mu gishishwa.',
    expertConsultationEn: 'Check with local agroforestry nurseries for sustainable pennisetum and Calliandra staking material.',
    expertConsultationRw: 'Baza abatubuzi b\'ibiti by\'ishyamba ku bijyanye n\'urubingo cyangwa ibiti byo gushingirira bitangiza ibidukikije.',
    keywordsEn: ['climbing beans', 'staking', 'imishingiriro', 'stakes', 'yield', 'tripod', 'anthracnose', 'ibishyimbo'],
    keywordsRw: ['ibishyimbo', 'imishingiriro', 'urubingo', 'imigano', 'musanze', 'gicumbi', 'umusaruro'],
    locationContext: 'Highlands: Musanze, Burera, Nyabihu, Gicumbi, Nyamagabe, Rutsiro',
    source: 'RAB Bean Program & CIAT HarvestPlus Extension Protocol',
    lastReviewed: '2026-02-08',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'Browse Climbing Bean Seed Listings',
      labelRw: 'Reba Imbuto z\'Ibishyimbo ku Isoko',
    },
  },

  // --- SOYBEANS: RHIZOBIUM INOCULATION ---
  {
    id: 'soybeans-rhizobium-inoculation-17',
    topic: 'fertilizer_management',
    category: 'soybeans',
    questionEn: 'How does Rhizobium bio-fertilizer inoculant boost soybean (Soya) yields in Rwanda?',
    questionRw: 'Nigute umusemburo wa Rhizobium wongera umusaruro wa soya mu Rwanda?',
    directAnswerEn: 'Rhizobium bio-inoculant introduces live nitrogen-fixing bacteria onto soybean seeds before planting, enabling plants to capture atmospheric nitrogen and boosting bean yields by 30–50% without expensive chemical nitrogen.',
    directAnswerRw: 'Umusemburo wa Rhizobium ushyirwa ku mbuto za soya mbere yo gutera utuma ubutaka bwuzura udukoko twa kamere dufata azote mu kirere, bikongera umusaruro wa soya hejuru ya 30% kugeza kuri 50% udakoresheje Urea ihenze.',
    causesEn: 'Rwandan soils lacking native soybean rhizobia leave roots without active pink nitrogen-fixing nodules, causing pale yellow leaves and low pod set.',
    causesRw: 'Ubutaka bwinshi budafite udukoko twa Rhizobium butuma imizi ya soya idakorana n\'umwuka, bigatuma ibibabi biba umuhondo n\'ibishyimbo bikaba bike.',
    actionStepsEn: [
      'Mix 1 packet of RAB-certified Rhizobium inoculant with 50ml of clean sugar water (acts as a sticker) per 10kg of soybean seeds.',
      'Coat seeds gently in the shade until all seeds have a thin uniform black coating. Never expose inoculated seed to direct sunlight!',
      'Plant coated seeds into moist soil within 2–4 hours of mixing.',
      'Apply phosphorus fertilizer (DAP or Single Superphosphate) at planting to feed root rootlet nodule formation.',
    ],
    actionStepsRw: [
      'Vanga umusemburo wa Rhizobium n\'utuzi turimo isukari duke (dutuma umusemburo ufata ku mbuto) ku biro 10 bya soya.',
      'Vanga witonze mu gicucu kugeza imbuto zose zibaye umukara. Ntukigere wanika imbuto zashyizwemo umusemburo ku zuba ryinshi!',
      'Tera imbuto mu butaka buhehereye mu masaha 2 kugeza kuri 4 umaze kuzivanga.',
      'Shyiramo ifumbire ya DAP cyangwa fosifore mu mwobo kugira ngo ufashe imizi gukura neza.',
    ],
    precautionsEn: 'Keep Rhizobium packets refrigerated or in a cool clay pot away from heat; dead bacteria will not fix nitrogen.',
    precautionsRw: 'Bika paki za Rhizobium ahakonje cyangwa mu kibindi kirimo amazakonje; ubushyuhe bwica ubu buhanga.',
    expertConsultationEn: 'Order certified Rhizobium inoculum through RAB distribution centers or registered agro-input dealers on AgriBridge.',
    expertConsultationRw: 'Tumiza umusemburo wa Rhizobium ku bacuruzi b\'inyongeramusaruro bemewe kuri AgriBridge.',
    keywordsEn: ['soybeans', 'soya', 'rhizobium', 'inoculant', 'bio-fertilizer', 'nitrogen', 'nodules', 'rab'],
    keywordsRw: ['soya', 'rhizobium', 'umusemburo', 'azote', 'ifumbire', 'imbuto', 'umurima'],
    locationContext: 'Eastern Province (Nyagatare, Kayonza, Kirehe) & Southern Province',
    source: 'RAB Legume Pathology & Soil Microbiology Unit',
    lastReviewed: '2026-02-05',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Bio-Inoculant Agro-Dealers',
      labelRw: 'Shaka Abacuruzi ba Rhizobium',
    },
  },

  // --- HORTICULTURE: CABBAGE & DIAMONDBACK MOTH ---
  {
    id: 'horticulture-cabbage-diced-18',
    topic: 'pest_management',
    category: 'cabbage',
    questionEn: 'How do I control Diamondback Moth caterpillars and Black Rot in cabbage (Amashu)?',
    questionRw: 'Nigute narwanya inyo z\'amashu (Diamondback Moth) n\'indwara yo kubora kw\'amashu (Black Rot)?',
    directAnswerEn: 'Manage cabbage pests and diseases through crop rotation with non-brassicas, seedling nursery netting, neem-based biological sprays for caterpillars, and copper bactericide sprays for Black Rot during rainy weather.',
    directAnswerRw: 'Kurwanya inyo z\'amashu no kubora birindwa no gusimburanya ibihingwa n\'ibitari amashu, gutwikira pepiniyere n\'inzitiramibu, gutera umuti wa Neem wica inyo, no gutera umuti wa Copper urinda indwara y\'imvura.',
    causesEn: 'Plutella xylostella larvae chew small window-panes in leaves and head cores; Xanthomonas campestris bacteria enter leaf margins causing V-shaped yellow-to-black necrotic lesions and rotten odor.',
    causesRw: 'Inyo z\'ikinyugunyugu zirya amababi y\'amashu zikayacamo utwobo; udukoko twa bagiteri twinjira ku mpera z\'amababi tugatuma amashu abora akanuka.',
    actionStepsEn: [
      'Raise nursery seedlings under insect-proof net tunnels to transplant pest-free stock into the field.',
      'Space transplants at 60cm between rows and 40-50cm between plants for good airflow and head sizing.',
      'Scout for tiny green caterpillars under leaves; apply Bacillus thuringiensis (Bt) or Neem botanical extract weekly.',
      'Avoid overhead sprinkler watering which splashes black rot bacteria across heads; use furrow or drip irrigation.',
    ],
    actionStepsRw: [
      'Rera ingemwe muri pepiniyere itwikiriwe n\'inzitiramibu kugira ngo uzatere ingemwe zitagira inyo na gato.',
      'Tera ingemwe ku ntera ya cm 60 hagati y\'imirongo na cm 40–50 hagati y\'amashu kugira ngo agire umwuka.',
      'Suzuma inyo z\'icyatsi munsi y\'amababi; tera umuti w\'ibimera wa Neem cyangwa Bt buri cyumweru.',
      'Irinde kuhira amashu hejuru ku mutwe n\'ijerikani kuko bitera uburwayi; uhire ku mizi gusa.',
    ],
    precautionsEn: 'Do not harvest cabbages within 7–14 days of spraying chemical synthetic insecticides (respect Pre-Harvest Interval).',
    precautionsRw: 'Ntukasarure amashu mbere y\'uko iminsi 7 kugeza ku 14 irangira nyuma yo gutera imiti y\'uburozi.',
    expertConsultationEn: 'Consult horticulturists on AgriBridge to source hybrid cabbage varieties with natural black rot tolerance.',
    expertConsultationRw: 'Baza abahanga mu buhinzi bw\'imboga kuri AgriBridge ubwoko bw\'amashu yihanganira kubora.',
    keywordsEn: ['cabbage', 'amashu', 'diamondback moth', 'black rot', 'neem', 'horticulture', 'vegetables'],
    keywordsRw: ['amashu', 'inyo', 'kubora', 'imboga', 'umuti', 'isoko', 'nyagatare'],
    locationContext: 'Nyagatare, Musanze, Rulindo, Bugesera & Urban Belts',
    source: 'RAB Horticulture & Vegetable Extension Guidelines',
    lastReviewed: '2026-02-01',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'List Harvested Cabbages',
      labelRw: 'Shyira Amashu ku Isoko',
    },
  },

  // --- HORTICULTURE: ONIONS & CURING ---
  {
    id: 'horticulture-onions-curing-19',
    topic: 'post_harvest',
    category: 'onions',
    questionEn: 'How should I harvest and cure onions (Ibitunguru) to prevent rotting in storage?',
    questionRw: 'Nigute ngomba gusarura nkananika ibitunguru ngo bitaborera mu bubiko?',
    directAnswerEn: 'Harvest onions when 60–70% of plant tops have fallen over naturally. Cure them in a warm, dry, shaded, well-ventilated structure for 2 to 3 weeks until the outer skins are papery and the neck is completely sealed.',
    directAnswerRw: 'Sarura ibitunguru iyo 60% kugeza kuri 70% by\'amababi byamaze kugwa hasi byumye. Byanike mu nzu ifite umwuka uhagije n\'igicucu mu gihe cy\'ibyumweru 2 kugeza kuri 3 kugeza igishishwa cyabaye nk\'urupapuro ijosi ry\'igitunguru rikafunge neza.',
    causesEn: 'Harvesting too early when neck tissues are green and wet allows neck rot fungi (Botrytis) and bacterial soft rot to enter the bulb, causing rot within 30 days.',
    causesRw: 'Gusarura ibitunguru bitaruma amababi bikiri bibisi bituma uduhuzu twinjira mu ijosi ry\'igitunguru kigahita kibora mu mezi make.',
    actionStepsEn: [
      'Stop irrigation 10–14 days before harvest to allow bulbs to dry in the ground.',
      'Carefully pull bulbs by hand or lift with a fork; avoid bruising or cutting bulb flesh.',
      'Spread bulbs in a single layer on slatted wooden racks or mesh under shade with excellent breeze; never leave onions curing under direct midday sun.',
      'Trim dried tops to 2.5cm only after the neck is completely dry and tight. Store in net mesh bags in a cool dry room.',
    ],
    actionStepsRw: [
      'Hagarika kuhira iminsi 10 kugeza kuri 14 mbere yo gusarura kugira ngo ubutaka bwume.',
      'Kuramo ibitunguru witonze udakomeretsa igishishwa cyabyo.',
      'Byanike ku meza y\'ibiti mu gicucu kirimo akayaga; ntukabyanike ku zuba ryinshi rirora.',
      'Kata amababi yasigaye urenzeho santimetero 2.5 gusa iyo ijosi ryumye neza. Bibike mu mifuka y\'inzitiramibu.',
    ],
    precautionsEn: 'Do not pack uncured wet onions into plastic bags; condensation will cause immediate mold and rot.',
    precautionsRw: 'Ntugashyire ibitunguru bitarumye mu masashi ya pulasitiki kuko bihita bibora.',
    expertConsultationEn: 'Check prevailing market prices on AgriBridge Marketplace before selling your cured onions.',
    expertConsultationRw: 'Reba ibiciro by\'ibitunguru uyu munsi mu Isoko rya AgriBridge mbere yo kubigurisha.',
    keywordsEn: ['onions', 'ibitunguru', 'curing', 'harvesting', 'neck rot', 'storage', 'post-harvest'],
    keywordsRw: ['ibitunguru', 'gusarura', 'kwanika', 'kubika', 'isoko', 'igiciro', 'agribridge'],
    locationContext: 'Bugesera, Rwamagana, Nyagatare, Rubavu',
    source: 'RAB Post-Harvest Onion Handling Standard',
    lastReviewed: '2026-02-04',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'Check Current Onion Prices',
      labelRw: 'Reba Ibiciro by\'Ibitunguru',
    },
  },

  // --- SPECIALTY COFFEE: HARVESTING & PROCESSING ---
  {
    id: 'coffee-cherry-processing-20',
    topic: 'harvesting',
    category: 'coffee',
    questionEn: 'How can Rwandan coffee farmers achieve Grade A1 cherry prices at the washing station?',
    questionRw: 'Nigute umuhinzi w\'ikawa agera ku giciro cyiza cya Grade A1 ku kigo kiyitunganya (Washing Station)?',
    directAnswerEn: 'Achieving Grade A1 coffee prices requires selective picking of only bright, uniformly red ripe cherries (kuroba), floating them in water to skim off floaters (impeza), and delivering cherries to the Coffee Washing Station within 8 hours of picking.',
    directAnswerRw: 'Kugera ku giciro cya mbere cy\'ikawa bisaba kuroba ibitumbwe bitukura neza byeze gusa, kuroba ibitumbwe mu mazi ugakuramo ibireremba (impeza), no kugeza ikawa ku ruganda ruyitunganya (Washing Station) bitarenze amasaha 8 umaze kuyisarura.',
    causesEn: 'Mixing green, overripe, or pest-damaged cherries with good ones reduces cupping score below specialty 80+ levels, lowering the farmgate payment.',
    causesRw: 'Kuvanga ikawa y\'ibisi, iboze, cyangwa yariwe n\'udukoko n\'ikawa nziza bituma igiciro kigabanuka cyane ku ruganda.',
    actionStepsEn: [
      'Selective picking: Harvest in rounds every 7–10 days, gently twisting off only fully crimson ripe cherries. Never strip entire branches!',
      'Flotation test: Place picked cherries into a clean basin of water; skim away floating defective cherries immediately.',
      'Protect picked cherries from hot sun, dirt, and chemical containers during transport.',
      'Deliver to the local cooperative Coffee Washing Station on the same day for pulping and controlled fermentation.',
    ],
    actionStepsRw: [
      'Gusoroma witonze: Kuroba gusa ibitumbwe bitukura buri minsi 7–10. Ntukigere uhata amashami yose rimwe!',
      'Kuroba mu mazi: Shyira ibitumbwe mu ibase y\'amazi ukuremo ibireremba hejuru (impeza).',
      'Rinda ikawa izuba ryinshi, umukungugu n\'amavuta ya moto mu gihe uyitwaye.',
      'Yishyikirize ikigo cyo kuyungurura (Washing Station) ku munsi nyirizina bitarenze amasaha 8.',
    ],
    precautionsEn: 'Never prune coffee trees with unsterilized tools during flowering season; protect plots with shade trees like Grevillea or Albizia.',
    precautionsRw: 'Ntugakondere ibiti by\'ikawa n\'imihoro yanduye; tera ibiti by\'igicucu nk\'umugereveya mu murima w\'ikawa.',
    expertConsultationEn: 'Connect with certified NAEB extensionists and cooperative agronomists on AgriBridge for washing station delivery schedules.',
    expertConsultationRw: 'Vugana n\'abashinzwe ikawa ba NAEB na koperative kuri AgriBridge umenye igihe inganda zifungurira.',
    keywordsEn: ['coffee', 'ikawa', 'cherries', 'grade a1', 'washing station', 'naeb', 'specialty coffee', 'rwanda'],
    keywordsRw: ['ikawa', 'ibitumbwe', 'soroma', 'washing station', 'naeb', 'koperative', 'igiciro'],
    locationContext: 'Western Province (Huye, Nyamagabe, Rutsiro, Karongi), Northern (Gakenke), Eastern (Kirehe)',
    source: 'NAEB & RAB Coffee Extension Manual',
    lastReviewed: '2026-02-11',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Registered Washing Stations',
      labelRw: 'Shaka Inganda Zitunganya Ikawa',
    },
  },

  // --- LIVESTOCK: GOATS & SHEEP HEALTH ---
  {
    id: 'livestock-goats-ppr-worms-21',
    topic: 'livestock',
    category: 'goats',
    questionEn: 'How do I protect goats from Peste des Petits Ruminants (PPR) and internal worms in Rwanda?',
    questionRw: 'Nigute narinda ihene n\'intama indwara ya PPR n\'inzoka mu nda?',
    directAnswerEn: 'Protect goats and sheep with annual PPR vaccination from the District Veterinary Office, routine deworming with Albendazole or Ivermectin at the start of each rainy season, and feeding on raised slatted wooden stalls.',
    directAnswerRw: 'Ihene n\'intama zirindwa no guhabwa urukingo rwa PPR buri mwaka bitangwa na veterinaire, guha amatungo imiti y\'inzoka (Albendazole cyangwa Ivermectin) mu ntangiriro z\'imvura, no kubaka ikiraro cy\'ibiti gisumbuye ubutaka (slatted floor).',
    causesEn: 'PPR is a viral disease causing high fever, mouth erosions, and foul diarrhea. Internal nematodes (Haemonchus contortus) proliferate in damp pasture, causing anemia (pale inner eyelids) and bottle jaw swelling under the chin.',
    causesRw: 'PPR iterwa na virusi izana umuriro mwinshi, ibisebe mu kanwa n\'impiswi. Inzoka zikwirakwira mu byatsi bifite ikime zikanywa amaraso zikazana kubyimba munsi y\'akananwa no kubura amaraso.',
    actionStepsEn: [
      'Check eye membrane color using FAMACHA guide: if inner eyelids are pale chalky white instead of healthy red/pink, deworm immediately.',
      'Housing: House goats in raised stalls (1 meter off the ground) with slatted bamboo floors so manure and urine fall through, keeping bedding completely dry.',
      'Cut-and-carry fodder: Cut grass and shrubs (Calliandra, Leucaena, sweet potato vines) and wilt them for 2 hours before feeding to reduce parasite cysts.',
      'Provide clean drinking water mixed with mineral salt blocks (umunyu w\'amatungo) daily.',
    ],
    actionStepsRw: [
      'Reba mu jisho ry\'ihene: niba munsi y\'ijisho harerurutse aho kuba umutuku, ha amatungo umuti w\'inzoka ako kanya.',
      'Ikiraro gisumbuye: Baka ikiraro cy\'imbaho cyangwa imigano kiri kuri metero 1 hejuru y\'ubutaka kugira ngo amase n\'inkari binyuremo hasi.',
      'Kuzanira ubwatsi mu kiraro (zero-grazing): Zanira ihene ubwatsi bwumyeho gato aho kuziragira mu byondo bibamo inzoka.',
      'Ha amatungo amazi meza n\'umunyu w\'amatungo (mineral block) buri munsi.',
    ],
    precautionsEn: 'Do not graze pregnant does in muddy communal swamps during heavy rainfall; avoid underdosing dewormers which causes drug resistance.',
    precautionsRw: 'Ntukaragire ihene zihaka mu bishanga birimo amazi; koresha ibipimo byanditswe ku muti w\'inzoka.',
    expertConsultationEn: 'Consult registered livestock agro-vets on AgriBridge for certified vaccine availability.',
    expertConsultationRw: 'Baza abaganga b\'amatungo banditse kuri AgriBridge amatariki y\'inkingo z\'ihene.',
    keywordsEn: ['goats', 'sheep', 'ihene', 'intama', 'ppr', 'worms', 'deworming', 'famacha', 'raised stall'],
    keywordsRw: ['ihene', 'intama', 'inzoka', 'ppr', 'ikiraro', 'umunyu', 'veterinaire', 'nyagatare'],
    locationContext: 'Nyagatare, Gatsibo, Bugesera, Kayonza & Nationwide',
    source: 'RAB Small Ruminant Health & Production Manual',
    lastReviewed: '2026-02-09',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Livestock Health Vets',
      labelRw: 'Shaka Abaganga b\'Amatungo',
    },
  },

  // --- LIVESTOCK: DAIRY CATTLE FODDER & SILAGE ---
  {
    id: 'livestock-dairy-fodder-silage-22',
    topic: 'livestock',
    category: 'cattle',
    questionEn: 'How can dairy farmers in Nyagatare maintain high milk yields during the dry season using fodder and silage?',
    questionRw: 'Nigute aborozi b\'i Nyagatare bagumana amata menshi mu mpeshyi bakoresheje ubwatsi n\'ububiko bwa Silage?',
    directAnswerEn: 'Maintain dry-season milk production by planting high-yield drought-tolerant fodder grasses (Brachiaria, Desmodium, Napier/Urubingo) during rains and conserving excess biomass into plastic silage bags with molasses for dry-season feeding.',
    directAnswerRw: 'Kugumana umusaruro w\'amata mu gihe cy\'izuba bisaba gutera ubwatsi bwihanganira amapfa (Brachiaria, Desmodium, Urubingo) mu gihe cy\'imvura, no kubika ubwatsi bw\'insindagirano (Silage) mu mifuka y\'amashashi ashyizwemo umushongi w\'isukari (molasses).',
    causesEn: 'During dry months (June–August in Eastern Province), pasture protein drops below 6%, causing cow milk yield to crash from 15L to 3L per day and severe weight loss.',
    causesRw: 'Mu mpeshyi muri Nyagatare n\'Uburasirazuba, intungamubiri mu byatsi ziragabanuka cyane bikagusha umusaruro w\'amata kuva kuri litiro 15 kugeza kuri litiro 3 ku munsi.',
    actionStepsEn: [
      'Plant Brachiaria (variety Mulato II or Cayman) and Napier grass along contours and borders during Season A and B rains.',
      'Chop green fodder at flowering stage (1 meter tall) into 2-3 cm pieces using a manual or motor forage chopper.',
      'Mix chopped fodder with diluted molasses (1 liter molasses per 3 liters water) to fuel beneficial lactic fermentation.',
      'Pack tightly into 50kg UV-resistant silage plastic tubing; stomp out all air pockets with boots and tie ends hermetically with rubber bands.',
      'Fermentation finishes in 3 weeks; properly sealed silage remains nutritious for up to 12 months.',
    ],
    actionStepsRw: [
      'Tera ubwatsi bwa Brachiaria n\'urubingo ku mbibi z\'umurima mu gihe cy\'imvura y\'umuhindo n\'itumba.',
      'Cagagura ubwatsi bugitoshye mu bice bito bya santimetero 2–3 ukoresheje imashini cyangwa umuhoro.',
      'Vanga ubwatsi n\'umushongi w\'isukari (molasses) ivanze n\'amazi kugira ngo ifashe ubwatsi kubika intungamubiri.',
      'Kandira neza mu mifuka ya Silage utuvungukire twose tuvuyemo umwuka, uzirike neza n\'imikwege.',
      'Silage iba yuzuye mu byumweru 3; ishobora kubikwa umwaka wose itangiritse igakoreshwa mu mpeshyi.',
    ],
    precautionsEn: 'Do not open silage bags until ready to feed; once opened, use the exposed portion within 2 days to prevent white fungal mold.',
    precautionsRw: 'Ntukafungure umufuka wa silage utiteguye kugaburira inka; iyo ufunguwe ugomba gukoreshwa mu minsi 2.',
    expertConsultationEn: 'AgriBridge connects cattle keepers with certified silage plastic suppliers and chopper rentals in Nyagatare.',
    expertConsultationRw: 'AgriBridge ifasha aborozi guhuzwa n\'abakodesha imashini zicagagura ubwatsi i Nyagatare.',
    keywordsEn: ['dairy', 'cattle', 'milk', 'fodder', 'brachiaria', 'silage', 'dry season', 'nyagatare', 'urubingo'],
    keywordsRw: ['inka', 'amata', 'ubwatsi', 'silage', 'brachiaria', 'urubingo', 'nyagatare', 'impeshyi'],
    locationContext: 'Eastern Province: Nyagatare, Gatsibo, Kayonza, Kirehe & Bugesera',
    source: 'RAB Animal Resources & Rwanda Dairy Development Program (RDDP)',
    lastReviewed: '2026-02-14',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Fodder Seeds & Silage Suppliers',
      labelRw: 'Shaka Imbuto z\'Ubwatsi n\'Imifuka ya Silage',
    },
  },

  // --- IRRIGATION & WATER HARVESTING ---
  {
    id: 'irrigation-dryland-rainwater-23',
    topic: 'irrigation',
    category: 'irrigation',
    questionEn: 'How can smallholder farmers harvest rainwater and use low-cost drip irrigation in Nyagatare and Bugesera?',
    questionRw: 'Nigute abahinzi bafata amazi y\'imvura bakanakoresha kuhira kwa drip mu bice byumye nka Nyagatare na Bugesera?',
    directAnswerEn: 'Smallholders can irrigate year-round by digging plastic-lined farm ponds (ibigega by\'amazi bya shitingi) of 50–100 cubic meters to catch rooftop and runoff water, feeding a gravity drip-irrigation kit that saves 60% water over bucket pouring.',
    directAnswerRw: 'Abahinzi bashobora kuhira umwaka wose bacukura ibigega by\'amazi byo mu gitaka bitwikirijwe na shitingi (dam sheets) by\'amazi 50–100 m³, byakira amazi y\'imvura, agakoreshwa mu buhinzi buhira ku mizi (drip irrigation) ikoresha amazi make cyane.',
    causesEn: 'Prolonged dry spells in Eastern savanna regions frequently wipe out crops during flowering stage if farmers rely 100% on erratic rainfall.',
    causesRw: 'Izuba ryinshi ry\'uburasirazuba rikunze kwica ibigori n\'imboga mu gihe cyo kurabyo iyo umuhinzi ateze amaso ku mvura gusa.',
    actionStepsEn: [
      'Excavate a trapezoidal pond (e.g., 6m long x 4m wide x 2.5m deep) with gentle side slopes to collect furrow runoff or rooftop rain.',
      'Line the floor and sides with 0.8mm or 1.0mm UV-resistant geomembrane plastic (shitingi) anchored in trenches at the edge.',
      'Cover the pond surface with shade netting or agroforestry canopy to reduce open water evaporation by up to 80%.',
      'Connect an elevated 500-liter header tank to drip-irrigation tape lines directly delivering water to crop root zones in early morning.',
    ],
    actionStepsRw: [
      'Cukura ikigega gifite impande zihengamye mu murima gikusanya amazi yose atemba n\'ay\'inzu.',
      'Sasamo shitingi ikomeye y\'amazi (geomembrane) uyizirike mu mirongo y\'ubutaka ku mpera z\'ikigega.',
      'Twikira hejuru y\'amazi n\'akanyanja k\'igicucu kugira ngo izuba ritayakamya.',
      'Shyiramo ikigega cy\'amazi hejuru kigaburira imiyoboro yoroheje ya drip yuhira ku mizi mu gitondo kare.',
    ],
    precautionsEn: 'Fence the farm pond with barbed wire or live euphorbia hedge to prevent children or livestock from falling in.',
    precautionsRw: 'Zitira ikigega cy\'amazi n\'inkingi z\'amahwa cyangwa ibiti kugira ngo abana n\'amatungo bitagwamo.',
    expertConsultationEn: 'Apply for the MINAGRI/RAB Small-Scale Irrigation Subsidy (SSIT) through your Sector Agronomist for up to 50% government support.',
    expertConsultationRw: 'Saba ubufasha bwa Leta bwa 50% bwo kuhira ku buso buto (SSIT) unyuze kuri Agronome w\'Umurenge.',
    keywordsEn: ['irrigation', 'water harvesting', 'drip', 'dam sheet', 'rainwater', 'nyagatare', 'bugesera', 'ssit'],
    keywordsRw: ['kuhira', 'amazi', 'ikigega', 'shitingi', 'drip', 'imvura', 'nyagatare', 'bugesera'],
    locationContext: 'Eastern Province: Nyagatare, Gatsibo, Bugesera, Kayonza, Kirehe',
    source: 'MINAGRI Small-Scale Irrigation Technology (SSIT) Program',
    lastReviewed: '2026-02-12',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Irrigation Suppliers',
      labelRw: 'Shaka Abacuruzi b\'Ibikoresho byo Kuhira',
    },
  },

  // --- ACCELERATED COMPOSTING & BOKASHI ---
  {
    id: 'compost-organic-bokashi-24',
    topic: 'soil_health',
    category: 'soil',
    questionEn: 'How do I make high-quality accelerated organic compost in 21 days?',
    questionRw: 'Nigute nakora ifumbire y\'imborera yihuta (Compost) nziza mu minsi 21 gusa?',
    directAnswerEn: 'Fast aerobic composting requires building a 1.5m x 1.5m pile with layered carbon browns (dry stalks, straw) and nitrogen greens (fresh weeds, cow/poultry manure), maintaining moisture like a squeezed sponge, and turning the pile every 5–7 days.',
    directAnswerRw: 'Gukora ifumbire y\'imborera yihuta bisaba gushinga ikirundo cya metero 1.5 kuri 1.5 kirimo ibyatsi byumye (karuboni) n\'ibyatsi bibisi hamwe n\'amase y\'inka cyangwa inkoko (azote), gushyiramo ubuhehere nk\'ubw\'isiponji, no guhindukiza ikirundo buri minsi 5–7.',
    causesEn: 'Cold, foul-smelling compost heaps occur when piles lack oxygen (unturned) or have excessive wet materials without dry straw structure.',
    causesRw: 'Iyo imborera inuka cyangwa idashyuha, biterwa no kubura umwuka (kutayihindukiza) cyangwa amazi menshi arenze urugero adafite ibyatsi byumye.',
    actionStepsEn: [
      'Layer 1: Place 15cm of coarse dry maize or sorghum stalks at the base for bottom aeration.',
      'Layer 2: Add 15cm of fresh green biomass (Calliandra, Tithonia/Icyikibuka, or vegetable scraps).',
      'Layer 3: Add 5cm of animal manure and a light sprinkle of topsoil and wood ash.',
      'Repeat layers until pile is 1.5 meters high; sprinkle water until damp throughout.',
      'Turn the pile completely on Day 5, Day 12, and Day 18. Heat should reach 60°C inside (steaming hot to touch). On Day 21, the compost is sweet-smelling, dark brown, and ready to use.',
    ],
    actionStepsRw: [
      'Umusozi wa 1: Shyira hasi santimetero 15 z\'ibishakara by\'ibigori cyangwa ibyatsi byumye kugira ngo umwuka winjiremo.',
      'Umusozi wa 2: Shyiraho santimetero 15 z\'ibyatsi bibisi (Icyikibuka/Tithonia, ibyatsi bitoshye).',
      'Umusozi wa 3: Shyiraho santimetero 5 z\'amase y\'amatungo n\'utuvu duke n\'igitaka.',
      'Subiramo ibyo byiciro kugeza ikirundo kigeze kuri metero 1.5; suka amazi aringaniye.',
      'Hindustura ikirundo ku munsi wa 5, uwa 12 n\'uwa 18. Ku munsi wa 21, ifumbire iba yahindutse umukara inuka nk\'ishyamba ryiza yiteguye gukoreshwa.',
    ],
    precautionsEn: 'Do not add plastics, diseased meat scraps, dog/cat feces, or perennial creeping weeds with mature seed heads into compost.',
    precautionsRw: 'Ntukajugunye amashashi, ibirwaye, umwanda w\'imbwa, cyangwa ibyatsi bifite imbuto zikuze mu ifumbire.',
    expertConsultationEn: 'Consult Community Agents to organize collective compost pits during community Umuganda.',
    expertConsultationRw: 'Fatanya n\'Abajyanama b\'ubuhinzi gukorera imborera hamwe mu muganda w\'umudugudu.',
    keywordsEn: ['compost', 'organic fertilizer', 'tithonia', 'manure', 'aerobic', 'soil health', 'imborera'],
    keywordsRw: ['imborera', 'compost', 'ifumbire', 'icyikibuka', 'tithonia', 'ubutaka', 'umuganda'],
    locationContext: 'All Rwanda Districts',
    source: 'RAB Agro-Ecology & Soil Health Department',
    lastReviewed: '2026-02-12',
    platformAction: {
      tab: 'training',
      labelEn: 'Watch Composting Video Guide',
      labelRw: 'Reba Amasomo yo Gukora Ifumbire',
    },
  },

  // --- RWANDAN CROPPING SEASONS & CALENDAR ---
  {
    id: 'seasons-rwandan-cropping-calendar-25',
    topic: 'rwanda_guidance',
    category: 'calendar',
    questionEn: 'What are Rwanda\'s official farming seasons (Season A, B, and C) and what should I plant in each?',
    questionRw: 'Ni ibihe bihembwe by\'ihinga mu Rwanda (Igihembwe A, B, na C) n\'ibihingwa bibereye buri gihembwe?',
    directAnswerEn: 'Rwanda operates under three national agricultural seasons: Season A (Umuhindo: September to January), Season B (Itumba: February to June), and Season C (Impeshyi / Marshland irrigation: July to September). Aligning your crop cycles with MINAGRI dates guarantees maximum rainfall and market aggregation.',
    directAnswerRw: 'Mu Rwanda hari ibihembwe bitatu by\'ihinga byemewe: Igihembwe A (Umuhindo: Nzeri kugeza Mutarama), Igihembwe B (Itumba: Gashyantare kugeza Kamena), n\'Igihembwe C (Impeshyi mu bishanga: Nyakanga kugeza Nzeri). Guhuza n\'aya matariki bituma ubona imvura ihagije n\'isoko ryiza.',
    causesEn: 'Planting too late in Season A or B causes crops to flower during drought periods, cutting yields severely and missing cooperative aggregation windows.',
    causesRw: 'Gutinda gutera bituma ibihingwa bihangana n\'amapfa igihe cyo kurabyo bityo umusaruro ukaba muke cyane.',
    actionStepsEn: [
      'Season A (Sept–Jan): Ideal for Maize, Bush/Climbing Beans, Soybeans, Groundnuts, Irish Potatoes, and Cassava planting.',
      'Season B (Feb–June): Ideal for Sorghum, Climbing Beans, Sweet Potatoes, Vegetables, and second-season Maize.',
      'Season C (July–Sept): Focused exclusively in developed marshlands (ibishanga) and irrigated river valleys for Irish Potatoes, Vegetables (cabbage, carrots, tomatoes), and Beans.',
      'Use the AgriBridge Farms & Plots tab to record your planting date and receive automatic stage milestone notifications.',
    ],
    actionStepsRw: [
      'Igihembwe A (Nzeri–Mutarama): Kibereye Ibigori, Ibishyimbo, Soya, Ubunyobwa, Ibirayi, n\'Imyumbati.',
      'Igihembwe B (Gashyantare–Kamena): Kibereye Amasaka, Ibishyimbo by\'imishingiriro, Ibijumba, Imboga, n\'ibigori bya kabiri.',
      'Igihembwe C (Nyakanga–Nzeri): Gikorerwa ahanini mu bishanga buhirwa n\'imigezi kiberanye n\'Ibirayi, Imboga (amashu, inyanya, karoti), n\'ibishyimbo by\'impeshyi.',
      'Koresha AgriBridge Farms & Plots wandike itariki wateyeho igihingwa cyawe uhabwe ubufasha ku gihe nyacyo.',
    ],
    precautionsEn: 'Always check the seasonal weather forecast issued by Meteo Rwanda and RAB before buying seed for the season.',
    precautionsRw: 'Banza umve iteganyagihe rya Meteo Rwanda na RAB mbere yo kugura imbuto z\'igihembwe.',
    expertConsultationEn: 'Consult your Sector Agronomist for subsidized seed distribution dates at the start of Season A and B.',
    expertConsultationRw: 'Baza Agronome w\'Umurenge amatariki yo gutangiraho imbuto na nkunganire ku ntangiriro za buri gihembwe.',
    keywordsEn: ['season a', 'season b', 'season c', 'umuhindo', 'itumba', 'impeshyi', 'calendar', 'planting dates', 'rwanda'],
    keywordsRw: ['igihembwe a', 'igihembwe b', 'igihembwe c', 'umuhindo', 'itumba', 'impeshyi', 'gutera', 'meteo rwanda'],
    locationContext: 'All Rwanda Provinces',
    source: 'MINAGRI National Crop Intensification Program (CIP) Calendar',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'farmer',
      labelEn: 'Track Crop Cycles in Plots',
      labelRw: 'Genzura Igihembwe mu Mirima',
    },
  },

  // --- SOIL ACIDITY & AGRICULTURAL LIME (ISHWAGARA) ---
  {
    id: 'soil-acidity-lime-ishwagara-26',
    topic: 'soil_health',
    category: 'soil',
    questionEn: 'How and when should Rwandan farmers apply Agricultural Lime (Ishwagara) to treat acidic soils?',
    questionRw: 'Ni ryari kandi nigute abahinzi mu Rwanda bagomba gukoresha Ishwagara ku butaka busharira?',
    directAnswerEn: 'Agricultural Lime (Ishwagara / CaCO3) is applied at 2.5 to 4 tonnes per hectare on acidic soils (pH below 5.5) 30 days before planting, incorporated 15–20cm into moist soil to neutralize toxic aluminum and release trapped phosphorus.',
    directAnswerRw: 'Ishwagara (CaCO3) ikoreshwa ku kigero cya toni 2.5 kugeza kuri 4 kuri hegitari ku butaka busharira (pH munsi ya 5.5) iminsi 30 mbere yo gutera, igacukurwa santimetero 15–20 mu butaka kugira ngo ivaneho ubusharire ifungure fosifore.',
    causesEn: 'High rainfall leaching in highland districts (Nyamagabe, Karongi, Musanze, Gicumbi) strips basic cations (calcium, magnesium), turning soil acidic and causing phosphorus fixation.',
    causesRw: 'Imvura nyinshi ku misozi ihanamye itwara imyunyungugu myiza ikasiga ubusharire bwinshi bufunga ifumbire yose umuhinzi ashyizemo igapfa ubusa.',
    actionStepsEn: [
      'Test soil pH with your local agro-dealer or RAB extensionist; liming is strictly needed if pH is 5.5 or lower.',
      'Broadcast finely ground agricultural lime evenly across plowed soil 3 to 4 weeks before planting.',
      'Incorporate the lime with a hoe into the top 15–20 cm of soil so moisture can activate neutralization.',
      'Apply standard organic compost and DAP/NPK fertilizer at planting as normal; the lime allows plants to absorb 100% of the fertilizer.',
    ],
    actionStepsRw: [
      'Pimisha ubutaka bwawe ku mucuruzi w\'ifumbire cyangwa Agronome; ishwagara ikenerwa iyo pH iri munsi ya 5.5.',
      'Kwirakwiza ishwagara iseye neza mu murima wose wamaze guhingwa ibyumweru 3 kugeza kuri 4 mbere yo gutera.',
      'Yivange n\'isuka mu butaka bujya hasi cm 15–20 kugira ngo ubuhehere bwayo butangire gukora.',
      'Ku munsi wo gutera, shyiramo imborera na DAP/NPK nk\'ibisanzwe; ishwagara ituma ibihingwa binywa ifumbire yose.',
    ],
    precautionsEn: 'Never mix lime directly with urea or diammonium phosphate (DAP) in the same bucket; chemical contact converts nitrogen into volatile ammonia gas.',
    precautionsRw: 'Ntukigere uvanga ishwagara na Urea cyangwa DAP mu ndobo imwe kuko bituma azote ihinduka umwuka igapfa ubusa.',
    expertConsultationEn: 'Check for subsidized lime distribution programs in Nyamagabe, Rutsiro, Karongi, and Gicumbi.',
    expertConsultationRw: 'Baza gahunda za Leta zitanga ishwagara ya nkunganire mu turere dufite ubutaka busharira.',
    keywordsEn: ['lime', 'ishwagara', 'acidic soil', 'ph', 'phosphorus', 'soil fertility', 'nyamagabe', 'karongi'],
    keywordsRw: ['ishwagara', 'ubusharire', 'ubutaka', 'ifumbire', 'ph', 'fosifore', 'agronome'],
    locationContext: 'Highlands: Southern, Western and Northern Provinces',
    source: 'RAB Soil Acid Neutralization & Liming Program',
    lastReviewed: '2026-02-13',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Lime Suppliers',
      labelRw: 'Shaka Abacuruzi b\'Ishwagara',
    },
  },

  // --- FOUNDERS & STORY OF AGRIBRIDGE RWANDA ---
  {
    id: 'founders-agribridge-story-27',
    topic: 'rwanda_guidance',
    category: 'agribridge',
    questionEn: 'Who founded AgriBridge Rwanda and what is the mission of the platform?',
    questionRw: 'Ninde washinze AgriBridge Rwanda kandi intego y\'uru rubuga n\'iyihe?',
    directAnswerEn: 'AgriBridge Rwanda was founded by IDRIS & MELODY under the foundational motto: "Growing Together. Connecting Markets." The platform was created to eliminate unfair middleman exploitation, empower smallholder farmers with transparent market prices, provide verified 100% offline agricultural guidance, and build trusted connections between farmers, buyers, input suppliers, and community agents across all Rwandan districts.',
    directAnswerRw: 'AgriBridge Rwanda yashinzwe na IDRIS & MELODY bafite intego igira iti: "Growing Together. Connecting Markets." (Dukurane. Twagure Amasoko). Uru rubuga rwashinzwe kugira ngo ruhe umuhinzi w\'umunyarwanda agaciro, rumukize abamamyi bagurisha ku giciro gito, rumuhe amakuru nyayo y\'ubuhinzi akora n\'igihe nta interineti ihari, kandi ruhuze abahinzi n\'abaguzi bakuru n\'abajyanama b\'ubuhinzi.',
    actionStepsEn: [
      'Empowering Smallholders: Transparent pricing for produce (Grade 1, 2, 3) directly to institutional and bulk buyers.',
      'Offline-First Technology: 100% functionality for farm plots, offline knowledge base, and voice assistants without needing continuous data.',
      'Community Agents: Stationed in sectors to support farmers who have basic feature phones.',
      'Complete Agri-Finances: Integrated profit-and-loss calculation for every single farm plot.',
    ],
    actionStepsRw: [
      'Guteza Imbere Umuhinzi: Igiciro cyiza cy\'umusaruro ku buryo butaziguye nta bamamyi barimo.',
      'Ikoranabuhanga Rikora Offline: Ubumenyi n\'ibarura ry\'imirima bikora 100% niyo waba nta interineti ufite.',
      'Abajyanama b\'Ubuhinzi (Community Agents): Bafasha abahinzi bafite telefone zisanzwe mu mirenge yose.',
      'Gucunga Imari: Kubarira umuhinzi inyungu n\'ibyasohotse kuri buri murima.',
    ],
    keywordsEn: ['idris', 'melody', 'founders', 'who made agribridge', 'mission', 'about us', 'growing together'],
    keywordsRw: ['idris', 'melody', 'abashinze', 'intego', 'agribridge', 'igitabo', 'amateka'],
    locationContext: 'Nyagatare, Kigali & All Rwanda',
    source: 'AgriBridge Rwanda Charter by Idris & Melody',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'Explore Marketplace Founded by Idris & Melody',
      labelRw: 'Sura Isoko ryashinzwe na Idris & Melody',
    },
  },

  // --- DISTRICTS & SECTORS COVERAGE ---
  {
    id: 'districts-coverage-rwanda-28',
    topic: 'rwanda_guidance',
    category: 'agribridge',
    questionEn: 'Which districts and sectors are covered by AgriBridge Rwanda?',
    questionRw: 'Ni utuhe turere n\'imirenge bikoreramo AgriBridge mu Rwanda?',
    directAnswerEn: 'AgriBridge covers all 14 sectors of Nyagatare District (Nyagatare, Mimuri, Karangazi, Rukomo, Rwempasha, Matimba, Katabagemu, Rwimiyaga, Musheri, Gatunda, Kiyombe, Karama, Tabagwe, Mukama) as its eastern hub, alongside active agricultural corridors across Gatsibo, Bugesera, Musanze, Rubavu, Rwamagana, Huye, Kayonza, and Kigali markets.',
    directAnswerRw: 'AgriBridge ikorera mu Mirenge yose 14 y\'Akarere ka Nyagatare (Nyagatare, Mimuri, Karangazi, Rukomo, Rwempasha, Matimba, Katabagemu, Rwimiyaga, Musheri, Gatunda, Kiyombe, Karama, Tabagwe, Mukama), igakora no mu turere twa Gatsibo, Bugesera, Musanze, Rubavu, Rwamagana, Huye, Kayonza, n\'amasoko ya Kigali.',
    actionStepsEn: [
      'Select your district and sector when registering a plot or listing produce to connect with local buyers.',
      'Discover Sector Community Agents stationed at your sector administrative or cooperative aggregation points.',
      'Check local weather alerts tailored specifically to your sector\'s micro-climate.',
    ],
    actionStepsRw: [
      'Hitamo akarere n\'umurenge uherereyemo iyo wandika umurima cyangwa ushyira umusaruro ku isoko.',
      'Menya abajyanama ba AgriBridge (Community Agents) bari mu murenge wawe.',
      'Reba iteganyagihe n\'amakuru y\'imvura yihariye ku murenge wawe.',
    ],
    keywordsEn: ['districts', 'sectors', 'nyagatare', 'mimuri', 'karangazi', 'rukomo', 'rwempasha', 'matimba', 'katabagemu', 'musanze', 'bugesera'],
    keywordsRw: ['akarere', 'umurenge', 'nyagatare', 'mimuri', 'karangazi', 'rukomo', 'rwempasha', 'matimba', 'musanze', 'bugesera', 'rwamagana'],
    locationContext: 'Nyagatare (All 14 Sectors), Eastern, Northern, Southern & Kigali',
    source: 'AgriBridge Territorial Agricultural Mapping',
    lastReviewed: '2026-02-15',
    platformAction: {
      tab: 'directory',
      labelEn: 'View Local Sector Directory',
      labelRw: 'Reba Urutonde rw\'Umurenge',
    },
  },
];
