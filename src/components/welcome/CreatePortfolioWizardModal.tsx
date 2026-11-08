import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { UserCategory, UserRole } from '../../types/index.ts';
import { getAllDistricts, getSectorsForDistrict } from '../../data/districts.ts';
import { AgriBridgeBrandIcon } from '../common/AgriBridgeBrandIcon.tsx';
import {
  X,
  User,
  Phone,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  Sprout,
  ShoppingBag,
  Package,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CreatePortfolioWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const CreatePortfolioWizardModal: React.FC<CreatePortfolioWizardModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
}) => {
  const { language } = useLanguage();
  const { registerPortfolioAccount } = useApp();
  const isRw = language === 'rw';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State - Step 1: Identity & Credentials
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+250 78');
  const [email, setEmail] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('childhood_sector');
  const [securityAnswer, setSecurityAnswer] = useState('');

  // Form State - Step 2: Role, Category & Location
  const [category, setCategory] = useState<UserCategory>('seller');
  const [district, setDistrict] = useState('Nyagatare');
  const [sector, setSector] = useState('Mimuri');
  const [cell, setCell] = useState('');
  const [cooperativeName, setCooperativeName] = useState('');

  // Form State - Step 3: Portfolio Specifications
  const [portfolioName, setPortfolioName] = useState('');
  const [nicheSpecialty, setNicheSpecialty] = useState('');
  const [tradeVolumeScale, setTradeVolumeScale] = useState('Medium Commercial (1 - 5 Ha)');

  const allDistricts = getAllDistricts();
  const sectors = getSectorsForDistrict(district);

  if (!isOpen) return null;

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    const secs = getSectorsForDistrict(d);
    if (secs.length > 0) {
      setSector(secs[0].name);
    }
  };

  const getRoleFromCategory = (cat: UserCategory): UserRole => {
    if (cat === 'seller') return 'farmer';
    if (cat === 'buyer') return 'buyer';
    if (cat === 'supplier') return 'supplier';
    if (cat === 'agent') return 'agent';
    if (cat === 'expert') return 'expert';
    return 'farmer';
  };

  const validateStep1 = () => {
    setErrorMessage(null);
    if (!fullName.trim()) {
      setErrorMessage(isRw ? 'Nyamuneka andika amazina yombi cyangwa izina ry\'ishyirahamwe.' : 'Please enter your full name or organization name.');
      return false;
    }
    if (!phoneNumber.trim() || phoneNumber.trim().length < 10) {
      setErrorMessage(isRw ? 'Nyamuneka andika nimero ya terefone yuzuye (urugero: +250 788 123 456).' : 'Please enter a valid phone number (e.g., +250 788 123 456).');
      return false;
    }
    if (!passwordOrPin.trim() || passwordOrPin.trim().length < 3) {
      setErrorMessage(isRw ? 'Ijambobanga cyangwa PIN bigomba kuba bifite byibuze inyuguti 3 cyangwa imibare 3.' : 'Password or PIN must be at least 3 characters or digits.');
      return false;
    }
    if (passwordOrPin !== confirmPassword) {
      setErrorMessage(isRw ? 'Amagambobanga yombi ntabwo ahuye.' : 'Passwords or PINs do not match.');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    setErrorMessage(null);
    if (!district || !sector) {
      setErrorMessage(isRw ? 'Hitamo akarere n\'umurenge ukoreramo.' : 'Please select your operating district and sector.');
      return false;
    }
    // Auto-suggest portfolio name if blank
    if (!portfolioName) {
      if (category === 'seller') {
        setPortfolioName(`${fullName.trim()} - Umurima w'Ubuhinzi (${sector})`);
        setNicheSpecialty('Maize & Climbing Beans Producer');
      } else if (category === 'buyer') {
        setPortfolioName(`${fullName.trim()} - Grain Procurement Hub`);
        setNicheSpecialty('Bulk Grain Aggregation');
      } else if (category === 'supplier') {
        setPortfolioName(`${fullName.trim()} - Agro-Inputs Depot`);
        setNicheSpecialty('Certified Seeds & Fertilizer Supply');
      } else {
        setPortfolioName(`${fullName.trim()} - Agricultural Portfolio`);
        setNicheSpecialty('Agricultural Advisory');
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (step === 3) setStep(2);
    else if (step === 2) setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!portfolioName.trim()) {
      setErrorMessage(isRw ? 'Andika izina rya porotifoliye yawe.' : 'Please enter a name for your portfolio.');
      return;
    }

    setIsSubmitting(true);
    try {
      const role = getRoleFromCategory(category);
      const res = await registerPortfolioAccount({
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: email.trim() || undefined,
        passwordOrPin: passwordOrPin.trim(),
        securityQuestion,
        securityAnswer: securityAnswer.trim().toLowerCase(),
        category,
        role,
        district,
        sector,
        cell: cell.trim() || undefined,
        portfolioName: portfolioName.trim(),
        nicheSpecialty: nicheSpecialty.trim(),
        businessOrFarmName: portfolioName.trim(),
        cooperativeName: cooperativeName.trim() || undefined,
        tradeVolumeScale,
      });

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || (isRw ? 'Kwiyandikisha byanze. Ongera ugerageze.' : 'Registration failed. Please try again.'));
      }
    } catch {
      setErrorMessage(isRw ? 'Habaye ikibazo cya interineti.' : 'Network connection issue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 dark:bg-stone-950/85 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-xs">
              <AgriBridgeBrandIcon className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {isRw ? 'Fungura Porotifoliye Nshya' : 'Create a New Portfolio'}
              </h2>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                {isRw ? 'Intambwe ' : 'Step '} {step} {isRw ? 'kuri 3 · ' : 'of 3 · '}
                {step === 1 && (isRw ? 'Umwirondoro & Umutekano' : 'Identity & Security')}
                {step === 2 && (isRw ? 'Icyiciro & Ahantu' : 'Category & Location')}
                {step === 3 && (isRw ? 'Ibyerekeye Porotifoliye' : 'Portfolio Setup')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 flex">
          <div
            className="bg-emerald-600 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: IDENTITY & CREDENTIALS */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {isRw
                    ? 'AgriBridge yishingira umutekano w\'amakuru yawe. Ibihembo n\'imyirondoro biguma ari ibyawe gusa.'
                    : 'AgriBridge secures your farm records. Every producer and buyer receives a unique verified workspace.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Amazina Yombi cyangwa Izina ry\'Ikigo *' : 'Full Name or Organization Name *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={isRw ? 'urugero: Jean-Paul Mugisha' : 'e.g., Idris Agaba Otin'}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Nimero ya Terefone *' : 'Phone Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+250 788 000 000"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Imeli (Niba uyifite)' : 'Email Address (Optional)'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@agribridge.rw"
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Ijambobanga cyangwa PIN *' : 'Password or PIN *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={passwordOrPin}
                      onChange={(e) => setPasswordOrPin(e.target.value)}
                      placeholder={isRw ? 'PIN y\'imibare cyangwa ijambobanga' : '4-digit PIN or password'}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Subiramo Ijambobanga / PIN *' : 'Confirm Password / PIN *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={isRw ? 'Subiramo neza' : 'Repeat password or PIN'}
                      className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isRw ? 'Ikibazo cy\'Umutekano cyo Kuzazura Konti' : 'Security Question for Account Recovery'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                  >
                    <option value="childhood_sector">{isRw ? 'Umurenge wavukiyemo' : 'Childhood farm sector'}</option>
                    <option value="first_crop">{isRw ? 'Igihingwa cya mbere wejeje' : 'First crop you harvested'}</option>
                    <option value="first_coop">{isRw ? 'Koperative ya mbere wabayemo' : 'First cooperative joined'}</option>
                  </select>
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder={isRw ? 'Igisubizo (urugero: Mimuri)' : 'Secret answer (e.g., Mimuri)'}
                    className="w-full px-2.5 py-1.5 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: CATEGORY & REGIONAL LOCATION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                  {isRw ? 'Icyiciro cy\'Ubuhinzi / Ubucuruzi *' : 'Agricultural / Commercial Category *'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'seller', labelEn: 'Farmer / Producer', labelRw: 'Umuhinzi / Umworozi', icon: Sprout },
                    { id: 'buyer', labelEn: 'Produce Buyer', labelRw: 'Umuguzi w\'Umusaruro', icon: ShoppingBag },
                    { id: 'supplier', labelEn: 'Inputs Supplier', labelRw: 'Utanga Inyunganiramusaruro', icon: Package },
                    { id: 'agent', labelEn: 'Field Agent', labelRw: 'Umufashamyumvire / Agent', icon: Users },
                    { id: 'expert', labelEn: 'Agronomist Expert', labelRw: 'Inzobere mu Buhinzi', icon: Award },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = category === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCategory(item.id as UserCategory)}
                        className={`p-3 rounded-2xl border text-left flex flex-col items-start gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 ring-2 ring-emerald-600/30 text-emerald-900 dark:text-emerald-100'
                            : 'border-stone-200 dark:border-stone-700 hover:border-emerald-400 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-emerald-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold leading-tight">
                          {isRw ? item.labelRw : item.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Akarere Ukoreramo *' : 'District *'}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {allDistricts.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name} ({d.province})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Umurenge *' : 'Sector *'}
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-medium"
                  >
                    {sectors.map((s) => (
                      <option key={s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Akagari / Umudugudu' : 'Cell / Village (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                    placeholder={isRw ? 'urugero: Mahoro Cell' : 'e.g., Mahoro Cell'}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {isRw ? 'Koperative (Niba uyirimo)' : 'Cooperative Affiliation'}
                  </label>
                  <input
                    type="text"
                    value={cooperativeName}
                    onChange={(e) => setCooperativeName(e.target.value)}
                    placeholder={isRw ? 'urugero: COOPAMA Mimuri' : 'e.g., COOPAMA Mimuri'}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INITIAL PORTFOLIO SPECIFICATIONS */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400 block">
                    {isRw ? 'Kode ya Porotifoliye Izashyirwaho' : 'Generated Portfolio ID'}
                  </span>
                  <span className="text-sm font-bold font-mono text-stone-900 dark:text-stone-50">
                    PF-RW-{district.substring(0, 3).toUpperCase()}-{(Math.floor(1000 + Math.random() * 9000)).toString()}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Izina rya Porotifoliye *' : 'Portfolio Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder={isRw ? 'urugero: Umurima w\'Icyerekezo (Mimuri)' : 'e.g., Umurima w\'Icyerekezo (Mimuri)'}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Ibyo Wibandaho mu Buhinzi / Ubucuruzi *' : 'Niche Specialty / Crops Produced *'}
                </label>
                <input
                  type="text"
                  required
                  value={nicheSpecialty}
                  onChange={(e) => setNicheSpecialty(e.target.value)}
                  placeholder={isRw ? 'urugero: Ibigori by\'Imvange, Ibihyimbo by\'Imitavu' : 'e.g., Hybrid Maize, Climbing Beans, Rice'}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Ingano y\'Ubuso / Ubushobozi bwo Gucuruza' : 'Scale of Operations / Production Scale'}
                </label>
                <select
                  value={tradeVolumeScale}
                  onChange={(e) => setTradeVolumeScale(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-medium"
                >
                  <option value="Smallholder (< 1 Ha)">{isRw ? 'Umuhinzi Muto (< 1 Ha)' : 'Smallholder (< 1 Ha)'}</option>
                  <option value="Medium Commercial (1 - 5 Ha)">{isRw ? 'Umuhinzi w\'Ubucuruzi (1 - 5 Ha)' : 'Medium Commercial (1 - 5 Ha)'}</option>
                  <option value="Large Scale (> 5 Ha)">{isRw ? 'Umuhinzi Munini (> 5 Ha)' : 'Large Scale (> 5 Ha)'}</option>
                  <option value="Commercial Aggregator / Buyer">{isRw ? 'Umuguzi / Uwegeranya Umusaruro' : 'Commercial Aggregator / Buyer'}</option>
                  <option value="Cooperative Producer Union">{isRw ? 'Urugaga rwa Koperative' : 'Cooperative Producer Union'}</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isRw ? 'Inyuma' : 'Back'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-xs text-emerald-800 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                {isRw ? 'Ufite porotifoliye? Injira' : 'Already have a portfolio? Access here'}
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer ml-auto"
              >
                <span>{isRw ? 'Komeza' : 'Continue'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-sm cursor-pointer ml-auto disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isRw ? 'Gufungura Porotifoliye...' : 'Creating Portfolio...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>{isRw ? 'Fungura & Injira muri Workspace' : 'Create & Enter Workspace'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
