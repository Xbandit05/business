import React from 'react';
import { FounderWatermark } from '../common/FounderWatermark.tsx';
import { Sprout, X, Heart, Sparkles, MapPin, ShieldCheck, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AboutFoundersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutFoundersModal: React.FC<AboutFoundersModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="founder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-stone-950/80 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-emerald-100 shadow-xs">
              <Sprout className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h2 id="founder-modal-title" className="text-sm font-bold text-stone-900 dark:text-stone-100">
                AgriBridge Rwanda &middot; Founders &amp; Story
              </h2>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                Growing Together. Connecting Markets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Artistic Botanical Calligraphy Signature Display */}
          <div className="text-center space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 dark:text-emerald-400">
              Official Founder Signature Seal
            </span>
            <FounderWatermark variant="signature-seal" ariaHidden={false} />
            <p className="text-xs text-stone-500 dark:text-stone-400 italic">
              Crafted in botanical calligraphy with indigenous Rwandan foliage flourishes.
            </p>
          </div>

          {/* Founders Story & Vision */}
          <div className="space-y-4 text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                <Leaf className="w-3.5 h-3.5" />
                <span>The Vision Behind AgriBridge Rwanda</span>
              </div>
              <p className="text-xs sm:text-sm">
                Founded with passion by <strong>Idris &amp; Melody</strong>, AgriBridge Rwanda bridges the gap between rural smallholder farmers and modern agricultural value chains. Starting in Nyagatare District and scaling across Rwanda&apos;s agricultural corridors, our mission is to empower farmers with transparent market access, fair pricing, and real-time community agent support.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100">Nyagatare &amp; Beyond</h4>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    Rooted in Eastern Province with coverage expanding across all 30 Rwandan districts.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/50 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100">Farmer-First Integrity</h4>
                  <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                    Ensuring fair prices, prompt digital payments, and verifiable produce tracking.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Founder Outreach Links */}
            <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 block">
                Connect Directly with Founders Idris &amp; Melody
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <a
                  href="https://x.com/intent/tweet?text=Connecting%20with%20Idris%20%26%20Melody%20at%20%40AgriBridgeRw%20Rwanda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-500 text-xs font-medium transition-colors"
                >
                  <div className="w-3.5 h-3.5 rounded-xs bg-emerald-800 flex items-center justify-center text-emerald-200 shrink-0">
                    <Sprout className="w-2.5 h-2.5 text-emerald-300" />
                  </div>
                  <span>Reach on X</span>
                </a>
                <a
                  href="https://www.instagram.com/xbandit._/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-500 text-xs font-medium transition-colors"
                >
                  <div className="w-3.5 h-3.5 rounded-xs bg-emerald-800 flex items-center justify-center text-emerald-200 shrink-0">
                    <Sprout className="w-2.5 h-2.5 text-emerald-300" />
                  </div>
                  <span>@xbandit._</span>
                </a>
                <a
                  href="https://wa.me/250794752281?text=Hello%20Idris%20and%20Melody%20-%20AgriBridge%20Rwanda%20Inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-500 text-xs font-medium transition-colors"
                >
                  <div className="w-3.5 h-3.5 rounded-xs bg-emerald-800 flex items-center justify-center text-emerald-200 shrink-0">
                    <Sprout className="w-2.5 h-2.5 text-emerald-300" />
                  </div>
                  <span>WhatsApp Line</span>
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:border-emerald-500 text-xs font-medium transition-colors"
                >
                  <div className="w-3.5 h-3.5 rounded-xs bg-emerald-800 flex items-center justify-center text-emerald-200 shrink-0">
                    <Sprout className="w-2.5 h-2.5 text-emerald-300" />
                  </div>
                  <span>LinkedIn</span>
                </a>
              </div>
            </div>

            <div className="pt-2 text-center text-xs text-stone-500 dark:text-stone-400">
              <p className="font-medium text-stone-800 dark:text-stone-200">
                “Built with passion by Idris &amp; Melody”
              </p>
              <p className="mt-1 text-[11px]">
                &copy; {new Date().getFullYear()} AgriBridge Rwanda &middot; All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-stone-50 dark:bg-stone-800/50 border-t border-stone-100 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
