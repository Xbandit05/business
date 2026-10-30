import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useApp, DataFilterMode } from '../context/AppContext.tsx';
import { ShieldCheck, Database, Trash2, RotateCcw } from 'lucide-react';

export const DemoDisclaimerBanner: React.FC = () => {
  const { t } = useLanguage();
  const { dataFilter, setDataFilter, clearUserRecords, resetDemoData, farms, plots, listings } =
    useApp();

  const userRecordsCount =
    farms.filter((f) => !f.isDemo).length +
    plots.filter((p) => !p.isDemo).length +
    listings.filter((l) => !l.isDemo).length;

  return (
    <div className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 py-2.5 px-4 sm:px-6 lg:px-8 text-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Transparency status statement */}
        <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
          <Database className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="font-medium">
            {t('banner.demoNotice')}
          </span>
          <span className="hidden lg:inline text-stone-400 dark:text-stone-600">|</span>
          <span className="hidden lg:inline text-stone-500 dark:text-stone-400">
            Storage: Offline-First Local Repository (PostgreSQL Schema Compatible)
          </span>
        </div>

        {/* Filters and Management */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Segmented Filter */}
          <div className="inline-flex rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 p-0.5 shadow-2xs">
            <button
              onClick={() => setDataFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                dataFilter === 'all'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t('banner.filterAll')}
            </button>
            <button
              onClick={() => setDataFilter('user_only')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                dataFilter === 'user_only'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>{t('banner.filterUser')}</span>
              {userRecordsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-emerald-700 text-white rounded-full text-[10px]">
                  {userRecordsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setDataFilter('demo_only')}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                dataFilter === 'demo_only'
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              {t('banner.filterDemo')}
            </button>
          </div>

          {/* Reset / Clear Buttons */}
          <button
            onClick={resetDemoData}
            title={t('banner.resetDemo')}
            className="p-1.5 rounded text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {userRecordsCount > 0 && (
            <button
              onClick={clearUserRecords}
              title={t('banner.clearUser')}
              className="p-1.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
