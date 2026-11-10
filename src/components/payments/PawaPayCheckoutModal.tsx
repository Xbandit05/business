import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  Lock,
  Receipt,
  Info,
} from 'lucide-react';
import { Order, PawaPayProvider } from '../../types/index.ts';

interface PawaPayCheckoutModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (orderId: string, depositId: string) => void;
}

export const PawaPayCheckoutModal: React.FC<PawaPayCheckoutModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [provider, setProvider] = useState<PawaPayProvider>('MTN_MOMO_RWA');
  const [phone, setPhone] = useState<string>(order.buyerPhone || '250783456789');
  const [customerName, setCustomerName] = useState<string>(order.buyerName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Flow State: 'form' | 'awaiting_approval' | 'completed' | 'failed'
  const [flowState, setFlowState] = useState<'form' | 'awaiting_approval' | 'completed' | 'failed'>('form');
  const [depositId, setDepositId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState<string | null>(null);
  const [providerTransactionId, setProviderTransactionId] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  // Auto-detect provider from phone prefix
  useEffect(() => {
    const clean = phone.replace(/[\s\+\-\(\)]/g, '');
    let check = clean;
    if (clean.startsWith('07')) check = '250' + clean.slice(1);
    else if (clean.startsWith('7') && clean.length === 9) check = '250' + clean;

    if (check.startsWith('25078') || check.startsWith('25079')) {
      setProvider('MTN_MOMO_RWA');
    } else if (check.startsWith('25072') || check.startsWith('25073')) {
      setProvider('AIRTEL_RWA');
    }
  }, [phone]);

  // Polling for status updates while in 'awaiting_approval'
  useEffect(() => {
    if (flowState !== 'awaiting_approval' || !depositId) return;

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        setPollCount((prev) => prev + 1);
        const res = await fetch(`/api/payments/pawapay/status/${depositId}`);
        if (!res.ok) return;
        const data = await res.json();

        if (!isMounted) return;

        if (data.status === 'COMPLETED' || data.status === 'SUCCESS') {
          setFlowState('completed');
          setProviderTransactionId(data.record?.providerTransactionId || data.payment?.providerTransactionRef || `PRV-${Date.now().toString().slice(-8)}`);
          clearInterval(interval);
          if (onPaymentSuccess) {
            onPaymentSuccess(order.id, depositId);
          }
        } else if (data.status === 'FAILED') {
          setFlowState('failed');
          setFailureReason(
            data.failureReason?.failureMessage ||
            data.failureReason?.failureCode ||
            'Subscriber declined or payment request failed.'
          );
          clearInterval(interval);
        }
      } catch (err) {
        console.warn('Error polling deposit status:', err);
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [flowState, depositId, order.id, onPaymentSuccess]);

  if (!isOpen) return null;

  const commissionFeeRwf = Math.round((Number(order.totalAmountRwf) * 0.025));
  const farmerNetPayoutRwf = Number(order.totalAmountRwf) - commissionFeeRwf;

  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/payments/pawapay/initiate-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          phone,
          correspondent: provider,
          customerName: customerName || order.buyerName,
          statementDescription: `AgriBridge ${order.orderNumber}`.slice(0, 22),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to initiate mobile money payment.');
      }

      setDepositId(data.depositId);
      setPaymentRef(data.reference);
      setFlowState('awaiting_approval');
      setPollCount(0);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment initiation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const setTestPhone = (num: string, prov: PawaPayProvider) => {
    setPhone(num);
    setProvider(prov);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg my-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                <span>PawaPay Mobile Money Checkout</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-semibold">
                  RWANDA v2
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Direct MTN Mobile Money & Airtel Money Settlement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Order Summary (Locked Amount) */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-xl border border-stone-200 dark:border-stone-700/60 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                  Contract Order
                </span>
                <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {order.orderNumber}
                </span>
                <div className="text-xs text-stone-600 dark:text-stone-300 mt-0.5">
                  {order.cropName} ({order.variety}) · {order.quantityKg.toLocaleString()} kg
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                  Verified Total
                </span>
                <span className="text-lg font-bold font-mono text-emerald-800 dark:text-emerald-400">
                  {Number(order.totalAmountRwf).toLocaleString()} RWF
                </span>
                <span className="text-[10px] text-stone-400 flex items-center gap-1 justify-end">
                  <Lock className="w-3 h-3 text-stone-400" /> Amount locked
                </span>
              </div>
            </div>

            {/* Split breakdown */}
            <div className="pt-2 border-t border-stone-200/60 dark:border-stone-700/60 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-stone-500">Platform Fee (2.5%):</span>{' '}
                <span className="font-mono font-medium text-stone-700 dark:text-stone-300">
                  {commissionFeeRwf.toLocaleString()} RWF
                </span>
              </div>
              <div className="text-right">
                <span className="text-stone-500">Farmer Escrow Payout:</span>{' '}
                <span className="font-mono font-medium text-emerald-700 dark:text-emerald-400">
                  {farmerNetPayoutRwf.toLocaleString()} RWF
                </span>
              </div>
            </div>
          </div>

          {/* STATE 1: FORM */}
          {flowState === 'form' && (
            <form onSubmit={handleInitiate} className="space-y-4">
              {/* Provider Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                  Select Mobile Money Operator (Rwanda)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProvider('MTN_MOMO_RWA')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      provider === 'MTN_MOMO_RWA'
                        ? 'border-yellow-500 bg-yellow-50/60 dark:bg-yellow-950/20 ring-2 ring-yellow-400/40 text-stone-900 dark:text-white'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center font-bold text-stone-900 text-xs shadow-2xs">
                      MTN
                    </div>
                    <div>
                      <div className="text-xs font-bold">MTN MoMo</div>
                      <div className="text-[10px] text-stone-500">Prefix: 078, 079</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProvider('AIRTEL_RWA')}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      provider === 'AIRTEL_RWA'
                        ? 'border-red-500 bg-red-50/60 dark:bg-red-950/20 ring-2 ring-red-400/40 text-stone-900 dark:text-white'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-xs shadow-2xs">
                      AIR
                    </div>
                    <div>
                      <div className="text-xs font-bold">Airtel Money</div>
                      <div className="text-[10px] text-stone-500">Prefix: 072, 073</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Payer Phone Number (MSISDN)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="250783456789 or 078..."
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-stone-500 mt-1">
                  Format: 12-digit number (e.g. 25078... or 078...). PawaPay will dispatch a USSD push prompt to this handset.
                </p>
              </div>

              {/* Official PawaPay Sandbox Test Pills */}
              <div className="p-3 bg-stone-100 dark:bg-stone-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-stone-400" />
                    PawaPay Official Sandbox Test Numbers:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Click to populate</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTestPhone('250783456789', 'MTN_MOMO_RWA')}
                    className="text-left px-2 py-1.5 rounded bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:border-emerald-500 text-[11px] text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <span className="font-mono font-bold block text-emerald-700 dark:text-emerald-400">
                      250783456789
                    </span>
                    <span className="text-[10px] text-stone-500">Auto-Approve (COMPLETED)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestPhone('250783456039', 'MTN_MOMO_RWA')}
                    className="text-left px-2 py-1.5 rounded bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:border-rose-500 text-[11px] text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <span className="font-mono font-bold block text-rose-600 dark:text-rose-400">
                      250783456039
                    </span>
                    <span className="text-[10px] text-stone-500">Decline Prompt (FAILED)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestPhone('250783456029', 'MTN_MOMO_RWA')}
                    className="text-left px-2 py-1.5 rounded bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:border-amber-500 text-[11px] text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <span className="font-mono font-bold block text-amber-600 dark:text-amber-400">
                      250783456029
                    </span>
                    <span className="text-[10px] text-stone-500">Not Found (PAYER_NOT_FOUND)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTestPhone('250783456129', 'MTN_MOMO_RWA')}
                    className="text-left px-2 py-1.5 rounded bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 hover:border-blue-500 text-[11px] text-stone-800 dark:text-stone-200 transition-colors"
                  >
                    <span className="font-mono font-bold block text-blue-600 dark:text-blue-400">
                      250783456129
                    </span>
                    <span className="text-[10px] text-stone-500">Awaiting Prompt (SUBMITTED)</span>
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-emerald-950 dark:text-emerald-200">
                  <span className="font-bold block">PIN Safety Assurance:</span>
                  AgriBridge never requests or collects your Mobile Money PIN on this website. You will enter your PIN privately on your mobile phone screen when prompted by telecom.
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-700/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Dispatching to PawaPay...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {Number(order.totalAmountRwf).toLocaleString()} RWF</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STATE 2: AWAITING APPROVAL (POLLING) */}
          {flowState === 'awaiting_approval' && (
            <div className="py-6 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center animate-pulse">
                  <Smartphone className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Payment Prompt Sent to Handset!
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-sm mx-auto">
                  A USSD authorization prompt was sent to{' '}
                  <span className="font-mono font-bold text-stone-900 dark:text-white">{phone}</span>. Please check your phone now and enter your PIN to approve.
                </p>
              </div>

              {/* Dial Code Guidance */}
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 max-w-sm mx-auto text-left text-xs space-y-1.5 font-mono">
                <div className="text-[11px] font-sans font-bold text-stone-500 uppercase">
                  Manual Approval Fallback:
                </div>
                {provider === 'MTN_MOMO_RWA' ? (
                  <div className="text-stone-800 dark:text-stone-200">
                    MTN Rwanda: Dial <span className="font-bold text-amber-600 dark:text-amber-400">*182*7*1#</span> to view pending approvals
                  </div>
                ) : (
                  <div className="text-stone-800 dark:text-stone-200">
                    Airtel Rwanda: Dial <span className="font-bold text-red-600 dark:text-red-400">*500*4#</span> to view pending approvals
                  </div>
                )}
                <div className="text-[10px] text-stone-400">
                  PawaPay Deposit ID: <span className="text-stone-600 dark:text-stone-300">{depositId}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-stone-500">
                <Clock className="w-3.5 h-3.5 text-stone-400 animate-spin" />
                <span>Listening for PawaPay webhook callback... ({pollCount * 2}s)</span>
              </div>
            </div>
          )}

          {/* STATE 3: COMPLETED */}
          {flowState === 'completed' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                  Payment Verified & Settled!
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 max-w-sm mx-auto">
                  PawaPay confirmed the mobile money deposit for{' '}
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {Number(order.totalAmountRwf).toLocaleString()} RWF
                  </span>
                  . Funds are now secured in AgriBridge escrow.
                </p>
              </div>

              <div className="p-4 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-stone-200 dark:border-stone-700 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-400">AgriBridge Ref:</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{paymentRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">PawaPay Deposit ID:</span>
                  <span className="text-stone-700 dark:text-stone-300 truncate max-w-[220px]">{depositId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Provider Trans ID:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{providerTransactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">Order Delivery Status:</span>
                  <span className="font-sans font-semibold text-stone-800 dark:text-stone-200 capitalize">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              >
                Close & Return to Orders
              </button>
            </div>
          )}

          {/* STATE 4: FAILED */}
          {flowState === 'failed' && (
            <div className="py-4 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  Payment Was Not Completed
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 max-w-sm mx-auto font-medium">
                  {failureReason}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  You can try again with a different number or verify your Mobile Money account balance.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setFlowState('form')}
                  className="px-5 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
