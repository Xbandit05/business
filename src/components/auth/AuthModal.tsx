import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole, UserCategory, SavedUserCredentials } from '../../types/index.ts';
import { getAllDistricts, getSectorsForDistrict } from '../../data/districts.ts';
import { DEMO_USERS } from '../../data/nyagatare.ts';
import {
  X,
  UserCheck,
  Shield,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  KeyRound,
  Award,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  LogOut,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Sprout,
  Package,
  Briefcase,
  Trash2,
  BookmarkCheck,
  Copy,
  ExternalLink,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { GoogleAuthErrorInfo } from '../../lib/firebase.ts';

const REQUIRED_UNIVERSAL_PASSWORD = '123';

export const AuthModal: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    login,
    logout,
    loginAsJudge,
    savedAccounts,
    saveUserCredentials,
    deleteSavedAccount,
    firebaseUser,
    isGoogleAuthenticated,
    signInWithGoogleAccount,
    signOutGoogleAccount,
  } = useApp();

  const allDistricts = getAllDistricts();

  // Wizard Step: 1 = Sign In credentials, 2 = Personalize Niche & Save Credentials
  const [step, setStep] = useState<1 | 2>(1);

  // User Group Selection
  const [selectedGroup, setSelectedGroup] = useState<UserCategory>('seller');
  const [googleAuthError, setGoogleAuthError] = useState<GoogleAuthErrorInfo | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Login Input Method: 'phone' or 'email'
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleAuthError(null);
    try {
      const res = await signInWithGoogleAccount();
      if (res.success) {
        setIsAuthModalOpen(false);
      } else if (res.errorInfo) {
        setGoogleAuthError(res.errorInfo);
      }
    } catch {
      // Handled in context
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Step 2 Niche & Personalization State
  const [fullName, setFullName] = useState('');
  const [businessOrFarmName, setBusinessOrFarmName] = useState('');
  const [nicheSpecialty, setNicheSpecialty] = useState('');
  const [tradeVolumeScale, setTradeVolumeScale] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Nyagatare');
  const [selectedSector, setSelectedSector] = useState<string>('Mimuri');
  const [rememberOnDevice, setRememberOnDevice] = useState(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const availableSectors = getSectorsForDistrict(selectedDistrict);

  // Reset or initialize fields when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep(1);
      setPassword('');
      setPasswordError(null);
      setSaveSuccessNotice(false);

      if (currentUser && !currentUser.isDemo) {
        setFullName(currentUser.fullName || '');
        setPhoneNumber(currentUser.phoneNumber || '');
        setEmailAddress(currentUser.email || '');
        setSelectedGroup(currentUser.category || (currentUser.role === 'farmer' ? 'seller' : (currentUser.role as UserCategory)));
        setSelectedDistrict(currentUser.district || 'Nyagatare');
        setSelectedSector(currentUser.sector || 'Mimuri');
        setBusinessOrFarmName(currentUser.businessOrFarmName || '');
        setNicheSpecialty(currentUser.nicheSpecialty || '');
        setTradeVolumeScale(currentUser.tradeVolumeScale || '');
      } else {
        // Pre-fill default phone or group
        if (!phoneNumber) setPhoneNumber('+250 788 123 456');
        if (!emailAddress) setEmailAddress('farmer@agribridge.rw');
      }
    }
  }, [isAuthModalOpen]);

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const secs = getSectorsForDistrict(dist);
    if (secs.length > 0) {
      setSelectedSector(secs[0].name);
    }
  };

  // Niche presets per category
  const sellerNiches = [
    'Maize & Cereals (Ibigori)',
    'Beans & Legumes (Ibihyimbo)',
    'Rice Marshland Farming (Umuceri)',
    'Cassava & Tubers (Imyumbati)',
    'Horticulture & Vegetables (Imboga)',
    'Dairy & Animal Fodder',
  ];

  const sellerScales = [
    'Smallholder (< 1 Hectare)',
    'Medium Commercial (1 - 5 Ha)',
    'Large Co-op Cluster (> 5 Ha)',
  ];

  const buyerNiches = [
    'Commercial Flour Miller (Uruganda rw\'ifu)',
    'Bulk Commodity Aggregator (Ukora aggregation)',
    'Food Processor & Regional Exporter',
    'Institutional Buyer (Schools, Hospitals, Hotels)',
    'Wholesale Trader & Market Distributor',
  ];

  const buyerScales = [
    'Spot Buying (< 2 Tons per trade)',
    'Wholesale Volume (2 - 10 Tons)',
    'Industrial Bulk Supply (> 10 Tons)',
  ];

  const supplierNiches = [
    'Certified Hybrid & Quality Seeds (Imbuto)',
    'MINAGRI Mineral & Organic Fertilizers (DAP, NPK, Urea)',
    'Crop Protection & Certified Safety PPE (Imiti)',
    'Solar Pumps & Drip Irrigation Kits (Kuhira)',
    'Farm Machinery, Implements & Shellers',
  ];

  const supplierScales = [
    'Sector Retail Agro-Input Shop',
    'District Central Agro-Hub',
    'Regional Certified Input Distributor',
  ];

  // Quick Demo Autofill
  const handleAutoFillDemo = (demoUser: typeof DEMO_USERS[0]) => {
    setSelectedGroup(demoUser.category || (demoUser.role === 'farmer' ? 'seller' : (demoUser.role as UserCategory)));
    setPhoneNumber(demoUser.phoneNumber);
    setEmailAddress(demoUser.email || '');
    setFullName(demoUser.fullName);
    setPassword(REQUIRED_UNIVERSAL_PASSWORD);
    setPasswordError(null);
    setSelectedDistrict(demoUser.district.includes('Kigali') ? 'Gasabo' : demoUser.district);
    setSelectedSector(demoUser.sector);
    setBusinessOrFarmName(demoUser.businessOrFarmName || '');
    setNicheSpecialty(demoUser.nicheSpecialty || '');
    setTradeVolumeScale(demoUser.tradeVolumeScale || '');
  };

  // Step 1 Validation & Next
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check identifier
    const identifier = loginMethod === 'phone' ? phoneNumber.trim() : emailAddress.trim();
    if (!identifier) {
      setPasswordError(
        loginMethod === 'phone'
          ? (language === 'rw' ? 'Shyiramo numero ya telefone' : 'Please enter your phone number')
          : (language === 'rw' ? 'Shyiramo aderesi ya imeyili' : 'Please enter your email address')
      );
      return;
    }

    // STRICT PASSWORD CHECK: ONLY '123' IS ALLOWED FOR ALL USERS
    if (password !== REQUIRED_UNIVERSAL_PASSWORD) {
      setPasswordError(
        language === 'rw'
          ? 'Ijambobanga ntabwo ariryo! Ijambobanga rya AgriBridge kuri bose ni "123".'
          : 'Incorrect password! The universal AgriBridge login password for all users is "123".'
      );
      return;
    }

    setPasswordError(null);

    // Default full name if empty
    if (!fullName) {
      if (selectedGroup === 'seller') setFullName('IDRIS Agaba Otin');
      else if (selectedGroup === 'buyer') setFullName('Clarisse Umutoni');
      else if (selectedGroup === 'supplier') setFullName('Aphrodis Mukunzi');
      else if (selectedGroup === 'agent') setFullName('Emmanuel Habimana');
      else setFullName('Beata Mukamazimpaka');
    }

    // Default niche if empty
    if (!nicheSpecialty) {
      if (selectedGroup === 'seller') setNicheSpecialty(sellerNiches[0]);
      else if (selectedGroup === 'buyer') setNicheSpecialty(buyerNiches[0]);
      else if (selectedGroup === 'supplier') setNicheSpecialty(supplierNiches[0]);
      else setNicheSpecialty('Agricultural Community Coordination');
    }

    if (!tradeVolumeScale) {
      if (selectedGroup === 'seller') setTradeVolumeScale(sellerScales[1]);
      else if (selectedGroup === 'buyer') setTradeVolumeScale(buyerScales[1]);
      else if (selectedGroup === 'supplier') setTradeVolumeScale(supplierScales[0]);
    }

    // Proceed to Step 2
    setStep(2);
  };

  // Step 2 Save Credentials & Niche
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();

    const roleMap: Record<UserCategory, UserRole> = {
      seller: 'farmer',
      buyer: 'buyer',
      supplier: 'supplier',
      agent: 'agent',
      expert: 'expert',
      admin: 'admin',
    };

    const finalRole = roleMap[selectedGroup] || 'farmer';
    const finalName = fullName.trim() || `${selectedGroup.toUpperCase()} Member`;

    setSaveSuccessNotice(true);

    setTimeout(() => {
      saveUserCredentials({
        fullName: finalName,
        phoneNumber: phoneNumber.trim(),
        email: emailAddress.trim() || undefined,
        role: finalRole,
        category: selectedGroup,
        nicheSpecialty: nicheSpecialty.trim(),
        businessOrFarmName: businessOrFarmName.trim() || undefined,
        tradeVolumeScale: tradeVolumeScale.trim() || undefined,
        district: selectedDistrict,
        sector: selectedSector,
        isVerified: true,
      });
    }, 450);
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-5 sm:p-6 space-y-5 max-h-[94vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-white shadow-xs">
              <Shield className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 flex items-center gap-2">
                <span>AgriBridge Identity & Login Portal</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Universal Password: 123
                </span>
              </h3>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                {language === 'rw'
                  ? 'Injira cyangwa uhitemo icyiciro cy\'ubuhinzi bubereye umwirondoro wawe'
                  : 'Sign in, select your agricultural niche, and personalize your profile'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-stone-50 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step === 1 ? 'text-emerald-800 dark:text-emerald-300 font-bold' : 'text-stone-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 1 ? 'bg-emerald-800 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}`}>
              1
            </span>
            <span>{language === 'rw' ? 'Injira (Email / Telefone & Ijambobanga)' : 'Sign In (Email/Phone & Password)'}</span>
          </div>

          <div className="w-8 h-px bg-stone-300 dark:bg-stone-700 mx-2" />

          <div className={`flex items-center gap-2 ${step === 2 ? 'text-emerald-800 dark:text-emerald-300 font-bold' : 'text-stone-500'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${step === 2 ? 'bg-emerald-800 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}`}>
              2
            </span>
            <span>{language === 'rw' ? 'Bika Umwirondoro & Hitamo Icyiciro' : 'Save Credentials & Niche'}</span>
          </div>
        </div>

        {/* ================= STEP 1: LOGIN PANEL ================= */}
        {step === 1 && (
          <div className="space-y-4">
            
            {/* Google Authentication Section */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 dark:from-stone-850 dark:via-stone-800 dark:to-stone-850 border border-emerald-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{language === 'rw' ? 'Kwinjira na Konti ya Google' : 'Google Account Sign-In'}</span>
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-300/60">
                  Secure Firebase Auth
                </span>
              </div>

              {isGoogleAuthenticated && firebaseUser ? (
                <div className="flex items-center justify-between gap-3 bg-white dark:bg-stone-900 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700 text-xs shadow-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {firebaseUser.photoURL ? (
                      <img src={firebaseUser.photoURL} alt="Google avatar" className="w-8 h-8 rounded-full border border-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                        {(firebaseUser.displayName || 'G')[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 dark:text-stone-100 truncate flex items-center gap-1.5">
                        <span>{firebaseUser.displayName || 'Google Member'}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <div className="text-[11px] text-stone-500 truncate">
                        {firebaseUser.email}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={signOutGoogleAccount}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors shrink-0"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleLoading}
                    className="w-full py-2.5 px-4 bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-100 font-bold rounded-xl border border-stone-300 dark:border-stone-700 shadow-xs transition-all flex items-center justify-center gap-2.5 hover:border-emerald-500 text-xs sm:text-sm cursor-pointer disabled:opacity-60"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>
                      {isGoogleLoading
                        ? (language === 'rw' ? 'Guhuza na Google...' : 'Connecting to Google...')
                        : (language === 'rw' ? 'Komeza ukoresheje Google' : 'Continue with Google Account')}
                    </span>
                  </button>

                  {googleAuthError && (
                    <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs space-y-2 text-left animate-in fade-in duration-150">
                      <div className="flex items-center justify-between font-bold text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Firebase Auth Diagnostic Notice</span>
                        </div>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-amber-200/80 dark:bg-amber-900 text-amber-950 dark:text-amber-200">
                          {googleAuthError.code}
                        </span>
                      </div>

                      <p className="text-stone-700 dark:text-stone-300">
                        {googleAuthError.resolution}
                      </p>

                      {googleAuthError.code === 'auth/unauthorized-domain' && (
                        <div className="space-y-2 pt-1.5 border-t border-amber-200 dark:border-amber-800">
                          <div className="font-semibold text-stone-800 dark:text-stone-200 text-[11px]">
                            Domains to add in Firebase Console &gt; Authentication &gt; Settings &gt; Authorized domains:
                          </div>

                          {/* Vercel App Domain */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-stone-500 w-14 shrink-0">Vercel:</span>
                            <code className="flex-1 px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-emerald-300 dark:border-emerald-700 rounded-lg font-mono text-xs font-bold text-emerald-800 dark:text-emerald-300 select-all truncate">
                              agribridge-rw.vercel.app
                            </code>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText('agribridge-rw.vercel.app');
                                setCopiedDomain(true);
                                setTimeout(() => setCopiedDomain(false), 2000);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 rounded-lg font-bold text-white flex items-center gap-1.5 shrink-0 cursor-pointer text-xs shadow-2xs"
                            >
                              {copiedDomain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedDomain ? 'Copied' : 'Copy Vercel Domain'}</span>
                            </button>
                          </div>

                          {/* Current Environment Domain (if different from Vercel) */}
                          {googleAuthError.domain !== 'agribridge-rw.vercel.app' && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-stone-500 w-14 shrink-0">Preview:</span>
                              <code className="flex-1 px-2.5 py-1 bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-700 rounded-lg font-mono text-[11px] text-stone-700 dark:text-stone-300 select-all truncate">
                                {googleAuthError.domain}
                              </code>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(googleAuthError.domain);
                                }}
                                className="px-2 py-1 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 rounded text-[11px] font-semibold text-stone-700 dark:text-stone-300 shrink-0 cursor-pointer"
                              >
                                Copy
                              </button>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            <a
                              href={googleAuthError.consoleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-400 hover:underline"
                            >
                              <span>1. Firebase Authorized Domains</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <a
                              href={googleAuthError.gcpConsoleUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-sky-800 dark:text-sky-400 hover:underline"
                            >
                              <span>2. Google Cloud OAuth Client</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setLoginMethod('email');
                                setEmailAddress('heisxbandit@gmail.com');
                              }}
                              className="ml-auto text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline text-[11px] cursor-pointer"
                            >
                              Use email directly below
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                {language === 'rw' ? 'Cyangwa ukoreshe Umwirondoro' : 'Or sign in with Phone / Password'}
              </span>
              <div className="flex-grow border-t border-stone-200 dark:border-stone-800"></div>
            </div>

            {/* User Groups Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wide mb-1.5">
                {language === 'rw' ? 'Hitamo Icyiciro Ukoreramo (User Group) *' : 'Select Your User Group *'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedGroup('seller')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedGroup === 'seller'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <Sprout className="w-4 h-4 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                  <div className="text-[11px] font-bold">Seller / Farmer</div>
                  <div className="text-[9px] text-stone-500">Umuhinzi</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('buyer')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedGroup === 'buyer'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
                  <div className="text-[11px] font-bold">Buyer / Trader</div>
                  <div className="text-[9px] text-stone-500">Umuguzi</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('supplier')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedGroup === 'supplier'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <Package className="w-4 h-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                  <div className="text-[11px] font-bold">Agro-Supplier</div>
                  <div className="text-[9px] text-stone-500">Ugemura ibikoresho</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('agent')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedGroup === 'agent'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <UserCheck className="w-4 h-4 mx-auto mb-1 text-indigo-600 dark:text-indigo-400" />
                  <div className="text-[11px] font-bold">Community Agent</div>
                  <div className="text-[9px] text-stone-500">Umujyanama</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('admin')}
                  className={`p-2 rounded-xl text-center border transition-all ${
                    selectedGroup === 'admin'
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 shadow-2xs'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/70 dark:bg-stone-800/40 text-stone-700 dark:text-stone-300 hover:border-stone-300'
                  }`}
                >
                  <Shield className="w-4 h-4 mx-auto mb-1 text-stone-600 dark:text-stone-400" />
                  <div className="text-[11px] font-bold">District Admin</div>
                  <div className="text-[9px] text-stone-500">Ubuyobozi</div>
                </button>
              </div>
            </div>

            {/* Step 1 Sign In Form */}
            <form onSubmit={handleStep1Submit} className="space-y-3.5 text-xs">
              
              {/* Toggle Login Identifier Method */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-stone-700 dark:text-stone-300">
                    {language === 'rw' ? 'Kwinjira ukoresheje:' : 'Log in using:'}
                  </label>
                  <div className="inline-flex p-0.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone')}
                      className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                        loginMethod === 'phone'
                          ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Phone className="w-3 h-3" />
                      <span>Phone (Telefone)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email')}
                      className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                        loginMethod === 'email'
                          ? 'bg-white dark:bg-stone-700 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                          : 'text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email (Imeyili)</span>
                    </button>
                  </div>
                </div>

                {/* Input: Phone or Email */}
                {loginMethod === 'phone' ? (
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+250 788 123 456"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono tabular-nums text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="e.g. farmer@agribridge.rw or buyer@kigali.rw"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 text-xs focus:ring-1 focus:ring-emerald-600 focus:outline-hidden"
                    />
                  </div>
                )}
              </div>

              {/* Password Input (Strictly '123' for all users) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{language === 'rw' ? 'Ijambobanga (Password) *' : 'Password *'}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPassword(REQUIRED_UNIVERSAL_PASSWORD);
                      setPasswordError(null);
                    }}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'rw' ? 'Kanda hano wandike "123"' : 'Click to autofill "123"'}</span>
                  </button>
                </div>

                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder={language === 'rw' ? 'Injiza "123"' : 'Enter universal password "123"'}
                    className={`w-full pl-9 pr-10 py-2 bg-stone-50 dark:bg-stone-800 border rounded-lg text-stone-900 dark:text-stone-100 font-mono text-xs focus:outline-hidden ${
                      passwordError
                        ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-stone-300 dark:border-stone-700 focus:ring-1 focus:ring-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500 dark:text-stone-400">
                  <span>
                    {language === 'rw'
                      ? 'Ijambobanga rya AgriBridge kuri bose ni '
                      : 'Configured AgriBridge password for all users: '}
                    <strong className="text-emerald-800 dark:text-emerald-300 font-mono px-1 py-0.2 bg-emerald-50 dark:bg-emerald-950/60 rounded border border-emerald-200 dark:border-emerald-800">
                      123
                    </strong>
                  </span>
                </div>
              </div>

              {/* Password Error Alert */}
              {passwordError && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-lg flex items-start gap-2 text-rose-800 dark:text-rose-300 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                  <div>
                    <div className="font-bold">{passwordError}</div>
                    <div className="text-[11px] mt-0.5 opacity-90">
                      {language === 'rw'
                        ? 'Andika "123" mu mwanya w\'ijambobanga kugirango ukomeze.'
                        : 'Please enter "123" into the password field to continue.'}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Step 1 Button */}
              <button
                type="submit"
                className="w-full py-2.5 font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <span>
                  {language === 'rw'
                    ? 'Komeza: Hitamo Icyiciro & Bika Umwirondoro'
                    : 'Continue: Personalize Niche & Save Credentials'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Accounts Fast-Picker */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'rw' ? 'Kwinjira byihuse ku bademo' : '1-Click Persona Pre-fill (Password: 123)'}</span>
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                {DEMO_USERS.map((demo) => (
                  <button
                    key={demo.id}
                    type="button"
                    onClick={() => handleAutoFillDemo(demo)}
                    className="p-2 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 hover:border-emerald-500 hover:bg-emerald-50/40 text-left transition-colors"
                  >
                    <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                      {demo.fullName.split(' ')[0]} ({demo.role})
                    </div>
                    <div className="text-[10px] text-stone-500 truncate">{demo.sector} · {demo.nicheSpecialty || demo.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Saved Accounts on This Device (if any) */}
            {savedAccounts.length > 0 && (
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wide flex items-center gap-1.5">
                    <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'rw' ? 'Imyirondoro yabitswe kuri iyi telefone' : 'Saved Accounts on This Device'}</span>
                  </span>
                </div>
                <div className="space-y-1.5">
                  {savedAccounts.map((acc) => (
                    <div
                      key={acc.id}
                      className="p-2 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 flex items-center justify-between text-xs"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          login(acc.fullName, acc.phoneNumber, acc.role, acc.district, acc.sector, {
                            email: acc.email,
                            category: acc.category,
                            nicheSpecialty: acc.nicheSpecialty,
                            businessOrFarmName: acc.businessOrFarmName,
                            tradeVolumeScale: acc.tradeVolumeScale,
                          });
                        }}
                        className="text-left flex-1 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                      >
                        <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                          <span>{acc.fullName}</span>
                          <span className="text-[9px] uppercase px-1.5 py-0.2 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded font-bold">
                            {acc.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500">
                          {acc.phoneNumber} · {acc.district} ({acc.sector}) {acc.nicheSpecialty ? `· ${acc.nicheSpecialty}` : ''}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteSavedAccount(acc.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove saved account from browser"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: PERSONALIZE NICHE & SAVE CREDENTIALS ================= */}
        {step === 2 && (
          <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs animate-in fade-in">
            
            {/* Navigation & Header */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'rw' ? 'Gusubira inyuma' : 'Back to Credentials'}</span>
              </button>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                {language === 'rw' ? 'Icyiciro cyatoranyijwe:' : 'Active Category:'}{' '}
                <strong className="uppercase">{selectedGroup}</strong>
              </span>
            </div>

            {/* Category Selector Cards */}
            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                {language === 'rw' ? '1. Hitamo Icyiciro Nyacyo Cyangwa Ugihindure:' : '1. Confirm or Switch Your Category:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGroup('seller')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedGroup === 'seller'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                    <Sprout className="w-4 h-4 text-emerald-600" />
                    <span>Seller / Farmer</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Umuhinzi ugurisha umusaruro</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('buyer')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedGroup === 'buyer'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                    <ShoppingBag className="w-4 h-4 text-amber-600" />
                    <span>Buyer / Trader</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Umuguzi w'ibihingwa</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGroup('supplier')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedGroup === 'supplier'
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                    <Package className="w-4 h-4 text-blue-600" />
                    <span>Agro-Supplier</span>
                  </div>
                  <div className="text-[10px] text-stone-500 mt-0.5">Ugemura inyongeramusaruro</div>
                </button>
              </div>
            </div>

            {/* Niche Specialization Selection */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/70 space-y-2.5">
              <label className="block font-bold text-stone-800 dark:text-stone-200">
                {language === 'rw' ? '2. Hitamo Umwihariko w\'Ibyo Ukora (Personalize Niche) *' : '2. Personalize Your Agricultural Niche *'}
              </label>

              {/* Chips for Selected Group */}
              <div className="flex flex-wrap gap-1.5">
                {selectedGroup === 'seller' &&
                  sellerNiches.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setNicheSpecialty(niche)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        nicheSpecialty === niche
                          ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                          : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-400'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}

                {selectedGroup === 'buyer' &&
                  buyerNiches.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setNicheSpecialty(niche)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        nicheSpecialty === niche
                          ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                          : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-400'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}

                {selectedGroup === 'supplier' &&
                  supplierNiches.map((niche) => (
                    <button
                      key={niche}
                      type="button"
                      onClick={() => setNicheSpecialty(niche)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        nicheSpecialty === niche
                          ? 'bg-emerald-800 text-white font-bold shadow-2xs'
                          : 'bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-400'
                      }`}
                    >
                      {niche}
                    </button>
                  ))}

                {selectedGroup !== 'seller' && selectedGroup !== 'buyer' && selectedGroup !== 'supplier' && (
                  <input
                    type="text"
                    value={nicheSpecialty}
                    onChange={(e) => setNicheSpecialty(e.target.value)}
                    placeholder="e.g. Farmer Mobilization & Quality Aggregation"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  />
                )}
              </div>

              {/* Volume Scale / Operating Size */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1">
                  {selectedGroup === 'seller'
                    ? (language === 'rw' ? 'Ingano y\'ubutaka buhingwa (Cultivated Land Scale):' : 'Cultivated Land Scale:')
                    : selectedGroup === 'buyer'
                    ? (language === 'rw' ? 'Ingano y\'ibyo ugura (Purchase Volume Scale):' : 'Purchase Volume Scale:')
                    : (language === 'rw' ? 'Urwego rw\'ubucuruzi (Distribution Reach):' : 'Distribution Reach:')}
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(selectedGroup === 'seller' ? sellerScales : selectedGroup === 'buyer' ? buyerScales : supplierScales).map(
                    (scale) => (
                      <button
                        key={scale}
                        type="button"
                        onClick={() => setTradeVolumeScale(scale)}
                        className={`p-1.5 rounded-lg text-[10px] font-semibold text-center border transition-colors ${
                          tradeVolumeScale === scale
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-500 dark:bg-emerald-950 dark:text-emerald-200'
                            : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        {scale}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* User Identification Fields */}
            <div className="space-y-3">
              <label className="block font-bold text-stone-800 dark:text-stone-200">
                {language === 'rw' ? '3. Amakuru y\'Umwirondoro Azabikwa (Credentials to Save):' : '3. Credentials to Save:'}
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {language === 'rw' ? 'Amazina Yombi *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. IDRIS Agaba Otin"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {selectedGroup === 'seller'
                      ? (language === 'rw' ? 'Izina ry\'umurima cyangwa Koperative' : 'Farm or Co-op Name')
                      : (language === 'rw' ? 'Izina ry\'ubucuruzi / Sosiyete' : 'Business or Enterprise Name')}
                  </label>
                  <input
                    type="text"
                    value={businessOrFarmName}
                    onChange={(e) => setBusinessOrFarmName(e.target.value)}
                    placeholder={
                      selectedGroup === 'seller'
                        ? 'e.g. COOPAMA Mimuri Maize Union'
                        : selectedGroup === 'buyer'
                        ? 'e.g. Kigali Grain Millers Ltd'
                        : 'e.g. Nyagatare Agro-Inputs Hub'
                    }
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 text-xs"
                  />
                </div>
              </div>

              {/* Geographic District and Sector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    District (Akarere) *
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-semibold text-xs"
                  >
                    {allDistricts.map((d) => (
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
                    value={selectedSector}
                    onChange={(e) => setSelectedSector(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 text-xs"
                  >
                    {availableSectors.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name} Sector
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Remember Credentials Checkbox */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="rememberDevice"
                checked={rememberOnDevice}
                onChange={(e) => setRememberOnDevice(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-emerald-800 focus:ring-emerald-700"
              />
              <label htmlFor="rememberDevice" className="text-xs text-stone-800 dark:text-stone-200 cursor-pointer">
                <span className="font-bold">
                  {language === 'rw'
                    ? 'Bika iyi myirondoro kuri iyi telefone / mudasobwa'
                    : 'Save and remember these credentials on this device'}
                </span>
                <span className="block text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  {language === 'rw'
                    ? 'Bizatuma ukomeza gukoresha AgriBridge ako kanya ukoresheje ijambobanga "123".'
                    : 'Permits 1-click automatic access to your personalized dashboard with password "123".'}
                </span>
              </label>
            </div>

            {/* Save Action Button */}
            <button
              type="submit"
              disabled={saveSuccessNotice}
              className={`w-full py-2.5 font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 text-xs text-white ${
                saveSuccessNotice
                  ? 'bg-emerald-600 scale-[0.99]'
                  : 'bg-emerald-800 hover:bg-emerald-900'
              }`}
            >
              {saveSuccessNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 animate-bounce" />
                  <span>{language === 'rw' ? 'Amakuru Arabitswe! Kwinjira...' : 'Credentials Saved! Entering Dashboard...'}</span>
                </>
              ) : (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>
                    {language === 'rw'
                      ? 'Bika Amakuru & Injira muri Dashboard'
                      : 'Save Credentials & Enter Dashboard'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
