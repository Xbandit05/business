import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { ThemeToggle } from './ThemeToggle.tsx';
import { UserRole } from '../types/index.ts';
import {
  Sprout,
  ShoppingBag,
  Handshake,
  FileText,
  Wallet,
  Store,
  BookOpen,
  CloudSun,
  Users,
  Shield,
  Globe,
  Volume2,
  VolumeX,
  Plus,
  Award,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from './common/PWAInstallButton.tsx';

export type ActiveTabType =
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
  onOpenNewPlotModal: () => void;
  onOpenNewListingModal: () => void;
  onOpenAboutFounders?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewPlotModal,
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

  const navItems: { id: ActiveTabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'farmer', label: t('nav.dashboard'), icon: Sprout },
    { id: 'marketplace', label: t('nav.marketplace'), icon: ShoppingBag },
    { id: 'ai', label: 'AgriBridge AI', icon: Sparkles },
    { id: 'offers', label: t('nav.offers'), icon: Handshake },
    { id: 'orders', label: t('nav.orders'), icon: FileText },
    { id: 'finance', label: t('nav.finance'), icon: Wallet },
    { id: 'directory', label: t('nav.directory'), icon: Store },
    { id: 'training', label: t('nav.training'), icon: BookOpen },
    { id: 'weather', label: t('nav.weather'), icon: CloudSun },
    { id: 'agent', label: t('nav.agent'), icon: Users },
    { id: 'admin', label: t('nav.admin'), icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Single text wordmark with official brand & tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('farmer')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-sm group-hover:bg-emerald-900 transition-colors">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50 whitespace-nowrap block leading-tight">
                  AgriBridge Rwanda
                </span>
                <span className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold tracking-wide block">
                  Growing Together. Connecting Markets.
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.slice(0, 8).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isAi = item.id === 'ai';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-stone-100 dark:bg-stone-800 text-emerald-800 dark:text-emerald-400'
                      : isAi
                      ? 'text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {isAi && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                      Offline
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Audio Guidance Button */}
            <button
              onClick={handleAudioPrompt}
              title={t('common.audioReadout')}
              className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Listen audio guidance"
            >
              {isSpeaking ? (
                <VolumeX className="w-4 h-4 text-emerald-600 animate-pulse" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Dark Mode / Light Mode / System Toggle */}
            <ThemeToggle />

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'rw' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
              title="Switch language (English / Ikinyarwanda)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'RW' : 'EN'}</span>
            </button>

            {/* Judge Demo / Account Access Button */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors whitespace-nowrap shadow-2xs"
              title="Identity & Login Portal (Password: 123)"
            >
              <Award className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">
                {currentUser?.fullName
                  ? `${currentUser.fullName.split(' ')[0]} (${currentUser.category || currentUser.role})`
                  : t('btn.judgeLogin')}
              </span>
              <span className="sm:hidden">{currentUser?.category || 'Login'}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenNewListingModal}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('btn.newListing')}</span>
              <span className="sm:hidden">Sell</span>
            </button>
          </div>
        </div>

        {/* Global Horizontal Scroll Subnav (Accessible on all screens) */}
        <div className="flex items-center py-2 border-t border-stone-200 dark:border-stone-800 overflow-x-auto gap-2 text-xs scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          {onOpenAboutFounders && (
            <button
              onClick={onOpenAboutFounders}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold whitespace-nowrap transition-colors shrink-0 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
              title="View Idris & Melody Founders' Story and Botanical Signature"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Founders: Idris &amp; Melody</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
