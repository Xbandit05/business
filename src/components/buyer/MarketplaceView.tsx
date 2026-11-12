import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { ProduceListing, BuyerOffer, CropType, NyagatareSector, QualityGrade } from '../../types/index.ts';
import { getAllDistricts, getSectorsForDistrict } from '../../data/districts.ts';
import {
  ShoppingBag,
  Filter,
  Search,
  MapPin,
  Scale,
  Calendar,
  CheckCircle,
  Truck,
  Package,
  Handshake,
  Tag,
  Clock,
  ArrowRight,
  Info,
  MessageSquare,
} from 'lucide-react';
import { FounderWatermark } from '../common/FounderWatermark.tsx';

interface MarketplaceViewProps {
  onSelectListingForOffer: (listing: ProduceListing) => void;
  onStartNegotiation?: (listing: ProduceListing) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onSelectListingForOffer,
  onStartNegotiation,
}) => {
  const { t } = useLanguage();
  const { listings, offers, role } = useApp();

  const [activeTab, setActiveTab] = useState<'catalog' | 'myBids'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const allDistricts = getAllDistricts();
  const sectorsForSelectedDistrict = selectedDistrict !== 'all'
    ? getSectorsForDistrict(selectedDistrict)
    : [];

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.cropName.toLowerCase().includes(query);
        const matchesVariety = item.variety.toLowerCase().includes(query);
        const matchesFarmer = item.farmerName.toLowerCase().includes(query);
        const matchesCoop = (item.cooperativeName || '').toLowerCase().includes(query);
        if (!matchesName && !matchesVariety && !matchesFarmer && !matchesCoop) return false;
      }
      if (selectedCrop !== 'all' && item.cropType !== selectedCrop) return false;
      if (selectedDistrict !== 'all') {
        const itemDist = item.district || 'Nyagatare';
        if (itemDist.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
      }
      if (selectedSector !== 'all' && item.sector !== selectedSector) return false;
      if (selectedGrade !== 'all' && item.qualityGrade !== selectedGrade) return false;
      return true;
    });
  }, [listings, searchQuery, selectedCrop, selectedDistrict, selectedSector, selectedGrade]);

  const getStatusBadge = (status: BuyerOffer['status']) => {
    switch (status) {
      case 'submitted':
        return 'text-amber-800 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      case 'countered':
        return 'text-purple-800 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
      case 'accepted':
        return 'text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
      case 'declined':
        return 'text-rose-800 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
      case 'completed':
        return 'text-stone-800 bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Tabs */}
      <div className="relative overflow-hidden p-5 sm:p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
        <FounderWatermark variant="section-banner" className="opacity-12 dark:opacity-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              {t('market.title')}
            </h1>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {t('market.subtitle')}
            </p>
          </div>

          {/* Catalog vs My Bids Tab Switcher */}
          <div className="inline-flex rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 p-1 shadow-2xs shrink-0">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'catalog'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Available Produce ({listings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('myBids')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'myBids'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>My Submitted Bids ({offers.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'catalog' ? (
        <>
          {/* Search & Filter Bar */}
          <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('market.searchPlaceholder')}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Filter: Crop Type */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  {t('market.filterCrop')}
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  <option value="all">All Crops</option>
                  <option value="maize">Maize (Ibigori)</option>
                  <option value="beans">Beans (Ibihyimbo)</option>
                  <option value="rice">Rice (Umuceri)</option>
                  <option value="cassava">Cassava (Imyumbati)</option>
                  <option value="soya">Soya Beans</option>
                  <option value="sorghum">Sorghum (Amasaka)</option>
                  <option value="dairy_fodder">Dairy Fodder</option>
                  <option value="vegetables">Horticulture / Vegetables</option>
                </select>
              </div>

              {/* Filter: District */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  District (Akarere)
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedSector('all');
                  }}
                  className="w-full px-3 py-1.5 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200 font-semibold"
                >
                  <option value="all">All Rwanda (Igihugu Cyose)</option>
                  {allDistricts.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name} ({d.province})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter: Sector */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  {t('market.filterSector')}
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  <option value="all">
                    {selectedDistrict === 'all' ? 'All Sectors' : `All Sectors in ${selectedDistrict}`}
                  </option>
                  {sectorsForSelectedDistrict.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} Sector
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter: Quality Grade */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wide mb-1">
                  {t('market.filterGrade')}
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-medium bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  <option value="all">All Quality Grades</option>
                  <option value="Grade 1 (Premium / Export)">Grade 1 (Premium / Export)</option>
                  <option value="Grade 2 (Commercial Standard)">Grade 2 (Commercial Standard)</option>
                  <option value="Grade 3 (Processing / Local Feed)">Grade 3 (Processing)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                  No produce matching filters
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try adjusting the sector or crop type filters above to view other harvests listed across Nyagatare.
                </p>
              </div>
            ) : (
              filteredListings.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs hover:border-emerald-600/40 dark:hover:border-emerald-600/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Card Header: Crop Name & Badges */}
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 leading-tight">
                            {item.cropName}
                          </h3>
                          {item.isDemo ? (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 shrink-0">
                              DEMO
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                              NEW LISTING
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                          <span className="font-semibold text-stone-700 dark:text-stone-300">
                            {item.district ? `${item.district} · ${item.sector}` : `${item.sector} Sector`}
                          </span>
                          <span>·</span>
                          <span className="truncate">{item.variety}</span>
                        </div>
                      </div>

                      {/* Origin Farmer Info */}
                      <div className="p-2.5 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 text-xs">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">
                          {item.farmerName}
                        </div>
                        {item.cooperativeName && (
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                            {item.cooperativeName}
                          </div>
                        )}
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Tel: {item.farmerPhone}
                        </div>
                      </div>

                      {/* Specs Matrix */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-stone-100 dark:border-stone-800">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                            {t('market.available')}
                          </span>
                          <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200">
                            {item.quantityAvailableKg.toLocaleString()} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                            {t('market.minOrder')}
                          </span>
                          <span className="font-mono tabular-nums text-stone-600 dark:text-stone-300">
                            {item.minimumOrderKg.toLocaleString()} kg
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                            Quality Grade
                          </span>
                          <span className="font-medium text-stone-700 dark:text-stone-300 truncate block">
                            {item.qualityGrade.split(' ')[0]} {item.qualityGrade.split(' ')[1]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                            Packaging
                          </span>
                          <span className="font-medium text-stone-700 dark:text-stone-300 truncate block">
                            {item.packaging}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Term */}
                      <div className="text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 px-2 py-1 rounded">
                        <Truck className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{item.deliveryOption}</span>
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-4 mt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-stone-400 block">
                          Farmgate Asking Price
                        </span>
                        <div className="text-xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                          {item.unitPriceRwf} <span className="text-xs font-normal text-stone-500">RWF/kg</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {onStartNegotiation && (
                          <button
                            onClick={() => onStartNegotiation(item)}
                            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs transition-all whitespace-nowrap"
                            title="Chat & Negotiate Price with Farmer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>Negotiate Price</span>
                          </button>
                        )}
                        <button
                          onClick={() => onSelectListingForOffer(item)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs transition-colors whitespace-nowrap"
                        >
                          <Handshake className="w-3.5 h-3.5" />
                          <span>{t('market.makeOffer')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        /* My Submitted Bids Tab */
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-1">
              {t('offers.myBidsTitle')}
            </h2>
            <p className="text-xs text-stone-500">
              {t('offers.myBidsSubtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {offers.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
                <Handshake className="w-10 h-10 text-stone-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
                  No purchase offers submitted yet
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Browse the produce catalog and submit a purchase offer with your target volume and price per kilogram.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="mt-3 px-4 py-2 text-xs font-semibold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Browse Produce Catalog
                </button>
              </div>
            ) : (
              offers.map((offer) => {
                const targetListing = listings.find((l) => l.id === offer.listingId);
                return (
                  <div
                    key={offer.id}
                    className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                            {offer.listingCropName}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded border capitalize ${getStatusBadge(
                              offer.status
                            )}`}
                          >
                            Status: {offer.status}
                          </span>
                          {offer.isDemo && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                              DEMO
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                          Farmer: <span className="font-medium text-stone-700 dark:text-stone-300">{offer.farmerName}</span>
                          {targetListing && ` · ${targetListing.sector} Sector`}
                        </div>
                      </div>

                      {/* Total Value */}
                      <div className="sm:text-right">
                        <span className="text-lg font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                          {offer.totalOfferedRwf.toLocaleString()} RWF
                        </span>
                        <span className="block text-[11px] text-stone-500">
                          {offer.requestedQuantityKg.toLocaleString()} kg @ {offer.offeredPricePerKgRwf} RWF/kg
                        </span>
                      </div>
                    </div>

                    {/* Counteroffer notice if applicable */}
                    {offer.status === 'countered' && offer.counterPricePerKgRwf && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-purple-900 dark:text-purple-300">
                          Farmer Submitted Counteroffer: {offer.counterPricePerKgRwf} RWF/kg
                        </div>
                        {offer.counterNotes && (
                          <p className="text-purple-800 dark:text-purple-400 italic">
                            "{offer.counterNotes}"
                          </p>
                        )}
                        <p className="text-[11px] text-purple-700 dark:text-purple-400">
                          Adjusted total would be:{' '}
                          <span className="font-bold font-mono tabular-nums">
                            {(offer.counterPricePerKgRwf * offer.requestedQuantityKg).toLocaleString()} RWF
                          </span>
                        </p>
                      </div>
                    )}

                    {offer.buyerNotes && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded">
                        "Your note: {offer.buyerNotes}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 dark:border-stone-800">
                      <span>Proposed Pickup: {offer.proposedPickupDate}</span>
                      <span>Submitted: {new Date(offer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
