import React from 'react';
import { RefreshCw, Home, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null, showDetails: false };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    const { hasError, error, errorInfo, showDetails } = this.state;

    if (!hasError) return this.props.children;

    const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">

          {/* Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">

            {/* Top stripe */}
            <div className="h-1.5 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500" />

            <div className="p-8 space-y-6">
              {/* Icon + heading */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-black text-slate-900 tracking-tight">Beklenmeyen Hata</h1>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                    Bir şeyler ters gitti. Verileriniz güvende — sayfayı yenilemeniz yeterli.
                  </p>
                </div>
              </div>

              {/* What to do */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                {[
                  'Sayfayı yenileyin — sorun genellikle geçicidir',
                  'Sorun tekrarlarsa tarayıcı önbelleğini temizleyin',
                  'Bu adımlar işe yaramazsa bize bildirin',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="mt-1 w-4 h-4 rounded-full bg-slate-200 text-slate-500 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-sm text-slate-600">{item}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-black"
                >
                  <RefreshCw className="h-4 w-4" />
                  Yenile
                </button>
                <button
                  onClick={() => { window.location.href = '/'; }}
                  className="btn-ghost flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-black"
                >
                  <Home className="h-4 w-4" />
                  Anasayfa
                </button>
              </div>

              {/* Dev details toggle */}
              {isDev && (
                <div className="border-t border-slate-100 pt-4">
                  <button
                    onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors w-full"
                  >
                    <Terminal className="h-3.5 w-3.5" />
                    <span className="font-mono">Teknik Detaylar</span>
                    {showDetails
                      ? <ChevronUp className="h-3.5 w-3.5 ml-auto" />
                      : <ChevronDown className="h-3.5 w-3.5 ml-auto" />
                    }
                  </button>

                  {showDetails && (
                    <div className="mt-3 bg-slate-950 rounded-xl p-4 space-y-3 text-xs font-mono overflow-x-auto">
                      {error && (
                        <div>
                          <span className="text-red-400 font-bold">{error.toString()}</span>
                        </div>
                      )}
                      {errorInfo?.componentStack && (
                        <pre className="text-slate-400 whitespace-pre-wrap text-[11px] leading-relaxed">
                          {errorInfo.componentStack.trim()}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">
            YourTrainer · Hata otomatik kaydedildi
          </p>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
