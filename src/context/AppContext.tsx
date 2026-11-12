import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserCategory,
  UserProfile,
  SavedUserCredentials,
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
  UserPortfolio,
  AuthSession,
  PortfolioRegistrationPayload,
  NegotiationThread,
  NegotiationMessage,
  PriceProposal,
} from '../types/index.ts';
import {
  DEMO_USERS,
  DEMO_PORTFOLIOS,
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
  DEMO_NEGOTIATION_THREADS,
} from '../data/nyagatare.ts';
import {
  auth,
  signInWithGoogle,
  logOutFromFirebase,
  GoogleAuthErrorInfo,
  parseFirebaseAuthError,
} from '../lib/firebase.ts';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  saveUserProfileToFirestore,
  getUserProfileFromFirestore,
  savePortfolioToFirestore,
  getUserPortfoliosFromFirestore,
} from '../lib/firestoreService.ts';

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
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  firebaseUser: FirebaseUser | null;
  isGoogleAuthenticated: boolean;
  signInWithGoogleAccount: () => Promise<{ success: boolean; error?: string; errorInfo?: GoogleAuthErrorInfo }>;
  signOutGoogleAccount: () => Promise<void>;
  activePortfolio: UserPortfolio | null;
  userPortfolios: UserPortfolio[];
  isAgentWorkspace: boolean;
  registerPortfolioAccount: (payload: PortfolioRegistrationPayload) => Promise<{ success: boolean; error?: string }>;
  loginWithCredentials: (identifier: string, passwordOrPin: string) => Promise<{ success: boolean; error?: string; portfolios?: UserPortfolio[] }>;
  loginAsAgent: (agentIdOrPhone: string, agentPin: string) => Promise<{ success: boolean; error?: string }>;
  switchPortfolio: (portfolioId: string) => void;
  createPortfolio: (portfolioData: Partial<UserPortfolio>) => Promise<{ success: boolean; error?: string }>;
  updatePortfolio: (portfolioId: string, updates: Partial<UserPortfolio>) => Promise<{ success: boolean; error?: string }>;
  recoverAccount: (identifier: string, securityAnswer: string, newPin: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  enterDemoPreview: (role?: UserRole) => void;
  isPortfolioModalOpen: boolean;
  setIsPortfolioModalOpen: (open: boolean) => void;

  login: (
    name: string,
    phone: string,
    role: UserRole,
    district?: string,
    sector?: string,
    extra?: {
      email?: string;
      category?: UserCategory;
      nicheSpecialty?: string;
      businessOrFarmName?: string;
      tradeVolumeScale?: string;
      saveCredentials?: boolean;
    }
  ) => void;
  saveUserCredentials: (profile: Partial<UserProfile> & { category: UserCategory }) => void;
  savedAccounts: SavedUserCredentials[];
  deleteSavedAccount: (id: string) => void;
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
  markOrderPaid: (orderId: string, pawapayDepositId?: string) => void;

  // Farm Finances
  addExpense: (expense: Omit<FarmExpense, 'id' | 'isDemo' | 'createdAt'>) => string;
  deleteExpense: (id: string) => void;

  // Advisory & Lessons
  submitInquiry: (inquiry: Omit<AdvisoryInquiry, 'id' | 'status' | 'createdAt'>) => void;
  toggleLessonComplete: (lessonId: string) => void;

  // Price Negotiation Inbox & Portal
  negotiationThreads: NegotiationThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  startNegotiationWithListing: (
    listing: ProduceListing,
    initialOfferPrice?: number,
    initialQuantityKg?: number,
    initialNotes?: string
  ) => string;
  sendMessageInThread: (
    threadId: string,
    content: string,
    priceProposal?: {
      offeredPricePerKg: number;
      offeredQuantityKg: number;
      deliveryOption?: string;
      pickupDate?: string;
      termsNotes?: string;
    }
  ) => void;
  respondToProposal: (
    threadId: string,
    proposalId: string,
    action: 'accept' | 'decline' | 'counter',
    counterPricePerKg?: number,
    counterQuantityKg?: number,
    counterNotes?: string
  ) => void;
  convertThreadToOrder: (threadId: string) => Order | null;
  unreadNegotiationsCount: number;

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
  SAVED_ACCOUNTS: 'agribridge_saved_accounts',
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
  AUTH_SESSION: 'agribridge_auth_session',
  USER_PORTFOLIOS: 'agribridge_user_portfolios',
  ACTIVE_PORTFOLIO_ID: 'agribridge_active_portfolio_id',
  NEGOTIATION_THREADS: 'agribridge_negotiation_threads',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication session status (defaults to false on initial visit without session)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      return Boolean(session);
    } catch {
      return false;
    }
  });

  // Google Firebase Authentication State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(() => auth.currentUser);
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState<boolean>(() => Boolean(auth.currentUser));

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        setIsGoogleAuthenticated(true);
        setIsAuthenticated(true);

        try {
          // Attempt to retrieve existing profile from Firestore
          let profile = await getUserProfileFromFirestore(user.uid);
          if (!profile) {
            const newProfile: UserProfile = {
              id: user.uid,
              fullName: user.displayName || user.email?.split('@')[0] || 'AgriBridge Member',
              email: user.email || '',
              phoneNumber: user.phoneNumber || '+250 788 123 456',
              role: 'farmer',
              category: 'seller',
              district: 'Nyagatare',
              sector: 'Mimuri',
              isVerified: true,
              isDemo: false,
              photoURL: user.photoURL || undefined,
              activePortfolioId: `PF-RW-${user.uid.slice(0, 6).toUpperCase()}`,
              createdAt: new Date().toISOString(),
            };
            profile = newProfile;
            await saveUserProfileToFirestore(newProfile);
          }

          setCurrentUser(profile);

          // Sync or create associated portfolio in Firestore
          const portfolios = await getUserPortfoliosFromFirestore(user.uid);
          if (portfolios && portfolios.length > 0) {
            setUserPortfolios((prev) => [
              ...portfolios,
              ...prev.filter((p) => !portfolios.some((np) => np.id === p.id)),
            ]);
            setActivePortfolioId(portfolios[0].id);
          } else {
            const personalPortfolio: UserPortfolio = {
              id: profile.activePortfolioId || `PF-RW-${user.uid.slice(0, 6).toUpperCase()}`,
              userId: user.uid,
              name: `${profile.fullName}'s Portfolio`,
              role: profile.role || 'farmer',
              category: profile.category || 'seller',
              district: profile.district,
              sector: profile.sector,
              isPrimary: true,
              createdAt: new Date().toISOString(),
            };
            await savePortfolioToFirestore(personalPortfolio);
            setUserPortfolios((prev) => [personalPortfolio, ...prev]);
            setActivePortfolioId(personalPortfolio.id);
          }
        } catch (syncErr) {
          console.warn('Firestore profile sync note:', syncErr);
        }

        showToast(
          'success',
          'Google Account Connected',
          `Signed in as ${user.displayName || user.email}.`
        );
      } else {
        setFirebaseUser(null);
        setIsGoogleAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const [isAgentWorkspace, setIsAgentWorkspace] = useState<boolean>(() => {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (session) {
        const parsed = JSON.parse(session);
        return Boolean(parsed?.isAgent);
      }
      return false;
    } catch {
      return false;
    }
  });

  // User Portfolios
  const [userPortfolios, setUserPortfolios] = useState<UserPortfolio[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PORTFOLIOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEMO_PORTFOLIOS;
    } catch {
      return DEMO_PORTFOLIOS;
    }
  });

  // Active Portfolio ID
  const [activePortfolioId, setActivePortfolioId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID);
      return saved || 'PF-RW-IDRIS-01';
    } catch {
      return 'PF-RW-IDRIS-01';
    }
  });

  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

  // Current logged in user profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate legacy demo farmer name to IDRIS Agaba Otin
        if (
          parsed?.id === 'user_farmer_1' ||
          parsed?.fullName?.includes('Jean-Damascene') ||
          parsed?.fullName?.includes('Jean Damascene')
        ) {
          parsed.fullName = DEMO_USERS[0].fullName;
          parsed.email = DEMO_USERS[0].email;
          localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(parsed));
        }
        return parsed;
      }
      return DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  // Saved credentials on device for quick reconnection and personalization
  const [savedAccounts, setSavedAccounts] = useState<SavedUserCredentials[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_ACCOUNTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_ACCOUNTS, JSON.stringify(savedAccounts));
  }, [savedAccounts]);

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

  // Price Negotiation Inbox Threads
  const [negotiationThreads, setNegotiationThreads] = useState<NegotiationThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NEGOTIATION_THREADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEMO_NEGOTIATION_THREADS;
    } catch {
      return DEMO_NEGOTIATION_THREADS;
    }
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    return DEMO_NEGOTIATION_THREADS[0]?.id || null;
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEGOTIATION_THREADS, JSON.stringify(negotiationThreads));
  }, [negotiationThreads]);

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

  const login = (
    name: string,
    phone: string,
    newRole: UserRole,
    district: string = 'Nyagatare',
    sector: string = 'Nyagatare',
    extra?: {
      email?: string;
      category?: UserCategory;
      nicheSpecialty?: string;
      businessOrFarmName?: string;
      tradeVolumeScale?: string;
      saveCredentials?: boolean;
    }
  ) => {
    const derivedCategory: UserCategory =
      extra?.category ||
      (newRole === 'farmer' ? 'seller' : (newRole as UserCategory));

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      fullName: name,
      phoneNumber: phone,
      email: extra?.email,
      role: newRole,
      category: derivedCategory,
      nicheSpecialty: extra?.nicheSpecialty,
      businessOrFarmName: extra?.businessOrFarmName,
      tradeVolumeScale: extra?.tradeVolumeScale,
      district,
      sector,
      isVerified: true,
      isDemo: false,
      savedCredentials: extra?.saveCredentials ?? true,
      savedAt: new Date().toISOString(),
    };

    setCurrentUser(newUser);

    if (extra?.saveCredentials !== false) {
      const credentialRecord: SavedUserCredentials = {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        category: derivedCategory,
        nicheSpecialty: newUser.nicheSpecialty,
        businessOrFarmName: newUser.businessOrFarmName,
        tradeVolumeScale: newUser.tradeVolumeScale,
        district: newUser.district,
        sector: newUser.sector,
        cooperativeName: newUser.cooperativeName,
        savedAt: newUser.savedAt || new Date().toISOString(),
      };
      setSavedAccounts((prev) => {
        const filtered = prev.filter(
          (a) => a.id !== credentialRecord.id && a.phoneNumber !== credentialRecord.phoneNumber
        );
        return [credentialRecord, ...filtered];
      });
    }

    setIsAuthModalOpen(false);
    showToast('success', `Signed in as ${newUser.fullName}`, `Role: ${newUser.role} · ${district}`);
  };

  const saveUserCredentials = (profile: Partial<UserProfile> & { category: UserCategory }) => {
    const role: UserRole =
      profile.role ||
      (profile.category === 'seller'
        ? 'farmer'
        : profile.category === 'buyer'
        ? 'buyer'
        : profile.category === 'supplier'
        ? 'supplier'
        : profile.category === 'agent'
        ? 'agent'
        : profile.category === 'admin'
        ? 'admin'
        : 'farmer');

    const updatedUser: UserProfile = {
      ...currentUser,
      ...profile,
      id: profile.id || currentUser.id || `usr_${Date.now()}`,
      fullName: profile.fullName || currentUser.fullName || 'AgriBridge Member',
      phoneNumber: profile.phoneNumber || currentUser.phoneNumber || '',
      email: profile.email || currentUser.email || '',
      role,
      category: profile.category,
      nicheSpecialty: profile.nicheSpecialty || currentUser.nicheSpecialty,
      businessOrFarmName: profile.businessOrFarmName || currentUser.businessOrFarmName,
      tradeVolumeScale: profile.tradeVolumeScale || currentUser.tradeVolumeScale,
      district: profile.district || currentUser.district || 'Nyagatare',
      sector: profile.sector || currentUser.sector || 'Mimuri',
      isVerified: true,
      isDemo: false,
      savedCredentials: true,
      savedAt: new Date().toISOString(),
    };

    setCurrentUser(updatedUser);

    const credentialRecord: SavedUserCredentials = {
      id: updatedUser.id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      category: updatedUser.category || 'seller',
      nicheSpecialty: updatedUser.nicheSpecialty,
      businessOrFarmName: updatedUser.businessOrFarmName,
      tradeVolumeScale: updatedUser.tradeVolumeScale,
      district: updatedUser.district,
      sector: updatedUser.sector,
      cooperativeName: updatedUser.cooperativeName,
      savedAt: updatedUser.savedAt || new Date().toISOString(),
    };

    setSavedAccounts((prev) => {
      const filtered = prev.filter(
        (a) =>
          a.id !== credentialRecord.id &&
          (credentialRecord.phoneNumber ? a.phoneNumber !== credentialRecord.phoneNumber : true) &&
          (credentialRecord.email && a.email ? a.email !== credentialRecord.email : true)
      );
      return [credentialRecord, ...filtered];
    });

    setIsAuthModalOpen(false);
    showToast(
      'success',
      'Credentials & Niche Saved',
      `Welcome ${updatedUser.fullName} (${(updatedUser.category || updatedUser.role).toUpperCase()})`
    );
  };

  const deleteSavedAccount = (id: string) => {
    setSavedAccounts((prev) => prev.filter((acc) => acc.id !== id));
    showToast('info', 'Saved Account Removed', 'Account credentials cleared from this browser.');
  };

  const activePortfolio = userPortfolios.find((p) => p.id === activePortfolioId) || userPortfolios[0] || null;

  const registerPortfolioAccount = async (payload: PortfolioRegistrationPayload): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUserPortfolios(data.portfolios);
        setActivePortfolioId(data.activePortfolioId);
        setIsAuthenticated(true);
        setIsAgentWorkspace(false);
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({
          token: data.token,
          userId: data.user.id,
          loginTime: new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(data.portfolios));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, data.activePortfolioId);
        showToast('success', 'Portfolio Created', `Welcome to AgriBridge Rwanda, ${data.user.fullName}!`);
        return { success: true };
      }

      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error || 'Registration failed.' };
    } catch {
      // Local offline fallback
      const userId = `user_${Date.now()}`;
      const portfolioId = `PF-RW-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newUser: UserProfile = {
        id: userId,
        fullName: payload.fullName.trim(),
        phoneNumber: payload.phoneNumber.trim(),
        email: payload.email?.trim(),
        role: payload.role,
        category: payload.category,
        district: payload.district,
        sector: payload.sector,
        nicheSpecialty: payload.nicheSpecialty || 'Agricultural Production',
        businessOrFarmName: payload.businessOrFarmName || payload.portfolioName,
        cooperativeName: payload.cooperativeName,
        tradeVolumeScale: payload.tradeVolumeScale,
        isVerified: true,
        isDemo: false,
        activePortfolioId: portfolioId,
      };

      const newPort: UserPortfolio = {
        id: portfolioId,
        userId,
        name: payload.portfolioName || `${payload.fullName.trim()} Farm Portfolio`,
        category: payload.category,
        role: payload.role,
        district: payload.district,
        sector: payload.sector,
        cell: payload.cell,
        nicheSpecialty: payload.nicheSpecialty,
        businessOrFarmName: payload.businessOrFarmName,
        cooperativeName: payload.cooperativeName,
        tradeVolumeScale: payload.tradeVolumeScale,
        isPrimary: true,
        createdAt: new Date().toISOString(),
        metrics: {
          plotsCount: payload.role === 'farmer' ? 1 : 0,
          activeListingsCount: 0,
          completedDealsCount: 0,
          totalAreaHa: payload.role === 'farmer' ? 1.0 : 0,
        },
      };

      const updated = [...userPortfolios, newPort];
      setCurrentUser(newUser);
      setUserPortfolios(updated);
      setActivePortfolioId(portfolioId);
      setIsAuthenticated(true);
      setIsAgentWorkspace(false);
      localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({
        token: `local_tok_${Date.now()}`,
        userId,
        loginTime: new Date().toISOString(),
      }));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, portfolioId);
      showToast('success', 'Portfolio Created (Offline)', `Welcome to AgriBridge, ${newUser.fullName}!`);
      return { success: true };
    }
  };

  const loginWithCredentials = async (identifier: string, passwordOrPin: string): Promise<{ success: boolean; error?: string; portfolios?: UserPortfolio[] }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, passwordOrPin }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUserPortfolios(data.portfolios);
        setActivePortfolioId(data.activePortfolioId);
        setIsAuthenticated(true);
        setIsAgentWorkspace(false);
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({
          token: data.token,
          userId: data.user.id,
          loginTime: new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(data.portfolios));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, data.activePortfolioId);
        showToast('success', 'Portfolio Verified', `Welcome back, ${data.user.fullName}`);
        return { success: true, portfolios: data.portfolios };
      }

      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error || 'Invalid credentials.' };
    } catch {
      // Local fallback for offline resilience
      const cleanInput = identifier.trim().toLowerCase();
      const match = DEMO_USERS.find(
        (u) =>
          u.phoneNumber.replace(/[\s\-\(\)]/g, '').includes(cleanInput.replace(/[\s\-\(\)]/g, '')) ||
          (u.email && u.email.toLowerCase() === cleanInput) ||
          cleanInput.includes('idris') ||
          cleanInput.includes('clarisse') ||
          cleanInput.includes('otin')
      );

      if (match) {
        if (passwordOrPin === '123' || passwordOrPin === '1234' || passwordOrPin.length >= 3) {
          const ports = DEMO_PORTFOLIOS.filter((p) => p.userId === match.id);
          const primary = ports.find((p) => p.isPrimary) || ports[0];
          setCurrentUser(match);
          setUserPortfolios(ports.length > 0 ? ports : DEMO_PORTFOLIOS);
          setActivePortfolioId(primary?.id || 'PF-RW-IDRIS-01');
          setIsAuthenticated(true);
          setIsAgentWorkspace(false);
          showToast('success', 'Verified', `Welcome back, ${match.fullName}`);
          return { success: true, portfolios: ports };
        }
        return { success: false, error: 'Incorrect password or PIN.' };
      }
      return { success: false, error: 'No account found matching this identifier.' };
    }
  };

  const loginAsAgent = async (agentIdOrPhone: string, agentPin: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/agent-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentIdOrPhone, agentPin }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setUserPortfolios(data.portfolios);
        setActivePortfolioId(data.activePortfolioId);
        setIsAuthenticated(true);
        setIsAgentWorkspace(true);
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({
          token: data.token,
          userId: data.user.id,
          isAgent: true,
          agentId: data.user.agentId,
          loginTime: new Date().toISOString(),
        }));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data.user));
        localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(data.portfolios));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, data.activePortfolioId);
        showToast('success', 'Community Agent Verified', `Welcome, Field Extension Lead ${data.user.fullName}!`);
        return { success: true };
      }

      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error || 'Invalid Community Agent credentials.' };
    } catch {
      // Local fallback
      const cleanInput = agentIdOrPhone.trim().toLowerCase();
      if (cleanInput.includes('agt') || cleanInput.includes('habimana') || cleanInput.includes('987 654') || cleanInput.includes('788987654')) {
        if (agentPin === '123' || agentPin === '1234') {
          const agent = DEMO_USERS.find((u) => u.role === 'agent') || DEMO_USERS[3];
          const ports = DEMO_PORTFOLIOS.filter((p) => p.userId === agent.id);
          setCurrentUser(agent);
          setUserPortfolios(ports);
          setActivePortfolioId('PF-RW-EMMANUEL-01');
          setIsAuthenticated(true);
          setIsAgentWorkspace(true);
          showToast('success', 'Community Agent Verified', `Welcome, Field Agent ${agent.fullName}!`);
          return { success: true };
        }
      }
      return { success: false, error: 'Unauthorized Community Agent credentials.' };
    }
  };

  const switchPortfolio = (portfolioId: string) => {
    const target = userPortfolios.find((p) => p.id === portfolioId);
    if (!target) return;
    setActivePortfolioId(portfolioId);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, portfolioId);

    setCurrentUser((prev) => ({
      ...prev,
      role: target.role,
      category: target.category,
      district: target.district,
      sector: target.sector,
      nicheSpecialty: target.nicheSpecialty || prev.nicheSpecialty,
      businessOrFarmName: target.businessOrFarmName || target.name,
      cooperativeName: target.cooperativeName || prev.cooperativeName,
      activePortfolioId: target.id,
    }));
    showToast('info', 'Active Portfolio Switched', `Now managing: ${target.name}`);
  };

  const createPortfolio = async (portfolioData: Partial<UserPortfolio>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ...portfolioData,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUserPortfolios(data.portfolios);
        setActivePortfolioId(data.portfolio.id);
        localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(data.portfolios));
        localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, data.portfolio.id);
        showToast('success', 'New Portfolio Added', `Created ${data.portfolio.name}`);
        return { success: true };
      }
    } catch {}

    const portfolioId = `PF-RW-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPort: UserPortfolio = {
      id: portfolioId,
      userId: currentUser.id,
      name: portfolioData.name || 'New Plot & Farm Portfolio',
      category: portfolioData.category || currentUser.category || 'seller',
      role: portfolioData.role || currentUser.role,
      district: portfolioData.district || currentUser.district,
      sector: portfolioData.sector || currentUser.sector,
      cell: portfolioData.cell || 'Central Cell',
      nicheSpecialty: portfolioData.nicheSpecialty || currentUser.nicheSpecialty,
      businessOrFarmName: portfolioData.businessOrFarmName || portfolioData.name,
      cooperativeName: portfolioData.cooperativeName || currentUser.cooperativeName,
      tradeVolumeScale: portfolioData.tradeVolumeScale,
      isPrimary: false,
      createdAt: new Date().toISOString(),
      metrics: { plotsCount: 1, activeListingsCount: 0, completedDealsCount: 0, totalAreaHa: 1.0 },
    };

    const updated = [...userPortfolios, newPort];
    setUserPortfolios(updated);
    setActivePortfolioId(portfolioId);
    localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(updated));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PORTFOLIO_ID, portfolioId);
    showToast('success', 'New Portfolio Added', `Created ${newPort.name}`);
    return { success: true };
  };

  const updatePortfolio = async (portfolioId: string, updates: Partial<UserPortfolio>): Promise<{ success: boolean; error?: string }> => {
    try {
      await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch {}

    const updated = userPortfolios.map((p) => (p.id === portfolioId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
    setUserPortfolios(updated);
    localStorage.setItem(STORAGE_KEYS.USER_PORTFOLIOS, JSON.stringify(updated));

    if (activePortfolioId === portfolioId) {
      setCurrentUser((prev) => ({
        ...prev,
        businessOrFarmName: updates.name || updates.businessOrFarmName || prev.businessOrFarmName,
        district: updates.district || prev.district,
        sector: updates.sector || prev.sector,
        nicheSpecialty: updates.nicheSpecialty || prev.nicheSpecialty,
        cooperativeName: updates.cooperativeName || prev.cooperativeName,
      }));
    }
    showToast('success', 'Portfolio Updated', 'Portfolio details have been saved.');
    return { success: true };
  };

  const recoverAccount = async (identifier: string, securityAnswer: string, newPin: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, securityAnswer, newPasswordOrPin: newPin }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Access Recovered', 'Your PIN/Password was updated. You can now log in.');
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Recovery failed.' };
    } catch {
      return { success: false, error: 'Network error. Please try again when connection is restored.' };
    }
  };

  const enterDemoPreview = (targetRole: UserRole = 'farmer') => {
    const match = DEMO_USERS.find((u) => u.role === targetRole) || DEMO_USERS[0];
    const matchPortfolios = DEMO_PORTFOLIOS.filter((p) => p.userId === match.id);
    const primary = matchPortfolios.find((p) => p.isPrimary) || matchPortfolios[0];

    setCurrentUser(match);
    setUserPortfolios(matchPortfolios.length > 0 ? matchPortfolios : DEMO_PORTFOLIOS);
    setActivePortfolioId(primary ? primary.id : 'PF-RW-IDRIS-01');
    setIsAuthenticated(true);
    setIsAgentWorkspace(targetRole === 'agent');
    localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify({
      token: `demo_tok_${Date.now()}`,
      userId: match.id,
      loginTime: new Date().toISOString(),
      isDemo: true,
    }));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(match));
    showToast('info', `Exploring as ${match.role.toUpperCase()}`, `Workspace loaded: ${match.fullName}`);
  };

  const signInWithGoogleAccount = async (): Promise<{ success: boolean; error?: string; errorInfo?: GoogleAuthErrorInfo }> => {
    try {
      await signInWithGoogle();
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: unknown) {
      const errorInfo: GoogleAuthErrorInfo =
        err && typeof err === 'object' && 'resolution' in err
          ? (err as GoogleAuthErrorInfo)
          : parseFirebaseAuthError(err);

      showToast('warning', 'Google Sign-In Notice', errorInfo.resolution);
      return { success: false, error: errorInfo.resolution, errorInfo };
    }
  };

  const signOutGoogleAccount = async (): Promise<void> => {
    try {
      await logOutFromFirebase();
      setFirebaseUser(null);
      setIsGoogleAuthenticated(false);
      setIsAuthenticated(false);
      localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
      showToast('info', 'Signed Out', 'You have been disconnected from your Google account.');
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAgentWorkspace(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    if (auth.currentUser) {
      logOutFromFirebase().catch(() => {});
    }
    setFirebaseUser(null);
    setIsGoogleAuthenticated(false);
    showToast('info', 'Signed Out', 'You have returned to the AgriBridge Welcome screen.');
  };

  const loginAsJudge = (targetRole: UserRole) => {
    enterDemoPreview(targetRole);
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

  const markOrderPaid = (orderId: string, pawapayDepositId?: string) => {
    const update = (list: Order[]) =>
      list.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              paymentStatus: 'paid' as const,
              commissionStatus: 'paid' as CommissionStatus,
              pawapayDepositId: pawapayDepositId || ord.pawapayDepositId,
              updatedAt: new Date().toISOString(),
            }
          : ord
      );

    if (userOrders.some((o) => o.id === orderId)) {
      setUserOrders(update);
    } else {
      setDemoOrders(update);
    }
    showToast('success', 'Payment Confirmed', 'Mobile money payment verified via PawaPay Rwanda.');
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

  // ----------------------------------------------------
  // Price Negotiation Inbox & Portal Operations
  // ----------------------------------------------------
  const startNegotiationWithListing = (
    listing: ProduceListing,
    initialOfferPrice?: number,
    initialQuantityKg?: number,
    initialNotes?: string
  ): string => {
    const isBuyerRole = currentUser.role === 'buyer';
    const buyerId = isBuyerRole ? currentUser.id : 'user_buyer_1';
    const buyerName = isBuyerRole ? currentUser.fullName : 'Clarisse Umutoni';
    const buyerPhone = currentUser.phoneNumber || currentUser.phone || '+250 788 654 321';

    // Check if an active thread already exists for this listing with this buyer
    const existing = negotiationThreads.find(
      (t) => t.listingId === listing.id && (t.buyerId === buyerId || isBuyerRole)
    );

    if (existing) {
      setActiveThreadId(existing.id);
      showToast('info', 'Negotiation Opened', `Resumed active negotiation thread with ${existing.farmerName}.`);
      return existing.id;
    }

    const newThreadId = `thread_neg_${Date.now()}`;
    const quantity = initialQuantityKg || listing.minimumOrderKg || 500;
    const offerPrice = initialOfferPrice || Math.round(listing.unitPriceRwf * 0.95);
    const platformFee = Math.round(offerPrice * quantity * 0.025);

    const initialProposal: PriceProposal = {
      id: `prop_${Date.now()}`,
      proposedPricePerKgRwf: offerPrice,
      requestedQuantityKg: quantity,
      totalAmountRwf: offerPrice * quantity,
      platformFeeRwf: platformFee,
      proposedDeliveryOption: listing.deliveryOption,
      status: 'pending',
      proposerRole: 'buyer',
      termsNotes: initialNotes || `Initial price negotiation proposal for ${listing.variety}.`,
      createdAt: new Date().toISOString(),
    };

    const initialMsg: NegotiationMessage = {
      id: `msg_${Date.now()}`,
      threadId: newThreadId,
      senderId: buyerId,
      senderName: buyerName,
      senderRole: 'buyer',
      content:
        initialNotes ||
        `Muraho ${listing.farmerName}! I am interested in purchasing ${quantity.toLocaleString()} kg of ${listing.cropType.toUpperCase()} (${listing.variety}). I would like to propose a negotiated rate of ${offerPrice.toLocaleString()} RWF/kg. Looking forward to your response.`,
      priceProposal: initialProposal,
      timestamp: new Date().toISOString(),
    };

    const newThread: NegotiationThread = {
      id: newThreadId,
      listingId: listing.id,
      cropName: `${listing.cropType.toUpperCase()} - ${listing.variety}`,
      variety: listing.variety,
      cropType: listing.cropType,
      listingUnitPriceRwf: listing.unitPriceRwf,
      quantityAvailableKg: listing.quantityAvailableKg,
      minimumOrderKg: listing.minimumOrderKg,
      deliveryOption: listing.deliveryOption,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      farmerDistrict: listing.district || 'Nyagatare',
      farmerSector: listing.sector || 'Mimuri',
      buyerId,
      buyerName,
      buyerPhone,
      buyerCompany: isBuyerRole ? (currentUser.businessOrFarmName || 'Kigali Millers Ltd') : 'Kigali Millers Ltd',
      status: 'negotiating',
      currentAgreedPricePerKgRwf: offerPrice,
      latestMessageSnippet: initialMsg.content,
      lastMessageTimestamp: initialMsg.timestamp,
      unreadCountBuyer: 0,
      unreadCountFarmer: 1,
      latestPriceProposal: initialProposal,
      messages: [initialMsg],
    };

    setNegotiationThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    showToast(
      'success',
      'Negotiation Started',
      `Price offer sent to ${listing.farmerName} (${offerPrice.toLocaleString()} RWF/kg).`
    );
    return newThread.id;
  };

  const sendMessageInThread = (
    threadId: string,
    content: string,
    priceProposalData?: {
      offeredPricePerKg: number;
      offeredQuantityKg: number;
      deliveryOption?: string;
      pickupDate?: string;
      termsNotes?: string;
    }
  ) => {
    setNegotiationThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;

        const isCurrentFarmer =
          currentUser.role === 'farmer' ||
          currentUser.id === thread.farmerId ||
          (currentUser.role !== 'buyer' && currentUser.fullName === thread.farmerName);

        const senderRole = isCurrentFarmer ? 'farmer' : 'buyer';
        const senderId = currentUser.id || (isCurrentFarmer ? thread.farmerId : thread.buyerId);
        const senderName = currentUser.fullName || (isCurrentFarmer ? thread.farmerName : thread.buyerName);

        let newProposal: PriceProposal | undefined = undefined;
        if (priceProposalData && priceProposalData.offeredPricePerKg > 0) {
          const totalAmt = priceProposalData.offeredPricePerKg * priceProposalData.offeredQuantityKg;
          newProposal = {
            id: `prop_${Date.now()}`,
            proposedPricePerKgRwf: priceProposalData.offeredPricePerKg,
            requestedQuantityKg: priceProposalData.offeredQuantityKg,
            totalAmountRwf: totalAmt,
            platformFeeRwf: Math.round(totalAmt * 0.025),
            proposedDeliveryOption: priceProposalData.deliveryOption || thread.deliveryOption,
            proposedPickupDate: priceProposalData.pickupDate,
            termsNotes: priceProposalData.termsNotes,
            status: 'pending',
            proposerRole: senderRole,
            createdAt: new Date().toISOString(),
          };
        }

        const newMsg: NegotiationMessage = {
          id: `msg_${Date.now()}`,
          threadId,
          senderId,
          senderName,
          senderRole,
          content,
          priceProposal: newProposal,
          timestamp: new Date().toISOString(),
        };

        const updatedMessages = [...thread.messages, newMsg];

        return {
          ...thread,
          messages: updatedMessages,
          latestMessageSnippet: content,
          lastMessageTimestamp: newMsg.timestamp,
          latestPriceProposal: newProposal || thread.latestPriceProposal,
          unreadCountBuyer: isCurrentFarmer ? (thread.unreadCountBuyer || 0) + 1 : 0,
          unreadCountFarmer: !isCurrentFarmer ? (thread.unreadCountFarmer || 0) + 1 : 0,
        };
      })
    );
    showToast('info', 'Message Sent', 'Message and price update delivered.');
  };

  const respondToProposal = (
    threadId: string,
    _proposalId: string,
    action: 'accept' | 'decline' | 'counter',
    counterPricePerKg?: number,
    counterQuantityKg?: number,
    counterNotes?: string
  ) => {
    setNegotiationThreads((prev) =>
      prev.map((thread) => {
        if (thread.id !== threadId) return thread;

        const isCurrentFarmer =
          currentUser.role === 'farmer' ||
          currentUser.id === thread.farmerId ||
          (currentUser.role !== 'buyer' && currentUser.fullName === thread.farmerName);
        const responderRole = isCurrentFarmer ? 'farmer' : 'buyer';
        const responderName = currentUser.fullName || (isCurrentFarmer ? thread.farmerName : thread.buyerName);

        if (action === 'accept') {
          const activeProposal = thread.latestPriceProposal;
          const agreedPrice =
            (activeProposal ? activeProposal.proposedPricePerKgRwf : thread.currentAgreedPricePerKgRwf) ||
            thread.listingUnitPriceRwf ||
            0;
          const quantity = activeProposal ? activeProposal.requestedQuantityKg : (thread.minimumOrderKg || 500);

          const updatedProposal: PriceProposal | undefined = activeProposal
            ? { ...activeProposal, status: 'accepted' }
            : undefined;

          const systemNotice: NegotiationMessage = {
            id: `msg_sys_${Date.now()}`,
            threadId,
            senderId: 'system',
            senderName: 'AgriBridge Negotiation Escrow',
            senderRole: 'system',
            content: `Price Agreement Reached! ${responderName} accepted the offer of ${agreedPrice.toLocaleString()} RWF/kg for ${quantity.toLocaleString()} kg. Both buyer and farmer can now proceed to create the formal order with 2.5% MoMo escrow protection.`,
            timestamp: new Date().toISOString(),
          };

          showToast(
            'success',
            'Deal Agreed!',
            `Price locked at ${agreedPrice.toLocaleString()} RWF/kg. Ready to create binding order.`
          );

          return {
            ...thread,
            status: 'price_agreed',
            currentAgreedPricePerKgRwf: agreedPrice,
            latestPriceProposal: updatedProposal,
            latestMessageSnippet: `Agreed: ${agreedPrice.toLocaleString()} RWF/kg`,
            lastMessageTimestamp: systemNotice.timestamp,
            messages: [...thread.messages, systemNotice],
          };
        }

        if (action === 'decline') {
          const updatedProposal: PriceProposal | undefined = thread.latestPriceProposal
            ? { ...thread.latestPriceProposal, status: 'declined' }
            : undefined;

          const systemNotice: NegotiationMessage = {
            id: `msg_sys_${Date.now()}`,
            threadId,
            senderId: 'system',
            senderName: 'AgriBridge Negotiation Escrow',
            senderRole: 'system',
            content: `${responderName} declined the current price proposal. Negotiation remains open for new bids or counter-offers.`,
            timestamp: new Date().toISOString(),
          };

          showToast('info', 'Offer Declined', 'Price proposal was declined. You can propose a new price.');

          return {
            ...thread,
            latestPriceProposal: updatedProposal,
            latestMessageSnippet: 'Proposal declined',
            lastMessageTimestamp: systemNotice.timestamp,
            messages: [...thread.messages, systemNotice],
          };
        }

        if (action === 'counter' && counterPricePerKg && counterPricePerKg > 0) {
          const qty = counterQuantityKg || thread.latestPriceProposal?.requestedQuantityKg || (thread.minimumOrderKg || 500);
          const totalAmt = counterPricePerKg * qty;
          const platformFee = Math.round(totalAmt * 0.025);

          const counterProposal: PriceProposal = {
            id: `prop_${Date.now()}`,
            proposedPricePerKgRwf: counterPricePerKg,
            requestedQuantityKg: qty,
            totalAmountRwf: totalAmt,
            platformFeeRwf: platformFee,
            proposedDeliveryOption: thread.deliveryOption,
            status: 'pending',
            proposerRole: responderRole,
            termsNotes: counterNotes,
            createdAt: new Date().toISOString(),
          };

          const counterMsg: NegotiationMessage = {
            id: `msg_${Date.now()}`,
            threadId,
            senderId: currentUser.id || (isCurrentFarmer ? thread.farmerId : thread.buyerId),
            senderName: responderName,
            senderRole: responderRole,
            content:
              counterNotes ||
              `${responderName} made a counter-offer of ${counterPricePerKg.toLocaleString()} RWF/kg for ${qty.toLocaleString()} kg.`,
            priceProposal: counterProposal,
            timestamp: new Date().toISOString(),
          };

          showToast(
            'info',
            'Counter-Offer Submitted',
            `Proposed ${counterPricePerKg.toLocaleString()} RWF/kg (${qty.toLocaleString()} kg).`
          );

          return {
            ...thread,
            status: 'negotiating',
            latestPriceProposal: counterProposal,
            latestMessageSnippet: counterMsg.content,
            lastMessageTimestamp: counterMsg.timestamp,
            messages: [...thread.messages, counterMsg],
            unreadCountBuyer: isCurrentFarmer ? (thread.unreadCountBuyer || 0) + 1 : 0,
            unreadCountFarmer: !isCurrentFarmer ? (thread.unreadCountFarmer || 0) + 1 : 0,
          };
        }

        return thread;
      })
    );
  };

  const convertThreadToOrder = (threadId: string): Order | null => {
    const thread = negotiationThreads.find((t) => t.id === threadId);
    if (!thread) {
      showToast('warning', 'Thread Not Found', 'Could not locate negotiation details.');
      return null;
    }

    const price =
      thread.currentAgreedPricePerKgRwf ||
      thread.latestPriceProposal?.proposedPricePerKgRwf ||
      thread.listingUnitPriceRwf;
    const quantity = thread.latestPriceProposal?.requestedQuantityKg || thread.minimumOrderKg || 500;
    const totalAmount = price * quantity;
    const commission = Math.round(totalAmount * 0.025);
    const orderId = `ord_neg_${Date.now().toString().slice(-6)}`;

    const newOrder: Order = {
      id: orderId,
      buyerId: thread.buyerId,
      buyerName: thread.buyerName,
      buyerPhone: thread.buyerPhone,
      sellerId: thread.farmerId,
      sellerName: thread.farmerName,
      cropType: (thread.cropType || 'maize') as any,
      variety: thread.variety,
      quantityKg: quantity,
      pricePerKgRwf: price,
      totalAmountRwf: totalAmount,
      status: 'pending',
      commissionStatus: 'pending',
      commissionAmountRwf: commission,
      deliveryLocation: `${thread.deliveryOption} (${thread.farmerSector || 'Nyagatare'})`,
      pickupDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      isDemo: false,
      createdAt: new Date().toISOString(),
    };

    setUserOrders((prev) => [newOrder, ...prev]);

    const sysOrderMsg: NegotiationMessage = {
      id: `msg_sys_ord_${Date.now()}`,
      threadId,
      senderId: 'system',
      senderName: 'AgriBridge Order Engine',
      senderRole: 'system',
      content: `Purchase Order #${orderId} generated at negotiated price ${price.toLocaleString()} RWF/kg for ${quantity.toLocaleString()} kg (Total: ${totalAmount.toLocaleString()} RWF with ${commission.toLocaleString()} RWF 2.5% MoMo escrow protection fee). Ready for PawaPay checkout.`,
      timestamp: new Date().toISOString(),
    };

    setNegotiationThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              status: 'order_created',
              orderId,
              latestMessageSnippet: `Order #${orderId} generated`,
              lastMessageTimestamp: sysOrderMsg.timestamp,
              messages: [...t.messages, sysOrderMsg],
            }
          : t
      )
    );

    showToast(
      'success',
      'Order Created from Negotiation!',
      `Order #${orderId} ready for PawaPay Mobile Money escrow checkout.`
    );

    return newOrder;
  };

  const unreadNegotiationsCount = negotiationThreads.reduce((sum, t) => {
    const isFarmer = currentUser.role === 'farmer' || currentUser.id === t.farmerId;
    return sum + (isFarmer ? t.unreadCountFarmer || 0 : t.unreadCountBuyer || 0);
  }, 0);

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
        isAuthenticated,
        setIsAuthenticated,
        firebaseUser,
        isGoogleAuthenticated,
        signInWithGoogleAccount,
        signOutGoogleAccount,
        activePortfolio,
        userPortfolios,
        isAgentWorkspace,
        registerPortfolioAccount,
        loginWithCredentials,
        loginAsAgent,
        switchPortfolio,
        createPortfolio,
        updatePortfolio,
        recoverAccount,
        enterDemoPreview,
        isPortfolioModalOpen,
        setIsPortfolioModalOpen,
        login,
        logout,
        loginAsJudge,
        savedAccounts,
        saveUserCredentials,
        deleteSavedAccount,
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
        negotiationThreads,
        activeThreadId,
        setActiveThreadId,
        startNegotiationWithListing,
        sendMessageInThread,
        respondToProposal,
        convertThreadToOrder,
        unreadNegotiationsCount,
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
        markOrderPaid,
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
