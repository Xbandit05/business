/**
 * AgriBridge Rwanda — Expanded Agricultural & Platform Knowledge Base
 * Fully complies with RAB (Rwanda Agriculture Board), MINAGRI, FAO, and RICA extension guidelines.
 * Features 24 comprehensive knowledge packages covering Weed Management, Soil Types,
 * Diagnostic Follow-up Protocols, Nutrition, IPM, Diseases, Water, Post-Harvest, Livestock, and Finance.
 */

import { KnowledgeEntry } from './agriKnowledgeBase.ts';

export const EXPANDED_AGRI_KNOWLEDGE_BASE: KnowledgeEntry[] = [
  // =========================================================================
  // A. WEED MANAGEMENT (PRIORITY CATEGORY)
  // =========================================================================

  // 1. Weed Fundamentals
  {
    id: 'weed-fundamentals-29',
    topic: 'weed_management',
    category: 'weeds',
    problemType: 'weeds',
    questionEn: 'What are weeds, how do they compete with crops, and why does the soil weed seed bank matter?',
    questionRw: 'Ibyatsi bibi (imyobo/ibyatsi bibi) ni iki, bibangamira bite ibihingwa, kandi kuki imbuto ziri mu butaka ziteza ikibazo?',
    directAnswerEn: 'Weeds are unwanted, vigorous plants that compete aggressively with cultivated crops for essential sunlight, soil water, root space, and nitrogen/phosphorus nutrients. They drastically reduce harvest yield (often by 30% to over 80%), degrade produce quality, and harbor devastating pests (like aphids, cutworms, and stalk borers) and crop viruses. Because a single mature weed can deposit thousands of dormant seeds into the soil seed bank that survive for 5 to 20 years, effective weed management requires preventing seed production, not merely clearing existing vegetation.',
    directAnswerRw: 'Ibyatsi bibi ni ibimera biba mu murima bitahinzwe bibangamira ibihingwa mu guhatanira urumuri rw\'izuba, amazi yo mu butaka, umwanya w\'imizi, n\'ifumbire (azote na fosifore). Bigabanya umusaruro hejuru ya 30% kugeza kuri 80%, bikangiza ubwiza bw\'imyaka, bikanatungirwamo udukoko (nk\'inda, inyo zicukura, na nkongwa) n\'indwara za virusi. Kubera ko icyatsi kimwe kikuze gishobora kurunda ibihumbi by\'imbuto mu butaka (soil seed bank) zishobora kumera nyuma y\'imyaka 5 kugeza kuri 20, kurwanya ibyatsi bisaba kubirandura bitararabyo ngo bitereke imbuto mu murima.',
    causesEn: 'Weeds spread through wind-borne and water-borne seeds, contaminated commercial seed, livestock manure containing viable seeds, farm tools/machinery, and aggressive underground root systems (perennial rhizomes, stolons, and tubers). Annual weeds complete their life cycle in one season and produce massive seed volumes; perennial weeds survive across multiple years using deep underground reserves.',
    causesRw: 'Ibyatsi bibi bikwirakwizwa n\'umuyaga, amazi atemba mu murima, imbuto zanduye, manyire irimo imbuto zitaboze, amasuka n\'imashini byanduye, n\'imizi yo munsi y\'ubutaka yikururira (rhizomes na tubers). Ibyatsi by\'igihe gito (annuals) bitanga imbuto nyinshi cyane mu gihe gito; ibyatsi by\'imyaka myinshi (perennials) byigumira mu butaka bifite imizi ifashe hasi cyane.',
    missingInfoQuestionsEn: [
      'Which crop is currently growing in the field?',
      'How old is the crop (days since planting or growth stage)?',
      'Are the weeds broadleaf plants, narrow-leaved grasses, or triangular sedges?',
      'Are the weeds growing in isolated patches or choking the entire plot?'
    ],
    missingInfoQuestionsRw: [
      'Ni ikihe gihingwa kiri mu murima wanyu ubu?',
      'Igihingwa kimaze iminsi ingahe gitewe (cyangwa kigeze ku yihe ntambwe)?',
      'Ese ibyo byatsi ni ibifite amababi agari, ibyatsi birebire byo mu bwoko bw\'ubwatsi, cyangwa ibyatsi byitwa indagara (sedges)?',
      'Ese byameze ahantu hamwe na hamwe cyangwa byarenze umurima wose?'
    ],
    actionStepsEn: [
      'Uproot or hoe weeds before they produce flowers and viable seeds to progressively deplete the soil seed bank over 2–3 seasons.',
      'Scout field edges, irrigation furrows, and bunds; weeds growing on borders easily release seeds into cultivated plots.',
      'Always compost livestock manure thoroughly for at least 6–8 weeks with internal heat reaching 55–60°C to destroy weed seed viability before soil application.',
      'Clean tractor discs, hoes, and shoes when moving from a heavily weed-infested plot to a clean field.'
    ],
    actionStepsRw: [
      'Randura cyangwa bagara ibyatsi bibi mbere y\'uko birabyo ngo bitereke imbuto, kugira ngo ugabanure imbuto ziri mu butaka mu bihembwe 2–3 biri imbere.',
      'Suzuma imbibi z\'umurima, imiferege y\'amazi n\'amaterasi; ibyatsi byo ku nkombe birandukira mu murima byoroshye.',
      'Oza ifumbire y\'imborera neza mu gihe cy\'ibyumweru 6–8 ubushyuhe bwayo bugere kuri dogere 55–60 kugira ngo imbuto z\'ibyatsi zibemo zipfe mbere yo kuyishyira mu murima.',
      'Sukura amasuka, imashini n\'inkweto igihe uvuye mu murima urimo ibyatsi byinshi werekeza mu murima usukuye.'
    ],
    whatToAvoidEn: 'Do NOT leave pulled mature weeds with seed heads on field edges or in irrigation ditches, as wind and irrigation water will wash seeds back into crop rows.',
    whatToAvoidRw: 'Ntukigere ureka ibyatsi bibi byamaze kurabyo ku nkengero z\'umurima cyangwa mu migezi, kuko umuyaga n\'amazi byongera kubigarura mu murima.',
    precautionsEn: 'Take special care when pulling creeping perennial weeds (e.g., Couch grass / Urwiri, Nut sedge / Indagara); leaving broken underground tubers or nodes in moist soil triggers rapid re-sprouting.',
    precautionsRw: 'Witondere gukuramo ibyatsi by\'urwiri n\'indagara; gusiga uduce tw\'imizi cyangwa udusaro mu butaka buhehereye bituma byongera kumera vuba.',
    expertConsultationEn: 'Consult your Sector Agronomist if parasitic weeds like Striga (Witchweed / Icyokombwa) attach to maize/sorghum roots.',
    expertConsultationRw: 'Baza Agronome w\'Umurenge niba ubonye icyatsi cyitwa Icyokombwa (Striga) gifata ku mizi y\'ibigori cyangwa amasaka kuko gitera igihombo kirenga 80%.',
    keywordsEn: ['weeds', 'weed competition', 'seed bank', 'striga', 'rhizomes', 'broadleaf', 'grass weeds', 'sedges', 'couch grass'],
    keywordsRw: ['ibyatsi bibi', 'urwiri', 'indagara', 'icyokombwa', 'striga', 'kubagara', 'imbuto z\'ubutaka', 'umurima'],
    locationContext: 'All Agro-Ecological Zones in Rwanda',
    source: 'RAB Weed Management Manual & FAO Integrated Weed Management Guidelines',
    sourceOrganization: 'RAB',
    sourceTitle: 'National Weed Management and Crop Competition Guide',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'training',
      labelEn: 'Open Weed Management Audio Lessons',
      labelRw: 'Umva Amasomo yo Kurwanya Ibyatsi Bibi',
    },
  },

  // 2. Weed Identification Framework
  {
    id: 'weed-identification-30',
    topic: 'weed_management',
    category: 'weeds',
    problemType: 'weeds',
    questionEn: 'How can I identify weeds in my field by their leaf shape, stems, and root structure?',
    questionRw: 'Nigute namenya ubwoko bw\'ibyatsi bibi mu murima nkurikije amababi, amashami n\'imiterere y\'imizi?',
    directAnswerEn: 'Agricultural weeds are categorized into three botanical groups: Broadleaf weeds (Dicotyledons with wide, netted-veined leaves, branching stems, and deep taproots), Grass weeds (Monocotyledons with hollow cylindrical stems, narrow parallel-veined leaves, and fibrous roots), and Sedges (distinguished by solid, triangular stems in cross-section, 3-ranked leaves, and underground nut-like tubers). Identifying the botanical group is mandatory because selective herbicides and mechanical weeding tools behave completely differently on broadleaves versus grasses versus sedges. If you share a clear photo of the leaf arrangement, stem cross-section, and root base, AgriBridge AI can assess plausible species; however, field confirmation with a Sector Agronomist is recommended before any chemical purchase.',
    directAnswerRw: 'Ibyatsi bibi bicikamo amatsinda atatu y\'ingenzi: Ibyatsi bifite amababi agari (Dicots: amababi agari afite imitsi inyuranamo, amashami yashibitse, n\'umuzi mugari w\'igishyitsi), Ibyatsi bimeze nk\'ubwatsi (Grasses: ibiti bifite amababi abonerana afite imitsi igororotse n\'imizi y\'ubudodo), n\'Indagara (Sedges: zirangwa n\'igiti gifite inguni eshatu / mpandeshatu, amababi 3 azengurutse, n\'utubuto tumeze nk\'insyo munsi y\'ubutaka). Kumenya itsinda ni ngombwa kuko imiti n\'uburyo bwo kubagara bitandukana cyane. Niba uhaye AgriBridge AI ifoto igaragaza neza ikibabi, igiti, n\'imizi, iraguha ibitekerezo byizewe, ariko ni byiza kwereka Agronome w\'Umurenge mbere yo kugura umuti.',
    causesEn: 'Different weed types adapt to specific soil conditions: sedges thrive in waterlogged valleys and marshlands (ibishanga); deep-rooted broadleaves dominate compacted soils; annual grasses flourish in warm, fertilized seedbeds alongside maize and sorghum.',
    causesRw: 'Ubwoko bw\'ibyatsi bumenyera ahantu hatandukanye: indagara zikunda ibishanga n\'ahantu hahora amazi; ibyatsi bifite imizi miremire bikunda ubutaka bwakanyaraye; ibyatsi bito by\'ubwatsi bikunda ubutaka burimo ifumbire hamwe n\'ibigori n\'amasaka.',
    missingInfoQuestionsEn: [
      'Roll a stem between your fingers: is it round and hollow (grass), round and solid/branched (broadleaf), or clearly triangular with 3 sharp edges (sedge)?',
      'What do the leaves look like: oval with branching veins, or long blades with straight lines?',
      'Can you upload or take a close-up photo showing the stem base, leaf junction, and roots?'
    ],
    missingInfoQuestionsRw: [
      'Zunguza igiti cy\'icyatsi mu ntoki: ese kirazengurutse kirimo ubusa (grass), kirazengurutse gishyitse (broadleaf), cyangwa gifite inguni 3 zikoze mpandeshatu (indagara)?',
      'Amababi ameze ate: ese ni amagi afite imitsi inyuranamo, cyangwa ni maremare afite imitsi igororotse?',
      'Ese washobora gufata ifoto ifotoye hafi y\'igiti, ihuriro ry\'amababi n\'imizi?'
    ],
    actionStepsEn: [
      'Examine the stem cross-section: If triangular, you are dealing with Cyperus sedges (Indagara); manual hoeing must dig deep to extract the underground nutlets.',
      'Examine leaf veins: Parallel lines indicate grasses; netted/branching veins indicate broadleaves (e.g., Galinsoga, Amaranthus/Imbwire, Bidens/Inyabarasanya).',
      'Check root structure: Fibrous shallow roots can be easily hoed during sunny mornings so sun desiccates the exposed roots.',
      'For image submissions: Provide well-lit photos showing both top leaf surface and the root crown for maximum diagnostic assistance.'
    ],
    actionStepsRw: [
      'Reba imiterere y\'igiti: Niba gifite inguni eshatu, ni Cyperus (Indagara); kubagara bisaba gucukura hasi ugakuramo utubuto two munsi y\'ubutaka.',
      'Reba imitsi y\'amababi: Imitsi igororotse ni ubwatsi bwo mu bwoko bwa nyakatsi; imitsi inyuranamo ni amababi agari (urugero: Inyabarasanya, Imbwire/Amaranthus).',
      'Reba imizi: Imizi y\'ubudodo yoroshye gukuramo mu gitondo izuba ryava rigahita ryumisha imizi igapfa.',
      'Niba ushyiraho ifoto: Fata ifoto igaragaza neza amababi, igiti n\'aho gihurira n\'ubutaka kugira ngo uhabwe ubufasha bunoze.'
    ],
    whatToAvoidEn: 'Never guess herbicide applications based solely on superficial weed appearance; applying a grass-selective herbicide on broadleaf weeds wastes money and will not kill the target weed.',
    whatToAvoidRw: 'Ntukigere ugura umuti w\'ibyatsi utazi ubwoko bwabyo; gukoresha umuti wica ubwatsi bwa nyakatsi ku byatsi by\'amababi agari bituma upfusha ubusa amafaranga ntibipfe.',
    precautionsEn: 'Handle unidentified thorny or latex-producing weeds with protective gloves to avoid dermatitis or skin irritation.',
    precautionsRw: 'Witondere gufata n\'intoki ibyatsi bibi bifite amahwa cyangwa amata yera kuko bishobora gusharira uruhu rwawe.',
    expertConsultationEn: 'When in doubt, take a fresh weed specimen with roots and flowers to the Sector Agronomist or cooperative agronomist.',
    expertConsultationRw: 'Iyo ushidikanya, fashaho icyatsi kizima gifite amashurita n\'imizi ukijyane kwa Agronome w\'Umurenge agisuzume.',
    keywordsEn: ['weed identification', 'broadleaf', 'grass', 'sedge', 'triangular stem', 'leaf shape', 'taproot', 'photo identification'],
    keywordsRw: ['kumenya ibyatsi', 'amababi agari', 'indagara', 'inyabarasanya', 'imbwire', 'urwiri', 'ifoto', 'agronome'],
    locationContext: 'All Rwanda Agricultural Corridors',
    source: 'RAB Crop Protection Department & RICA Weed Identification Atlas',
    sourceOrganization: 'RICA',
    sourceTitle: 'Field Manual of Rwandan Arable Weeds',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'ai',
      labelEn: 'Use Crop Problem & Weed Diagnostic Assistant',
      labelRw: 'Koresha Ubufasha bwo Gusuzuma Ibyatsi n\'Imyaka',
    },
  },

  // 3. Integrated Weed Management (IWM)
  {
    id: 'weed-iwm-integrated-31',
    topic: 'weed_management',
    category: 'weeds',
    problemType: 'weeds',
    questionEn: 'What is Integrated Weed Management (IWM) and how does combining cultural, mechanical, and biological practices reduce costs?',
    questionRw: 'Integrated Weed Management (IWM) ni iki, kandi guhuza uburyo bwa kamere, isuka, n\'ubundi buhanga bigabanya bite ikiguzi cyo kubagara?',
    directAnswerEn: 'Integrated Weed Management (IWM) is a holistic strategy combining proactive cultural practices (stale seedbed preparation, proper crop spacing, cover cropping, mulching, crop rotation) with mechanical methods (hand hoeing, rotary weeding) and judicious, label-compliant chemical use only when economic thresholds dictate. Rather than relying on a single weed control method (such as continuous herbicide spraying or back-breaking late weeding), IWM targets weeds across their entire life cycle: reducing weed seed germination, maximizing crop canopy shade to choke emerging weeds, depleting the underground weed seed bank, and preventing new seeds from ever entering the soil. This integrated approach cuts farmer weeding expenses by up to 50% while preserving soil structure and earthworm biology.',
    directAnswerRw: 'Integrated Weed Management (IWM) ni uburyo bwo guhuza ingamba zitandukanye: uburyo bw\'ubuhinzi (gutegura umurima hakiri kare / stale seedbed, gutera ku ntera nyayo ngo ibihingwa bipfuke ubutaka, gusasa ibisheke/ibyatsi byumye, gusimburanya ibihingwa) hamwe no kubagara n\'isuka ku gihe, hagakoreshwa umuti gusa igihe bikenewe cyane birenze urugero. Aho kwishingikiriza ku muti gusa cyangwa kubagara bitinze byananiye umuhinzi, IWM irwanya ibyatsi mu byiciro byose: irinda imbuto kumera, ituma igihingwa gikura vuba kigapfuka izuba ibyatsi ntibikure, igashirisha imbuto zo mu butaka, ikanabuza ibyatsi gushyiramo imbuto nshya. Ubu buryo bugabanya ikiguzi cyo kubagara hejuru ya 50% bikanarinda uburumbuke bw\'ubutaka.',
    causesEn: 'Relying exclusively on one weed control method (e.g., repeated glyphosate or 2,4-D sprays) inevitably triggers herbicide resistance, shifts weed flora toward hard-to-kill perennial sedges, and pollutes community groundwater.',
    causesRw: 'Kwishingikiriza ku muti umwe gusa buri gihe bituma ibyatsi bimenyera uwo muti bikanga gupfa (herbicide resistance), bigatuma habaho ibyatsi bikaze bitapfa by\'urwiri n\'indagara, bikananduza amazi yo mu butaka.',
    actionStepsEn: [
      'Stale Seedbed Technique: Prepare seedbeds 2–3 weeks before intended planting; allow rains to germinate the top flush of weed seeds, then lightly hoe or shallow-harrow them to destroy the seedlings before sowing your main crop.',
      'Optimal Plant Spacing: Follow RAB recommended planting densities (e.g. 75cm x 25cm for single-seed maize, 50cm x 20cm for climbing beans). Dense uniform crop canopies intercept 90% of sunlight, naturally starving weed seedlings.',
      'Mulching: Spread 5–10cm of dry crop residues, maize stover, or dry grass across vegetable and coffee beds to physically suppress weed emergence and retain soil moisture.',
      'Intercropping: Intercrop tall cereals (maize, sorghum) with creeping legumes (beans, cowpeas, desmodium); the living legume cover shades the inter-row soil and smothers weeds.',
      'Tool Cleaning: Wash hoes and cultivator tines before moving between plots to avoid moving perennial rhizomes.'
    ],
    actionStepsRw: [
      'Guteza Ibyatsi Kumera Mbere (Stale Seedbed): Hingura umurima ibyumweru 2–3 mbere yo gutera; reka imvura igwe ibyatsi byo hejuru bimere, hanyuma ubikubure hejuru n\'isuka ubyice mbere yo gutera imbuto nyirizina.',
      'Intera Nyayo yo Gutera: Kurikiza ibipimo bya RAB (urugero: cm 75 kuri cm 25 ku bigori, cm 50 kuri cm 20 ku bishyimbo). Iyo ibihingwa bikuranye ubucucike bwiza bipfuka izuba 90% ibyatsi bito bikabura urumuri bikuma.',
      'Gusasira (Mulching): Sasaho santimetero 5–10 z\'ibisheke byumye, amakoma cyangwa ibyatsi byumye mu mboga n\'ikawa kugira ngo bibuze ibyatsi kumera bikanabika amazi.',
      'Guhuza Ibihingwa (Intercropping): Vanga ibihingwa birebire nk\'ibigori n\'ibinyamisogwe bipfuka ubutaka (ibishyimbo, soya, desmodium) bipfuka ubutaka bikica ibyatsi bibi.',
      'Gusukura Amasuka: Oza amasuka n\'ibikoresho mbere yo kuva mu murima umwe ujya mu wundi.'
    ],
    whatToAvoidEn: 'Do NOT allow weeds to reach flowering stage before beginning mechanical or hand weeding; once weeds flower, seed shedding is guaranteed.',
    whatToAvoidRw: 'Ntukigere ureka ibyatsi bibi ngo bigere ku ntambwe yo kurabyo utarabagara; iyo byarabyije biba byataye imbuto mu butaka.',
    precautionsEn: 'When mulching, ensure the mulch material is completely free of mature weed seed heads or perennial grass roots (e.g. Couch grass stolons).',
    precautionsRw: 'Mu gihe usasira umurima, menya neza ko ibyatsi usashije bidafite imbuto zikuze cyangwa imizi y\'urwiri itapfuye.',
    expertConsultationEn: 'Consult the Sector Agronomist or Farmer Field School (FFS) facilitator in your sector for hands-on demonstrations of push-hoe cultivators.',
    expertConsultationRw: 'Baza Agronome w\'Umurenge cyangwa abayobozi ba Farmer Field School (Ishuri ryo mu Murima) bakwereke uburyo bwo gukoresha ibikoresho byoroshye byo kubagara.',
    keywordsEn: ['integrated weed management', 'iwm', 'mulching', 'stale seedbed', 'crop spacing', 'intercropping', 'seed bank reduction'],
    keywordsRw: ['iwm', 'gusasira', 'gutera ku ntera', 'gusimburanya ibihingwa', 'kubagara', 'stale seedbed', 'ubuhinzi bunoze'],
    locationContext: 'All Rwandan Farming Districts',
    source: 'RAB Integrated Crop Management Guidelines & FAO Conservation Agriculture Manual',
    sourceOrganization: 'RAB',
    sourceTitle: 'Integrated Weed Management Best Practices for Smallholders',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'training',
      labelEn: 'Explore Conservation Agriculture Lessons',
      labelRw: 'Amasomo y\'Ubuhinzi Bwubungabunga Ubutaka',
    },
  },

  // 4. Weed Timing & Critical Weed-Free Period (CWFP)
  {
    id: 'weed-critical-timing-32',
    topic: 'weed_management',
    category: 'weeds',
    problemType: 'weeds',
    questionEn: 'Why does weeding timing matter, and what is the Critical Weed-Free Period for Rwandan crops?',
    questionRw: 'Kuki igihe cyo kubagara ari ingenzi cyane, kandi ni ibihe bihe by\'ingenzi umurima ugomba kuba usukuye (Critical Weed-Free Period)?',
    directAnswerEn: 'Weed timing is the single most decisive factor determining harvest yield. Every crop has a scientifically established "Critical Weed-Free Period" (CWFP) — the specific window early in crop growth during which weed competition inflicts irreversible yield loss. For maize, the CWFP is between 2 and 6 weeks after germination (from 3-leaf stage to knee-high / V8 stage); for dry beans, it is between 2 and 4 weeks; for Irish potatoes, it is from emergence until full ridge canopy closure (approx. 4–5 weeks). Weeding too late — even if the field is made perfectly clean afterward — cannot recover the lost yield because young crop root systems have already been stunted by competition. Conversely, keeping the field 100% clean during the CWFP allows the crop canopy to shade out subsequent weed flushes with minimal late-season labor.',
    directAnswerRw: 'Igihe cyo kubagara nicyo kintu cya mbere kigena umusaruro uzasarurwa. Buri gihingwa kigira igihe cy\'ingenzi cyitwa "Critical Weed-Free Period" — igihe cyo mu ntangiriro z\'igihingwa aho icyatsi kibangamiye imyaka giteza igihombo kidashobora gusanwa n\'iyo wabagara nyuma. Mu bigori, icyo gihe ni hagati y\'ibyumweru 2 kugeza kuri 6 bimaze kumera (kuva bifite amababi 3 kugeza bigeze mu ntege); mu bishyimbo, ni hagati y\'ibyumweru 2 kugeza kuri 4; mu birayi, ni kuva bimaze kumera kugeza bitwikiriye ubutaka bwose (ibyumweru 4–5). Kubagara bitinze n\'iyo umurima wawe wasukurwa neza ute ntibikiza igihombo kuko imizi y\'imyaka iba yaramaze gukendera no kwicwa n\'inzara. Iyo ubagaye muri icyo gihe cyabugenewe, imyaka irakura igapfuka ubutaka ku buryo ibyatsi biza nyuma bitakigira icyo bitwara.',
    causesEn: 'Young crop seedlings invest significant energy establishing their initial root systems and expanding their photosynthetic leaves. During this sensitive phase, fast-germinating weeds outgrow the crop, absorbing over 70% of available mobile soil nitrogen and root-zone water within the first 30 days.',
    causesRw: 'Ingemwe zikiri nto zikoresha imbaraga nyinshi zikora imizi zikanakuza amababi yo kwifashisha izuba. Muri icyo gihe cyoroshye, ibyatsi bibi bikura vuba cyane bikanywa hejuru ya 70% bya azote n\'amazi byo mu butaka mu minsi 30 ya mbere.',
    missingInfoQuestionsEn: [
      'What crop did you plant and on what exact date?',
      'How tall is the crop right now (e.g., knee-high, flowering, or mature)?',
      'Have you conducted the first weeding yet since germination?'
    ],
    missingInfoQuestionsRw: [
      'Mwateye ikihe gihingwa kandi mwayiteye ku yihe tariki?',
      'Igihingwa kigeze ku buhe burebure ubu (urugero: kirenga hasi, kigeze mu ntege, kirabyije, cyangwa cyeze)?',
      'Ese mwamaze kubagara bwa mbere kuva cyamera?'
    ],
    actionStepsEn: [
      'First Weeding (Critical): Perform the first thorough weeding within 14–21 days (2–3 weeks) after crop emergence across maize, beans, and potatoes.',
      'Second Weeding / Earthing Up: Conduct second weeding 4–6 weeks after planting (around knee-high stage in maize, or during buta/hilling in potatoes) before crops flower.',
      'Prevent Late Seed Rain: Even after the critical period, quickly hand-pull or rogue tall solitary weeds (especially Amaranthus or Datura) before they disperse seeds into the soil for next season.',
      'Plan weeding operations during bright, sunny mornings so that uprooted weed roots dry and die within hours under midday sun.'
    ],
    actionStepsRw: [
      'Kubagara bwa Mbere (Icy\'Ingenzi Cyane): Bagara bwa mbere mu minsi 14 kugeza kuri 21 (ibyumweru 2–3) ibihingwa bikimara kumera mu bigori, ibishyimbo n\'ibirayi.',
      'Kubagara bwa Kabiri / Guhira Ubutaka: Bagara bwa kabiri mu byumweru 4 kugeza kuri 6 umaze gutera (ibigori bigeze mu ntege, cyangwa mu birayi igihe ubuta) mbere y\'uko birabyo.',
      'Kwirinda Imbuto z\'Ibyatsi zikuze: N\'iyo igihe cyo kubagara cyaba cyararangiye, randura ibyatsi birebire bishoreranye (nk\'imbwire) mbere y\'uko bitereka imbuto zikaguma mu murima.',
      'Bagara mu masaha ya mu gitondo izuba ryitegura kuva kugira ngo izuba ry\'amanywa rihite ryumisha imizi y\'ibyatsi bibi bipfe.'
    ],
    whatToAvoidEn: 'Do NOT delay weeding while waiting for fertilizer to "boost the crop first"; applying top-dressing fertilizer (like Urea) to a weed-choked field will feed the weeds faster than the crop.',
    whatToAvoidRw: 'Ntukigere utinda kubagara ngo utegereze ifumbire ngo "ibanza ikuze igihingwa"; gushyira ifumbire (nka Urea) mu murima urimo ibyatsi bituma ibyatsi bibi aribyo biyinywa mbere y\'ibigori.',
    precautionsEn: 'Avoid deep hoeing too close to crop stems during the second weeding, which can sever feeder roots and introduce soil fungal pathogens.',
    precautionsRw: 'Irinde gucukura isuka hasi cyane hafi y\'igiti cy\'urugori mu kubagara bwa kabiri, kuko wacagagura imizi mito igihingwa kigacika intege.',
    expertConsultationEn: 'Track your crop planting dates inside AgriBridge Farms & Plots to receive automatic stage-specific weeding alerts.',
    expertConsultationRw: 'Andika amatariki yo gutera muri AgriBridge Farms & Plots kugira ngo uhabwe ubutumwa bwa tekiniki bukuburira igihe cyo kubagara kigeze.',
    keywordsEn: ['critical weed free period', 'cwfp', 'weeding timing', 'first weeding', 'second weeding', 'maize weeding', 'knee high'],
    keywordsRw: ['igihe cyo kubagara', 'kubagara bwa mbere', 'kubagara bwa kabiri', 'urugori mu ntege', 'ibirayi', 'ibishyimbo', 'umusaruro'],
    locationContext: 'All Agro-Ecological Zones in Rwanda',
    source: 'RAB Crop Science Technical Advisory & African Crop Science Journal',
    sourceOrganization: 'RAB',
    sourceTitle: 'Critical Periods of Weed Competition in Rwandan Food Crops',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'farmer',
      labelEn: 'Track Plot Crop Stages & Weeding Windows',
      labelRw: 'Genzura Igihe Cy\'Imyaka no Kubagara mu Mirima',
    },
  },

  // 5. Herbicide Safety & Responsible Stewardship
  {
    id: 'weed-herbicide-safety-33',
    topic: 'weed_management',
    category: 'weeds',
    problemType: 'weeds',
    questionEn: 'What are selective vs non-selective and pre-emergence vs post-emergence herbicides, and what safety rules must be followed?',
    questionRw: 'Ese imiti yica ibyatsi ya selective na non-selective itandukaniye he, kandi ni ayahe mabwiriza y\'umutekano agomba kubahirizwa?',
    directAnswerEn: 'Herbicides are chemical crop protection tools classified by mode of action and application timing: Selective herbicides kill target weed species while leaving the specified crop undamaged (e.g. 2,4-D selectively targets broadleaf weeds in cereal crops without killing maize/sorghum), whereas Non-Selective herbicides kill all green vegetation they contact (e.g. glyphosate or glufosinate, used only for total land clearing before planting). Pre-emergence herbicides are applied to moist soil before weeds germinate to form a chemical barrier, while Post-emergence herbicides are sprayed onto growing green weed leaves. Contact herbicides only kill the plant tissue they directly touch, whereas Systemic herbicides translocate through the vascular system down to underground roots and rhizomes. Chemical herbicides must strictly be used according to the registered manufacturer label approved by RAB and MINAGRI: never fabricate dosages, never spray during high winds to avoid spray drift onto neighboring food crops, always wear complete Personal Protective Equipment (PPE), and triple-rinse and puncture empty chemical containers so they are never reused for drinking water or food storage.',
    directAnswerRw: 'Imiti yica ibyatsi bibi igabanywamo amatsinda hakurikijwe uko ikora n\'igihe iterwa: Imiti ya "Selective" yica ibyatsi runaka igasiga igihingwa cyahinzwe ntacyo kibaye (urugero: umuti wica amababi agari mu bigori ariko ntugire icyo utwara ibigori), mu gihe imiti ya "Non-Selective" yica ikimera cyose cy\'icyatsi kigezweho n\'umuti (nk\'umuti uhingisha ukoreshwa mbere yo gutera gusa). Imiti ya "Pre-emergence" iterwa mu butaka buhehereye mbere y\'uko imbuto z\'ibyatsi zimera, naho "Post-emergence" igaterwa ku mababi y\'ibyatsi byamaze kumera. Imiti ya "Contact" yica gusa aho yakoze ku kibabi, mu gihe iya "Systemic" yinjira mu mitsi y\'icyatsi ikagera mu mizi yose yo hasi. Imiti yose igomba gukoreshwa hakurikijwe ibipimo byanditswe ku icupa byemejwe na RAB: ntukigere uhimba ibipimo, ntugaterere mu miyaga myinshi ngo itagera ku baturanyi, wambare ibikoresho byabugenewe birinda uburozi (PPE), kandi amapaki n\'amacupa byarangiye ubyoze inshuro 3 ubipfumure ntibizakoreshwe mu kubika amazi cyangwa ibiryo.',
    causesEn: 'Crop injury and chemical accidents occur due to 5 primary errors: using uncalibrated knapsack sprayers that overdose the plot, confusing selective with non-selective products, spraying during midday heat causing chemical evaporation and leaf scorch, wind drift carrying droplets onto sensitive crops (like beans or tomatoes), and reusing herbicide sprayers for insecticide without thorough decontamination.',
    causesRw: 'Kwangirika kw\'imyaka n\'impanuka biterwa n\'amakosa 5 y\'ingenzi: gukoresha umutiba utapimwe neza ugashyiramo umuti urenze urugero, kwitiranya umuti wica byose n\'umuti wica ibyatsi runaka, gutera umuti ku zuba ryinshi ry\'amanywa bigatwika amababi, umuyaga ujyana ibitonyanga ku yindi myaka yoroshye (nk\'ibishyimbo cyangwa inyanya), no gukoresha umutiba watewemo umuti w\'ibyatsi mu gutera umuti w\'udukoko utawogejwe neza.',
    missingInfoQuestionsEn: [
      'What exact crop is in the field, and what growth stage is it in?',
      'What specific weeds are present (grasses, broadleaves, or sedges)?',
      'What is the exact commercial trade name and active ingredient on the product bottle?',
      'Do you have access to a clean, calibrated knapsack sprayer and personal protective gear?'
    ],
    missingInfoQuestionsRw: [
      'Ni ikihe gihingwa kiri mu murima, kandi kigeze ku yihe ntambwe yo gukura?',
      'Ni ibihe byatsi bibi bihari (amababi agari, nyakatsi, cyangwa indagara)?',
      'Ni irihe zina ryanditse ku icupa ry\'umuti n\'ikinyabutabire kigize uwo muti (active ingredient)?',
      'Ese mufite umutiba ukora neza n\'ibikoresho birinda umubiri (agapfukamunwa, gants, bote)?'
    ],
    actionStepsEn: [
      'Read and strictly follow the RAB-approved product label for exact dose per knapsack (e.g. ml per 15-liter or 20-liter sprayer). Never exceed labeled rates.',
      'Wear complete PPE during mixing and spraying: gumboots, waterproof gloves, eye goggles, long-sleeved overalls, and an organic vapor face mask.',
      'Spray only in the early morning (6:00 AM – 9:00 AM) or late afternoon when winds are calm (< 5 km/h) to prevent spray drift and chemical volatilization.',
      'Use a dedicated flood-jet or flat-fan nozzle designed for herbicide application, equipped with a spray shield when spraying between crop rows.',
      'Triple-Rinse Protocol: Immediately after use, rinse the knapsack three times with clean water, spray the rinse water onto an uncropped field edge, and store the sprayer out of reach of children.',
      'Safe Disposal: Puncture empty pesticide bottles and return them to registered agro-dealers or designated collection points; never burn plastics or wash sprayers near streams/wells.'
    ],
    actionStepsRw: [
      'Soma kandi ukurikize amabwiriza yemewe na RAB yanditse ku icupa ku bipimo byo gushyira mu mutiba (ml kuri litiro 15 cyangwa 20). Ntukigere urengereza igipimo.',
      'Ambara ibikoresho birinda umubiri wose mu kuvanga no gutera: amabote, gants z\'amazi, amadarubindi arinda amaso, impuzankano y\'amaboko maremare, n\'agapfukamunwa.',
      'Tera umuti mu gitondo cya kare (saa 12–saa 3 z\'igitondo) cyangwa nimugoroba igihe nta muyaga uhari (< 5 km/h) kugira ngo umuyaga utawutwara ku yindi myaka.',
      'Koresha umunwa w\'umutiba wagenewe imiti y\'ibyatsi (flat-fan) ufite igipfuko kirinda imyaka igihe utera mu mirongo.',
      'Koza Umutiba Inshuro 3: Nyuma yo gutera, oza umutiba n\'amazi asukuye inshuro 3, ukayamena kure y\'amazi, kandi ubike umutiba aho abana batagera.',
      'Kujugunya Amacupa: Pfumura amacupa yarangiye uyajyane ku bacuruzi b\'imiti bemewe; ntukigere utwika amashashi cyangwa ngo ukarabire hafi y\'amariba n\'imigezi.'
    ],
    whatToAvoidEn: 'NEVER apply non-selective herbicides (like glyphosate) over the top of standing crops; do NOT mix chemicals with bare hands or use domestic drinking cups for measuring concentrates.',
    whatToAvoidRw: 'Ntukigere utera umuti wica byose hejuru y\'ibihingwa bihagaze mu murima; ntukavange umuti ukoresheje intoki cyangwa ngo upimishe ibikombe byo kunyweramo.',
    precautionsEn: 'Keep treated fields under strict pre-harvest interval (PHI) and keep grazing livestock out of sprayed areas for the full safety duration indicated on the label.',
    precautionsRw: 'Rinda amatungo kurisha mu murima watewemo umuti mu gihe cyose cyanditswe ku icupa ry\'umuti.',
    expertConsultationEn: 'Buy herbicides only from RAB-accredited agro-dealers listed on AgriBridge Directory, and consult your Sector Agronomist for calibrating your knapsack sprayer.',
    expertConsultationRw: 'Gura imiti y\'ubuhinzi ku bacuruzi bemewe na RAB banditse muri AgriBridge Directory, kandi usabe Agronome w\'Umurenge agufashe gupima umutiba wawe neza.',
    keywordsEn: ['herbicide safety', 'selective herbicide', 'non selective', 'pre emergence', 'post emergence', 'glyphosate', 'drift', 'knapsack calibration', 'ppe'],
    keywordsRw: ['umuti w\'ibyatsi', 'selective', 'non-selective', 'pre-emergence', 'post-emergence', 'umutiba', 'umutekano', 'ppe', 'agronome'],
    locationContext: 'All Agricultural Input Channels in Rwanda',
    source: 'RAB Agro-Chemical Registration Guidelines & FAO Code of Conduct on Pesticide Management',
    sourceOrganization: 'RAB',
    sourceTitle: 'Safe Use and Stewardship of Agro-Chemicals in Rwanda',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Agro-Chemical Suppliers',
      labelRw: 'Shaka Abacuruzi b\'Imiti Yemewe kuri AgriBridge',
    },
  },

  // =========================================================================
  // B. SOIL HEALTH AND FERTILITY
  // =========================================================================

  // 6. Soil Types: Sandy vs Clay vs Loam
  {
    id: 'soil-types-sandy-clay-loam-34',
    topic: 'soil_health',
    category: 'soil',
    problemType: 'soil',
    questionEn: 'What are the practical differences between sandy, clay, and loamy soils, and how should farmers manage each?',
    questionRw: 'Ese ubutaka bw\'umusenyi, ibumba, n\'imvange (loam) bitandukaniye he mu buhinzi, kandi umuhinzi yabufata ate neza?',
    directAnswerEn: 'Soil texture is determined by the proportion of sand, silt, and clay particles, dictating water infiltration, nutrient holding capacity, and root aeration. 1) Sandy Soil has large, coarse gritty particles; it warms quickly, drains rapidly, and is easy to till, but it has very low water-holding capacity and high nutrient leaching (fertilizers wash away easily). 2) Clay Soil consists of microscopic, tightly packed plate-like particles; it holds high nutrient levels and substantial water, but it is prone to severe compaction, drains poorly (causing waterlogging and root suffocation in rains), and hardens into impenetrable clods when dry. 3) Loamy Soil is the agricultural gold standard — an optimal balanced blend of sand (40%), silt (40%), and clay (20%) rich in organic humus. It provides excellent drainage while retaining moisture and available nutrients. Farmers manage sandy soils by adding heavy organic compost, split-applying fertilizers, and mulching; they manage clay soils by incorporating coarse organic matter, building raised beds or ridges to ensure drainage, and avoiding working wet fields.',
    directAnswerRw: 'Ubwoko bw\'ubutaka buvaho ku rugero rw\'umusenyi, ibumba n\'isayo (silt): 1) Ubutaka bw\'Umusenyi bufite uduce tunini twakaka mu ntoki; bunywa amazi vuba bworoshye guhinga, ariko ntibubika amazi n\'ifumbire ihita itembanwa n\'amazi vuba cyane. 2) Ubutaka bw\'Ibumba bufite uduce duto cyane twegeranye; bubika ifumbire n\'amazi byinshi cyane, ariko bukunda kureta amazi bikica imizi itabasha guhumeka, bwakomera bukabaye amabuye atoroshye guhinga. 3) Ubutaka bw\'Imvange (Loam) nibwo butaka bwa zahabu mu buhinzi: buvanzemo umusenyi (40%), isayo (40%) n\'ibumba (20%) byuzuye ifumbire y\'imborera. Bunywa amazi neza bugasigamo ubuhehere bukenewe n\'ifumbire. Ubutaka bw\'umusenyi bufatwa neza no kongeramo ifumbire y\'imborera nyinshi, gushyiramo ifumbire mvaruganda buhoro buhoro inshuro nyinshi, no gusasira; ubutaka bw\'ibumba bufatwa neza no gushyiramo imborera, guhinga ku misozi cyangwa imitabo (raised beds) ngo amazi atemba, no kwirinda kubuhinga buhehereye cyane.',
    causesEn: 'Soil texture is inherited from native mineral parent rock (granite, volcanic basalt, schist) and centuries of weathering. While physical texture (sand/silt/clay ratio) cannot be altered practically at scale, soil structure (how particles aggregate) can be radically improved with organic matter.',
    causesRw: 'Ubwoko bw\'ubutaka buturuka ku mabuye kamere yashonze kera (ibirunga, amabuye y\'urufunzo). Nubwo utahindura umusenyi ngo ube ibumba ku buso bunini, imiterere yabwo (soil structure) ihinduka myiza cyane iyo ushyizemo imborera ihagije.',
    missingInfoQuestionsEn: [
      'Take a small handful of moist soil from 15cm depth: does it feel gritty and fall apart (sand), smooth and soapy (silt), or sticky and moldable into a flexible ribbon (clay)?',
      'Does water pool on the surface for days after rainfall, or does the soil dry out within hours?'
    ],
    missingInfoQuestionsRw: [
      'Fata igipfunsi cy\'ubutaka buhehereye ubugerageze mu ntoki: ese burakanyaraye buhita bumanyagurika (umusenyi), buranyerera neza nk\'isabune (silt), cyangwa burafatana bushobora kubumbwamo umugozi (ibumba)?',
      'Ese imvura igwa amazi amara iminsi aretse hejuru, cyangwa ahita akamuka mu masaha make?'
    ],
    actionStepsEn: [
      'Management for Sandy Soil (common in lowlands): Apply 15–20 tonnes/ha of well-cured compost or cattle manure to build organic moisture sponges; split top-dressed nitrogen (Urea) into 3 small doses rather than 1 large dump to avoid leaching.',
      'Management for Clay Soil (common in valley bottoms/marshlands): Construct raised beds (cm 20–30 high) or drainage furrows; add crop residues and lime (Ishwagara) to flocculate clay particles and improve soil porosity.',
      'Management for Loam Soil: Maintain soil biological health by rotating cereals with nitrogen-fixing climbing beans or soybeans and planting green manure cover crops.',
      'Soil Testing: Conduct soil pH and nutrient testing once every 3 years through local RAB-certified agro-dealers.'
    ],
    actionStepsRw: [
      'Gufata neza Umusenyi: Shyiramo toni 15–20 za manyire iboze neza kuri hegitari kugira ngo ibike amazi; shyiramo Urea mu byiciro 3 bito aho kuyishyiriramo rimwe ikarengerwa n\'amazi.',
      'Gufata neza Ibumba: Hinga ku mitabo (santimetero 20–30 hejuru) cyangwa ucukure imiferege yohereza amazi hanze; shyiramo ifumbire y\'imborera n\'ishwagara kugira ngo ubutaka bwuguruke bwinjize umwuka.',
      'Gufata neza Loam: Guma usimburanya ibihingwa nk\'ibigori n\'ibinyamisogwe (ibishyimbo, soya) byongera azote mu butaka.',
      'Gupimisha Ubutaka: Pimisha ubutaka bwawe rimwe mu myaka 3 ku bacuruzi b\'ifumbire bemewe na RAB.'
    ],
    whatToAvoidEn: 'Do NOT plow or drive tractors on heavy clay soils when wet; doing so destroys soil aggregates, creates severe hardpan compaction, and suffocates plant roots.',
    whatToAvoidRw: 'Ntukigere uhinga cyangwa ngo unyize imashini mu butaka bw\'ibumba burimo amazi; bituma ubutaka bukomera nk\'isima (compaction) bikabuza imizi gukura.',
    precautionsEn: 'Avoid single massive chemical fertilizer doses on sandy soils before heavy rain forecasts; up to 60% of mobile nitrate washes into deep subsoil where roots cannot reach.',
    precautionsRw: 'Irinde kumena ifumbire nyinshi icyarimwe mu butaka bw\'umusenyi imvura igiye kugwa kuko amazi ahita ayitembana hasi cyane imizi itakiyigezeho.',
    expertConsultationEn: 'Consult your Sector Agronomist for localized soil acidity testing and recommended liming rates.',
    expertConsultationRw: 'Baza Agronome w\'Umurenge agupimire ubusharire bw\'ubutaka (pH) akubwire igipimo cy\'ishwagara gikenewe.',
    keywordsEn: ['soil types', 'sandy soil', 'clay soil', 'loam', 'soil texture', 'drainage', 'leaching', 'compaction', 'organic matter'],
    keywordsRw: ['ubwoko bw\'ubutaka', 'umusenyi', 'ibumba', 'imvange', 'loam', 'amazi', 'imborera', 'uburumbuke', 'ishwagara'],
    locationContext: 'Eastern Savannas, Highland Volcanic Belts, and Marshlands across Rwanda',
    source: 'RAB Soil Science & Agricultural Chemistry Department',
    sourceOrganization: 'RAB',
    sourceTitle: 'Integrated Soil Fertility Management Guidelines for Rwandan Agro-Ecologies',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'farmer',
      labelEn: 'Review Soil Type in Farms & Plots',
      labelRw: 'Reba Ubwoko bw\'Ubutaka muri Farms & Plots',
    },
  },

  // =========================================================================
  // C. CROP NUTRITION AND FERTILIZER MANAGEMENT
  // =========================================================================

  // 7. Yellow Leaves Diagnostic Protocol (Chlorosis)
  {
    id: 'crop-nutrition-yellow-leaves-diagnosis-36',
    topic: 'fertilizer_management',
    category: 'nutrition',
    problemType: 'nutrition',
    questionEn: 'Why do crop leaves turn yellow (chlorosis), and what follow-up questions determine the exact cause?',
    questionRw: 'Kuki ibibabi by\'ibihingwa bihinduka umuhondo, kandi ni ibihe bibazo bikurikira bifasha kumenya icyabiteye nyakuri?',
    directAnswerEn: 'Yellowing of crop leaves (chlorosis) is a visual symptom caused by breakdown of green chlorophyll, but it is NOT an automatic diagnosis of nitrogen deficiency. Leaves turn yellow for multiple distinct causes: 1) Mobile Nutrient Deficiency (Nitrogen or Magnesium: symptoms start on older, lowest leaves as the plant robs mobile nutrients to feed new growth); 2) Immobile Nutrient Deficiency (Iron or Sulfur: symptoms appear first on youngest upper leaves because the plant cannot move them); 3) Waterlogging and Root Suffocation (excess water fills soil pores, cutting off oxygen and preventing nutrient absorption); 4) Severe Drought Stress; 5) Soil Acidity (pH below 5.5 locks phosphorus and micronutrients into insoluble forms); 6) Root Pests or Root Rot Fungi destroying root hairs; or 7) Viral Infections like Maize Lethal Necrosis (MLND) or Cassava Mosaic (CMD). A responsible agronomist never makes an instant guess — they investigate which leaves are affected, the pattern of yellowing, soil moisture, and recent fertilizer history.',
    directAnswerRw: 'Umuhondo ku bibabi by\'ibihingwa (chlorosis) ugaragaza ko ikimera cyatakaje icyatsi gitanga ubuzima (chlorophyll), ariko NTIBAVUGA ko buri gihe biterwa no kubura azote gusa. Umuhondo uterwa n\'impamvu nyinshi zitandukanye: 1) Kubura Intungamubiri zigenda mu gihingwa (Azote cyangwa Magnesium: umuhondo utangirira ku bibabi byo hasi bikuze); 2) Kubura Intungamubiri zitagenda (Ubutare/Iron cyangwa Umwuka w\'umweru/Sulfur: umuhondo utangirira ku bibabi bito byo hejuru gusa); 3) Amazi menshi mu butaka (amazi aretse afunga umwuka w\'imizi bigatuma igihingwa kidafata ibiryo); 4) Izuba ryinshi ryumije ubutaka; 5) Ubusharire bw\'ubutaka (pH munsi ya 5.5 bufunga fosifore n\'imyunyungugu); 6) Udukoko cyangwa imiyege yangije imizi yo hasi; cyangwa 7) Virusi z\'ibihingwa nk\'indwara ya MLND mu bigori cyangwa ububembe mu myumbati. Umuhanga mu buhinzi ntahita akekeranya ako kanya — abanza kumenya ibibabi byafashwe, imiterere y\'umuhondo, ubuhehere bw\'ubutaka, n\'ifumbire yashyizwemo.',
    causesEn: 'Chlorosis mechanisms: Nitrogen deficiency causes an inverted "V" yellowing starting at leaf tips of bottom leaves. Waterlogging causes general pale yellowing accompanied by purple stem bases. Magnesium deficiency creates interveinal chlorosis (veins stay green while tissue between turns yellow/white). Viral diseases produce patchy mottled mosaics.',
    causesRw: 'Imiterere y\'umuhondo: Kubura Azote bitera umuhondo umeze nka "V" uhereye ku mutwe w\'ikibabi cyo hasi. Amazi menshi atera umuhondo rusange n\'amashami asa n\'umuhemba. Kubura Magnesium bitera imitsi y\'ikibabi kuguma ari icyatsi naho hagati hagahinduka umuhondo. Virusi zitera amabara y\'uruvange asatuye.',
    missingInfoQuestionsEn: [
      'Which crop is affected and what is its growth stage (e.g., knee-high maize, flowering beans, or fruiting tomatoes)?',
      'Are the yellow leaves located at the bottom (older leaves) or at the top whorl (youngest emerging leaves)?',
      'Is the yellowing uniform across the whole leaf, or do the leaf veins remain green while tissue between turns yellow?',
      'Has the field experienced heavy waterlogging/ponding or severe dry spells recently?',
      'What fertilizer (DAP, NPK, Urea, Compost) was applied, and how many weeks ago?'
    ],
    missingInfoQuestionsRw: [
      'Ni ikihe gihingwa cyafashwe kandi kigeze ku yihe ntambwe (urugero: ibigori bigeze mu ntege, ibishyimbo birabyije, cyangwa inyanya ziri kwereraho)?',
      'Ese ibibabi by\'umuhondo biri hasi (amababi yashaje) cyangwa biri hejuru mu mutima w\'urugori (amababi mashya)?',
      'Ese umuhondo wuzuye ikibabi cyose, cyangwa imitsi y\'ikibabi yagumye ari icyatsi naho hagati hakahinduka umuhondo?',
      'Ese mu murima hararetse amazi menshi cyangwa hari izuba rikaze ryavuye muri iyi minsi?',
      'Ni iyihe fumbire (DAP, NPK, Urea, Manyire) yashyizwemo, kandi yashyizwemo hashize ibyumweru bingahe?'
    ],
    actionStepsEn: [
      'Inspect Leaf Position: If lower leaves have yellow V-shapes and soil is moist, apply nitrogen side-dressing (Urea at 50kg/ha or compost tea) during active vegetative growth.',
      'Check Soil Drainage: If soil is soggy and plants look pale, excavate 30cm drainage trenches immediately to let root zones aerate before adding any fertilizer.',
      'Check Upper Leaves: If young top leaves are yellow while lower leaves are green, suspect sulfur or iron deficiency, or high soil alkalinity; apply balanced foliar micronutrient fertilizer.',
      'Check for Virus: If yellowing shows irregular patchwork streaks and curled leaves, uproot and bury affected plants to prevent vector insects spreading disease across the plot.'
    ],
    actionStepsRw: [
      'Reba Aho Ibibabi Biherereye: Niba ari ibyo hasi bifite ishusho ya "V" kandi ubutaka buhehereye, shyiramo Urea mu ntege z\'ibigori ku kigero giteganywa na RAB.',
      'Genzura Amazi mu Murima: Niba ubutaka burimo ibyondo birenze, cukura imiferege yohereza amazi hanze ako kanya kugira ngo imizi ihumeke mbere yo gushyiramo indi fumbire.',
      'Reba Ibibabi byo Hejuru: Niba ibibabi bishya byo hejuru aribyo bifite umuhondo naho ibyo hasi bikiri ibyatsi, bishobora kuba kubura sulfur cyangwa iron; tera ifumbire yo ku mababi (foliar spray).',
      'Genzura Virusi: Niba umuhondo urimo amabara y\'uruvange n\'amababi yihinahina, randura ibyo bimera ubitwike ngo bitanduza umurima wose.'
    ],
    whatToAvoidEn: 'Do NOT dump chemical nitrogen fertilizer on yellowing crops sitting in waterlogged mud; saturated roots cannot absorb nutrients, and excess urea burns damaged root tissue.',
    whatToAvoidRw: 'Ntukigere umena ifumbire ya Urea mu murima uretsemo amazi n\'ibyondo; imizi iretsemo amazi ntishobora kuyifata kandi urea ihita itwika imizi yarwaye.',
    precautionsEn: 'Always distinguish between nutrient deficiency and root galling caused by root-knot nematodes by gently digging up one sample plant to inspect the root hairs.',
    precautionsRw: 'Banza ucukure igiti kimwe urebe niba imizi itagira udusaro tw\'inzoka z\'ubutaka (nematodes) mbere yo kwemeza ko ari ifumbire yabuze.',
    expertConsultationEn: 'When yellowing spreads rapidly across entire fields within 48 hours, alert the local Sector Agronomist for immediate inspection.',
    expertConsultationRw: 'Iyo umuhondo ukwirakwiriye mu murima wose mu masaha 48, hamagara Agronome w\'Umurenge ako kanya aze asuzume umurima.',
    keywordsEn: ['yellow leaves', 'chlorosis', 'nitrogen deficiency', 'waterlogging', 'magnesium deficiency', 'plant diagnosis', 'foliar fertilizer'],
    keywordsRw: ['ibibabi by\'umuhondo', 'chlorosis', 'azote', 'amazi menshi', 'indwara y\'imyaka', 'isuzuma', 'agronome', 'ifumbire'],
    locationContext: 'All Crops and Farming Districts across Rwanda',
    source: 'RAB Plant Pathology & Crop Nutrition Advisory Services',
    sourceOrganization: 'RAB',
    sourceTitle: 'Diagnostic Protocol for Foliar Chlorosis in Smallholder Fields',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'ai',
      labelEn: 'Run Crop Problem Diagnostic Assistant',
      labelRw: 'Kora Isuzuma ry\'Uburwayi bw\'Igihingwa',
    },
  },

  // =========================================================================
  // D. CROP PEST MANAGEMENT
  // =========================================================================

  // 8. Integrated Pest Management (IPM) & Beneficial Insects
  {
    id: 'pest-ipm-beneficial-insects-37',
    topic: 'pest_management',
    category: 'pests',
    problemType: 'pests',
    questionEn: 'What is Integrated Pest Management (IPM), what beneficial insects protect crops, and how do farmers avoid unnecessary pesticide use?',
    questionRw: 'Integrated Pest Management (IPM) ni iki, ni ubuhe dukoko tw\'ingirakamaro turinda imyaka, kandi umuhinzi yakwirinda ate gukoresha imiti y\'uburozi itari ngombwa?',
    directAnswerEn: 'Integrated Pest Management (IPM) is an environmentally responsible, cost-saving pest control framework based on four sequential pillars: 1) Prevention (crop rotation, clean seed, field sanitation, intercropping); 2) Regular Scouting & Monitoring (inspecting fields twice weekly); 3) Preserving Beneficial Natural Enemies (predatory insects and parasitoids); and 4) Applying Intervention only when pest damage exceeds economic injury thresholds. Far from all insects being enemies, agricultural ecosystems rely on critical beneficial insects: Ladybird beetles (both larvae and adults devour up to 50 aphids per day), Parasitic wasps (Trichogramma and Cotesia that lay eggs inside pest caterpillars, killing them naturally), Hoverfly larvae (voracious aphid predators), Praying mantises, and predatory ground beetles and spiders. Indiscriminate calendar spraying of broad-spectrum chemical insecticides wipes out these beneficial allies, triggering devastating secondary pest outbreaks. Farmers avoid chemical dependency by using biological biopesticides (Neem extract, Bacillus thuringiensis / Bt), handpicking, physical traps, and applying synthetic chemicals only as a targeted last resort.',
    directAnswerRw: 'Integrated Pest Management (IPM) ni uburyo buhuza ubuhanga bwo kurwanya udukoko utangiza ibidukikije kandi ukora ku kiguzi gito: 1) Kwirinda hakiri kare (gusimburanya imyaka, imbuto yizewe, isuku y\'umurima); 2) Gusuzuma umurima kabiri mu cyumweru; 3) Kubungabunga udukoko tw\'ingirakamaro turya udukoko twangiza; no 4) Gutera umuti gusa igihe udukoko twangiza turengereye igipimo cy\'ubukungu. Mu murima hari udukoko twinshi twiza dufasha umuhinzi: Inyenzi z\'imborera (Ladybird beetles: zirya inda z\'ibihingwa hejuru ya 50 ku munsi), Imbaragasa n\'utuvubi duto dutera amagi mu nyo zikipfa (Parasitic wasps nka Cotesia), n\'ibitagangurirwa birya udukoko twose. Gutera imiti y\'uburozi hato na hato byica utu dukoko twose tw\'ingirakamaro bigatuma udukoko twangiza twiyongera cyane. Umuhinzi arinda umutungo we akoresheje imiti ya kamere (Neem, Bt), gutoragura inyo zikiri nkeya, n\'imitego y\'udukoko, akoresheje umuti w\'uruganda igihe cyose nta bundi buryo busigaye.',
    causesEn: 'Pest outbreaks occur when biodiversity is destroyed by monoculture cropping, when beneficial predator insects are killed by prophylactic broad-spectrum insecticide sprays, or when continuous host crops provide uninterrupted breeding food.',
    causesRw: 'Udukoko twiyongera iyo umuhinzi ahinga igihingwa kimwe gusa ubudahagarara, iyo yishe udukoko twiza akoresheje imiti yica byose, cyangwa iyo asize ibisigazwa by\'imyaka yarwaye mu murima.',
    missingInfoQuestionsEn: [
      'What specific crop is being attacked, and what part of the plant (leaf whorl, pod, stem, fruit)?',
      'What does the pest look like (caterpillar, tiny sap-sucking aphid, beetle, or whitefly)?',
      'What percentage of plants in the field show visible damage (e.g. less than 10%, or more than 30%)?',
      'Have you seen beneficial predatory ladybirds or spiders present on the foliage?'
    ],
    missingInfoQuestionsRw: [
      'Ni ikihe gihingwa cyibasiwe, kandi cyibasiwe he (mu mutima w\'urugori, ku gishishwa, ku giti, ku mbuto)?',
      'Ako gakoko kameze gate (ni inyo, ni inda z\'amababi zisa n\'umukara, ni ibivumvuri, cyangwa uducurama twera)?',
      'Ese mu murima wangiritseho igipimo kingana iki (munsi ya 10% cyangwa hejuru ya 30%)?',
      'Ese waba ubonamo udukoko tw\'inyenzi z\'imborera cyangwa ibitagangurirwa birya utundi dukoko?'
    ],
    actionStepsEn: [
      'Twice-Weekly Scouting: Walk your plot in a "W" or "Z" pattern inspecting 20 plants across 5 spots; check undersides of leaves and young whorls for early egg masses and small larvae.',
      'Cultural Traps & Intercrops: Plant border rows of Napier grass (*Urubingo*) or Desmodium (Push-Pull technology) to naturally repel stem borers and attract them away from maize.',
      'Biological Spraying: For small larvae, apply botanical Neem leaf/seed extract (50g crushed seed per liter water) or registered microbial bio-pesticides (*Bacillus thuringiensis* / Bt) that kill caterpillars without harming beneficial ladybirds.',
      'Physical Removal: On plots under 0.5 ha, handpick caterpillar clusters and drop them into soapy water during early morning.'
    ],
    actionStepsRw: [
      'Gusuzuma Umurima Kabiri mu Cyumweru: Genda mu murima ukurikiza inzira ya "W" cyangwa "Z" usuzuma ibiti 20 mu bice 5 bitandukanye; reba munsi y\'amababi amagi y\'udukoko n\'inyo zikiri nto.',
      'Gukoresha Ibihingwa Birinda (Push-Pull): Tera urubingo ku mbibi z\'umurima w\'ibigori na desmodium hagati mu mirongo kugira ngo byirukane inyo zicukura ibiti.',
      'Gukoresha Imiti ya Kamere: Ku nyo zikiri nto, tera amazi yabanwemo amababi cyangwa imbuto za Neem, cyangwa umuti wa Bt wica inyo gusa ariko ntugire icyo utwara udukoko twiza.',
      'Gutoragura n\'Intoki: Ku murima muto utarenze hegitari 0.5, toragura amagi n\'inyo zikiri nto uzite mu mazi arimo isabune mu gitondo kare.'
    ],
    whatToAvoidEn: 'Do NOT spray broad-spectrum synthetic pyrethroids on crops when beneficial predators are abundant and pest counts are below economic thresholds (e.g., <20% for armyworm).',
    whatToAvoidRw: 'Ntukigere utera imiti ikaze yica byose igihe mu murima harimo udukoko tw\'ingirakamaro kandi ibihingwa byafashwe biri munsi ya 20%.',
    precautionsEn: 'When chemical spraying is deemed strictly necessary, rotate between chemical classes with different IRAC codes to avoid breeding insecticide-resistant super-pests.',
    precautionsRw: 'Iyo byabaye ngombwa ko utera umuti w\'uruganda, hinduranya amoko y\'imiti ifite code zitandukanye kugira ngo udukoko tutazayimenyera ntigire icyo ikora.',
    expertConsultationEn: 'Consult registered agro-dealers on AgriBridge to source certified bio-pesticides and pheromone monitoring traps.',
    expertConsultationRw: 'Baza abacuruzi b\'imiti y\'ubuhinzi banditse kuri AgriBridge amoko y\'imiti ya bio-pesticides n\'imitego y\'udukoko (pheromone traps).',
    keywordsEn: ['ipm', 'integrated pest management', 'beneficial insects', 'ladybird beetles', 'parasitic wasps', 'push pull', 'neem extract', 'scouting'],
    keywordsRw: ['ipm', 'kurwanya udukoko', 'udukoko tw\'ingirakamaro', 'inyenzi z\'imborera', 'push pull', 'umuti wa neem', 'agronome', 'gusuzuma'],
    locationContext: 'Eastern Province, Northern Highlands, Southern Basins',
    source: 'RAB Integrated Pest Management Protocols & ICIPE Push-Pull Technology Guide',
    sourceOrganization: 'RAB',
    sourceTitle: 'Integrated Pest Management and Biological Control for Smallholder Farmers',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Certified Agro-Input Dealers',
      labelRw: 'Shaka Abacuruzi b\'Imiti Yemewe kuri AgriBridge',
    },
  },

  // =========================================================================
  // E. CROP DISEASE MANAGEMENT
  // =========================================================================

  // 9. Plant Pathology Diagnostic Framework (Fungal vs Bacterial vs Viral)
  {
    id: 'disease-diagnostic-framework-38',
    topic: 'crop_diseases',
    category: 'diseases',
    problemType: 'diseases',
    questionEn: 'How can farmers distinguish between fungal, bacterial, viral, and abiotic crop diseases, and when is expert diagnosis required?',
    questionRw: 'Nigute umuhinzi atandukanya indwara ziterwa n\'imiyege (fungi), bagiteri (bacteria), virusi, cyangwa ikirere, kandi ni ryari hakenewe umuhanga mu buhinzi?',
    directAnswerEn: 'Accurate plant disease management requires distinguishing between four distinct disease classes: 1) Fungal Diseases (account for >70% of plant pathology; produce visible powdery, downy, or rust-colored spores, circular target-like spots with concentric rings, or fuzzy molds during cool, wet weather); 2) Bacterial Diseases (characteristically produce water-soaked lesions, slimy yellow/white bacterial streaming ooze from cut stems submerged in clean water, foul rotting odors, or sudden daytime wilting while foliage remains green); 3) Viral Diseases (cause systemic leaf distortion, yellow mosaic mottling, shoe-string leaves, or severe plant stunting without visible spores or rot, transmitted by sucking vector insects or infected vegetative seed cuttings); 4) Abiotic Physiological Disorders (caused by non-living environmental stresses like drought scorch, fertilizer burn, frost, or waterlogging; typically affect large swaths of the field uniformly without spreading from plant to plant). Because viral and bacterial vascular wilt diseases have zero chemical cures once a plant is infected, spraying expensive fungicides on bacterial or viral diseases is completely useless. A farmer must distinguish visible symptoms from a confirmed diagnosis; when symptoms are ambiguous, certified laboratory or Sector Agronomist inspection is mandatory.',
    directAnswerRw: 'Kuvura neza indwara z\'ibihingwa bisaba gutandukanya amoko 4 y\'indwara: 1) Indwara ziterwa n\'Imiyege (Fungi: zigize hejuru ya 70% by\'indwara; zizana ifu yera ku bibabi, ingese itukura, amabara azengurutse ku bibabi, cyangwa uruhumbu mu bihe by\'imvura n\'imbeho); 2) Indwara ziterwa na Bagiteri (Bacteria: zizana amabara ameze nk\'amazi atose ku bibabi, amatembabuzi y\'umuhondo cyangwa amera nk\'amata iyo uciye igiti ukagishyira mu kirahure cy\'amazi, umunuko wo kubora, cyangwa igiti cyuma kigitoshye); 3) Indwara za Virusi (zitera amabara y\'umuhondo y\'uruvange ku bibabi, kwihinahina, no gukendera; zikwirakwizwa n\'udukoko tunyunyuza cyangwa ingeri zirwaye); 4) Ibibazo biturutse ku Kirere n\'Ubutaka (Abiotic: biterwa n\'izuba ryinshi, gutwika kw\'ifumbire, cyangwa imbeho ikaze; bifata umurima wose rimwe ntibikwirakwire ku bindi biti). Kubera ko virusi na bagiteri zo mu mitsi nta muti w\'uruganda uzikiza iyo zafashe, kugura umuti w\'imiyege (fungicide) ngo uvure virusi ni ugupfusha ubusa amafaranga. Iyo ibimenyetso bitarasobanuka neza, ni ngombwa kwegera Agronome w\'Umurenge agasuzuma.',
    causesEn: 'Pathogen proliferation requirements (the Disease Triangle): a susceptible host plant, a virulent pathogen (spores, bacteria, virus), and favorable environmental conditions (high relative humidity, surface moisture, moderate temperatures).',
    causesRw: 'Impamvu zitera indwara kwiyongera (Disease Triangle): igihingwa cyoroshye gufatwa, udukoko tuzana indwara mu murima, n\'ikirere cyorohereza indwara (ubuhehere bwinshi mu kirere, amazi ku mababi, n\'imbeho).',
    missingInfoQuestionsEn: [
      'What crop is affected and what exact symptoms are visible on leaves, stems, or fruits?',
      'If you cut the lower stem and place it in clear water for 2 minutes, do you see milky white bacterial streaming threads (bacteria) or clear sap (fungus/drought)?',
      'Are there fuzzy molds, powdery dust, or rust pustules on the undersides of leaves?',
      'Did the problem appear overnight following extreme rain, or did it slowly spread from plant to plant over weeks?'
    ],
    missingInfoQuestionsRw: [
      'Ni ikihe gihingwa cyafashwe kandi ni ibihe bimenyetso bigaragara ku mababi, ku giti cyangwa ku mbuto?',
      'Niba ukase igiti cyo hasi ukagishyira mu kirahure kirimo amazi asukuye iminota 2, ese hasohokamo utuntu twera nk\'amata (bagiteri) cyangwa amazi asanzwe (umuyege/izuba)?',
      'Ese hari ifu yera, uruhumbu cyangwa ingese itukura munsi y\'amababi?',
      'Ese iki kibazo cyaje mu ijoro rimwe nyuma y\'imvura nyinshi, cyangwa cyagiye gikwirakwira buhoro buhoro kuva ku giti kimwe kijya ku bindi mu byumweru?'
    ],
    actionStepsEn: [
      'Perform Stem Streaming Glass Test: For wilting tomatoes or potatoes, submerge a 5cm cut stem in clear water; milky white bacterial threads streaming out confirms Bacterial Wilt (no chemical cure; rogue and burn plants).',
      'Inspect for Spores: If powdery white or dark velvety fungal mold is visible on leaf undersides, apply registered protective or systemic fungicides (e.g. Copper hydroxide, Mancozeb) observing label intervals.',
      'Rogueing Viral Hosts: If plants show mosaic streaking and distorted stunted foliage (e.g. CMD on cassava or MLND on maize), uproot the entire root mat and burn it far from the field to stop insect vectors spreading disease.',
      'Sanitize Tools: Disinfect machetes and shears in a 10% bleach solution or open flame between pruning rows.'
    ],
    actionStepsRw: [
      'Gupimisha Amazi mu Kirahure: Ku nyanya cyangwa ibirayi byumye, caca santimetero 5 z\'igiti cyo hasi ugishyire mu mazi asukuye mu kirahure; niba hasohotsemo imirongo myera nk\'amata ni Bacterial Wilt (nta muti uyikiza; randura ubitwike).',
      'Genzura Uruhumbu: Niba ubona ifu yera cyangwa uruhumbu munsi y\'amababi, tera umuti wica imiyege (fungicide yemewe nka Mancozeb cyangwa Copper) ku bipimo byanditswe.',
      'Kurandura Ibifite Virusi: Niba ibihingwa bifite amabara y\'uruvange no kwihinahina (nk\'ububembe bw\'imyumbati cyangwa MLND mu bigori), randura ubitwike kure y\'umurima ngo bitanduza ibindi.',
      'Gusukura Ibikoresho: Inika imihoro n\'imikasi mu mazi arimo Jik ya 10% cyangwa ubababure mu muriro mbere yo kugenda ku yindi myaka.'
    ],
    whatToAvoidEn: 'NEVER apply antibiotics or chemical fungicides to viral diseases; chemical sprays cannot eliminate viruses and waste scarce household funds.',
    whatToAvoidRw: 'Ntukigere ugura imiti ya fungicide ngo uyitere ku ndwara ya virusi; umuti ntushobora kwica virusi iri mu maraso y\'igihingwa.',
    precautionsEn: 'Never use saved crop tubers, suckers, or cuttings from a diseased field as seed for the next season; always source certified seed from RAB accredited multipliers.',
    precautionsRw: 'Ntukigere ukura imbuto (ibirayi, imyumbati, insina) mu murima warwaye ngo uzitere mu gihembwe gikurikira; gura imbuto yizewe yatubuwe n\'abatubuzi bemewe na RAB.',
    expertConsultationEn: 'Whenever a disease cannot be identified with certainty or threatens community fields, immediately notify the Sector Agronomist or RAB Plant Health Clinic.',
    expertConsultationRw: 'Igihe cyose udashobora kumenya indwara neza cyangwa ibangamiye umurima wose, menyyesha Agronome w\'Umurenge cyangwa laboratoire ya RAB ako kanya.',
    keywordsEn: ['plant pathology', 'fungal disease', 'bacterial wilt', 'viral disease', 'chlorosis', 'stem test', 'spores', 'mancozeb', 'copper'],
    keywordsRw: ['indwara z\'imyaka', 'imiyege', 'fungi', 'bacteria', 'virusi', 'bacterial wilt', 'ububembe', 'agronome', 'laboratwari'],
    locationContext: 'All Crops across Rwanda',
    source: 'RAB Plant Health Directorate & CABI Plantwise Diagnostic Protocols',
    sourceOrganization: 'RAB',
    sourceTitle: 'Manual of Plant Disease Diagnosis and Management in Rwanda',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'directory',
      labelEn: 'Consult Sector Agronomist Directory',
      labelRw: 'Shaka Agronome w\'Umurenge kuri AgriBridge',
    },
  },

  // =========================================================================
  // F. CROP PRODUCTION AND FARM MANAGEMENT
  // =========================================================================

  // 10. Agronomic Spacing & Seed Selection Guidelines
  {
    id: 'crop-production-planting-spacing-depth-42',
    topic: 'planting_spacing',
    category: 'crops',
    problemType: 'general',
    questionEn: 'What are the recommended planting spacing, seed depths, and plant populations for Rwanda\'s staple crops?',
    questionRw: 'Ni ibihe bipimo byemewe by\'intera hagati y\'imirongo, ubujyakuzimu bw\'imbuto, n\'umubare w\'ibihingwa kuri hegitari ku bihingwa by\'u Rwanda?',
    directAnswerEn: 'Achieving target crop yield requires exact adherence to RAB spacing and planting depth protocols to optimize root space, plant population per hectare, and sunlight capture: 1) Hybrid Maize: 75cm between rows × 25cm between hills (1 seed/hill at 4–5cm depth) yielding 53,333 plants/ha, or 75cm × 50cm (2 seeds/hill); 2) Climbing Beans: 50cm between rows × 20cm between hills (2 seeds/hill at 3–4cm depth) staked at 2m height; 3) Bush Beans: 40cm × 20cm (2 seeds/hill) or 30cm × 15cm (1 seed/hill); 4) Irish Potatoes: 75cm between ridges × 30cm between sprouted tubers planted at 10–12cm depth in loose ridges (approx. 44,400 tubers/ha); 5) Cassava: 100cm × 100cm ridges, cuttings 20–25cm planted slanted at 45° angle (10,000 plants/ha); 6) Paddy Rice: 20cm × 20cm straight rows (1–2 seedlings/hill at 2–3cm depth) yielding 250,000 hills/ha; 7) Tomatoes: 75cm × 50cm (staked, pruned single or double stems). Always use certified seeds certified by RAB rather than uncertified food grains from open grain markets.',
    directAnswerRw: 'Kugera ku musaruro mwinshi bisaba gukurikiza ibipimo bya RAB byo gutera: 1) Ibigori bya Hybrid: cm 75 hagati y\'imirongo na cm 25 hagati y\'imyobo (imbuto 1 ku mwobo ku bujyakuzimu bwa cm 4–5) bitanga ibiti 53,333 kuri hegitari, cyangwa cm 75 kuri cm 50 (imbuto 2 ku mwobo); 2) Ibishyimbo by\'imishingiriro: cm 50 hagati y\'imirongo na cm 20 hagati y\'imyobo (imbuto 2 ku mwobo kuri cm 3–4 z\'ubujyakuzimu) hashingirirwa ku giti cya metero 2; 3) Ibishyimbo bigufi: cm 40 kuri cm 20 (imbuto 2 ku mwobo); 4) Ibirayi: cm 75 hagati y\'imisozi na cm 30 hagati y\'ibirayi biri ku bujyakuzimu bwa cm 10–12 mu butaka bworoshe (ibirayi bigera ku 44,400 kuri hegitari); 5) Imyumbati: metero 1 kuri metero 1 ku mirongo, ingeri za cm 20–25 zihengamye kuri dogere 45 (ibiti 10,000 kuri hegitari); 6) Umuceri: cm 20 kuri cm 20 ku mirongo igororotse (ingemwe 1–2 ku mwobo) bitanga ibiti 250,000 kuri hegitari; 7) Inyanya: cm 75 kuri cm 50 (zishingirirwa zikanakeberezwa). Buri gihe koresha imbuto yemejwe na RAB aho gukoresha imbuto z\'ibiribwa ziguze ku isoko rusange.',
    causesEn: 'Planting too densely causes severe light starvation and weak spindly lodging stems; planting too sparsely wastes valuable farm area and allows rampant weed growth.',
    causesRw: 'Gutera uducucitse bituma ibihingwa birwanira izuba bikagira ibiti binanutse cyane bigwa vuba; gutera bitatanye bituma umurima upfa ubusa n\'ibyatsi bikawurengeza.',
    missingInfoQuestionsEn: [
      'Which crop are you planning to plant?',
      'Do you have certified seed bags with the official RAB inspection seal?',
      'What is your total plot area in Hectares or Ares?'
    ],
    missingInfoQuestionsRw: [
      'Murateganya gutera ikihe gihingwa muri uyu murima?',
      'Ese mufite imbuto zizewe zifite kashe y\'ubugenzuzi ya RAB?',
      'Ubuso bw\'umurima wanyu bungana iki muri Hegitari cyangwa Are?'
    ],
    actionStepsEn: [
      'Use a marked planting cord (umugozi upimye) with knots tied at required intervals to guarantee straight rows and uniform spacing.',
      'Thin weak extra seedlings within 10–14 days of germination (e.g. thinning maize to strictly 1 strong plant per hill at 25cm).',
      'Test Seed Germination Rate: Plant 50 test seeds in a shallow moist soil tray 10 days before field sowing; if fewer than 42 germinate (>85%), increase seeding rate or replace seed stock.',
      'Inoculate legume seeds (soybeans, climbing beans) with certified Rhizobium bio-fertilizer before sowing.'
    ],
    actionStepsRw: [
      'Koresha umugozi upimye uziritseho udutambaro ku bipimo nyabyo kugira ngo utere ku mirongo igororotse neza.',
      'Kandura ingemwe z\'inyongera zikiri nto mu minsi 10–14 zimaze kumera (urugero: gusigamo igiti kimwe gikomeye cy\'ikigori ku mwobo ku ntera ya cm 25).',
      'Gupima Kumera kw\'Imbuto: Tera imbuto 50 mu kintu kirimo igitaka gihehereye iminsi 10 mbere yo gutera mu murima; niba ziri munsi ya 42 zimeze (>85%), shaka indi mbuto yizewe.',
      'Shyira umusemburo wa Rhizobium ku mbuto za soya n\'ibishyimbo mbere yo gutera kugira ngo byongere azote.'
    ],
    whatToAvoidEn: 'Do NOT plant seeds deeper than 5cm in heavy wet soils; deep planting suffocates emerging sprouts before they reach sunlight.',
    whatToAvoidRw: 'Ntukigere utera imbuto munsi ya santimetero 5 mu butaka bw\'ibumba buhehereye; bituma urugori rubura umwuka rukaborera mu butaka rutarasohoka hejuru.',
    precautionsEn: 'Protect planted seeds from birds and rodents during the first 7 days following sowing.',
    precautionsRw: 'Rinda imbuto zimaze guterwa inyoni n\'imbeba mu minsi 7 ya mbere zitaramera.',
    expertConsultationEn: 'Discover verified seed multiplier cooperatives in your sector through the AgriBridge Supplier Directory.',
    expertConsultationRw: 'Reba abatubuzi b\'imbuto bemewe bari mu murenge wawe muri AgriBridge Supplier Directory.',
    keywordsEn: ['planting spacing', 'seed depth', 'plant population', 'germination test', 'thinning', 'maize spacing', 'potato ridges', 'certified seed'],
    keywordsRw: ['intera yo gutera', 'ubujyakuzimu bw\'imbuto', 'ibigori', 'ibirayi', 'imbuto zemejwe na rab', 'umugozi', 'agronome'],
    locationContext: 'All Agro-Ecological Zones in Rwanda',
    source: 'RAB Crop Intensification Program (CIP) Technical Manual',
    sourceOrganization: 'RAB',
    sourceTitle: 'Agronomic Spacing and Seeding Recommendations for Rwandan Staples',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'farmer',
      labelEn: 'Register New Crop Cycle in Plots',
      labelRw: 'Andika Igihembwe gishya muri Farms & Plots',
      actionType: 'open_modal',
      modalTarget: 'plot',
    },
  },

  // =========================================================================
  // G. WATER MANAGEMENT AND CLIMATE RESILIENCE
  // =========================================================================

  // 11. Climate-Smart Water Conservation & Terraces
  {
    id: 'water-climate-smart-resilience-44',
    topic: 'climate_smart',
    category: 'water',
    problemType: 'water',
    questionEn: 'How can smallholder farmers conserve soil moisture, construct radical terraces (amaterasi), and prepare for climate drought?',
    questionRw: 'Nigute abahinzi bato babika ubuhehere mu butaka, bagakora amaterasi y\'indinganire, bakanitegura imihindagurikire y\'ibihe n\'amapfa?',
    directAnswerEn: 'Climate-smart soil and water resilience in Rwanda rests on four integrated land management practices: 1) Radical and Progressive Terracing (*Amaterasi y\'indinganire n\'ayikora*) on slopes above 16% to capture 100% of rain runoff and eliminate catastrophic soil erosion; 2) Vegetative Contour Hedgerows (*Imirongo y\'urubingo na Vetiver*) planted along contours to trap eroding silt and build natural terraces over time; 3) Soil Moisture Retention Mulching (covering soil with 5–10cm of organic straw, maize stover, or agroforestry loppings to reduce direct evaporation by up to 70% and lower soil surface temperatures by 5°C); and 4) Farm Rainwater Ponds (*Ibigega by\'amazi byo mu murima*) excavated with plastic geomembrane liners to harvest runoff for emergency supplemental drip irrigation during mid-season dry spells. Smallholders who combine terracing with organic composting remain productive even during erratic rain seasons.',
    directAnswerRw: 'Guhangana n\'imihindagurikire y\'ibihe n\'amapfa mu Rwanda bishingira ku bikorwa 4 by\'ingenzi: 1) Amaterasi y\'indinganire n\'ayikora ku misozi ihanamye hejuru ya 16% afata amazi yose y\'imvura akabuza isuri gutwara ubutaka bwera; 2) Gutera ibiti n\'ibyatsi birinda isuri ku mirongo ikingitse (urubingo, vetiver, calliandra) bifata ibitaka bitembana bigakora amaterasi ya kamere; 3) Gusasira umurima n\'ibisheke cyangwa ibyatsi byumye cm 5–10 bigabanya gukama kw\'amazi ku zuba hejuru ya 70% bikanakonjesha ubutaka; no 4) Gucukura ibigega by\'amazi byo mu gitaka birimo shitingi bikusanya amazi atemba agafasha kuhira ibihingwa igihe izuba ryatunguranye mu gihe cy\'amapfa. Abahinzi bakora ibi basarura neza n\'igihe imvura yabaye nkeya.',
    causesEn: 'Erratic rainfall patterns in Eastern Rwanda (Nyagatare, Bugesera) cause sudden multi-week dry spells during critical crop flowering stages; sloping terrain without terraces loses over 40 tonnes of fertile topsoil per hectare annually to runoff.',
    causesRw: 'Imihindagurikire y\'ikirere mu Burasirazuba (Nyagatare, Bugesera) itera amapfa y\'ibyumweru byinshi igihe ibihingwa biri kurabyo; imisozi idafite amaterasi itakaza toni zirenga 40 z\'ubutaka bwiza bwa hegitari buri mwaka kubera isuri.',
    missingInfoQuestionsEn: [
      'Is your farm located on a hillside slope or flat lowland?',
      'Do you have access to rainwater collection from roofs or field trenches?',
      'What crops are currently growing in your plot?'
    ],
    missingInfoQuestionsRw: [
      'Ese umurima wawe uri ku musozi uhanamye cyangwa mu kibaya kirambuye?',
      'Ese mufite uburyo bwo gufata amazi y\'imvura ava ku nzu cyangwa mu migezi?',
      'Ni ibihe bihingwa biri mu murima wanyu ubu?'
    ],
    actionStepsEn: [
      'Construct or Maintain Radical Terraces on slopes >16%; plant stabilized grass hedgerows (*Vetiver* or *Pennisetum*) on the terrace risers to prevent embankment collapse.',
      'Mulch heavily in vegetable plots and banana plantations to prevent direct soil baking from midday sun.',
      'Dig Contour Absorption Trenches (imiferege y\'amazi) 50cm deep × 50cm wide along contours to slow, spread, and sink rainwater into the subsoil aquifer.',
      'Apply for MINAGRI Small-Scale Irrigation Technology (SSIT) 50% government subsidies to acquire low-cost solar pumps and drip kits.'
    ],
    actionStepsRw: [
      'Kora cyangwa usukure amaterasi y\'indinganire ku misozi ihanamye; tera ubwatsi bwa vetiver cyangwa urubingo ku nguni z\'amaterasi ngo ataruka.',
      'Sasira imboga n\'urutoki ukoresheje ibyatsi byumye kugira ngo izuba ry\'amanywa ritamisha amazi y\'ubutaka.',
      'Cukura imiferege ifata amazi (cm 50 z\'ubujyakuzimu na cm 50 z\'ubugari) ikingitse umusozi kugira ngo amazi anywere mu butaka.',
      'Saba nkunganire ya Leta ya 50% yo kuhira ku buso buto (SSIT) unyuze ku murenge ubone imashini zizuba na za drip zikoresha amazi make.'
    ],
    whatToAvoidEn: 'Do NOT burn crop residue stalks after harvest; burning volatilizes carbon and nitrogen and leaves soil bare to wind and sun erosion.',
    whatToAvoidRw: 'Ntukigere utwika ibisheke cyangwa ibishingwe by\'ibigori nyuma yo gusarura; kubitwika byangiza ubutaka bigatuma izuba ryumisha ubutaka vuba.',
    precautionsEn: 'Ensure overflow spillways are built on all rainwater farm ponds to avoid catastrophic bank bursting during torrential cloudbursts.',
    precautionsRw: 'Kora umuyoboro w\'amazi asaguka ku kigega cy\'amazi kugira ngo amazi arenze urugero atagisandaza akangiza umurima wose.',
    expertConsultationEn: 'Consult Sector Soil and Water Conservation Officers for survey leveling of contour terraces.',
    expertConsultationRw: 'Gana abashinzwe kubungabunga ubutaka n\'amazi mu murenge bakwereke uburyo bwo gupima imirongo y\'amaterasi akoresheje urugero rwa A-frame.',
    keywordsEn: ['climate resilience', 'soil conservation', 'radical terraces', 'amaterasi', 'mulching', 'rainwater harvesting', 'vetiver', 'drought preparation'],
    keywordsRw: ['amaterasi y\'indinganire', 'isuri', 'kubungabunga ubutaka', 'gusasira', 'ikigega cy\'amazi', 'vetiver', 'amapfa', 'kuhira'],
    locationContext: 'Eastern Savanna & Steep Highland Provinces in Rwanda',
    source: 'MINAGRI National Land Husbandry, Water Harvesting and Hillside Irrigation Project',
    sourceOrganization: 'MINAGRI',
    sourceTitle: 'Guidelines for Hillside Soil Conservation and Climate Smart Agriculture',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'weather',
      labelEn: 'Check Sector Weather Advisories',
      labelRw: 'Reba Amakuru y\'Ikirere n\'Iteganyagihe',
    },
  },

  // =========================================================================
  // H. HARVESTING AND POST-HARVEST MANAGEMENT
  // =========================================================================

  // 12. Aflatoxin Prevention & Hermetic PICS Storage
  {
    id: 'post-harvest-aflatoxin-mycotoxins-40',
    topic: 'post_harvest',
    category: 'post_harvest',
    problemType: 'post_harvest',
    questionEn: 'How can maize and bean farmers prevent deadly Aflatoxin contamination and achieve export-grade storage quality?',
    questionRw: 'Nigute abahinzi b\'ibigori n\'ibishyimbo birinda uburozi bwa Aflatoxin bakanabika umusaruro ku rwego rwo kugurishwa ku masoko akomeye?',
    directAnswerEn: 'Aflatoxin is a dangerous, carcinogenic fungal mycotoxin produced by Aspergillus molds (*Aspergillus flavus* and *parasiticus*) that infects maize, groundnuts, and sorghum when dried on bare ground or stored wet. Aflatoxin causes severe liver cancer, stunts child growth, and triggers instant rejection of grain by institutional buyers (such as Africa Improved Foods / AIF, MINAGRI grain reserves, and WFP). Preventing aflatoxin contamination requires: 1) Harvesting maize immediately at maturity (black layer formed at kernel tip); 2) NEVER drying harvested cobs on bare soil where fungal spores thrive — always use clean tarpaulins, mobile driers, or raised cribs; 3) Sorting out all moldy, insect-damaged, or discolored grains before shelling; 4) Thoroughly sun-drying grains until moisture is below 13.5% (tested with a calibrated moisture meter, clean glass jar salt test, or sharp kernel biting test); and 5) Storing dry grain in multi-layer hermetic PICS (Purdue Improved Crop Storage) bags without applying hazardous chemical insecticidal dusts.',
    directAnswerRw: 'Aflatoxin ni uburozi bukaze bukozwe n\'uruhumbu rw\'umuyege wa Aspergillus bwibasira ibigori, ubunyobwa n\'amasaka iyo byanitswe ku butaka cyangwa bikabikwa bitarumye neza. Aflatoxin itera kanseri y\'umwijima, ikadindiza imikurire y\'abana, kandi ituma abaguzi bakomeye (nk\'inganda zitunganya ibiribwa Africa Improved Foods / AIF, koperative zikomeye na World Food Programme) banga umusaruro wose w\'umuhinzi. Kwirinda aflatoxin bisaba: 1) Gusarura ibigori bikimara kweza (iyo igishishwa cyumye neza); 2) Ntukigere wanika umusaruro ku gitaka cyangwa mu mukungugu ahari udukoko tw\'uruhumbu — yanika kuri shitingi isukuye cyangwa ku matandaro; 3) Kurobamo ibigori byose byafashwe n\'uruhumbu cyangwa byariwe n\'udukoko ubyite kure mbere yo guhura; 4) Kwanika ku zuba kugeza igihe ubuhehere buguye munsi ya 13.5% (bipimwa n\'icyuma cyangwa umunyu mu kirahure cyangwa guhekenya ikigori kigaturika); no 5) Kubika umusaruro wumye mu mifuka y\'amashashi 3 ya PICS ifunze neza idasaba gushyiramo umuti w\'ifu w\'uburozi.',
    causesEn: 'Aspergillus fungi invade kernels through insect wounds or field stress; when damp harvested grain (>14% moisture) is piled in hot, humid rooms without airflow, mold spores multiply rapidly and synthesize aflatoxins within 48 to 72 hours.',
    causesRw: 'Umuhumyo wa Aspergillus winjira mu kigori binyuze ku bikomere byatewe n\'udukoko cyangwa izuba; iyo ibigori bibisi (>14% y\'ubuhehere) bibitswe mu nzu yijimye kandi ishyushye idafite umwuka, uruhumbu ruroroka rukora uburozi bwa aflatoxin mu masaha 48 kugeza kuri 72.',
    missingInfoQuestionsEn: [
      'What crop have you harvested (maize, beans, groundnuts, sorghum)?',
      'Are you drying the grain on clean tarpaulins, plastic sheets, or on bare ground?',
      'Have you tested the grain moisture percentage using a moisture meter or salt-jar test?'
    ],
    missingInfoQuestionsRw: [
      'Mwasaruye ikihe gihingwa (ibigori, ibishyimbo, ubunyobwa, amasaka)?',
      'Ese muri kwanika umusaruro kuri shitingi isukuye cyangwa ku butaka?',
      'Ese mwapimye igipimo cy\'ubuhehere bw\'ikigori mukoresheje icyuma cyangwa umunyu mu kirahure?'
    ],
    actionStepsEn: [
      'Harvest at Physiological Maturity: Do not leave mature maize drying in the field where ears get soaked by late rains or infested by weevils.',
      'Drying Hygiene: Always dry on clean, food-grade tarpaulins or elevated wooden cribs off the ground. Never dry on bare soil.',
      'Salt-in-Jar Dryness Test: Place 3 handfuls of dry grain and 2 tablespoons of dry dry table salt into a dry glass jar. Shake for 1 minute; if salt sticks to the glass, moisture is >14% (too wet for storage); if salt stays dry and loose, grain is safely <13.5%.',
      'Sorting: Sort and remove all discolored, moldy, or rotten kernels before bagging; even 2% moldy kernels can contaminate an entire 50kg bag with aflatoxin.',
      'Hermetic PICS Bagging: Pack tightly into multi-layer PICS bags. Twist and tie each inner plastic liner separately with rubber bands to asphyxiate storage weevils naturally without chemicals.'
    ],
    actionStepsRw: [
      'Sarura ku Gihe: Ntukareke ibigori bikuze byumira mu murima aho byatosekera n\'imvura y\'itumba cyangwa bikaribwa n\'imungu.',
      'Isuku yo Kwanika: Yanika buri gihe kuri shitingi isukuye cyangwa ku matandaro asumbuye ubutaka. Ntukigere wanika ku gitaka.',
      'Gupima n\'Umunyu mu Kirahure: Shyira ibipfunsi 3 by\'ibigori n\'ibiyiko 2 by\'umunyu wumye mu kirahure gisukuye. Zunguza umunota 1; niba umunyu wafashe ku kirahure biracyatose (>14%); niba umunyu wigendera hasi neza birumye (<13.5%).',
      'Kuroba Umusaruro: Kuramo ibigori byose byazanye ibara ry\'umweru, umukara cyangwa byaboze; ibigori 2% byonyine byaboze bishobora kwanduza umufuka wose wa kg 50.',
      'Gukoresha Imifuka ya PICS: Shyira mu mifuka ya PICS ifite amashashi 3. Zirika buri shashi ukwayo n\'imikwege kugira ngo umwuka wose uburemo imungu ipfe nta muti ukenewe.'
    ],
    whatToAvoidEn: 'NEVER use pesticide powders meant for field spraying (like Mancozeb or synthetic pyrethroids) on stored grains meant for human or animal consumption; doing so causes lethal food poisoning.',
    whatToAvoidRw: 'Ntukigere ufata imiti yagenewe gutera mu murima (nk\'ifu ya Mancozeb) ngo uyiminjire ku bigori cyangwa ibishyimbo byo kurya; bitera uburozi bwica abantu n\'amatungo.',
    precautionsEn: 'Store sealed PICS bags on wooden pallets off the concrete floor and at least 30cm away from stone walls to avoid moisture condensation.',
    precautionsRw: 'Bika imifuka ya PICS hejuru y\'ibiti (pallets) itegeranye n\'urukuta ngo ubuhehere butava mu bikuta buzamo.',
    expertConsultationEn: 'List your certified Grade 1 produce on AgriBridge Marketplace to access premium bulk institutional buyers offering top farmgate prices.',
    expertConsultationRw: 'Shyira umusaruro wawe wa Grade 1 wujuje ubuziranenge ku Isoko rya AgriBridge ugurishwe n\'inganda nini n\'abaguzi bakuru ku giciro cyiza cyane.',
    keywordsEn: ['aflatoxin', 'mycotoxins', 'pics bags', 'hermetic storage', 'maize drying', 'moisture test', 'post harvest loss', 'food safety'],
    keywordsRw: ['aflatoxin', 'uburozi bw\'uruhumbu', 'imifuka ya pics', 'kwanika', 'ubuhehere', 'isoko rya agribridge', 'ubuziranenge'],
    locationContext: 'Eastern Province, Southern Basins, Western Highlands',
    source: 'RAB & Rwanda Food and Drugs Authority (FDA) Post-Harvest Guidelines',
    sourceOrganization: 'RAB',
    sourceTitle: 'National Code of Practice for the Prevention and Reduction of Aflatoxin in Food and Feed',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'List Quality-Graded Produce on Marketplace',
      labelRw: 'Shyira Umusaruro Wujuje Ubuziranenge ku Isoko',
      actionType: 'open_modal',
      modalTarget: 'listing',
    },
  },

  // =========================================================================
  // I. LIVESTOCK AND MIXED FARMING
  // =========================================================================

  // 13. Mixed Crop-Livestock Integration & Biosecurity
  {
    id: 'livestock-mixed-farming-manure-41',
    topic: 'livestock',
    category: 'livestock',
    problemType: 'general',
    questionEn: 'How can smallholders optimize mixed crop-livestock farming through manure cycling, fodder feeding, and farm biosecurity?',
    questionRw: 'Nigute abahinzi-borozi buzuza ubuhinzi n\'ubworozi bakoresheje amase, ubwatsi bw\'imyaka, n\'isuku y\'ibiraro?',
    directAnswerEn: 'Mixed crop-livestock integration is Rwanda\'s most sustainable agricultural model (pioneered through national programs like *Girinka / One Cow per Poor Family*). The system functions as a closed nutrient cycle: 1) Crop residues (maize stover, bean haulms, sweet potato vines) provide roughage feed for zero-grazed cattle, goats, and pigs; 2) Livestock manure and urine are collected, cured into rich aerobic compost or bio-slurry, and returned to crop plots to restore nitrogen, phosphorus, and organic carbon without exhausting household cash on synthetic fertilizers; 3) Fodder hedgerows (*Brachiaria*, *Desmodium*, *Calliandra*) planted along soil conservation terraces provide high-protein animal feed while stopping hillside erosion. Maintaining farm biosecurity is paramount: construct raised slatted housing for small stock, install disinfectant footbaths at barn entrances, quarantine newly purchased animals for 14 days, and report sudden livestock fever, mouth blisters, or bloody diarrhea to the Sector Veterinary Officer immediately.',
    directAnswerRw: 'Guhuza ubuhinzi n\'ubworozi niwo mutima w\'ubuhinzi burambye mu Rwanda (nk\'uko bitezwa imbere muri gahunda ya *Girinka Munyarwanda*). Ubu buryo bukorana ku buryo busobanutse: 1) Ibisigazwa by\'imyaka (ibisheke by\'ibigori, amakoma y\'ibishyimbo, imigozi y\'ibijumba) bitungwaho amatungo mu kiraro (zero-grazing); 2) Amase n\'inkari by\'amatungo bikusanywa neza, bikaborerezwa gukora compost ikize cyangwa bio-slurry ya biogas, bigasubizwa mu mirima kongera uburumbuke udakoresheje amafaranga menshi ku ifumbire mvaruganda; 3) Ibyatsi by\'amatungo biterwa ku materasi (Brachiaria, Desmodium, Calliandra) birinda isuri bikagaburira amatungo ifunguro rikize kuri poroteyine. Isuku y\'ikiraro (biosecurity) ni ngombwa cyane: baka ibiraro bisumbuye ubutaka ku matungo magufi, shyira umuti wo gukandagizamo inkweto ku muryango w\'ikiraro, shyira ukwayo itungo rishya uguze iminsi 14 mbere yo kurivanga n\'ayandi, kandi umenye gutabaza muganga w\'amatungo (Veterinaire) w\'umurenge niba ubonye umuriro cyangwa impiswi y\'amaraso.',
    causesEn: 'Unsanitary, muddy kraals foster foot rot, mastitis, and internal parasite cycles. Feeding unchopped moldy crop residues causes bloat and mycotoxin poisoning in ruminants.',
    causesRw: 'Ibiraro byuzuye ibyondo n\'umwanda bitera uburwayi bw\'amabere (mastite), kubora kw\'inzara, n\'inzoka mu nda. Kugaburira amatungo ibisheke biboze bitera kubyimba inda (bloat) n\'uburozi mu nda.',
    missingInfoQuestionsEn: [
      'What livestock are you raising (cattle, goats, sheep, poultry, pigs)?',
      'Are animals housed in a zero-grazing stall or allowed to graze freely?',
      'Are you composting manure in a covered pit or leaving it exposed to rain leaching?'
    ],
    missingInfoQuestionsRw: [
      'Morora ayahe matungo (inka, ihene, intama, inkoko, ingurube)?',
      'Ese amatungo aba mu kiraro (zero-grazing) cyangwa ararisha ku musozi?',
      'Ese amase yayo muyakoramo imborera mu rwobo rutwikiriye cyangwa muguma muyasiga ku zuba n\'imvura?'
    ],
    actionStepsEn: [
      'Zero-Grazing Stalls: Build well-ventilated, roofed housing with a concrete or slatted wooden floor sloping toward a urine collection tank.',
      'Manure Pit Management: Collect daily manure and bedding into a 2m × 2m covered compost pit; turn every 14 days so aerobic heat destroys parasite eggs and weed seeds.',
      'Chop Crop Residues: Chop dry maize stover and bean haulms into 2–3cm pieces with a forage chopper or machete; sprinkle with light molasses-salt water to boost digestibility.',
      'Biosecurity Footbaths: Place a plastic basin filled with clean water and disinfectant (Jik or Virkon) at the pen entrance; dip boots before entering.',
      'Mandatory Quarantine: Keep newly purchased cattle or goats in a separate quarantine pen for 14 days to observe for contagious diseases before mixing with the home herd.'
    ],
    actionStepsRw: [
      'Ikiraro cya Zero-Grazing: Baka ikiraro gifite igisenge gisukuye n\'amadirishya yinjiza umwuka, hasi hahengamiye mu kigega gifata inkari.',
      'Gutunganya Amase: Kusanya amase yose buri munsi mu rwobo rutwikiriye rwa metero 2 kuri 2; yihindukize buri minsi 14 kugira ngo ubushyuhe bwice amagi y\'inzoka n\'ibyatsi bibi.',
      'Cagagura Ibisheke: Cagagura ibisigazwa by\'ibigori n\'ibishyimbo mo uduce duto twa cm 2–3; vanga n\'amazi arimo umunyu cyangwa molasses kugira ngo inka zibye neza.',
      'Umuti wo mu Muryango: Shyira ibase irimo amazi arimo umuti wisukura mu muryango w\'ikiraro buri muntu wese anyukemo mbere yo kwinjira.',
      'Kwegeka Itungo Rishya: Itungo ryose uguze rishyire ukwayo iminsi 14 mbere yo kurivanga n\'ayandi urebe ko ritazanye indwara zandura.'
    ],
    whatToAvoidEn: 'NEVER feed moldy, rotten crop residues or damp poultry manure directly to lactating dairy cows or pregnant heifers; do NOT self-prescribe injectable veterinary antibiotics without professional veterinary oversight.',
    whatToAvoidRw: 'Ntukigere ugaburira inka zikamwa ibisheke biboze cyangwa amase y\'inkoko atokeje; ntukigere witera inshinge z\'imiti y\'amatungo utabifashijwemo na veterinaire.',
    precautionsEn: 'Observe mandatory meat and milk withdrawal periods stated on veterinary drug bottles when treating sick animals.',
    precautionsRw: 'Kurikiza iminsi iteganywa n\'imiti y\'amatungo yo kutanywa cyangwa ngo ugurishe amata n\'inyama igihe itungo rikivurwa.',
    expertConsultationEn: 'Consult registered veterinarians in your district on AgriBridge for vaccination schedules and artificial insemination (AI) services.',
    expertConsultationRw: 'Hamagara abaganga b\'amatungo (Veterinaires) banditse kuri AgriBridge ku bijyanye n\'inkingo no gutera intanga mu nka.',
    keywordsEn: ['mixed farming', 'crop livestock', 'manure cycling', 'biosecurity', 'girinka', 'zero grazing', 'quarantine', 'footbath', 'vet'],
    keywordsRw: ['ubuhinzi n\'ubworozi', 'amase', 'imborera', 'ikiraro', 'girinka', 'zero-grazing', 'veterinaire', 'ubuzima bw\'amatungo'],
    locationContext: 'All Districts in Rwanda',
    source: 'RAB Animal Resources & Livestock Extension Masterplan',
    sourceOrganization: 'RAB',
    sourceTitle: 'Manual of Integrated Crop-Livestock Farming and Veterinary Biosecurity',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'directory',
      labelEn: 'Find Registered Veterinarians',
      labelRw: 'Shaka Abaganga b\'Amatungo kuri AgriBridge',
    },
  },

  // =========================================================================
  // J. FARM BUSINESS AND AGRICULTURAL FINANCE
  // =========================================================================

  // 14. Farm Business Math, Unit Economics & Break-Even
  {
    id: 'finance-revenue-profit-calculations-50',
    topic: 'farm_budgeting',
    category: 'finance',
    problemType: 'finance',
    questionEn: 'How do I calculate farm revenue, total production costs, net profit, and break-even price per kilogram on AgriBridge?',
    questionRw: 'Nigute mbara amafaranga yinjijwe (revenue), ibyakoreshejwe byose (costs), inyungu nyakuri (net profit), n\'igiciro ntarengwa (break-even) kuri AgriBridge?',
    directAnswerEn: 'Managing farming as a profitable agribusiness requires understanding 3 fundamental financial formulas: 1) Revenue = Quantity Harvested & Sold (kg) × Selling Price per Unit (RWF/kg). For example, selling 2,000 kg of beans at 800 RWF/kg yields Revenue = 1,600,000 RWF. 2) Total Production Costs = Land Preparation + Seeds + Fertilizers/Manure + Pesticides + Labor + Irrigation + Transport/Bags. For example, total costs = 900,000 RWF. 3) Net Profit = Total Sales Revenue − Total Production Costs. In this example, Net Profit = 1,600,000 − 900,000 = 700,000 RWF (a 77.8% Return on Investment). Crucially, the Break-Even Price per Kilogram = Total Costs ÷ Total Harvest (kg). In this case: 900,000 RWF ÷ 2,000 kg = 450 RWF/kg. This means the farmer must NEVER accept any buyer offer below 450 RWF/kg, as doing so generates an automatic financial loss. AgriBridge Farm Finance Ledger automatically tracks these unit economics across every recorded plot.',
    directAnswerRw: 'Gucunga ubuhinzi nk\'ubucuruzi bwunguka bisaba kumenya imibare 3 y\'ingenzi: 1) Amafaranga Yose Winjije (Revenue) = Ibiro Wasaruye Ukagurisha (kg) × Igiciro cy\'Ikiro (RWF/kg). Urugero: kugurisha ibiro 2,000 by\'ibishyimbo ku 800 RWF/kg bitanga Revenue = 1,600,000 RWF. 2) Ibyakoreshejwe Byose (Total Costs) = Guhinga + Imbuto + Ifumbire/Manyire + Imiti + Abakozi + Kuhira + Gutwara/Imifuka. Urugero: amafaranga yose yakoreshejwe = 900,000 RWF. 3) Inyungu Nyakuri (Net Profit) = Amafaranga Winjije − Ibyakoreshejwe Byose. Muri uru rugero: Inyungu = 1,600,000 − 900,000 = 700,000 RWF. Ikirenzeho, Igiciro Fatizo Ntarengwa (Break-Even Price) = Amafaranga Yakoreshejwe Byose ÷ Ibiro Byose Wasaruye. Muri uru rugero: 900,000 RWF ÷ 2,000 kg = 450 RWF ku kilo. Ibi bivuga ko umuhinzi ADASHOBORA kwemera igiciro cy\'umuguzi kiri munsi ya 450 RWF/kg kuko yaba ahomba. Igitabo cy\'Imari cya AgriBridge (Farm Finance Ledger) kibikubarira mu buryo bw\'ikoranabuhanga kuri buri murima.',
    causesEn: 'Farmers frequently experience unexpected losses because they fail to record daily small cash outflows (e.g. daily casual labor, mobile money fees, bag stitching) or confuse total gross revenue with actual net profit.',
    causesRw: 'Abahinzi bakunze guhomba batabizi kubera ko bibagirwa kwandika amafaranga mato agenda buri munsi (abakozi, momo fees, imifuka) cyangwa bakitiranya amafaranga bafashe mu ntoki (revenue) n\'inyungu nyakuri (profit).',
    missingInfoQuestionsEn: [
      'What crop did you grow, and how many kilograms did you harvest?',
      'What was your selling price per kilogram (or buyer offer)?',
      'What were your total input and labor expenses for this plot?'
    ],
    missingInfoQuestionsRw: [
      'Mwahinze ikihe gihingwa, kandi mwasaruye ibiro bingahe?',
      'Mwagurishije ku kahe giciro ku kilo (cyangwa umuguzi yabahaye ikihe giciro)?',
      'Mwakoresheje amafaranga angahe yose hamwe ku mbuto, ifumbire n\'abakozi kuri uwo murima?'
    ],
    actionStepsEn: [
      'Record Cash Outflows Daily: Use the AgriBridge Farm Finance Ledger tab to log every seed bag, fertilizer purchase, and laborer payment on the date it occurs.',
      'Calculate Your Break-Even Floor: Before negotiating on the AgriBridge Marketplace, divide your total recorded plot expenses by estimated harvest volume to know your non-negotiable minimum price.',
      'Evaluate Buyer Offers: When a buyer submits an offer under "Buyer Offers", compare their offer against your break-even price; use the Counter-Offer button to protect your profit margin.',
      'Diversify Agricultural Risk: Avoid investing 100% of seasonal capital into a single plot or monoculture; combine staples (maize/beans) with high-value short-cycle horticulture (onions/tomatoes) or dairy livestock.'
    ],
    actionStepsRw: [
      'Andika Buri Munsi: Koresha agashami ka Farm Finances muri AgriBridge wandike buri mafaranga asohotse (imbuto, ifumbire, abakozi) ku munsi nyirizina.',
      'Bara Igiciro cyawe Fatizo: Mbere yo kuganira ku isoko rya AgriBridge, gaba amafaranga yose wakoresheje ku biro witeze gusarura kugira ngo umenye igiciro ntarengwa wemera.',
      'Genzura Ibiciro by\'Abaguzi: Iyo umuguzi ahaye igiciro munsi ya "Buyer Offers", kigereranye n\'ikiguzi cyawe; koresha buto ya "Counter-Offer" ugirane imishyikirano ku giciro cyunguka.',
      'Guhinduranya Ibihingwa: Irinde gushyira amafaranga yawe yose mu gihingwa kimwe gusa; vanga ibinyampeke n\'imboga zihuta (ibitunguru/inyanya) cyangwa amatungo y\'amata.'
    ],
    whatToAvoidEn: 'NEVER accept buyer prices below your break-even production cost per kg; do NOT spend revenue without setting aside input capital for next season\'s certified seeds and fertilizer.',
    whatToAvoidRw: 'Ntukigere wemera igiciro cy\'umuguzi kiri munsi y\'ikiguzi cyo kweza ikiro; ntukareke gukuraho amafaranga y\'imbuto n\'ifumbire by\'igihembwe gikurikira ngo ukoreshe amafaranga yose winjije.',
    precautionsEn: 'Keep digital and paper receipts for all certified inputs to substantiate produce quality and organic status to premium institutional buyers.',
    precautionsRw: 'Bika inyemezabwishyu zose z\'imbuto n\'ifumbire waguze kugira ngo uzereke abaguzi bakuru bishimira umusaruro wujuje ubuziranenge.',
    expertConsultationEn: 'Access the Farm Finance Ledger tab in AgriBridge to view instant net profit, expense pie charts, and return on investment percentages.',
    expertConsultationRw: 'Fungura agashami ka Farm Finances muri AgriBridge kugira ngo ubone inyungu nyakuri, ibyakoreshejwe n\'ijanisha ry\'inyungu ku mafaranga washyizemo.',
    keywordsEn: ['farm budgeting', 'revenue calculation', 'net profit', 'break even price', 'production costs', 'farm economics', 'return on investment'],
    keywordsRw: ['ingengo y\'imari', 'kubara inyungu', 'amafaranga yakoreshejwe', 'igiciro fatizo', 'break-even', 'agribridge finances', 'ubucuruzi bw\'ubuhinzi'],
    locationContext: 'All Farm Enterprises in Rwanda',
    source: 'MINAGRI Agribusiness & Agricultural Economics Directorate',
    sourceOrganization: 'MINAGRI',
    sourceTitle: 'Smallholder Farm Enterprise Budgeting and Financial Literacy Training Manual',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'finance',
      labelEn: 'Open Farm Finance Ledger & Calculator',
      labelRw: 'Fungura Igitabo cy\'Imari cya AgriBridge',
    },
  },

  // =========================================================================
  // K. AGRIBRIDGE PLATFORM COMPLETE OPERATIONAL CAPABILITIES
  // =========================================================================

  // 15. AgriBridge Complete Platform Workflow Guide
  {
    id: 'platform-complete-guide-52',
    topic: 'platform_usage',
    category: 'agribridge',
    problemType: 'general',
    questionEn: 'How does AgriBridge Rwanda work end-to-end, and what are all operational features available to farmers and buyers?',
    questionRw: 'Ese AgriBridge Rwanda ikora ite kuva ku ntangiriro kugeza ku musozo, kandi ni izihe serivisi zose zikora ziboneka?',
    directAnswerEn: 'AgriBridge Rwanda is a full-stack, offline-first digital agricultural platform built to eliminate predatory middlemen (*abamamyi*), empower smallholder farmers with transparent pricing, and provide verified agricultural science across Rwanda. The operational features include: 1) Farms & Plots Manager (record farm holdings, geo-sectors, plot boundaries, crop cycles, and milestone stages from germination to harvest); 2) Produce Marketplace (farmers list dry beans, maize, rice, potatoes, and vegetables with transparent Quality Grades 1/2/3, quantity, and asking price per kg); 3) Buyer Offers & Negotiation (certified institutional buyers discover listings, submit transparent price offers, and farmers accept, counter, or reject offers); 4) Orders & Escrow Tracking (track dispatched orders, delivery logistics, aggregation center receipts, and commission transparency); 5) Farm Finance Ledger (record expenses by category — seeds, fertilizer, labor, transport — and automatically calculate net profit and break-even thresholds); 6) Certified Agro-Supplier & Expert Directory (browse verified RAB-accredited input dealers, soil test centers, and registered agronomists); 7) Farmer Training Center (listen to authentic Kinyarwanda audio extension lessons with interactive playback); 8) Weather Advisories (sector-level forecast alerts with practical agronomic recommendations); 9) Community Agent Desk (connect with trained extension agents stationed in sectors who assist feature-phone farmers with tablet aggregation); and 10) 100% Offline Knowledge Base & Guided Problem Solver (access verified RAB agricultural science without needing active internet data).',
    directAnswerRw: 'AgriBridge Rwanda ni urubuga rw\'ikoranabuhanga ry\'ubuhinzi rikora n\'igihe nta interineti ihari, ryashinzwe kugira ngo rikuzeho abamamyi baryamira umuhinzi, rihe umuhinzi igiciro gikwiye, kandi ritange ubumenyi bwizewe mu turere twose tw\'u Rwanda. Serivisi zose zikora zirimo: 1) Farms & Plots (kwandika imirima, imirenge, ibice by\'umurima, n\'igihembwe cy\'igihingwa kuva kiramye kugeza gisaruwe); 2) Produce Marketplace (abahinzi bashyira ku isoko ibishyimbo, ibigori, umuceri, ibirayi n\'imboga bafite urugero rw\'ubwiza Grade 1/2/3 n\'igiciro ku kilo); 3) Buyer Offers (abaguzi bakuru basangaho umusaruro bagatanga ibiciro, umuhinzi akemera cyangwa akajya impaka ku giciro); 4) Orders & Logistics (gukurikirana umusaruro wagemuwe, aho uhurizwa, n\'inyemezabwishyu); 5) Farm Finance Ledger (kwandika amafaranga yasohotse ku ifumbire, imbuto n\'abakozi no kubara inyungu nyakuri); 6) Supplier & Expert Directory (kubona abacuruzi b\'imbuto n\'ifumbire bemewe na RAB n\'abaganga b\'amatungo); 7) Training Center (kumva amasomo y\'ubuhinzi mu kinyarwanda cyumvikana neza); 8) Iteganyagihe n\'Ikirere (amakuru y\'imvura n\'inama z\'ubuhinzi mu mirenge); 9) Community Agent Desk (abajyanama ba AgriBridge bafasha abahinzi bafite telefone zisanzwe mu mirenge); na 10) Ubumenyi n\'Isuzuma ry\'Uburwayi bw\'Imyaka bukora 100% Offline (bidasaba interineti).',
    causesEn: 'Traditional agricultural value chains fail because smallholder farmers lack direct connection to bulk processors and have zero transparency into fair market rates, forcing them to sell at a loss at harvest gate.',
    causesRw: 'Ubuhinzi bwa kera bwahombaga kubera ko umuhinzi atari afite uburyo bwo guhura n\'inganda zitunganya umusaruro nta n\'amakuru y\'ibiciro afite, bigatuma abamamyi babagurira ku giceri cy\'intica ntikize.',
    actionStepsEn: [
      'Step 1: Go to "Farms & Plots" tab and click "+ Register Plot" to log your farm plot, crop type, and planting date.',
      'Step 2: Advance crop growth stages as your crop develops to receive automated stage-specific weeding, fertilizing, and harvesting advisories.',
      'Step 3: At harvest, click "+ List Produce" to publish your crop quantity and asking price onto the AgriBridge Marketplace.',
      'Step 4: Review incoming offers under "Buyer Offers" and accept competitive bids or negotiate with counter-offers.',
      'Step 5: Record production expenses in the "Farm Finances" ledger to automatically calculate net profit and ROI.',
      'Step 6: Use "AgriBridge AI" for 24/7 verified agricultural advice, offline knowledge retrieval, or problem diagnosis.'
    ],
    actionStepsRw: [
      'Intambwe ya 1: Gana ahanditse "Farms & Plots" ukande "+ Register Plot" wandike umurima, igihingwa n\'itariki yo gutera.',
      'Intambwe ya 2: Genda uhindura intambwe igihingwa kigezemo kugira ngo uhabwe inama zihariye zo kubagara, ifumbire no gusarura.',
      'Intambwe ya 3: Iyo wejeje, kanda "+ List Produce" ushyire umusaruro n\'igiciro cyawe ku Isoko rya AgriBridge.',
      'Intambwe ya 4: Reba ibiciro abaguzi baguha munsi ya "Buyer Offers" wemere igiciro cyiza cyangwa wishyikirane.',
      'Intambwe ya 5: Andika amafaranga wakoresheje muri "Farm Finances" ikubarire inyungu nyakuri wasaruye.',
      'Intambwe ya 6: Koresha "AgriBridge AI" igihe cyose ukeneye inama zizewe, ubumenyi n\'isuzuma ry\'uburwayi bukora n\'iyo nta interineti ufite.'
    ],
    whatToAvoidEn: 'Do NOT release harvested produce without confirming confirmed order status on AgriBridge or verification from your Sector Community Agent.',
    whatToAvoidRw: 'Ntukigere utanga umusaruro utabanje kwizera ko amasezerano yemejwe neza kuri AgriBridge cyangwa ufashe ubufasha bw\'umujyanama wawe w\'ubuhinzi.',
    precautionsEn: 'Provide honest grade assessments (Grade 1 Premium vs Grade 2 Commercial) to build enduring 5-star reputation with institutional buyers.',
    precautionsRw: 'Hitamo urugero rw\'ubwiza nyarwo rw\'umusaruro (Grade 1 cyangwa Grade 2) kugira ngo wubake icyerekezo cyiza cy\'ubwizerane n\'abaguzi bakuru.',
    expertConsultationEn: 'Need on-site digital assistance? Visit the Agent Desk tab to contact the AgriBridge Community Agent stationed in your sector.',
    expertConsultationRw: 'Ukeneye ubufasha bwo gukoresha urubuga? Gana ahari "Agent Desk" uvugane n\'umujyanama wa AgriBridge uri mu Murenge wawe.',
    keywordsEn: ['agribridge platform', 'how it works', 'selling produce', 'farm management', 'buyer offers', 'finance ledger', 'community agents', 'idris and melody'],
    keywordsRw: ['agribridge', 'uko ikora', 'kugurisha', 'gucunga imirima', 'isoko', 'abajyanama b\'ubuhinzi', 'amafaranga', 'idris na melody'],
    locationContext: 'All 30 Districts and Agricultural Sectors of Rwanda',
    source: 'AgriBridge Rwanda Operational Platform Charter',
    sourceOrganization: 'AgriBridge',
    sourceTitle: 'AgriBridge Rwanda End-to-End Operating Procedures & Standards',
    lastReviewed: '2026-03-01',
    reviewStatus: 'verified',
    confidenceLevel: 'high',
    platformAction: {
      tab: 'marketplace',
      labelEn: 'Explore Live Produce Marketplace',
      labelRw: 'Sura Isoko rya AgriBridge',
    },
  },
];
