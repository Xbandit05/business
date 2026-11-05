import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { ActiveTabType } from '../Navbar.tsx';
import { CropGrowthStage, CropCycle } from '../../types/index.ts';
import {
  Sprout,
  ShoppingBag,
  Sparkles,
  BookOpen,
  ArrowRight,
  Layers,
  TrendingUp,
  Tag,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  MapPin,
  FileText,
  Handshake,
  Users,
  Shield,
  Wallet,
  Activity,
  X,
  ChevronRight,
  Droplets,
  Eye,
  Store,
} from 'lucide-react';
import { FounderWatermark } from '../common/FounderWatermark.tsx';

interface AgriBridgeDashboardViewProps {
  onNavigateTab: (tab: ActiveTabType) => void;
  onOpenNewListingModal: () => void;
  onOpenNewPlotModal: () => void;
  onOpenNewFarmModal?: () => void;
  onOpenAboutFounders?: () => void;
}

interface FarmActivityItem {
  id: string;
  titleEn: string;
  titleRw: string;
  type: 'planting' | 'weeding' | 'monitoring' | 'fertilizer' | 'irrigation' | 'harvesting';
  date: string;
  cropName: string;
  plotIdentifier: string;
  isCompleted?: boolean;
}

export const AgriBridgeDashboardView: React.FC<AgriBridgeDashboardViewProps> = ({
  onNavigateTab,
  onOpenNewListingModal,
  onOpenNewPlotModal,
  onOpenNewFarmModal,
  onOpenAboutFounders,
}) => {
  const { language, t } = useLanguage();
  const {
    role,
    currentUser,
    farms,
    plots,
    cropCycles,
    listings,
    offers,
    orders,
    suppliers,
    inquiries,
  } = useApp();

  const isRw = language === 'rw';

  // Compute Real Metrics
  const totalHa = plots.reduce((acc, p) => acc + (Number(p.areaHa) || 0), 0);
  const activeCycles = cropCycles.filter((c) => c.stage !== 'harvested');
  const activeCyclesCount = activeCycles.length;
  const totalEstHarvestKg = cropCycles.reduce(
    (acc, c) => acc + (Number(c.actualHarvestKg || c.estimatedYieldKg) || 0),
    0
  );
  const activeListingsCount = listings.filter((l) => l.status === 'active').length;
  const pendingOffersCount = offers.filter(
    (o) => o.status === 'submitted' || o.status === 'countered'
  ).length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length;

  // Custom User Activities stored in localStorage
  const [customActivities, setCustomActivities] = useState<FarmActivityItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('agribridge_farm_activities');
        if (stored) return JSON.parse(stored);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState('');
  const [newActivityType, setNewActivityType] = useState<FarmActivityItem['type']>('weeding');
  const [newActivityDate, setNewActivityDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [newActivityPlot, setNewActivityPlot] = useState(() => plots[0]?.identifier || 'Main Plot');
  const [newActivityCrop, setNewActivityCrop] = useState(() => cropCycles[0]?.cropName || 'Maize');

  // Derive Automatic Activities from Real Active Crop Cycles
  const derivedCycleActivities: FarmActivityItem[] = activeCycles.map((c) => {
    const plot = plots.find((p) => p.id === c.plotId);
    const plotName = plot ? plot.identifier : 'Registered Plot';

    if (c.stage === 'germination' || c.stage === 'vegetative') {
      return {
        id: 'derived_' + c.id + '_weeding',
        titleEn: `Weeding & Soil Aeration (${c.cropName})`,
        titleRw: `Kubagara no koroshya ubutaka (${c.cropName})`,
        type: 'weeding',
        date: 'In 3-5 days',
        cropName: c.cropName,
        plotIdentifier: plotName,
      };
    } else if (c.stage === 'flowering') {
      return {
        id: 'derived_' + c.id + '_monitoring',
        titleEn: `Pest Inspection & Moisture Control (${c.cropName})`,
        titleRw: `Kugenzura udukoko n'ubuhehere (${c.cropName})`,
        type: 'monitoring',
        date: 'Scheduled this week',
        cropName: c.cropName,
        plotIdentifier: plotName,
      };
    } else {
      return {
        id: 'derived_' + c.id + '_harvest',
        titleEn: `Prepare Drying Tarpaulin & Bags (${c.cropName})`,
        titleRw: `Gutunganya shitingi n'imifuka yo gusarura (${c.cropName})`,
        type: 'harvesting',
        date: c.expectedHarvestDate || 'Upcoming',
        cropName: c.cropName,
        plotIdentifier: plotName,
      };
    }
  });

  const allActivities = [...customActivities, ...derivedCycleActivities];

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityTitle.trim()) return;

    const item: FarmActivityItem = {
      id: 'act_' + Date.now(),
      titleEn: newActivityTitle.trim(),
      titleRw: newActivityTitle.trim(),
      type: newActivityType,
      date: newActivityDate,
      cropName: newActivityCrop,
      plotIdentifier: newActivityPlot,
      isCompleted: false,
    };

    const updated = [item, ...customActivities];
    setCustomActivities(updated);
    localStorage.setItem('agribridge_farm_activities', JSON.stringify(updated));
    setNewActivityTitle('');
    setIsNewActivityModalOpen(false);
  };

  const handleToggleActivity = (id: string) => {
    const updated = customActivities.map((act) =>
      act.id === id ? { ...act, isCompleted: !act.isCompleted } : act
    );
    setCustomActivities(updated);
    localStorage.setItem('agribridge_farm_activities', JSON.stringify(updated));
  };

  const handleDeleteActivity = (id: string) => {
    const updated = customActivities.filter((act) => act.id !== id);
    setCustomActivities(updated);
    localStorage.setItem('agribridge_farm_activities', JSON.stringify(updated));
  };

  // Helper for activity icon and badge styling
  const getActivityBadge = (type: FarmActivityItem['type']) => {
    switch (type) {
      case 'planting':
        return { label: 'Planting', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' };
      case 'weeding':
        return { label: 'Weeding', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' };
      case 'monitoring':
        return { label: 'Monitoring', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' };
      case 'fertilizer':
        return { label: 'Fertilizer', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' };
      case 'irrigation':
        return { label: 'Irrigation', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300' };
      case 'harvesting':
        return { label: 'Harvesting', color: 'bg-teal-100 text-teal-800 dark:text-teal-300 dark:bg-teal-950' };
    }
  };

  // Get user display name (never hardcoded)
  const userDisplayName = currentUser?.fullName?.trim() || (isRw ? 'Umuhinzi' : 'Farmer');

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. COMPACT WELCOME SECTION (Section 2) */}
      <section className="relative overflow-hidden rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-5 sm:p-6 shadow-xs">
        <FounderWatermark variant="section-banner" className="opacity-10 dark:opacity-15" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 capitalize">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {currentUser?.sector || 'Mimuri'}, {currentUser?.district || 'Nyagatare'}
                </span>
              </span>
              <span className="text-[11px] text-stone-400 capitalize">
                &middot; {role === 'farmer' ? (isRw ? 'Umuhinzi' : 'Smallholder Farmer') : role}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50 break-words">
              {isRw ? `Murakaza neza, ${userDisplayName}` : `Welcome back, ${userDisplayName}`}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              {isRw ? 'Ni iki mwifuza gukora uyu munsi?' : 'What would you like to do today?'}
            </p>
          </div>

          {/* Quick Header Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewListingModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRw ? 'Gurishe Umusaruro' : 'Sell Produce'}</span>
            </button>
            <button
              onClick={() => onNavigateTab('ai')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Agricultural AI assistant"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">{isRw ? 'AgriBridge AI' : 'Ask AI'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. FOUR PRIMARY ACTION CARDS (Section 3) */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* Card 1: My Farms */}
          <button
            onClick={() => onNavigateTab('farmer')}
            className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/70 dark:hover:border-emerald-600/70 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center transition-transform group-hover:scale-105">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                  {isRw ? 'Imirima Yanjye' : 'My Farms'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {isRw
                    ? 'Genzura imirima yawe, imyaka ihinze n\'amateka y\'umusaruro.'
                    : 'Manage your plots, crops, and harvest records.'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-400">
              <span>{isRw ? 'Fungura Imirima' : 'Open Farms & Plots'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 2: Sell Produce */}
          <button
            onClick={onOpenNewListingModal}
            className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500/70 dark:hover:border-teal-600/70 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 flex items-center justify-center transition-transform group-hover:scale-105">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-teal-800 dark:group-hover:text-teal-400 transition-colors">
                  {isRw ? 'Gurishe Umusaruro' : 'Sell Produce'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {isRw
                    ? 'Shyira umusaruro ku isoko uhure n\'abaguzi banyuranye.'
                    : 'List your produce and reach potential buyers.'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-teal-800 dark:text-teal-400">
              <span>{isRw ? 'Shyira ku Isoko' : 'Start Listing Produce'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 3: Ask AgriBridge AI */}
          <button
            onClick={() => onNavigateTab('ai')}
            className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/70 dark:hover:border-emerald-600/70 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                    {isRw ? 'Baza AgriBridge AI' : 'Ask AgriBridge AI'}
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                    Offline
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {isRw
                    ? 'Bona inama z\'ubuhinzi n\'ibisubizo niyo waba udafite murandasi.'
                    : 'Get agricultural guidance, even when offline.'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-400">
              <span>{isRw ? 'Baza Ikibazo' : 'Open AI Companion'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>

          {/* Card 4: Learn Farming */}
          <button
            onClick={() => onNavigateTab('training')}
            className="group p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/70 dark:hover:border-amber-600/70 hover:shadow-md transition-all text-left flex flex-col justify-between cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center transition-transform group-hover:scale-105">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                  {isRw ? 'Iga Ubuhinzi' : 'Learn Farming'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                  {isRw
                    ? 'Soma ubumenyi bw\'ubuhinzi n\'amasomo yo mu majwi akoresha Kinyarwanda.'
                    : 'Explore practical agricultural knowledge and training.'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-400">
              <span>{isRw ? 'Fungura Amasomo' : 'Explore Lessons & Library'}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </button>
        </div>
      </section>

      {/* 3. COMPACT FARM OVERVIEW METRICS (Section 4) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              {isRw ? 'Incamake y\'Umurima n\'Isoko' : 'Farm & Market Overview'}
            </h2>
          </div>
          <span className="text-[11px] text-stone-400">
            {isRw ? 'Kanda kuri buri makuru ubone byinshi' : 'Click any metric for details'}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Metric 1: Cultivated Land */}
          <button
            onClick={() => onNavigateTab('farmer')}
            className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 hover:shadow-2xs transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="text-xs font-medium">{t('farmer.statAcreage')}</span>
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-white tabular-nums">
              {totalHa.toFixed(1)} <span className="text-xs font-normal text-stone-500">Ha</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 truncate">
              {plots.length} {isRw ? 'ibirindiro (plots)' : 'recorded plots'}
            </div>
          </button>

          {/* Metric 2: Active Crop Cycles */}
          <button
            onClick={() => onNavigateTab('farmer')}
            className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 hover:shadow-2xs transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="text-xs font-medium">{t('farmer.statCycles')}</span>
              <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-white tabular-nums">
              {activeCyclesCount}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 truncate">
              {isRw ? 'Ibihembwe biri mu murima' : 'Season 2026A & 2026B'}
            </div>
          </button>

          {/* Metric 3: Expected Harvest */}
          <button
            onClick={() => onNavigateTab('farmer')}
            className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 hover:shadow-2xs transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="text-xs font-medium">{t('farmer.statYield')}</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-white tabular-nums">
              {(totalEstHarvestKg / 1000).toFixed(1)}{' '}
              <span className="text-xs font-normal text-stone-500">Tons</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 truncate">
              {totalEstHarvestKg.toLocaleString()} kg {isRw ? 'byose hamwe' : 'total'}
            </div>
          </button>

          {/* Metric 4: Active Listings */}
          <button
            onClick={() => onNavigateTab('marketplace')}
            className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-teal-500/50 hover:shadow-2xs transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="text-xs font-medium">{t('farmer.statListings')}</span>
              <Tag className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-white tabular-nums">
              {activeListingsCount}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 truncate">
              {isRw ? 'Biri ku Isoko ubu' : 'Live in Marketplace'}
            </div>
          </button>

          {/* Metric 5: Incoming Offers */}
          <button
            onClick={() => onNavigateTab('offers')}
            className="p-3.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-amber-500/50 hover:shadow-2xs transition-all text-left group cursor-pointer col-span-2 md:col-span-1"
          >
            <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-1.5">
              <span className="text-xs font-medium">
                {isRw ? 'Ibiciro Byatanzwe' : 'Buyer Offers'}
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-white tabular-nums">
              {pendingOffersCount}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 truncate">
              {pendingOffersCount > 0
                ? isRw
                  ? 'Bitegereje gusubizwa'
                  : 'Pending response'
                : isRw
                ? 'Nta bitegereje'
                : 'No pending'}
            </div>
          </button>
        </div>
      </section>

      {/* 4. UPCOMING FARM ACTIVITIES (Section 5) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h2 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              {isRw ? 'Ibikorwa by\'Umurima Byegereje' : 'Upcoming Farm Activities'}
            </h2>
          </div>

          <button
            onClick={() => setIsNewActivityModalOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRw ? '+ Ongeraho Igikorwa' : '+ Add Activity'}</span>
          </button>
        </div>

        {allActivities.length === 0 ? (
          /* Empty State as explicitly specified */
          <div className="p-8 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {isRw ? 'Nta bikorwa byegereje birandikwa.' : 'No upcoming activities yet.'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {isRw
                  ? 'Kora igikorwa cyo guhinga, kubagara, gusarura, cyangwa kwita ku myaka yawe.'
                  : 'Schedule farm tasks such as weeding, top-dressing fertilizer, pest monitoring, or harvesting.'}
              </p>
            </div>
            <button
              onClick={() => setIsNewActivityModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isRw ? 'Ongeraho Igikorwa gishya' : 'Schedule Farm Activity'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allActivities.slice(0, 6).map((activity) => {
              const badge = getActivityBadge(activity.type);
              return (
                <div
                  key={activity.id}
                  className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                    activity.isCompleted
                      ? 'bg-stone-50 dark:bg-stone-800/40 border-stone-200 dark:border-stone-800 opacity-60'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-2xs hover:border-emerald-500/40'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {activity.date}
                      </span>
                    </div>

                    <h4 className={`text-xs font-bold text-stone-900 dark:text-stone-100 truncate ${activity.isCompleted ? 'line-through text-stone-400' : ''}`}>
                      {isRw ? activity.titleRw : activity.titleEn}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-stone-500">
                      <span>{activity.cropName}</span>
                      <span>&middot;</span>
                      <span className="truncate">{activity.plotIdentifier}</span>
                    </div>
                  </div>

                  {/* Complete checkmark for custom activities */}
                  {activity.id.startsWith('act_') ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleActivity(activity.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          activity.isCompleted
                            ? 'bg-emerald-800 text-white border-emerald-800'
                            : 'border-stone-300 dark:border-stone-700 text-stone-400 hover:text-emerald-700'
                        }`}
                        title={activity.isCompleted ? 'Mark incomplete' : 'Mark done'}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteActivity(activity.id)}
                        className="p-1 rounded-lg text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete task"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onNavigateTab('farmer')}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors shrink-0"
                      title="View cycle in Farms & Plots"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. ROLE-SPECIFIC SUPPLEMENTARY CONTENT (Section 8) */}
      {role === 'buyer' && (
        <section className="p-5 rounded-2xl bg-teal-50/50 dark:bg-stone-900 border border-teal-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-teal-700 dark:text-teal-400" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Buyer Workspace &middot; Fast Procurement
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="text-xs font-bold text-teal-800 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Browse All Listings ({listings.length}) &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-teal-100 dark:border-stone-700 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Active Orders</div>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                {activeOrdersCount} in progress
              </div>
              <p className="text-[11px] text-stone-500">Track delivery logistics and receipts</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-teal-100 dark:border-stone-700 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Submitted Bids</div>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                {offers.length} offers
              </div>
              <p className="text-[11px] text-stone-500">Awaiting farmer acceptance or counter</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-teal-100 dark:border-stone-700 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Verified Suppliers</div>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                {suppliers.length} active
              </div>
              <p className="text-[11px] text-stone-500">Certified seed and grain aggregators</p>
            </div>
          </div>
        </section>
      )}

      {role === 'agent' && (
        <section className="p-5 rounded-2xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200 dark:border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Community Agent Desk &middot; Sector Operations
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('agent')}
              className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline cursor-pointer"
            >
              Open Full Agent Desk &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-amber-100 dark:border-stone-700 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Supported Smallholders</div>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                28 Farmers
              </div>
              <p className="text-[11px] text-stone-500">Mimuri &amp; Rukomo Sector registry</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-amber-100 dark:border-stone-700 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Assisted Listings</div>
              <div className="text-xl font-bold font-mono text-stone-900 dark:text-white">
                {listings.filter((l) => l.isDemo).length} Live
              </div>
              <p className="text-[11px] text-stone-500">Published on behalf of non-smartphone growers</p>
            </div>

            <div className="p-3.5 bg-white dark:bg-stone-800 rounded-xl border border-amber-100 dark:border-stone-700 space-y-1">
              <div className="text-[10px] text-stone-400 uppercase font-bold">Offline Storage</div>
              <div className="text-xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                Synchronized
              </div>
              <p className="text-[11px] text-stone-500">All local device records up to date</p>
            </div>
          </div>
        </section>
      )}

      {/* Add Farm Activity Modal */}
      {isNewActivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {isRw ? 'Ongeraho Igikorwa cy\'Umurima' : 'Schedule Farm Activity'}
                </h3>
              </div>
              <button
                onClick={() => setIsNewActivityModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  {isRw ? 'Izina ry\'Igikorwa' : 'Activity Name / Task'}
                </label>
                <input
                  type="text"
                  required
                  value={newActivityTitle}
                  onChange={(e) => setNewActivityTitle(e.target.value)}
                  placeholder={
                    isRw
                      ? 'urugero: Kubagara ibishyimbo, Gushyiramo Urea, Gusarura...'
                      : 'e.g., Weeding climbing beans, Top-dressing Urea, Checking moisture...'
                  }
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-emerald-700 outline-none text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    {isRw ? 'Ubwoko bw\'Igikorwa' : 'Activity Type'}
                  </label>
                  <select
                    value={newActivityType}
                    onChange={(e) => setNewActivityType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    <option value="weeding">Weeding (Kubagara)</option>
                    <option value="fertilizer">Fertilizer (Ifumbire)</option>
                    <option value="monitoring">Crop Monitoring (Kugenzura)</option>
                    <option value="planting">Planting (Gutera)</option>
                    <option value="irrigation">Irrigation (Kuhira)</option>
                    <option value="harvesting">Harvesting (Gusarura)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    {isRw ? 'Itariki Iteganyijwe' : 'Target Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={newActivityDate}
                    onChange={(e) => setNewActivityDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    {isRw ? 'Umurima (Plot)' : 'Plot'}
                  </label>
                  <select
                    value={newActivityPlot}
                    onChange={(e) => setNewActivityPlot(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  >
                    {plots.length > 0 ? (
                      plots.map((p) => (
                        <option key={p.id} value={p.identifier}>
                          {p.identifier}
                        </option>
                      ))
                    ) : (
                      <option value="Main Plot">Main Plot</option>
                    )}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 dark:text-stone-300">
                    {isRw ? 'Igihingwa' : 'Crop'}
                  </label>
                  <input
                    type="text"
                    value={newActivityCrop}
                    onChange={(e) => setNewActivityCrop(e.target.value)}
                    placeholder="e.g. Maize, Beans, Rice"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewActivityModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-2xs cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
