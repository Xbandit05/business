import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import {
  Sprout,
  Globe,
  Volume2,
  VolumeX,
  Plus,
  Award,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from './common/PWAInstallButton.tsx';
import { CompactDataStatusIndicator } from './common/CompactDataStatusIndicator.tsx';
import { CompactAiStatusIndicator } from './common/CompactAiStatusIndicator.tsx';
import { AgriBridgeBrandIcon } from './common/AgriBridgeBrandIcon.tsx';

export type ActiveTabType =
  | 'dashboard'
  | 'farmer'
  | 'marketplace'
  | 'inbox'
  | 'offers'
  | 'orders'
  | 'finance'
  | 'terminal'
  | 'locations'
  | 'directory'
  | 'training'
  | 'weather'
  | 'agent'
  | 'admin'
  | 'ai';

interface NavbarProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenNewPlotModal?: () => void;
  onOpenNewListingModal: () => void;
  onOpenAboutFounders?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewListingModal,
  onOpenAboutFounders,
}) => {
  const { language, setLanguage, t, speakKinyarwandaText, isSpeaking } = useLanguage();
  const {
    currentUser,
    setIsAuthModalOpen,
    firebaseUser,
    isGoogleAuthenticated,
    signInWithGoogleAccount,
  } = useApp();

  const handleAudioPrompt = () => {
    if (language === 'rw') {
      speakKinyarwandaText(
        'Murakaza neza kuri AgriBridge Rwanda. Ihuriro ry\'ubuhinzi ry\'u Rwanda ryo guhuza abahinzi n\'abaguzi mu turere twose tw\'igihugu.',
        'navbar_welcome'
      );
    } else {
      speakKinyarwandaText(
        'Welcome to AgriBridge Rwanda. Growing Together. Connecting Markets across Rwanda.',
        'navbar_welcome'
      );
    }
  };

  const getTabTitle = (tab: ActiveTabType) => {
    switch (tab) {
      case 'dashboard':
        return language === 'rw' ? 'Ahabanza (Dashboard)' : 'Dashboard Overview';
      case 'farmer':
        return language === 'rw' ? 'Imirima & Plots' : 'Farms & Plots Management';
      case 'marketplace':
        return language === 'rw' ? 'Isoko ry\'Imyaka' : 'Produce Marketplace';
      case 'inbox':
        return language === 'rw' ? 'Ubutumwa & Ibiciro' : 'Negotiation Inbox & Portal';
      case 'offers':
        return language === 'rw' ? 'Ibiciro by\'Abaguzi' : 'Buyer Purchase Offers';
      case 'orders':
        return language === 'rw' ? 'Amasezerano & Imitwaro' : 'Orders & Deals';
      case 'terminal':
        return language === 'rw' ? 'Ubwishyu bwa PawaPay' : 'Payment Verification Terminal';
      case 'finance':
        return language === 'rw' ? 'Igitabo cy\'Imari' : 'Farm Finance Ledger';
      case 'locations':
        return language === 'rw' ? 'Imiterere y\'Uturere' : 'Rwanda Locations Registry';
      case 'ai':
        return 'AgriBridge AI Companion';
      case 'directory':
        return language === 'rw' ? 'Abacuruzi & Abajyanama' : 'Suppliers & Experts';
      case 'training':
        return language === 'rw' ? 'Amasomo yo mu Majwi' : 'Farmer Training & Audio';
      case 'weather':
        return language === 'rw' ? 'Iteganyagihe' : 'Weather & Farming Reminders';
      case 'agent':
        return language === 'rw' ? 'Urugendo rw\'Agente' : 'Community Agent Desk';
      case 'admin':
        return language === 'rw' ? 'Ubuyobozi bw\'Agaciro' : 'Platform Administration';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Left: Mobile Brand OR Desktop Section Context */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Brand (visible only on small screens where sidebar is hidden) */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className="lg:hidden flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-xs">
                <AgriBridgeBrandIcon className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50 leading-tight block">
                  AgriBridge
                </span>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold leading-none block">
                  Rwanda
                </span>
              </div>
            </button>

            {/* Desktop Active Breadcrumb / Section Title */}
            <div className="hidden lg:flex items-center gap-2.5">
              <span className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {getTabTitle(activeTab)}
              </span>
              <span className="text-stone-300 dark:text-stone-700">&middot;</span>
              <span className="text-xs text-stone-500 font-medium">
                {currentUser?.sector || 'Mimuri'}, {currentUser?.district || 'Nyagatare'}
              </span>
            </div>

            {/* Compact Status Indicators in Top Header */}
            <div className="hidden sm:flex items-center gap-2 ml-1">
              <CompactDataStatusIndicator />
              <CompactAiStatusIndicator onOpenAiAssistant={() => setActiveTab('ai')} />
            </div>
          </div>

          {/* Right: Actions & Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Mobile Data Status Pill if on very small screen */}
            <div className="sm:hidden">
              <CompactDataStatusIndicator />
            </div>

            {/* Audio Guidance Button */}
            <button
              onClick={handleAudioPrompt}
              title={t('common.audioReadout')}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Listen audio guidance"
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-emerald-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Dark Mode / Light Mode Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer"
              title="Switch language (English / Ikinyarwanda)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'RW' : 'EN'}</span>
            </button>

            {/* Google Sign-in Shortcut if unauthenticated */}
            {!isGoogleAuthenticated ? (
              <button
                onClick={async () => {
                  await signInWithGoogleAccount();
                }}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-750 transition-colors shadow-2xs cursor-pointer"
                title="Sign in with your Google account"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>
            ) : null}

            {/* Account / Role Login Access */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors whitespace-nowrap shadow-2xs cursor-pointer ${
                isGoogleAuthenticated
                  ? 'border-emerald-400 dark:border-emerald-700 bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-100'
                  : 'border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
              }`}
              title={
                isGoogleAuthenticated
                  ? `Google Connected: ${firebaseUser?.email || currentUser?.email || 'User'}`
                  : 'Identity & Profile Portal'
              }
            >
              {firebaseUser?.photoURL ? (
                <img
                  src={firebaseUser.photoURL}
                  alt={firebaseUser.displayName || 'Google Profile'}
                  className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-500"
                  referrerPolicy="no-referrer"
                />
              ) : isGoogleAuthenticated ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-800" />
              ) : (
                <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              )}
              <span className="hidden md:inline">
                {currentUser?.fullName
                  ? `${currentUser.fullName.split(' ')[0]} (${currentUser.role})`
                  : 'Account'}
              </span>
              <span className="md:hidden">
                {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'User'}
              </span>
            </button>

            {/* Primary Action Button: List Produce */}
            <button
              onClick={onOpenNewListingModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {language === 'rw' ? 'Gurishe' : 'Sell Produce'}
              </span>
              <span className="sm:hidden">Sell</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
