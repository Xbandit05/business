import React from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { DEMO_WEATHER } from '../../data/nyagatare.ts';
import {
  CloudRain,
  Sun,
  CloudSun,
  CloudLightning,
  Droplets,
  Thermometer,
  CalendarCheck,
  MapPin,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';

export const WeatherRemindersView: React.FC = () => {
  const { t, language } = useLanguage();

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="w-8 h-8 text-amber-500" />;
      case 'Partly Cloudy':
        return <CloudSun className="w-8 h-8 text-amber-500" />;
      case 'Light Rain':
      case 'Scattered Showers':
        return <CloudRain className="w-8 h-8 text-blue-500" />;
      case 'Heavy Thunderstorms':
        return <CloudLightning className="w-8 h-8 text-purple-600" />;
      default:
        return <CloudSun className="w-8 h-8 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          {t('weather.title')}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {t('weather.subtitle')}
        </p>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_WEATHER.map((day, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border shadow-2xs space-y-4 transition-colors ${
              idx === 0
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">
                  {day.dayName}
                </span>
                <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {day.date}
                </div>
              </div>
              {getWeatherIcon(day.condition)}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-stone-900 dark:text-stone-50">
                {day.tempHighC}°
              </span>
              <span className="text-sm font-mono text-stone-400">/ {day.tempLowC}°C</span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div className="flex items-center justify-between text-stone-600 dark:text-stone-400">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-500" />
                  <span>Rain Probability:</span>
                </span>
                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {day.rainChancePercent}%
                </span>
              </div>
              <div className="text-stone-500 font-medium">Condition: {day.condition}</div>
            </div>

            {/* Practical Field Advisory */}
            <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-xs text-stone-800 dark:text-stone-200 leading-relaxed space-y-1">
              <div className="flex items-center gap-1 font-bold text-[11px] text-emerald-800 dark:text-emerald-400">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Field Advisory</span>
              </div>
              <p>{language === 'rw' ? day.farmingAdvisoryRw : day.farmingAdvisoryEn}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal Reminders Checklist for Nyagatare Agro-Zone */}
      <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-emerald-700" />
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Season 2026A/B Agronomy Reminders Checklist (Nyagatare District)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>1. Urea Top-Dressing Window</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              For maize planted late August in Mimuri, apply 50kg/Ha Urea when plants are at knee height (5–6 leaves) before Saturday's predicted afternoon showers.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>2. Bean Anthracnose Surveillance</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              Check climbing beans in Rukomo marshland terracing for dark pod lesions caused by high humidity. Ensure drainage channels are cleared.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5">
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>3. Aggregation Storage Drying</span>
            </div>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              Monday will provide clear sunshine (above 30°C). Ideal for completing grain moisture reduction below 13.5% before bagging for wholesale collection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
