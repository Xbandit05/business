import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { ActiveTabType } from '../Navbar.tsx';
import { AgriBridgeBrandIcon } from '../common/AgriBridgeBrandIcon.tsx';
import {
  LayoutDashboard,
  Sprout,
  ShoppingBag,
  Handshake,
  FileText,
  Wallet,
  Sparkles,
  Store,
  BookOpen,
  CloudSun,
  Users,
  Shield,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Plus,
  Award,
  Globe,
  Volume2,
  VolumeX,
  CreditCard,
  MapPin,
  MessageSquare,
} from 'lucide-react';

interface SidebarNavProps {
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  onOpenAboutFounders?: () => void;
  onOpenNewListingModal?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAboutFounders,
  onOpenNewListingModal,
}) => {
  const { t, language } = useLanguage();
  const { role, currentUser, setIsAuthModalOpen, firebaseUser, isGoogleAuthenticated } = useApp();

  // Desktop collapsible state (persisted)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('agribridge_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('agribridge_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Primary Navigation Items
  const primaryNavItems: {
    id: ActiveTabType;
    labelEn: string;
    labelRw: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelRw: 'Ahabanza', icon: LayoutDashboard },
    { id: 'farmer', labelEn: 'Farms & Plots', labelRw: 'Imirima & Plots', icon: Sprout },
    { id: 'marketplace', labelEn: 'Produce Market', labelRw: 'Isoko ry\'Imyaka', icon: ShoppingBag },
    { id: 'inbox', labelEn: 'Negotiation Inbox', labelRw: 'Ubutumwa & Ibiciro', icon: MessageSquare, badge: 'Deals' },
    { id: 'offers', labelEn: 'Buyer Offers', labelRw: 'Ibiciro by\'Abaguzi', icon: Handshake },
    { id: 'orders', labelEn: 'Orders & Deals', labelRw: 'Amasezerano', icon: FileText },
    { id: 'terminal', labelEn: 'Payment Terminal', labelRw: 'Ubwishyu & Terminal', icon: CreditCard, badge: '2.5%' },
    { id: 'finance', labelEn: 'Farm Finances', labelRw: 'Imari y\'Umurima', icon: Wallet },
    { id: 'locations', labelEn: 'Rwanda Locations', labelRw: 'Imiterere y\'Uturere', icon: MapPin },
    { id: 'ai', labelEn: 'AgriBridge AI', labelRw: 'AgriBridge AI', icon: Sparkles, badge: 'Offline' },
    { id: 'directory', labelEn: 'Suppliers & Experts', labelRw: 'Abacuruzi & Abahanga', icon: Store },
    { id: 'training', labelEn: 'Training & Audio', labelRw: 'Amasomo & Amajwi', icon: BookOpen },
    { id: 'weather', labelEn: 'Weather', labelRw: 'Iteganyagihe', icon: CloudSun },
  ];

  // Role-specific extensions
  const roleNavItems: {
    id: ActiveTabType;
    labelEn: string;
    labelRw: string;
    icon: React.ComponentType<{ className?: string }>;
    visible: boolean;
  }[] = [
    {
      id: 'agent',
      labelEn: 'Community Agent',
      labelRw: 'Agente w\'Umurenge',
      icon: Users,
      visible: role === 'agent' || role === 'admin',
    },
    {
      id: 'admin',
      labelEn: 'Admin Dashboard',
      labelRw: 'Ubuyobozi',
      icon: Shield,
      visible: role === 'admin',
    },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 select-none transition-all duration-200 sticky top-0 h-screen z-30 shrink-0 ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand & Collapse Header */}
      <div className="h-16 px-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between shrink-0">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 text-left overflow-hidden group cursor-pointer"
          title="Go to Dashboard"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-xs group-hover:bg-emerald-900 transition-colors shrink-0">
            <AgriBridgeBrandIcon className="w-5 h-5 text-emerald-300" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <span className="text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50 block leading-tight truncate">
                AgriBridge Rwanda
              </span>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-400 font-semibold tracking-wide block truncate">
                Growing Together.
              </span>
            </div>
          )}
        </button>

        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar to Icons'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Navigation List */}
      <nav className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const label = language === 'rw' ? item.labelRw : item.labelEn;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-stone-100'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
              title={isCollapsed ? label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-emerald-200' : 'text-stone-500 dark:text-stone-400'
                }`}
              />

              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {/* Floating Tooltip in collapsed mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2.5 py-1 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </button>
          );
        })}

        {/* Role Specific Section */}
        {roleNavItems.some((r) => r.visible) && (
          <div className="pt-2 mt-2 border-t border-stone-200 dark:border-stone-800 space-y-1">
            {!isCollapsed && (
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Staff &amp; Admin
              </div>
            )}
            {roleNavItems
              .filter((r) => r.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const label = language === 'rw' ? item.labelRw : item.labelEn;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all group relative cursor-pointer ${
                      isActive
                        ? 'bg-stone-800 text-white dark:bg-stone-700'
                        : 'text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-stone-400" />
                    {!isCollapsed && <span className="truncate flex-1 text-left">{label}</span>}
                  </button>
                );
              })}
          </div>
        )}
      </nav>

      {/* Footer Profile & Founders Stamp */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50 space-y-2 shrink-0">
        {/* User Account */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-emerald-500/50 hover:bg-white dark:hover:bg-stone-800 transition-colors text-left group cursor-pointer ${
            isCollapsed ? 'justify-center p-1.5' : ''
          }`}
          title="Account profile and demo switch"
        >
          <div className="relative shrink-0">
            {firebaseUser?.photoURL ? (
              <img
                src={firebaseUser.photoURL}
                alt={currentUser?.fullName || 'Google Profile'}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-emerald-500 shadow-2xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                {currentUser?.fullName?.[0] || 'U'}
              </div>
            )}
            {isGoogleAuthenticated && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900"
                title="Verified Google Account"
              />
            )}
          </div>
          {!isCollapsed && (
            <div className="truncate flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  {currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Guest'}
                </span>
                {isGoogleAuthenticated && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                    Google
                  </span>
                )}
              </div>
              <div className="text-[10px] text-stone-500 capitalize truncate">
                {currentUser?.role || 'Farmer'} &middot; {currentUser?.sector || 'Nyagatare'}
              </div>
            </div>
          )}
        </button>

        {/* Founders Seal Link */}
        {onOpenAboutFounders && !isCollapsed && (
          <button
            onClick={onOpenAboutFounders}
            className="w-full text-center py-1 text-[10px] font-serif italic text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer truncate"
          >
            Founded by Idris &amp; Melody
          </button>
        )}
      </div>
    </aside>
  );
};
