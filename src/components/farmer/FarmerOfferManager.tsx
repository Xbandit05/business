import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { BuyerOffer } from '../../types/index.ts';
import {
  Handshake,
  CheckCircle,
  XCircle,
  ArrowRightLeft,
  Calendar,
  Building,
  Phone,
  Clock,
  Check,
  X,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

export const FarmerOfferManager: React.FC = () => {
  const { t } = useLanguage();
  const { offers, listings, acceptOffer, declineOffer, counterOffer } = useApp();

  const [counterModalOffer, setCounterModalOffer] = useState<BuyerOffer | null>(null);
  const [counterPrice, setCounterPrice] = useState<string>('');
  const [counterNotes, setCounterNotes] = useState<string>('');

  const handleOpenCounterModal = (offer: BuyerOffer) => {
    setCounterModalOffer(offer);
    setCounterPrice(offer.originalAskingPriceRwf.toString());
    setCounterNotes('');
  };

  const handleSendCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterModalOffer) return;
    const priceNum = parseInt(counterPrice, 10);
    if (isNaN(priceNum) || priceNum <= 0) return;
    counterOffer(counterModalOffer.id, priceNum, counterNotes);
    setCounterModalOffer(null);
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          {t('offers.inboundTitle')}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {t('offers.inboundSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {offers.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
            <Handshake className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No inbound offers yet
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Once buyers browse your produce in the Nyagatare Marketplace and submit bids, they will appear here for your review and negotiation.
            </p>
          </div>
        ) : (
          offers.map((offer) => {
            const listing = listings.find((l) => l.id === offer.listingId);
            const isPending = offer.status === 'submitted' || offer.status === 'countered';

            return (
              <div
                key={offer.id}
                className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4 transition-colors"
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
                        {offer.status}
                      </span>
                      {offer.isDemo ? (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          DEMO
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          LIVE INQUIRY
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <span>Buyer: <strong className="text-stone-700 dark:text-stone-300">{offer.buyerName}</strong></span>
                      {offer.buyerCompany && <span>({offer.buyerCompany})</span>}
                      <span>·</span>
                      <span>Tel: {offer.buyerPhone}</span>
                    </div>
                  </div>

                  {/* Offered Value Calculations */}
                  <div className="sm:text-right">
                    <span className="text-xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400 block">
                      {offer.totalOfferedRwf.toLocaleString()} RWF
                    </span>
                    <span className="text-xs text-stone-500 font-mono tabular-nums">
                      {offer.requestedQuantityKg.toLocaleString()} kg @ {offer.offeredPricePerKgRwf} RWF/kg
                    </span>
                  </div>
                </div>

                {/* Offer Comparison Box */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Your Asking Price
                    </span>
                    <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200">
                      {offer.originalAskingPriceRwf} RWF/kg
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Buyer Bid Price
                    </span>
                    <span className="font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                      {offer.offeredPricePerKgRwf} RWF/kg
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Volume Desired
                    </span>
                    <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200">
                      {offer.requestedQuantityKg.toLocaleString()} kg
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">
                      Pickup Target
                    </span>
                    <span className="font-medium text-stone-700 dark:text-stone-300">
                      {offer.proposedPickupDate}
                    </span>
                  </div>
                </div>

                {/* Counter status detail if already sent */}
                {offer.status === 'countered' && offer.counterPricePerKgRwf && (
                  <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 text-xs">
                    <div className="font-semibold text-purple-900 dark:text-purple-300">
                      Your Counteroffer: {offer.counterPricePerKgRwf} RWF/kg
                    </div>
                    {offer.counterNotes && (
                      <p className="text-purple-800 dark:text-purple-400 italic mt-0.5">
                        "{offer.counterNotes}"
                      </p>
                    )}
                  </div>
                )}

                {offer.buyerNotes && (
                  <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-stone-50 dark:bg-stone-800/40 p-2.5 rounded">
                    Buyer Note: "{offer.buyerNotes}"
                  </p>
                )}

                {/* Action Buttons */}
                {isPending && (
                  <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => declineOffer(offer.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors"
                    >
                      {t('offers.decline')}
                    </button>

                    <button
                      onClick={() => handleOpenCounterModal(offer)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 rounded-lg border border-stone-300 dark:border-stone-700 transition-colors"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>{t('offers.counter')}</span>
                    </button>

                    <button
                      onClick={() => acceptOffer(offer.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t('offers.accept')}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Counteroffer Modal */}
      {counterModalOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50">
                {t('offers.counterModalTitle')}
              </h3>
              <button
                onClick={() => setCounterModalOffer(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-600 dark:text-stone-400">
              Crops: <strong>{counterModalOffer.listingCropName}</strong> for{' '}
              <strong>{counterModalOffer.requestedQuantityKg.toLocaleString()} kg</strong>.
              Buyer's bid was {counterModalOffer.offeredPricePerKgRwf} RWF/kg.
            </div>

            <form onSubmit={handleSendCounter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Counter Price (RWF per kg) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  placeholder={t('offers.counterPricePlaceholder')}
                  className="w-full px-3 py-2 text-sm bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Counter Terms / Notes
                </label>
                <textarea
                  rows={3}
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                  placeholder={t('offers.counterNotesPlaceholder')}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg text-xs flex justify-between">
                <span>Revised Total Payout:</span>
                <span className="font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                  {((parseInt(counterPrice, 10) || 0) * counterModalOffer.requestedQuantityKg).toLocaleString()} RWF
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterModalOffer(null)}
                  className="px-3.5 py-2 text-xs font-medium rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors"
                >
                  {t('offers.submitCounter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
