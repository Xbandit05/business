import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { NYAGATARE_SECTORS } from '../../data/nyagatare.ts';
import { NyagatareSector, CropType, QualityGrade } from '../../types/index.ts';
import {
  Users,
  UserPlus,
  Phone,
  MapPin,
  Sprout,
  Plus,
  CheckCircle2,
  FileSpreadsheet,
  Volume2,
  MessageSquare,
} from 'lucide-react';

interface AssistedFarmer {
  id: string;
  name: string;
  phone: string;
  sector: NyagatareSector;
  coop: string;
  acresHa: number;
  crop: string;
  notes: string;
}

export const CommunityAgentAssistedView: React.FC = () => {
  const { t, speakKinyarwandaText, isSpeaking } = useLanguage();
  const { addFarm, addPlot, createListing, showToast } = useApp();

  const [assistedList, setAssistedList] = useState<AssistedFarmer[]>([
    {
      id: 'agent_rec_1',
      name: 'Aloys Twagirayezu',
      phone: '+250 788 445 112',
      sector: 'Mimuri',
      coop: 'Abahujumugambi Cooperative',
      acresHa: 1.8,
      crop: 'Hybrid Maize (PAN 53)',
      notes: 'No smartphone. Needs SMS reminders for harvest collection.',
    },
    {
      id: 'agent_rec_2',
      name: 'Esperance Mukandori',
      phone: '+250 788 556 223',
      sector: 'Rukomo',
      coop: 'Dukundumurimo Rukomo',
      acresHa: 0.8,
      crop: 'Climbing Beans (RWR 2245)',
      notes: 'Ready to aggregate 1,200kg at Rukomo collection center.',
    },
  ]);

  const [isRegistering, setIsRegistering] = useState(false);
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [sector, setSector] = useState<NyagatareSector>('Mimuri');
  const [cooperative, setCooperative] = useState('');
  const [plotAreaHa, setPlotAreaHa] = useState('1.5');
  const [cropType, setCropType] = useState<CropType>('maize');
  const [produceQtyKg, setProduceQtyKg] = useState('2000');
  const [unitPriceRwf, setUnitPriceRwf] = useState('380');
  const [agentNotes, setAgentNotes] = useState('');

  const handleRegisterOnBehalf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim()) return;

    // 1. Add Farm in App state
    const farmId = addFarm({
      farmerId: `assisted_${Date.now()}`,
      farmerName: farmerName.trim(),
      name: `Umurima wa ${farmerName} (${sector})`,
      sector,
      cell: 'Center Cell',
      totalAreaHa: parseFloat(plotAreaHa) || 1.0,
      soilType: 'Loam Humus',
      waterSource: 'Local water retention trenches',
    });

    // 2. Add Plot
    addPlot({
      farmId,
      identifier: `Plot 1 - Assisted`,
      areaHa: parseFloat(plotAreaHa) || 1.0,
      currentStatus: 'harvesting',
    });

    // 3. Create Produce Listing
    createListing({
      farmerId: `assisted_${Date.now()}`,
      farmerName: farmerName.trim(),
      farmerPhone: farmerPhone.trim(),
      cooperativeName: cooperative.trim() || undefined,
      cropType,
      cropName: cropType === 'maize' ? 'Maize Grain' : cropType === 'beans' ? 'Red Kidney Beans' : 'Paddy Rice',
      variety: 'Local Verified Certified Seed',
      quantityAvailableKg: parseInt(produceQtyKg, 10) || 1000,
      minimumOrderKg: 200,
      unitPriceRwf: parseInt(unitPriceRwf, 10) || 350,
      qualityGrade: 'Grade 1 (Premium / Export)',
      packaging: '50kg Woven Bags',
      deliveryOption: 'Nyagatare Aggregation Center',
      status: 'active',
      harvestDate: new Date().toISOString().split('T')[0],
      sector,
    });

    // 4. Add to agent roster
    const newEntry: AssistedFarmer = {
      id: `assisted_${Date.now()}`,
      name: farmerName.trim(),
      phone: farmerPhone.trim(),
      sector,
      coop: cooperative.trim() || 'Individual Smallholder',
      acresHa: parseFloat(plotAreaHa) || 1.0,
      crop: cropType.toUpperCase(),
      notes: agentNotes || 'Assisted by Community Agent via smartphone kiosk.',
    };

    setAssistedList((prev) => [newEntry, ...prev]);
    setIsRegistering(false);
    setFarmerName('');
    setFarmerPhone('');
    setAgentNotes('');
    showToast('success', 'Farmer Onboarded', `${newEntry.name} registered and produce listed.`);
  };

  const handleReadKinyarwandaGuidance = () => {
    speakKinyarwandaText(
      'Kaze kuri gahunda y\'abajyanama b\'ubuhinzi muri Nyagatare. Hano murafasha abahinzi badafite telefone zigezweho kwandika imirima yabo no kugurisha umusaruro wabo ku masoko.'
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t('agent.title')}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t('agent.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReadKinyarwandaGuidance}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kinyarwanda Audio Guide</span>
          </button>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isRegistering ? t('common.close') : t('agent.registerFarmerBtn')}</span>
          </button>
        </div>
      </div>

      {/* Onboarding Form Modal / Drawer */}
      {isRegistering && (
        <div className="p-6 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-700" />
              <span>Assisted Farmer Registration & Listing</span>
            </h3>
            <span className="text-xs text-stone-500">Nyagatare Field Support</span>
          </div>

          <form onSubmit={handleRegisterOnBehalf} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Farmer Full Name (Izina ry'Umuhinzi) *
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="e.g., Emmanuel Mugisha"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Phone Number (Telefone ya MTN/Airtel) *
                </label>
                <input
                  type="tel"
                  required
                  value={farmerPhone}
                  onChange={(e) => setFarmerPhone(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nyagatare Sector (Umurenge) *
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value as NyagatareSector)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                >
                  {NYAGATARE_SECTORS.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Cooperative / Farmer Group (Koperative)
                </label>
                <input
                  type="text"
                  value={cooperative}
                  onChange={(e) => setCooperative(e.target.value)}
                  placeholder="e.g., Abahuje Maize Cooperative"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Cultivated Land (Ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={plotAreaHa}
                  onChange={(e) => setPlotAreaHa(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Crop (Igihingwa)
                </label>
                <select
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value as CropType)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                >
                  <option value="maize">Maize (Ibigori)</option>
                  <option value="beans">Beans (Ibihyimbo)</option>
                  <option value="rice">Rice (Umuceri)</option>
                  <option value="cassava">Cassava (Imyumbati)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Surplus Quantity to List (kg)
                </label>
                <input
                  type="number"
                  value={produceQtyKg}
                  onChange={(e) => setProduceQtyKg(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Target Price (RWF per kg)
                </label>
                <input
                  type="number"
                  value={unitPriceRwf}
                  onChange={(e) => setUnitPriceRwf(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Field Notes / Special Requirements
              </label>
              <textarea
                rows={2}
                value={agentNotes}
                onChange={(e) => setAgentNotes(e.target.value)}
                placeholder="e.g. Farmer requests phone call upon buyer arrival; bags stored in community warehouse."
                className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors shadow-2xs"
              >
                Save & Publish to Marketplace
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assisted Farmers Roster */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-700" />
            <span>{t('agent.assistedFarmers')}</span>
            <span className="text-xs text-stone-500 font-normal">({assistedList.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assistedList.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{item.sector} Sector</span>
                    <span>·</span>
                    <span>{item.coop}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {item.acresHa} Ha
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs">
                <div className="flex items-center justify-between text-stone-700 dark:text-stone-300">
                  <span className="font-medium">Active Crop: {item.crop}</span>
                  <span className="text-stone-500">Contact: {item.phone}</span>
                </div>
                {item.notes && (
                  <p className="text-stone-500 dark:text-stone-400 italic text-[11px] mt-1">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-stone-400 text-[11px]">Assisted via Agent Portal</span>
                <button
                  onClick={() =>
                    showToast(
                      'info',
                      'SMS Notification Queued',
                      `Reminder broadcast scheduled to ${item.phone}`
                    )
                  }
                  className="inline-flex items-center gap-1 text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 font-semibold"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send SMS Alert</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
