import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { NYAGATARE_SECTORS } from '../../data/nyagatare.ts';
import { CropCycle, CropGrowthStage, CropType, NyagatareSector } from '../../types/index.ts';
import {
  Sprout,
  MapPin,
  Layers,
  ArrowRight,
  TrendingUp,
  Droplets,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Tag,
  Scale,
} from 'lucide-react';
import { FounderWatermark } from '../common/FounderWatermark.tsx';

interface FarmAndPlotManagerProps {
  onOpenNewListingWithCycle?: (cycle: CropCycle) => void;
  onOpenNewFarmModal: () => void;
  onOpenNewPlotModal: () => void;
}

export const FarmAndPlotManager: React.FC<FarmAndPlotManagerProps> = ({
  onOpenNewListingWithCycle,
  onOpenNewFarmModal,
  onOpenNewPlotModal,
}) => {
  const { t, language } = useLanguage();
  const { farms, plots, cropCycles, advanceCropStage, listings, offers } = useApp();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('all');

  // Compute Metrics
  const totalHa = plots.reduce((acc, p) => acc + (Number(p.areaHa) || 0), 0);
  const activeCyclesCount = cropCycles.filter((c) => c.stage !== 'harvested').length;
  const totalEstHarvestKg = cropCycles.reduce(
    (acc, c) => acc + (Number(c.actualHarvestKg || c.estimatedYieldKg) || 0),
    0
  );
  const activeListingsCount = listings.filter((l) => l.status === 'active').length;
  const pendingOffersCount = offers.filter((o) => o.status === 'submitted' || o.status === 'countered').length;

  // Filtered plots and cycles
  const filteredFarms = selectedFarmId === 'all' ? farms : farms.filter((f) => f.id === selectedFarmId);

  const getStageColor = (stage: CropGrowthStage) => {
    switch (stage) {
      case 'germination':
        return 'text-amber-800 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'vegetative':
        return 'text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      case 'flowering':
        return 'text-blue-800 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'maturing':
        return 'text-purple-800 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900';
      case 'harvested':
        return 'text-stone-800 bg-stone-100 dark:bg-stone-800 dark:text-stone-300 border-stone-300 dark:border-stone-700';
    }
  };

  const getStagePercentage = (stage: CropGrowthStage) => {
    switch (stage) {
      case 'germination':
        return 20;
      case 'vegetative':
        return 45;
      case 'flowering':
        return 70;
      case 'maturing':
        return 90;
      case 'harvested':
        return 100;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header and Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t('farmer.title')}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t('farmer.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenNewFarmModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-emerald-700" />
            <span>{t('farmer.registerFarm')}</span>
          </button>
          <button
            onClick={onOpenNewPlotModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t('farmer.addPlot')}</span>
          </button>
        </div>
      </div>

      {/* Homepage Botanical Overview & Watermark Accent */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 dark:from-stone-900 dark:via-emerald-950/70 dark:to-stone-900 p-6 sm:p-7 text-white shadow-sm border border-emerald-700/40 dark:border-emerald-800/40">
        <FounderWatermark variant="section-banner" className="opacity-15 dark:opacity-25" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-200">
            <Sprout className="w-4 h-4 text-emerald-300" />
            <span>AgriBridge Rwanda &middot; Growing Together. Connecting Markets.</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Transforming Smallholder Agriculture Across Rwanda
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Record plots, monitor seasonal harvest stages, and connect with verified buyers across all Rwandan districts with transparent pricing and real-time digital tracking.
          </p>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">{t('farmer.statAcreage')}</span>
            <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {totalHa.toFixed(1)} <span className="text-sm font-normal text-stone-500">Ha</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Across {plots.length} recorded plots</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">{t('farmer.statCycles')}</span>
            <Sprout className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {activeCyclesCount}
          </div>
          <div className="text-11px text-stone-500 mt-1">Season 2026A & 2026B</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">{t('farmer.statYield')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {(totalEstHarvestKg / 1000).toFixed(1)} <span className="text-sm font-normal text-stone-500">Tons</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">{totalEstHarvestKg.toLocaleString()} kg total</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">{t('farmer.statListings')}</span>
            <Tag className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {activeListingsCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Live in Marketplace</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-2">
            <span className="text-xs font-medium">Inbound Offers</span>
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {pendingOffersCount}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Requires review</div>
        </div>
      </div>

      {/* Main Content Area: Registered Farms & Active Crops */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Registered Farms & Plots (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{t('farmer.myFarms')}</span>
              <span className="text-xs text-stone-500 font-normal">({farms.length})</span>
            </h2>
            {farms.length > 1 && (
              <select
                value={selectedFarmId}
                onChange={(e) => setSelectedFarmId(e.target.value)}
                className="text-xs font-medium bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-stone-700 dark:text-stone-300"
              >
                <option value="all">All Farms ({farms.length})</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-4">
            {filteredFarms.length === 0 ? (
              <div className="p-6 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                <MapPin className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">No farms registered yet</p>
                <p className="text-xs text-stone-500 mt-1">Register your first farm in Nyagatare to start tracking plots and crops.</p>
                <button
                  onClick={onOpenNewFarmModal}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  {t('farmer.registerFarm')}
                </button>
              </div>
            ) : (
              filteredFarms.map((farm) => {
                const farmPlots = plots.filter((p) => p.farmId === farm.id);
                return (
                  <div
                    key={farm.id}
                    className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            {farm.name}
                          </h3>
                          {farm.isDemo ? (
                            <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                              DEMO
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              MINE
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {farm.district ? `${farm.district} · ${farm.sector}` : `${farm.sector} Sector`}
                          </span>
                          <span>·</span>
                          <span>{farm.cell}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold font-mono tabular-nums text-stone-900 dark:text-stone-100">
                          {farm.totalAreaHa} Ha
                        </span>
                        <span className="block text-[11px] text-stone-500">Total Area</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 dark:text-stone-400 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Soil Type</span>
                        <span className="font-medium text-stone-700 dark:text-stone-300">{farm.soilType}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px] uppercase font-semibold">Water Access</span>
                        <span className="font-medium text-stone-700 dark:text-stone-300 truncate block" title={farm.waterSource}>
                          {farm.waterSource}
                        </span>
                      </div>
                    </div>

                    {/* Plots inside this Farm */}
                    <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center justify-between text-xs font-semibold text-stone-700 dark:text-stone-300">
                        <span>Associated Plots ({farmPlots.length})</span>
                      </div>
                      {farmPlots.length === 0 ? (
                        <p className="text-xs text-stone-400 italic">No sub-plots created yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {farmPlots.map((plot) => {
                            const plotCycle = cropCycles.find((c) => c.plotId === plot.id);
                            return (
                              <div
                                key={plot.id}
                                className="flex items-center justify-between p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs"
                              >
                                <div>
                                  <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                                    {plot.identifier}
                                  </span>
                                  <span className="text-stone-500 dark:text-stone-400 text-[11px]">
                                    {plot.areaHa} Ha · Status: <span className="capitalize">{plot.currentStatus}</span>
                                  </span>
                                </div>
                                {plotCycle ? (
                                  <span className="font-medium text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                    {plotCycle.cropName}
                                  </span>
                                ) : (
                                  <span className="text-stone-400 italic">No active crop</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Crop Cycles (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>{t('farmer.activeCrops')}</span>
              <span className="text-xs text-stone-500 font-normal">({cropCycles.length})</span>
            </h2>
          </div>

          <div className="space-y-4">
            {cropCycles.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                <Sprout className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">No crop cycles recorded</p>
                <p className="text-xs text-stone-500 mt-1">Log planting dates, expected yields, and track developmental milestones.</p>
              </div>
            ) : (
              cropCycles.map((cycle) => {
                const targetPlot = plots.find((p) => p.id === cycle.plotId);
                const targetFarm = farms.find((f) => f.id === cycle.farmId);
                const isHarvested = cycle.stage === 'harvested';
                const hasExistingListing = listings.some((l) => l.cropCycleId === cycle.id);

                return (
                  <div
                    key={cycle.id}
                    className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                            {cycle.cropName}
                          </h3>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            {cycle.variety}
                          </span>
                          {cycle.isDemo ? (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                              DEMO
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                              MY CROP
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                          <span>{targetFarm?.name || 'Nyagatare Farm'}</span>
                          <span>·</span>
                          <span>{targetPlot?.identifier || 'Plot'}</span>
                          <span>·</span>
                          <span>{targetFarm?.sector || 'Mimuri'} Sector</span>
                        </div>
                      </div>

                      {/* Yield Estimate & Harvest Status */}
                      <div className="sm:text-right">
                        <div className="text-sm font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                          {isHarvested
                            ? `${(cycle.actualHarvestKg || cycle.estimatedYieldKg).toLocaleString()} kg`
                            : `${cycle.estimatedYieldKg.toLocaleString()} kg est.`}
                        </div>
                        <span className="text-[11px] text-stone-500">
                          {isHarvested ? 'Harvested Volume' : 'Projected Yield'}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Stage Stepper */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span>Stage: </span>
                          <span className={`px-2 py-0.5 rounded border text-xs font-semibold capitalize ${getStageColor(cycle.stage)}`}>
                            {cycle.stage}
                          </span>
                        </span>
                        <span className="font-mono tabular-nums text-stone-500 text-xs">
                          {getStagePercentage(cycle.stage)}% Growth Complete
                        </span>
                      </div>

                      <div className="w-full bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-700 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${getStagePercentage(cycle.stage)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                        <span>Planted: {cycle.plantingDate}</span>
                        <span>Expected Harvest: {cycle.expectedHarvestDate}</span>
                      </div>
                    </div>

                    {cycle.notes && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded border border-stone-200 dark:border-stone-800 italic">
                        "{cycle.notes}"
                      </p>
                    )}

                    {/* Card Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                      <div>
                        {!isHarvested && (
                          <button
                            onClick={() => advanceCropStage(cycle.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-300 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>{t('farmer.advanceStage')}</span>
                          </button>
                        )}
                        {isHarvested && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-800 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Harvest Complete</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {hasExistingListing ? (
                          <span className="text-xs text-stone-500 font-medium px-2 py-1 rounded bg-stone-100 dark:bg-stone-800">
                            Already Listed on Market
                          </span>
                        ) : (
                          <button
                            onClick={() => onOpenNewListingWithCycle && onOpenNewListingWithCycle(cycle)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors"
                          >
                            <Tag className="w-3.5 h-3.5" />
                            <span>{t('farmer.actionListProduce')}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
