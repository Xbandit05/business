import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { AgriBridgeBrandIcon } from './AgriBridgeBrandIcon.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AgriBridge ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 sm:p-8 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-400">
              <AgriBridgeBrandIcon className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
                AgriBridge Rwanda
              </h1>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                Habaye ikibazo gito. Kanda hano munsi kugira ngo urupapuro rwongere rufunguke.
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-500">
                An unexpected display issue occurred. Your data is safe locally on your device.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 text-[11px] text-stone-600 dark:text-stone-400 flex items-start gap-2 text-left">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="break-all">{this.state.error.message}</span>
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Ongera Ufungure / Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
