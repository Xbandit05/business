import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  PaymentRecord,
  PaymentStatus,
  PaymentMethod,
  PaymentAuditLogEntry,
  CommissionConfig,
} from '../../types/index.ts';
import {
  Wallet,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  FileText,
  Smartphone,
  Building2,
  CreditCard,
  History,
  Lock,
  Sliders,
  Check,
  ChevronDown,
} from 'lucide-react';

export const PaymentTerminalView: React.FC = () => {
  const { language } = useLanguage();
  const { orders, showToast, currentUser } = useApp();
  const isRw = language === 'rw';

  // Overview metrics state
  const [metrics, setMetrics] = useState<{
    totalRequests: number;
    pendingCount: number;
    processingCount: number;
    verifiedCount: number;
    failedCount: number;
    cancelledCount: number;
    expiredCount: number;
    refundedCount: number;
    partiallyPaidCount: number;
    underReviewCount: number;
    totalVerifiedValueRwf: number;
    totalOutstandingValueRwf: number;
    totalRecognizedCommissionRwf: number;
    totalFarmerPayoutRwf: number;
    currency: string;
    commissionRatePercent: number;
  } | null>(null);

  const [connectedProviders, setConnectedProviders] = useState<any[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isInitiateModalOpen, setIsInitiateModalOpen] = useState<boolean>(false);
  const [isReconcileModalOpen, setIsReconcileModalOpen] = useState<boolean>(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isCommissionDrawerOpen, setIsCommissionDrawerOpen] = useState<boolean>(false);
  const [isPawaPayModalOpen, setIsPawaPayModalOpen] = useState<boolean>(false);

  const [pawaPayConfig, setPawaPayConfig] = useState<any>(null);
  const [simDepositId, setSimDepositId] = useState<string>('');
  const [simStatus, setSimStatus] = useState<'COMPLETED' | 'FAILED'>('COMPLETED');
  const [simFailureCode, setSimFailureCode] = useState<string>('PAYMENT_NOT_APPROVED');
  const [isSubmittingSim, setIsSubmittingSim] = useState<boolean>(false);

  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [auditLogs, setAuditLogs] = useState<PaymentAuditLogEntry[]>([]);

  // Initiate Form state
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || 'ord_demo_1');
  const [initiateAmountRwf, setInitiateAmountRwf] = useState<number>(orders[0]?.totalAmountRwf || 720000);
  const [initiateMethod, setInitiateMethod] = useState<PaymentMethod>('momo_mtn');
  const [initiatePhone, setInitiatePhone] = useState<string>('+250 788 654 321');
  const [initiateDescription, setInitiateDescription] = useState<string>('Dry Red Kidney Beans (1,000 kg)');
  const [isSubmittingInitiate, setIsSubmittingInitiate] = useState<boolean>(false);

  // Reconcile Form state
  const [reconcileProofRef, setReconcileProofRef] = useState<string>('');
  const [reconcileNotes, setReconcileNotes] = useState<string>('');
  const [reconcileStatus, setReconcileStatus] = useState<PaymentStatus>('SUCCESS');
  const [isSubmittingReconcile, setIsSubmittingReconcile] = useState<boolean>(false);

  // Refund Form state
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [isSubmittingRefund, setIsSubmittingRefund] = useState<boolean>(false);

  // Commission Config state
  const [commissionConfig, setCommissionConfig] = useState<CommissionConfig>({
    ratePercent: 2.5,
    minimumFeeRwf: 500,
    maximumFeeRwf: 150000,
    providerFeeShare: 'deduct_from_marketplace',
    effectiveDate: new Date().toISOString(),
    updatedBy: 'IDRIS & MELODY',
  });

  // Fetch Overview Metrics & Payments
  const fetchOverviewAndPayments = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, paymentsRes, commRes, pawaConfigRes] = await Promise.all([
        fetch('/api/payments/overview'),
        fetch('/api/payments'),
        fetch('/api/payments/commission-config'),
        fetch('/api/payments/pawapay/config'),
      ]);

      if (overviewRes.ok) {
        const oData = await overviewRes.json();
        setMetrics(oData.metrics);
        setConnectedProviders(oData.systemStatus?.connectedProviders || []);
      }

      if (paymentsRes.ok) {
        const pData = await paymentsRes.json();
        setPayments(pData.payments || []);
      }

      if (commRes.ok) {
        const cData = await commRes.json();
        if (cData.config) setCommissionConfig(cData.config);
      }

      if (pawaConfigRes.ok) {
        const pConf = await pawaConfigRes.json();
        setPawaPayConfig(pConf);
      }
    } catch (err) {
      console.error('Failed to load payment terminal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverviewAndPayments();
  }, []);

  // Update amount when order selection changes in Initiate modal
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrderId(orderId);
    const order = orders.find((o) => o.id === orderId);
    if (order) {
      setInitiateAmountRwf(order.totalAmountRwf);
      setInitiateDescription(`Payment for Order ${order.orderNumber} - ${order.cropName}`);
      setInitiatePhone(order.buyerPhone || '+250 788 654 321');
    }
  };

  // Submit Payment Initiation
  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find((o) => o.id === selectedOrderId);
    if (!order) {
      showToast('warning', 'Order Required', 'Please select a valid order.');
      return;
    }

    setIsSubmittingInitiate(true);
    try {
      if (initiateMethod === 'momo_mtn' || initiateMethod === 'airtel_money') {
        const pawaRes = await fetch('/api/payments/pawapay/initiate-deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            phone: initiatePhone,
            correspondent: initiateMethod === 'momo_mtn' ? 'MTN_MOMO_RWA' : 'AIRTEL_RWA',
            customerName: order.buyerName,
            statementDescription: `AgriBridge ${order.orderNumber}`.slice(0, 22),
          }),
        });

        const pawaData = await pawaRes.json();
        if (pawaRes.ok) {
          showToast(
            'success',
            'PawaPay Deposit Initiated',
            `PawaPay deposit ${pawaData.depositId.slice(0, 8)}... created! USSD push sent to ${initiatePhone}.`
          );
          setIsInitiateModalOpen(false);
          fetchOverviewAndPayments();
          return;
        } else {
          showToast('warning', 'PawaPay Initiation Notice', pawaData.error || 'Initiation failed.');
          return;
        }
      }

      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.orderNumber,
          buyerId: order.buyerId,
          buyerName: order.buyerName,
          buyerPhone: initiatePhone,
          sellerId: order.farmerId,
          sellerName: order.farmerName,
          amountRwf: initiateAmountRwf,
          method: initiateMethod,
          customerPhone: initiatePhone,
          description: initiateDescription,
          idempotencyKey: `terminal_init_${Date.now()}_${order.id}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'success',
          'Payment Initiated',
          `Payment initiated successfully! Ref: ${data.payment.reference}. Prompt sent to ${initiatePhone}.`
        );
        setIsInitiateModalOpen(false);
        fetchOverviewAndPayments();
      } else {
        showToast('warning', 'Initiation Notice', data.error || 'Initiation failed.');
      }
    } catch (err: any) {
      showToast('warning', 'Network Error', `Network error: ${err.message}`);
    } finally {
      setIsSubmittingInitiate(false);
    }
  };

  // Poll live status from PawaPay v2 API
  const handleCheckPawaPayStatus = async (depositId: string) => {
    try {
      const res = await fetch(`/api/payments/pawapay/status/${depositId}`);
      const data = await res.json();
      if (res.ok) {
        showToast(
          'info',
          'PawaPay Status Inquiry',
          `Deposit ${depositId.slice(0, 8)}... status: ${data.status} ${data.live ? '(Live PawaPay API)' : '(Verified in Cache)'}`
        );
        fetchOverviewAndPayments();
      } else {
        showToast('warning', 'PawaPay Inquiry', data.error || 'Failed to query PawaPay status.');
      }
    } catch (err: any) {
      showToast('warning', 'Status Inquiry Failed', err.message);
    }
  };

  // Trigger Simulated PawaPay Webhook Callback
  const handleSimulateCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simDepositId) {
      showToast('warning', 'Deposit Required', 'Please select or enter a deposit ID.');
      return;
    }

    setIsSubmittingSim(true);
    try {
      const res = await fetch('/api/payments/pawapay/simulate-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          depositId: simDepositId,
          status: simStatus,
          failureCode: simFailureCode,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'success',
          'Callback Processed',
          `PawaPay webhook callback processed as ${simStatus} for deposit ${simDepositId.slice(0, 8)}...!`
        );
        fetchOverviewAndPayments();
      } else {
        showToast('warning', 'Simulation Failed', data.error || 'Failed to simulate callback.');
      }
    } catch (err: any) {
      showToast('warning', 'Simulation Error', err.message);
    } finally {
      setIsSubmittingSim(false);
    }
  };

  // Trigger Server-Side Provider Verification Check
  const handleVerifyPayment = async (payment: PaymentRecord) => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.id,
          reference: payment.reference,
          simulationResult: 'SUCCESS',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'success',
          'Verification Confirmed',
          `Payment ${payment.reference} successfully verified by telecom provider!`
        );
        fetchOverviewAndPayments();
      } else {
        showToast('warning', 'Verification Notice', data.error || 'Verification failed.');
      }
    } catch (err: any) {
      showToast('warning', 'Verification Error', `Verification error: ${err.message}`);
    }
  };

  // Open Reconcile Modal
  const handleOpenReconcile = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setReconcileProofRef(payment.supportingEvidenceRef || `BANK-SLIP-${Math.floor(10000 + Math.random() * 90000)}`);
    setReconcileNotes(payment.reconciliationNotes || 'Verified against bank ledger statement.');
    setReconcileStatus('SUCCESS');
    setIsReconcileModalOpen(true);
  };

  // Submit Manual Reconciliation
  const handleReconcileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsSubmittingReconcile(true);
    try {
      const res = await fetch('/api/payments/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          reference: selectedPayment.reference,
          proofReference: reconcileProofRef,
          reviewerName: currentUser?.fullName || 'IDRIS Agaba Otin (Compliance)',
          notes: reconcileNotes,
          targetStatus: reconcileStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'success',
          'Reconciliation Saved',
          `Payment ${selectedPayment.reference} reconciled successfully! Status updated to ${reconcileStatus}.`
        );
        setIsReconcileModalOpen(false);
        fetchOverviewAndPayments();
      } else {
        showToast('warning', 'Reconciliation Notice', data.error || 'Reconciliation failed.');
      }
    } catch (err: any) {
      showToast('warning', 'Reconciliation Error', `Reconciliation error: ${err.message}`);
    } finally {
      setIsSubmittingReconcile(false);
    }
  };

  // Open Refund Modal
  const handleOpenRefund = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setRefundAmount(payment.amountRwf);
    setRefundReason('Grain delivery moisture exceeded 13.5% threshold per MINAGRI grade rules');
    setIsRefundModalOpen(true);
  };

  // Submit Refund
  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsSubmittingRefund(true);
    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: selectedPayment.id,
          reference: selectedPayment.reference,
          refundAmountRwf: refundAmount,
          refundReason,
          actorName: currentUser?.fullName || 'IDRIS Agaba Otin (Marketplace Admin)',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          'success',
          'Refund Processed',
          `Refund processed for ${selectedPayment.reference}. Marketplace commission reversed.`
        );
        setIsRefundModalOpen(false);
        fetchOverviewAndPayments();
      } else {
        showToast('warning', 'Refund Notice', data.error || 'Refund failed.');
      }
    } catch (err: any) {
      showToast('warning', 'Refund Error', `Refund error: ${err.message}`);
    } finally {
      setIsSubmittingRefund(false);
    }
  };

  // View Audit Log
  const handleOpenAuditModal = async (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    try {
      const res = await fetch(`/api/payments/audit-log?paymentId=${payment.id}`);
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
    setIsAuditModalOpen(true);
  };

  // Filtered Payments
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.method === methodFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerPhone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesMethod && matchesSearch;
  });

  // Status Badge Helper
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>SUCCESS</span>
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="w-3 h-3" />
            <span>PENDING</span>
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <AlertTriangle className="w-3 h-3" />
            <span>UNDER REVIEW</span>
          </span>
        );
      case 'PARTIALLY_PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300">
            <DollarSign className="w-3 h-3" />
            <span>PARTIALLY PAID</span>
          </span>
        );
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            <ArrowDownLeft className="w-3 h-3" />
            <span>REFUNDED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
            <XCircle className="w-3 h-3" />
            <span>FAILED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
            {status}
          </span>
        );
    }
  };

  // Method Icon Helper
  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'momo_mtn':
      case 'airtel_money':
        return <Smartphone className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />;
      case 'bank_transfer':
        return <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      default:
        return <CreditCard className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Terminal Header & Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>AgriBridge Escrow &amp; Financial Settlement</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {isRw ? 'Ihuriro ryo Kwemeza Ubwishyu' : 'AgriBridge Payment Verification Terminal'}
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Real-time digital payment processing, cryptographic webhook verification, manual bank reconciliation, and transparent 2.5% marketplace commission tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPawaPayModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            <span>PawaPay Gateway &amp; Simulator</span>
          </button>

          <button
            onClick={() => setIsCommissionDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Commission ({commissionConfig.ratePercent}%)</span>
          </button>

          <button
            onClick={fetchOverviewAndPayments}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={() => setIsInitiateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isRw ? 'Tangiza Ubwishyu' : 'Initiate Payment'}</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <span>Verified Value (Settled)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-50 mt-1.5">
            {metrics?.totalVerifiedValueRwf.toLocaleString() || '0'} <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">RWF</span>
          </div>
          <div className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <span>{metrics?.verifiedCount || 0} verified transactions</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <span>Outstanding / In Review</span>
            <Clock className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-50 mt-1.5">
            {metrics?.totalOutstandingValueRwf.toLocaleString() || '0'} <span className="text-xs font-semibold text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-1 flex items-center gap-1">
            <span>{(metrics?.pendingCount || 0) + (metrics?.underReviewCount || 0)} awaiting clearing</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <span>Recognized Commission (2.5%)</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-50 mt-1.5">
            {metrics?.totalRecognizedCommissionRwf.toLocaleString() || '0'} <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            Recognized only upon verified settlement
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-[11px] font-medium text-stone-500 dark:text-stone-400">
            <span>Farmer Net Payouts</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-800 dark:text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-50 mt-1.5">
            {metrics?.totalFarmerPayoutRwf.toLocaleString() || '0'} <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
            Directly disbursed to verified farmers
          </div>
        </div>
      </div>

      {/* 3. Real-Time Telecom & Banking Provider Status */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span>Payment Provider Gateways:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {connectedProviders.map((provider) => (
            <div
              key={provider.id}
              className="px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-stone-800 dark:text-stone-200 text-[11px]">
                {provider.name}
              </span>
              <span className="text-[10px] text-stone-400 font-mono">{provider.latencyMs}ms</span>
            </div>
          ))}

          <div className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
            <Lock className="w-3 h-3" />
            <span>HMAC-SHA256 Webhook Active</span>
          </div>
        </div>
      </div>

      {/* 4. Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, order, payer phone, name..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 pl-3 pr-8 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 appearance-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">Verified (SUCCESS)</option>
              <option value="PENDING">Pending (PENDING)</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="PARTIALLY_PAID">Partially Paid</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Failed</option>
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs py-2 pl-3 pr-8 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 appearance-none cursor-pointer"
            >
              <option value="ALL">All Methods</option>
              <option value="momo_mtn">MTN MoMo</option>
              <option value="airtel_money">Airtel Money</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 5. Payment Transaction Ledger Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 text-[11px] font-semibold text-stone-600 dark:text-stone-300 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Payment Ref</th>
                <th className="py-3 px-4">Order &amp; Crop</th>
                <th className="py-3 px-4">Payer / Buyer</th>
                <th className="py-3 px-4">Total (RWF)</th>
                <th className="py-3 px-4">Commission (2.5%)</th>
                <th className="py-3 px-4">Net Payout</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-semibold text-stone-900 dark:text-stone-100">
                    <div>{p.reference}</div>
                    {p.pawapayDepositId && (
                      <div className="mt-0.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          PawaPay: {p.pawapayDepositId.slice(0, 8)}...
                        </span>
                      </div>
                    )}
                    <div className="text-[10px] text-stone-400 font-normal">
                      {new Date(p.initiatedAt).toLocaleDateString()} {new Date(p.initiatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{p.orderNumber}</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate max-w-xs">{p.description}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{p.buyerName}</div>
                    <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400">{p.customerPhone}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-stone-100 font-mono">
                    {p.amountRwf.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-emerald-800 dark:text-emerald-400 font-semibold">
                    +{p.marketplaceFeeRwf.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-stone-700 dark:text-stone-300 font-medium">
                    {p.farmerPayoutRwf.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      {getMethodIcon(p.method)}
                      <span className="font-medium truncate max-w-[120px]">{p.methodName}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">{getStatusBadge(p.status)}</td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.pawapayDepositId && (
                        <button
                          onClick={() => handleCheckPawaPayStatus(p.pawapayDepositId!)}
                          className="p-1 rounded-lg text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer transition-colors"
                          title="Query live PawaPay API for status"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}

                      {p.status === 'PENDING' && (
                        <button
                          onClick={() => handleVerifyPayment(p)}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer transition-colors"
                          title="Verify callback with payment provider"
                        >
                          Verify
                        </button>
                      )}

                      {(p.status === 'PENDING' || p.status === 'UNDER_REVIEW' || p.status === 'PARTIALLY_PAID') && (
                        <button
                          onClick={() => handleOpenReconcile(p)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer transition-colors"
                          title="Reconcile against bank/MoMo statement proof"
                        >
                          Reconcile
                        </button>
                      )}

                      {p.status === 'SUCCESS' && (
                        <button
                          onClick={() => handleOpenRefund(p)}
                          className="px-2 py-1 text-[11px] font-medium rounded-lg text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer transition-colors"
                          title="Authorize refund per arbitration"
                        >
                          Refund
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenAuditModal(p)}
                        className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
                        title="View append-only audit trail"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-xs text-stone-500 dark:text-stone-400">
                    No payment records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Modal: Initiate Payment */}
      {isInitiateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>Initiate Marketplace Payment</span>
              </h3>
              <button
                onClick={() => setIsInitiateModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInitiatePayment} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Select Verified Order <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => handleOrderSelect(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber} - {o.cropName} ({o.totalAmountRwf.toLocaleString()} RWF)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Amount (RWF) <span className="text-xs text-stone-400 font-normal">(Verified)</span>
                  </label>
                  <input
                    type="number"
                    value={initiateAmountRwf}
                    readOnly
                    className="w-full font-mono text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Payment Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={initiateMethod}
                    onChange={(e) => setInitiateMethod(e.target.value as PaymentMethod)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  >
                    <option value="momo_mtn">MTN Mobile Money Rwanda (*182#)</option>
                    <option value="airtel_money">Airtel Money Rwanda (*500#)</option>
                    <option value="bank_transfer">Bank Transfer (BK / BPR / Equity)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Payer Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={initiatePhone}
                  onChange={(e) => setInitiatePhone(e.target.value)}
                  placeholder="+250 788 000 000"
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-700/30"
                />
              </div>

              {/* Commission Calculation Preview */}
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1.5">
                <div className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] uppercase tracking-wide">
                  Financial Settlement Breakdown:
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Gross Order Value:</span>
                  <span className="font-mono font-semibold">{initiateAmountRwf.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-400">
                  <span>Marketplace Commission (2.5%):</span>
                  <span className="font-mono font-semibold">-{Math.round(initiateAmountRwf * 0.025).toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-stone-500 dark:text-stone-400 text-[11px]">
                  <span>Telecom / Processing Fee (Est):</span>
                  <span className="font-mono">-{Math.round(initiateAmountRwf * 0.005).toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 dark:text-stone-100 pt-1 border-t border-stone-200 dark:border-stone-700">
                  <span>Net Farmer Disbursal:</span>
                  <span className="font-mono text-emerald-800 dark:text-emerald-400">
                    {(initiateAmountRwf - Math.round(initiateAmountRwf * 0.025)).toLocaleString()} RWF
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsInitiateModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingInitiate}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmittingInitiate ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Smartphone className="w-3.5 h-3.5" />}
                  <span>{isSubmittingInitiate ? 'Initiating...' : 'Dispatch Payment Prompt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal: Manual Reconciliation */}
      {isReconcileModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>Reconcile Payment ({selectedPayment.reference})</span>
              </h3>
              <button
                onClick={() => setIsReconcileModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReconcileSubmit} className="space-y-3.5">
              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Order Reference:</span>
                  <span className="font-semibold">{selectedPayment.orderNumber}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300 mt-1">
                  <span>Expected Total:</span>
                  <span className="font-bold font-mono">{selectedPayment.amountRwf.toLocaleString()} RWF</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Bank / Telecom Receipt Proof Reference <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={reconcileProofRef}
                  onChange={(e) => setReconcileProofRef(e.target.value)}
                  placeholder="e.g. BK-SLIP-449102 or SMS-MTN-881290"
                  required
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Target Reconciled Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={reconcileStatus}
                  onChange={(e) => setReconcileStatus(e.target.value as PaymentStatus)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="SUCCESS">Fully Verified (SUCCESS)</option>
                  <option value="PARTIALLY_PAID">Partially Paid (PARTIALLY_PAID)</option>
                  <option value="UNDER_REVIEW">Keep Under Compliance Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Reviewer Audit Note <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={reconcileNotes}
                  onChange={(e) => setReconcileNotes(e.target.value)}
                  required
                  placeholder="Cross-referenced against corporate bank statement line..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsReconcileModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReconcile}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
                >
                  {isSubmittingReconcile ? 'Saving...' : 'Commit Reconciliation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Modal: Refund Authorization */}
      {isRefundModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Authorize Refund ({selectedPayment.reference})</span>
              </h3>
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} className="space-y-3.5">
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Authorizing this refund will return funds to the buyer and automatically reverse recognized marketplace commission.
              </p>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Refund Amount (RWF)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  required
                  className="w-full font-mono text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Arbitration &amp; Reversal Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  required
                  placeholder="e.g. Moisture test exceeded 13.5% threshold per MINAGRI grade standard..."
                  className="w-full text-xs p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsRefundModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRefund}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-700 hover:bg-amber-800 text-white shadow-xs"
                >
                  {isSubmittingRefund ? 'Processing...' : 'Authorize Reversal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Modal: Immutable Chronological Audit Trail */}
      {isAuditModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <History className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                  <span>Payment Audit Ledger ({selectedPayment.reference})</span>
                </h3>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Append-only immutable event log
                </span>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-600 dark:text-stone-300">
                    <span className="font-medium text-emerald-800 dark:text-emerald-400">{log.actorName}</span>
                    <span>&middot;</span>
                    <span className="font-mono">
                      {log.previousStatus} &rarr; {log.newStatus}
                    </span>
                  </div>

                  {log.reason && (
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 italic">
                      "{log.reason}"
                    </p>
                  )}

                  {log.evidenceRef && (
                    <div className="text-[10px] text-stone-400 font-mono">
                      Evidence Ref: {log.evidenceRef}
                    </div>
                  )}
                </div>
              ))}

              {auditLogs.length === 0 && (
                <div className="py-6 text-center text-xs text-stone-500">
                  No additional audit entries recorded for this payment yet.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 dark:hover:bg-stone-700"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. Drawer: Commission & Settlement Configuration */}
      {isCommissionDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
                <span>Marketplace Commission Configuration</span>
              </h3>
              <button
                onClick={() => setIsCommissionDrawerOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Commission Rate (% of Order Value)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={commissionConfig.ratePercent}
                    onChange={(e) =>
                      setCommissionConfig({ ...commissionConfig, ratePercent: Number(e.target.value) })
                    }
                    className="w-full font-mono text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                  <span className="font-bold text-stone-600 dark:text-stone-400">%</span>
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Default: 2.5% standard marketplace facilitation fee</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Minimum Fee (RWF)
                </label>
                <input
                  type="number"
                  value={commissionConfig.minimumFeeRwf}
                  onChange={(e) =>
                    setCommissionConfig({ ...commissionConfig, minimumFeeRwf: Number(e.target.value) })
                  }
                  className="w-full font-mono text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Provider Fee Share
                </label>
                <select
                  value={commissionConfig.providerFeeShare}
                  onChange={(e) =>
                    setCommissionConfig({ ...commissionConfig, providerFeeShare: e.target.value as any })
                  }
                  className="w-full text-xs py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                >
                  <option value="deduct_from_marketplace">Absorb into marketplace commission (Farmer receives full net)</option>
                  <option value="deduct_from_seller">Deduct from farmer payout</option>
                  <option value="add_to_buyer">Add surcharge to buyer checkout</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-500 dark:text-stone-400 text-[11px]">
                Last updated by: <span className="font-semibold text-stone-800 dark:text-stone-200">{commissionConfig.updatedBy}</span>. Effective since {new Date(commissionConfig.effectiveDate).toLocaleDateString()}.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCommissionDrawerOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch('/api/payments/commission-config', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          ratePercent: commissionConfig.ratePercent,
                          minimumFeeRwf: commissionConfig.minimumFeeRwf,
                          providerFeeShare: commissionConfig.providerFeeShare,
                          updatedBy: currentUser?.fullName || 'IDRIS & MELODY (Admin)',
                        }),
                      });
                      if (res.ok) {
                        showToast('success', 'Configuration Saved', 'Commission configuration updated!');
                        setIsCommissionDrawerOpen(false);
                        fetchOverviewAndPayments();
                      }
                    } catch (err: any) {
                      showToast('warning', 'Configuration Error', 'Failed to update commission.');
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white shadow-xs"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. PAWAPAY RWANDA GATEWAY & SANDBOX SIMULATOR MODAL */}
      {isPawaPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                    <span>PawaPay Rwanda Gateway &amp; Sandbox Simulator</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-800">
                      v2 API
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    MTN Mobile Money Rwanda &amp; Airtel Money Rwanda Integration Control
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPawaPayModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Configuration Status Box */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60 space-y-3 font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-700">
                  <span className="font-sans font-bold text-stone-800 dark:text-stone-200">Gateway Configuration Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      pawaPayConfig?.configured
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {pawaPayConfig?.configured ? 'LIVE TOKEN ACTIVE' : 'OFFICIAL SANDBOX HARNESS'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block">Environment:</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200 uppercase">
                      {pawaPayConfig?.environment || 'sandbox'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Base URL:</span>
                    <span className="text-stone-700 dark:text-stone-300 truncate block">
                      {pawaPayConfig?.baseUrl || 'https://api.sandbox.pawapay.io'}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-stone-400 block">Webhook Callback URL:</span>
                    <span className="text-emerald-700 dark:text-emerald-400 break-all block">
                      {pawaPayConfig?.callbackUrl || 'POST /api/payments/pawapay/callback'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Supported Correspondents in Rwanda */}
              <div>
                <h4 className="font-bold text-stone-800 dark:text-stone-200 mb-2 font-sans">
                  Supported Rwanda Mobile Money Correspondents:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-yellow-300 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800/60">
                    <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">MTN Mobile Money Rwanda</div>
                    <div className="font-mono text-[11px] text-stone-600 dark:text-stone-400 mt-1">Code: MTN_MOMO_RWA</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Prefixes: 078, 079 · Approval: *182*7*1#</div>
                  </div>

                  <div className="p-3 rounded-xl border border-red-300 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800/60">
                    <div className="font-bold text-stone-900 dark:text-stone-100 text-xs">Airtel Money Rwanda</div>
                    <div className="font-mono text-[11px] text-stone-600 dark:text-stone-400 mt-1">Code: AIRTEL_RWA</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">Prefixes: 072, 073 · Approval: *500*4#</div>
                  </div>
                </div>
              </div>

              {/* Sandbox Webhook Callback Simulator Form */}
              <div className="p-4 rounded-xl border border-emerald-300/80 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h4 className="font-bold text-stone-900 dark:text-stone-100 font-sans">
                    PawaPay Webhook Callback Testing Simulator
                  </h4>
                </div>
                <p className="text-stone-600 dark:text-stone-400 text-[11px]">
                  Simulates incoming HTTP POST callbacks from PawaPay to test status transitions, escrow settlement, and duplicate prevention.
                </p>

                <form onSubmit={handleSimulateCallback} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                      Target Deposit ID:
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={simDepositId}
                        onChange={(e) => setSimDepositId(e.target.value)}
                        className="flex-1 py-1.5 px-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs"
                      >
                        <option value="">-- Select an active deposit or enter below --</option>
                        {payments
                          .filter((p) => p.pawapayDepositId)
                          .map((p) => (
                            <option key={p.id} value={p.pawapayDepositId}>
                              {p.pawapayDepositId?.slice(0, 10)}... ({p.orderNumber} - {p.status})
                            </option>
                          ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      value={simDepositId}
                      onChange={(e) => setSimDepositId(e.target.value)}
                      placeholder="Or enter custom UUID depositId..."
                      className="mt-1.5 w-full py-1.5 px-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                        Callback Status Outcome:
                      </label>
                      <select
                        value={simStatus}
                        onChange={(e) => setSimStatus(e.target.value as any)}
                        className="w-full py-1.5 px-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                      >
                        <option value="COMPLETED">COMPLETED (Handset Approved)</option>
                        <option value="FAILED">FAILED (Subscriber Declined / Invalid)</option>
                      </select>
                    </div>

                    {simStatus === 'FAILED' && (
                      <div>
                        <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">
                          Failure Reason Code:
                        </label>
                        <select
                          value={simFailureCode}
                          onChange={(e) => setSimFailureCode(e.target.value)}
                          className="w-full py-1.5 px-3 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
                        >
                          <option value="PAYMENT_NOT_APPROVED">PAYMENT_NOT_APPROVED</option>
                          <option value="PAYER_NOT_FOUND">PAYER_NOT_FOUND</option>
                          <option value="INSUFFICIENT_FUNDS">INSUFFICIENT_FUNDS</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingSim || !simDepositId}
                      className="px-4 py-2 font-bold text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isSubmittingSim ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Dispatching Webhook...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Dispatch Simulated Webhook</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPawaPayModalOpen(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-800 dark:text-stone-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
