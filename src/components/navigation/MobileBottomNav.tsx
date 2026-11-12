import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { ActiveTabType } from '../Navbar.tsx';
import { AgriBridgeBrandIcon } from '../common/AgriBridgeBrandIcon.tsx';
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
  Handshake,
  FileText,
  Wallet,
  Store,
  BookOpen,
  CloudSun,
  Users,
  Shield,
  Plus,
  Award,
  CreditCard,
  MapPin,
  MessageSquare,
} from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenNewListingModal?: () => void;
  onOpenAboutFounders?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewListingModal,
  onOpenAboutFounders,
}) => {
  const { language } = useLanguage();
  const { role, currentUser, setIsAuthModalOpen } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // 4 Primary Mobile Bottom Tabs
  const bottomNavItems: {
    id: ActiveTabType;
    labelEn: string;
    labelRw: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', labelEn: 'Home', labelRw: 'Ahabanza', icon: LayoutDashboard },
    { id: 'farmer', labelEn: 'Farms', labelRw: 'Imirima', icon: Sprout },
    { id: 'marketplace', labelEn: 'Market', labelRw: 'Isoko', icon: ShoppingBag },
    { id: 'ai', labelEn: 'AI', labelRw: 'AI', icon: Sparkles },
  ];

  // Secondary items in the "More" Drawer
  const moreNavItems: {
    id: ActiveTabType;
    labelEn: string;
    labelRw: string;
    descEn: string;
    descRw: string;
    icon: React.ComponentType<{ className?: string }>;
    visible?: boolean;
  }[] = [
    {
      id: 'inbox',
      labelEn: 'Negotiation Inbox',
      labelRw: 'Ubutumwa & Ibiciro',
      descEn: 'Negotiate produce rates with farmers before ordering',
      descRw: 'Ganira n\'abahinzi ku biciro mbere yo gutumiza',
      icon: MessageSquare,
    },
    {
      id: 'offers',
      labelEn: 'Buyer Offers',
      labelRw: 'Ibiciro by\'Abaguzi',
      descEn: 'Negotiate prices & accept buyer bids',
      descRw: 'Genzura ibiciro abaguzi batanze',
      icon: Handshake,
    },
    {
      id: 'orders',
      labelEn: 'Orders & Deals',
      labelRw: 'Amasezerano & Imitwaro',
      descEn: 'Track transport logistics & payments',
      descRw: 'Kurikirana ibicuruzwa n\'ubwikorezi',
      icon: FileText,
    },
    {
      id: 'terminal',
      labelEn: 'Payment Terminal',
      labelRw: 'Ubwishyu & Terminal',
      descEn: 'Verify MoMo & bank transfers (2.5% commission)',
      descRw: 'Emeza ubwishyu bwa MoMo n\'amabanki',
      icon: CreditCard,
    },
    {
      id: 'finance',
      labelEn: 'Farm Finances',
      labelRw: 'Imari n\'Amakuru y\'Amafaranga',
      descEn: 'Track operational costs & calculate net profit',
      descRw: 'Bika ibyakoreshejwe n\'inyungu',
      icon: Wallet,
    },
    {
      id: 'locations',
      labelEn: 'Rwanda Locations',
      labelRw: 'Imiterere y\'Uturere',
      descEn: '30 Districts, sectors, cells & imidugudu hierarchy',
      descRw: 'Uturere 30, imirenge, utugari n\'imidugudu',
      icon: MapPin,
    },
    {
      id: 'directory',
      labelEn: 'Suppliers & Experts',
      labelRw: 'Abacuruzi & Abajyanama b\'Ubuhinzi',
      descEn: 'Certified seeds, fertilizers & agronomists',
      descRw: 'Imbuto zizewe, ifumbire n\'abahanga',
      icon: Store,
    },
    {
      id: 'training',
      labelEn: 'Training & Audio',
      labelRw: 'Amasomo yo mu Majwi',
      descEn: 'Practical farmer courses & offline guides',
      descRw: 'Inyigisho z\'ubuhinzi mu Kinyarwanda',
      icon: BookOpen,
    },
    {
      id: 'weather',
      labelEn: 'Weather & Advisory',
      labelRw: 'Iteganyagihe n\'Inama',
      descEn: 'Rain forecasts and seasonal alerts',
      descRw: 'Iteganyagihe ry\'imvura mu karere',
      icon: CloudSun,
    },
    {
      id: 'agent',
      labelEn: 'Community Agent Desk',
      labelRw: 'Urugendo rw\'Abajyanama',
      descEn: 'Onboard farmers & register offline listings',
      descRw: 'Fasha abahinzi badafite telefone',
      icon: Users,
      visible: role === 'agent' || role === 'admin',
    },
    {
      id: 'admin',
      labelEn: 'District Administration',
      labelRw: 'Ubuyobozi bw\'Agaciro',
      descEn: 'Manage platform users & audit records',
      descRw: 'Genzura ibikorwa byose by\'ihuriro',
      icon: Shield,
      visible: role === 'admin',
    },
  ];

  return (
    <>
      {/* Fixed Bottom Bar on Mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 px-2 py-1.5 flex items-center justify-around shadow-lg"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = language === 'rw' ? item.labelRw : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMoreMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-800 dark:text-emerald-400 font-bold scale-105'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <div
                className={`p-1 rounded-lg ${
                  isActive ? 'bg-emerald-100 dark:bg-emerald-950/80' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{label}</span>
            </button>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setIsMoreMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
            isMoreMenuOpen ||
            moreNavItems.some((m) => m.id === activeTab)
              ? 'text-emerald-800 dark:text-emerald-400 font-bold scale-105'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
          }`}
        >
          <div
            className={`p-1 rounded-lg ${
              moreNavItems.some((m) => m.id === activeTab)
                ? 'bg-emerald-100 dark:bg-emerald-950/80'
                : ''
            }`}
          >
            <Menu className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5">
            {language === 'rw' ? 'Ibindi' : 'More'}
          </span>
        </button>
      </nav>

      {/* Slide-Up "More" Drawer Sheet */}
      {isMoreMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-h-[85vh] bg-white dark:bg-stone-900 rounded-t-3xl border-t border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-xs">
                  <AgriBridgeBrandIcon className="w-4 h-4 text-emerald-300" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  {language === 'rw' ? 'Ibindi Byiciro bya AgriBridge' : 'AgriBridge Sections & Tools'}
                </h3>
              </div>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action Strip */}
            <div className="p-3 bg-stone-50 dark:bg-stone-800/50 border-b border-stone-200 dark:border-stone-800 flex items-center gap-2">
              {onOpenNewListingModal && (
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenNewListingModal();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'rw' ? 'Gurishe Umusaruro' : '+ Sell Produce'}</span>
                </button>
              )}
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="py-2 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
              >
                <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <span>Account</span>
              </button>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {moreNavItems
                .filter((item) => item.visible !== false)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const label = language === 'rw' ? item.labelRw : item.labelEn;
                  const desc = language === 'rw' ? item.descRw : item.descEn;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors cursor-pointer ${
                        isActive
                          ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                          : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isActive
                            ? 'bg-emerald-800 text-white'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className="text-xs font-bold">{label}</div>
                        <div className="text-[11px] text-stone-500 truncate">{desc}</div>
                      </div>
                    </button>
                  );
                })}

              {/* Founders Seal */}
              {onOpenAboutFounders && (
                <button
                  onClick={() => {
                    setIsMoreMenuOpen(false);
                    onOpenAboutFounders();
                  }}
                  className="w-full mt-2 p-3 text-center rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-serif italic cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                >
                  AgriBridge Rwanda &middot; Founded by Idris &amp; Melody
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
