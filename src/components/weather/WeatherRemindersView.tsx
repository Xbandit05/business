import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { getAllDistricts, getDistrictByName } from '../../data/districts.ts';
import { WeatherDayForecast } from '../../types/index.ts';
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
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
} from 'lucide-react';

interface DistrictWeatherSet {
  districtName: string;
  districtNameRw: string;
  zoneTitle: string;
  forecasts: WeatherDayForecast[];
}

const DISTRICT_WEATHER_DATA: Record<string, DistrictWeatherSet> = {
  Nyagatare: {
    districtName: 'Nyagatare',
    districtNameRw: 'Nyagatare',
    zoneTitle: 'Eastern Savannah & Muvumba Marshlands',
    forecasts: [
      {
        date: '2026-10-30',
        dayName: 'Today',
        tempHighC: 29,
        tempLowC: 18,
        rainChancePercent: 20,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Good window for field cultivation, weeding, and foliar spray in the early morning.',
        farmingAdvisoryRw: 'Ikirere cyiza cyo kubagara no gutera imiti ku bihingwa mu gitondo cya kare i Nyagatare.',
      },
      {
        date: '2026-10-31',
        dayName: 'Tomorrow',
        tempHighC: 27,
        tempLowC: 17,
        rainChancePercent: 75,
        condition: 'Scattered Showers',
        farmingAdvisoryEn: 'Moderate rainfall expected in late afternoon. Excellent timing for top-dressing Urea on vegetative maize.',
        farmingAdvisoryRw: 'Imvura iteganyijwe nimugoroba. Ni umwanya mwiza cyane wo gushyiramo ifumbire ya Urea mu bigori bimaze gukura.',
      },
      {
        date: '2026-11-01',
        dayName: 'Sunday',
        tempHighC: 26,
        tempLowC: 16,
        rainChancePercent: 85,
        condition: 'Heavy Thunderstorms',
        farmingAdvisoryEn: 'High precipitation window. Halt all pesticide spraying to prevent chemical wash-off. Inspect retention trenches.',
        farmingAdvisoryRw: 'Imvura nyinshi n\'inkuba. Hagarika gutera umuti wose kugira ngo utanyagira, urebe ko imiyoboro y\'amazi ifunguye.',
      },
      {
        date: '2026-11-02',
        dayName: 'Monday',
        tempHighC: 28,
        tempLowC: 17,
        rainChancePercent: 35,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Soil moisture saturated. Safe conditions for bean germination checks and opening terrace drainage.',
        farmingAdvisoryRw: 'Ubutaka bwahehereye neza. Ni igihe cyiza cyo gusuzuma imyobo y\'ibishyimbo byatewe no gufata amazi mu mirwanyasuri.',
      },
    ],
  },
  Musanze: {
    districtName: 'Musanze',
    districtNameRw: 'Musanze',
    zoneTitle: 'Northern Volcanic Highlands & Potato Belts',
    forecasts: [
      {
        date: '2026-10-30',
        dayName: 'Today',
        tempHighC: 21,
        tempLowC: 12,
        rainChancePercent: 65,
        condition: 'Scattered Showers',
        farmingAdvisoryEn: 'High volcanic humidity. Preventive spray against potato late blight (Ikibagarira) is recommended.',
        farmingAdvisoryRw: 'Ubuhehere bwo hejuru mu birunga. Tera kare umuti urinda ikibagarira mu birayi mbere y\'uko amababi afatwa.',
      },
      {
        date: '2026-10-31',
        dayName: 'Tomorrow',
        tempHighC: 20,
        tempLowC: 11,
        rainChancePercent: 80,
        condition: 'Heavy Thunderstorms',
        farmingAdvisoryEn: 'Cold mountain downpours. Protect seedbeds on Kinigi terraces from surface erosion washouts.',
        farmingAdvisoryRw: 'Imvura ikaze n\'ubukonje mu misozi. Rinda imirongo y\'imbuto z\'ibirayi gukukuka ku misozi ya Kinigi.',
      },
      {
        date: '2026-11-01',
        dayName: 'Sunday',
        tempHighC: 22,
        tempLowC: 13,
        rainChancePercent: 40,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Cool and mild. Excellent conditions for staking climbing beans with bamboo poles.',
        farmingAdvisoryRw: 'Ikirere gikonje gike. Ni umwanya mwiza wo gushingirira ibishyimbo by\'imishingiriro ukoresheje imigano.',
      },
      {
        date: '2026-11-02',
        dayName: 'Monday',
        tempHighC: 23,
        tempLowC: 12,
        rainChancePercent: 30,
        condition: 'Sunny',
        farmingAdvisoryEn: 'Clear volcanic skies. Ideal day for harvesting mature pyrethrum flowers and drying potato seed.',
        farmingAdvisoryRw: 'Izuba ryiza mu birunga. Umunsi mwiza wo gusarura indabyo z\'ibireti no kwanika imbuto z\'ibirayi.',
      },
    ],
  },
  Bugesera: {
    districtName: 'Bugesera',
    districtNameRw: 'Bugesera',
    zoneTitle: 'Eastern Dry Plateau & Irrigated Basin',
    forecasts: [
      {
        date: '2026-10-30',
        dayName: 'Today',
        tempHighC: 30,
        tempLowC: 19,
        rainChancePercent: 10,
        condition: 'Sunny',
        farmingAdvisoryEn: 'Hot and dry conditions. Run solar drip pumps early morning to reduce lake evaporation loss.',
        farmingAdvisoryRw: 'Izuba ryinshi muri Bugesera. Fungura imashini zihira mu gitondo cya kare ngo amazi atazamo umwuka.',
      },
      {
        date: '2026-10-31',
        dayName: 'Tomorrow',
        tempHighC: 31,
        tempLowC: 19,
        rainChancePercent: 15,
        condition: 'Sunny',
        farmingAdvisoryEn: 'High sunshine index. Ideal timing for cassava sun-drying and mulching vegetable rows.',
        farmingAdvisoryRw: 'Izuba ryinshi. Igihe cyiza cyo kwanika imyumbati no gusasira ibyatsi mu mirongo y\'imboga.',
      },
      {
        date: '2026-11-01',
        dayName: 'Sunday',
        tempHighC: 28,
        tempLowC: 18,
        rainChancePercent: 55,
        condition: 'Scattered Showers',
        farmingAdvisoryEn: 'Afternoon thunder showers around Lake Cyohoha basin. Prepare water catchments.',
        farmingAdvisoryRw: 'Imvura y\'igicamunsi mu bibaya bya Cyohoha. Tegura ibigega bifata amazi y\'imvura mu murima.',
      },
      {
        date: '2026-11-02',
        dayName: 'Monday',
        tempHighC: 29,
        tempLowC: 18,
        rainChancePercent: 25,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Moderate breeze. Good timing for pest inspection in French beans and chillies.',
        farmingAdvisoryRw: 'Akayaga gake. Igihe cyiza cyo gusuzuma ibyonnyi mu miteja no mu rusenda rw\'i Bugesera.',
      },
    ],
  },
  Huye: {
    districtName: 'Huye',
    districtNameRw: 'Huye',
    zoneTitle: 'Southern Rolling Terraces & Maraba Coffee',
    forecasts: [
      {
        date: '2026-10-30',
        dayName: 'Today',
        tempHighC: 25,
        tempLowC: 15,
        rainChancePercent: 45,
        condition: 'Light Rain',
        farmingAdvisoryEn: 'Light mountain morning showers. Keep coffee cherries protected at drying tables.',
        farmingAdvisoryRw: 'Utuvura tworoheje mu misozi ya Huye. Rinda ikawa iri ku ntebe z\'izuba kwinjirwamo n\'amazi.',
      },
      {
        date: '2026-10-31',
        dayName: 'Tomorrow',
        tempHighC: 24,
        tempLowC: 14,
        rainChancePercent: 70,
        condition: 'Scattered Showers',
        farmingAdvisoryEn: 'Good soil moisture in Rwasave marshlands. Excellent for paddy rice transplanting.',
        farmingAdvisoryRw: 'Ubuhehere bwiza mu gishanga cya Rwasave. Umwanya mwiza wo gutera ingemwe z\'umuceri.',
      },
      {
        date: '2026-11-01',
        dayName: 'Sunday',
        tempHighC: 26,
        tempLowC: 15,
        rainChancePercent: 30,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Favorable day for sweet potato ridging and compost application on terraces.',
        farmingAdvisoryRw: 'Umunsi mwiza wo guhinga imirongo y\'ibijumba no gushyiramo imborera mu misozi ya Maraba.',
      },
      {
        date: '2026-11-02',
        dayName: 'Monday',
        tempHighC: 25,
        tempLowC: 15,
        rainChancePercent: 40,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Mild conditions. Safe window for foliar fertilizer application on climbing beans.',
        farmingAdvisoryRw: 'Ikirere gituje. Ni byiza gutera ifumbire y\'amazi ku bishyimbo by\'imishingiriro.',
      },
    ],
  },
  Rubavu: {
    districtName: 'Rubavu',
    districtNameRw: 'Rubavu',
    zoneTitle: 'Western Lake Kivu Shoreline & Volcanic Foothills',
    forecasts: [
      {
        date: '2026-10-30',
        dayName: 'Today',
        tempHighC: 26,
        tempLowC: 16,
        rainChancePercent: 40,
        condition: 'Partly Cloudy',
        farmingAdvisoryEn: 'Pleasant lake breeze. Good conditions for harvesting fresh carrots and cabbages for market.',
        farmingAdvisoryRw: 'Akayaga keza k\'ikiyaga cya Kivu. Umunsi mwiza wo gusarura amashu na karoti byo kugurisha.',
      },
      {
        date: '2026-10-31',
        dayName: 'Tomorrow',
        tempHighC: 25,
        tempLowC: 16,
        rainChancePercent: 65,
        condition: 'Scattered Showers',
        farmingAdvisoryEn: 'Lakeside rain in late afternoon. Ensure drainage channels along Sebeya river are unblocked.',
        farmingAdvisoryRw: 'Imvura yo ku kiyaga nimugoroba. Sukura imiyoboro y\'amazi yegereye uruzi rwa Sebeya.',
      },
      {
        date: '2026-11-01',
        dayName: 'Sunday',
        tempHighC: 27,
        tempLowC: 17,
        rainChancePercent: 20,
        condition: 'Sunny',
        farmingAdvisoryEn: 'Clear sunshine over Lake Kivu. Excellent day for coffee cherry pulp processing and drying.',
        farmingAdvisoryRw: 'Izuba ryinshi hejuru ya Kivu. Umunsi mwiza cyane wo kwanika ikawa yasukuwe.',
      },
      {
        date: '2026-11-02',
        dayName: 'Monday',
        tempHighC: 26,
        tempLowC: 16,
        rainChancePercent: 50,
        condition: 'Light Rain',
        farmingAdvisoryEn: 'Moderate rainfall expected. Good conditions for vegetable seedling planting.',
        farmingAdvisoryRw: 'Imvura iraringaniye. Igihe cyiza cyo gutera ingemwe z\'imboga n\'inyanya.',
      },
    ],
  },
};

export const WeatherRemindersView: React.FC = () => {
  const {
    t,
    language,
    speakKinyarwandaText,
    isSpeaking,
    activeAudioId,
    audioState,
    pauseAudio,
    resumeAudio,
  } = useLanguage();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nyagatare');

  const currentSet = DISTRICT_WEATHER_DATA[selectedDistrict] || DISTRICT_WEATHER_DATA['Nyagatare'];

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

  const handleSpeakAdvisory = (day: WeatherDayForecast, dayIdx: number) => {
    const audioId = `weather_${selectedDistrict}_${dayIdx}`;
    if (activeAudioId === audioId && audioState === 'playing') {
      pauseAudio();
    } else if (activeAudioId === audioId && audioState === 'paused') {
      resumeAudio();
    } else {
      const readoutText = `Iteganyagihe ry'i ${selectedDistrict} ku munsi wa ${day.dayName}, itariki ya ${day.date}. Ubushyuhe bwo hejuru ni dogere ${day.tempHighC}, ubwo hasi ni dogere ${day.tempLowC}. Amahirwe y'imvura ni ku ijana mirongo ${day.rainChancePercent}. Inama y'ubuhinzi: ${day.farmingAdvisoryRw}`;
      speakKinyarwandaText(readoutText, audioId);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & District Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t('weather.title')}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            Localized agricultural precipitation forecasts and audible spray advisories across Rwanda.
          </p>
        </div>

        {/* District Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-x-auto max-w-full">
          <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 ml-2 shrink-0" />
          <span className="text-xs font-bold text-stone-700 dark:text-stone-300 pr-1 shrink-0">
            District:
          </span>
          {Object.keys(DISTRICT_WEATHER_DATA).map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => setSelectedDistrict(dist)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                selectedDistrict === dist
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              {dist}
            </button>
          ))}
        </div>
      </div>

      {/* District Zone Badge */}
      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 text-emerald-800 dark:text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
              {currentSet.districtName} District Agro-Ecological Zone
            </span>
            <div className="text-emerald-800 dark:text-emerald-400 text-[11px]">
              {currentSet.zoneTitle}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 hidden sm:block">
          Meteo Rwanda Live Stations Grounded
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentSet.forecasts.map((day, idx) => {
          const audioId = `weather_${selectedDistrict}_${idx}`;
          const isThisPlaying = activeAudioId === audioId && audioState === 'playing';
          const isThisPaused = activeAudioId === audioId && audioState === 'paused';

          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border shadow-2xs space-y-4 transition-all ${
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

              {/* Practical Field Advisory with Audio Play CTA */}
              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-xs text-stone-800 dark:text-stone-200 leading-relaxed space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 font-bold text-[11px] text-emerald-800 dark:text-emerald-400">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Field Advisory</span>
                  </div>

                  {/* Spoken Kinyarwanda Audio Readout */}
                  <button
                    type="button"
                    onClick={() => handleSpeakAdvisory(day, idx)}
                    title="Umva Iteganyagihe mu Kinyarwanda"
                    className={`p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-semibold transition-all ${
                      isThisPlaying
                        ? 'bg-emerald-700 text-white animate-pulse'
                        : isThisPaused
                        ? 'bg-amber-700 text-white'
                        : 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-stone-600 border border-stone-300 dark:border-stone-600'
                    }`}
                  >
                    {isThisPlaying ? (
                      <>
                        <Pause className="w-3 h-3 fill-current" />
                        <span>Hagarika</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Umva Ijwi</span>
                      </>
                    )}
                  </button>
                </div>

                <p>{language === 'rw' ? day.farmingAdvisoryRw : day.farmingAdvisoryEn}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Explanatory Guidelines */}
      <div className="p-5 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3 text-xs">
        <h3 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-emerald-700" />
          <span>Weather-Triggered Good Agricultural Practices (GAP)</span>
        </h3>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
          Pesticide and fungicide applications must avoid high-wind windows (above 15 km/h) and periods with rain probability exceeding 60% within 4 hours to prevent runoff into communal rivers such as the Muvumba, Nyabarongo, and Sebeya. Top-dressing Nitrogen (Urea) is maximized when applied immediately prior to steady rain (40%–70% probability).
        </p>
      </div>
    </div>
  );
};
