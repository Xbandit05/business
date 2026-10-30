import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { NYAGATARE_SECTORS } from '../../data/nyagatare.ts';
import { getAllDistricts, getSectorsForDistrict } from '../../data/districts.ts';
import {
  Farm,
  Plot,
  CropCycle,
  ProduceListing,
  NyagatareSector,
  CropType,
  QualityGrade,
  PackagingType,
  DeliveryOption,
} from '../../types/index.ts';
import { X, Sprout, Tag, Handshake, MapPin, Layers } from 'lucide-react';

// ==================== REGISTER FARM MODAL ====================
export const RegisterFarmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { addFarm } = useApp();

  const districts = getAllDistricts();
  const [district, setDistrict] = useState<string>('Nyagatare');
  const [name, setName] = useState('');
  const [sector, setSector] = useState<string>('Mimuri');
  const [cell, setCell] = useState('');
  const [totalAreaHa, setTotalAreaHa] = useState('2.0');
  const [soilType, setSoilType] = useState('Sandy Clay Loam');
  const [waterSource, setWaterSource] = useState('Rainfed & retention trench');

  const availableSectors = getSectorsForDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const sectors = getSectorsForDistrict(newDistrict);
    if (sectors.length > 0) {
      setSector(sectors[0].name);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFarm({
      farmerId: 'current_user',
      farmerName: 'Jean-Damascene Niyonzima',
      name: name.trim(),
      district,
      sector,
      cell: cell.trim() || 'Central Cell',
      totalAreaHa: parseFloat(totalAreaHa) || 1.0,
      soilType,
      waterSource,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              {t('farmer.registerFarm')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Farm Name (Izina ry'Umurima) *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Umurima w'Icyerekezo"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                District (Akarere) *
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium"
              >
                {districts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.province})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Sector (Umurenge) *
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              >
                {availableSectors.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} Sector
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Cell / Village (Akagari)
              </label>
              <input
                type="text"
                value={cell}
                onChange={(e) => setCell(e.target.value)}
                placeholder="e.g., Mahoro Cell"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Total Area (Hectares) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={totalAreaHa}
                onChange={(e) => setTotalAreaHa(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Soil Type
              </label>
              <input
                type="text"
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                placeholder="e.g., Sandy Clay Loam"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Water Source & Irrigation
            </label>
            <input
              type="text"
              value={waterSource}
              onChange={(e) => setWaterSource(e.target.value)}
              placeholder="e.g., Muvumba tributary irrigation & seasonal rainfed"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== ADD PLOT MODAL ====================
export const AddPlotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { farms, addPlot, addCropCycle } = useApp();

  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [identifier, setIdentifier] = useState('');
  const [areaHa, setAreaHa] = useState('1.0');
  const [currentStatus, setCurrentStatus] = useState<Plot['currentStatus']>('planted');

  // Optional simultaneous crop cycle
  const [alsoLogCrop, setAlsoLogCrop] = useState(true);
  const [cropType, setCropType] = useState<CropType>('maize');
  const [cropName, setCropName] = useState('Hybrid White Maize');
  const [variety, setVariety] = useState('PAN 53');
  const [estYieldKg, setEstYieldKg] = useState('3200');

  useEffect(() => {
    if (farms.length > 0 && !selectedFarmId) {
      setSelectedFarmId(farms[0].id);
    }
  }, [farms, selectedFarmId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId || !identifier.trim()) return;

    const plotId = addPlot({
      farmId: selectedFarmId,
      identifier: identifier.trim(),
      areaHa: parseFloat(areaHa) || 1.0,
      currentStatus,
    });

    if (alsoLogCrop) {
      const today = new Date().toISOString().split('T')[0];
      const harvestDate = new Date();
      harvestDate.setDate(harvestDate.getDate() + 90);

      addCropCycle({
        plotId,
        farmId: selectedFarmId,
        cropType,
        cropName,
        variety,
        plantingDate: today,
        expectedHarvestDate: harvestDate.toISOString().split('T')[0],
        estimatedYieldKg: parseInt(estYieldKg, 10) || 2000,
        stage: 'vegetative',
        notes: 'Logged during plot creation in Nyagatare.',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              {t('farmer.addPlot')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Select Parent Farm *
            </label>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.sector} Sector)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Plot Identifier / Label *
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., Plot B2 - Valley Side"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Plot Size (Hectares) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={areaHa}
                onChange={(e) => setAreaHa(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          {/* Also log crop cycle toggle */}
          <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
            <label className="flex items-center gap-2 font-semibold text-stone-800 dark:text-stone-200 cursor-pointer">
              <input
                type="checkbox"
                checked={alsoLogCrop}
                onChange={(e) => setAlsoLogCrop(e.target.checked)}
                className="rounded text-emerald-800 focus:ring-emerald-700"
              />
              <span>Simultaneously log active crop cycle on this plot</span>
            </label>

            {alsoLogCrop && (
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200 dark:border-stone-700">
                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Crop Type
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => {
                      const ct = e.target.value as CropType;
                      setCropType(ct);
                      if (ct === 'maize') {
                        setCropName('Hybrid White Maize');
                        setVariety('PAN 53');
                      } else if (ct === 'beans') {
                        setCropName('Climbing Beans');
                        setVariety('RWR 2245');
                      } else if (ct === 'rice') {
                        setCropName('Basmati Paddy Rice');
                        setVariety('Muvumba Selection');
                      }
                    }}
                    className="w-full px-2 py-1.5 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded text-stone-800 dark:text-stone-200"
                  >
                    <option value="maize">Maize (Ibigori)</option>
                    <option value="beans">Beans (Ibihyimbo)</option>
                    <option value="rice">Rice (Umuceri)</option>
                    <option value="cassava">Cassava (Imyumbati)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Variety & Seed Name
                  </label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded text-stone-800 dark:text-stone-200"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                    Projected Harvest Volume (kg)
                  </label>
                  <input
                    type="number"
                    value={estYieldKg}
                    onChange={(e) => setEstYieldKg(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 rounded font-mono tabular-nums text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors"
            >
              Save Plot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== LIST PRODUCE MODAL ====================
export const ListProduceModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  prefillCycle?: CropCycle | null;
}> = ({ isOpen, onClose, prefillCycle }) => {
  const { t } = useLanguage();
  const { createListing, farms } = useApp();

  const [cropType, setCropType] = useState<CropType>('maize');
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [quantityKg, setQuantityKg] = useState('2000');
  const [minOrderKg, setMinOrderKg] = useState('200');
  const [unitPriceRwf, setUnitPriceRwf] = useState('380');
  const [district, setDistrict] = useState<string>('Nyagatare');
  const [sector, setSector] = useState<string>('Mimuri');
  const [grade, setGrade] = useState<QualityGrade>('Grade 1 (Premium / Export)');
  const [packaging, setPackaging] = useState<PackagingType>('50kg Woven Bags');
  const [delivery, setDelivery] = useState<DeliveryOption>('Nyagatare Aggregation Center');

  const availableDistricts = getAllDistricts();
  const availableSectors = getSectorsForDistrict(district);

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const secs = getSectorsForDistrict(newDist);
    if (secs.length > 0) {
      setSector(secs[0].name);
    }
  };

  useEffect(() => {
    if (prefillCycle) {
      setCropType(prefillCycle.cropType);
      setCropName(prefillCycle.cropName);
      setVariety(prefillCycle.variety);
      setQuantityKg((prefillCycle.actualHarvestKg || prefillCycle.estimatedYieldKg).toString());
      const f = farms.find((farm) => farm.id === prefillCycle.farmId);
      if (f) {
        if (f.district) setDistrict(f.district);
        setSector(f.sector);
      }
    } else {
      setCropName('White Grain Maize');
      setVariety('PAN 53 Hybrid');
    }
  }, [prefillCycle, farms]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) return;

    createListing({
      farmerId: 'current_user',
      farmerName: 'Jean-Damascene Niyonzima',
      farmerPhone: '+250 788 123 456',
      cooperativeName: 'COOPAMA Mimuri Maize Union',
      cropCycleId: prefillCycle?.id,
      cropType,
      cropName: cropName.trim(),
      variety: variety.trim() || 'Verified Variety',
      quantityAvailableKg: parseInt(quantityKg, 10) || 1000,
      minimumOrderKg: parseInt(minOrderKg, 10) || 100,
      unitPriceRwf: parseInt(unitPriceRwf, 10) || 350,
      qualityGrade: grade,
      packaging,
      deliveryOption: delivery,
      status: 'active',
      harvestDate: new Date().toISOString().split('T')[0],
      district,
      sector,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              {t('btn.newListing')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                District (Akarere) *
              </label>
              <select
                value={district}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-medium"
              >
                {availableDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name} ({d.province})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Sector (Umurenge) *
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              >
                {availableSectors.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name} Sector
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Crop Category *
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value as CropType)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              >
                <option value="maize">Maize (Ibigori)</option>
                <option value="beans">Beans (Ibihyimbo)</option>
                <option value="rice">Rice (Umuceri)</option>
                <option value="cassava">Cassava (Imyumbati)</option>
                <option value="soya">Soya Beans</option>
                <option value="sorghum">Sorghum (Amasaka)</option>
                <option value="vegetables">Horticulture / Vegetables</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Commodity Title *
              </label>
              <input
                type="text"
                required
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g. Dry White Maize (PAN 53)"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Variety / Seed Name
            </label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="e.g. PAN 53 / RWR 2245"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Available (kg) *
              </label>
              <input
                type="number"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Min. Order (kg)
              </label>
              <input
                type="number"
                value={minOrderKg}
                onChange={(e) => setMinOrderKg(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Price (RWF / kg) *
              </label>
              <input
                type="number"
                required
                value={unitPriceRwf}
                onChange={(e) => setUnitPriceRwf(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Quality Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value as QualityGrade)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              >
                <option value="Grade 1 (Premium / Export)">Grade 1 (Premium / Export)</option>
                <option value="Grade 2 (Commercial Standard)">Grade 2 (Commercial Standard)</option>
                <option value="Grade 3 (Processing / Local Feed)">Grade 3 (Processing)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Packaging
              </label>
              <select
                value={packaging}
                onChange={(e) => setPackaging(e.target.value as PackagingType)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              >
                <option value="50kg Woven Bags">50kg Woven Bags</option>
                <option value="100kg Grain Bags">100kg Grain Bags</option>
                <option value="Bulk Truckload">Bulk Truckload</option>
                <option value="Standard Crates">Standard Crates</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Delivery / Collection Term
            </label>
            <select
              value={delivery}
              onChange={(e) => setDelivery(e.target.value as DeliveryOption)}
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            >
              <option value="Farmgate Pickup (Buyer arranges transport)">Farmgate Pickup</option>
              <option value="Nyagatare Aggregation Center">Nyagatare Aggregation Center</option>
              <option value="Delivered to Kigali Hub">Delivered to Kigali Hub</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors"
            >
              Publish to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== MAKE PURCHASE OFFER MODAL ====================
export const MakeOfferModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  listing: ProduceListing | null;
}> = ({ isOpen, onClose, listing }) => {
  const { t } = useLanguage();
  const { submitBuyerOffer } = useApp();

  const [requestedKg, setRequestedKg] = useState('1000');
  const [offeredPriceRwf, setOfferedPriceRwf] = useState('360');
  const [pickupDate, setPickupDate] = useState('');
  const [buyerNotes, setBuyerNotes] = useState('');
  const [buyerName, setBuyerName] = useState('Clarisse Umutoni');
  const [buyerCompany, setBuyerCompany] = useState('Kigali Millers Ltd');
  const [buyerPhone, setBuyerPhone] = useState('+250 788 654 321');

  useEffect(() => {
    if (listing) {
      setRequestedKg(listing.minimumOrderKg.toString());
      setOfferedPriceRwf(listing.unitPriceRwf.toString());
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setPickupDate(nextWeek.toISOString().split('T')[0]);
    }
  }, [listing]);

  if (!isOpen || !listing) return null;

  const totalCalculated = (parseInt(requestedKg, 10) || 0) * (parseInt(offeredPriceRwf, 10) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(requestedKg, 10);
    const price = parseInt(offeredPriceRwf, 10);
    if (!qty || !price) return;

    submitBuyerOffer({
      listingId: listing.id,
      listingCropName: listing.cropName,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      buyerId: 'current_buyer',
      buyerName: buyerName.trim() || 'Verified Buyer',
      buyerPhone: buyerPhone.trim() || '+250 788 654 321',
      buyerCompany: buyerCompany.trim() || undefined,
      requestedQuantityKg: qty,
      offeredPricePerKgRwf: price,
      originalAskingPriceRwf: listing.unitPriceRwf,
      totalOfferedRwf: totalCalculated,
      proposedPickupDate: pickupDate || new Date().toISOString().split('T')[0],
      buyerNotes: buyerNotes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-emerald-800 dark:text-emerald-400" />
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
              {t('market.makeOffer')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg text-xs space-y-1">
          <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">
            {listing.cropName} ({listing.variety})
          </div>
          <div className="text-stone-600 dark:text-stone-400">
            Farmer: {listing.farmerName} · {listing.sector} Sector · Asking Price: <strong className="text-emerald-800 dark:text-emerald-400">{listing.unitPriceRwf} RWF/kg</strong>
          </div>
          <div className="text-stone-500 text-[11px]">
            Max Available: {listing.quantityAvailableKg.toLocaleString()} kg · Min Order: {listing.minimumOrderKg.toLocaleString()} kg
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Requested Volume (kg) *
              </label>
              <input
                type="number"
                required
                min={listing.minimumOrderKg}
                max={listing.quantityAvailableKg}
                value={requestedKg}
                onChange={(e) => setRequestedKg(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Your Price Bid (RWF / kg) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={offeredPriceRwf}
                onChange={(e) => setOfferedPriceRwf(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Proposed Pickup Date *
              </label>
              <input
                type="date"
                required
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Buyer Contact Phone
              </label>
              <input
                type="tel"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Notes or Logistics Specifications
            </label>
            <textarea
              rows={2}
              value={buyerNotes}
              onChange={(e) => setBuyerNotes(e.target.value)}
              placeholder="e.g. Can provide transport trucks directly to Mimuri center; payments made via MoMo or bank transfer."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
            />
          </div>

          <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg text-xs flex items-center justify-between">
            <span className="font-semibold text-stone-700 dark:text-stone-300">Total Purchase Value:</span>
            <span className="text-base font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
              {totalCalculated.toLocaleString()} RWF
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors"
            >
              Submit Binding Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==================== TOAST NOTIFICATION CONTAINER ====================
export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3.5 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-xl shadow-lg border border-stone-800 dark:border-stone-200 text-xs flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div>
            <div className="font-bold">{toast.title}</div>
            {toast.description && (
              <div className="text-stone-300 dark:text-stone-600 mt-0.5">{toast.description}</div>
            )}
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="p-0.5 text-stone-400 hover:text-white dark:hover:text-stone-900"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
