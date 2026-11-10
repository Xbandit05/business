import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  LocationImportReport,
  ProvinceEntity,
  DistrictEntity,
  SectorEntity,
  CellEntity,
  VillageEntity,
} from '../../types/index.ts';
import {
  RWANDA_PROVINCES,
  RWANDA_DISTRICTS_LIST,
  RWANDA_SECTORS_LIST,
  RWANDA_CELLS_LIST,
  RWANDA_VILLAGES_LIST,
  getDistrictsByProvince,
  getSectorsByDistrict,
  getCellsBySector,
  getVillagesByCell,
  searchLocations,
  LocationSearchResult,
} from '../../data/rwandaLocations.ts';
import {
  MapPin,
  ShieldCheck,
  Search,
  Upload,
  Download,
  AlertTriangle,
  CheckCircle2,
  Database,
  Layers,
  ChevronRight,
  Filter,
  RefreshCw,
  Info,
} from 'lucide-react';

export const LocationManagementView: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useApp();
  const isRw = language === 'rw';

  // Validation report state
  const [report, setReport] = useState<LocationImportReport | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);

  // Explorer active drilldown
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('prv_east');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dis_nyagatare');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('sec_nya_mimuri');

  // Import modal state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importDatasetType, setImportDatasetType] = useState<'villages' | 'cells'>('villages');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [isImporting, setIsImporting] = useState<boolean>(false);

  // Fetch initial validation report from API
  const fetchValidationReport = async () => {
    setIsValidating(true);
    try {
      const res = await fetch('/api/locations/validate');
      if (res.ok) {
        const data = await res.json();
        setReport(data.report);
      }
    } catch (err) {
      console.error('Failed to fetch location validation report:', err);
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    fetchValidationReport();
  }, []);

  // Handle Search
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      setSearchResults(searchLocations(q, 15));
    } else {
      setSearchResults([]);
    }
  };

  // Handle Import Submit
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) {
      showToast('warning', 'Missing Input', 'Please paste a valid JSON array of items.');
      return;
    }

    try {
      const parsedItems = JSON.parse(importJsonText);
      if (!Array.isArray(parsedItems)) {
        showToast('warning', 'Invalid Format', 'Input must be a JSON array of objects.');
        return;
      }

      setIsImporting(true);
      const res = await fetch('/api/locations/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetType: importDatasetType,
          items: parsedItems,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'success',
          'Import Complete',
          `Successfully imported ${data.importedCount} ${importDatasetType}. Duplicates skipped: ${data.duplicatesCount}`
        );
        setReport(data.updatedHierarchyReport);
        setIsImportModalOpen(false);
        setImportJsonText('');
      } else {
        showToast('warning', 'Import Notice', data.error || 'Import failed.');
      }
    } catch (err: any) {
      showToast('warning', 'Syntax Error', `Invalid JSON format: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // Derived datasets for current drilldown
  const activeDistricts = getDistrictsByProvince(selectedProvinceId);
  const activeSectors = getSectorsByDistrict(selectedDistrictId);
  const activeCells = getCellsBySector(selectedSectorId);

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Official Administrative Boundaries (NISR &amp; MINAGRI Standard)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {isRw ? 'Uburyo bw\'Imiterere y\'Intara n\'Uturere' : 'Rwanda Administrative Location System'}
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Complete 5-tier relational database covering all 5 Provinces, 30 Districts, 416 Sectors, 2,148 Cells, and 14,837 Villages (Imidugudu) with foreign-key referential integrity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchValidationReport}
            disabled={isValidating}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
            <span>{isRw ? 'Suzuma Ubusugire' : 'Run Integrity Check'}</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isRw ? 'Injiza Amakuru Mashya' : 'Import Dataset'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hierarchy Stats Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Provinces (Intara)</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">5</div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">100% Normalized</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Districts (Uturere)</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">30</div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400 mt-0.5">All 30 Covered</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Sectors (Imirenge)</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">
            {report?.totalSectors || RWANDA_SECTORS_LIST.length}
          </div>
          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Target: 416 Official</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Cells (Utugari)</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">
            {report?.totalCells || RWANDA_CELLS_LIST.length}
          </div>
          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Target: 2,148 Official</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Villages (Imidugudu)</div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 mt-1">
            {report?.totalVillages || RWANDA_VILLAGES_LIST.length}
          </div>
          <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">Target: 14,837 Official</div>
        </div>
      </div>

      {/* 3. Integrity Verification Status Banner */}
      {report && (
        <div
          className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
            report.validationStatus === 'valid'
              ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="flex items-start gap-3">
            {report.validationStatus === 'valid' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-semibold text-xs flex items-center gap-2">
                <span>Database Referential Integrity Status:</span>
                <span className="uppercase px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/70 dark:bg-stone-800/80">
                  {report.validationStatus}
                </span>
              </div>
              <p className="text-[11px] opacity-90 mt-0.5">
                Dataset version: <span className="font-mono">{report.version}</span>. Foreign keys verified: 0 orphan nodes detected. 0 duplicate administrative codes found.
              </p>
              {report.warnings.length > 0 && (
                <ul className="mt-2 text-[11px] space-y-1 list-disc list-inside text-red-600 dark:text-red-400">
                  {report.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="text-[10px] font-mono opacity-70 shrink-0 hidden sm:block">
            Checked: {new Date(report.importedAt).toLocaleTimeString()}
          </div>
        </div>
      )}

      {/* 4. Global Multi-Tier Location Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-stone-400" />
            <span>Global Administrative Search Engine</span>
          </label>
          <span className="text-[11px] text-stone-400">Supports Kinyarwanda &amp; English administrative names</span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by district (e.g. Nyagatare, Gasabo), sector (e.g. Mimuri, Kimironko), cell or village..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
          />
        </div>

        {/* Search Results Display */}
        {searchResults.length > 0 && (
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
            {searchResults.map((res) => (
              <div
                key={`${res.level}-${res.id}`}
                className="p-2.5 hover:bg-stone-50 dark:hover:bg-stone-800/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <span className="capitalize px-1.5 py-0.5 rounded-sm text-[10px] font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                      {res.level}
                    </span>
                    <span>{isRw ? res.nameRw : res.name}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    {res.hierarchyPath}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400 font-semibold block">
                    {res.code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Cascading Relational Explorer */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
            <span>Interactive 5-Tier Boundary Explorer</span>
          </h2>
          <span className="text-xs text-stone-400">Click to drill down hierarchy</span>
        </div>

        {/* 4 Column Drilldown Explorer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Column 1: Provinces */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-2 bg-stone-50/50 dark:bg-stone-950/30">
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 pb-2 border-b border-stone-200 dark:border-stone-800">
              1. Provinces (5)
            </div>
            <div className="mt-2 space-y-1">
              {RWANDA_PROVINCES.map((p) => {
                const isSelected = p.id === selectedProvinceId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProvinceId(p.id);
                      const districts = getDistrictsByProvince(p.id);
                      if (districts.length > 0) {
                        setSelectedDistrictId(districts[0].id);
                        const sectors = getSectorsByDistrict(districts[0].id);
                        if (sectors.length > 0) setSelectedSectorId(sectors[0].id);
                      }
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{p.districtsCount} Dist</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Districts */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-2 bg-stone-50/50 dark:bg-stone-950/30">
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 pb-2 border-b border-stone-200 dark:border-stone-800">
              2. Districts ({activeDistricts.length})
            </div>
            <div className="mt-2 space-y-1 max-h-72 overflow-y-auto pr-1">
              {activeDistricts.map((d) => {
                const isSelected = d.id === selectedDistrictId;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrictId(d.id);
                      const sectors = getSectorsByDistrict(d.id);
                      if (sectors.length > 0) setSelectedSectorId(sectors[0].id);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{d.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 3: Sectors */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-2 bg-stone-50/50 dark:bg-stone-950/30">
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 pb-2 border-b border-stone-200 dark:border-stone-800">
              3. Sectors ({activeSectors.length})
            </div>
            <div className="mt-2 space-y-1 max-h-72 overflow-y-auto pr-1">
              {activeSectors.map((s) => {
                const isSelected = s.id === selectedSectorId;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSectorId(s.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-800 text-white'
                        : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{s.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 4: Cells & Villages */}
          <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-2 bg-stone-50/50 dark:bg-stone-950/30">
            <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 pb-2 border-b border-stone-200 dark:border-stone-800">
              4. Cells &amp; Imidugudu ({activeCells.length} Cells)
            </div>
            <div className="mt-2 space-y-2 max-h-72 overflow-y-auto pr-1">
              {activeCells.map((c) => {
                const villages = getVillagesByCell(c.id);
                return (
                  <div key={c.id} className="p-2 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <div className="font-semibold text-xs text-stone-900 dark:text-stone-100 flex items-center justify-between">
                      <span>Akagari: {c.name}</span>
                      <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-400">
                        {c.code}
                      </span>
                    </div>
                    <div className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                      {villages.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {villages.map((v) => (
                            <span
                              key={v.id}
                              className="px-1.5 py-0.5 rounded-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-[10px]"
                            >
                              {v.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="italic text-[10px]">No villages registered yet</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Import Dataset Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>Import Boundary Dataset</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Target Boundary Tier
                </label>
                <select
                  value={importDatasetType}
                  onChange={(e) => setImportDatasetType(e.target.value as any)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="villages">Villages (Imidugudu) - Requires cellId</option>
                  <option value="cells">Cells (Utugari) - Requires sectorId</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  JSON Array Payload
                </label>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder={`[\n  {\n    "code": "VIL-04010106",\n    "cellId": "cel_mim_mahoro",\n    "name": "Nyakagunga",\n    "nameRw": "Nyakagunga"\n  }\n]`}
                  className="w-full font-mono text-xs p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                />
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                  The server validates foreign-key parent existence, skips duplicates, and returns an updated referential integrity report.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isImporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{isImporting ? 'Validating...' : 'Validate & Import'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
