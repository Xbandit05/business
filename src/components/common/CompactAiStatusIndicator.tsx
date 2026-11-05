import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import {
  LocalAiModelManager,
  AIStatusMode,
  LocalModelInfo,
} from '../../utils/localAiModelManager.ts';
import {
  Sparkles,
  Wifi,
  WifiOff,
  ShieldCheck,
  Download,
  Database,
  Info,
  ChevronDown,
  X,
  BookOpen,
} from 'lucide-react';

interface CompactAiStatusIndicatorProps {
  onOpenAiAssistant?: () => void;
}

export const CompactAiStatusIndicator: React.FC<CompactAiStatusIndicatorProps> = ({
  onOpenAiAssistant,
}) => {
  const { language } = useLanguage();
  const [aiStatus, setAiStatus] = useState<AIStatusMode>('LOCAL KNOWLEDGE MODE');
  const [modelProgress, setModelProgress] = useState(0);
  const [modelInfo, setModelInfo] = useState<LocalModelInfo | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const manager = LocalAiModelManager.getInstance();
    const unsubscribe = manager.subscribe((status, progress) => {
      setAiStatus(status);
      setModelProgress(progress);
      setModelInfo(manager.getModelInfo());
    });
    return () => unsubscribe();
  }, []);

  const getStatusDetails = () => {
    switch (aiStatus) {
      case 'ONLINE AI AVAILABLE':
        return {
          labelEn: 'Online AI Available',
          labelRw: 'AI yo kuri Murandasi Irafitwe',
          descEn: 'Cloud generative AI connected with offline backup active.',
          descRw: 'Ubwenge bw\'ubukorano bwo kuri murandasi burakora, hamwe n\'ubumenyi bubitswe.',
          badgeColor: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300',
          dotColor: 'bg-emerald-500',
          icon: Wifi,
        };
      case 'OFFLINE AI READY':
        return {
          labelEn: 'Offline AI Ready',
          labelRw: 'AI Yiteguye Muri Telefone',
          descEn: 'On-device neural model active. Answers complex questions without internet.',
          descRw: 'Ubwenge bw\'ubukorano buri muri telefone burakora nta murongo wa interineti.',
          badgeColor: 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300',
          dotColor: 'bg-teal-500',
          icon: ShieldCheck,
        };
      case 'DOWNLOADING AI MODEL':
        return {
          labelEn: `Downloading AI (${modelProgress}%)`,
          labelRw: `Gukuramo AI (${modelProgress}%)`,
          descEn: 'Caching on-device mobile model for fully offline semantic reasoning.',
          descRw: 'Kwinjiza ubumenyi muri telefone ngo buzakore nta murongo.',
          badgeColor: 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300',
          dotColor: 'bg-amber-500 animate-ping',
          icon: Download,
        };
      case 'LOCAL KNOWLEDGE MODE':
      default:
        return {
          labelEn: 'Offline Knowledge Ready',
          labelRw: 'Ubumenyi Bwiteguye (Offline)',
          descEn: '44+ verified agricultural guides stored safely on device. Works 100% offline.',
          descRw: 'Amasomo n\'inyoborabumenyi 44+ byemejwe na RAB bibitswe muri telefone yawe.',
          badgeColor: 'bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200',
          dotColor: 'bg-emerald-600',
          icon: Database,
        };
    }
  };

  const status = getStatusDetails();
  const Icon = status.icon;

  return (
    <>
      <button
        onClick={() => setIsPopoverOpen(true)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${status.badgeColor}`}
        title="Check AgriBridge AI connectivity & offline status"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${status.dotColor}`} />
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden md:inline">
          {language === 'rw' ? status.labelRw : status.labelEn}
        </span>
        <span className="md:hidden">AI</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {/* Expandable Explanation Popover */}
      {isPopoverOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-5 space-y-4 text-stone-900 dark:text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 text-emerald-200 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">AgriBridge AI Status</h3>
                  <p className="text-[11px] text-stone-500">Agricultural Companion Engine</p>
                </div>
              </div>
              <button
                onClick={() => setIsPopoverOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${status.dotColor}`} />
                <span className="text-xs font-bold">
                  {language === 'rw' ? status.labelRw : status.labelEn}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {language === 'rw' ? status.descRw : status.descEn}
              </p>
            </div>

            <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-1">
              <p className="font-semibold text-stone-700 dark:text-stone-300">
                Guaranteed Smallholder Resilience:
              </p>
              <p>
                Even in remote farming sectors with zero network coverage, your crop disease diagnostics, weed control steps, planting spacings, and farm profit math remain 100% functional.
              </p>
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
              {onOpenAiAssistant && (
                <button
                  onClick={() => {
                    setIsPopoverOpen(false);
                    onOpenAiAssistant();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Open AI Assistant</span>
                </button>
              )}
              <button
                onClick={() => setIsPopoverOpen(false)}
                className="ml-auto px-4 py-1.5 text-xs font-bold bg-emerald-800 text-white rounded-lg hover:bg-emerald-900 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
