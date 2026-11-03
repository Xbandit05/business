import React, { useState, useEffect } from 'react';
import { WifiOff, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface OfflineIndicatorProps {
  onOpenAiAssistant?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onOpenAiAssistant }) => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline || dismissed) return null;

  return (
    <aside
      aria-label="Offline Mode Status"
      className="fixed bottom-4 right-4 z-40 max-w-sm rounded-xl bg-stone-900/95 dark:bg-stone-900/95 text-white p-3.5 shadow-2xl border border-emerald-500/40 backdrop-blur-md animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-800/80 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
            <WifiOff className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">
                {language === 'rw' ? 'Muri Offline — Umufasha w\'Ubuhinzi Arakora' : 'Offline Mode — AI Assistant Active'}
              </span>
            </div>
            <p className="text-[11px] text-stone-300 leading-tight">
              {language === 'rw'
                ? 'Nta murongo wa interineti ufite. Ubumenyi bwose bw\'ubuhinzi bubitswe muri telefone yawe 100%.'
                : 'No internet connection detected. Stored agricultural knowledge and platform guidance remain 100% accessible.'}
            </p>
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="mt-1.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{language === 'rw' ? 'Fungura AgriBridge AI' : 'Open AgriBridge AI'}</span>
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-stone-400 hover:text-white text-xs px-1"
          aria-label="Close offline banner"
        >
          &times;
        </button>
      </div>
    </aside>
  );
};
