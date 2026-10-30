import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { UserRole, NyagatareSector } from '../../types/index.ts';
import { NYAGATARE_SECTORS } from '../../data/nyagatare.ts';
import {
  X,
  UserCheck,
  Shield,
  Phone,
  User,
  KeyRound,
  Award,
  Sparkles,
  ArrowRight,
  LogOut,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { t } = useLanguage();
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    login,
    logout,
    loginAsJudge,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('farmer');
  const [selectedSector, setSelectedSector] = useState<NyagatareSector>('Mimuri');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    const name = fullName.trim() || (selectedRole === 'farmer' ? 'Nyagatare Grower' : 'Market Trader');
    login(name, phoneNumber.trim(), selectedRole, selectedSector);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center text-white">
              <Shield className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                {currentUser.isDemo && currentUser.id === 'user_farmer_1'
                  ? 'Access & Identity Portal'
                  : 'User Account'}
              </h3>
              <span className="text-[11px] text-stone-500">AgriBridge Rwanda · Nyagatare</span>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Status */}
        <div className="p-3.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl border border-stone-200 dark:border-stone-700/60 flex items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{currentUser.fullName}</span>
              {currentUser.isDemo ? (
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Demo Profile
                </span>
              ) : (
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Verified User
                </span>
              )}
            </div>
            <div className="text-stone-500 dark:text-stone-400 text-[11px] mt-0.5">
              Role: <strong className="capitalize text-stone-700 dark:text-stone-300">{currentUser.role}</strong> ·{' '}
              {currentUser.phoneNumber} · {currentUser.sector} Sector
            </div>
          </div>

          <button
            onClick={logout}
            className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1 shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* JUDGE DEMONSTRATION FAST-ACCESS */}
        <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800/60 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs">
            <Award className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Dedicated 1-Click Judge Demo Access</span>
          </div>
          <p className="text-[11px] text-emerald-800 dark:text-emerald-400 leading-relaxed">
            Instantly switch personas to evaluate verified permissions, workflows, and calculations without requiring SMS OTP during presentations:
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => loginAsJudge('farmer')}
              className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 font-medium text-stone-800 dark:text-stone-200 hover:border-emerald-600 transition-colors text-left"
            >
              <div className="font-bold text-emerald-800 dark:text-emerald-400">Judge as Farmer</div>
              <div className="text-[10px] text-stone-500">Jean-Damascene (Mimuri)</div>
            </button>

            <button
              onClick={() => loginAsJudge('buyer')}
              className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 font-medium text-stone-800 dark:text-stone-200 hover:border-emerald-600 transition-colors text-left"
            >
              <div className="font-bold text-emerald-800 dark:text-emerald-400">Judge as Buyer</div>
              <div className="text-[10px] text-stone-500">Clarisse (Kigali Millers)</div>
            </button>

            <button
              onClick={() => loginAsJudge('agent')}
              className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 font-medium text-stone-800 dark:text-stone-200 hover:border-emerald-600 transition-colors text-left"
            >
              <div className="font-bold text-emerald-800 dark:text-emerald-400">Judge as Agent</div>
              <div className="text-[10px] text-stone-500">Emmanuel (Rukomo Lead)</div>
            </button>

            <button
              onClick={() => loginAsJudge('admin')}
              className="p-2.5 rounded-lg bg-white dark:bg-stone-800 border border-emerald-300 dark:border-emerald-700 font-medium text-stone-800 dark:text-stone-200 hover:border-emerald-600 transition-colors text-left"
            >
              <div className="font-bold text-emerald-800 dark:text-emerald-400">Judge as Admin</div>
              <div className="text-[10px] text-stone-500">Beata (District Regulator)</div>
            </button>
          </div>
        </div>

        {/* CUSTOM SIGN-IN OR REGISTRATION FORM */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
              {mode === 'signin' ? 'Or Sign In with Phone' : 'Or Register New Account'}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              {mode === 'signin' ? 'Need an account? Register' : 'Existing account? Sign In'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name (Amazina) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Patrick Habineza"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number (MTN / Airtel Rwanda) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+250 788 000 000"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Account Role *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                >
                  <option value="farmer">Smallholder Farmer</option>
                  <option value="buyer">Commodity Buyer</option>
                  <option value="agent">Community Agent</option>
                  <option value="admin">District Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Nyagatare Sector *
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value as NyagatareSector)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                >
                  {NYAGATARE_SECTORS.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} Sector
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{mode === 'signin' ? 'Sign In & Enter Dashboard' : 'Register & Create Profile'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
