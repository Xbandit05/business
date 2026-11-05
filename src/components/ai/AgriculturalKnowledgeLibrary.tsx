import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { AGRI_KNOWLEDGE_BASE, KnowledgeEntry } from '../../data/agriKnowledgeBase.ts';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  BookmarkCheck,
  Tag,
  Sprout,
  ShieldCheck,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Leaf,
  Droplets,
  Layers,
  Bug,
  AlertTriangle,
  HeartHandshake,
  DollarSign,
  Info,
  X,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface AgriculturalKnowledgeLibraryProps {
  onAskAiAboutEntry?: (entry: KnowledgeEntry) => void;
  onNavigateTab?: (tab: any) => void;
}

export const AgriculturalKnowledgeLibrary: React.FC<AgriculturalKnowledgeLibraryProps> = ({
  onAskAiAboutEntry,
  onNavigateTab,
}) => {
  const { language, setLanguage, speakKinyarwandaText, isSpeaking, stopAudio } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedProblem, setSelectedProblem] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [activeArticle, setActiveArticle] = useState<KnowledgeEntry | null>(null);

  // Saved bookmark IDs in localStorage
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('agribridge_saved_articles');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleSaveArticle = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('agribridge_saved_articles', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const isRw = language === 'rw';

  // Topic Categories
  const TOPIC_OPTIONS = [
    { id: 'all', labelEn: 'All Topics', labelRw: 'Ingingo Zose' },
    { id: 'weed_management', labelEn: 'Weed Management (IWM)', labelRw: 'Ibyatsi Bibi (IWM)' },
    { id: 'soil_health', labelEn: 'Soil Health & Types', labelRw: 'Uburumbuke bw\'Ubutaka' },
    { id: 'fertilizer_management', labelEn: 'Fertilizers & Nutrition', labelRw: 'Ifumbire n\'Intungamubiri' },
    { id: 'pest_management', labelEn: 'Pest Management & IPM', labelRw: 'Udukoko n\'Uburyo bwa IPM' },
    { id: 'crop_diseases', labelEn: 'Crop Diseases', labelRw: 'Indwara z\'Ibihingwa' },
    { id: 'planting_spacing', labelEn: 'Planting & Spacing', labelRw: 'Gutera n\'Intera' },
    { id: 'climate_smart', labelEn: 'Water & Climate Resilience', labelRw: 'Amazi n\'Ikirere' },
    { id: 'post_harvest', labelEn: 'Harvesting & Storage', labelRw: 'Gusarura no Kubika' },
    { id: 'livestock', labelEn: 'Livestock & Mixed Farming', labelRw: 'Ubworozi n\'Amatungo' },
    { id: 'farm_budgeting', labelEn: 'Farm Business & Profit', labelRw: 'Imari n\'Inyungu' },
    { id: 'platform_usage', labelEn: 'AgriBridge Guide', labelRw: 'Uko AgriBridge Ikora' },
  ];

  // Crop Options
  const CROP_OPTIONS = [
    { id: 'all', labelEn: 'All Crops', labelRw: 'Ibihingwa Byose' },
    { id: 'maize', labelEn: 'Maize (Ibigori)', labelRw: 'Ibigori' },
    { id: 'beans', labelEn: 'Beans (Ibishyimbo)', labelRw: 'Ibishyimbo' },
    { id: 'potatoes', labelEn: 'Irish Potatoes (Ibirayi)', labelRw: 'Ibirayi' },
    { id: 'cassava', labelEn: 'Cassava (Imyumbati)', labelRw: 'Imyumbati' },
    { id: 'rice', labelEn: 'Rice (Umuceri)', labelRw: 'Umuceri' },
    { id: 'tomatoes', labelEn: 'Tomatoes & Vegetables', labelRw: 'Inyanya n\'Imboga' },
    { id: 'onions', labelEn: 'Onions (Ibitunguru)', labelRw: 'Ibitunguru' },
    { id: 'cabbage', labelEn: 'Cabbage (Amashu)', labelRw: 'Amashu' },
    { id: 'coffee', labelEn: 'Specialty Coffee (Ikawa)', labelRw: 'Ikawa' },
    { id: 'soybeans', labelEn: 'Soybeans (Soya)', labelRw: 'Soya' },
    { id: 'cattle', labelEn: 'Dairy Cattle (Inka z\'amata)', labelRw: 'Inka' },
    { id: 'goats', labelEn: 'Goats & Sheep (Ihene)', labelRw: 'Ihene n\'Intama' },
    { id: 'poultry', labelEn: 'Poultry (Inkoko)', labelRw: 'Inkoko' },
  ];

  // Problem Types
  const PROBLEM_OPTIONS = [
    { id: 'all', labelEn: 'All Challenges', labelRw: 'Ibibazo Byose' },
    { id: 'weeds', labelEn: 'Weeds & Competition', labelRw: 'Ibyatsi Bibi' },
    { id: 'soil', labelEn: 'Soil Acidity & Structure', labelRw: 'Ubusharire bw\'Ubutaka' },
    { id: 'nutrition', labelEn: 'Yellow Leaves & Deficiencies', labelRw: 'Umuhondo ku Mababi' },
    { id: 'pests', labelEn: 'Insects & Worm Damage', labelRw: 'Inyo n\'Udukoko' },
    { id: 'diseases', labelEn: 'Wilting, Rot & Molds', labelRw: 'Kuma no Kubora' },
    { id: 'water', labelEn: 'Drought & Erosion', labelRw: 'Amapfa n\'Isuri' },
    { id: 'post_harvest', labelEn: 'Storage Weevils & Mold', labelRw: 'Imungu n\'Aflatoxin' },
    { id: 'finance', labelEn: 'Pricing & Break-Even', labelRw: 'Ibiciro n\'Inyungu' },
  ];

  // Filter Articles
  const filteredArticles = useMemo(() => {
    return AGRI_KNOWLEDGE_BASE.filter((entry) => {
      // 1. Saved filter
      if (showSavedOnly && !savedIds.includes(entry.id)) {
        return false;
      }

      // 2. Topic filter
      if (selectedTopic !== 'all' && entry.topic !== selectedTopic) {
        return false;
      }

      // 3. Crop filter
      if (selectedCrop !== 'all') {
        const matchesCategory = entry.category.toLowerCase().includes(selectedCrop.toLowerCase());
        const matchesTarget = entry.targetCrops?.some((tc) =>
          tc.toLowerCase().includes(selectedCrop.toLowerCase())
        );
        const matchesKeywords = entry.keywordsEn.concat(entry.keywordsRw).some((k) =>
          k.toLowerCase().includes(selectedCrop.toLowerCase())
        );
        if (!matchesCategory && !matchesTarget && !matchesKeywords) {
          return false;
        }
      }

      // 4. Problem filter
      if (selectedProblem !== 'all') {
        if (entry.problemType && entry.problemType !== selectedProblem) {
          return false;
        } else if (!entry.problemType && !entry.category.toLowerCase().includes(selectedProblem.toLowerCase())) {
          return false;
        }
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const textToSearch = [
          entry.questionEn,
          entry.questionRw,
          entry.directAnswerEn,
          entry.directAnswerRw,
          entry.category,
          entry.source,
          entry.locationContext || '',
          ...entry.keywordsEn,
          ...entry.keywordsRw,
        ]
          .join(' ')
          .toLowerCase();

        if (!textToSearch.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedTopic, selectedCrop, selectedProblem, showSavedOnly, savedIds]);

  // Audio Playback
  const handlePlayAudio = (article: KnowledgeEntry) => {
    const textToSpeak = isRw
      ? `${article.questionRw}. ${article.directAnswerRw}`
      : `${article.questionEn}. ${article.directAnswerEn}`;
    speakKinyarwandaText(textToSpeak, `library_${article.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-xs font-semibold text-emerald-200">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isRw ? 'Ububiko bw\'Ubumenyi bw\'Ubuhinzi' : 'Agricultural Knowledge Library'}</span>
            <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded-full">100% Offline Ready</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            {isRw
              ? 'Ubumenyi Bwizewe bw\'Ubuhinzi n\'Ubworozi mu Rwanda'
              : 'Verified Rwandan Agricultural & Extension Library'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
            {isRw
              ? 'Shakisha inama zizewe zemejwe na RAB, MINAGRI, na RICA zikora ku bijyanye n\'ibyatsi bibi, ubutaka, ifumbire, udukoko, umusaruro n\'imari y\'umurima — bibikwa muri telefone yawe n\'iyo nta nterineti ihari.'
              : 'Explore field-tested guidance certified by RAB, MINAGRI, and RICA covering weed management, soil health, crop nutrition, pest control, post-harvest safety, and farm finances — accessible offline on your device anytime.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-emerald-300">
            <span>{AGRI_KNOWLEDGE_BASE.length} {isRw ? 'Amasomo Yemejwe' : 'Verified Guides'}</span>
            <span>&middot;</span>
            <span>{savedIds.length} {isRw ? 'Amasomo Wabitse' : 'Saved for Offline Reading'}</span>
            <span>&middot;</span>
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className="underline font-bold text-white hover:text-emerald-200 cursor-pointer"
            >
              {showSavedOnly ? (isRw ? 'Erekana Byose' : 'Show All') : (isRw ? 'Reba Ibyo Nabitse Gusa' : 'View Saved Only')}
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
        {/* Search input + Language Switcher */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isRw
                  ? 'Shakisha inama: urugero "ibyatsi bibi", "umuhondo", "ifumbire", "pics", "nyagatare"...'
                  : 'Search guides: e.g. "weed control", "yellow leaves", "compost", "aflatoxin", "profit"...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Language toggle */}
            <div className="flex rounded-lg border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('rw')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  language === 'rw'
                    ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Kinyarwanda
              </button>
            </div>

            {/* Saved Toggle */}
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                showSavedOnly
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-stone-50 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isRw ? 'Ibyabitswe' : 'Saved'}</span>
              <span className="text-[10px] bg-stone-200 dark:bg-stone-700 px-1 rounded-full">
                {savedIds.length}
              </span>
            </button>
          </div>
        </div>

        {/* Dropdowns Row: Crops & Problems */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-stone-100 dark:border-stone-800">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
              {isRw ? 'Hitamo Igihingwa:' : 'Filter by Crop:'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {CROP_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {isRw ? c.labelRw : c.labelEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
              {isRw ? 'Hitamo Ikibazo cyangwa Ingingo:' : 'Filter by Challenge:'}
            </label>
            <select
              value={selectedProblem}
              onChange={(e) => setSelectedProblem(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-700"
            >
              {PROBLEM_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {isRw ? p.labelRw : p.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Horizontal Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {TOPIC_OPTIONS.map((topic) => {
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {isRw ? topic.labelRw : topic.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Count & Reset */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-1">
        <span>
          {isRw
            ? `Habonetse inama ${filteredArticles.length} zanditse`
            : `Showing ${filteredArticles.length} agricultural guides`}
        </span>
        {(searchQuery || selectedTopic !== 'all' || selectedCrop !== 'all' || selectedProblem !== 'all' || showSavedOnly) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTopic('all');
              setSelectedCrop('all');
              setSelectedProblem('all');
              setShowSavedOnly(false);
            }}
            className="text-emerald-800 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            {isRw ? 'Gusiba ibyo wahisemo byose' : 'Reset all filters'}
          </button>
        )}
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 dark:text-stone-600 mx-auto" />
          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            {isRw ? 'Nta nyandiko ibonetse' : 'No guides match your criteria'}
          </h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {isRw
              ? 'Gerageza gukuraho ibyo wahisemo cyangwa ushakishe mu yandi magambo yoroshye.'
              : 'Try relaxing your search terms or filters to browse all verified offline agricultural packages.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => {
            const isSaved = savedIds.includes(article.id);
            const questionTitle = isRw ? article.questionRw : article.questionEn;
            const directSummary = isRw ? article.directAnswerRw : article.directAnswerEn;
            const sourceOrg = article.sourceOrganization || 'RAB';

            return (
              <div
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 hover:border-emerald-600 dark:hover:border-emerald-500 hover:shadow-sm transition-all flex flex-col justify-between cursor-pointer relative"
              >
                <div className="space-y-3">
                  {/* Top Category Badge + Save Bookmark */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80">
                      <Sprout className="w-3 h-3" />
                      <span>{article.category}</span>
                    </span>

                    <button
                      onClick={(e) => toggleSaveArticle(article.id, e)}
                      title={isSaved ? 'Remove bookmark' : 'Save for offline'}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSaved
                          ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                          : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Title Question */}
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
                    {questionTitle}
                  </h3>

                  {/* Short excerpt */}
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                    {directSummary}
                  </p>
                </div>

                {/* Footer Info */}
                <div className="pt-4 mt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{sourceOrg} Verified</span>
                  </div>

                  <span className="flex items-center gap-1 text-emerald-800 dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                    <span>{isRw ? 'Fungura' : 'Read'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    {activeArticle.category}
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {activeArticle.sourceOrganization || 'RAB'} Verified ({activeArticle.lastReviewed})
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-50 leading-tight">
                  {isRw ? activeArticle.questionRw : activeArticle.questionEn}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Audio button */}
                <button
                  onClick={() => handlePlayAudio(activeArticle)}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                  title="Listen in authentic voice"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4 text-emerald-600" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
                </button>

                {/* Bookmark button */}
                <button
                  onClick={() => toggleSaveArticle(activeArticle.id)}
                  className="p-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 transition-colors"
                  title="Bookmark"
                >
                  {savedIds.includes(activeArticle.id) ? (
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {/* Close modal */}
                <button
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 7-Part Practical Content Display */}
            <div className="space-y-5 text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed">
              {/* 1. Direct Answer */}
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 text-xs uppercase mb-1">
                  1. {isRw ? 'Igisubizo Nyacyo' : 'Direct Answer'}
                </h4>
                <p>{isRw ? activeArticle.directAnswerRw : activeArticle.directAnswerEn}</p>
              </div>

              {/* 2. Causes / What may be happening */}
              {(activeArticle.causesEn || activeArticle.causesRw) && (
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase">
                    2. {isRw ? 'Ibishobora Kubitera' : 'What may be happening'}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300">
                    {isRw ? activeArticle.causesRw : activeArticle.causesEn}
                  </p>
                </div>
              )}

              {/* 3. Missing info / diagnostic questions */}
              {(activeArticle.missingInfoQuestionsEn || activeArticle.missingInfoQuestionsRw) && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/60">
                  <h4 className="font-bold text-amber-900 dark:text-amber-300 text-xs uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>3. {isRw ? 'Ibibazo byo Gusuzuma mbere yo Kwemeza' : 'Diagnostic Follow-up Questions'}</span>
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-amber-950 dark:text-amber-200">
                    {(isRw ? activeArticle.missingInfoQuestionsRw : activeArticle.missingInfoQuestionsEn)?.map(
                      (q, idx) => (
                        <li key={idx}>{q}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* 4. Practical Steps */}
              {activeArticle.actionStepsEn && activeArticle.actionStepsEn.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase">
                    4. {isRw ? 'Intambwe z\'Ingenzi Zo Gukora (Uburyo Buhendutse)' : 'Practical Steps (Actionable & Cost-Effective)'}
                  </h4>
                  <ol className="list-decimal pl-5 space-y-2">
                    {(isRw ? activeArticle.actionStepsRw : activeArticle.actionStepsEn).map((act, idx) => (
                      <li key={idx} className="pl-1 text-stone-800 dark:text-stone-200">
                        {act}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* 5. What to Avoid */}
              {(activeArticle.whatToAvoidEn || activeArticle.precautionsEn) && (
                <div className="p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200/70 dark:border-red-900/60 space-y-1">
                  <h4 className="font-bold text-red-900 dark:text-red-300 text-xs uppercase">
                    5. {isRw ? 'Ibyo Umuhinzi Agomba Kwirinda' : 'What to Avoid & Risks'}
                  </h4>
                  <p className="text-red-950 dark:text-red-200 text-xs">
                    {isRw
                      ? activeArticle.whatToAvoidRw || activeArticle.precautionsRw
                      : activeArticle.whatToAvoidEn || activeArticle.precautionsEn}
                  </p>
                </div>
              )}

              {/* 6. When to Contact Expert */}
              {(activeArticle.expertConsultationEn || activeArticle.expertConsultationRw) && (
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs uppercase">
                    6. {isRw ? 'Igihe cyo Kugana Umuhanga mu Buhinzi' : 'When to Contact an Agricultural Expert'}
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300">
                    {isRw ? activeArticle.expertConsultationRw : activeArticle.expertConsultationEn}
                  </p>
                </div>
              )}

              {/* 7. Relevant AgriBridge Feature Action */}
              {activeArticle.platformAction && (
                <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-500">
                      7. {isRw ? 'Agashami ka AgriBridge Kajyanye N\'Iki' : 'Relevant AgriBridge Feature'}
                    </span>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      {isRw ? activeArticle.platformAction.labelRw : activeArticle.platformAction.labelEn}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onNavigateTab && activeArticle.platformAction) {
                        onNavigateTab(activeArticle.platformAction.tab);
                        setActiveArticle(null);
                      }
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>{isRw ? 'Fungura aka Gashami' : 'Open Feature'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Verified Source Citation Strip */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-400 space-y-1">
                <p>
                  <strong className="text-stone-600 dark:text-stone-300">Source:</strong>{' '}
                  {activeArticle.sourceOrganization || 'RAB'} — {activeArticle.sourceTitle || activeArticle.source}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span>Reviewed: {activeArticle.lastReviewed}</span>
                  <span>&middot;</span>
                  <span>Status: {activeArticle.reviewStatus || 'verified'}</span>
                  <span>&middot;</span>
                  <span>Confidence: {activeArticle.confidenceLevel || 'high'}</span>
                  <span>&middot;</span>
                  <span>Region: {activeArticle.locationContext || 'Rwanda'}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Ask AI About This */}
            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (onAskAiAboutEntry) {
                    onAskAiAboutEntry(activeArticle);
                    setActiveArticle(null);
                  }
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold hover:bg-emerald-900 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{isRw ? 'Baza AgriBridge AI ku Bijyanye N\'Ibi' : 'Ask AgriBridge AI About This Topic'}</span>
              </button>

              <button
                onClick={() => setActiveArticle(null)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
              >
                {isRw ? 'Funga' : 'Close Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
