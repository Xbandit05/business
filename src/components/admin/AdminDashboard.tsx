import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { NYAGATARE_SECTORS } from '../../data/nyagatare.ts';
import {
  ShieldAlert,
  TrendingUp,
  Scale,
  Building,
  CheckCircle2,
  FileText,
  DollarSign,
  AlertTriangle,
  Award,
  BarChart3,
} from 'lucide-react';

interface CoOpItem {
  id: string;
  name: string;
  district: string;
  sector: string;
  members: number;
  primaryCrop: string;
  isVerified: boolean;
}

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { orders, listings, benchmarks, showToast } = useApp();

  const [selectedAdminDistrict, setSelectedAdminDistrict] = useState<string>('all');
  const [cooperatives, setCooperatives] = useState<CoOpItem[]>([
    {
      id: 'coop_1',
      name: 'COOPAMA Mimuri Maize Union',
      district: 'Nyagatare',
      sector: 'Mimuri',
      members: 342,
      primaryCrop: 'Maize & Beans',
      isVerified: true,
    },
    {
      id: 'coop_2',
      name: 'CORIMU Rice Farmers Cooperative',
      district: 'Nyagatare',
      sector: 'Rukomo',
      members: 512,
      primaryCrop: 'Basmati Paddy Rice',
      isVerified: true,
    },
    {
      id: 'coop_3',
      name: 'Karangazi Dairy & Grains Federation',
      district: 'Nyagatare',
      sector: 'Karangazi',
      members: 280,
      primaryCrop: 'Dairy Fodder & Maize',
      isVerified: true,
    },
    {
      id: 'coop_4',
      name: 'COOPAC Kinigi Potato Seed Producers',
      district: 'Musanze',
      sector: 'Kinigi',
      members: 410,
      primaryCrop: 'Certified Irish Potatoes (Kinigi)',
      isVerified: true,
    },
    {
      id: 'coop_5',
      name: 'Mayange Cassava Millennium Processing Co-op',
      district: 'Bugesera',
      sector: 'Mayange',
      members: 225,
      primaryCrop: 'Cassava Flour (NAROCAS 1)',
      isVerified: true,
    },
    {
      id: 'coop_6',
      name: 'Nasho Solar Center Pivot Irrigation Co-op',
      district: 'Kirehe',
      sector: 'Nasho',
      members: 310,
      primaryCrop: 'Irrigated Grain Maize & Soya',
      isVerified: true,
    },
    {
      id: 'coop_7',
      name: 'Abahuzamugambi Maraba Coffee Cooperative',
      district: 'Huye',
      sector: 'Maraba',
      members: 460,
      primaryCrop: 'Specialty Arabica Bourbon Coffee',
      isVerified: true,
    },
  ]);

  // Admin Metrics
  const totalGmv = orders.reduce((acc, o) => acc + (Number(o.totalAmountRwf) || 0), 0);
  const totalKg = orders.reduce((acc, o) => acc + (Number(o.quantityKg) || 0), 0);
  const totalCommission = orders.reduce(
    (acc, o) => acc + (Number(o.commissionAmountRwf) || 0),
    0
  );

  const toggleCoopVerification = (id: string) => {
    setCooperatives((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.isVerified;
          showToast(
            'success',
            'Cooperative Status Updated',
            `${c.name} is now ${next ? 'VERIFIED' : 'PENDING AUDIT'}`
          );
          return { ...c, isVerified: next };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          {t('admin.title')}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {t('admin.subtitle')}
        </p>
      </div>

      {/* District KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('admin.gmv')}</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {totalGmv.toLocaleString()} <span className="text-xs font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Platform gross merchandise volume</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('admin.totalVol')}</span>
            <Scale className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
            {(totalKg / 1000).toFixed(1)} <span className="text-xs font-normal text-stone-500">Tons</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">{totalKg.toLocaleString()} kg total volume traded</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Platform Fee Collected</span>
            <TrendingUp className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {totalCommission.toLocaleString()} <span className="text-xs font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Sustainable 2.5% trade commission</div>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('admin.verifiedCoops')}</span>
            <Building className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {cooperatives.filter((c) => c.isVerified).length} / {cooperatives.length}
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Across 10 Nyagatare sectors</div>
        </div>
      </div>

      {/* MINICOM / e-Soko Benchmark Pricing Table */}
      <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              MINICOM / e-Soko Official Farmgate Price Benchmarks
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-medium">Eastern Province Indicative Range</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-500 font-semibold border-b border-stone-200 dark:border-stone-800 uppercase tracking-wide text-[10px]">
              <tr>
                <th className="px-4 py-3">Crop Commodity</th>
                <th className="px-4 py-3">Variety / Grade</th>
                <th className="px-4 py-3 text-right">Official Floor (RWF/kg)</th>
                <th className="px-4 py-3 text-right">Official Ceiling (RWF/kg)</th>
                <th className="px-4 py-3 text-right">Market Average</th>
                <th className="px-4 py-3 text-center">Trend</th>
                <th className="px-4 py-3 text-right">Last Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
              {benchmarks.map((bm, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  <td className="px-4 py-3 font-bold text-stone-900 dark:text-stone-100">
                    {bm.cropName}
                  </td>
                  <td className="px-4 py-3 text-stone-600 dark:text-stone-300">{bm.variety}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-600 dark:text-stone-300">
                    {bm.minicomMinRwf} RWF
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-600 dark:text-stone-300">
                    {bm.minicomMaxRwf} RWF
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums font-bold text-emerald-800 dark:text-emerald-400">
                    {bm.avgMarketRwf} RWF
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                        bm.trend === 'rising'
                          ? 'bg-emerald-100 text-emerald-800'
                          : bm.trend === 'stable'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {bm.trend}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-stone-500">{bm.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cooperative Verification Desk */}
      <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Cooperative Verification & Licensing Desk
            </h2>
          </div>
          
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'Nyagatare', 'Musanze', 'Bugesera', 'Kirehe', 'Huye'].map((dist) => (
              <button
                key={dist}
                type="button"
                onClick={() => setSelectedAdminDistrict(dist)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all shrink-0 border ${
                  selectedAdminDistrict === dist
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                    : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                }`}
              >
                {dist === 'all' ? 'All Rwanda' : dist}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {cooperatives
            .filter((c) => selectedAdminDistrict === 'all' || c.district === selectedAdminDistrict)
            .map((coop) => (
            <div
              key={coop.id}
              className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {coop.name}
                  </span>
                  {coop.isVerified ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Union</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Pending District Audit
                    </span>
                  )}
                </div>

                <div className="text-stone-500 dark:text-stone-400 mt-0.5">
                  District: <strong className="text-emerald-800 dark:text-emerald-400 font-semibold">{coop.district}</strong> ·{' '}
                  Sector: <strong className="text-stone-700 dark:text-stone-300">{coop.sector}</strong> ·{' '}
                  {coop.members} registered smallholders · Focus: {coop.primaryCrop}
                </div>
              </div>

              <button
                onClick={() => toggleCoopVerification(coop.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
                  coop.isVerified
                    ? 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-300'
                    : 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs'
                }`}
              >
                {coop.isVerified ? 'Revoke / Flag Audit' : 'Approve & Verify License'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
