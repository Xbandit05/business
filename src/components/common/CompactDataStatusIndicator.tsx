import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  Database,
  Info,
  CheckCircle2,
  HardDrive,
  RotateCcw,
  Trash2,
  X,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const CompactDataStatusIndicator: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    dataFilter,
    setDataFilter,
    clearUserRecords,
    resetDemoData,
    farms,
    plots,
    listings,
    cropCycles,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);

  const userFarmsCount = farms.filter((f) => !f.isDemo).length;
  const userPlotsCount = plots.filter((p) => !p.isDemo).length;
  const userListingsCount = listings.filter((l) => !l.isDemo).length;
  const userCyclesCount = cropCycles.filter((c) => !c.isDemo).length;
  const totalUserRecords = userFarmsCount + userPlotsCount + userListingsCount + userCyclesCount;

  const demoRecordsCount =
    farms.filter((f) => f.isDemo).length +
    plots.filter((p) => p.isDemo).length +
    listings.filter((l) => l.isDemo).length;

  return (
    <>
      {/* Compact trigger button for Top Header */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 transition-colors text-xs font-medium cursor-pointer shadow-2xs"
        title="View database & storage status"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <Database className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
        <span className="hidden sm:inline font-mono text-[11px]">
          {dataFilter === 'user_only'
            ? 'My Records'
            : dataFilter === 'demo_only'
            ? 'Demo Data'
            : 'All Data'}
        </span>
        <span className="text-[10px] bg-stone-200 dark:bg-stone-700 px-1 rounded-sm text-stone-600 dark:text-stone-300 font-mono">
          {totalUserRecords > 0 ? `${totalUserRecords} Real` : 'Demo'}
        </span>
        <ChevronDown className="w-3 h-3 text-stone-400" />
      </button>

      {/* Expandable Details Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-5 space-y-4 text-stone-900 dark:text-stone-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">Data &amp; Storage Transparency</h3>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    Offline-First Local Repository
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Storage Architecture Explanation */}
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold text-stone-800 dark:text-stone-200">
                <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Device Storage Status: Synchronized Locally</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                Records are stored safely inside your device&apos;s browser repository (IndexedDB &amp; localStorage). 
                The platform operates 100% offline without requiring internet. When online, records can sync with verified regional agricultural services.
              </p>
            </div>

            {/* Record Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-700 dark:text-stone-300 text-[11px] uppercase tracking-wider">
                Current Records Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <div className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
                    Real User Records
                  </div>
                  <div className="text-xl font-bold text-emerald-950 dark:text-emerald-100 font-mono mt-0.5">
                    {totalUserRecords}
                  </div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-1">
                    {userFarmsCount} farms, {userPlotsCount} plots, {userListingsCount} listings
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                  <div className="text-[10px] text-stone-600 dark:text-stone-400 font-semibold uppercase">
                    Demonstration Records
                  </div>
                  <div className="text-xl font-bold text-stone-900 dark:text-stone-100 font-mono mt-0.5">
                    {demoRecordsCount}
                  </div>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                    Nyagatare smallholder sample data
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-bold text-stone-600 dark:text-stone-400">
                Display View Filter:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
                <button
                  onClick={() => setDataFilter('all')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    dataFilter === 'all'
                      ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  All Records
                </button>
                <button
                  onClick={() => setDataFilter('user_only')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                    dataFilter === 'user_only'
                      ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <span>My Only</span>
                  {totalUserRecords > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
                <button
                  onClick={() => setDataFilter('demo_only')}
                  className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    dataFilter === 'demo_only'
                      ? 'bg-white dark:bg-stone-900 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Demo Only
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={resetDemoData}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Reload default sample records"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
                {totalUserRecords > 0 && (
                  <button
                    onClick={clearUserRecords}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Remove user entered records"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Mine</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
