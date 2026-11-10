/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar, ActiveTabType } from './components/Navbar.tsx';
import { DemoDisclaimerBanner } from './components/DemoDisclaimerBanner.tsx';
import { FarmAndPlotManager } from './components/farmer/FarmAndPlotManager.tsx';
import { FarmerOfferManager } from './components/farmer/FarmerOfferManager.tsx';
import { MarketplaceView } from './components/buyer/MarketplaceView.tsx';
import { OrdersView } from './components/orders/OrdersView.tsx';
import { FarmFinanceLedger } from './components/finance/FarmFinanceLedger.tsx';
import { SupplierExpertDirectory } from './components/directory/SupplierExpertDirectory.tsx';
import { FarmerTrainingCenter } from './components/training/FarmerTrainingCenter.tsx';
import { WeatherRemindersView } from './components/weather/WeatherRemindersView.tsx';
import { CommunityAgentAssistedView } from './components/agent/CommunityAgentAssistedView.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { PaymentTerminalView } from './components/payments/PaymentTerminalView.tsx';
import { LocationManagementView } from './components/location/LocationManagementView.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import {
  RegisterFarmModal,
  AddPlotModal,
  ListProduceModal,
  MakeOfferModal,
  ToastContainer,
} from './components/modals/Modals.tsx';
import { CropCycle, ProduceListing } from './types/index.ts';
import { Sprout, Heart } from 'lucide-react';
import { AgriBridgeBrandIcon } from './components/common/AgriBridgeBrandIcon.tsx';
import { FounderWatermark } from './components/common/FounderWatermark.tsx';
import { AboutFoundersModal } from './components/modals/AboutFoundersModal.tsx';
import { SocialOutreachBar } from './components/common/SocialOutreachBar.tsx';
import { AgriBridgeAiView } from './components/ai/AgriBridgeAiView.tsx';
import { OfflineIndicator } from './components/common/OfflineIndicator.tsx';
import { SidebarNav } from './components/navigation/SidebarNav.tsx';
import { MobileBottomNav } from './components/navigation/MobileBottomNav.tsx';
import { AgriBridgeDashboardView } from './components/dashboard/AgriBridgeDashboardView.tsx';

function AgriBridgeDashboard() {
  const { role } = useApp();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');

  // Modal triggers
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isAboutFoundersOpen, setIsAboutFoundersOpen] = useState(false);
  const [prefillCycle, setPrefillCycle] = useState<CropCycle | null>(null);
  const [selectedOfferListing, setSelectedOfferListing] = useState<ProduceListing | null>(null);

  const handleOpenListingWithCycle = (cycle: CropCycle) => {
    setPrefillCycle(cycle);
    setIsListingModalOpen(true);
  };

  const handleOpenBlankListing = () => {
    setPrefillCycle(null);
    setIsListingModalOpen(true);
  };

  const handleSelectListingForOffer = (listing: ProduceListing) => {
    setSelectedOfferListing(listing);
  };

  return (
    <div className="relative min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Subtle Botanical Calligraphy Background Watermark (3-5% Opacity) */}
      <FounderWatermark variant="subtle-watermark" />

      {/* Desktop Collapsible Sidebar */}
      <SidebarNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAboutFounders={() => setIsAboutFoundersOpen(true)}
        onOpenNewListingModal={handleOpenBlankListing}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewPlotModal={() => setIsPlotModalOpen(true)}
          onOpenNewListingModal={handleOpenBlankListing}
          onOpenAboutFounders={() => setIsAboutFoundersOpen(true)}
        />

        {/* Main View Container */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8">
          {activeTab === 'dashboard' && (
            <AgriBridgeDashboardView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewListingModal={handleOpenBlankListing}
              onOpenNewPlotModal={() => setIsPlotModalOpen(true)}
              onOpenNewFarmModal={() => setIsFarmModalOpen(true)}
              onOpenAboutFounders={() => setIsAboutFoundersOpen(true)}
            />
          )}

          {activeTab === 'farmer' && (
            <FarmAndPlotManager
              onOpenNewFarmModal={() => setIsFarmModalOpen(true)}
              onOpenNewPlotModal={() => setIsPlotModalOpen(true)}
              onOpenNewListingWithCycle={handleOpenListingWithCycle}
              onOpenAiAssistant={() => setActiveTab('ai')}
            />
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView onSelectListingForOffer={handleSelectListingForOffer} />
          )}

          {activeTab === 'ai' && (
            <AgriBridgeAiView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewPlotModal={() => setIsPlotModalOpen(true)}
              onOpenNewListingModal={handleOpenBlankListing}
            />
          )}

          {activeTab === 'offers' && <FarmerOfferManager />}

          {activeTab === 'orders' && <OrdersView />}

          {activeTab === 'finance' && <FarmFinanceLedger />}

          {activeTab === 'terminal' && <PaymentTerminalView />}

          {activeTab === 'locations' && <LocationManagementView />}

          {activeTab === 'directory' && <SupplierExpertDirectory />}

          {activeTab === 'training' && <FarmerTrainingCenter />}

          {activeTab === 'weather' && <WeatherRemindersView />}

          {activeTab === 'agent' && <CommunityAgentAssistedView />}

          {activeTab === 'admin' && <AdminDashboard />}
        </main>


      {/* Modals & Portals */}
      <AuthModal />

      <RegisterFarmModal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
      />

      <AddPlotModal
        isOpen={isPlotModalOpen}
        onClose={() => setIsPlotModalOpen(false)}
      />

      <ListProduceModal
        isOpen={isListingModalOpen}
        onClose={() => {
          setIsListingModalOpen(false);
          setPrefillCycle(null);
        }}
        prefillCycle={prefillCycle}
      />

      <MakeOfferModal
        isOpen={!!selectedOfferListing}
        onClose={() => setSelectedOfferListing(null)}
        listing={selectedOfferListing}
      />

      {/* Toast Feedback */}
      <ToastContainer />

      {/* Offline Connectivity & Knowledge Status Pill */}
      <OfflineIndicator onOpenAiAssistant={() => setActiveTab('ai')} />

      {/* Shared Application Footer with Creator Credits & Official Branding */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-8 text-xs text-stone-500 dark:text-stone-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          {/* Top Row: Brand, Tagline and Regional Trust */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-xs">
                <AgriBridgeBrandIcon className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5 text-center sm:text-left">
                <span className="font-bold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
                  AgriBridge Rwanda
                </span>
                <span className="text-emerald-800 dark:text-emerald-400 font-semibold text-xs">
                  Growing Together. Connecting Markets.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-stone-500 dark:text-stone-400">
              <span>Nyagatare District Launch</span>
              <span>·</span>
              <span>Eastern Province, Rwanda</span>
              <span>·</span>
              <span>MINAGRI / RAB Aligned</span>
            </div>
          </div>

          {/* Social Platforms & Direct Outreach Hub */}
          <div className="pt-3">
            <SocialOutreachBar />
          </div>

          {/* Bottom Row: Exact Creator Credits and Copyright */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
            <div className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-2">
              <span>Built with passion by Idris &amp; Melody</span>
              <button
                onClick={() => setIsAboutFoundersOpen(true)}
                className="text-[11px] font-serif italic text-emerald-800 dark:text-emerald-400 hover:text-emerald-950 dark:hover:text-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="View Founders' Story &amp; Botanical Seal"
              >
                <span>&middot; View Signature Seal</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-stone-400 dark:text-stone-500">
              <button
                onClick={() => setIsAboutFoundersOpen(true)}
                className="hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
              >
                Founders
              </button>
              <span>·</span>
              <span>&copy; {new Date().getFullYear()} AgriBridge Rwanda. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* About Founders & Botanical Seal Modal */}
      <AboutFoundersModal
        isOpen={isAboutFoundersOpen}
        onClose={() => setIsAboutFoundersOpen(false)}
      />
    </div>


      {/* Mobile Bottom Navigation (Fixed on mobile screens) */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewListingModal={handleOpenBlankListing}
        onOpenAboutFounders={() => setIsAboutFoundersOpen(true)}
      />
    </div>
  );
}


export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppProvider>
          <AgriBridgeDashboard />
        </AppProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
