import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import {
  RWANDA_PROVINCES,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
  searchLocations,
  LocationSearchResult,
  getDistrictById,
  getSectorById,
  getCellById,
  getVillageById,
  getProvinceById,
} from '../../data/rwandaLocations.ts';
import { MapPin, Search, Check, AlertCircle, ChevronDown, RefreshCw } from 'lucide-react';

export interface LocationSelection {
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  sectorId: string;
  sectorName: string;
  cellId?: string;
  cellName?: string;
  villageId?: string;
  villageName?: string;
}

interface RwandaLocationSelectorProps {
  initialProvinceId?: string;
  initialDistrictId?: string;
  initialSectorId?: string;
  initialCellId?: string;
  initialVillageId?: string;
  requireCell?: boolean;
  requireVillage?: boolean;
  onChange: (selection: LocationSelection) => void;
  className?: string;
}

export const RwandaLocationSelector: React.FC<RwandaLocationSelectorProps> = ({
  initialProvinceId = 'prv_east',
  initialDistrictId = 'dis_nyagatare',
  initialSectorId = 'sec_nya_mimuri',
  initialCellId = 'cel_mim_mahoro',
  initialVillageId = 'vil_mah_01',
  requireCell = false,
  requireVillage = false,
  onChange,
  className = '',
}) => {
  const { language } = useLanguage();
  const isRw = language === 'rw';

  // Selection states
  const [provinceId, setProvinceId] = useState<string>(initialProvinceId);
  const [districtId, setDistrictId] = useState<string>(initialDistrictId);
  const [sectorId, setSectorId] = useState<string>(initialSectorId);
  const [cellId, setCellId] = useState<string>(initialCellId);
  const [villageId, setVillageId] = useState<string>(initialVillageId);

  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Cascading options derived from current selections
  const availableDistricts = provinceId ? getDistrictsByProvince(provinceId) : [];
  const availableSectors = districtId ? getSectorsByDistrict(districtId) : [];
  const availableCells = sectorId ? getCellsBySector(sectorId) : [];
  const availableVillages = cellId ? getVillagesByCell(cellId) : [];

  // Emit changes to parent
  useEffect(() => {
    const province = getProvinceById(provinceId);
    const district = getDistrictById(districtId);
    const sector = getSectorById(sectorId);
    const cell = cellId ? getCellById(cellId) : undefined;
    const village = villageId ? getVillageById(villageId) : undefined;

    onChange({
      provinceId,
      provinceName: province ? (isRw ? province.nameRw : province.name) : '',
      districtId,
      districtName: district ? (isRw ? district.nameRw : district.name) : '',
      sectorId,
      sectorName: sector ? (isRw ? sector.nameRw : sector.name) : '',
      cellId: cellId || undefined,
      cellName: cell ? (isRw ? cell.nameRw : cell.name) : undefined,
      villageId: villageId || undefined,
      villageName: village ? (isRw ? village.nameRw : village.name) : undefined,
    });
  }, [provinceId, districtId, sectorId, cellId, villageId, isRw]);

  // Handle Province change -> Reset downstream
  const handleProvinceChange = (newProvinceId: string) => {
    setProvinceId(newProvinceId);
    const districts = getDistrictsByProvince(newProvinceId);
    const firstDistrict = districts[0]?.id || '';
    setDistrictId(firstDistrict);

    const sectors = firstDistrict ? getSectorsByDistrict(firstDistrict) : [];
    const firstSector = sectors[0]?.id || '';
    setSectorId(firstSector);

    const cells = firstSector ? getCellsBySector(firstSector) : [];
    const firstCell = cells[0]?.id || '';
    setCellId(firstCell);

    const villages = firstCell ? getVillagesByCell(firstCell) : [];
    setVillageId(villages[0]?.id || '');
  };

  // Handle District change -> Reset downstream
  const handleDistrictChange = (newDistrictId: string) => {
    setDistrictId(newDistrictId);
    const sectors = getSectorsByDistrict(newDistrictId);
    const firstSector = sectors[0]?.id || '';
    setSectorId(firstSector);

    const cells = firstSector ? getCellsBySector(firstSector) : [];
    const firstCell = cells[0]?.id || '';
    setCellId(firstCell);

    const villages = firstCell ? getVillagesByCell(firstCell) : [];
    setVillageId(villages[0]?.id || '');
  };

  // Handle Sector change -> Reset downstream
  const handleSectorChange = (newSectorId: string) => {
    setSectorId(newSectorId);
    const cells = getCellsBySector(newSectorId);
    const firstCell = cells[0]?.id || '';
    setCellId(firstCell);

    const villages = firstCell ? getVillagesByCell(firstCell) : [];
    setVillageId(villages[0]?.id || '');
  };

  // Handle Cell change -> Reset downstream
  const handleCellChange = (newCellId: string) => {
    setCellId(newCellId);
    const villages = getVillagesByCell(newCellId);
    setVillageId(villages[0]?.id || '');
  };

  // Handle Global Search Input
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setIsSearching(true);
      const results = searchLocations(q, 8);
      setSearchResults(results);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Select Search Item
  const handleSelectSearchResult = (result: LocationSearchResult) => {
    if (result.level === 'village') {
      const v = result.matchedEntity as any;
      const cell = getCellById(v.cellId);
      const sector = cell ? getSectorById(cell.sectorId) : null;
      const district = sector ? getDistrictById(sector.districtId) : null;
      if (district) {
        setProvinceId(district.provinceId);
        setDistrictId(district.id);
        if (sector) setSectorId(sector.id);
        if (cell) setCellId(cell.id);
        setVillageId(v.id);
      }
    } else if (result.level === 'cell') {
      const c = result.matchedEntity as any;
      const sector = getSectorById(c.sectorId);
      const district = sector ? getDistrictById(sector.districtId) : null;
      if (district) {
        setProvinceId(district.provinceId);
        setDistrictId(district.id);
        if (sector) setSectorId(sector.id);
        setCellId(c.id);
        const villages = getVillagesByCell(c.id);
        setVillageId(villages[0]?.id || '');
      }
    } else if (result.level === 'sector') {
      const s = result.matchedEntity as any;
      const district = getDistrictById(s.districtId);
      if (district) {
        setProvinceId(district.provinceId);
        setDistrictId(district.id);
        setSectorId(s.id);
        const cells = getCellsBySector(s.id);
        const firstCell = cells[0]?.id || '';
        setCellId(firstCell);
        const villages = firstCell ? getVillagesByCell(firstCell) : [];
        setVillageId(villages[0]?.id || '');
      }
    } else if (result.level === 'district') {
      const d = result.matchedEntity as any;
      setProvinceId(d.provinceId);
      setDistrictId(d.id);
      const sectors = getSectorsByDistrict(d.id);
      const firstSector = sectors[0]?.id || '';
      setSectorId(firstSector);
      const cells = firstSector ? getCellsBySector(firstSector) : [];
      const firstCell = cells[0]?.id || '';
      setCellId(firstCell);
      const villages = firstCell ? getVillagesByCell(firstCell) : [];
      setVillageId(villages[0]?.id || '');
    }

    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
  };

  // Current Breadcrumb path for visual feedback
  const currentProvince = getProvinceById(provinceId);
  const currentDistrict = getDistrictById(districtId);
  const currentSector = getSectorById(sectorId);
  const currentCell = cellId ? getCellById(cellId) : undefined;
  const currentVillage = villageId ? getVillageById(villageId) : undefined;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 1. Global Quick Search Bar */}
      <div className="relative">
        <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
          {isRw ? 'Shakisha ahantu (Umurenge, Akagari, Umudugudu...)' : 'Quick Search Administrative Location'}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={isRw ? 'Andika akarere, umurenge, cyangwa akagari...' : 'Type district, sector, cell or village name...'}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl shadow-lg py-1 text-xs">
            {searchResults.map((item) => (
              <button
                key={`${item.level}-${item.id}`}
                type="button"
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border-b border-stone-100 dark:border-stone-700/50 last:border-0 cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <span className="capitalize px-1.5 py-0.5 rounded-sm text-[10px] bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300 font-mono">
                      {item.level}
                    </span>
                    <span>{isRw ? item.nameRw : item.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {item.hierarchyPath}
                  </div>
                </div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-mono">
                  {item.code}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. 5-Tier Cascading Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Tier 1: Province */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
            {isRw ? '1. Intara' : '1. Province / City'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={provinceId}
              onChange={(e) => handleProvinceChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
            >
              {RWANDA_PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {isRw ? p.nameRw : p.name} ({p.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tier 2: District */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
            {isRw ? '2. Akarere' : '2. District'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={districtId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
            >
              {availableDistricts.map((d) => (
                <option key={d.id} value={d.id}>
                  {isRw ? d.nameRw : d.name} ({d.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tier 3: Sector */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
            {isRw ? '3. Umurenge' : '3. Sector'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              value={sectorId}
              onChange={(e) => handleSectorChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
            >
              {availableSectors.map((s) => (
                <option key={s.id} value={s.id}>
                  {isRw ? s.nameRw : s.name} ({s.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tier 4: Cell */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
            <span>{isRw ? '4. Akagari' : '4. Cell (Akagari)'}</span>
            {requireCell ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-[10px] text-stone-400 font-normal">Optional</span>
            )}
          </label>
          <div className="relative">
            <select
              value={cellId}
              onChange={(e) => handleCellChange(e.target.value)}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
            >
              <option value="">{isRw ? '-- Hitamo Akagari --' : '-- Select Cell --'}</option>
              {availableCells.map((c) => (
                <option key={c.id} value={c.id}>
                  {isRw ? c.nameRw : c.name} ({c.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Tier 5: Village (Umudugudu) */}
        <div>
          <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
            <span>{isRw ? '5. Umudugudu' : '5. Village (Umudugudu)'}</span>
            {requireVillage ? (
              <span className="text-red-500">*</span>
            ) : (
              <span className="text-[10px] text-stone-400 font-normal">Optional</span>
            )}
          </label>
          <div className="relative">
            <select
              value={villageId}
              onChange={(e) => setVillageId(e.target.value)}
              disabled={!cellId}
              className="w-full text-xs py-2 px-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 disabled:opacity-50 disabled:bg-stone-100 dark:disabled:bg-stone-900 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
            >
              <option value="">{isRw ? '-- Hitamo Umudugudu --' : '-- Select Village --'}</option>
              {availableVillages.map((v) => (
                <option key={v.id} value={v.id}>
                  {isRw ? v.nameRw : v.name} ({v.code})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Verified Location Breadcrumb Pill */}
      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2 overflow-hidden">
          <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
          <span className="font-semibold text-[11px] text-emerald-800 dark:text-emerald-300 shrink-0">
            {isRw ? 'Aderesi yemejwe:' : 'Verified Address:'}
          </span>
          <span className="truncate text-[11px]">
            {[
              currentProvince?.name,
              currentDistrict?.name,
              currentSector?.name,
              currentCell?.name,
              currentVillage?.name,
            ]
              .filter(Boolean)
              .join(' › ')}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 shrink-0">
          {currentVillage?.code || currentCell?.code || currentSector?.code || currentDistrict?.code || 'RWANDA'}
        </span>
      </div>
    </div>
  );
};
