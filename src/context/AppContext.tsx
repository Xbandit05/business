import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  Farm,
  Plot,
  CropCycle,
  ProduceListing,
  BuyerOffer,
  Order,
  OrderStatus,
  CommissionStatus,
  FarmExpense,
  AgroSupplier,
  AgronomistExpert,
  AdvisoryInquiry,
  TrainingLesson,
  MarketBenchmark,
  CropGrowthStage,
  NyagatareSector,
} from '../types/index.ts';
import {
  DEMO_USERS,
  DEMO_FARMS,
  DEMO_PLOTS,
  DEMO_CROP_CYCLES,
  DEMO_LISTINGS,
  DEMO_OFFERS,
  DEMO_ORDERS,
  DEMO_EXPENSES,
  DEMO_SUPPLIERS,
  DEMO_EXPERTS,
  DEMO_LESSONS,
  DEMO_BENCHMARKS,
} from '../data/nyagatare.ts';

export type DataFilterMode = 'all' | 'user_only' | 'demo_only';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface AppContextType {
  // Auth & Session
  currentUser: UserProfile;
  role: UserRole;
  setRole: (role: UserRole) => void;
  login: (name: string, phone: string, role: UserRole, sector?: NyagatareSector) => void;
  logout: () => void;
  loginAsJudge: (role: UserRole) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  dataFilter: DataFilterMode;
  setDataFilter: (filter: DataFilterMode) => void;

  // Domain Entities
  farms: Farm[];
  plots: Plot[];
  cropCycles: CropCycle[];
  listings: ProduceListing[];
  offers: BuyerOffer[];
  orders: Order[];
  expenses: FarmExpense[];
  suppliers: AgroSupplier[];
  experts: AgronomistExpert[];
  inquiries: AdvisoryInquiry[];
  lessons: TrainingLesson[];
  benchmarks: MarketBenchmark[];

  // Mutators
  addFarm: (farm: Omit<Farm, 'id' | 'isDemo' | 'createdAt'>) => string;
  addPlot: (plot: Omit<Plot, 'id' | 'isDemo' | 'createdAt'>) => string;
  addCropCycle: (cycle: Omit<CropCycle, 'id' | 'isDemo' | 'createdAt'>) => string;
  advanceCropStage: (cycleId: string) => void;
  createListing: (listing: Omit<ProduceListing, 'id' | 'isDemo' | 'createdAt'>) => string;
  submitBuyerOffer: (offer: Omit<BuyerOffer, 'id' | 'isDemo' | 'createdAt' | 'updatedAt' | 'status'>) => string;
  acceptOffer: (offerId: string) => string;
  declineOffer: (offerId: string) => void;
  counterOffer: (offerId: string, counterPriceRwf: number, counterNotes?: string) => void;

  // Orders & Commission
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  payCommission: (orderId: string) => void;

  // Farm Finances
  addExpense: (expense: Omit<FarmExpense, 'id' | 'isDemo' | 'createdAt'>) => string;
  deleteExpense: (id: string) => void;

  // Advisory & Lessons
  submitInquiry: (inquiry: Omit<AdvisoryInquiry, 'id' | 'status' | 'createdAt'>) => void;
  toggleLessonComplete: (lessonId: string) => void;

  // Session Reset
  resetDemoData: () => void;
  clearUserRecords: () => void;

  // Feedback Notifications
  toasts: ToastMessage[];
  dismissToast: (id: string) => void;
  showToast: (type: 'success' | 'info' | 'warning', title: string, description?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'agribridge_current_user',
  FILTER: 'agribridge_data_filter',
  USER_FARMS: 'agribridge_user_farms',
  USER_PLOTS: 'agribridge_user_plots',
  USER_CYCLES: 'agribridge_user_cycles',
  USER_LISTINGS: 'agribridge_user_listings',
  USER_OFFERS: 'agribridge_user_offers',
  USER_ORDERS: 'agribridge_user_orders',
  USER_EXPENSES: 'agribridge_user_expenses',
  USER_INQUIRIES: 'agribridge_user_inquiries',
  LESSON_PROGRESS: 'agribridge_lesson_progress',
  DEMO_OVERRIDE_OFFERS: 'agribridge_demo_offers_override',
  DEMO_OVERRIDE_CYCLES: 'agribridge_demo_cycles_override',
  DEMO_OVERRIDE_ORDERS: 'agribridge_demo_orders_override',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user (defaults to Demo Farmer Jean-Damascene Niyonzima)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [dataFilter, setDataFilterState] = useState<DataFilterMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILTER);
    return (saved as DataFilterMode) || 'all';
  });

  // User-created records (Persisted in LocalStorage)
  const [userFarms, setUserFarms] = useState<Farm[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_FARMS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userPlots, setUserPlots] = useState<Plot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PLOTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userCycles, setUserCycles] = useState<CropCycle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_CYCLES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userListings, setUserListings] = useState<ProduceListing[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_LISTINGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userOffers, setUserOffers] = useState<BuyerOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_OFFERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userOrders, setUserOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userExpenses, setUserExpenses] = useState<FarmExpense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_EXPENSES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userInquiries, setUserInquiries] = useState<AdvisoryInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_INQUIRIES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Overrides for Demo entities
  const [demoOffers, setDemoOffers] = useState<BuyerOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEMO_OVERRIDE_OFFERS);
      return saved ? JSON.parse(saved) : DEMO_OFFERS;
    } catch {
      return DEMO_OFFERS;
    }
  });

  const [demoCycles, setDemoCycles] = useState<CropCycle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEMO_OVERRIDE_CYCLES);
      return saved ? JSON.parse(saved) : DEMO_CROP_CYCLES;
    } catch {
      return DEMO_CROP_CYCLES;
    }
  });

  const [demoOrders, setDemoOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEMO_OVERRIDE_ORDERS);
      return saved ? JSON.parse(saved) : DEMO_ORDERS;
    } catch {
      return DEMO_ORDERS;
    }
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
      return saved ? JSON.parse(saved) : ['les_2'];
    } catch {
      return ['les_2'];
    }
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILTER, dataFilter);
  }, [dataFilter]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_FARMS, JSON.stringify(userFarms));
  }, [userFarms]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PLOTS, JSON.stringify(userPlots));
  }, [userPlots]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_CYCLES, JSON.stringify(userCycles));
  }, [userCycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_LISTINGS, JSON.stringify(userListings));
  }, [userListings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_OFFERS, JSON.stringify(userOffers));
  }, [userOffers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_ORDERS, JSON.stringify(userOrders));
  }, [userOrders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_EXPENSES, JSON.stringify(userExpenses));
  }, [userExpenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_INQUIRIES, JSON.stringify(userInquiries));
  }, [userInquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_OVERRIDE_OFFERS, JSON.stringify(demoOffers));
  }, [demoOffers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_OVERRIDE_CYCLES, JSON.stringify(demoCycles));
  }, [demoCycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEMO_OVERRIDE_ORDERS, JSON.stringify(demoOrders));
  }, [demoOrders]);

  // Notifications
  const showToast = (type: 'success' | 'info' | 'warning', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth & Roles
  const setRole = (newRole: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
    }));
    showToast('info', `Active Perspective: ${newRole.toUpperCase()}`);
  };

  const login = (name: string, phone: string, newRole: UserRole, sector: NyagatareSector = 'Nyagatare') => {
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: name,
      phoneNumber: phone,
      role: newRole,
      district: 'Nyagatare',
      sector,
      isVerified: true,
      isDemo: false,
    };
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast('success', `Signed in as ${newUser.fullName}`, `Role: ${newUser.role}`);
  };

  const logout = () => {
    setCurrentUser(DEMO_USERS[0]);
    showToast('info', 'Signed Out', 'Returned to default demonstration farmer profile.');
  };

  const loginAsJudge = (targetRole: UserRole) => {
    const match = DEMO_USERS.find((u) => u.role === targetRole) || {
      id: `judge_${targetRole}`,
      fullName: `Judge Evaluation Account (${targetRole})`,
      phoneNumber: '+250 788 999 000',
      role: targetRole,
      district: 'Nyagatare',
      sector: 'Mimuri' as NyagatareSector,
      cooperativeName: 'Competition Evaluation Authority',
      isVerified: true,
      isDemo: true,
    };
    setCurrentUser(match);
    setIsAuthModalOpen(false);
    showToast('success', 'Judge Demonstration Active', `Loaded verified ${targetRole} credentials.`);
  };

  const setDataFilter = (filter: DataFilterMode) => {
    setDataFilterState(filter);
  };

  // Domain Actions
  const addFarm = (farmData: Omit<Farm, 'id' | 'isDemo' | 'createdAt'>): string => {
    const id = `farm_user_${Date.now()}`;
    const newFarm: Farm = {
      ...farmData,
      id,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setUserFarms((prev) => [newFarm, ...prev]);
    showToast('success', 'Farm Registered', `${newFarm.name} saved in ${newFarm.sector}.`);
    return id;
  };

  const addPlot = (plotData: Omit<Plot, 'id' | 'isDemo' | 'createdAt'>): string => {
    const id = `plot_user_${Date.now()}`;
    const newPlot: Plot = {
      ...plotData,
      id,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setUserPlots((prev) => [newPlot, ...prev]);
    showToast('success', 'Plot Added', `${newPlot.identifier} (${newPlot.areaHa} Ha) registered.`);
    return id;
  };

  const addCropCycle = (cycleData: Omit<CropCycle, 'id' | 'isDemo' | 'createdAt'>): string => {
    const id = `cycle_user_${Date.now()}`;
    const newCycle: CropCycle = {
      ...cycleData,
      id,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setUserCycles((prev) => [newCycle, ...prev]);
    showToast('success', 'Crop Cycle Logged', `${newCycle.cropName} (${newCycle.variety}) added.`);
    return id;
  };

  const advanceCropStage = (cycleId: string) => {
    const stageOrder: CropGrowthStage[] = [
      'germination',
      'vegetative',
      'flowering',
      'maturing',
      'harvested',
    ];

    const advance = (list: CropCycle[]): CropCycle[] =>
      list.map((c) => {
        if (c.id === cycleId) {
          const currentIndex = stageOrder.indexOf(c.stage);
          const nextIndex = Math.min(currentIndex + 1, stageOrder.length - 1);
          const nextStage = stageOrder[nextIndex];
          return {
            ...c,
            stage: nextStage,
            actualHarvestKg:
              nextStage === 'harvested' ? c.actualHarvestKg || c.estimatedYieldKg : c.actualHarvestKg,
          };
        }
        return c;
      });

    if (userCycles.some((c) => c.id === cycleId)) {
      setUserCycles(advance);
      showToast('success', 'Growth Stage Advanced', 'Crop moved to next developmental stage.');
    } else {
      setDemoCycles(advance);
      showToast('info', 'Demo Crop Stage Updated', 'Demonstration cycle stage updated.');
    }
  };

  const createListing = (
    listingData: Omit<ProduceListing, 'id' | 'isDemo' | 'createdAt'>
  ): string => {
    const id = `listing_user_${Date.now()}`;
    const newListing: ProduceListing = {
      ...listingData,
      id,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setUserListings((prev) => [newListing, ...prev]);
    showToast(
      'success',
      'Produce Listed on Marketplace',
      `${newListing.quantityAvailableKg.toLocaleString()} kg listed at ${newListing.unitPriceRwf} RWF/kg.`
    );
    return id;
  };

  const submitBuyerOffer = (
    offerData: Omit<BuyerOffer, 'id' | 'isDemo' | 'createdAt' | 'updatedAt' | 'status'>
  ): string => {
    const id = `offer_user_${Date.now()}`;
    const newOffer: BuyerOffer = {
      ...offerData,
      id,
      status: 'submitted',
      isDemo: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserOffers((prev) => [newOffer, ...prev]);
    showToast(
      'success',
      'Offer Submitted to Farmer',
      `Bid of ${newOffer.offeredPricePerKgRwf} RWF/kg for ${newOffer.requestedQuantityKg.toLocaleString()} kg submitted.`
    );
    return id;
  };

  // ACCEPT OFFER -> NOW CREATES A FORMAL ORDER AND CALCULATES COMMISSION!
  const acceptOffer = (offerId: string): string => {
    let matchedOffer: BuyerOffer | undefined =
      userOffers.find((o) => o.id === offerId) || demoOffers.find((o) => o.id === offerId);

    if (!matchedOffer) return '';

    // Mark offer accepted
    const update = (list: BuyerOffer[]) =>
      list.map((o) => (o.id === offerId ? { ...o, status: 'accepted' as const, updatedAt: new Date().toISOString() } : o));

    if (userOffers.some((o) => o.id === offerId)) {
      setUserOffers(update);
    } else {
      setDemoOffers(update);
    }

    // Determine final price
    const finalPricePerKg = matchedOffer.counterPricePerKgRwf || matchedOffer.offeredPricePerKgRwf;
    const finalTotalRwf = finalPricePerKg * matchedOffer.requestedQuantityKg;
    const commissionPercent = 2.5; // Standard 2.5% platform commission
    const commissionAmount = Math.round((finalTotalRwf * commissionPercent) / 100);

    const orderId = `ord_${Date.now()}`;
    const newOrder: Order = {
      id: orderId,
      orderNumber: `ORD-NYA-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      offerId: matchedOffer.id,
      listingId: matchedOffer.listingId,
      cropName: matchedOffer.listingCropName,
      variety: 'Verified Quality',
      farmerId: matchedOffer.farmerId,
      farmerName: matchedOffer.farmerName,
      farmerPhone: '+250 788 123 456',
      buyerId: matchedOffer.buyerId,
      buyerName: matchedOffer.buyerName,
      buyerPhone: matchedOffer.buyerPhone,
      buyerCompany: matchedOffer.buyerCompany,
      sector: 'Mimuri',
      quantityKg: matchedOffer.requestedQuantityKg,
      unitPriceRwf: finalPricePerKg,
      totalAmountRwf: finalTotalRwf,
      commissionRatePercent: commissionPercent,
      commissionAmountRwf: commissionAmount,
      commissionStatus: 'due',
      status: 'pending_dispatch',
      deliveryOption: 'Nyagatare Aggregation Center',
      dispatchDate: matchedOffer.proposedPickupDate,
      paymentMethod: 'Mobile Money (MTN/Airtel)',
      receiptCode: `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      isDemo: matchedOffer.isDemo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (matchedOffer.isDemo) {
      setDemoOrders((prev) => [newOrder, ...prev]);
    } else {
      setUserOrders((prev) => [newOrder, ...prev]);
    }

    showToast(
      'success',
      'Offer Accepted & Order Created',
      `Order ${newOrder.orderNumber} generated. Commission of ${commissionAmount.toLocaleString()} RWF recorded.`
    );
    return orderId;
  };

  const declineOffer = (offerId: string) => {
    const update = (list: BuyerOffer[]) =>
      list.map((o) => (o.id === offerId ? { ...o, status: 'declined' as const, updatedAt: new Date().toISOString() } : o));

    if (userOffers.some((o) => o.id === offerId)) {
      setUserOffers(update);
    } else {
      setDemoOffers(update);
    }
    showToast('info', 'Offer Declined', 'Buyer offer turned down.');
  };

  const counterOffer = (offerId: string, counterPriceRwf: number, counterNotes?: string) => {
    const update = (list: BuyerOffer[]) =>
      list.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'countered' as const,
              counterPricePerKgRwf: counterPriceRwf,
              counterNotes: counterNotes || undefined,
              updatedAt: new Date().toISOString(),
            }
          : o
      );

    if (userOffers.some((o) => o.id === offerId)) {
      setUserOffers(update);
    } else {
      setDemoOffers(update);
    }
    showToast('success', 'Counteroffer Sent', `New price of ${counterPriceRwf} RWF/kg sent to buyer.`);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const update = (list: Order[]) =>
      list.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus, updatedAt: new Date().toISOString() } : ord));

    if (userOrders.some((o) => o.id === orderId)) {
      setUserOrders(update);
    } else {
      setDemoOrders(update);
    }
    showToast('info', 'Order Status Updated', `Order marked as ${newStatus.replace('_', ' ')}`);
  };

  const payCommission = (orderId: string) => {
    const update = (list: Order[]) =>
      list.map((ord) =>
        ord.id === orderId ? { ...ord, commissionStatus: 'paid' as CommissionStatus, updatedAt: new Date().toISOString() } : ord
      );

    if (userOrders.some((o) => o.id === orderId)) {
      setUserOrders(update);
    } else {
      setDemoOrders(update);
    }
    showToast('success', 'Commission Paid', 'Platform transaction fee settled via MoMo.');
  };

  const addExpense = (expenseData: Omit<FarmExpense, 'id' | 'isDemo' | 'createdAt'>): string => {
    const id = `exp_user_${Date.now()}`;
    const newExp: FarmExpense = {
      ...expenseData,
      id,
      isDemo: false,
      createdAt: new Date().toISOString(),
    };
    setUserExpenses((prev) => [newExp, ...prev]);
    showToast('success', 'Expense Logged', `${newExp.itemName}: ${newExp.totalCostRwf.toLocaleString()} RWF`);
    return id;
  };

  const deleteExpense = (id: string) => {
    setUserExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast('info', 'Expense Removed', 'Ledger entry deleted.');
  };

  const submitInquiry = (inquiryData: Omit<AdvisoryInquiry, 'id' | 'status' | 'createdAt'>) => {
    const newInquiry: AdvisoryInquiry = {
      ...inquiryData,
      id: `inq_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setUserInquiries((prev) => [newInquiry, ...prev]);
    showToast('success', 'Agronomy Query Sent', `Submitted to ${inquiryData.expertName}. Expect reply in 24 hours.`);
  };

  const toggleLessonComplete = (lessonId: string) => {
    setCompletedLessonIds((prev) =>
      prev.includes(lessonId) ? prev.filter((id) => id !== lessonId) : [...prev, lessonId]
    );
    showToast('success', 'Training Progress Saved', 'Lesson completion marked.');
  };

  const resetDemoData = () => {
    setDemoOffers(DEMO_OFFERS);
    setDemoCycles(DEMO_CROP_CYCLES);
    setDemoOrders(DEMO_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_OVERRIDE_OFFERS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_OVERRIDE_CYCLES);
    localStorage.removeItem(STORAGE_KEYS.DEMO_OVERRIDE_ORDERS);
    showToast('info', 'Demo Data Reset', 'Demonstration records restored to pristine seed state.');
  };

  const clearUserRecords = () => {
    setUserFarms([]);
    setUserPlots([]);
    setUserCycles([]);
    setUserListings([]);
    setUserOffers([]);
    setUserOrders([]);
    setUserExpenses([]);
    setUserInquiries([]);
    localStorage.removeItem(STORAGE_KEYS.USER_FARMS);
    localStorage.removeItem(STORAGE_KEYS.USER_PLOTS);
    localStorage.removeItem(STORAGE_KEYS.USER_CYCLES);
    localStorage.removeItem(STORAGE_KEYS.USER_LISTINGS);
    localStorage.removeItem(STORAGE_KEYS.USER_OFFERS);
    localStorage.removeItem(STORAGE_KEYS.USER_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.USER_EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.USER_INQUIRIES);
    showToast('warning', 'User Records Cleared', 'All locally created test records have been reset.');
  };

  // Filtered queries based on dataFilter
  const filterList = <T extends { isDemo: boolean }>(allDemo: T[], allUser: T[]): T[] => {
    if (dataFilter === 'user_only') return allUser;
    if (dataFilter === 'demo_only') return allDemo;
    return [...allUser, ...allDemo];
  };

  const combinedFarms = filterList(DEMO_FARMS, userFarms);
  const combinedPlots = filterList(DEMO_PLOTS, userPlots);
  const combinedCycles = filterList(demoCycles, userCycles);
  const combinedListings = filterList(DEMO_LISTINGS, userListings);
  const combinedOffers = filterList(demoOffers, userOffers);
  const combinedOrders = filterList(demoOrders, userOrders);
  const combinedExpenses = filterList(DEMO_EXPENSES, userExpenses);

  const lessonsWithStatus = DEMO_LESSONS.map((l) => ({
    ...l,
    isCompleted: completedLessonIds.includes(l.id),
  }));

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role: currentUser.role,
        setRole,
        login,
        logout,
        loginAsJudge,
        isAuthModalOpen,
        setIsAuthModalOpen,
        dataFilter,
        setDataFilter,
        farms: combinedFarms,
        plots: combinedPlots,
        cropCycles: combinedCycles,
        listings: combinedListings,
        offers: combinedOffers,
        orders: combinedOrders,
        expenses: combinedExpenses,
        suppliers: DEMO_SUPPLIERS,
        experts: DEMO_EXPERTS,
        inquiries: userInquiries,
        lessons: lessonsWithStatus,
        benchmarks: DEMO_BENCHMARKS,
        addFarm,
        addPlot,
        addCropCycle,
        advanceCropStage,
        createListing,
        submitBuyerOffer,
        acceptOffer,
        declineOffer,
        counterOffer,
        updateOrderStatus,
        payCommission,
        addExpense,
        deleteExpense,
        submitInquiry,
        toggleLessonComplete,
        resetDemoData,
        clearUserRecords,
        toasts,
        dismissToast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
