import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Wifi, WifiOff, Signal, CheckCircle2, X } from 'lucide-react';
import useNetworkStatus from '../hooks/useNetworkStatus';
import OfflinePage from './error/OfflinePage';

const BANNER_DURATION = { 'back-online': 3500, slow: 5000 };

const NetworkStatusIndicator = () => {
  const { isOnline, isOffline, wasOffline, isSlowConnection, effectiveType } = useNetworkStatus();

  const [banner, setBanner] = useState(null); // null | 'back-online' | 'slow'
  const [showOfflinePage, setShowOfflinePage] = useState(false);
  const [lastOnlineAt, setLastOnlineAt] = useState(null);
  const timerRef = useRef(null);

  const dismiss = useCallback(() => {
    setBanner(null);
    clearTimeout(timerRef.current);
  }, []);

  // Track last-online timestamp
  useEffect(() => {
    if (isOnline) setLastOnlineAt(new Date().toISOString());
  }, [isOnline]);

  // Show/hide offline overlay
  useEffect(() => {
    if (isOffline) {
      // Small delay so transient blips don't flash the full page
      const t = setTimeout(() => setShowOfflinePage(true), 1200);
      return () => clearTimeout(t);
    } else {
      setShowOfflinePage(false);
    }
  }, [isOffline]);

  // Show back-online or slow banners
  useEffect(() => {
    clearTimeout(timerRef.current);

    if (wasOffline && isOnline) {
      setBanner('back-online');
      timerRef.current = setTimeout(dismiss, BANNER_DURATION['back-online']);
    } else if (isSlowConnection && isOnline) {
      setBanner('slow');
      timerRef.current = setTimeout(dismiss, BANNER_DURATION.slow);
    }

    return () => clearTimeout(timerRef.current);
  }, [isOnline, wasOffline, isSlowConnection, dismiss]);

  if (showOfflinePage) return <OfflinePage lastOnline={lastOnlineAt} />;

  if (!banner) return null;

  const configs = {
    'back-online': {
      icon: CheckCircle2,
      iconClass: 'text-emerald-500',
      wrap: 'bg-white border-emerald-200 shadow-emerald-100',
      bar: 'bg-emerald-500',
      title: 'Bağlantı Kuruldu',
      message: 'İnternet bağlantınız yeniden aktif.',
    },
    slow: {
      icon: Signal,
      iconClass: 'text-amber-500',
      wrap: 'bg-white border-amber-200 shadow-amber-100',
      bar: 'bg-amber-500',
      title: 'Yavaş Bağlantı',
      message: `${effectiveType?.toUpperCase() ?? '2G'} ağ algılandı. Bazı işlemler yavaş çalışabilir.`,
    },
  };

  const cfg = configs[banner];
  const Icon = cfg.icon;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[8000] w-full max-w-sm px-4 sm:px-0"
      role="status"
      aria-live="polite"
    >
      <div className={`relative overflow-hidden flex items-start gap-3 p-4 rounded-2xl border shadow-xl ${cfg.wrap}`}>
        {/* Color accent bar */}
        <div className={`absolute left-0 inset-y-0 w-1 ${cfg.bar} rounded-l-2xl`} />

        <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ml-2 ${cfg.iconClass}`} />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-800">{cfg.title}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{cfg.message}</p>
        </div>

        <button
          onClick={dismiss}
          aria-label="Kapat"
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default NetworkStatusIndicator;
