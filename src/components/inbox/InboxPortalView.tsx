import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  DollarSign,
  Tag,
  ShieldCheck,
  FileText,
  User,
  Phone,
  MapPin,
  Building2,
  AlertCircle,
  X,
  CreditCard,
  ChevronLeft,
  Sparkles,
  Percent,
  Check,
  ArrowDownRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { NegotiationThread, Order, ProduceListing } from '../../types/index.ts';
import { PawaPayCheckoutModal } from '../payments/PawaPayCheckoutModal.tsx';

interface InboxPortalViewProps {
  onNavigateTab?: (tab: string) => void;
}

export const InboxPortalView: React.FC<InboxPortalViewProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    role,
    negotiationThreads,
    activeThreadId,
    setActiveThreadId,
    sendMessageInThread,
    respondToProposal,
    convertThreadToOrder,
    orders,
    listings,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'negotiating' | 'price_agreed' | 'order_created'>('all');
  const [mobileShowChat, setMobileShowChat] = useState(false);

  // Message input state
  const [inputMessage, setInputMessage] = useState('');

  // Propose / Counter Price Modal State
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalMode, setProposalMode] = useState<'new' | 'counter'>('new');
  const [proposedPricePerKg, setProposedPricePerKg] = useState<number>(0);
  const [proposedQuantityKg, setProposedQuantityKg] = useState<number>(0);
  const [proposedDeliveryOption, setProposedDeliveryOption] = useState<string>('Nyagatare Aggregation Center');
  const [proposalNotes, setProposalNotes] = useState<string>('');

  // PawaPay Checkout Modal state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState<Order | null>(null);

  // Filtered threads
  const filteredThreads = useMemo(() => {
    return negotiationThreads.filter((thread) => {
      const matchesSearch =
        thread.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.variety.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (thread.farmerSector && thread.farmerSector.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || thread.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [negotiationThreads, searchQuery, statusFilter]);

  // Current selected thread
  const activeThread = useMemo(() => {
    return (
      negotiationThreads.find((t) => t.id === activeThreadId) ||
      filteredThreads[0] ||
      negotiationThreads[0] ||
      null
    );
  }, [negotiationThreads, activeThreadId, filteredThreads]);

  // Associated produce listing if available
  const associatedListing: ProduceListing | undefined = useMemo(() => {
    if (!activeThread) return undefined;
    return listings.find((l) => l.id === activeThread.listingId);
  }, [activeThread, listings]);

  // Check if current user is considered the farmer or the buyer in active thread
  const isUserFarmerInThread = useMemo(() => {
    if (!activeThread) return false;
    return (
      role === 'farmer' ||
      currentUser.id === activeThread.farmerId ||
      currentUser.fullName.toLowerCase() === activeThread.farmerName.toLowerCase()
    );
  }, [activeThread, role, currentUser]);

  // Handle selecting thread
  const handleSelectThread = (thread: NegotiationThread) => {
    setActiveThreadId(thread.id);
    setMobileShowChat(true);
  };

  // Open proposal modal prefilled
  const openProposalModal = (mode: 'new' | 'counter', defaultPrice?: number, defaultQty?: number) => {
    if (!activeThread) return;
    setProposalMode(mode);
    const initialPrice =
      defaultPrice ||
      (activeThread.latestPriceProposal ? activeThread.latestPriceProposal.proposedPricePerKgRwf : activeThread.currentAgreedPricePerKgRwf) ||
      activeThread.listingUnitPriceRwf;

    const initialQty =
      defaultQty ||
      (activeThread.latestPriceProposal ? activeThread.latestPriceProposal.requestedQuantityKg : activeThread.minimumOrderKg) ||
      500;

    setProposedPricePerKg(initialPrice);
    setProposedQuantityKg(initialQty);
    setProposedDeliveryOption(activeThread.deliveryOption || 'Nyagatare Aggregation Center');
    setProposalNotes(mode === 'counter' ? 'Counter-offer based on market benchmark and transport logistics.' : '');
    setIsProposalModalOpen(true);
  };

  // Quick discount calculator
  const applyQuickDiscount = (percentage: number) => {
    if (!activeThread) return;
    const basePrice = activeThread.listingUnitPriceRwf;
    const discounted = Math.round(basePrice * (1 - percentage / 100));
    setProposedPricePerKg(discounted);
  };

  // Send plain message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !activeThread) return;
    sendMessageInThread(activeThread.id, inputMessage.trim());
    setInputMessage('');
  };

  // Submit Price Proposal
  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread) return;

    if (proposedPricePerKg <= 0 || proposedQuantityKg <= 0) {
      alert('Please enter valid positive values for price and quantity.');
      return;
    }

    if (proposalMode === 'counter' && activeThread.latestPriceProposal) {
      respondToProposal(
        activeThread.id,
        activeThread.latestPriceProposal.id,
        'counter',
        proposedPricePerKg,
        proposedQuantityKg,
        proposalNotes || undefined
      );
    } else {
      const content = `${isUserFarmerInThread ? 'Farmer' : 'Buyer'} proposed ${proposedPricePerKg.toLocaleString()} RWF/kg for ${proposedQuantityKg.toLocaleString()} kg.${proposalNotes ? ` Note: "${proposalNotes}"` : ''}`;
      sendMessageInThread(activeThread.id, content, {
        offeredPricePerKg: proposedPricePerKg,
        offeredQuantityKg: proposedQuantityKg,
        deliveryOption: proposedDeliveryOption,
        termsNotes: proposalNotes || undefined,
      });
    }

    setIsProposalModalOpen(false);
  };

  // Handle Accept Proposal
  const handleAcceptProposal = (proposalId: string) => {
    if (!activeThread) return;
    respondToProposal(activeThread.id, proposalId, 'accept');
  };

  // Handle Decline Proposal
  const handleDeclineProposal = (proposalId: string) => {
    if (!activeThread) return;
    respondToProposal(activeThread.id, proposalId, 'decline');
  };

  // Convert to order and open PawaPay MoMo modal
  const handleCreateOrderAndPay = () => {
    if (!activeThread) return;
    const generatedOrder = convertThreadToOrder(activeThread.id);
    if (generatedOrder) {
      setCheckoutOrder(generatedOrder);
      setCheckoutModalOpen(true);
    }
  };

  // Pay existing order if already created
  const handlePayExistingOrder = () => {
    if (!activeThread || !activeThread.orderId) return;
    const found = orders.find((o) => o.id === activeThread.orderId);
    if (found) {
      setCheckoutOrder(found);
      setCheckoutModalOpen(true);
    } else {
      // Create order representation
      const synthOrder: Order = {
        id: activeThread.orderId,
        buyerId: activeThread.buyerId,
        buyerName: activeThread.buyerName,
        buyerPhone: activeThread.buyerPhone,
        sellerId: activeThread.farmerId,
        sellerName: activeThread.farmerName,
        cropType: (activeThread.cropType || 'maize') as any,
        variety: activeThread.variety,
        quantityKg: activeThread.latestPriceProposal?.requestedQuantityKg || activeThread.minimumOrderKg || 500,
        pricePerKgRwf: activeThread.currentAgreedPricePerKgRwf || activeThread.listingUnitPriceRwf,
        totalAmountRwf:
          (activeThread.currentAgreedPricePerKgRwf || activeThread.listingUnitPriceRwf) *
          (activeThread.latestPriceProposal?.requestedQuantityKg || activeThread.minimumOrderKg || 500),
        status: 'pending',
        commissionStatus: 'pending',
        commissionAmountRwf: Math.round(
          (activeThread.currentAgreedPricePerKgRwf || activeThread.listingUnitPriceRwf) *
            (activeThread.latestPriceProposal?.requestedQuantityKg || activeThread.minimumOrderKg || 500) *
            0.025
        ),
        deliveryLocation: activeThread.deliveryOption,
        pickupDate: new Date().toISOString().split('T')[0],
        isDemo: false,
        createdAt: new Date().toISOString(),
      };
      setCheckoutOrder(synthOrder);
      setCheckoutModalOpen(true);
    }
  };

  // Calculations for proposal modal live preview
  const proposalSubtotal = proposedPricePerKg * proposedQuantityKg;
  const proposalPlatformFee = Math.round(proposalSubtotal * 0.025);
  const proposalGrandTotal = proposalSubtotal + proposalPlatformFee;
  const askingPriceSubtotal = activeThread ? activeThread.listingUnitPriceRwf * proposedQuantityKg : 0;
  const totalBuyerSavings = askingPriceSubtotal - proposalSubtotal;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 text-white rounded-2xl p-6 shadow-lg border border-emerald-700/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-xs font-semibold text-emerald-100 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ikinyarwanda: Ubutumwa n'Ibiganiro by'Ibiciro</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Direct Price Negotiation Inbox
          </h1>
          <p className="text-emerald-100/90 text-sm max-w-2xl mt-1">
            Negotiate fair produce rates directly with registered Nyagatare farmers before placing orders. All deals lock into secure PawaPay Mobile Money escrow with transparent 2.5% platform protection.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all shadow-sm"
            >
              <Tag className="w-4 h-4 text-emerald-300" />
              <span>Browse Marketplace</span>
            </button>
          )}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('directory')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-sm font-bold shadow-md transition-all"
            >
              <User className="w-4 h-4" />
              <span>Meet More Farmers</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Dual-Pane Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[720px] flex flex-col lg:flex-row">
        {/* ======================================================== */}
        {/* LEFT PANE: Conversation & Negotiation Thread List        */}
        {/* ======================================================== */}
        <div
          className={`lg:w-80 xl:w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50 ${
            mobileShowChat ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Search & Filter Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search crop, farmer, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                All ({negotiationThreads.length})
              </button>
              <button
                onClick={() => setStatusFilter('negotiating')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === 'negotiating'
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Negotiating
              </button>
              <button
                onClick={() => setStatusFilter('price_agreed')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === 'price_agreed'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Agreed
              </button>
              <button
                onClick={() => setStatusFilter('order_created')}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  statusFilter === 'order_created'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          {/* Thread List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium">No negotiations match filter</p>
                <p className="text-xs text-slate-400 mt-1">
                  Start a new negotiation from any marketplace produce card or directory listing.
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => {
                const isSelected = activeThread?.id === thread.id;
                const unreadCount = isUserFarmerInThread
                  ? thread.unreadCountFarmer || 0
                  : thread.unreadCountBuyer || 0;

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleSelectThread(thread)}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      isSelected
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/20 border-l-emerald-600'
                        : 'hover:bg-slate-100/60 dark:hover:bg-slate-800/40 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
                          {thread.farmerName.slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate flex items-center gap-1.5">
                            <span>{thread.farmerName}</span>
                            <span className="text-[10px] font-normal text-slate-400">
                              ({thread.farmerSector || 'Nyagatare'})
                            </span>
                          </h4>
                          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 truncate">
                            {thread.cropName}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          thread.status === 'price_agreed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : thread.status === 'order_created'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {thread.status === 'price_agreed'
                          ? 'Deal Agreed'
                          : thread.status === 'order_created'
                          ? 'Order Placed'
                          : 'Negotiating'}
                      </span>
                    </div>

                    {/* Price Snapshot */}
                    <div className="mt-2.5 flex items-center justify-between text-xs bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
                      <div className="text-slate-500 dark:text-slate-400">
                        Ask: <span className="line-through text-slate-400">{thread.listingUnitPriceRwf} RWF</span>
                      </div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">
                        Bid: {(thread.currentAgreedPricePerKgRwf || thread.listingUnitPriceRwf).toLocaleString()} RWF/kg
                      </div>
                    </div>

                    {/* Snippet & Time */}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <p className="truncate max-w-[190px] italic">
                        "{thread.latestMessageSnippet || 'Negotiation opened'}"
                      </p>
                      {unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT PANE: Interactive Negotiation & Chat Stream        */}
        {/* ======================================================== */}
        <div
          className={`flex-1 flex flex-col bg-white dark:bg-slate-900 ${
            !mobileShowChat ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {activeThread ? (
            <>
              {/* Header: Farmer Info & Mobile Back Button */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="lg:hidden p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-green-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    {activeThread.farmerName.slice(0, 2)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate">
                        {activeThread.farmerName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium shrink-0">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        Verified Producer
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {activeThread.farmerSector || 'Nyagatare'}, {activeThread.farmerDistrict || 'Nyagatare'}
                      </span>
                      {activeThread.farmerPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {activeThread.farmerPhone}
                        </span>
                      )}
                      {activeThread.farmerCoop && (
                        <span className="hidden sm:flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {activeThread.farmerCoop}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="text-right shrink-0">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      activeThread.status === 'price_agreed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-300'
                        : activeThread.status === 'order_created'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {activeThread.status === 'price_agreed'
                        ? 'Price Agreed'
                        : activeThread.status === 'order_created'
                        ? 'Order Created'
                        : 'Active Negotiation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sticky Price & Escrow Summary Bar */}
              <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 border-b border-emerald-200 dark:border-slate-700 px-4 py-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Commodity: </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {activeThread.cropName}
                      </span>
                    </div>

                    <div className="h-3 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />

                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Farmer Ask: </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 line-through">
                        {activeThread.listingUnitPriceRwf.toLocaleString()} RWF/kg
                      </span>
                    </div>

                    <div className="h-3 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />

                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Negotiated Rate: </span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                        {(activeThread.currentAgreedPricePerKgRwf || activeThread.listingUnitPriceRwf).toLocaleString()}{' '}
                        RWF/kg
                      </span>
                    </div>

                    <div className="h-3 w-px bg-slate-300 dark:bg-slate-600 hidden sm:block" />

                    <div className="flex items-center gap-1 text-emerald-800 dark:text-emerald-300 font-semibold">
                      <Percent className="w-3.5 h-3.5 text-emerald-600" />
                      <span>MoMo Escrow Fee: 2.5%</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openProposalModal('new')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-300 dark:border-slate-600 shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Propose New Price</span>
                    </button>

                    {activeThread.status === 'price_agreed' && (
                      <button
                        onClick={handleCreateOrderAndPay}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 animate-pulse"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Order & Pay via MoMo (2.5%)</span>
                      </button>
                    )}

                    {activeThread.status === 'order_created' && (
                      <button
                        onClick={handlePayExistingOrder}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Pay via PawaPay MoMo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {activeThread.messages.map((message) => {
                  const isSystem = message.senderRole === 'system';
                  const isCurrentUserMessage =
                    (message.senderRole === 'buyer' && !isUserFarmerInThread) ||
                    (message.senderRole === 'farmer' && isUserFarmerInThread);

                  if (isSystem) {
                    return (
                      <div key={message.id} className="flex justify-center my-3">
                        <div className="max-w-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center text-xs text-slate-600 dark:text-slate-300 shadow-sm">
                          <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 mb-1">
                            <ShieldCheck className="w-4 h-4" />
                            <span>AgriBridge Escrow Notice</span>
                          </div>
                          <p>{message.content}</p>
                          <span className="text-[10px] text-slate-400 block mt-1">
                            {new Date(message.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col ${isCurrentUserMessage ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1 px-1">
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                          {message.senderName}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-lg rounded-2xl p-4 shadow-sm text-sm ${
                          isCurrentUserMessage
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {/* Structured Price Proposal Card */}
                        {message.priceProposal && (
                          <div
                            className={`mt-3 p-3.5 rounded-xl border text-xs ${
                              isCurrentUserMessage
                                ? 'bg-emerald-700/60 border-emerald-400/40 text-emerald-50'
                                : 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700/60 text-slate-800 dark:text-slate-100 shadow-inner'
                            }`}
                          >
                            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 mb-2">
                              <span className="font-bold flex items-center gap-1 text-xs">
                                <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                                <span>Negotiation Price Proposal</span>
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  message.priceProposal.status === 'accepted'
                                    ? 'bg-green-500 text-white'
                                    : message.priceProposal.status === 'declined'
                                    ? 'bg-red-500 text-white'
                                    : message.priceProposal.status === 'countered'
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-blue-500 text-white'
                                }`}
                              >
                                {message.priceProposal.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 my-2">
                              <div>
                                <span className="text-[10px] opacity-75 block">Offered Rate:</span>
                                <span className="font-extrabold text-sm">
                                  {message.priceProposal.proposedPricePerKgRwf.toLocaleString()} RWF/kg
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] opacity-75 block">Target Volume:</span>
                                <span className="font-bold text-sm">
                                  {message.priceProposal.requestedQuantityKg.toLocaleString()} kg
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] opacity-75 block">Produce Subtotal:</span>
                                <span className="font-bold">
                                  {message.priceProposal.totalAmountRwf.toLocaleString()} RWF
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] opacity-75 block">MoMo Escrow (2.5%):</span>
                                <span className="font-bold text-amber-300 dark:text-amber-400">
                                  {message.priceProposal.platformFeeRwf.toLocaleString()} RWF
                                </span>
                              </div>
                            </div>

                            {message.priceProposal.proposedDeliveryOption && (
                              <div className="text-[11px] pt-1 border-t border-emerald-500/20 text-slate-200 dark:text-slate-300">
                                Delivery: <span className="font-medium">{message.priceProposal.proposedDeliveryOption}</span>
                              </div>
                            )}

                            {/* Actions for receiver if proposal is still pending */}
                            {message.priceProposal.status === 'pending' && !isCurrentUserMessage && (
                              <div className="mt-3 pt-2.5 border-t border-emerald-500/20 flex flex-wrap items-center gap-2">
                                <button
                                  onClick={() => handleAcceptProposal(message.priceProposal!.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accept Rate</span>
                                </button>
                                <button
                                  onClick={() =>
                                    openProposalModal(
                                      'counter',
                                      message.priceProposal!.proposedPricePerKgRwf,
                                      message.priceProposal!.requestedQuantityKg
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-all"
                                >
                                  <ArrowDownRight className="w-3.5 h-3.5" />
                                  <span>Counter Offer</span>
                                </button>
                                <button
                                  onClick={() => handleDeclineProposal(message.priceProposal!.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-medium text-xs transition-all"
                                >
                                  Decline
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quick Suggestions & Text Input Bar */}
              <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 space-y-2">
                {/* Quick Negotiate Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">Quick bids:</span>
                  <button
                    onClick={() => {
                      if (!activeThread) return;
                      const p = Math.round(activeThread.listingUnitPriceRwf * 0.95);
                      openProposalModal('new', p);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-semibold hover:border-emerald-500 transition-colors whitespace-nowrap"
                  >
                    -5% ({Math.round(activeThread.listingUnitPriceRwf * 0.95)} RWF)
                  </button>
                  <button
                    onClick={() => {
                      if (!activeThread) return;
                      const p = Math.round(activeThread.listingUnitPriceRwf * 0.9);
                      openProposalModal('new', p);
                    }}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 font-semibold hover:border-emerald-500 transition-colors whitespace-nowrap"
                  >
                    -10% ({Math.round(activeThread.listingUnitPriceRwf * 0.9)} RWF)
                  </button>
                  <button
                    onClick={() => setInputMessage('Is the moisture content certified below 13.5% for this lot?')}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-colors whitespace-nowrap"
                  >
                    Ask Moisture Content
                  </button>
                  <button
                    onClick={() => setInputMessage('Can you provide transport aggregation to Rukomo depot?')}
                    className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400 transition-colors whitespace-nowrap"
                  >
                    Ask Depot Delivery
                  </button>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openProposalModal('new')}
                    className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-all shadow-sm flex items-center justify-center shrink-0"
                    title="Make Structured Price Proposal"
                  >
                    <DollarSign className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message or price proposal to farmer..."
                    className="flex-1 py-2.5 px-4 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  />

                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
                Select a Negotiation Thread
              </h3>
              <p className="text-sm text-slate-500 max-w-md mt-1">
                Choose an ongoing negotiation from the list or start negotiating directly from any produce listing in the marketplace.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL: PROPOSE / COUNTER PRICE DIALOG                    */}
      {/* ======================================================== */}
      {isProposalModalOpen && activeThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-green-700 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-300" />
                  <span>
                    {proposalMode === 'counter'
                      ? 'Submit Counter-Offer'
                      : 'Propose Negotiated Price'}
                  </span>
                </h3>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  {activeThread.cropName} • Asking: {activeThread.listingUnitPriceRwf.toLocaleString()} RWF/kg
                </p>
              </div>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitProposal} className="p-6 space-y-4">
              {/* Quick discount pills */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  Quick Benchmark Discount from Ask ({activeThread.listingUnitPriceRwf} RWF):
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[3, 5, 8, 12].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyQuickDiscount(pct)}
                      className="py-1.5 px-2 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950 hover:text-emerald-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors text-center"
                    >
                      -{pct}% ({Math.round(activeThread.listingUnitPriceRwf * (1 - pct / 100))})
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Quantity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Offered Price per Kg (RWF)*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={50}
                      max={20000}
                      value={proposedPricePerKg || ''}
                      onChange={(e) => setProposedPricePerKg(Number(e.target.value))}
                      className="w-full pl-3 pr-12 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      RWF
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Volume in Kilograms (kg)*
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min={activeThread.minimumOrderKg || 100}
                      max={activeThread.quantityAvailableKg || 50000}
                      value={proposedQuantityKg || ''}
                      onChange={(e) => setProposedQuantityKg(Number(e.target.value))}
                      className="w-full pl-3 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      KG
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Available: {activeThread.quantityAvailableKg.toLocaleString()} kg (Min: {activeThread.minimumOrderKg} kg)
                  </span>
                </div>
              </div>

              {/* Delivery Logistics */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Proposed Aggregation / Delivery Depot
                </label>
                <select
                  value={proposedDeliveryOption}
                  onChange={(e) => setProposedDeliveryOption(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Nyagatare Aggregation Center">Nyagatare Aggregation Center</option>
                  <option value="Mimuri Cooperative Warehouse">Mimuri Cooperative Warehouse</option>
                  <option value="Rukomo Marshland Depot">Rukomo Marshland Depot</option>
                  <option value="Farmgate Direct Pickup">Farmgate Direct Pickup (Farmer Location)</option>
                  <option value="Buyer Arranged Truck Delivery">Buyer Arranged Truck Delivery</option>
                </select>
              </div>

              {/* Terms & Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Payment & Quality Terms (Optional)
                </label>
                <textarea
                  rows={2}
                  value={proposalNotes}
                  onChange={(e) => setProposalNotes(e.target.value)}
                  placeholder="e.g., Moisture under 13%, clean gunny bags included, pickup within 48h."
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Transparent Cost & 2.5% MoMo Escrow Fee Breakdown */}
              <div className="bg-emerald-50/70 dark:bg-slate-800/80 rounded-xl p-3.5 border border-emerald-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Produce Net Total ({proposedQuantityKg.toLocaleString()} kg × {proposedPricePerKg.toLocaleString()} RWF):</span>
                  <span className="font-semibold">{proposalSubtotal.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-emerald-800 dark:text-emerald-300 font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>AgriBridge MoMo Escrow Fee (2.5%):</span>
                  </span>
                  <span>{proposalPlatformFee.toLocaleString()} RWF</span>
                </div>
                {totalBuyerSavings > 0 && (
                  <div className="flex justify-between text-green-700 dark:text-green-400 font-semibold text-[11px] pt-1">
                    <span>Negotiated Savings vs Asking Price:</span>
                    <span>-{totalBuyerSavings.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="pt-2 border-t border-emerald-300/50 dark:border-slate-600 flex justify-between font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                  <span>Total Payable via MoMo Escrow:</span>
                  <span className="text-emerald-700 dark:text-emerald-400">
                    {proposalGrandTotal.toLocaleString()} RWF
                  </span>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProposalModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {proposalMode === 'counter'
                      ? 'Submit Counter-Offer'
                      : 'Send Price Proposal'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: PAWAPAY MOMO CHECKOUT WITH 2.5% ESCROW FEE        */}
      {/* ======================================================== */}
      {checkoutOrder && (
        <PawaPayCheckoutModal
          order={checkoutOrder}
          isOpen={checkoutModalOpen}
          onClose={() => setCheckoutModalOpen(false)}
          initialMode="full_order"
          onPaymentSuccess={() => {
            setCheckoutModalOpen(false);
          }}
          onNavigateToTerminal={() => {
            setCheckoutModalOpen(false);
            if (onNavigateTab) onNavigateTab('payments');
          }}
        />
      )}
    </div>
  );
};
