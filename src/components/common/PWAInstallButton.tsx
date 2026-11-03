import React, { useState, useEffect } from 'react';
import { Download, CheckCircle2, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt note:', err);
      }
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Install AgriBridge Rwanda for full offline access"
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-2xs cursor-pointer whitespace-nowrap ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-emerald-200" />
        <span className="hidden sm:inline">Install Offline App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Install on iPhone / iPad
                </h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              To use AgriBridge offline on iOS:
              <br />
              1. Tap the <strong>Share</strong> button in the Safari toolbar.
              <br />
              2. Scroll down and tap <strong>Add to Home Screen</strong>.
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
