import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types/index.ts';
import {
  KinyarwandaAudio,
  KinyarwandaSpeaker,
  AudioPlaybackState,
} from '../utils/audioPlayer.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  speakKinyarwandaText: (text: string, identifier?: string) => void;
  isSpeaking: boolean;
  audioState: AudioPlaybackState;
  speaker: KinyarwandaSpeaker;
  setSpeaker: (speaker: KinyarwandaSpeaker) => void;
  audioSpeed: number;
  setAudioSpeed: (speed: number) => void;
  activeAudioId: string | null;
  audioProgress: { current: number; duration: number };
  pauseAudio: () => void;
  resumeAudio: () => void;
  stopAudio: () => void;
}

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Global
    'app.title': 'AgriBridge Rwanda',
    'app.tagline': 'Nyagatare Agricultural Hub',
    'nav.dashboard': 'Farms & Plots',
    'nav.marketplace': 'Produce Market',
    'nav.offers': 'Buyer Offers',
    'nav.orders': 'Orders & Deals',
    'nav.finance': 'Farm Finances',
    'nav.directory': 'Suppliers & Experts',
    'nav.training': 'Training & Audio',
    'nav.weather': 'Weather & Advisory',
    'nav.agent': 'Agent Desk',
    'nav.admin': 'District Admin',

    'btn.newPlot': '+ Register Plot',
    'btn.newListing': '+ List Produce',
    'btn.addExpense': '+ Log Farm Expense',
    'btn.judgeLogin': 'Judge Demo Access',
    'btn.signIn': 'Sign In / Register',
    'btn.signOut': 'Sign Out',

    'role.label': 'Active Role',
    'role.farmer': 'Smallholder Farmer',
    'role.buyer': 'Commodity Buyer',
    'role.agent': 'Community Agent',
    'role.admin': 'District Administrator',

    // Banner & Transparency
    'banner.demoNotice': 'Prototype Data Mode: Showing Nyagatare verified field records and real user session inputs.',
    'banner.filterAll': 'Show All (Demo + Mine)',
    'banner.filterUser': 'My Genuine Records Only',
    'banner.filterDemo': 'Demo Showcase Only',
    'banner.clearUser': 'Clear My Records',
    'banner.resetDemo': 'Reset Demo Data',

    // Farmer Section
    'farmer.title': 'Farm & Plot Management',
    'farmer.subtitle': 'Track cultivated acreage, crops in season, and harvest forecasts across Nyagatare sectors.',
    'farmer.statAcreage': 'Cultivated Land',
    'farmer.statCycles': 'Active Crop Cycles',
    'farmer.statYield': 'Expected Harvest',
    'farmer.statListings': 'Active Produce Listings',
    'farmer.registerFarm': 'Register New Farm',
    'farmer.addPlot': 'Add New Plot',
    'farmer.myFarms': 'My Registered Farms',
    'farmer.activeCrops': 'Crops Currently in Season',
    'farmer.stage': 'Stage',
    'farmer.plantedOn': 'Planted',
    'farmer.harvestEst': 'Est. Harvest',
    'farmer.actionListProduce': 'List for Sale on Marketplace',
    'farmer.advanceStage': 'Advance Growth Stage',

    // Marketplace
    'market.title': 'Nyagatare Produce Marketplace',
    'market.subtitle': 'Connect directly with verified growers in Mimuri, Rukomo, Karangazi, and greater Nyagatare.',
    'market.filterCrop': 'Filter by Crop',
    'market.filterSector': 'Nyagatare Sector',
    'market.filterGrade': 'Quality Grade',
    'market.searchPlaceholder': 'Search by crop, variety, or farmer cooperative...',
    'market.makeOffer': 'Make Purchase Offer',
    'market.viewDetails': 'View Plot & Origin',
    'market.available': 'Available Volume',
    'market.minOrder': 'Minimum Order',
    'market.farmgatePrice': 'Price per kg',
    'market.delivery': 'Pickup / Delivery',
    'market.verifiedFarmer': 'Verified Farmer',

    // Offers & Deals
    'offers.inboundTitle': 'Inbound Buyer Offers',
    'offers.inboundSubtitle': 'Review purchase offers from wholesale buyers, millers, and aggregators.',
    'offers.myBidsTitle': 'My Submitted Offers',
    'offers.myBidsSubtitle': 'Track status of your purchase bids submitted to farmers.',
    'offers.offeredPrice': 'Offered Price',
    'offers.askingPrice': 'Asking Price',
    'offers.quantity': 'Quantity Requested',
    'offers.totalValue': 'Total Value',
    'offers.proposedPickup': 'Proposed Pickup Date',
    'offers.status': 'Negotiation Status',
    'offers.accept': 'Accept & Create Order',
    'offers.decline': 'Decline Offer',
    'offers.counter': 'Counter Offer',
    'offers.counterModalTitle': 'Submit Counteroffer to Buyer',
    'offers.counterPricePlaceholder': 'Your counter price (RWF per kg)',
    'offers.counterNotesPlaceholder': 'Add notes on aggregation center, delivery timing, or terms...',
    'offers.submitCounter': 'Send Counteroffer',

    // Orders & Transactions
    'orders.title': 'Orders, Contracts & Dispatch',
    'orders.subtitle': 'Legally recognized produce purchase contracts, aggregation receipts, and platform commission tracking.',
    'orders.commissionRate': 'Platform Fee Rate',
    'orders.commissionEarned': 'Total Commission Accrued',
    'orders.receipt': 'Aggregation Receipt',
    'orders.dispatch': 'Confirm Dispatch / Delivery',

    // Farm Finances
    'finance.title': 'Farm Financial Ledger & Profitability',
    'finance.subtitle': 'Record production expenses, reconcile crop sales revenue, and measure net margin in RWF.',
    'finance.grossRevenue': 'Gross Sales Revenue',
    'finance.totalCost': 'Total Input & Labor Costs',
    'finance.netProfit': 'Net Margin (Profit / Loss)',
    'finance.roi': 'Return on Investment (ROI)',
    'finance.expenseBreakdown': 'Expenditure by Category',
    'finance.salesReconciliation': 'Completed Produce Sales',

    // Directories
    'dir.title': 'Agro-Suppliers & Expert Agronomists',
    'dir.subtitle': 'Certified seed and fertilizer stockists and RAB-affiliated agronomy specialists serving Nyagatare.',
    'dir.suppliersTab': 'Certified Input Suppliers',
    'dir.expertsTab': 'Agronomists & Extension Workers',
    'dir.bookAdvisory': 'Request Agronomy Advisory',

    // Training & Audio
    'train.title': 'Farmer Training & Agrochemical Safety',
    'train.subtitle': 'Verified seasonal crop guides, safe fertilizer application, and spoken Kinyarwanda audio lessons.',
    'train.listenAudio': 'Play Lesson Audio (Kinyarwanda)',
    'train.keyTakeaways': 'Key Field Instructions',

    // Weather & Advisory
    'weather.title': 'Nyagatare Agricultural Weather & Advisory',
    'weather.subtitle': 'Localized rainfall probability and field management advisories for Nyagatare farming sectors.',

    // Admin & Verification
    'admin.title': 'District Agricultural Administration & Oversight',
    'admin.subtitle': 'Monitor Nyagatare commodity trade, e-Soko MINICOM price benchmarks, and verify cooperatives.',
    'admin.gmv': 'Gross Merchandise Value (GMV)',
    'admin.totalVol': 'Total Volume Traded',
    'admin.verifiedCoops': 'Verified Cooperatives',

    // Community Agent
    'agent.title': 'Community Agent Assistance Portal',
    'agent.subtitle': 'Assist smallholder farmers with limited digital literacy or basic phones to record plots and market surplus harvest.',
    'agent.registerFarmerBtn': 'Onboard Farmer on Their Behalf',
    'agent.assistedFarmers': 'Farmers Assisted in Nyagatare',

    // General & Common
    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save Record',
    'common.demoTag': 'DEMO RECORD',
    'common.userTag': 'MY LIVE RECORD',
    'common.audioReadout': 'Listen in Kinyarwanda',
    'common.rwf': 'RWF',
    'common.kg': 'kg',
    'common.ha': 'Ha',
  },
  rw: {
    // Navigation & Global
    'app.title': 'AgriBridge Rwanda',
    'app.tagline': 'Ihuriro ry\'Ubuhinzi muri Nyagatare',
    'nav.dashboard': 'Imirima n\'Ibyanya',
    'nav.marketplace': 'Isoko ry\'Umusaruro',
    'nav.offers': 'Ibyifuzo by\'Abaguzi',
    'nav.orders': 'Amasezerano n\'Umusaruro',
    'nav.finance': 'Imari y\'Umurima',
    'nav.directory': 'Abacuruzi n\'Inzobere',
    'nav.training': 'Amasomo n\'Amajwi',
    'nav.weather': 'Iteganyagihe ry\'Umwuga',
    'nav.agent': 'Ibiro by\'Umujyanama',
    'nav.admin': 'Ubuyobozi bw\'Akarere',

    'btn.newPlot': '+ Ongeraho Icyanya',
    'btn.newListing': '+ Gurisha Umusaruro',
    'btn.addExpense': '+ Andika Amafaranga Wakoresheje',
    'btn.judgeLogin': 'Injira mu buryo bw\'Umusifuzi (Demo)',
    'btn.signIn': 'Injira / Iyandikishe',
    'btn.signOut': 'Sohoka',

    'role.label': 'Uruhare rwange',
    'role.farmer': 'Umuhinzi Muto',
    'role.buyer': 'Umuguzi w\'Umusaruro',
    'role.agent': 'Umujyanama w\'Ubuhinzi',
    'role.admin': 'Umugenzuzi w\'Akarere',

    // Banner & Transparency
    'banner.demoNotice': 'Imiterere y\'Igerageza: Hagaragazwa amakuru y\'icyitegererezo muri Nyagatare n\'amakuru wanditse.',
    'banner.filterAll': 'Garagaza Byose (Icyitegererezo + Ibyanjye)',
    'banner.filterUser': 'Amakuru Yanjye Nyakuri Gusa',
    'banner.filterDemo': 'Icyitegererezo Gusa',
    'banner.clearUser': 'Siba Amakuru Yanjye',
    'banner.resetDemo': 'Subizaho Icyitegererezo',

    // Farmer Section
    'farmer.title': 'Gucunga Imirima n\'Ibyanya',
    'farmer.subtitle': 'Kurikirana ubuso buhinzwe, ibihingwa biri mu murima, n\'iteganyamisaruro muri Nyagatare.',
    'farmer.statAcreage': 'Ubuso Buhinzwe',
    'farmer.statCycles': 'Ibihingwa Biri mu Murima',
    'farmer.statYield': 'Umusaruro Witezwe',
    'farmer.statListings': 'Umusaruro Uri ku Isoko',
    'farmer.registerFarm': 'Kwandikisha Umurima Mushya',
    'farmer.addPlot': 'Ongeraho Icyanya cy\'Umurima',
    'farmer.myFarms': 'Imirima Yanjye Yanditse',
    'farmer.activeCrops': 'Ibihingwa biri mu Murima Ubu',
    'farmer.stage': 'Intera Ikura',
    'farmer.plantedOn': 'Igihe cyatereweho',
    'farmer.harvestEst': 'Iteganyamisaruro',
    'farmer.actionListProduce': 'Shyira ku Isoko ry\'Umusaruro',
    'farmer.advanceStage': 'Komeza ku Ntera Ikurikira',

    // Marketplace
    'market.title': 'Isoko ry\'Umusaruro ry\'i Nyagatare',
    'market.subtitle': 'Huza n\'abahinzi b\'inyangamugayo b\'i Mimuri, Rukomo, Karangazi, n\'ahandi hose muri Nyagatare.',
    'market.filterCrop': 'Guhitamo Igihingwa',
    'market.filterSector': 'Umurenge wo muri Nyagatare',
    'market.filterGrade': 'Icyiciro cy\'Ubwiza',
    'market.searchPlaceholder': 'Shakisha igihingwa, ubwoko, cyangwa koperative...',
    'market.makeOffer': 'Tanga Igiciro cyo Kugura',
    'market.viewDetails': 'Reba Aho Umurima Uherereye',
    'market.available': 'Ingano Ihari',
    'market.minOrder': 'Ingano Nto Itezwe',
    'market.farmgatePrice': 'Igiciro ku kiro',
    'market.delivery': 'Kuhasanga / Kubitwara',
    'market.verifiedFarmer': 'Umuhinzi Wemejwe',

    // Offers & Deals
    'offers.inboundTitle': 'Ibyifuzo byo Kugura Byaje',
    'offers.inboundSubtitle': 'Suzuma ibiciro n\'ingano byasabwe n\'abaguzi banini, inganda, n\'abakusanya umusaruro.',
    'offers.myBidsTitle': 'Ibyifuzo Natanzemo Igiciro',
    'offers.myBidsSubtitle': 'Kurikirana uko ibiciro wasabye abahinzi bihagaze.',
    'offers.offeredPrice': 'Igiciro Cyasabwe',
    'offers.askingPrice': 'Igiciro Umuhinzi Asaba',
    'offers.quantity': 'Ingano Yasabwe',
    'offers.totalValue': 'Amafaranga Yose',
    'offers.proposedPickup': 'Itariki yo Gutwara Umusaruro',
    'offers.status': 'Uko Bimeze',
    'offers.accept': 'Emera & Kora Amasezerano',
    'offers.decline': 'Hakanira Umuguzi',
    'offers.counter': 'Saba Igiciro Gishya',
    'offers.counterModalTitle': 'Ohereza Igiciro Gishya ku Muguzi',
    'offers.counterPricePlaceholder': 'Igiciro cyawe gishya (RWF ku kiro)',
    'offers.counterNotesPlaceholder': 'Sobanura ibyerekeye aho kubifatira, itariki, cyangwa uburyo...',
    'offers.submitCounter': 'Ohereza Igiciro Gishya',

    // Orders & Transactions
    'orders.title': 'Amasezerano, Inyemezabuguzi & Ibyatwawe',
    'orders.subtitle': 'Amasezerano y\'ubugure yemewe n\'amategeko, inyemezabuguzi z\'aho bikusanyirizwa, na komisiyo ya porogaramu.',
    'orders.commissionRate': 'Ijanisha rya Komisiyo',
    'orders.commissionEarned': 'Komisiyo Yose Yakusanyijwe',
    'orders.receipt': 'Inyemezabuguzi y\'Ikusanyirizo',
    'orders.dispatch': 'Emeza ko Byageze ku Muguzi',

    // Farm Finances
    'finance.title': 'Igitabo cy\'Imari n\'Inyungu y\'Umurima',
    'finance.subtitle': 'Andika ibyakoreshejwe byose, suzuma amafaranga yinjiye mu musaruro, ubone inyungu nyakuri mu Mafanga y\'u Rwanda (RWF).',
    'finance.grossRevenue': 'Amafaranga Yose Yinjiye',
    'finance.totalCost': 'Amafaranga Yasohotse Yose',
    'finance.netProfit': 'Inyungu Nyakuri (Inyungu / Igihombo)',
    'finance.roi': 'Umusaruro w\'Ishoramari (ROI)',
    'finance.expenseBreakdown': 'Ibyakoreshejwe hakurikijwe Ibyiciro',
    'finance.salesReconciliation': 'Umusaruro Wagurishijwe Neza',

    // Directories
    'dir.title': 'Abacuruzi b\'Inyongeramusaruro n\'Inzobere',
    'dir.subtitle': 'Abacuruzi b\'imbuto n\'ifumbire bemewe na RAB, hamwe n\'inzobere z\'ubuhinzi muri Nyagatare.',
    'dir.suppliersTab': 'Abacuruzi b\'Inyongeramusaruro',
    'dir.expertsTab': 'Inzobere n\'Abajyanama ba RAB',
    'dir.bookAdvisory': 'Saba Ubujyanama bw\'Inzobere',

    // Training & Audio
    'train.title': 'Amasomo y\'Ubuhinzi n\'Umutekano w\'Imiti',
    'train.subtitle': 'Amasomo yemejwe y\'igihembwe, ikoreshwa ryiza ry\'ifumbire n\'imiti, n\'amajwi y\'ikinyarwanda asomera abahinzi.',
    'train.listenAudio': 'Umva Isomo mu Ijwi ry\'Ikinyarwanda',
    'train.keyTakeaways': 'Amabwiriza Nyambere yo mu Murima',

    // Weather & Advisory
    'weather.title': 'Iteganyagihe ry\'Ubuhinzi muri Nyagatare',
    'weather.subtitle': 'Iteganyamvura ku mirenge y\'i Nyagatare n\'inama z\'ubuhinzi zihuye n\'ikirere.',

    // Admin & Verification
    'admin.title': 'Ubuyobozi n\'Igenzura ry\'Ubuhinzi mu Karere',
    'admin.subtitle': 'Igenzura ry\'ubugure bw\'umusaruro muri Nyagatare, ibiciro bya MINICOM / e-Soko, no kwemeza koperative.',
    'admin.gmv': 'Agaciro k\'Umusaruro Waguzwe Bose',
    'admin.totalVol': 'Ingano Yose Yacurujwe',
    'admin.verifiedCoops': 'Koperative Zemejwe',

    // Community Agent
    'agent.title': 'Ibiro by\'Umujyanama w\'Abahinzi',
    'agent.subtitle': 'Fasha abahinzi badafite telefone zigezweho cyangwa ubumenyi bwa mudasobwa kwandika imirima no kugurisha umusaruro.',
    'agent.registerFarmerBtn': 'Andikisha Umuhinzi mu Izina Rye',
    'agent.assistedFarmers': 'Abahinzi bamaze gufashwa muri Nyagatare',

    // General & Common
    'common.close': 'Funga',
    'common.cancel': 'Reka',
    'common.save': 'Bika',
    'common.demoTag': 'ICYITEGEREREZO',
    'common.userTag': 'AMAKURU YANJYE',
    'common.audioReadout': 'Umva mu Kinyarwanda',
    'common.rwf': 'RWF',
    'common.kg': 'kg',
    'common.ha': 'Ha',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agribridge_lang');
    return (saved === 'rw' || saved === 'en') ? saved : 'en';
  });

  const [audioState, setAudioState] = useState<AudioPlaybackState>(KinyarwandaAudio.getState());
  const [activeAudioId, setActiveAudioId] = useState<string | null>(KinyarwandaAudio.getActiveIdentifier());
  const [speaker, setSpeakerState] = useState<KinyarwandaSpeaker>(KinyarwandaAudio.getSpeaker());
  const [audioSpeed, setAudioSpeedState] = useState<number>(KinyarwandaAudio.getSpeed());
  const [audioProgress, setAudioProgress] = useState<{ current: number; duration: number }>({
    current: 0,
    duration: 0,
  });

  useEffect(() => {
    const unsubscribe = KinyarwandaAudio.subscribe({
      onStateChange: (newState) => {
        setAudioState(newState);
        setActiveAudioId(KinyarwandaAudio.getActiveIdentifier());
      },
      onTimeUpdate: (current, duration) => {
        setAudioProgress({ current, duration });
      },
      onError: (err) => {
        console.warn('Audio playback notice:', err);
      },
    });

    return () => {
      unsubscribe();
      KinyarwandaAudio.stop();
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agribridge_lang', lang);
  };

  const setSpeaker = (spk: KinyarwandaSpeaker) => {
    setSpeakerState(spk);
    KinyarwandaAudio.setSpeaker(spk);
  };

  const setAudioSpeed = (speed: number) => {
    setAudioSpeedState(speed);
    KinyarwandaAudio.setSpeed(speed);
  };

  const t = (key: string): string => {
    return DICTIONARY[language][key] || DICTIONARY['en'][key] || key;
  };

  const speakKinyarwandaText = (text: string, identifier: string = 'generic_audio') => {
    KinyarwandaAudio.play(text, identifier);
  };

  const pauseAudio = () => {
    KinyarwandaAudio.pause();
  };

  const resumeAudio = () => {
    KinyarwandaAudio.resume();
  };

  const stopAudio = () => {
    KinyarwandaAudio.stop();
  };

  const isSpeaking = audioState === 'playing' || audioState === 'loading';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        speakKinyarwandaText,
        isSpeaking,
        audioState,
        speaker,
        setSpeaker,
        audioSpeed,
        setAudioSpeed,
        activeAudioId,
        audioProgress,
        pauseAudio,
        resumeAudio,
        stopAudio,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
