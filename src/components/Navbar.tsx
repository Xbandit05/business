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
  | 'ai'
  | 'offers'
  | 'orders'
  | 'finance'
  | 'directory'
  | 'training'
  | 'weather'
  | 'agent'
  | 'admin';

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
  const { currentUser, setIsAuthModalOpen } = useApp();

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
      case 'offers':
        return language === 'rw' ? 'Ibiciro by\'Abaguzi' : 'Buyer Purchase Offers';
      case 'orders':
        return language === 'rw' ? 'Amasezerano & Imitwaro' : 'Orders & Deals';
      case 'finance':
        return language === 'rw' ? 'Igitabo cy\'Imari' : 'Farm Finance Ledger';
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

            {/* Account / Role Login Access */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap shadow-2xs cursor-pointer"
              title="Identity & Profile Portal"
            >
              <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
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
