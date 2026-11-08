import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { UserPortfolio } from '../../types/index.ts';
import { AgriBridgeBrandIcon } from '../common/AgriBridgeBrandIcon.tsx';
import {
  X,
  Phone,
  Mail,
  Lock,
  KeyRound,
  Briefcase,
  Sprout,
  ShoppingBag,
  Package,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface AccessPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToCreate: () => void;
}

export const AccessPortfolioModal: React.FC<AccessPortfolioModalProps> = ({
  isOpen,
  onClose,
  onSwitchToCreate,
}) => {
  const { language } = useLanguage();
  const { loginWithCredentials, recoverAccount, switchPortfolio, currentUser } = useApp();
  const isRw = language === 'rw';

  // Mode: 'login' | 'select_portfolio' | 'recover'
  const [mode, setMode] = useState<'login' | 'select_portfolio' | 'recover'>('login');

  const [identifier, setIdentifier] = useState('');
  const [passwordOrPin, setPasswordOrPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Multi-portfolio selection state
  const [verifiedPortfolios, setVerifiedPortfolios] = useState<UserPortfolio[]>([]);

  // Recovery state
  const [recoverIdentifier, setRecoverIdentifier] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPin, setNewPin] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage(isRw ? 'Shyiramo nimero ya terefone, imeli cyangwa Portfolio ID.' : 'Please enter your phone number, email, or Portfolio ID.');
      return;
    }

    if (!passwordOrPin.trim()) {
      setErrorMessage(isRw ? 'Shyiramo ijambobanga cyangwa PIN.' : 'Please enter your password or PIN.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginWithCredentials(identifier.trim(), passwordOrPin.trim());

      if (res.success) {
        if (res.portfolios && res.portfolios.length > 1) {
          // Multiple portfolios available: prompt selection
          setVerifiedPortfolios(res.portfolios);
          setMode('select_portfolio');
        } else {
          onClose();
        }
      } else {
        setErrorMessage(
          res.error || (isRw ? 'Amakuru winjije ntabwo ariyo. Nyamuneka ongera ugerageze.' : 'Invalid credentials. Please verify your identifier and PIN/password.')
        );
      }
    } catch {
      setErrorMessage(isRw ? 'Habaye ikibazo cya interineti.' : 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPortfolioAndEnter = (portfolioId: string) => {
    switchPortfolio(portfolioId);
    onClose();
  };

  const handleRecoverSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setRecoverySuccess(null);

    if (!recoverIdentifier.trim() || !newPin.trim()) {
      setErrorMessage(isRw ? 'Uzuza amakuru yose asabwa.' : 'Please fill all recovery fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await recoverAccount(recoverIdentifier.trim(), securityAnswer.trim(), newPin.trim());
      if (res.success) {
        setRecoverySuccess(res.message || (isRw ? 'PIN yahinduwe neza. Ubu ushobora kwinjira.' : 'Password/PIN reset successfully. You can now log in.'));
        setIdentifier(recoverIdentifier);
        setPasswordOrPin(newPin);
        setTimeout(() => {
          setMode('login');
          setRecoverySuccess(null);
        }, 1500);
      } else {
        setErrorMessage(res.error || (isRw ? 'Kuzura byanze. Reba amakuru winjije.' : 'Recovery failed. Please check your recovery answers.'));
      }
    } catch {
      setErrorMessage(isRw ? 'Habaye ikibazo cya interineti.' : 'Network connection issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 dark:bg-stone-950/85 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-800 flex items-center justify-center text-emerald-200 shadow-xs">
              <AgriBridgeBrandIcon className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {mode === 'login' && (isRw ? 'Injira muri Porotifoliye' : 'Access Existing Portfolio')}
                {mode === 'select_portfolio' && (isRw ? 'Hitamo Porotifoliye Ujyamo' : 'Select Active Portfolio')}
                {mode === 'recover' && (isRw ? 'Kugarura Ijambobanga / PIN' : 'Recover Account Access')}
              </h2>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-medium">
                {isRw ? 'Kwinjira kwizewe n\'umutekano' : 'Verified Secure Portfolio Access'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {recoverySuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{recoverySuccess}</span>
            </div>
          )}

          {/* MODE 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
                <span>
                  {isRw
                    ? 'Injiza nimero ya terefone, imeli, cyangwa Portfolio ID yawe (urugero: PF-RW-IDRIS-01) hamwe na PIN/ijambobanga.'
                    : 'Sign in using your registered Phone Number, Email, or Portfolio ID (e.g. PF-RW-IDRIS-01) with your PIN or password.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Nimero ya Terefone / Imeli / Portfolio ID *' : 'Phone / Email / Portfolio ID *'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={isRw ? '+250 788 123 456 cyangwa PF-RW-IDRIS-01' : '+250 788 123 456 or PF-RW-IDRIS-01'}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {isRw ? 'Ijambobanga cyangwa PIN *' : 'Password or PIN *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecoverIdentifier(identifier);
                      setMode('recover');
                    }}
                    className="text-[11px] text-emerald-800 dark:text-emerald-400 hover:underline font-medium cursor-pointer"
                  >
                    {isRw ? 'Wibagiwe PIN?' : 'Forgot PIN / Password?'}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={passwordOrPin}
                    onChange={(e) => setPasswordOrPin(e.target.value)}
                    placeholder={isRw ? 'Injiza PIN yawe (urugero: 1234)' : 'Enter PIN or password (e.g., 1234)'}
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>{isRw ? 'Kugenzura amakuru...' : 'Verifying credentials...'}</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>{isRw ? 'Injira muri Porotifoliye' : 'Verify & Access Portfolio'}</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="text-stone-500">{isRw ? 'Nta porotifoliye urafungura? ' : 'New to AgriBridge? '}</span>
                <button
                  type="button"
                  onClick={onSwitchToCreate}
                  className="text-emerald-800 dark:text-emerald-400 hover:underline font-bold cursor-pointer"
                >
                  {isRw ? 'Fungura Porotifoliye Nshya' : 'Create a New Portfolio'}
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: MULTI-PORTFOLIO SELECTION */}
          {mode === 'select_portfolio' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
                <p className="font-bold text-sm text-stone-900 dark:text-stone-50 mb-0.5">
                  {isRw ? `Murakaza neza, ${currentUser.fullName}` : `Welcome back, ${currentUser.fullName}`}
                </p>
                <p className="text-[11px] text-stone-600 dark:text-stone-400">
                  {isRw
                    ? 'Konti yawe ifite porotifoliye zirenze imwe. Hitamo iyo wifuza gukoresha none:'
                    : 'You have multiple agricultural portfolios associated with your account. Select which workspace to launch:'}
                </p>
              </div>

              <div className="space-y-2.5">
                {verifiedPortfolios.map((port) => (
                  <button
                    key={port.id}
                    type="button"
                    onClick={() => handleSelectPortfolioAndEnter(port.id)}
                    className="w-full p-3.5 rounded-2xl border border-stone-200 dark:border-stone-700 hover:border-emerald-600 bg-white dark:bg-stone-800/80 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-left transition-all shadow-xs group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-xs text-stone-900 dark:text-stone-100 group-hover:text-emerald-900 dark:group-hover:text-emerald-300">
                        {port.name}
                      </span>
                      {port.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                          {isRw ? 'Ibanze' : 'Primary'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                      <span>{port.id}</span>
                      <span>&middot;</span>
                      <span>{port.sector}, {port.district}</span>
                    </div>
                    {port.nicheSpecialty && (
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 font-medium">
                        {port.nicheSpecialty}
                      </p>
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full py-2 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 cursor-pointer"
              >
                {isRw ? 'Guhindura konti' : 'Sign in as a different user'}
              </button>
            </div>
          )}

          {/* MODE 3: RECOVERY */}
          {mode === 'recover' && (
            <form onSubmit={handleRecoverSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-400">
                <span>
                  {isRw
                    ? 'Kugira ngo ugarure PIN cyangwa ijambobanga, injiza terefone yawe n\'igisubizo cy\'ikibazo cy\'umutekano.'
                    : 'To recover access, enter your registered phone number or email, secret security answer, and your new PIN.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Nimero ya Terefone cyangwa Imeli *' : 'Registered Phone or Email *'}
                </label>
                <input
                  type="text"
                  required
                  value={recoverIdentifier}
                  onChange={(e) => setRecoverIdentifier(e.target.value)}
                  placeholder="+250 788 123 456"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'Igisubizo cy\'Ikibazo cy\'Umutekano *' : 'Security Question Answer *'}
                </label>
                <input
                  type="text"
                  required
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder={isRw ? 'Igisubizo wari washizeho (urugero: Mimuri)' : 'Secret answer registered (e.g., Mimuri)'}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {isRw ? 'PIN Nshya cyangwa Ijambobanga Rishya *' : 'New PIN or Password *'}
                </label>
                <input
                  type="password"
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder={isRw ? 'PIN nshya y\'imibare (urugero: 1234)' : 'New PIN or password (e.g., 1234)'}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300 cursor-pointer"
                >
                  {isRw ? 'Hagarika' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (isRw ? 'Guhindura...' : 'Resetting...') : (isRw ? 'Hindura PIN' : 'Reset PIN & Access')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
