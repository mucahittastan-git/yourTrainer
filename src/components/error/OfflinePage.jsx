import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Database, Clock, CloudOff } from 'lucide-react';

const OfflinePage = ({ pendingCount = 0, lastOnline }) => {
  const [dots, setDots] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(t);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const formatLastOnline = () => {
    if (!lastOnline) return null;
    const diff = Date.now() - new Date(lastOnline).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Az önce';
    if (mins < 60) return `${mins} dakika önce`;
    const hours = Math.floor(mins / 60);
    return `${hours} saat önce`;
  };

  const lastOnlineText = formatLastOnline();

  return (
    <div className="fixed inset-0 bg-white/98 backdrop-blur-lg z-[9000] flex items-center justify-center p-6">
      <div className="max-w-sm w-full">

        {/* Icon area */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-slate-200 rounded-[2rem] blur-2xl opacity-50 scale-110" />
            <div className="relative w-28 h-28 bg-slate-50 border-2 border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-1 shadow-sm">
              <WifiOff className="h-10 w-10 text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Çevrimdışı
              </span>
            </div>
            {/* Animated ping */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500" />
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Bağlantı Kesildi
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            İnternet bağlantınız yok{dots} Verileriniz güvende.
          </p>
          {lastOnlineText && (
            <p className="text-xs text-slate-400">Son çevrimiçi: {lastOnlineText}</p>
          )}
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5">
            <Database className="h-4 w-4 text-emerald-500 mb-2" />
            <p className="text-xs font-bold text-emerald-800 mb-0.5">Yerel Depolama</p>
            <p className="text-[11px] text-emerald-600">Tüm veriler güvende</p>
          </div>
          <div className={`border rounded-2xl p-3.5 ${pendingCount > 0 ? 'bg-amber-50 border-amber-100' : 'bg-slate-50 border-slate-100'}`}>
            <Clock className={`h-4 w-4 mb-2 ${pendingCount > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
            <p className={`text-xs font-bold mb-0.5 ${pendingCount > 0 ? 'text-amber-800' : 'text-slate-600'}`}>
              Bekleyen İşlem
            </p>
            <p className={`text-[11px] ${pendingCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {pendingCount > 0 ? `${pendingCount} işlem sıraya alındı` : 'Bekleyen yok'}
            </p>
          </div>
        </div>

        {/* What works offline */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 space-y-2">
          <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3">Çevrimdışı Kullanılabilir</p>
          {[
            'Kayıtlı müşteri verileri',
            'Ders geçmişi ve takibi',
            'Yeni işlem ekleme (sıralama)',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-500">{item}</span>
            </div>
          ))}
        </div>

        {/* Retry */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="w-full btn-primary py-3.5 rounded-2xl flex items-center justify-center gap-2.5 font-black text-sm disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Kontrol ediliyor...' : 'Bağlantıyı Test Et'}
        </button>
      </div>
    </div>
  );
};

export default OfflinePage;
